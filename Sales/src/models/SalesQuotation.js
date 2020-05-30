import algaehMysql from "algaeh-mysql";
import mysql from "mysql";
import _ from "lodash";

export function getSalesQuotation(req, res, next) {
  const _mysql = new algaehMysql();
  // const utilities = new algaehUtilities();
  try {
    console.log("getSalesQuotation: ", req.query.HRMNGMT_Active)
    let strQuery = ""
    if (req.query.HRMNGMT_Active === "true") {
      strQuery = "SELECT SQ.*, C.customer_name, E.full_name as employee_name from hims_f_sales_quotation SQ \
      inner join  hims_d_customer C on  SQ.customer_id = C.hims_d_customer_id \
      inner join  hims_d_employee E on  SQ.sales_person_id = E.hims_d_employee_id \
      where SQ.sales_quotation_number =? "
    } else {
      strQuery = "SELECT SQ.*, C.customer_name from hims_f_sales_quotation SQ \
          inner join  hims_d_customer C on  SQ.customer_id = C.hims_d_customer_id \
          where SQ.sales_quotation_number =? "
    }
    _mysql
      .executeQuery({
        query: strQuery,
        values: [req.query.sales_quotation_number],
        printQuery: true
      })
      .then(headerResult => {
        if (headerResult.length != 0) {

          _mysql
            .executeQuery({
              query: "select QI.*, IM.item_description, IU.uom_description from hims_f_sales_quotation_items QI \
              inner join hims_d_inventory_item_master IM on IM.hims_d_inventory_item_master_id = QI.item_id \
              inner join hims_d_inventory_uom IU on IU.hims_d_inventory_uom_id = QI.uom_id where sales_quotation_id=?;\
              select QS.*, S.service_name from hims_f_sales_quotation_services QS \
              inner join hims_d_services S on S.hims_d_services_id = QS.services_id where sales_quotation_id=?;",
              values: [headerResult[0].hims_f_sales_quotation_id, headerResult[0].hims_f_sales_quotation_id],
              printQuery: true
            })
            .then(qutation_detail => {
              let sales_quotation_items = qutation_detail[0]
              let sales_quotation_services = qutation_detail[1]
              _mysql.releaseConnection();
              req.records = {
                ...headerResult[0],
                ...{ sales_quotation_items },
                ...{ sales_quotation_services }
              };
              next();
            })
            .catch(error => {
              _mysql.releaseConnection();
              next(error);
            });
        } else {
          _mysql.releaseConnection();
          req.records = headerResult;
          next();
        }
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
export function addSalesQuotation(req, res, next) {
  const _mysql = new algaehMysql();

  try {
    let input = req.body;
    let sales_quotation_number = "";
    // const utilities = new algaehUtilities();
    // utilities.logger().log("addDeliveryNoteEntry: ");

    _mysql
      .generateRunningNumber({
        user_id: req.userIdentity.algaeh_d_app_user_id,
        numgen_codes: ["SALES_QUOTE"],
        table_name: "hims_f_sales_numgen"
      })
      .then(generatedNumbers => {
        sales_quotation_number = generatedNumbers.SALES_QUOTE;

        _mysql
          .executeQuery({
            query:
              "INSERT INTO hims_f_sales_quotation (sales_quotation_number, sales_quotation_date, \
                      sales_quotation_mode, reference_number, customer_id, quote_validity, sales_man, \
                      payment_terms, sales_person_id, narration, delivery_date, no_of_days_followup, \
                      terms_conditions, quote_items_status, quote_services_status, created_date, created_by, updated_date, updated_by, hospital_id)\
              values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            values: [
              sales_quotation_number,
              new Date(),
              input.sales_quotation_mode,
              input.reference_number,
              input.customer_id,
              input.quote_validity,

              input.sales_man,
              input.payment_terms,
              input.sales_person_id,
              input.narration,
              input.delivery_date,
              input.no_of_days_followup,
              input.terms_conditions,
              input.quote_items_status,
              input.quote_services_status,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              req.userIdentity.hospital_id
            ],
            printQuery: true
          })
          .then(headerResult => {
            console.log("headerResult", headerResult);
            let IncludeValues = [];
            if (input.sales_quotation_items.length > 0) {
              InsertSalesItemService({
                input: input,
                _mysql: _mysql,
                next: next,
                headerResult: headerResult
              })
                .then(insert_item_list => {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = {
                      sales_quotation_number: sales_quotation_number,
                      hims_f_sales_quotation_id: headerResult.insertId
                    };
                    next();
                  });
                })
                .catch(error => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            } else {
              if (input.sales_quotation_services.length > 0) {
                IncludeValues = [
                  "services_id",
                  "service_frequency",
                  "unit_cost",
                  "quantity",
                  "extended_cost",
                  "discount_percentage",
                  "discount_amount",
                  "net_extended_cost",
                  "tax_percentage",
                  "tax_amount",
                  "total_amount",
                  "comments"
                ];

                _mysql
                  .executeQuery({
                    query:
                      "INSERT INTO hims_f_sales_quotation_services(??) VALUES ?",
                    values: input.sales_quotation_services,
                    includeValues: IncludeValues,
                    extraValues: {
                      sales_quotation_id: headerResult.insertId
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: true
                  })
                  .then(detailResult => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = {
                        sales_quotation_number: sales_quotation_number,
                        hims_f_sales_quotation_id: headerResult.insertId
                      };
                      next();
                    });
                  })
                  .catch(error => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              }
            }

          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
};


export function getSalesQuotationList(req, res, next) {
  const _mysql = new algaehMysql();
  // const utilities = new algaehUtilities();
  try {
    console.log("getSalesQuotation: ")
    let _strAppend = ""
    if (
      req.query.from_date != "null" &&
      req.query.from_date != "" &&
      req.query.from_date != null &&
      req.query.to_date != "null" &&
      req.query.to_date != "" &&
      req.query.to_date != null
    ) {
      _strAppend += ` and date(sales_quotation_date)
      between date('${req.query.from_date}') and date('${req.query.to_date}') `;
    }

    if (req.query.customer_id > 0) {
      _strAppend += ` and customer_id= '${req.query.customer_id}'`
    }

    if (req.query.sales_quotation_number !== null && req.query.sales_quotation_number !== undefined) {
      _strAppend += ` and sales_quotation_number= '${req.query.sales_quotation_number}'`
    }

    if (req.query.sales_person_id !== null && req.query.sales_person_id !== undefined) {
      _strAppend += ` and sales_person_id= ${req.query.sales_person_id}`
    }

    _mysql
      .executeQuery({
        query:
          "SELECT SQ.*, C.customer_name, E.full_name from hims_f_sales_quotation SQ \
          inner join hims_d_customer C on SQ.customer_id = C.hims_d_customer_id \
          left join hims_d_employee E on SQ.sales_person_id = E.hims_d_employee_id   \
          where 1=1 " + _strAppend + " order by hims_f_sales_quotation_id desc",
        printQuery: true
      })
      .then(headerResult => {

        _mysql.releaseConnection();
        req.records = headerResult;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

export function updateSalesQuotation(req, res, next) {
  const _mysql = new algaehMysql();
  // const utilities = new algaehUtilities();
  try {

    let strQuery = ""

    const inputParam = req.body;
    if (inputParam.update_type === "ED") {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_f_sales_quotation SET quote_validity=?, sales_man=?, \
                  payment_terms=?, sales_person_id=?, narration=?, delivery_date=?, no_of_days_followup=?, \
                  terms_conditions=?, updated_date=?, updated_by=? where hims_f_sales_quotation_id=?",
          values: [
            inputParam.quote_validity,
            inputParam.sales_man,
            inputParam.payment_terms,
            inputParam.sales_person_id,
            inputParam.narration,
            inputParam.delivery_date,
            inputParam.no_of_days_followup,
            inputParam.terms_conditions,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.hims_f_sales_quotation_id
          ],
          printQuery: true
        })
        .then(headerResult => {

          let items_data = []
          let services_data = []
          if (inputParam.sales_quotation_items.length > 0) {
            // items_data = inputParam.sales_quotation_items.filter(f => f.hims_f_sales_quotation_items_id === undefined);
            items_data = _.filter(
              inputParam.sales_quotation_items,
              (f) => {
                return (
                  f.hims_f_sales_quotation_items_id === null ||
                  f.hims_f_sales_quotation_items_id === undefined
                );
              }
            );
          }
          if (inputParam.sales_quotation_services.length > 0) {
            // services_data = inputParam.sales_quotation_services.filter(f => f.hims_f_sales_quotation_items_id === null);
            services_data = _.filter(
              inputParam.sales_quotation_services,
              (f) => {
                return (
                  f.hims_f_sales_quotation_services_id === null ||
                  f.hims_f_sales_quotation_services_id === undefined
                );
              }
            );
          }

          let strQry = ""

          if (inputParam.detele_services.length > 0) {
            strQry += mysql.format(
              "DELETE FROM hims_f_sales_quotation_services where hims_f_sales_quotation_services_id in (?);",
              [inputParam.detele_services]
            );
          }
          if (inputParam.detele_items.length > 0) {
            strQry += mysql.format(
              "DELETE FROM hims_f_sales_quotation_items where hims_f_sales_quotation_items_id in (?);",
              [inputParam.detele_items]
            );
          }

          if (items_data.length > 0) {
            UpdateItemServiceComb({
              sales_quotation_items: items_data,
              sales_quotation_services: services_data,
              hims_f_sales_quotation_id: inputParam.hims_f_sales_quotation_id,
              _mysql: _mysql,
              strQry: strQry,
              next: next
            })
              .then(insert_item_list => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = {
                    sales_quotation_number: inputParam.sales_quotation_number,
                    hims_f_sales_quotation_id: inputParam.hims_f_sales_quotation_id
                  };
                  next();
                });
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else if (services_data.length > 0) {
            let IncludeValues = [
              "services_id",
              "service_frequency",
              "unit_cost",
              "quantity",
              "extended_cost",
              "discount_percentage",
              "discount_amount",
              "net_extended_cost",
              "tax_percentage",
              "tax_amount",
              "total_amount"
            ];

            _mysql
              .executeQuery({
                query:
                  "INSERT INTO hims_f_sales_quotation_services(??) VALUES ?;" + strQry,
                values: services_data,
                includeValues: IncludeValues,
                extraValues: {
                  sales_quotation_id: inputParam.hims_f_sales_quotation_id
                },
                bulkInsertOrUpdate: true,
                printQuery: true
              })
              .then(detailResult => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = {
                    sales_quotation_number: inputParam.sales_quotation_number,
                    hims_f_sales_quotation_id: inputParam.hims_f_sales_quotation_id
                  };
                  next();
                });
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          } else {
            if (strQry === "") {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = {
                  sales_quotation_number: inputParam.sales_quotation_number,
                  hims_f_sales_quotation_id: inputParam.hims_f_sales_quotation_id
                };
                next();
              });
              return
            }
            _mysql
              .executeQuery({
                query: strQry,
                printQuery: true
              })
              .then(headerResult => {

                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = {
                    sales_quotation_number: inputParam.sales_quotation_number,
                    hims_f_sales_quotation_id: inputParam.hims_f_sales_quotation_id
                  };
                  next();
                });
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          }
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } else {
      if (inputParam.cancelled === "Y") {
        strQuery += mysql.format(
          "UPDATE hims_f_sales_quotation set qotation_status='CL', updated_by=?, updated_date=? \
          WHERE hims_f_sales_quotation_id=?",
          [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_f_sales_quotation_id
          ]
        );
      } else {
        strQuery += mysql.format(
          "UPDATE hims_f_sales_quotation set comments=? , updated_by=?, updated_date=? \
          WHERE hims_f_sales_quotation_id=?",
          [
            inputParam.comments,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_f_sales_quotation_id
          ]
        );
      }
      _mysql
        .executeQuery({
          query: strQuery,
          printQuery: true
        })
        .then(headerResult => {

          _mysql.releaseConnection();
          req.records = headerResult;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    }

  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

export function transferSalesQuotation(req, res, next) {
  const _mysql = new algaehMysql();
  // const utilities = new algaehUtilities();
  try {

    _mysql
      .executeQuery({
        query:
          "update hims_f_sales_quotation set sales_person_id=? where hims_f_sales_quotation_id=?",
        values: [req.body.sales_person_id, req.body.hims_f_sales_quotation_id],
        printQuery: true
      })
      .then(headerResult => {

        _mysql.releaseConnection();
        req.records = headerResult;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};


function InsertSalesItemService(options) {
  return new Promise((resolve, reject) => {
    try {
      let input = options.input;
      let _mysql = options._mysql;
      let headerResult = options.headerResult

      let IncludeValues = [];
      IncludeValues = [
        "item_id",
        "uom_id",
        "unit_cost",
        "quantity",
        "extended_cost",
        "discount_percentage",
        "discount_amount",
        "net_extended_cost",
        "tax_percentage",
        "tax_amount",
        "total_amount"
      ];

      _mysql
        .executeQuery({
          query:
            "INSERT INTO hims_f_sales_quotation_items(??) VALUES ?",
          values: input.sales_quotation_items,
          includeValues: IncludeValues,
          extraValues: {
            sales_quotation_id: headerResult.insertId
          },
          bulkInsertOrUpdate: true,
          printQuery: true
        })
        .then(detailResult => {
          if (input.sales_quotation_services.length > 0) {
            IncludeValues = [
              "services_id",
              "service_frequency",
              "unit_cost",
              "quantity",
              "extended_cost",
              "discount_percentage",
              "discount_amount",
              "net_extended_cost",
              "tax_percentage",
              "tax_amount",
              "total_amount"
            ];

            _mysql
              .executeQuery({
                query:
                  "INSERT INTO hims_f_sales_quotation_services(??) VALUES ?",
                values: input.sales_quotation_services,
                includeValues: IncludeValues,
                extraValues: {
                  sales_quotation_id: headerResult.insertId
                },
                bulkInsertOrUpdate: true,
                printQuery: true
              })
              .then(detailResult => {
                resolve();
              })
              .catch(error => {
                reject(error);
              });
          } else {
            resolve();
          }

        })
        .catch(error => {
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    options.next(e);
  });
}

function UpdateItemServiceComb(options) {
  return new Promise((resolve, reject) => {
    try {
      console.log("UpdateItemServiceComb")
      const sales_quotation_services = options.sales_quotation_services;
      const sales_quotation_items = options.sales_quotation_items;
      const hims_f_sales_quotation_id = options.hims_f_sales_quotation_id;
      let _mysql = options._mysql;
      let strQry = options.strQry

      let IncludeValues = [];
      IncludeValues = [
        "item_id",
        "uom_id",
        "unit_cost",
        "quantity",
        "extended_cost",
        "discount_percentage",
        "discount_amount",
        "net_extended_cost",
        "tax_percentage",
        "tax_amount",
        "total_amount"
      ];

      _mysql
        .executeQuery({
          query:
            "INSERT INTO hims_f_sales_quotation_items(??) VALUES ?;" + strQry,
          values: sales_quotation_items,
          includeValues: IncludeValues,
          extraValues: {
            sales_quotation_id: hims_f_sales_quotation_id
          },
          bulkInsertOrUpdate: true,
          printQuery: true
        })
        .then(detailResult => {
          if (sales_quotation_services.length > 0) {
            IncludeValues = [
              "services_id",
              "service_frequency",
              "unit_cost",
              "quantity",
              "extended_cost",
              "discount_percentage",
              "discount_amount",
              "net_extended_cost",
              "tax_percentage",
              "tax_amount",
              "total_amount"
            ];

            _mysql
              .executeQuery({
                query:
                  "INSERT INTO hims_f_sales_quotation_services(??) VALUES ?",
                values: sales_quotation_services,
                includeValues: IncludeValues,
                extraValues: {
                  sales_quotation_id: hims_f_sales_quotation_id
                },
                bulkInsertOrUpdate: true,
                printQuery: true
              })
              .then(detailResult => {
                resolve();
              })
              .catch(error => {
                reject(error);
              });
          } else {
            resolve();
          }

        })
        .catch(error => {
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    options.next(e);
  });
}
