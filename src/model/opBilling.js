"use strict";
import extend from "extend";
import {
  whereCondition,
  runningNumberGen,
  releaseDBConnection
} from "../utils";
import httpStatus from "../utils/httpStatus";
import { debugFunction, debugLog } from "../utils/logging";
import { addBillData, newReceiptData } from "../model/billing";
import { LINQ } from "node-linq";
//import { insertLadOrderedServices } from "../model/laboratory";

let billingCounter = 0;
//created by irfan :to save opbilling data
let addOpBIlling = (req, res, next) => {
  debugFunction("addOpBIlling");
  billingCounter = billingCounter + 1;
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    debugLog("db:", req.db);
    if (req.query["data"] != null) {
      req.query = JSON.parse(req.query["data"]);
      req.body = req.query;
    }

    let connection = req.connection;
    connection.beginTransaction(error => {
      if (error) {
        connection.rollback(() => {
          releaseDBConnection(db, connection);
          next(error);
        });
      }
      debugFunction("updateFrontDesk Promise");
      return new Promise((resolve, reject) => {
        runningNumberGen({
          db: connection,
          counter: billingCounter,
          module_desc: ["PAT_BILL", "RECEIPT"],
          onFailure: error => {
            reject(error);
          },
          onSuccess: result => {
            resolve(result);
          }
        });
      })
        .then(output => {
          let receipt = new LINQ(output)
            .Where(w => w.module_desc == "RECEIPT")
            .FirstOrDefault();
          req.body.receipt_number = receipt.completeNumber;

          return new Promise((resolve, reject) => {
            debugLog("Inside Receipts");

            req.options = {
              db: connection,
              onFailure: error => {
                reject(error);
              },
              onSuccess: result => {
                resolve(result);
              }
            };

            newReceiptData(req, res, next);
          }).then(billOutput => {
            debugLog("Orver all records number gen", output);
            debugLog("Data: ", output);

            req.query.receipt_header_id = billOutput.insertId;
            req.body.receipt_header_id = billOutput.insertId;

            let bill = new LINQ(output)
              .Where(w => w.module_desc == "PAT_BILL")
              .FirstOrDefault();

            debugLog("Data: ", bill);
            req.bill_number = bill.completeNumber;
            req.body.bill_number = bill.completeNumber;
            return new Promise((resolve, reject) => {
              debugLog("Inside Billing");
              delete req["options"]["onFailure"];
              delete req["options"]["onSuccess"];
              req.options = {
                db: connection,
                onFailure: error => {
                  reject(error);
                },
                onSuccess: result => {
                  resolve(result);
                }
              };
              //Bill generation
              addBillData(req, res, next);
            }).then(receiptData => {
              req.records = receiptData;
              if (billingCounter != 0) billingCounter = billingCounter - 1;
              releaseDBConnection(db, connection);
              next();
            });
          });
        })

        .catch(error => {
          if (billingCounter != 0) billingCounter = billingCounter - 1;
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        });
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
    let connection = req.connection;
    // db.getConnection((error, connection) => {
    //   if (error) {
    //     next(error);
    //   }
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

      //===========
      // SELECT * FROM hims_f_billing_header INNER JOIN hims_f_billing_details ON \
      //         hims_f_billing_header.hims_f_billing_header_id=hims_f_billing_details.hims_f_billing_header_id \
      //         inner join hims_f_patient as PAT on hims_f_billing_header.patient_id = PAT.hims_d_patient_id \
      //         where hims_f_billing_header.record_status='A' AND hims_f_billing_header.bill_number

      "SELECT * FROM hims_f_billing_header bh INNER JOIN hims_f_billing_details bd  ON\
      bh.hims_f_billing_header_id=bd.hims_f_billing_header_id\
      inner join hims_f_patient as PAT on bh.patient_id = PAT.hims_d_patient_id\
      inner join hims_f_patient_visit as vst on bh.visit_id = vst.hims_f_patient_visit_id\
      where bh.record_status='A' AND bh.bill_number='" +
        req.query.bill_number +
        "'",

      (error, result) => {
        if (error) {
          releaseDBConnection(db, connection);
          next(error);
        }
        req.records = result;
        releaseDBConnection(db, connection);
        next();
      }
    );
    // });
  } catch (e) {
    next(e);
  }
};

let getPednigBills = (req, res, next) => {
  let selectWhere = {
    visit_id: "ALL",
    patient_id: "ALL",
    visit_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    req.query["date(S.created_date)"] = req.query.created_date;
    delete req.query.created_date;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let where = whereCondition(extend(selectWhere, req.query));
      connection.query(
        "SELECT  S.patient_id, S.visit_id, S.insurance_yesno, P.patient_code,P.full_name FROM hims_f_ordered_services S,hims_f_patient P  \
       WHERE S.record_status='A' AND S.billed='N' AND P.hims_d_patient_id=S.patient_id AND" +
          where.condition,
        where.values,
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
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

module.exports = { addOpBIlling, selectBill, getPednigBills };
