"use strict";
import {
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject,
  runningNumberGen
} from "../../utils";
import extend from "extend";
import httpStatus from "../../utils/httpStatus";
import { debugLog } from "../../utils/logging";
import moment from "moment";
import { LINQ } from "node-linq";

import { updateIntoItemLocation } from "./commonFunction";
import Promise from "bluebird";

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

        return new Promise((resolve, reject) => {
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
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id
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
                      releaseDBConnection(db, connection);
                      req.records = {
                        document_number: documentCode,
                        hims_f_pharmacy_stock_header_id: headerResult.insertId,
                        year: year,
                        period: period
                      };
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
                releaseDBConnection(db, connection);
                next();
              }
            );
          } else {
            releaseDBConnection(db, connection);
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
  let initialStock = {
    posted: null,
    updated_by: req.userIdentity.algaeh_d_app_user_id
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

      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }
        return new Promise((resolve, reject) => {
          let inputParam = extend(initialStock, req.body);

          debugLog("posted", inputParam.posted);
          debugLog("pharmacy_stock_detail", req.body.pharmacy_stock_detail);
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
              debugLog("error", error);
              releaseDBConnection(db, connection);
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
        })
          .then(output => {
            return (
              new Promise((resolve, reject) => {
                debugLog("output", output);
                req.options = {
                  db: connection,
                  onFailure: error => {
                    reject(error);
                  },
                  onSuccess: result => {
                    resolve(result);
                  }
                };

                updateIntoItemLocation(req, res, next);
              })
                // .then(itemoutput => {
                //   return new Promise((resolve, reject) => {
                //     req.options = {
                //       db: connection,
                //       onFailure: error => {
                //         reject(error);
                //       },
                //       onSuccess: result => {
                //         resolve(result);
                //       }
                //     };
                //     debugLog("insertItemHistory", "insertItemHistory");
                //     insertItemHistory(req, res, next);
                //   })
                //Data
                // })
                .then(records => {
                  connection.commit(error => {
                    if (error) {
                      releaseDBConnection(db, connection);
                      next(error);
                    }
                    releaseDBConnection(db, connection);
                    req.records = records;
                    next();
                  });
                })
                .catch(error => {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                })
            );
          })
          .catch(error => {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          });
      });
    });
  } catch (e) {
    next(e);
  }
};

let insertintoItemLocation = (req, res, next) => {
  let db = req.options == null ? req.db : req.options.db;
  try {
    debugLog("inputParam", "inputParam");

    let inputParam = extend({}, req.body);
    debugLog("inputParam", inputParam);
    let newstockDtls = new LINQ(inputParam.pharmacy_stock_detail)
      .Select(s => {
        return {
          item_id: s.item_id,
          pharmacy_location_id: s.location_id,
          item_location_status: "A",
          batchno: s.batchno,
          expirydt: s.expiry_date,
          barcode: s.barcode,
          qtyhand: s.quantity,
          cost_uom: s.uom_id,
          avgcost: s.unit_cost,
          item_type: "P",
          grnno: s.grn_number,
          sales_uom: s.sales_uom,
          created_by: req.userIdentity.algaeh_d_app_user_id,
          created_date: new Date(),
          updated_by: req.userIdentity.algaeh_d_app_user_id,
          updated_date: new Date()
        };
      })
      .ToArray();

    debugLog("befor Detail Insert Data", newstockDtls);

    let colms = [
      "item_id",
      "pharmacy_location_id",
      "item_location_status",
      "batchno",
      "expirydt",
      "barcode",
      "qtyhand",
      "cost_uom",
      "avgcost",
      "item_type",
      "grnno",
      "sales_uom",
      "created_by",
      "created_date",
      "updated_by",
      "updated_date"
    ];
    db.query(
      "INSERT  INTO hims_m_item_location (" + colms.join(",") + ") VALUES ? ",
      [
        jsonArrayToObject({
          sampleInputObject: colms,
          arrayObj: newstockDtls,
          req: req
        })
      ],
      (error, detailResult) => {
        debugLog("error", detailResult);
        if (error) {
          if (req.options == null) {
            db.rollback(() => {
              releaseDBConnection(req.db, db);
              next(error);
            });
          } else {
            req.options.onFailure(error);
          }
        }

        if (req.options == null) {
          req.records = detailResult;
          releaseDBConnection(db, connection);
          next();
        } else {
          req.options.onSuccess(detailResult);
        }
      }
    );
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addPharmacyInitialStock,
  getPharmacyInitialStock,
  updatePharmacyInitialStock
};
