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
                next
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

module.exports = { addOpBIlling };
