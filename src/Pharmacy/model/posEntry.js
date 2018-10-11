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
import { getBillDetailsFunctionality } from "../../model/billing";
import { updateIntoItemLocation } from "./commonFunction";
import Promise from "bluebird";
import { connect } from "pm2";

//created by Nowshad: to Insert POS Entry
let addPosEntry = (req, res, next) => {
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
            module_desc: ["POS_NUM"],
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
            "INSERT INTO `hims_f_pharmacy_pos_header` (pos_number,pos_date,patient_id,visit_id,ip_id,recieve_amount,`year`,period,\
                location_id, location_type, sub_total, discount_percentage, discount_amount, net_total, copay_amount, patient_responsibility,\
                patient_tax, patient_payable,company_responsibility,company_tax,company_payable,comments, sec_company_responsibility,\
                sec_company_tax,sec_company_payable,sec_copay_amount,net_tax,gross_total,sheet_discount_amount,\
                sheet_discount_percentage,net_amount,credit_amount,receiveable_amount, created_date,created_by,updated_date,updated_by) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              documentCode,
              today,
              input.patient_id,
              input.visit_id,
              input.ip_id,
              input.recieve_amount,
              year,
              period,
              input.location_id,
              input.location_type,
              input.sub_total,
              input.discount_percentage,
              input.discount_amount,
              input.net_total,
              input.copay_amount,
              input.patient_responsibility,
              input.patient_tax,
              input.patient_payable,
              input.company_responsibility,
              input.company_tax,
              input.company_payable,
              input.comments,
              input.sec_company_responsibility,
              input.sec_company_tax,
              input.sec_company_payable,
              input.sec_copay_amount,
              input.net_tax,
              input.gross_total,
              input.sheet_discount_amount,
              input.sheet_discount_percentage,
              input.net_amount,
              input.credit_amount,
              input.receiveable_amount,
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

              debugLog(" pos header id :", headerResult);

              if (headerResult.insertId != null) {
                const insurtColumns = [
                  "item_id",
                  "item_category",
                  "barcode",
                  "expiry_date",
                  "batchno",
                  "uom_id",
                  "quantity",
                  "insurance_yesno",
                  "tax_inclusive",
                  "unit_cost",
                  "extended_cost",
                  "discount_percent",
                  "discount_amount",
                  "net_extended_cost",
                  "copay_percent",
                  "copay_amount",
                  "patient_responsibility",
                  "patient_tax",
                  "patient_payable",
                  "company_responsibility",
                  "company_tax",
                  "company_payable",
                  "sec_copay_percent",
                  "sec_copay_amount",
                  "sec_company_responsibility",
                  "sec_company_tax",
                  "sec_company_payable"
                ];

                connection.query(
                  "INSERT INTO hims_f_pharmacy_pos_detail(" +
                    insurtColumns.join(",") +
                    ",pharmacy_pos_header_id) VALUES ?",
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

//created by Nowshad: to get Pharmacy POS Entry
let getPosEntry = (req, res, next) => {
  let selectWhere = {
    pos_number: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "SELECT * from  hims_f_pharmacy_pos_header\
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
              "hims_f_pharmacy_pos_header_id: ",
              headerResult[0].hims_f_pharmacy_pos_header_id
            );
            connection.query(
              "select * from hims_f_pharmacy_pos_detail where pharmacy_pos_header_id=? and record_status='A'",
              headerResult[0].hims_f_pharmacy_pos_header_id,
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

//created by Nowshad: to Post POS Entry
let updatePosEntry = (req, res, next) => {
  let PosEntry = {
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
          let inputParam = extend(PosEntry, req.body);

          debugLog("posted", inputParam.posted);
          debugLog("pharmacy_stock_detail", req.body.pharmacy_stock_detail);
          connection.query(
            "UPDATE `hims_f_pharmacy_pos_header` SET `posted`=?, `updated_by`=?, `updated_date`=? \
          WHERE `record_status`='A' and `hims_f_pharmacy_pos_header_id`=?",
            [
              inputParam.posted,
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              inputParam.hims_f_pharmacy_pos_header_id
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

              updateIntoItemLocation(req, res, next);
            })

              .then(records => {
                connection.commit(error => {
                  if (error) {
                    releaseDBConnection(db, connection);
                    next(error);
                  }
                  req.records = records;
                  next();
                });
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
    });
  } catch (e) {
    next(e);
  }
};

//get Prescription POS
let getPrescriptionPOS = (req, res, next) => {
  debugFunction("getPrescriptionPOS");
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
        const _reqBody = req.body;
        const item_ids = new LINQ(_reqBody)
          .Select(s => {
            return s.item_id;
          })
          .ToArray();
        const location_ids = new LINQ(_reqBody)
          .Select(s => {
            return s.location_id;
          })
          .ToArray();

        return new Promise((resolve, reject) => {
          //Select bachno,exp,itemcat,Query hims_mitem_location... input item_id and location_id
          connection.query(
            "select item_id,location_id,batchno, expirydt, grnno, sales_uom from hims_m_item_location where item_id in (?) and location_id in (?) and qtyhand <>0",
            [item_ids, location_ids],
            (error, result) => {
              if (error) {
                reject(error);
              }
              let _req = new LINQ(result)
                .Select(s => {
                  return {
                    ...new LINQ(_reqBody)
                      .Where(
                        w =>
                          w.item_id == s.item_id &&
                          w.location_id == s.location_id
                      )
                      .FirstOrDefault(),
                    ...{
                      batchno: s.batchno,
                      expirydt: s.expirydt,
                      grnno: s.grnno,
                      sales_uom: s.sales_uom
                    }
                  };
                })
                .ToArray();
              req.body = _req;
              resolve(result);
            }
          );
        })
          .then(result => {
            //check then

            new Promise((resolve, reject) => {
              try {
                getBillDetailsFunctionality(req, res, next, resolve);
              } catch (e) {
                reject(e);
              }
            }).then(resultbilling => {
              //expiry_date, uom_id, and batchno add with the result
              const _result =
                result != null && result.length > 0 ? result[0] : {};
              if (resultbilling != null && resultbilling.length > 0) {
                debugLog("_result", _result);
                debugLog("resultbilling", resultbilling);
                req.records = {
                  ...resultbilling,
                  ..._result
                };
                next();
              } else {
                next();
              }
            });
          })
          .catch(e => {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(e);
            });
          });
      });
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addPosEntry,
  getPosEntry,
  updatePosEntry,
  getPrescriptionPOS
};
