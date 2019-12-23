import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

export function getSalesQuotation(req, res, next) {
  const _mysql = new algaehMysql();
  // const utilities = new algaehUtilities();
  try {
    console.log("getSalesQuotation: ")
    _mysql
      .executeQuery({
        query:
          "SELECT SQ.*, C.vat_percentage from hims_f_sales_quotation SQ, hims_d_customer C  \
          where SQ.customer_id = C.hims_d_customer_id and SQ.sales_quotation_number=?",
        values: [req.query.sales_quotation_number],
        printQuery: true
      })
      .then(headerResult => {
        if (headerResult.length != 0) {
          let strQuery = "";

          if (headerResult[0].sales_quotation_mode == "I") {
            strQuery = mysql.format(
              "select QI.*, IM.item_description, IU.uom_description from hims_f_sales_quotation_items QI \
                inner join hims_d_inventory_item_master IM on IM.hims_d_inventory_item_master_id = QI.item_id \
                inner join hims_d_inventory_uom IU on IU.hims_d_inventory_uom_id = QI.uom_id where sales_quotation_id=?",
              [headerResult[0].hims_f_sales_quotation_id]
            );
          } else if (headerResult[0].sales_quotation_mode == "S") {
            strQuery = mysql.format(
              "select QS.*, S.service_name from hims_f_sales_quotation_services QS \
                inner join hims_d_services S on S.hims_d_services_id = QS.services_id where sales_quotation_id=?;",
              [headerResult[0].hims_f_sales_quotation_id]
            );
          }
          _mysql
            .executeQuery({
              query: strQuery,
              printQuery: true
            })
            .then(qutation_detail => {
              _mysql.releaseConnection();
              req.records = {
                ...headerResult[0],
                ...{ qutation_detail }
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
                                  payment_terms, service_terms, other_terms, sub_total, discount_amount, net_total, \
                                  total_tax, net_payable, narration, created_date, created_by, updated_date, \
                                  updated_by, hospital_id)\
                          values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            values: [
              sales_quotation_number,
              new Date(),
              input.sales_quotation_mode,
              input.reference_number,
              input.customer_id,
              input.quote_validity,

              input.sales_man,
              input.payment_terms,
              input.service_terms,
              input.other_terms,
              input.sub_total,
              input.discount_amount,
              input.net_total,
              input.total_tax,
              input.net_payable,
              input.narration,
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
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = {
                      sales_quotation_number: sales_quotation_number,
                      hims_f_sales_quotation_id: headerResult.insertId
                    };
                    return next();
                  });
                })
                .catch(error => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            } else if (input.sales_quotation_services.length > 0) {
              IncludeValues = [
                "services_id",
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
                    return next();
                  });
                })
                .catch(error => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
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