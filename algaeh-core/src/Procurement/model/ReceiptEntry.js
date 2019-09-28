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

//created by Nowshad: to save Receipt Entry
let addReceiptEntry = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    debugLog("ReceiptEntry: ", "Delivery Note Entry");
    let connection = req.connection;

    let requestCounter = 1;

    return new Promise((resolve, reject) => {
      runningNumberGen({
        db: connection,
        counter: requestCounter,
        module_desc: ["RE_NUM"],
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

      let year = moment().format("YYYY");
      debugLog("onlyyear:", year);

      let period = moment().format("MM");
      debugLog("period:", period);

      connection.query(
        "INSERT INTO `hims_f_procurement_grn_header` (grn_number,grn_date, grn_for, `year`, period, pharmcy_location_id,\
              inventory_location_id,location_type,vendor_id, po_id, dn_id, payment_terms, comment, description, sub_total, \
              detail_discount, extended_total,sheet_level_discount_percent, sheet_level_discount_amount,\
              net_total,total_tax, net_payable, additional_cost,reciept_total, created_by,created_date, \
              updated_by,updated_date) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          documentCode,
          today,
          input.grn_for,
          year,
          period,
          input.pharmcy_location_id,
          input.inventory_location_id,
          input.location_type,
          input.vendor_id,
          input.po_id,
          input.dn_id,

          input.payment_terms,
          input.comment,
          input.description,
          input.sub_total,
          input.detail_discount,
          input.extended_total,
          input.sheet_level_discount_percent,
          input.sheet_level_discount_amount,

          input.net_total,
          input.total_tax,
          input.net_payable,
          input.additional_cost,
          input.reciept_total,

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
              "recieved_quantity",
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
              "batchno_expiry_required",
              "batchno",
              "expiry_date"
            ];

            connection.query(
              "INSERT INTO hims_f_procurement_grn_detail(" +
                insurtColumns.join(",") +
                ",grn_header_id) VALUES ?",
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
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }

                req.records = {
                  grn_number: documentCode,
                  hims_f_procurement_grn_header_id: headerResult.insertId,
                  year: year,
                  period: period
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
    // });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to get ReceiptEntry
let getReceiptEntry = (req, res, next) => {
  let selectWhere = {
    grn_number: "ALL"
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
        "SELECT * from  hims_f_procurement_grn_header\
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
              "hims_f_procurement_grn_header_id: ",
              headerResult[0].hims_f_procurement_grn_header_id
            );
            connection.query(
              "select * from hims_f_procurement_grn_detail where grn_header_id=?",
              headerResult[0].hims_f_procurement_grn_header_id,
              (error, receipt_entry_detail) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }
                req.records = {
                  ...headerResult[0],
                  ...{ receipt_entry_detail }
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

let updateReceiptEntry = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    // db.getConnection((error, connection) => {
    //   if (error) {
    //     next(error);
    //   }
    let connection = req.connection;
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
        "UPDATE `hims_f_procurement_grn_header` SET `posted`=?, `posted_date`=?, `posted_by`=? \
      WHERE `hims_f_procurement_grn_header_id`=?",
        [
          inputParam.posted,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          inputParam.hims_f_procurement_grn_header_id
        ],
        (error, result) => {
          debugLog("result: ", result);
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }

          if (result !== "" && result != null) {
            let details = inputParam.receipt_entry_detail;

            let qry = "";

            for (let i = 0; i < details.length; i++) {
              qry +=
                " UPDATE `hims_f_procurement_grn_detail` SET recieved_quantity='" +
                details[i].recieved_quantity +
                "',batchno='" +
                details[i].batchno +
                "',rejected_quantity='" +
                (details[i].rejected_quantity || 0) +
                "',outstanding_quantity='" +
                (details[i].outstanding_quantity || 0);

              if (details[i].expiry_date != null) {
                qry += "',expiry_date='" + (details[i].expiry_date || null);
              }
              qry +=
                "' WHERE hims_f_procurement_grn_detail_id='" +
                details[i].hims_f_procurement_grn_detail_id +
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
                req.records = detailResult;
                next();
                // connection.commit(error => {
                //   if (error) {
                //     connection.rollback(() => {
                //       releaseDBConnection(db, connection);
                //       next(error);
                //     });
                //   }
                //   releaseDBConnection(db, connection);
                //   req.records = detailResult;
                //   next();
                // });
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
    // });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to Update PO Entry
let updateDNEntry = (req, res, next) => {
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  let connection = req.connection;
  let inputParam = extend({}, req.body);
  let complete = "Y";
  const partial_recived = new LINQ(inputParam.receipt_entry_detail)
    .Where(w => w.outstanding_quantity != 0)
    .ToArray();

  if (partial_recived.length > 0) {
    complete = "N";
  }

  debugLog("inputParam.dn_id: ", inputParam.dn_id);
  connection.query(
    "UPDATE `hims_f_procurement_dn_header` SET `is_completed`=?, `completed_date`=?, `updated_by` = ?,`updated_date` = ? \
      WHERE `hims_f_procurement_dn_header_id`=?",
    [
      complete,
      new Date(),
      req.userIdentity.algaeh_d_app_user_id,
      new Date(),
      inputParam.dn_id
    ],
    (error, result) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      if (result != "" && result != null) {
        let details = inputParam.receipt_entry_detail;

        let qry = "";

        for (let i = 0; i < details.length; i++) {
          qry +=
            " UPDATE `hims_f_procurement_dn_detail` SET quantity_outstanding='" +
            details[i].outstanding_quantity +
            "' WHERE hims_f_procurement_dn_detail_id='" +
            details[i].dn_detail_id +
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
            req.dnrecords = detailResult;

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
      // req.data = req.records.delivery_note_number;
      // next();
    }
  );
};

export default {
  addReceiptEntry,
  getReceiptEntry,
  updateReceiptEntry,
  updateDNEntry
};
