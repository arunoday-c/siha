"use strict";
import utils from "../../utils";
import extend from "extend";
import httpStatus from "../../utils/httpStatus";
import logUtils from "../../utils/logging";
import moment, { now } from "moment";
import { LINQ } from "node-linq";
import Promise from "bluebird";

const { debugLog } = logUtils;
const {
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject,
  runningNumberGen
} = utils;

//created by Nowshad: to save Delivery Note Entry
let addDeliveryNoteEntry = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    debugLog("DeliveryNoteEntry: ", "Delivery Note Entry");
    let connection = req.connection;

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
          module_desc: ["DN_NUM"],
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
          "INSERT INTO `hims_f_procurement_dn_header` (delivery_note_number,dn_date,dn_type,dn_from, pharmcy_location_id,\
              inventory_location_id,location_type,vendor_id, purchase_order_id, from_multiple_purchase_orders, \
              payment_terms, comment, sub_total, detail_discount, extended_total,sheet_level_discount_percent, \
              sheet_level_discount_amount,description,net_total,total_tax, net_payable, created_by,created_date, \
              updated_by,updated_date) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            documentCode,
            today,
            input.dn_type,
            input.dn_from,
            input.pharmcy_location_id,
            input.inventory_location_id,
            input.location_type,
            input.vendor_id,
            input.purchase_order_id,
            input.from_multiple_purchase_orders,
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
            input.net_payable,

            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date()
          ],
          (error, headerResult) => {
            if (error) {
              debugLog("error: ", "Check");
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }

            debugLog(" pos header id :", headerResult);

            if (headerResult.insertId != null) {
              const insurtColumns = [
                "phar_item_category",
                "phar_item_group",
                "phar_item_id",
                "inv_item_category_id",
                "inv_item_group_id",
                "inv_item_id",
                "po_quantity",
                "dn_quantity",
                "quantity_outstanding",
                "pharmacy_uom_id",
                "inventory_uom_id",
                "unit_cost",
                "extended_cost",
                "discount_percentage",
                "discount_amount",
                "net_extended_cost",
                "tax_percentage",
                "tax_amount",
                "total_amount",
                "item_type",
                "quantity_recieved_todate",
                "batchno_expiry_required",
                "batchno",
                "expiry_date",
                "purchase_order_header_id",
                "purchase_order_detail_id"
              ];

              connection.query(
                "INSERT INTO hims_f_procurement_dn_detail(" +
                  insurtColumns.join(",") +
                  ",hims_f_procurement_dn_header_id) VALUES ?",
                [
                  jsonArrayToObject({
                    sampleInputObject: insurtColumns,
                    arrayObj: req.body.dn_entry_detail,
                    newFieldToInsert: [headerResult.insertId],
                    req: req
                  })
                ],
                (error, detailResult) => {
                  if (error) {
                    debugLog("Error: ", error);

                    connection.rollback(() => {
                      debugLog("Roll Back: ", error);
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  req.records = {
                    delivery_note_number: documentCode,
                    hims_f_procurement_dn_header_id: headerResult.insertId
                  };
                  next();
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
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to get DeliveryNoteEntry
let getDeliveryNoteEntry = (req, res, next) => {
  let selectWhere = {
    delivery_note_number: "ALL"
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
        "SELECT * from  hims_f_procurement_dn_header\
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
              "hims_f_procurement_dn_header_id: ",
              headerResult[0].hims_f_procurement_dn_header_id
            );
            connection.query(
              "select * from hims_f_procurement_dn_detail where hims_f_procurement_dn_header_id=?",
              headerResult[0].hims_f_procurement_dn_header_id,
              (error, dn_entry_detail) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }
                req.records = {
                  ...headerResult[0],
                  ...{ dn_entry_detail }
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

let updateDeliveryNoteEntry = (req, res, next) => {
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
        debugLog("req.body: ", req.body);

        connection.query(
          "UPDATE `hims_f_procurement_po_header` SET `authorize1`=?, `authorize_by_date`=?, `authorize_by_1`=? \
      WHERE `hims_f_procurement_po_header_id`=?",
          [
            inputParam.authorize1,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
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
              let details = inputParam.dn_entry_detail;

              let qry = "";

              for (let i = 0; i < details.length; i++) {
                qry +=
                  " UPDATE `hims_f_procurement_po_detail` SET authorize_quantity='" +
                  details[i].authorize_quantity +
                  "',rejected_quantity='" +
                  details[i].rejected_quantity +
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
let getAuthPurchaseList = (req, res, next) => {
  let selectWhere = {
    pharmcy_location_id: null,
    inventory_location_id: null
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

    if (inputParam.pharmcy_location_id !== null) {
      strQuery =
        strQuery +
        " and pharmcy_location_id = " +
        inputParam.pharmcy_location_id;
    }
    if (inputParam.inventory_location_id !== null) {
      strQuery =
        strQuery +
        " and inventory_location_id = " +
        inputParam.inventory_location_id;
    }
    // if (inputParam.authorize1 !== null) {
    //   strQuery = strQuery + " and authorize1 = '" + inputParam.authorize1 + "'";
    // }
    // if (inputParam.authorie2 !== null) {
    //   strQuery = strQuery + " and authorie2 = '" + inputParam.authorie2 + "'";
    // }

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

//created by Nowshad: to Update PO Entry
let updatePOEntry = (req, res, next) => {
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  let connection = req.connection;
  let inputParam = extend({}, req.body);
  let complete = "Y";
  const partial_recived = new LINQ(inputParam.dn_entry_detail)
    .Where(w => w.quantity_outstanding != 0)
    .ToArray();

  if (partial_recived.length > 0) {
    complete = "N";
  }

  connection.query(
    "UPDATE `hims_f_procurement_po_header` SET `is_completed`=?, `completed_date`=?, `updated_by` = ?,`updated_date` = ? \
      WHERE `hims_f_procurement_po_header_id`=?",
    [
      complete,
      new Date(),
      req.userIdentity.algaeh_d_app_user_id,
      new Date(),
      inputParam.purchase_order_id
    ],
    (error, result) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      if (result != "" && result != null) {
        let details = inputParam.dn_entry_detail;

        let qry = "";

        for (let i = 0; i < details.length; i++) {
          qry +=
            " UPDATE `hims_f_procurement_po_detail` SET quantity_outstanding='" +
            details[i].quantity_outstanding +
            "' WHERE hims_f_procurement_po_detail_id='" +
            details[i].purchase_order_detail_id +
            "';";
        }
        debugLog("qry: ", qry);

        if (qry != "") {
          connection.query(qry, (error, detailResult) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            req.porecords = detailResult;

            next();
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
};

export default {
  addDeliveryNoteEntry,
  getDeliveryNoteEntry,
  updateDeliveryNoteEntry,
  getAuthPurchaseList,
  updatePOEntry
};
