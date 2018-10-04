"use strict";
import {
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject,
  runningNumberGen
} from "../../utils";
import extend from "extend";
import httpStatus from "../../utils/httpStatus";
import { logger, debugFunction, debugLog } from "../../utils/logging";
import moment from "moment";

//created by irfan: to pharmacy_intial_stock
let addPharmacyInitialStock = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    debugLog("inside", "add stock");
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

        let requestCounter = 1;

        new Promise((resolve, reject) => {
          runningNumberGen({
            db: connection,
            counter: requestCounter,
            module_desc: ["STK_DOC"],
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

          let year = moment().format("YYYY");
          debugLog("onlyyear:", year);

          let today = moment().format("YYYY-MM-DD");
          debugLog("today:", today);

          let month = moment().format("MM");
          debugLog("month:", month);
          let period = month;

          debugLog("period:", period);
          connection.query(
            "INSERT INTO `hims_f_pharmacy_stock_header` (document_number,docdate,`year`,period,description,posted,created_date,created_by,updated_date,updated_by) \
            VALUE(?,?,?,?,?,?,?,?,?,?)",
            [
              documentCode,
              today,
              year,
              period,
              input.description,
              input.posted,
              new Date(),
              input.created_by,
              new Date(),
              input.updated_by
            ],
            (error, headerResult) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }

              debugLog(" stock header id :", headerResult.insertId);

              if (headerResult.insertId != null) {
                const insurtColumns = [
                  "item_id",
                  "location_type",
                  "location_id",
                  "item_category_id",
                  "item_group_id",
                  "uom_id",
                  "barcode",
                  "batchno",
                  "sales_uom",
                  "expiry_date",
                  "grn_number",
                  "quantity",
                  "conversion_fact",
                  "unit_cost",
                  "extended_cost",
                  "comment",
                  "created_by",
                  "updated_by"
                ];

                connection.query(
                  "INSERT INTO hims_f_pharmacy_stock_detail(" +
                    insurtColumns.join(",") +
                    ",pharmacy_stock_header_id,created_date,updated_date) VALUES ?",
                  [
                    jsonArrayToObject({
                      sampleInputObject: insurtColumns,
                      arrayObj: req.body.pharmacy_stock_detail,
                      newFieldToInsert: [
                        headerResult.insertId,
                        new Date(),
                        new Date()
                      ],
                      req: req
                    })
                  ],
                  (error, detailResult) => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }

                    connection.commit(error => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      req.records = { document_number: documentCode };
                      next();
                    });
                  }
                );
              } else {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
            }
          );
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get PharmacyInitialStock
let getPharmacyInitialStock = (req, res, next) => {
  let selectWhere = {
    document_number: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "SELECT hims_f_pharmacy_stock_header_id, document_number, docdate, year,\
          period, description, posted  from  hims_f_pharmacy_stock_header\
          where record_status='A' AND " +
          where.condition,
        where.values,
        (error, headerResult) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          debugLog("result: ", headerResult);
          if (headerResult.length != 0) {
            debugLog(
              "hims_f_pharmacy_stock_header_id: ",
              headerResult[0].hims_f_pharmacy_stock_header_id
            );
            connection.query(
              "select * from hims_f_pharmacy_stock_detail where pharmacy_stock_header_id=? and record_status='A'",
              headerResult[0].hims_f_pharmacy_stock_header_id,
              (error, pharmacy_stock_detail) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }
                req.records = {
                  ...headerResult[0],
                  ...{ pharmacy_stock_detail }
                };
                next();
              }
            );
          } else {
            req.records = headerResult;
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

let updatePharmacyInitialStock = (req, res, next) => {
  let visitType = {
    posted: "Y",
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(visitType, req.body);
    connection.query(
      "UPDATE `hims_f_pharmacy_stock_header` SET `posted`=?, `updated_by`=?, `updated_date`=? \
       WHERE `record_status`='A' and `hims_f_pharmacy_stock_header_id`=?",
      [
        inputParam.posted,
        inputParam.updated_by,
        new Date(),
        inputParam.hims_f_pharmacy_stock_header_id
      ],
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
};

module.exports = {
  addPharmacyInitialStock,
  getPharmacyInitialStock,
  updatePharmacyInitialStock
};
