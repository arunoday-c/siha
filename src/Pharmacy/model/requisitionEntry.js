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
// import { getBillDetailsFunctionality } from "../../model/billing";
// import { updateIntoItemLocation } from "./commonFunction";
import Promise from "bluebird";

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
  let RequisitionEntry = {
    posted: null,
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
    let inputParam = extend(RequisitionEntry, req.body);
    connection.query(
      "UPDATE `hims_f_pharamcy_material_header` SET `authorize1`=?, `authorize1_date`=?, `authorize1_by`=?, \
      `authorie2`=?, `authorize2_date`=?, `authorize2_by`=? \
      WHERE `hims_f_pharamcy_material_header_id`=?",
      [
        inputParam.authorize1,
        new Date(),
        req.userIdentity.algaeh_d_app_user_id,
        inputParam.authorie2,
        new Date(),
        req.userIdentity.algaeh_d_app_user_id,
        inputParam.hims_f_pharamcy_material_header_id
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
// let updaterequisitionEntry = (req, res, next) => {

//   try {
//     if (req.db == null) {
//       next(httpStatus.dataBaseNotInitilizedError());
//     }
//     let db = req.db;
//     db.getConnection((error, connection) => {
//       if (error) {
//         next(error);
//       }

//       connection.beginTransaction(error => {
//         if (error) {
//           connection.rollback(() => {
//             releaseDBConnection(db, connection);
//             next(error);
//           });
//         }
//         return new Promise((resolve, reject) => {
//           let inputParam = extend(RequisitionEntry, req.body);

//           debugLog("posted", inputParam.posted);
//           debugLog("pharmacy_stock_detail", req.body.pharmacy_stock_detail);
//           connection.query(
//             "UPDATE `hims_f_pharamcy_material_header` SET `authorize1`=?, `authorize1_date`=?, `authorize1_by`=?, \
//             `authorie2`=?, `authorize2_date`=?, `authorize2_by`=?, updated_by`=?, `updated_date`=? \
//             WHERE  and `hims_f_pharamcy_material_header_id`=?",
//             [
//               inputParam.authorize1,
//               new Date(),
//               req.userIdentity.algaeh_d_app_user_id,
//               inputParam.authorie2,
//               new Date(),
//               req.userIdentity.algaeh_d_app_user_id,
//               req.userIdentity.algaeh_d_app_user_id,
//               new Date(),
//               inputParam.hims_f_pharamcy_material_header_id
//             ],
//             (error, result) => {
//               debugLog("error", error);
//               releaseDBConnection(db, connection);
//               if (error) {
//                 reject(error);
//               } else {
//                 resolve(result);
//               }
//             }
//           );
//         })
//           .then(output => {
//             return new Promise((resolve, reject) => {
//               debugLog("output", output);
//               req.options = {
//                 db: connection,
//                 onFailure: error => {
//                   reject(error);
//                 },
//                 onSuccess: result => {
//                   resolve(result);
//                 }
//               };

//               //   updateIntoItemLocation(req, res, next);
//             })

//               .then(records => {
//                 connection.commit(error => {
//                   if (error) {
//                     releaseDBConnection(db, connection);
//                     next(error);
//                   }
//                   req.records = records;
//                   releaseDBConnection(db, connection);
//                   next();
//                 });
//               })
//               .catch(error => {
//                 connection.rollback(() => {
//                   releaseDBConnection(db, connection);
//                   next(error);
//                 });
//               });
//           })
//           .catch(error => {
//             connection.rollback(() => {
//               releaseDBConnection(db, connection);
//               next(error);
//             });
//           });
//       });
//     });
//   } catch (e) {
//     next(e);
//   }
// };

//created by Nowshad: to get Pharmacy Requisition Entry
let getAuthrequisitionList = (req, res, next) => {
  let selectWhere = {
    from_location_id: null,
    to_location_id: null
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let inputParam = extend(selectWhere, req.query);

    let strQuery =
      "SELECT * from  hims_f_pharamcy_material_header\
    where (authorize1='N' or authorie2='N') ";

    if (inputParam.from_location_id !== null) {
      strQuery =
        strQuery + "and from_location_id = " + inputParam.from_location_id;
    }
    if (inputParam.to_location_id !== null) {
      strQuery = strQuery + "and to_location_id = " + inputParam.to_location_id;
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
  addrequisitionEntry,
  getrequisitionEntry,
  updaterequisitionEntry,
  getAuthrequisitionList
};
