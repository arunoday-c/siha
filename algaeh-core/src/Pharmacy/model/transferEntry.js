"use strict";
import utils from "../../utils";
import extend from "extend";
import httpStatus from "../../utils/httpStatus";
import logUtils from "../../utils/logging";
import moment from "moment";
// import { getBillDetailsFunctionality } from "../../model/billing";
import comModels from "./commonFunction";
import Promise from "bluebird";

const { updateIntoItemLocation } = comModels;
const { debugLog } = logUtils;
const {
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject,
  runningNumberGen
} = utils;

//created by Nowshad: to Insert Requisition Entry
let addtransferEntry = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    debugLog("Requisition: ", "add Requisition");
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
            module_desc: ["TRAN_NUM"],
            onFailure: error => {
              reject(error);
            },
            onSuccess: result => {
              resolve(result);
            }
          });
        }).then(result => {
          let documentCode = result[0].completeNumber;
          //   debugLog("connection", JSON.stringify(connection));
          debugLog("documentCode:", documentCode);

          let year = moment().format("YYYY");
          debugLog("onlyyear:", year);

          let today = moment().format("YYYY-MM-DD");
          debugLog("today:", today);

          let month = moment().format("MM");
          debugLog("month:", month);
          let period = month;

          connection.query(
            "INSERT INTO `hims_f_pharmacy_transfer_header` (transfer_number,transfer_date,`year`,period,\
                hims_f_pharamcy_material_header_id,from_location_type,from_location_id, material_requisition_number, to_location_id, \
                to_location_type, description, completed, completed_date, completed_lines, \
                transfer_quantity,requested_quantity,recieved_quantity,outstanding_quantity, \
                cancelled, cancelled_by,cancelled_date) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              documentCode,
              today,
              year,
              period,
              input.hims_f_pharamcy_material_header_id,
              input.from_location_type,
              input.from_location_id,
              input.material_requisition_number,
              input.to_location_id,
              input.to_location_type,
              input.description,
              input.completed,
              input.completed_date,
              input.completed_lines,
              input.transfer_quantity,
              input.requested_quantity,
              input.recieved_quantity,
              input.outstanding_quantity,
              input.cancelled,
              input.cancelled_by,
              input.cancelled_date
            ],
            (error, headerResult) => {
              debugLog("error: ", "Check");
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }

              debugLog(" pos header id :", headerResult);

              if (headerResult.insertId != null) {
                const insurtColumns = [
                  "item_id",
                  "item_category_id",
                  "item_group_id",
                  "batchno",
                  "expiry_date",
                  "to_qtyhand",
                  "from_qtyhand",
                  "quantity_requested",
                  "quantity_authorized",
                  "uom_requested_id",
                  "quantity_transferred",
                  "uom_transferred_id",
                  "quantity_recieved",
                  "uom_recieved_id",
                  "quantity_outstanding",
                  "transfer_to_date",
                  "grnno",
                  "unit_cost",
                  "sales_uom",
                  "material_requisition_header_id",
                  "material_requisition_detail_id"
                ];

                connection.query(
                  "INSERT INTO hims_f_pharmacy_transfer_detail(" +
                    insurtColumns.join(",") +
                    ",transfer_header_id) VALUES ?",
                  [
                    jsonArrayToObject({
                      sampleInputObject: insurtColumns,
                      arrayObj: req.body.pharmacy_stock_detail,
                      newFieldToInsert: [headerResult.insertId],
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
                        transfer_number: documentCode,
                        hims_f_pharmacy_transfer_header_id:
                          headerResult.insertId,
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

//created by Nowshad: to get Pharmacy Requisition Entry
let gettransferEntry = (req, res, next) => {
  let selectWhere = {
    transfer_number: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "SELECT * from  hims_f_pharmacy_transfer_header\
          where " +
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
              "hims_f_pharmacy_transfer_header_id: ",
              headerResult[0].hims_f_pharmacy_transfer_header_id
            );
            connection.query(
              "select * from hims_f_pharmacy_transfer_detail where transfer_header_id=?",
              headerResult[0].hims_f_pharmacy_transfer_header_id,
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
            req.records = headerResult;
            releaseDBConnection(db, connection);
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to Post Requisition Entry
let updatetransferEntry = (req, res, next) => {
  let TransferEntry = {
    completed: null,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

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
      return new Promise((resolve, reject) => {
        let inputParam = extend(TransferEntry, req.body);

        debugLog("completed", inputParam.completed);
        debugLog("pharmacy_stock_detail", req.body.pharmacy_stock_detail);
        connection.query(
          "UPDATE `hims_f_pharmacy_transfer_header` SET `completed`=?, `completed_date`=? \
          WHERE `hims_f_pharmacy_transfer_header_id`=?",
          [
            inputParam.completed,
            new Date(),
            inputParam.hims_f_pharmacy_transfer_header_id
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
          return new Promise((resolve, reject) => {
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
            //Update From Location
            debugLog("From", "Data");
            updateIntoItemLocation(req, res, next);
          });
        })
        .then(output => {
          return new Promise((resolve, reject) => {
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
            //Update To location
            for (let i = 0; i < req.body.pharmacy_stock_detail.length; i++) {
              req.body.pharmacy_stock_detail[i].location_id =
                req.body.to_location_id;
              req.body.pharmacy_stock_detail[i].location_type =
                req.body.to_location_type;

              req.body.pharmacy_stock_detail[i].sales_uom =
                req.body.pharmacy_stock_detail[i].uom_transferred_id;

              delete req.body.pharmacy_stock_detail[i].operation;
            }

            debugLog("To ", "Data");
            updateIntoItemLocation(req, res, next);
          })

            .then(records => {
              req.records = records;
              next();
              // connection.commit(error => {
              //   if (error) {
              //     releaseDBConnection(db, connection);
              //     next(error);
              //   }
              //   req.records = records;
              //   releaseDBConnection(db, connection);
              //   next();
              // });
            })
            .catch(error => {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            });
        })
        .catch(error => {
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

//created by Nowshad: to get Pharmacy Requisition Entry to transfer
let getrequisitionEntryTransfer = (req, res, next) => {
  let selectWhere = {
    material_requisition_number: "ALL"
  };
  let RequisitionEntry = {
    material_requisition_number: null,
    from_location_id: null
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    // let where = whereCondition(extend(selectWhere, req.query));
    let inputParam = extend(RequisitionEntry, req.query);

    debugLog("inputParam: ", inputParam);
    db.getConnection((error, connection) => {
      connection.query(
        "SELECT * from  hims_f_pharamcy_material_header \
            where material_requisition_number=?",
        [inputParam.material_requisition_number],
        (error, headerResult) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          debugLog("result: ", headerResult);
          if (headerResult.length != 0) {
            debugLog(
              "hims_f_pharamcy_material_header_id: ",
              headerResult[0].hims_f_pharamcy_material_header_id
            );
            debugLog("from_location_id: ", inputParam.from_location_id);

            debugLog("to_location_id: ", headerResult[0].to_location_id);
            connection.query(
              "select * from hims_f_pharmacy_material_detail p left outer join hims_m_item_location l \
                on l.item_id =p.item_id where pharmacy_header_id=? and l.record_status='A'and l.pharmacy_location_id=? \
                and l.expirydt > now() and l.qtyhand>0  order by l.expirydt asc limit 0,1",
              [
                headerResult[0].hims_f_pharamcy_material_header_id,
                headerResult[0].to_location_id
              ],
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
            req.records = headerResult;
            releaseDBConnection(db, connection);
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

export default {
  addtransferEntry,
  gettransferEntry,
  updatetransferEntry,
  getrequisitionEntryTransfer
};
