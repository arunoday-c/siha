"use strict";
import extend from "extend";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import logUtils from "../utils/logging";

const { debugFunction, debugLog } = logUtils;
const {
  whereCondition,
  runningNumberGen,
  releaseDBConnection,
  jsonArrayToObject
} = utils;

let billingCounter = 0;
//created by Nowshad :to save Op Bill Cancellation data
let addCreidtSettlement = (req, res, next) => {
  debugFunction("addCreidtSettlement");
  billingCounter = billingCounter + 1;
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputParam = extend({}, req.body);

    inputParam.reciept_header_id = req.records.receipt_header_id;
    inputParam.hospital_id = 1;

    let connection = req.connection;

    return new Promise((resolve, reject) => {
      runningNumberGen({
        db: connection,
        counter: billingCounter,
        module_desc: ["OP_CRD"],
        onFailure: error => {
          reject(error);
        },
        onSuccess: result => {
          resolve(result);
        }
      });
    }).then(result => {
      let documentCode = result[0].completeNumber;
      debugLog("documentCode:", documentCode);

      connection.query(
        "INSERT INTO hims_f_credit_header ( credit_number, credit_date, patient_id, reciept_amount, write_off_amount,\
          hospital_id,recievable_amount, remarks, reciept_header_id,transaction_type, write_off_account,\
          created_by, created_date) \
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          documentCode,
          inputParam.credit_date != null
            ? new Date(inputParam.credit_date)
            : inputParam.credit_date,
          inputParam.patient_id,
          inputParam.reciept_amount,
          inputParam.write_off_amount,
          inputParam.hospital_id,
          inputParam.recievable_amount,
          inputParam.remarks,
          inputParam.reciept_header_id,
          inputParam.transaction_type,
          inputParam.write_off_account,
          inputParam.created_by,
          new Date()
        ],
        (error, headerResult) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          debugLog(" pos header id :", headerResult);

          if (headerResult.insertId != null) {
            debugLog("Billing Header ", headerResult.insertId);

            const insurtColumns = [
              "bill_header_id",
              "include",
              "bill_date",
              "credit_amount",
              "receipt_amount",
              "balance_amount",
              "previous_balance",
              "bill_amount"
            ];

            connection.query(
              "INSERT INTO hims_f_credit_detail(" +
                insurtColumns.join(",") +
                ", credit_header_id) VALUES ?",
              [
                jsonArrayToObject({
                  sampleInputObject: insurtColumns,
                  arrayObj: inputParam.criedtdetails,
                  newFieldToInsert: [headerResult.insertId],
                  req: req
                })
              ],
              (error, detailsRecords) => {
                if (error) {
                  debugLog("error: ", error);
                  releaseDBConnection(db, connection);
                  next(error);
                }

                req.records = {
                  credit_number: documentCode,
                  hims_f_credit_header_id: headerResult.insertId,
                  receipt_number: req.records.receipt_number
                };
                releaseDBConnection(db, connection);
                next();
              }
            );
          } else {
            releaseDBConnection(db, connection);
            next(error);
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

let getCreidtSettlement = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let connection = req.connection;

    connection.query(
      "SELECT *, bh.reciept_header_id as cal_receipt_header_id FROM hims_f_credit_header bh \
      inner join hims_f_patient as PAT on bh.patient_id = PAT.hims_d_patient_id \
      where  bh.credit_number='" +
        req.query.credit_number +
        "'",

      (error, headerResult) => {
        if (error) {
          releaseDBConnection(db, connection);
          next(error);
        }

        debugLog("result: ", headerResult);
        if (headerResult.length != 0) {
          debugLog(
            "hims_f_credit_header_id: ",
            headerResult[0].hims_f_credit_header_id
          );
          connection.query(
            "select * from hims_f_credit_detail bh inner join hims_f_billing_header as bill on \
            bh.bill_header_id = bill.hims_f_billing_header_id where credit_header_id=?",
            headerResult[0].hims_f_credit_header_id,
            (error, criedtdetails) => {
              if (error) {
                releaseDBConnection(db, connection);
                next(error);
              }
              req.records = {
                ...headerResult[0],
                ...{ criedtdetails },
                ...{
                  hims_f_receipt_header_id:
                    headerResult[0].cal_receipt_header_id
                }
              };
              releaseDBConnection(db, connection);
              next();
              debugLog("Billing Result: ", req.records);
            }
          );
        } else {
          req.records = headerResult;
          releaseDBConnection(db, connection);
          next();
        }
      }
    );
    // });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to Update PO Entry
let updateOPBilling = (req, res, next) => {
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  let connection = req.connection;
  let inputParam = extend({}, req.body);

  let details = inputParam.criedtdetails;
  let qry = "";
  for (let i = 0; i < details.length; i++) {
    debugLog("bill_header_id: ", details[i].bill_header_id);
    let balance_credit =
      details[i].previous_balance - details[i].receipt_amount;

    qry +=
      " UPDATE `hims_f_billing_header` SET balance_credit='" +
      balance_credit +
      "' WHERE hims_f_billing_header_id='" +
      details[i].bill_header_id +
      "';";
  }
  debugLog("qry: ", qry);
  if (qry != "") {
    connection.query(qry, (error, result) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }
      req.data = result;
      next();
    });
  } else {
    releaseDBConnection(db, connection);
    req.records = {};
    next();
  }
};

//Created by nowshad to get the bills which has creidt amount
let getPatientwiseBill = (req, res, next) => {
  let whereStatement = {
    patient_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let where = whereCondition(extend(whereStatement, req.query));
      connection.query(
        "SELECT * from hims_f_billing_header  \
           WHERE record_status='A' AND balance_credit>0 AND" +
          where.condition +
          " order by hims_f_billing_header_id desc",
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

export default {
  addCreidtSettlement,
  getCreidtSettlement,
  updateOPBilling,
  getPatientwiseBill
};
