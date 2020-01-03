import algaehMysql from "algaeh-mysql";

export function getSalesQuotation(req, res, next) {
  const _mysql = new algaehMysql();
  // const utilities = new algaehUtilities();
  try {
    console.log("getSalesQuotation: ", req.query.HRMNGMT_Active)
    let strQuery = ""
    if (req.query.HRMNGMT_Active) {
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
        modules: ["SALES_QUOTE"],
        tableName: "hims_f_sales_numgen",
        identity: {
          algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
          hospital_id: req.userIdentity.hospital_id
        }
      })
      .then(generatedNumbers => {
        sales_quotation_number = generatedNumbers[0];

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

    _mysql
      .executeQuery({
        query:
          "SELECT SQ.*, C.customer_name from hims_f_sales_quotation SQ, hims_d_customer C  \
          where SQ.customer_id = C.hims_d_customer_id " + _strAppend + " order by hims_f_sales_quotation_id desc",
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

    _mysql
      .executeQuery({
        query:
          "update hims_f_sales_quotation set comments=? where hims_f_sales_quotation_id=?",
        values: [req.body.comments, req.body.hims_f_sales_quotation_id],
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
