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

import Promise from "bluebird";

//created by Nowshad: to save Purchase Order Entry
let addPurchaseOrderEntry = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    debugLog("PurchaseOrderEntry: ", "Purchase Order Entry");
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
            module_desc: ["PO_NUM"],
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

          let today = moment().format("YYYY-MM-DD");
          debugLog("today:", today);

          connection.query(
            "INSERT INTO `hims_f_procurement_po_header` (purchase_number,po_date,po_type,\
              po_from, pharmcy_location_id,inventory_location_id,location_type,expected_date,on_hold, requisition_id, \
                from_multiple_requisition, payment_terms, comment, sub_total, detail_discount, extended_total,sheet_level_discount_percent, \
                sheet_level_discount_amount,description,net_total,total_tax, created_by,created_date, \
                updated_by,updated_date) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              documentCode,
              today,
              input.po_type,
              input.po_from,
              input.pharmcy_location_id,
              input.inventory_location_id,
              input.location_type,
              input.expected_date,
              input.on_hold,
              input.requisition_id,
              input.from_multiple_requisition,
              input.payment_terms,
              input.comment,
              input.sub_total,
              input.detail_discount,
              input.extended_total,
              input.sheet_level_discount_percent,
              input.sheet_level_discount_amount,
              input.description,

              input.net_total,
              input.total_tax,

              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date()
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
                  "item_uom",
                  "to_qtyhand",
                  "from_qtyhand",
                  "quantity_required"
                ];

                connection.query(
                  "INSERT INTO hims_f_procurement_po_detail(" +
                    insurtColumns.join(",") +
                    ",pharmacy_header_id) VALUES ?",
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
                        material_requisition_number: documentCode
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

//created by Nowshad: to get PurchaseOrderEntry
let getPurchaseOrderEntry = (req, res, next) => {
  let selectWhere = {
    material_requisition_number: "ALL",
    from_location_id: "ALL",
    to_location_id: "ALL",
    authorize1: "ALL",
    authorie2: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    debugLog("where", where);
    db.getConnection((error, connection) => {
      connection.query(
        "SELECT * from  hims_f_procurement_po_header\
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
              "hims_f_procurement_po_header_id: ",
              headerResult[0].hims_f_procurement_po_header_id
            );
            connection.query(
              "select * from hims_f_procurement_po_detail where pharmacy_header_id=?",
              headerResult[0].hims_f_procurement_po_header_id,
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

let updatePurchaseOrderEntry = (req, res, next) => {
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
        let inputParam = extend({}, req.body);

        connection.query(
          "UPDATE `hims_f_procurement_po_header` SET `authorize1`=?, `authorize1_date`=?, `authorize1_by`=?, \
      `authorie2`=?, `authorize2_date`=?, `authorize2_by`=? \
      WHERE `hims_f_procurement_po_header_id`=?",
          [
            inputParam.authorize1,
            new Date(),
            inputParam.updated_by,
            inputParam.authorie2,
            new Date(),
            inputParam.updated_by,
            inputParam.hims_f_procurement_po_header_id
          ],
          (error, result) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }

            if (result !== "" && result != null) {
              let details = inputParam.pharmacy_stock_detail;

              let qry = "";

              for (let i = 0; i < details.length; i++) {
                qry +=
                  " UPDATE `hims_f_procurement_po_detail` SET pharmacy_header_id='" +
                  details[i].pharmacy_header_id +
                  "',completed='" +
                  details[i].completed +
                  "',item_category_id='" +
                  details[i].item_category_id +
                  "',item_group_id='" +
                  details[i].item_group_id +
                  "',item_id='" +
                  details[i].item_id +
                  "',quantity_required='" +
                  details[i].quantity_required +
                  "',quantity_authorized='" +
                  details[i].quantity_authorized +
                  "',item_uom='" +
                  details[i].item_uom +
                  "',quantity_recieved='" +
                  (details[i].quantity_recieved || 0) +
                  "',quantity_outstanding='" +
                  (details[i].quantity_outstanding || 0) +
                  "' WHERE hims_f_procurement_po_detail_id='" +
                  details[i].hims_f_procurement_po_detail_id +
                  "';";
              }

              if (qry != "") {
                connection.query(qry, (error, detailResult) => {
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
                    req.records = detailResult;
                    next();
                  });
                });
              } else {
                releaseDBConnection(db, connection);
                req.records = {};
                next();
              }
            } else {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                req.records = {};
                next();
              });
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to get Pharmacy Requisition Entry
let getAuthrequisitionList = (req, res, next) => {
  let selectWhere = {
    from_location_id: null,
    to_location_id: null,
    authorize1: null,
    authorie2: null
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let inputParam = extend(selectWhere, req.query);

    let strQuery =
      "SELECT * from  hims_f_procurement_po_header\
    where cancelled='N' ";

    if (inputParam.from_location_id !== null) {
      strQuery =
        strQuery + " and from_location_id = " + inputParam.from_location_id;
    }
    if (inputParam.to_location_id !== null) {
      strQuery =
        strQuery + " and to_location_id = " + inputParam.to_location_id;
    }
    if (inputParam.authorize1 !== null) {
      strQuery = strQuery + " and authorize1 = '" + inputParam.authorize1 + "'";
    }
    if (inputParam.authorie2 !== null) {
      strQuery = strQuery + " and authorie2 = '" + inputParam.authorie2 + "'";
    }

    debugLog("strQuery", strQuery);
    db.getConnection((error, connection) => {
      connection.query(
        strQuery,

        (error, headerResult) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          debugLog("result: ", headerResult);
          req.records = headerResult;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addPurchaseOrderEntry,
  getPurchaseOrderEntry,
  updatePurchaseOrderEntry,
  getAuthrequisitionList
};
