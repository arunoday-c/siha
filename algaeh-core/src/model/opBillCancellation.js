"use strict";
import extend from "extend";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import logUtils from "../utils/logging";

const { debugFunction, debugLog } = logUtils;
const {
  whereCondition,
  runningNumberGen,
  releaseDBConnection,
  jsonArrayToObject
} = utils;

let billingCounter = 0;
//created by Nowshad :to save Op Bill Cancellation data
let addOpBillCancellation = (req, res, next) => {
  debugFunction("addOpBillCancellation");
  billingCounter = billingCounter + 1;
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputParam = extend({}, req.body);

    inputParam.receipt_header_id = req.records.receipt_header_id;
    inputParam.hospital_id = 1;

    let connection = req.connection;

    return new Promise((resolve, reject) => {
      runningNumberGen({
        db: connection,
        counter: billingCounter,
        module_desc: ["OP_CBIL"],
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

      connection.query(
        "INSERT INTO hims_f_bill_cancel_header ( bill_cancel_number, patient_id, visit_id, from_bill_id,receipt_header_id,\
          hospital_id,incharge_or_provider, bill_cancel_date, advance_amount,advance_adjust, discount_amount, sub_total_amount \
          , total_tax,  billing_status, sheet_discount_amount, sheet_discount_percentage, net_amount, net_total \
          , company_res, sec_company_res, patient_res, patient_payable, company_payable, sec_company_payable \
          , patient_tax, company_tax, sec_company_tax, net_tax, credit_amount, payable_amount \
          , created_by, created_date, updated_by, updated_date, copay_amount, sec_copay_amount ,deductable_amount, sec_deductable_amount) \
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          documentCode,
          inputParam.patient_id,
          inputParam.visit_id,
          inputParam.from_bill_id,
          inputParam.receipt_header_id,
          inputParam.hospital_id,
          inputParam.incharge_or_provider,
          inputParam.bill_cancel_date != null
            ? new Date(inputParam.bill_cancel_date)
            : inputParam.bill_cancel_date,
          inputParam.advance_amount,
          inputParam.advance_adjust,
          inputParam.discount_amount,
          inputParam.sub_total_amount,
          inputParam.total_tax,
          inputParam.billing_status,
          inputParam.sheet_discount_amount,
          inputParam.sheet_discount_percentage,
          inputParam.net_amount,
          inputParam.net_total,
          inputParam.company_res,
          inputParam.sec_company_res,
          inputParam.patient_res,
          inputParam.patient_payable,
          inputParam.company_payable,
          inputParam.sec_company_payable,
          inputParam.patient_tax,
          inputParam.company_tax,
          inputParam.sec_company_tax,
          inputParam.net_tax,
          inputParam.credit_amount,
          inputParam.payable_amount,
          inputParam.created_by,
          new Date(),
          inputParam.updated_by,
          new Date(),
          inputParam.copay_amount,
          inputParam.sec_copay_amount,
          inputParam.deductable_amount,
          inputParam.sec_deductable_amount
        ],
        (error, headerResult) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          debugLog(" pos header id :", headerResult);

          if (headerResult.insertId != null) {
            debugLog("Billing Header ", headerResult.insertId);

            const insurtColumns = [
              "service_type_id",
              "services_id",
              "quantity",
              "unit_cost",
              "insurance_yesno",
              "gross_amount",
              "discount_amout",
              "discount_percentage",
              "net_amout",
              "copay_percentage",
              "copay_amount",
              "deductable_amount",
              "deductable_percentage",
              "tax_inclusive",
              "patient_tax",
              "company_tax",
              "total_tax",
              "patient_resp",
              "patient_payable",
              "comapany_resp",
              "company_payble",
              "sec_company",
              "sec_deductable_percentage",
              "sec_deductable_amount",
              "sec_company_res",
              "sec_company_tax",
              "sec_company_paybale",
              "sec_copay_percntage",
              "sec_copay_amount"
            ];
            debugLog("Billing Header ", headerResult.insertId);
            debugLog("billdetails: ", inputParam.billdetails);
            connection.query(
              "INSERT INTO hims_f_bill_cancel_details(" +
                insurtColumns.join(",") +
                ",created_by, created_date, updated_by, updated_date, hims_f_bill_cancel_header_id) VALUES ?",
              [
                jsonArrayToObject({
                  sampleInputObject: insurtColumns,
                  arrayObj: inputParam.billdetails,
                  newFieldToInsert: [
                    req.userIdentity.algaeh_d_app_user_id,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    new Date(),
                    headerResult.insertId
                  ],
                  req: req
                })
              ],
              (error, detailsRecords) => {
                if (error) {
                  debugLog("error: ", error);
                  releaseDBConnection(db, connection);
                  next(error);
                }

                req.records = {
                  bill_cancel_number: documentCode,
                  hims_f_bill_cancel_header_id: headerResult.insertId,
                  receipt_number: req.records.receipt_number
                };
                releaseDBConnection(db, connection);
                next();
              }
            );
          } else {
            releaseDBConnection(db, connection);
            next(error);
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

let getBillCancellation = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let connection = req.connection;

    // INNER JOIN hims_f_bill_cancel_details bd  ON\
    //   bh.hims_f_bill_cancel_header_id=bd.hims_f_bill_cancel_header_id\
    connection.query(
      "SELECT *, bh.receipt_header_id as cal_receipt_header_id FROM hims_f_bill_cancel_header bh \
      inner join hims_f_patient as PAT on bh.patient_id = PAT.hims_d_patient_id\
      inner join hims_f_patient_visit as vst on bh.visit_id = vst.hims_f_patient_visit_id\
      inner join hims_f_billing_header as bill on BH.from_bill_id = bill.hims_f_billing_header_id \
      where bh.record_status='A' AND bh.bill_cancel_number='" +
        req.query.bill_cancel_number +
        "'",

      (error, headerResult) => {
        if (error) {
          releaseDBConnection(db, connection);
          next(error);
        }

        debugLog("result: ", headerResult);
        if (headerResult.length != 0) {
          debugLog(
            "hims_f_bill_cancel_header_id: ",
            headerResult[0].hims_f_bill_cancel_header_id
          );
          connection.query(
            "select * from hims_f_bill_cancel_details where hims_f_bill_cancel_header_id=? and record_status='A'",
            headerResult[0].hims_f_bill_cancel_header_id,
            (error, billdetails) => {
              if (error) {
                releaseDBConnection(db, connection);
                next(error);
              }
              req.records = {
                ...headerResult[0],
                ...{ billdetails },
                ...{
                  hims_f_receipt_header_id:
                    headerResult[0].cal_receipt_header_id
                }
              };
              releaseDBConnection(db, connection);
              next();
              debugLog("Billing Result: ", req.records);
            }
          );
        } else {
          req.records = headerResult;
          releaseDBConnection(db, connection);
          next();
        }

        // debugLog("cal_receipt_header_id: ", result[0].cal_receipt_header_id);
        // req.records = {
        //   result,
        //   hims_f_receipt_header_id: result[0].cal_receipt_header_id
        // };
        // releaseDBConnection(db, connection);
        // next();
      }
    );
    // });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to Update PO Entry
let updateOPBilling = (req, res, next) => {
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  let connection = req.connection;
  let inputParam = extend({}, req.body);

  debugLog("inputParam.from_bill_id: ", inputParam.from_bill_id);
  connection.query(
    "UPDATE `hims_f_billing_header` SET `cancelled`=?, `cancel_remarks`=?,`cancel_by` = ?,`updated_date` = ? \
      WHERE `hims_f_billing_header_id`=?",
    [
      "Y",
      inputParam.cancel_remarks,
      req.userIdentity.algaeh_d_app_user_id,
      new Date(),
      inputParam.from_bill_id
    ],
    (error, result) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }
      req.data = req.records.delivery_note_number;
      next();
    }
  );
};

export default {
  addOpBillCancellation,
  getBillCancellation,
  updateOPBilling
};
