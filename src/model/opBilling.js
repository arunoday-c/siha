"use strict";
import extend from "extend";
import {
  selectStatement,
  paging,
  whereCondition,
  deleteRecord,
  releaseDBConnection
} from "../utils";
import httpStatus from "../utils/httpStatus";
import { logger, debugFunction, debugLog } from "../utils/logging";
import { addBill, newReceipt } from "../model/billing";
//created by irfan :to save opbilling data
let addOpBIlling = (req, res, next) => {
  debugFunction("addOpBIlling");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        //add bill
        addBill(
          connection,
          req,
          res,
          (error, result) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }

            if (result != null && result.length != 0) {
              req.query.billing_header_id = result.insertId;
              req.body.billing_header_id = result.insertId;

              debugLog("  req.body.billing_header_id:" + result["insertId"]);

              newReceipt(
                connection,
                req,
                res,
                (error, resultdata) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }
                  connection.commit(error => {
                    releaseDBConnection(db, connection);
                    if (error) {
                      connection.rollback(() => {
                        next(error);
                      });
                    }
                    req.records = result;
                    next();
                  });

                  debugLog("succes result of query 4 : ", resultdata);
                },
                next()
              );
            }
          },

          next
        );
      });
      //bign tr
    });
  } catch (e) {
    next(e);
  }
};

let selectBill = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      // let where = whereCondition(extend(selectWhere, req.query));
      connection.query(
        //   "SELECT  `hims_f_billing_header_id`, `patient_id`, `billing_type_id`, `visit_id`, `bill_number`,\
        //   'incharge_or_provider`,`bill_date`,`advance_amount`,`advance_adjust`,`discount_amount`,`sub_total_amount`,\
        //   `total_tax`,`net_total`,`billing_status`,`copay_amount`,`deductable_amount`,`sec_copay_amount`,\
        //   `sec_deductable_amount`,`gross_total`,`sheet_discount_amount`,`sheet_discount_percentage`,`net_amount`,\
        //   `patient_res`,`company_res`,`sec_company_res`,`patient_payable`,`company_payable`,`sec_company_payable`,\
        //   `patient_tax`,`company_tax`,`sec_company_tax`,`net_tax`,`credit_amount`,`receiveable_amount' \
        //   FROM `hims_f_billing_header` \
        //  WHERE `record_status`='A' AND " +

        "SELECT * FROM hims_f_billing_header INNER JOIN hims_f_billing_details ON \
        hims_f_billing_header.hims_f_billing_header_id=hims_f_billing_details.hims_f_billing_header_id \
        where hims_f_billing_header.record_status='A' AND hims_f_billing_header.bill_number = '" +
          req.query.bill_number +
          "'",

        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { addOpBIlling, selectBill };
