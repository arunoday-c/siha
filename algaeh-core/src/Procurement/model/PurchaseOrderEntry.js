"use strict";
import utils from "../../utils";
import extend from "extend";
import httpStatus from "../../utils/httpStatus";
import logUtils from "../../utils/logging";
import moment, { now } from "moment";

import Promise from "bluebird";

const { debugLog } = logUtils;
const {
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject,
  runningNumberGen
} = utils;

//created by Nowshad: to save Purchase Order Entry
let addPurchaseOrderEntry = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    debugLog("PurchaseOrderEntry: ", "Purchase Order Entry");
    let connection = req.connection;

    let requestCounter = 1;

    connection.beginTransaction(error => {
      if (error) {
        connection.rollback(() => {
          releaseDBConnection(db, connection);
          next(error);
        });
      }
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
          "INSERT INTO `hims_f_procurement_po_header` (purchase_number,po_date,po_type,po_from, pharmcy_location_id,\
              inventory_location_id,location_type,vendor_id,expected_date,on_hold, phar_requisition_id,inv_requisition_id, \
              from_multiple_requisition, payment_terms, comment, sub_total, detail_discount, extended_total,sheet_level_discount_percent, \
              sheet_level_discount_amount,description,net_total,total_tax, net_payable,created_by,created_date, \
              updated_by,updated_date) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            documentCode,
            today,
            input.po_type,
            input.po_from,
            input.pharmcy_location_id,
            input.inventory_location_id,
            input.location_type,
            input.vendor_id,
            input.expected_date,
            input.on_hold,
            input.requisition_id,
            input.inv_requisition_id,
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
            input.net_payable,

            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date()
          ],
          (error, headerResult) => {
            debugLog("Success: ", "Check");
            if (error) {
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
                "order_quantity",
                "total_quantity",
                "pharmacy_uom_id",
                "inventory_uom_id",
                "unit_price",
                "extended_price",
                "sub_discount_percentage",
                "sub_discount_amount",
                "extended_cost",
                "net_extended_cost",
                "unit_cost",
                "expected_arrival_date",
                "pharmacy_requisition_id",
                "inventory_requisition_id",
                "tax_percentage",
                "tax_amount",
                "total_amount",
                "item_type"
              ];

              connection.query(
                "INSERT INTO hims_f_procurement_po_detail(" +
                  insurtColumns.join(",") +
                  ",procurement_header_id) VALUES ?",
                [
                  jsonArrayToObject({
                    sampleInputObject: insurtColumns,
                    arrayObj: req.body.po_entry_detail,
                    newFieldToInsert: [headerResult.insertId],
                    req: req
                  })
                ],
                (error, detailResult) => {
                  if (error) {
                    debugLog("error: ", "Check");
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  req.records = {
                    purchase_number: documentCode
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

//created by Nowshad: to get PurchaseOrderEntry
let getPurchaseOrderEntry = (req, res, next) => {
  let selectWhere = {
    purchase_number: "ALL"
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
              "select * from hims_f_procurement_po_detail where procurement_header_id=?",
              headerResult[0].hims_f_procurement_po_header_id,
              (error, po_entry_detail) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }
                req.records = {
                  ...headerResult[0],
                  ...{ po_entry_detail }
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
              let details = inputParam.po_entry_detail;

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

//created by Nowshad: to get Pharmacy Requisition Entry to PO
let getPharRequisitionEntryPO = (req, res, next) => {
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
              "select * from hims_f_pharmacy_material_detail p left outer join hims_d_item_master l \
                on l.hims_d_item_master_id =p.item_id where pharmacy_header_id=?",
              [headerResult[0].hims_f_pharamcy_material_header_id],
              (error, po_entry_detail) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }
                req.records = {
                  ...headerResult[0],
                  ...{ po_entry_detail }
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

//created by Nowshad: to get Inventory Requisition Entry to PO
let getInvRequisitionEntryPO = (req, res, next) => {
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
        "SELECT * from  hims_f_inventory_material_header \
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
              "hims_f_inventory_material_header_id: ",
              headerResult[0].hims_f_inventory_material_header_id
            );
            debugLog("from_location_id: ", inputParam.from_location_id);

            debugLog("to_location_id: ", headerResult[0].to_location_id);
            connection.query(
              "select * from hims_f_inventory_material_detail p left outer join hims_d_item_master l \
                on l.hims_d_item_master_id =p.item_id where inventory_header_id=?",
              [headerResult[0].hims_f_inventory_material_header_id],
              (error, po_entry_detail) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }
                req.records = {
                  ...headerResult[0],
                  ...{ po_entry_detail }
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

//created by Nowshad: to Update Pharmacy Requisition Entry
let updatePharReqEntry = (req, res, next) => {
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  let connection = req.connection;
  let inputParam = extend({}, req.body);

  connection.query(
    "UPDATE `hims_f_pharamcy_material_header` SET `is_completed`=?, `completed_date`=? \
      WHERE `hims_f_pharamcy_material_header_id`=?",
    ["Y", new Date(), inputParam.phar_requisition_id],
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
          debugLog("Data:n ", details[i].pharmacy_requisition_id);
          qry +=
            " UPDATE `hims_f_pharmacy_material_detail` SET po_created_date=now()" +
            ",po_created='" +
            "Y" +
            "',po_created_quantity='" +
            details[i].total_quantity +
            "' WHERE hims_f_pharmacy_material_detail_id='" +
            details[i].pharmacy_requisition_id +
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

            req.data = req.records.purchase_number;
            next();
            // connection.commit(error => {
            //   if (error) {
            //     connection.rollback(() => {
            //       releaseDBConnection(db, connection);
            //       next(error);
            //     });
            //   }
            //   releaseDBConnection(db, connection);
            //   req.records = req.records.purchase_number;
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
};

//created by Nowshad: to Update Inventory Requisition Entry
let updateInvReqEntry = (req, res, next) => {
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  let connection = req.connection;
  let inputParam = extend({}, req.body);

  connection.query(
    "UPDATE `hims_f_inventory_material_header` SET `is_completed`=?, `completed_date`=? \
      WHERE `hims_f_inventory_material_header_id`=?",
    ["Y", new Date(), inputParam.inv_requisition_id],
    (error, result) => {
      if (error) {
        connection.rollback(() => {
          releaseDBConnection(db, connection);
          next(error);
        });
      }
      if (result !== "" && result != null) {
        let details = inputParam.inventory_stock_detail;

        let qry = "";

        for (let i = 0; i < details.length; i++) {
          qry +=
            " UPDATE `hims_f_inventory_material_detail` SET po_created_date=now()" +
            ",po_created='" +
            "Y" +
            "',po_created_quantity='" +
            details[i].total_quantity +
            "' WHERE hims_f_inventory_material_detail_id='" +
            details[i].inventory_requisition_id +
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

            req.data = req.records.purchase_number;
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
};

export default {
  addPurchaseOrderEntry,
  getPurchaseOrderEntry,
  updatePurchaseOrderEntry,
  getAuthPurchaseList,
  getInvRequisitionEntryPO,
  getPharRequisitionEntryPO,
  updatePharReqEntry,
  updateInvReqEntry
};
