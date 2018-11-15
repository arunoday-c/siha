"use strict";
import { whereCondition, releaseDBConnection } from "../utils";
import extend from "extend";
import httpStatus from "../utils/httpStatus";
import { debugFunction, debugLog } from "../utils/logging";

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
    // PH.recieve_amount
    connection.query(
      "select * from hims_f_receipt_header where hims_f_receipt_header_id=? and record_status='A'",
      req.records.hims_f_receipt_header_id,
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

module.exports = {
  getReceiptEntry
};
