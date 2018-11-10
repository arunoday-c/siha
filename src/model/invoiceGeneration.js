"use strict";
import extend from "extend";
import {
  whereCondition,
  deleteRecord,
  releaseDBConnection,
  jsonArrayToObject,
  runningNumberGen
} from "../utils";
import moment from "moment";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import { debugLog } from "../utils/logging";
import Promise from "bluebird";

//created by irfan: to getVisitWiseBillDetailS
let getVisitWiseBillDetailS_BACKUP = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_billing_header_id, patient_id, visit_id, bill_number, incharge_or_provider,\
          bill_date, advance_amount, advance_adjust, discount_amount, sub_total_amount, total_tax,\
           net_total, billing_status, copay_amount, deductable_amount, sec_copay_amount, sec_deductable_amount, \
           gross_total, sheet_discount_amount, sheet_discount_percentage, net_amount, patient_res, company_res, \
           sec_company_res, patient_payable, company_payable, sec_company_payable, patient_tax, company_tax, sec_company_tax,\
           net_tax, credit_amount, receiveable_amount, balance_due, receipt_header_id, cancel_remarks, cancel_by, bill_comments\
           from hims_f_billing_header where record_status='A' and visit_id=?",
        [req.query.visit_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          if (result.length > 0) {
            let outputArray = [];

            for (let i = 0; i < result.length; i++) {
              connection.query(
                "select hims_f_billing_details_id, hims_f_billing_header_id, service_type_id, services_id, quantity,\
                  unit_cost, insurance_yesno, gross_amount, discount_amout, discount_percentage, net_amout, copay_percentage,\
                  copay_amount, deductable_amount, deductable_percentage, tax_inclusive, patient_tax, company_tax, total_tax,\
                    patient_resp, patient_payable, comapany_resp, company_payble, sec_company, sec_deductable_percentage, \
                    sec_deductable_amount, sec_company_res, sec_company_tax, sec_company_paybale, sec_copay_percntage,\
                    sec_copay_amount, pre_approval, commission_given from hims_f_billing_details where record_status='A'\
                    and hims_f_billing_header_id=?",
                [result[i]["hims_f_billing_header_id"]],
                (error, detailResult) => {
                  if (error) {
                    releaseDBConnection(db, connection);
                    next(error);
                  }

                  outputArray.push({ ...result[i], detailBill: detailResult });

                  if (i == result.length - 1) {
                    releaseDBConnection(db, connection);
                    req.records = outputArray;
                    next();
                  }
                }
              );
            }
          } else {
            releaseDBConnection(db, connection);
            req.records = result;
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to getVisitWiseBillDetailS
let getVisitWiseBillDetailS = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_billing_header_id, patient_id, visit_id from hims_f_billing_header where record_status='A' and visit_id=?",
        [req.query.visit_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          if (result.length > 0) {
            let bill_header_ids = new LINQ(result)
              .Select(s => s.hims_f_billing_header_id)
              .ToArray();

            connection.query(
              "select hims_f_billing_details_id, hims_f_billing_header_id, service_type_id, services_id, quantity,\
                  unit_cost, insurance_yesno, gross_amount, discount_amout, discount_percentage, net_amout, copay_percentage,\
                  copay_amount, deductable_amount, deductable_percentage, tax_inclusive, patient_tax, company_tax, total_tax,\
                    patient_resp, patient_payable, comapany_resp, company_payble, sec_company, sec_deductable_percentage, \
                    sec_deductable_amount, sec_company_res, sec_company_tax, sec_company_paybale, sec_copay_percntage,\
                    sec_copay_amount, pre_approval, commission_given from hims_f_billing_details where record_status='A'\
                    and hims_f_billing_header_id in (?)",
              [bill_header_ids],
              (error, detailResult) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }

                releaseDBConnection(db, connection);
                req.records = detailResult;
                next();
              }
            );
          } else {
            releaseDBConnection(db, connection);
            req.records = result;
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to Insert Invoice Generation
let addInvoiceGeneration = (req, res, next) => {
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
            module_desc: ["INV_NUM"],
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
          debugLog("input:", input);
          let today = moment().format("YYYY-MM-DD");
          debugLog("input:", input);
          connection.query(
            "INSERT INTO `hims_f_invoice_header` (invoice_number,invoice_date,patient_id,visit_id,gross_amount,discount_amount,patient_resp,\
              patient_tax, patient_payable, company_resp, company_tax, company_payable, sec_company_resp, sec_company_tax, sec_company_payable,\
                created_date,created_by,updated_date,updated_by) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              documentCode,
              new Date(input.invoice_date),
              input.patient_id,
              input.visit_id,
              input.gross_amount,
              input.discount_amount,
              input.patient_resp,
              input.patient_tax,
              input.patient_payable,
              input.company_resp,
              input.company_tax,
              input.company_payable,
              input.sec_company_resp,
              input.sec_company_tax,
              input.sec_company_payable,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id
            ],
            (error, headerResult) => {
              debugLog(" Error :", Error);
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }

              debugLog(" pos header id :", headerResult);

              if (headerResult.insertId != null) {
                const insurtColumns = [
                  "bill_header_id",
                  "bill_detail_id",
                  "service_id",
                  "quantity",
                  "gross_amount",
                  "discount_amount",
                  "patient_resp",
                  "patient_tax",
                  "patient_payable",
                  "company_resp",
                  "company_tax",
                  "company_payable",
                  "sec_company_resp",
                  "sec_company_tax",
                  "sec_company_payable"
                ];

                connection.query(
                  "INSERT INTO hims_f_invoice_details(" +
                    insurtColumns.join(",") +
                    ",invoice_header_id) VALUES ?",
                  [
                    jsonArrayToObject({
                      sampleInputObject: insurtColumns,
                      arrayObj: req.body.Invoice_Detail,
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
                        invoice_number: documentCode,
                        hims_f_invoice_header_id: headerResult.insertId
                      };
                      next();
                    });
                  }
                );
              } else {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next();
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

module.exports = { getVisitWiseBillDetailS, addInvoiceGeneration };
