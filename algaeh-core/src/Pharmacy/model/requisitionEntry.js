"use strict";
import utils from "../../utils";
import extend from "extend";
import httpStatus from "../../utils/httpStatus";
import logUtils from "../../utils/logging";
import moment from "moment";
import Promise from "bluebird";
import { LINQ } from "node-linq";

const { debugLog } = logUtils;
const {
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject,
  runningNumberGen
} = utils;

//created by Nowshad: to Insert Requisition Entry
let addrequisitionEntry = (req, res, next) => {
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
            module_desc: ["REQ_NUM"],
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

          let today = moment().format("YYYY-MM-DD");
          debugLog("today:", today);

          connection.query(
            "INSERT INTO `hims_f_pharamcy_material_header` (material_requisition_number,requistion_date,from_location_type,\
                from_location_id, expiration_date,required_date,requested_by,on_hold, to_location_id, \
                to_location_type, description, comment, is_completed, completed_date, completed_lines,requested_lines, \
                purchase_created_lines,status,requistion_type,no_of_transfers,no_of_po, authorize1,authorize1_date, \
                authorize1_by,authorie2,authorize2_date,authorize2_by,cancelled, cancelled_by,cancelled_date) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              documentCode,
              today,
              input.from_location_type,
              input.from_location_id,
              input.expiration_date,
              input.required_date,
              req.userIdentity.algaeh_d_app_user_id,
              input.on_hold,
              input.to_location_id,
              input.to_location_type,
              input.description,
              input.comment,
              input.is_completed,
              input.completed_date,
              input.completed_lines,
              input.requested_lines,
              input.purchase_created_lines,

              input.status,
              input.requistion_type,
              input.no_of_transfers,

              input.no_of_po,
              input.authorize1,
              input.authorize1_date,
              input.authorize1_by,
              input.authorie2,
              input.authorize2_date,
              input.authorize2_by,
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
                  "item_uom",
                  "to_qtyhand",
                  "from_qtyhand",
                  "quantity_required"
                ];

                connection.query(
                  "INSERT INTO hims_f_pharmacy_material_detail(" +
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

//created by Nowshad: to get Pharmacy Requisition Entry
let getrequisitionEntry = (req, res, next) => {
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
        "SELECT * from  hims_f_pharamcy_material_header\
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
              "hims_f_pharamcy_material_header_id: ",
              headerResult[0].hims_f_pharamcy_material_header_id
            );
            connection.query(
              "select * from hims_f_pharmacy_material_detail where pharmacy_header_id=?",
              headerResult[0].hims_f_pharamcy_material_header_id,
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

let updaterequisitionEntry = (req, res, next) => {
  // let RequisitionEntry = {
  //   posted: null,
  //   updated_by: req.userIdentity.algaeh_d_app_user_id
  // };
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
        "UPDATE `hims_f_pharamcy_material_header` SET `authorize1`=?, `authorize1_date`=?, `authorize1_by`=?, \
      `authorie2`=?, `authorize2_date`=?, `authorize2_by`=? \
      WHERE `hims_f_pharamcy_material_header_id`=?",
        [
          inputParam.authorize1,
          new Date(),
          inputParam.updated_by,
          inputParam.authorie2,
          new Date(),
          inputParam.updated_by,
          inputParam.hims_f_pharamcy_material_header_id
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
                " UPDATE `hims_f_pharmacy_material_detail` SET pharmacy_header_id='" +
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
                // "',po_created_date='" +
                // (details[i].po_created_date || new Date()) +
                // "',po_created='" +
                // details[i].po_created +
                // "',po_created_quantity='" +
                // (details[i].po_created_quantity || 0) +
                // "',po_outstanding_quantity='" +
                // (details[i].po_outstanding_quantity || 0) +
                // "',po_completed='" +
                // details[i].po_completed +
                "' WHERE hims_f_pharmacy_material_detail_id='" +
                details[i].hims_f_pharmacy_material_detail_id +
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
            // if (error) {
            //   next(error);
            // }
            // req.records = result;
            // next();

            // TODO hims_f_pharamcy_material_detail update

            // connection.commit(error => {
            //   if (error) {
            //     connection.rollback(() => {
            //       releaseDBConnection(db, connection);
            //       next(error);
            //     });
            //   }
            //   releaseDBConnection(db, connection);
            //   req.records = result;
            //   next();
            // });

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
      "SELECT * from  hims_f_pharamcy_material_header\
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

//created by Nowshad: to Update Requisition Entry
let updaterequisitionEntryOnceTranfer = (req, res, next) => {
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  let connection = req.connection;
  let inputParam = extend({}, req.body);
  let complete = "Y";

  const partial_recived = new LINQ(inputParam.pharmacy_stock_detail)
    .Where(w => w.quantity_outstanding != 0)
    .ToArray();

  if (partial_recived.length > 0) {
    complete = "N";
  }
  debugLog("complete: ", complete);
  connection.query(
    "UPDATE `hims_f_pharamcy_material_header` SET `is_completed`=?, `completed_date`=? \
      WHERE `hims_f_pharamcy_material_header_id`=?",
    [complete, new Date(), inputParam.hims_f_pharamcy_material_header_id],
    (error, result) => {
      if (error) {
        connection.rollback(() => {
          releaseDBConnection(db, connection);
          next(error);
        });
      }
      if (result != "" && result != null) {
        let details = inputParam.pharmacy_stock_detail;

        let qry = "";

        for (let i = 0; i < details.length; i++) {
          qry +=
            " UPDATE `hims_f_pharmacy_material_detail` SET quantity_outstanding='" +
            details[i].quantity_outstanding +
            "' WHERE hims_f_pharmacy_material_detail_id='" +
            details[i].material_requisition_detail_id +
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
  addrequisitionEntry,
  getrequisitionEntry,
  updaterequisitionEntry,
  getAuthrequisitionList,
  updaterequisitionEntryOnceTranfer
};
