"use strict";
import utils from "../utils";
import extend from "extend";
import httpStatus from "../utils/httpStatus";
import logUtils from "../utils/logging";

const { releaseDBConnection, runningNumber, jsonArrayToObject } = utils;
const { debugFunction, debugLog } = logUtils;

//created by Nowshad: to get Pharmacy POS Entry
let getReceiptEntry = (req, res, next) => {
  let selectWhere = {
    pos_number: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    debugLog("Records: ", req.records);

    let connection = req.connection;
    let hims_f_receipt_header_id =
      req.records.hims_f_receipt_header_id || req.records[0].receipt_header_id;

    debugLog("hims_f_receipt_header_id: ", hims_f_receipt_header_id);
    // PH.recieve_amount
    connection.query(
      "select * from hims_f_receipt_header where hims_f_receipt_header_id=? and record_status='A'",
      hims_f_receipt_header_id,
      (error, headerResult) => {
        if (error) {
          releaseDBConnection(db, connection);
          next(error);
        }

        debugLog("result: ", headerResult);
        if (headerResult.length != 0) {
          debugLog(
            "hims_f_receipt_header_id: ",
            headerResult[0].hims_f_receipt_header_id
          );
          connection.query(
            "select * from hims_f_receipt_details where hims_f_receipt_header_id=? and record_status='A'",
            headerResult[0].hims_f_receipt_header_id,
            (error, receiptdetails) => {
              if (error) {
                releaseDBConnection(db, connection);
                next(error);
              }
              req.receptEntry = {
                ...headerResult[0],
                ...{ receiptdetails }
              };
              releaseDBConnection(db, connection);
              next();
              debugLog("Receipt Result: ", req.receptEntry);
            }
          );
        } else {
          req.records = headerResult;
          releaseDBConnection(db, connection);
          next();
        }
      }
    );
  } catch (e) {
    next(e);
  }
};

//created by:irfan, Patient-receipt if advance or  Refund to patient
let ReceiptPaymentInsert = (req, res, next) => {
  let P_receiptHeaderModel = {
    hims_f_receipt_header_id: null,
    receipt_number: null,
    receipt_date: null,
    billing_header_id: null,
    total_amount: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id,

    record_status: null,
    counter_id: null,
    shift_id: null,
    pay_type: null
  };

  debugFunction("Receipt POS and Sales");

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let connection = req.connection;
    connection.beginTransaction(error => {
      if (error) {
        connection.rollback(() => {
          releaseDBConnection(db, connection);
          next(error);
        });
      }

      let inputParam = extend(P_receiptHeaderModel, req.body);

      // fuction for advance recieved from patient
      if (inputParam.pay_type == "R") {
        runningNumber(req.db, 5, "PAT_RCPT", (error, numgenId, newNumber) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }
          req.query.receipt_number = newNumber;
          req.body.receipt_number = newNumber;
          inputParam.receipt_number = newNumber;
          debugLog("new R for recpt number:", newNumber);
          // receipt header table insert
          connection.query(
            "INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, billing_header_id, total_amount,\
              created_by, created_date, updated_by, updated_date,  counter_id, shift_id, pay_type) VALUES (?,?,?\
              ,?,?,?,?,?,?,?,?)",
            [
              inputParam.receipt_number,
              new Date(),
              inputParam.billing_header_id,
              inputParam.total_amount,
              inputParam.created_by,
              new Date(),
              inputParam.updated_by,
              new Date(),
              inputParam.counter_id,
              inputParam.shift_id,
              inputParam.pay_type
            ],
            (error, headerRcptResult) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }

              debugFunction("inside header result");
              if (
                headerRcptResult.insertId != null &&
                headerRcptResult.insertId != ""
              ) {
                const receptSample = [
                  "card_check_number",
                  "expiry_date",
                  "pay_type",
                  "amount",
                  "created_by",
                  "updated_by",
                  "card_type"
                ];

                connection.query(
                  "INSERT  INTO hims_f_receipt_details ( " +
                    receptSample.join(",") +
                    ",hims_f_receipt_header_id) VALUES ? ",
                  [
                    jsonArrayToObject({
                      sampleInputObject: receptSample,
                      arrayObj: inputParam.receiptdetails,
                      req: req,
                      newFieldToInsert: [headerRcptResult.insertId]
                    })
                  ],
                  (error, RcptDetailsRecords) => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }
                    debugFunction("inside details result");
                    req.records = {
                      receipt_header_id: headerRcptResult.insertId,
                      receipt_number: inputParam.receipt_number
                    };
                    releaseDBConnection(db, connection);
                    next();

                    debugLog("Records: ", req.records);
                  }
                );
              } else {
                debugLog("Data is not inerted to billing header");
                releaseDBConnection(db, connection);
                connection.rollback(() => {
                  next(
                    httpStatus.generateError(
                      httpStatus.badRequest,
                      "Technical issue while Sale Retun"
                    )
                  );
                });
              }
            }
          );
        });
      }

      //function for payment to the patient
      if (inputParam.pay_type == "P") {
        runningNumber(req.db, 7, "PYMNT_NO", (error, numgenId, newNumber) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }
          debugLog("new PAYMENT no : ", newNumber);
          inputParam.receipt_number = newNumber;
          req.body.receipt_number = newNumber;

          //R-->recieved amount   P-->payback amount

          // receipt header table insert
          connection.query(
            "INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, billing_header_id, total_amount,\
                created_by, created_date, updated_by, updated_date,  counter_id, shift_id, pay_type) VALUES (?,?,?\
                ,?,?,?,?,?,?,?,?)",
            [
              inputParam.receipt_number,
              new Date(),
              inputParam.billing_header_id,
              inputParam.total_amount,
              inputParam.created_by,
              new Date(),
              inputParam.updated_by,
              new Date(),
              inputParam.counter_id,
              inputParam.shift_id,
              inputParam.pay_type
            ],
            (error, headerRcptResult) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }

              debugFunction("inside header result");
              debugLog("Insert : ", inputParam.receiptdetails);
              if (
                headerRcptResult.insertId != null &&
                headerRcptResult.insertId != ""
              ) {
                // receipt details table insert
                const receptSample = [
                  "card_check_number",
                  "expiry_date",
                  "pay_type",
                  "amount",
                  "created_by",
                  "updated_by",
                  "card_type"
                ];
                connection.query(
                  "INSERT  INTO hims_f_receipt_details ( " +
                    receptSample.join(",") +
                    ",hims_f_receipt_header_id) VALUES ? ",
                  [
                    jsonArrayToObject({
                      sampleInputObject: receptSample,
                      arrayObj: inputParam.receiptdetails,
                      req: req,
                      newFieldToInsert: [headerRcptResult.insertId]
                    })
                  ],
                  (error, RcptDetailsRecords) => {
                    debugLog("Error : ", error);
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }
                    debugFunction("inside details result");
                    req.records = {
                      receipt_header_id: headerRcptResult.insertId,
                      receipt_number: inputParam.receipt_number
                    };
                    releaseDBConnection(db, connection);
                    next();

                    debugLog("Records: ", req.records);
                  }
                );
              } else {
                debugLog("Data is not inerted to billing header");
                releaseDBConnection(db, connection);
                connection.rollback(() => {
                  next(
                    httpStatus.generateError(
                      httpStatus.badRequest,
                      "Technical issue while Sale Retun"
                    )
                  );
                });
              }
            }
          );
        }); //end of runing number PYMNT
      }
    });
  } catch (e) {
    next(e);
  }
};

export default {
  getReceiptEntry,
  ReceiptPaymentInsert
};
