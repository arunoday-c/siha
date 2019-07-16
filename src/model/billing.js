import httpStatus from "../utils/httpStatus";
import extend from "extend";
import {
  bulkInputArrayObject,
  runningNumber,
  releaseDBConnection,
  jsonArrayToObject
} from "../utils";

import moment from "moment";
import { debugLog, debugFunction } from "../utils/logging";
import appsettings from "../utils/appsettings.json";
import { LINQ } from "node-linq";
import math from "mathjs";
//import { inflate } from "zlib";

let addBillData = (req, res, next) => {
  let db = req.options == null ? req.db : req.options.db;

  try {
    let inputParam = extend(
      {
        hims_f_billing_header_id: null,
        patient_id: null,
        billing_type_id: null,
        receipt_header_id: null,
        visit_id: null,
        bill_number: null,
        incharge_or_provider: null,
        bill_date: null,
        advance_amount: 0,
        discount_amount: 0,
        sub_total_amount: 0,
        total_tax: 0,
        net_total: 0,
        billing_status: null,
        copay_amount: 0,
        deductable_amount: 0,
        gross_total: 0,
        sheet_discount_amount: 0,
        sheet_discount_percentage: 0,
        net_amount: 0,
        patient_res: 0,
        company_res: 0,
        sec_company_res: 0,
        patient_payable: 0,
        company_payable: 0,
        sec_company_payable: 0,
        patient_tax: 0,
        company_tax: 0,
        sec_company_tax: 0,
        net_tax: 0,
        credit_amount: 0,
        receiveable_amount: 0,
        created_by: req.userIdentity.algaeh_d_app_user_id,
        created_date: null,
        updated_by: req.userIdentity.algaeh_d_app_user_id,
        updated_date: null,
        record_status: null,
        cancel_remarks: null,
        cancel_by: null,
        bill_comments: null,
        advance_adjust: 0
      },
      req.body
    );

    if (inputParam.billdetails == null || inputParam.billdetails.length == 0) {
      const errorGen = httpStatus.generateError(
        httpStatus.badRequest,
        "Please select atleast one service."
      );
      if (req.options == null) {
        next(errorGen);
      } else {
        req.options.onFailure(errorGen);
      }
    }

    inputParam.hims_f_patient_visit_id = req.body.patient_visit_id;
    inputParam.patient_id = req.body.patient_id;

    if (
      inputParam.sheet_discount_amount != 0 &&
      inputParam.bill_comments == ""
    ) {
      const errorGene = httpStatus.generateError(
        httpStatus.badRequest,
        "Please enter sheet level discount comments. "
      );
      if (req.options == null) {
        next(errorGene);
      } else {
        req.options.onFailure(errorGene);
      }
    }

    inputParam.bill_number = req.bill_number;
    inputParam.patient_id = req.patient_id || req.body.patient_id;
    inputParam.visit_id = req.body.visit_id;
    db.query(
      "INSERT INTO hims_f_billing_header ( patient_id, visit_id, bill_number,receipt_header_id,\
            incharge_or_provider, bill_date, advance_amount,advance_adjust, discount_amount, sub_total_amount \
            , total_tax,  billing_status, sheet_discount_amount, sheet_discount_percentage, net_amount, net_total \
            , company_res, sec_company_res, patient_res, patient_payable, company_payable, sec_company_payable \
            , patient_tax, company_tax, sec_company_tax, net_tax, credit_amount, receiveable_amount,balance_credit \
            , created_by, created_date, updated_by, updated_date, copay_amount, deductable_amount) VALUES (?,?,?,?\
              ,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        inputParam.patient_id,
        inputParam.visit_id,
        inputParam.bill_number,
        inputParam.receipt_header_id,
        inputParam.incharge_or_provider,
        inputParam.bill_date != null
          ? new Date(inputParam.bill_date)
          : inputParam.bill_date,
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
        inputParam.receiveable_amount,
        inputParam.balance_credit,
        inputParam.created_by,
        new Date(),
        inputParam.updated_by,
        new Date(),
        inputParam.copay_amount,
        inputParam.deductable_amount
      ],
      (error, headerResult) => {
        debugLog("Header status", error, headerResult);
        if (error) {
          if (req.options == null) {
            db.rollback(() => {
              releaseDBConnection(req.db, db);
              next(error);
            });
          } else {
            req.options.onFailure(error);
          }
        } else {
          // if a patient utilizing his advance amount for his current payment
          if (
            headerResult.insertId != null &&
            headerResult.insertId != "" &&
            inputParam.advance_adjust > 0
          ) {
            db.query(
              "SELECT advance_amount FROM hims_f_patient WHERE hims_d_patient_id=?",
              [inputParam.patient_id],
              (error, result) => {
                if (error) {
                  if (req.options == null) {
                    releaseDBConnection(req.db, db);
                    next(error);
                  } else {
                    req.options.onFailure(error);
                  }
                }
                let existingAdvance = result[0].advance_amount;

                if (result.length != 0) {
                  inputParam.advance_amount =
                    existingAdvance - inputParam.advance_adjust;
                  db.query(
                    "UPDATE  `hims_f_patient` SET  `advance_amount`=?, \
                    `updated_by`=?, `updated_date`=? WHERE `hims_d_patient_id`=?",
                    [
                      inputParam.advance_amount,
                      inputParam.updated_by,
                      new Date(),
                      inputParam.patient_id
                    ],
                    (error, subtractAdvance) => {
                      if (error) {
                        if (req.options == null) {
                          db.rollback(() => {
                            releaseDBConnection(req.db, db);
                            next(error);
                          });
                        } else {
                          req.options.onFailure(error);
                        }
                      }
                    }
                  );
                }
              }
            );
          }

          // req.billing_header_id = headerResult.insertId;
          debugLog("Billing Header ", headerResult.insertId);
          let newDtls = new LINQ(inputParam.billdetails)
            .Select(s => {
              return {
                hims_f_billing_header_id: headerResult.insertId,
                service_type_id: s.service_type_id,
                services_id: s.services_id,
                quantity: s.quantity,
                unit_cost: s.unit_cost,
                insurance_yesno: s.insurance_yesno,
                gross_amount: s.gross_amount,
                " discount_amout": s.discount_amout,
                discount_percentage: s.discount_percentage,
                net_amout: s.net_amout,
                copay_percentage: s.copay_percentage,
                copay_amount: s.copay_amount,
                deductable_amount: s.deductable_amount,
                deductable_percentage: s.deductable_percentage,
                tax_inclusive: s.tax_inclusive == 0 ? "N" : s.tax_inclusive,
                patient_tax: s.patient_tax,
                company_tax: s.company_tax,
                total_tax: s.total_tax,
                patient_resp: s.patient_resp,
                patient_payable: s.patient_payable,
                comapany_resp: s.comapany_resp,
                company_payble: s.company_payble,
                sec_company: s.sec_company == 0 ? "N" : s.sec_company,
                sec_deductable_percentage: s.sec_deductable_percentage,
                sec_deductable_amount: s.sec_deductable_amount,
                sec_company_res: s.sec_company_res,
                sec_company_tax: s.sec_company_tax,
                sec_company_paybale: s.sec_company_paybale,
                sec_copay_percntage: s.sec_copay_percntage,
                sec_copay_amount: s.sec_copay_amount,
                created_by: req.userIdentity.algaeh_d_app_user_id,
                created_date: new Date(),
                updated_by: req.userIdentity.algaeh_d_app_user_id,
                updated_date: new Date()
              };
            })
            .ToArray();

          let detailsInsert = [];
          debugLog("befor Detail Insert Data", newDtls);
          bulkInputArrayObject(newDtls, detailsInsert);

          debugLog("Detail Insert Data", detailsInsert);

          db.query(
            "INSERT  INTO hims_f_billing_details (hims_f_billing_header_id, service_type_id,\
                     services_id, quantity, unit_cost,insurance_yesno,gross_amount, discount_amout, \
                     discount_percentage, net_amout, copay_percentage, copay_amount, \
                     deductable_amount, deductable_percentage, tax_inclusive, patient_tax, \
                     company_tax, total_tax, patient_resp, patient_payable, comapany_resp,\
                     company_payble, sec_company, sec_deductable_percentage, sec_deductable_amount,\
                     sec_company_res, sec_company_tax, sec_company_paybale, sec_copay_percntage, \
                     sec_copay_amount, created_by, created_date, updated_by, updated_date) VALUES ? ",
            [detailsInsert],
            (error, detailsRecords) => {
              if (error) {
                if (req.options == null) {
                  db.rollback(() => {
                    releaseDBConnection(req.db, db);
                    next(error);
                  });
                } else {
                  req.options.onFailure(error);
                }
              }
              if (req.options == null) {
                req.records = headerResult;
                releaseDBConnection(req.db, db);
                next();
              } else {
                req.options.onSuccess(headerResult);
              }
            }
          );
        }
      }
    );
  } catch (e) {
    next(e);
  }
};

//created by irfan: Adding bill headder and bill details
//AddBill
let addBill = (dataBase, req, res, callBack, isCommited, next) => {
  isCommited = isCommited || false;
  let db = req.db;

  let billingHeaderModel = {
    hims_f_billing_header_id: null,
    patient_id: null,
    billing_type_id: null,
    visit_id: null,
    bill_number: null,
    incharge_or_provider: null,
    bill_date: null,
    advance_amount: 0,
    discount_amount: 0,
    sub_total_amount: 0,
    total_tax: 0,
    net_total: 0,
    billing_status: null,
    copay_amount: 0,
    deductable_amount: 0,
    gross_total: 0,
    sheet_discount_amount: 0,
    sheet_discount_percentage: 0,
    net_amount: 0,
    patient_res: 0,
    company_res: 0,
    sec_company_res: 0,
    patient_payable: 0,
    company_payable: 0,
    sec_company_payable: 0,
    patient_tax: 0,
    company_tax: 0,
    sec_company_tax: 0,
    net_tax: 0,
    credit_amount: 0,
    receiveable_amount: 0,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    created_date: null,
    updated_by: req.userIdentity.algaeh_d_app_user_id,
    updated_date: null,
    record_status: null,
    cancel_remarks: null,
    cancel_by: null,
    bill_comments: null,
    advance_adjust: 0
  };

  try {
    debugFunction("addBill");

    if (dataBase == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    let inputParam = extend(billingHeaderModel, req.body);

    if (inputParam.billdetails == null || inputParam.billdetails.length == 0) {
      next(
        httpStatus.generateError(
          httpStatus.badRequest,
          "Please select atleast one service."
        )
      );
    }
    inputParam.hims_f_patient_visit_id = req.body.visit_id;

    dataBase.query(
      "select hims_f_patient_visit_id,visit_expiery_date from hims_f_patient_visit where hims_f_patient_visit_id=? \
           and record_status='A'",
      [inputParam.hims_f_patient_visit_id],

      (error, records) => {
        debugFunction("Test", error, records);
        if (error) {
          dataBase.rollback(() => {
            releaseDBConnection(db, dataBase);
            next(error);
          });
        }

        let fromDate;
        let toDate;
        if (records.length == 0) {
          fromDate = 0;
          toDate = 0;
        } else {
          fromDate = moment(records[0].visit_expiery_date).format("YYYYMMDD");
          toDate = moment(new Date()).format("YYYYMMDD");
        }

        if (toDate > fromDate) {
          dataBase.rollback(() => {
            releaseDBConnection(db, dataBase);
            next(
              httpStatus.generateError(
                httpStatus.badRequest,
                "Visit expired please create new visit to process"
              )
            );
          });
        } else {
          runningNumber(req.db, 3, "PAT_BILL", (error, records, newNumber) => {
            if (error) {
              dataBase.rollback(() => {
                releaseDBConnection(db, dataBase);
                next(error);
              });
            }
            debugLog("new Bill number : " + newNumber);
            inputParam["bill_number"] = newNumber;
            req.body.bill_number = newNumber;
            if (
              inputParam.sheet_discount_amount != 0 &&
              inputParam.bill_comments == ""
            ) {
              next(
                httpStatus.generateError(
                  httpStatus.badRequest,
                  "Please enter sheet level discount comments. "
                )
              );
            }
            dataBase.query(
              "INSERT INTO hims_f_billing_header ( patient_id, billing_type_id, visit_id, bill_number,\
                  incharge_or_provider, bill_date, advance_amount,advance_adjust, discount_amount \
                  , total_tax,  billing_status, sheet_discount_amount, sheet_discount_percentage, net_amount \
                  , company_res, sec_company_res, patient_payable, company_payable, sec_company_payable \
                  , patient_tax, company_tax, sec_company_tax, net_tax, credit_amount, receiveable_amount \
                  , created_by, created_date, updated_by, updated_date, copay_amount, deductable_amount) VALUES (?,?,?,?\
                    ,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                inputParam.patient_id,
                inputParam.billing_type_id,
                inputParam.visit_id,
                inputParam.bill_number,
                inputParam.incharge_or_provider,
                inputParam.bill_date,
                inputParam.advance_amount,
                inputParam.advance_adjust,
                inputParam.discount_amount,
                inputParam.total_tax,
                inputParam.billing_status,
                inputParam.sheet_discount_amount,
                inputParam.sheet_discount_percentage,
                inputParam.net_amount,
                inputParam.company_res,
                inputParam.sec_company_res,
                inputParam.patient_payable,
                inputParam.company_payable,
                inputParam.sec_company_payable,
                inputParam.patient_tax,
                inputParam.company_tax,
                inputParam.sec_company_tax,
                inputParam.net_tax,
                inputParam.credit_amount,
                inputParam.receiveable_amount,
                inputParam.created_by,
                inputParam.created_date,
                inputParam.updated_by,
                inputParam.updated_date,
                inputParam.copay_amount,
                inputParam.deductable_amount
              ],
              (error, headerResult) => {
                if (error) {
                  dataBase.rollback(() => {
                    releaseDBConnection(db, dataBase);
                    next(error);
                  });
                }
                // if a patient utilizing his advance amount for his current payment
                if (
                  headerResult.insertId != null &&
                  headerResult.insertId != "" &&
                  inputParam.advance_adjust > 0
                ) {
                  dataBase.query(
                    "SELECT advance_amount FROM hims_f_patient WHERE hims_d_patient_id=?",
                    [inputParam.patient_id],
                    (error, result) => {
                      if (error) {
                        releaseDBConnection(db, dataBase);
                        next(error);
                      }
                      let existingAdvance = result[0].advance_amount;
                      debugLog("existingAdvance:", existingAdvance);
                      debugLog("before ", inputParam.advance_adjust);
                      if (result.length != 0) {
                        inputParam.advance_amount =
                          existingAdvance - inputParam.advance_adjust;

                        debugLog("after ", inputParam.advance_amount);
                        dataBase.query(
                          "UPDATE  `hims_f_patient` SET  `advance_amount`=?, \
                          `updated_by`=?, `updated_date`=? WHERE `hims_d_patient_id`=?",
                          [
                            inputParam.advance_amount,
                            inputParam.updated_by,
                            new Date(),
                            inputParam.patient_id
                          ],
                          (error, subtractAdvance) => {
                            if (error) {
                              dataBase.rollback(() => {
                                releaseDBConnection(db, dataBase);
                                next(error);
                              });
                            }
                          }
                        );
                      }
                    }
                  );
                }

                if (
                  headerResult.insertId != null &&
                  headerResult.insertId != ""
                ) {
                  // req.billing_header_id = headerResult.insertId;
                  let detailsInsert = [];
                  bulkInputArrayObject(inputParam.billdetails, detailsInsert, {
                    hims_f_billing_header_id: headerResult.insertId
                  });

                  dataBase.query(
                    "INSERT  INTO hims_f_billing_details (hims_f_billing_details_id,hims_f_billing_header_id, service_type_id,\
                           services_id, quantity, unit_cost,insurance_yesno,gross_amount, discount_amout, \
                           discount_percentage, net_amout, copay_percentage, copay_amount, \
                           deductable_amount, deductable_percentage, tax_inclusive, patient_tax, \
                           company_tax, total_tax, patient_resp, patient_payable, comapany_resp,\
                           company_payble, sec_company, sec_deductable_percentage, sec_deductable_amount,\
                           sec_company_res, sec_company_tax, sec_company_paybale, sec_copay_percntage, \
                           sec_copay_amount, created_by, created_date, updated_by, updated_date) VALUES ? ",
                    [detailsInsert],
                    (error, detailsRecords) => {
                      if (error) {
                        dataBase.rollback(() => {
                          releaseDBConnection(db, dataBase);
                          next(error);
                        });
                      }
                      //headerResult
                      if (typeof callBack == "function") {
                        callBack(error, headerResult);
                      }
                    }
                  );
                } else {
                  debuglog("Data is not inerted to billing header");
                  next(
                    httpStatus.generateError(
                      httpStatus.badRequest,
                      "Technical issue while billis notinserted"
                    )
                  );
                }
              }
            );
          });
        }
      }
    );
  } catch (e) {
    next(e);
  }
};

//created by:irfan, add receipt headder and details
//AddReceipt
let newReceipt = (dataBase, req, res, callBack, next) => {
  let P_receiptHeaderModel = {
    hims_f_receipt_header_id: null,
    receipt_number: null,
    receipt_date: null,
    billing_header_id: null,
    total_amount: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    created_date: null,
    updated_by: req.userIdentity.algaeh_d_app_user_id,
    updated_date: null,
    record_status: null,
    counter_id: null,
    shift_id: null
  };
  let db = req.db;
  try {
    debugFunction("newReceiptFUnc");

    if (dataBase == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    let inputParam = extend(P_receiptHeaderModel, req.body);
    if (
      inputParam.receiptdetails == null ||
      inputParam.receiptdetails.length == 0
    ) {
      next(
        httpStatus.generateError(
          httpStatus.badRequest,
          "Please select atleast one service."
        )
      );
    }

    runningNumber(req.db, 5, "PAT_RCPT", (error, numgenId, newNumber) => {
      if (error) {
        dataBase.rollback(() => {
          releaseDBConnection(db, dataBase);
          next(error);
        });
      }
      debugLog("new receipt number : " + newNumber);
      inputParam["receipt_number"] = newNumber;
      req.body.receipt_number = newNumber;
      debugLog("bil hdr id:", inputParam.billing_header_id);

      dataBase.query(
        "INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, total_amount,\
             created_by, created_date, updated_by, updated_date,  counter_id, shift_id) VALUES (?,?,?\
          ,?,?,?,?,?,?)",
        [
          inputParam.receipt_number,
          new Date(),

          inputParam.total_amount,
          inputParam.created_by,
          new Date(),
          inputParam.updated_by,
          new Date(),
          inputParam.counter_id,
          inputParam.shift_id
        ],
        (error, headerRcptResult) => {
          if (error) {
            dataBase.rollback(() => {
              releaseDBConnection(db, dataBase);
              next(error);
            });
          }
          if (
            headerRcptResult.insertId != null &&
            headerRcptResult.insertId != ""
          ) {
            // let detailsInsert = [];

            // bulkInputArrayObject(
            //   inputParam.receiptdetails,
            //   detailsInsert,
            //   {
            //     hims_f_receipt_header_id: headerRcptResult.insertId
            //   },
            //   req
            // );
            const receptSample = [
              "card_check_number",
              "expiry_date",
              "pay_type",
              "amount",
              "created_by",
              "updated_by",
              "card_type"
            ];

            dataBase.query(
              "INSERT  INTO hims_f_receipt_details ( " +
                receptSample.join(",") +
                ",hims_f_receipt_header_id) VALUES ? ",
              [
                jsonArrayToObject({
                  sampleInputObject: receptSample,
                  arrayObj: inputParam.receiptdetails,
                  req: req,
                  newFieldToInsert: [headerRcptResult.insertId]
                })
              ],
              (error, RcptDetailsRecords) => {
                if (error) {
                  dataBase.rollback(() => {
                    releaseDBConnection(db, dataBase);
                    next(error);
                  });
                }
                if (typeof callBack == "function") {
                  callBack(error, headerRcptResult);
                }
              }
            );
          } else {
            debuglog("Data is not inerted to billing header");
            next(
              httpStatus.generateError(
                httpStatus.badRequest,
                "Technical issue while billis notinserted"
              )
            );
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: performing only calculation
let billingCalculations = (req, res, next) => {
  try {
    let hasCalculateall =
      req.body.intCalculateall == undefined ? true : req.body.intCalculateall;
    let inputParam =
      req.body.intCalculateall == undefined ? req.body.billdetails : req.body;
    if (inputParam.length == 0) {
      next(
        httpStatus.generateError(
          httpStatus.badRequest,
          "Please select atleast one service"
        )
      );
    }
    let sendingObject = {};

    debugLog("bool Value: ", hasCalculateall);
    debugLog("Input", req.body);
    if (hasCalculateall == true) {
      sendingObject.sub_total_amount = new LINQ(inputParam).Sum(
        d => d.gross_amount
      );
      sendingObject.net_total = new LINQ(inputParam).Sum(d => d.net_amout);
      sendingObject.discount_amount = new LINQ(inputParam).Sum(
        d => d.discount_amout
      );
      sendingObject.gross_total = new LINQ(inputParam).Sum(
        d => d.patient_payable
      );

      // Primary Insurance
      sendingObject.copay_amount = new LINQ(inputParam).Sum(
        d => d.copay_amount
      );
      sendingObject.deductable_amount = new LINQ(inputParam).Sum(
        d => d.deductable_amount
      );

      // Secondary Insurance
      sendingObject.sec_copay_amount = new LINQ(inputParam).Sum(
        d => d.sec_copay_amount
      );
      sendingObject.sec_deductable_amount = new LINQ(inputParam).Sum(
        d => d.sec_deductable_amount
      );

      // Responsibilities
      sendingObject.patient_res = new LINQ(inputParam).Sum(d => d.patient_resp);
      sendingObject.company_res = new LINQ(inputParam).Sum(
        d => d.comapany_resp
      );
      sendingObject.sec_company_res = new LINQ(inputParam).Sum(
        d => d.sec_company_res
      );

      // Tax Calculation
      sendingObject.total_tax = new LINQ(inputParam).Sum(d => d.total_tax);
      sendingObject.patient_tax = new LINQ(inputParam).Sum(d => d.patient_tax);
      sendingObject.company_tax = new LINQ(inputParam).Sum(d => d.company_tax);
      sendingObject.sec_company_tax = new LINQ(inputParam).Sum(
        d => d.sec_company_tax
      );

      // Payables
      sendingObject.patient_payable = new LINQ(inputParam).Sum(
        d => d.patient_payable
      );

      sendingObject.company_payble = new LINQ(inputParam).Sum(
        d => d.company_payble
      );
      sendingObject.sec_company_paybale = new LINQ(inputParam).Sum(
        d => d.sec_company_paybale
      );
      // Sheet Level Discount Nullify
      sendingObject.sheet_discount_amount = 0;
      sendingObject.sheet_discount_percentage = 0;
      sendingObject.advance_adjust = 0;
      sendingObject.net_amount = sendingObject.patient_payable;
      if (inputParam.credit_amount > 0) {
        sendingObject.receiveable_amount =
          sendingObject.net_amount - inputParam.credit_amount;
      } else {
        sendingObject.receiveable_amount = sendingObject.net_amount;
      }

      //Reciept
      sendingObject.cash_amount = sendingObject.receiveable_amount;
      sendingObject.total_amount = sendingObject.receiveable_amount;

      sendingObject.unbalanced_amount = 0;
      sendingObject.card_amount = 0;
      sendingObject.cheque_amount = 0;

      sendingObject.patient_payable = math.round(
        sendingObject.patient_payable,
        2
      );
      sendingObject.total_tax = math.round(sendingObject.total_tax, 2);
      sendingObject.patient_tax = math.round(sendingObject.patient_tax, 2);
      sendingObject.company_tax = math.round(sendingObject.company_tax, 2);
      sendingObject.sec_company_tax = math.round(
        sendingObject.sec_company_tax,
        2
      );
    } else {
      //Reciept

      if (inputParam.isReceipt == false) {
        // Sheet Level Discount Nullify
        sendingObject.sheet_discount_percentage = 0;
        sendingObject.sheet_discount_amount = 0;

        if (inputParam.sheet_discount_amount > 0) {
          sendingObject.sheet_discount_percentage =
            (inputParam.sheet_discount_amount / inputParam.gross_total) * 100;

          sendingObject.sheet_discount_amount =
            inputParam.sheet_discount_amount;
        } else if (inputParam.sheet_discount_percentage > 0) {
          sendingObject.sheet_discount_percentage =
            inputParam.sheet_discount_percentage;
          sendingObject.sheet_discount_amount =
            (inputParam.gross_total * inputParam.sheet_discount_percentage) /
            100;
        }

        sendingObject.sheet_discount_amount = math.round(
          sendingObject.sheet_discount_amount,
          2
        );
        sendingObject.sheet_discount_percentage = math.round(
          sendingObject.sheet_discount_percentage,
          2
        );

        sendingObject.net_amount =
          inputParam.gross_total - sendingObject.sheet_discount_amount;

        if (inputParam.credit_amount > 0) {
          sendingObject.receiveable_amount =
            sendingObject.net_amount -
            inputParam.advance_adjust -
            inputParam.credit_amount;
        } else {
          sendingObject.receiveable_amount =
            sendingObject.net_amount - inputParam.advance_adjust;
        }

        sendingObject.cash_amount = sendingObject.receiveable_amount;
        sendingObject.card_amount = 0;
        sendingObject.cheque_amount = 0;
      } else {
        sendingObject.card_amount = inputParam.card_amount;
        sendingObject.cheque_amount = inputParam.cheque_amount;
        sendingObject.cash_amount = inputParam.cash_amount;
        sendingObject.receiveable_amount = inputParam.receiveable_amount;
      }

      sendingObject.total_amount =
        sendingObject.cash_amount +
        sendingObject.card_amount +
        sendingObject.cheque_amount;

      sendingObject.unbalanced_amount =
        sendingObject.receiveable_amount - sendingObject.total_amount;
    }

    // debugLog("patient_payable", sendingObject.patient_payable);
    req.records = sendingObject;
    next();
  } catch (e) {
    next(e);
  }
};
//logic part for getBill details API
let getBillDetailsFunctionality = (req, res, next, resolve) => {
  let billingDetailsModel = {
    hims_f_billing_details_id: null,
    hims_f_billing_header_id: null,
    service_type_id: null,
    services_id: null,
    quantity: 0,
    unit_cost: 0,
    insurance_yesno: null,
    gross_amount: 0,
    discount_amout: 0,
    discount_percentage: 0,
    net_amout: 0,
    copay_percentage: 0,
    copay_amount: 0,
    deductable_amount: 0,
    deductable_percentage: 0,
    tax_inclusive: "N",
    patient_tax: 0,
    company_tax: 0,
    total_tax: 0,
    patient_resp: 0,
    patient_payable: 0,
    comapany_resp: 0,
    company_payble: 0,
    // sec_company: 0,
    sec_deductable_percentage: 0,
    sec_deductable_amount: 0,
    sec_company_res: 0,
    sec_company_tax: 0,
    sec_company_paybale: 0,
    sec_copay_percntage: 0,
    sec_copay_amount: 0,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    created_date: null,
    updated_by: req.userIdentity.algaeh_d_app_user_id,
    updated_date: null
  };
  let servicesModel = {
    hims_d_services_id: null,
    service_code: null,
    cpt_code: null,
    service_name: null,
    service_desc: null,
    sub_department_id: null,
    hospital_id: null,
    service_type_id: null,
    standard_fee: null,
    discount: null,
    effective_start_date: null,
    effectice_end_date: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    created_date: null,
    updated_by: req.userIdentity.algaeh_d_app_user_id,
    updated_date: null,
    record_status: null
  };

  debugFunction("getBillDetailsFunctionality");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    debugLog("req.body");

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      debugLog("erroe");
      // debugLog("Service ID:",  servicesDetails.hims_d_services_id);
      let service_ids = null;
      let questions = "?";
      debugLog("req.body", req.body);
      if (Array.isArray(req.body)) {
        let len = req.body.length;
        service_ids = new LINQ(req.body).Select(g => g.hims_d_services_id);

        for (let i = 1; i < len; i++) {
          questions += ",?";
        }
      }

      connection.query(
        "SELECT * FROM `hims_d_services` WHERE `hims_d_services_id` IN (" +
          questions +
          ") AND record_status='A'",
        service_ids.items,
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          let outputArray = [];
          for (let m = 0; m < result.length; m++) {
            let servicesDetails = extend(
              {
                hims_d_services_id: null,
                service_code: null,
                cpt_code: null,
                service_name: null,
                service_desc: null,
                sub_department_id: null,
                hospital_id: null,
                service_type_id: null,
                standard_fee: null,
                discount: null,
                effective_start_date: null,
                effectice_end_date: null,
                created_by: req.userIdentity.algaeh_d_app_user_id,
                created_date: null,
                updated_by: req.userIdentity.algaeh_d_app_user_id,
                updated_date: null,
                record_status: null
              },
              req.body[m]
            );

            let records = result[m];
            req.body[m].service_type_id = result[m].service_type_id;
            req.body[m].services_id = servicesDetails.hims_d_services_id;

            //Calculation Declarations
            let unit_cost =
              servicesDetails.unit_cost == undefined
                ? 0
                : servicesDetails.unit_cost;

            let zeroBill =
              servicesDetails.zeroBill == undefined
                ? false
                : servicesDetails.zeroBill;

            let FollowUp =
              servicesDetails.FollowUp == undefined
                ? false
                : servicesDetails.FollowUp;
            let gross_amount = 0,
              net_amout = 0,
              sec_unit_cost = 0;

            let patient_resp = 0,
              patient_payable = 0;

            let copay_percentage = 0,
              copay_amount = 0,
              sec_copay_percntage = 0,
              sec_copay_amount = 0;

            let comapany_resp = 0,
              company_payble = 0,
              sec_company_res = 0,
              sec_company_paybale = 0;

            let patient_tax = 0,
              company_tax = 0,
              sec_company_tax = 0,
              total_tax = 0;

            let after_dect_amout = 0,
              deductable_percentage = 0,
              deductable_amount = 0;

            let sec_deductable_percentage = 0,
              sec_deductable_amount = 0;
            let conversion_factor =
              servicesDetails.conversion_factor == undefined
                ? 0
                : servicesDetails.conversion_factor;
            let quantity =
              servicesDetails.quantity == undefined
                ? 1
                : servicesDetails.quantity;

            let discount_amout =
              servicesDetails.discount_amout == undefined
                ? 0
                : servicesDetails.discount_amout;

            let discount_percentage =
              servicesDetails.discount_percentage == undefined
                ? 0
                : servicesDetails.discount_percentage;

            let insured =
              servicesDetails.insured == undefined
                ? "N"
                : servicesDetails.insured;

            let sec_insured =
              servicesDetails.sec_insured == undefined
                ? "N"
                : servicesDetails.sec_insured;

            let approval_amt =
              servicesDetails.approval_amt == undefined
                ? 0
                : servicesDetails.approval_amt;
            let approval_limit_yesno =
              servicesDetails.approval_limit_yesno == undefined
                ? "N"
                : servicesDetails.approval_limit_yesno;

            let apprv_status =
              servicesDetails.apprv_status == undefined
                ? "NR"
                : servicesDetails.apprv_status;

            let approved_amount =
              servicesDetails.approved_amount == undefined
                ? 0
                : servicesDetails.approved_amount;
            debugLog("Pre app", servicesDetails.pre_approval);
            let pre_approval =
              servicesDetails.pre_approval == undefined
                ? "N"
                : servicesDetails.pre_approval;

            let vat_applicable = servicesDetails.vat_applicable;
            let preapp_limit_exceed = "N";
            let ser_net_amount = 0;
            let ser_gross_amt = 0;
            let icd_code = "";
            let covered = "Y";
            let preapp_limit_amount =
              servicesDetails.preapp_limit_amount == undefined
                ? 0
                : servicesDetails.preapp_limit_amount;
            debugLog("zeroBill: ", zeroBill);
            if (zeroBill === true) {
              let out = {
                hims_f_billing_details_id: null,
                hims_f_billing_header_id: null,
                service_type_id: records.service_type_id,
                service_name: records.service_name,
                services_id: servicesDetails.hims_d_services_id,
                quantity: 1,
                unit_cost: 0,
                insurance_yesno: null,
                gross_amount: 0,
                discount_amout: 0,
                discount_percentage: 0,
                net_amout: 0,
                copay_percentage: 0,
                copay_amount: 0,
                deductable_amount: 0,
                deductable_percentage: 0,
                tax_inclusive: "N",
                patient_tax: 0,
                company_tax: 0,
                total_tax: 0,
                patient_resp: 0,
                patient_payable: 0,
                comapany_resp: 0,
                company_payble: 0,

                sec_deductable_percentage: 0,
                sec_deductable_amount: 0,
                sec_company_res: 0,
                sec_company_tax: 0,
                sec_company_paybale: 0,
                sec_copay_percntage: 0,
                sec_copay_amount: 0
              };
              outputArray.push(out);
              req.records = { billdetails: outputArray };
              next();
              return;
            }

            debugLog("After zeroBill: ", zeroBill);
            new Promise((resolve, reject) => {
              try {
                if (insured == "Y") {
                  // let callInsurance =
                  debugLog("Data: ", req.body[m]);
                  req.body[m].insurance_id =
                    req.body[m].primary_insurance_provider_id;
                  req.body[m].hims_d_insurance_network_office_id =
                    req.body[m].primary_network_office_id;
                  req.body[m].network_id = req.body[m].primary_network_id;

                  insuranceServiceDetails(
                    req.body[m],
                    req.db,
                    next,
                    connection,
                    resolve
                  );
                  //if (callInsurance != null) resolve(callInsurance);
                } else if (sec_insured == "Y") {
                  req.body[m].insurance_id =
                    req.body[m].secondary_insurance_provider_id;
                  req.body[m].hims_d_insurance_network_office_id =
                    req.body[m].secondary_network_office_id;
                  req.body[m].network_id = req.body[m].secondary_network_id;

                  insuranceServiceDetails(
                    req.body[m],
                    req.db,
                    next,
                    connection,
                    resolve
                  );
                } else {
                  resolve({});
                }
              } catch (e) {
                reject(e);
              }
            })
              .then(policydtls => {
                if (
                  covered == "N" ||
                  (pre_approval == "Y" && apprv_status == "RJ")
                ) {
                  insured = "N";
                }

                if (approval_limit_yesno == "Y") {
                  pre_approval = "Y";
                }

                if (pre_approval == "N") {
                  pre_approval =
                    policydtls !== null ? policydtls.pre_approval : "N";
                }

                covered = policydtls !== null ? policydtls.covered : "Y";

                icd_code =
                  policydtls.cpt_code !== null
                    ? policydtls.cpt_code
                    : records.cpt_code;

                if (insured == "Y" && policydtls.covered == "Y") {
                  ser_net_amount = policydtls.net_amount;
                  ser_gross_amt = policydtls.gross_amt;

                  if (policydtls.company_service_price_type == "N") {
                    unit_cost =
                      unit_cost != 0 ? unit_cost : policydtls.net_amount;
                  } else {
                    unit_cost =
                      unit_cost != 0 ? unit_cost : policydtls.gross_amt;
                  }

                  if (conversion_factor != 0) {
                    unit_cost = unit_cost * conversion_factor;
                  }
                  gross_amount = quantity * unit_cost;

                  if (discount_amout > 0) {
                    discount_percentage = (discount_amout / gross_amount) * 100;
                  } else if (discount_percentage > 0) {
                    discount_amout = (gross_amount * discount_percentage) / 100;
                    discount_amout = math.round(discount_amout, 2);
                  }
                  net_amout = gross_amount - discount_amout;

                  //Patient And Company
                  if (policydtls.copay_status == "Y") {
                    copay_amount = policydtls.copay_amt;
                    copay_percentage = (copay_amount / net_amout) * 100;
                  } else {
                    debugLog("policydtls: ", policydtls);

                    if (
                      appsettings.hims_d_service_type.service_type_id
                        .Consultation == records.service_type_id
                    ) {
                      copay_percentage = policydtls.copay_consultation;
                      deductable_percentage = policydtls.deductible;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Procedure == records.service_type_id
                    ) {
                      copay_percentage = policydtls.copay_percent_trt;
                      deductable_percentage = policydtls.deductible_trt;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Provider == records.service_type_id
                    ) {
                      copay_percentage = policydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .InventoryItem == records.service_type_id
                    ) {
                      //Not there
                      copay_percentage = policydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id.Lab ==
                      records.service_type_id
                    ) {
                      copay_percentage = policydtls.copay_percent;
                      deductable_percentage = policydtls.deductible_lab;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .NursingCare == records.service_type_id
                    ) {
                      //Not There
                      copay_percentage = policydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Miscellaneous == records.service_type_id
                    ) {
                      //Not There
                      copay_percentage = policydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Anesthesia == records.service_type_id
                    ) {
                      //Not There
                      copay_percentage = policydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id.Bed ==
                      records.service_type_id
                    ) {
                      //Not There
                      copay_percentage = policydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id.OT ==
                      records.service_type_id
                    ) {
                      //Not There
                      copay_percentage = policydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Radiology == records.service_type_id
                    ) {
                      copay_percentage = policydtls.copay_percent_rad;
                      deductable_percentage = policydtls.deductible_rad;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Pharmacy == records.service_type_id
                    ) {
                      copay_percentage = policydtls.copay_medicine;
                      deductable_percentage = policydtls.deductible_medicine;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .NonService == records.service_type_id
                    ) {
                      //Not There
                      copay_percentage = policydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id.Package ==
                      records.service_type_id
                    ) {
                      //Not There
                      copay_percentage = policydtls.copay_percent;
                    }

                    deductable_amount =
                      (net_amout * deductable_percentage) / 100;
                    after_dect_amout = net_amout - deductable_amount;
                    copay_amount = (after_dect_amout * copay_percentage) / 100;
                    copay_amount = math.round(copay_amount, 2);
                  }

                  debugLog("net_amout: ", net_amout);
                  debugLog("copay_amount: ", copay_amount);
                  patient_resp = copay_amount + deductable_amount;
                  comapany_resp = math.round(net_amout - patient_resp, 2);

                  debugLog("patient_resp: ", patient_resp);

                  if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                    patient_tax = math.round(
                      (patient_resp * records.vat_percent) / 100,
                      2
                    );
                  }

                  if (records.vat_applicable == "Y") {
                    company_tax = math.round(
                      (comapany_resp * records.vat_percent) / 100,
                      2
                    );
                  }
                  total_tax = math.round(patient_tax + company_tax, 2);

                  patient_payable = math.round(patient_resp + patient_tax, 2);
                  console.log("approved_amount: ", approved_amount);
                  console.log("unit_cost: ", unit_cost);

                  if (approved_amount !== 0 && approved_amount < unit_cost) {
                    let diff_val = approved_amount - comapany_resp;
                    patient_payable = math.round(patient_payable + diff_val, 2);
                    patient_resp = math.round(patient_resp + diff_val, 2);
                    comapany_resp = comapany_resp - diff_val;
                  }

                  debugLog("comapany_resp 2: ", comapany_resp);

                  company_payble = net_amout - patient_resp;

                  company_payble = math.round(company_payble + company_tax, 2);

                  preapp_limit_amount = policydtls.preapp_limit;
                  if (policydtls.preapp_limit !== 0) {
                    approval_amt = approval_amt + company_payble;
                    if (approval_amt > policydtls.preapp_limit) {
                      preapp_limit_exceed = "Y";
                    }
                  }

                  //If primary and secondary exists
                  if (sec_insured == "Y") {
                    req.body[m].insurance_id =
                      req.body[m].secondary_insurance_provider_id;
                    req.body[m].hims_d_insurance_network_office_id =
                      req.body[m].secondary_network_office_id;
                    req.body[m].network_id = req.body[m].secondary_network_id;
                    //Secondary Insurance
                    return new Promise((resolve, reject) => {
                      try {
                        // let callInsurance =
                        insuranceServiceDetails(
                          req.body[m],
                          req.db,
                          next,
                          connection,
                          resolve
                        );
                        //if (callInsurance != null) resolve(callInsurance);
                      } catch (e) {
                        reject(e);
                      }
                    });
                  }
                } else {
                  if (FollowUp === true) {
                    unit_cost =
                      unit_cost != 0 ? unit_cost : records.followup_free_fee;
                  } else {
                    unit_cost =
                      unit_cost != 0 ? unit_cost : records.standard_fee;
                  }

                  if (conversion_factor != 0) {
                    unit_cost = unit_cost * conversion_factor;
                  }
                  gross_amount = quantity * unit_cost;

                  if (discount_amout > 0) {
                    discount_percentage = (discount_amout / gross_amount) * 100;
                  } else if (discount_percentage > 0) {
                    discount_amout = (gross_amount * discount_percentage) / 100;
                    discount_amout = math.round(discount_amout, 2);
                  }
                  net_amout = gross_amount - discount_amout;
                  patient_resp = net_amout;

                  if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                    patient_tax = math.round(
                      (patient_resp * records.vat_percent) / 100,
                      2
                    );
                    total_tax = patient_tax;
                  }

                  // patient_payable = net_amout + patient_tax;
                  patient_payable = math.round(patient_resp + patient_tax, 2);
                }
              })

              .then(secpolicydtls => {
                if (secpolicydtls != null) {
                  debugFunction("secpolicydtls");
                  //secondary Insurance
                  sec_unit_cost = patient_resp;

                  //Patient And Company
                  if (secpolicydtls.copay_status == "Y") {
                    debugFunction("secpolicydtls Y");
                    sec_copay_amount = secpolicydtls.copay_amt;
                    sec_copay_percntage =
                      (sec_copay_amount / sec_unit_cost) * 100;
                  } else {
                    debugFunction("secpolicydtls N");
                    if (
                      appsettings.hims_d_service_type.service_type_id
                        .Consultation == records.service_type_id
                    ) {
                      sec_copay_percntage = secpolicydtls.copay_consultation;
                      sec_deductable_percentage = secpolicydtls.deductible;
                      debugLog("sec_copay_percntage", sec_copay_percntage);
                      debugLog(
                        "sec_deductable_percentage",
                        sec_deductable_percentage
                      );
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Procedure == records.service_type_id
                    ) {
                      sec_copay_percntage = secpolicydtls.copay_percent_trt;
                      sec_deductable_percentage = secpolicydtls.deductible_trt;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Provider == records.service_type_id
                    ) {
                      sec_copay_percntage = secpolicydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .InventoryItem == records.service_type_id
                    ) {
                      //Not there
                      sec_copay_percntage = secpolicydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id.Lab ==
                      records.service_type_id
                    ) {
                      sec_copay_percntage = secpolicydtls.copay_percent;
                      sec_deductable_percentage = secpolicydtls.deductible_lab;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .NursingCare == records.service_type_id
                    ) {
                      //Not There
                      sec_copay_percntage = secpolicydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Miscellaneous == records.service_type_id
                    ) {
                      //Not There
                      sec_copay_percntage = secpolicydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Anesthesia == records.service_type_id
                    ) {
                      //Not There
                      sec_copay_percntage = secpolicydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id.Bed ==
                      records.service_type_id
                    ) {
                      //Not There
                      sec_copay_percntage = secpolicydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id.OT ==
                      records.service_type_id
                    ) {
                      //Not There
                      sec_copay_percntage = secpolicydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Radiology == records.service_type_id
                    ) {
                      sec_copay_percntage = secpolicydtls.copay_percent_rad;
                      sec_deductable_percentage = secpolicydtls.deductible_rad;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Pharmacy == records.service_type_id
                    ) {
                      sec_copay_percntage = secpolicydtls.copay_medicine;
                      sec_deductable_percentage =
                        secpolicydtls.deductible_medicine;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .NonService == records.service_type_id
                    ) {
                      //Not There
                      sec_copay_percntage = secpolicydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id.Package ==
                      records.service_type_id
                    ) {
                      //Not There
                      sec_copay_percntage = secpolicydtls.copay_percent;
                    }

                    sec_deductable_amount =
                      (sec_unit_cost * sec_deductable_percentage) / 100;
                    after_dect_amout = sec_unit_cost - deductable_amount;

                    sec_copay_amount =
                      (after_dect_amout * sec_copay_percntage) / 100;

                    sec_copay_amount = math.round(sec_copay_amount, 2);
                  }

                  patient_resp = sec_copay_amount + sec_deductable_amount;
                  sec_company_res = sec_unit_cost - patient_resp;

                  if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                    patient_tax = math.round(
                      (patient_resp * records.vat_percent) / 100,
                      2
                    );
                  }

                  if (records.vat_applicable == "Y") {
                    sec_company_tax = math.round(
                      (sec_company_res * records.vat_percent) / 100,
                      2
                    );
                  }
                  total_tax = patient_tax + company_tax + sec_company_res;

                  patient_payable = math.round(patient_resp + patient_tax, 2);
                  sec_company_paybale =
                    sec_unit_cost - patient_resp + sec_company_tax;
                }
                let out = extend(
                  {
                    hims_f_billing_details_id: null,
                    hims_f_billing_header_id: null,
                    service_type_id: null,
                    services_id: null,
                    quantity: 0,
                    unit_cost: 0,
                    insurance_yesno: null,
                    gross_amount: 0,
                    discount_amout: 0,
                    discount_percentage: 0,
                    net_amout: 0,
                    copay_percentage: 0,
                    copay_amount: 0,
                    deductable_amount: 0,
                    deductable_percentage: 0,
                    tax_inclusive: "N",
                    patient_tax: 0,
                    company_tax: 0,
                    total_tax: 0,
                    patient_resp: 0,
                    patient_payable: 0,
                    comapany_resp: 0,
                    company_payble: 0,
                    // sec_company: 0,
                    sec_deductable_percentage: 0,
                    sec_deductable_amount: 0,
                    sec_company_res: 0,
                    sec_company_tax: 0,
                    sec_company_paybale: 0,
                    sec_copay_percntage: 0,
                    sec_copay_amount: 0
                    // created_by: req.userIdentity.algaeh_d_app_user_id,

                    // updated_by: req.userIdentity.algaeh_d_app_user_id
                  },
                  {
                    service_type_id: records.service_type_id,
                    service_name: records.service_name,
                    services_id: servicesDetails.hims_d_services_id,
                    quantity: quantity,
                    unit_cost: unit_cost,
                    gross_amount: gross_amount,
                    discount_amout: discount_amout,
                    discount_percentage: discount_percentage,
                    net_amout: net_amout,
                    patient_resp: patient_resp,
                    patient_payable: patient_payable,
                    copay_percentage: copay_percentage,
                    copay_amount: copay_amount,

                    comapany_resp: comapany_resp,
                    company_payble: company_payble,
                    patient_tax: patient_tax,
                    company_tax: company_tax,
                    sec_company_tax: sec_company_tax,
                    total_tax: total_tax,

                    sec_copay_percntage: sec_copay_percntage,
                    sec_copay_amount: sec_copay_amount,
                    sec_company_res: sec_company_res,
                    sec_company_paybale: sec_company_paybale,
                    pre_approval: pre_approval,
                    insurance_yesno: insured,
                    preapp_limit_exceed: preapp_limit_exceed,
                    approval_amt: approval_amt,
                    preapp_limit_amount: preapp_limit_amount,
                    approval_limit_yesno: approval_limit_yesno,
                    ser_net_amount: ser_net_amount,
                    ser_gross_amt: ser_gross_amt,
                    icd_code: icd_code,

                    sec_deductable_percentage: sec_deductable_percentage,
                    sec_deductable_amount: sec_deductable_amount,
                    deductable_percentage: deductable_percentage,
                    deductable_amount: deductable_amount,
                    item_id: servicesDetails.item_id,
                    expiry_date: servicesDetails.expirydt,
                    batchno: servicesDetails.batchno,
                    qtyhand: servicesDetails.qtyhand,
                    grnno: servicesDetails.grnno,
                    uom_id: servicesDetails.sales_uom,
                    item_category: servicesDetails.item_category_id,
                    item_group_id: servicesDetails.item_group_id
                  }
                );

                outputArray.push(out);
              })
              .then(() => {
                if (m == result.length - 1) {
                  debugLog("outputArray", outputArray);
                  return resolve({ billdetails: outputArray });
                }
              })
              .catch(e => {
                next(httpStatus.generateError(httpStatus.badRequest, e));
              });
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by:irfan, Patient-receipt if advance or  Refund to patient
let patientAdvanceRefund = (req, res, next) => {
  let P_receiptHeaderModel = {
    hims_f_receipt_header_id: null,
    receipt_number: null,
    receipt_date: null,
    billing_header_id: null,
    total_amount: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id,

    record_status: null,
    counter_id: null,
    shift_id: null,
    pay_type: null
  };

  let advanceModel = {
    hims_f_patient_id: null,
    hims_f_receipt_header_id: null,
    transaction_type: null,
    advance_amount: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  debugFunction("patientAdvanceRefund");

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

        let inputParam = extend(P_receiptHeaderModel, req.body);
        if (
          inputParam.receiptdetails == null ||
          inputParam.receiptdetails.length == 0
        ) {
          next(
            httpStatus.generateError(
              httpStatus.badRequest,
              "Please select atleast one service."
            )
          );
        }
        let RCPT_or_PYMNT_NUM = null;
        // fuction for advance recieved from patient
        if (inputParam.pay_type == "R") {
          runningNumber(req.db, 5, "PAT_RCPT", (error, numgenId, newNumber) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            req.query.receipt_number = newNumber;
            req.body.receipt_number = newNumber;
            inputParam.receipt_number = newNumber;
            debugLog("new R for recpt number:", newNumber);
            // receipt header table insert
            connection.query(
              "INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, billing_header_id, total_amount,\
         created_by, created_date, updated_by, updated_date,  counter_id, shift_id, pay_type) VALUES (?,?,?\
      ,?,?,?,?,?,?,?,?)",
              [
                inputParam.receipt_number,
                new Date(),
                inputParam.billing_header_id,
                inputParam.total_amount,
                inputParam.created_by,
                new Date(),
                inputParam.updated_by,
                new Date(),
                inputParam.counter_id,
                inputParam.shift_id,
                inputParam.pay_type
              ],
              (error, headerRcptResult) => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }

                debugFunction("inside header result");
                if (
                  headerRcptResult.insertId != null &&
                  headerRcptResult.insertId != ""
                ) {
                  //   let detailsInsert = [];

                  // bulkInputArrayObject(
                  //   inputParam.receiptdetails,
                  //   detailsInsert,
                  //   {
                  //     hims_f_receipt_header_id: headerRcptResult.insertId
                  //   }
                  // );
                  // receipt details table insert
                  const receptSample = [
                    "card_check_number",
                    "expiry_date",
                    "pay_type",
                    "amount",
                    "created_by",
                    "updated_by",
                    "card_type"
                  ];

                  connection.query(
                    "INSERT  INTO hims_f_receipt_details ( " +
                      receptSample.join(",") +
                      ",hims_f_receipt_header_id) VALUES ? ",
                    [
                      jsonArrayToObject({
                        sampleInputObject: receptSample,
                        arrayObj: inputParam.receiptdetails,
                        req: req,
                        newFieldToInsert: [headerRcptResult.insertId]
                      })
                    ],
                    (error, RcptDetailsRecords) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      debugFunction("inside details result");

                      let inputParameters = extend(advanceModel, req.body);

                      //  if (inputParameters.transaction_type)
                      // patient advance table insert
                      connection.query(
                        "INSERT  INTO hims_f_patient_advance ( hims_f_patient_id, hims_f_receipt_header_id,\
                        transaction_type, advance_amount, created_by, \
                   created_date, updated_by, update_date,  record_status) VALUES (?,?,?,?,?,?,?,?,?) ",
                        [
                          inputParameters.hims_f_patient_id,
                          headerRcptResult.insertId,
                          inputParameters.transaction_type,
                          inputParameters.advance_amount,
                          inputParameters.created_by,
                          new Date(),
                          inputParameters.updated_by,
                          new Date(),
                          inputParameters.record_status
                        ],
                        (error, AdvanceRecords) => {
                          if (error) {
                            connection.rollback(() => {
                              releaseDBConnection(db, connection);
                              next(error);
                            });
                          }
                          debugFunction("inside patient advance result");
                          connection.query(
                            "SELECT advance_amount FROM hims_f_patient WHERE hims_d_patient_id=?",
                            [inputParameters.hims_f_patient_id],
                            (error, result) => {
                              if (error) {
                                releaseDBConnection(db, connection);
                                next(error);
                              }
                              let existingAdvance = result[0].advance_amount;
                              if (result.length != 0) {
                                //advance adding
                                if (inputParameters.transaction_type == "AD") {
                                  inputParameters.advance_amount += existingAdvance;
                                  debugLog("existingAdvance:", existingAdvance);

                                  connection.query(
                                    "UPDATE  `hims_f_patient` SET  `advance_amount`=?, \
                           `updated_by`=?, `updated_date`=? WHERE `hims_d_patient_id`=?",
                                    [
                                      inputParameters.advance_amount,
                                      inputParameters.updated_by,
                                      new Date(),
                                      inputParameters.hims_f_patient_id
                                    ],
                                    (error, appendAdvance) => {
                                      if (error) {
                                        connection.rollback(() => {
                                          releaseDBConnection(db, connection);
                                          next(error);
                                        });
                                      }

                                      //commit comes here

                                      connection.commit(error => {
                                        releaseDBConnection(db, connection);
                                        if (error) {
                                          connection.rollback(() => {
                                            next(error);
                                          });
                                        }
                                        req.records = {
                                          receipt_number: newNumber,
                                          total_advance_amount:
                                            inputParameters.advance_amount
                                        };
                                        releaseDBConnection(db, connection);
                                        next();
                                      });
                                    }
                                  );
                                }

                                //refund  perform substraction
                                //       if (inputParameters.transaction_type == "RF") {
                                //         inputParameters.advance_amount =
                                //           existingAdvance -
                                //           inputParameters.advance_amount;
                                //         connection.query(
                                //           "UPDATE  `hims_f_patient` SET  `advance_amount`=?, \
                                //  `updated_by`=?, `updated_date`=? WHERE `hims_d_patient_id`=?",
                                //           [
                                //             inputParameters.advance_amount,
                                //             inputParameters.updated_by,
                                //             new Date(),
                                //             inputParameters.hims_f_patient_id
                                //           ],
                                //           (error, subtractAdvance) => {
                                //             if (error) {
                                //               connection.rollback(() => {
                                //                 releaseDBConnection(db, connection);
                                //                 next(error);
                                //               });
                                //             }

                                //             //commit comes here
                                //             connection.commit(error => {
                                //               releaseDBConnection(db, connection);
                                //               if (error) {
                                //                 connection.rollback(() => {
                                //                   next(error);
                                //                 });
                                //               }
                                //               req.records = {
                                //                 recieptNo: newNumber
                                //               };
                                //               next();
                                //             });
                                //           }
                                //         );
                                //       }
                                if (inputParameters.transaction_type == "CA") {
                                  // cancel
                                }
                              }
                            }
                          );
                        }
                      );
                    }
                  );
                } else {
                  debugLog("Data is not inerted to billing header");
                  next(
                    httpStatus.generateError(
                      httpStatus.badRequest,
                      "Technical issue while billis notinserted"
                    )
                  );
                }
              }
            );
          });
        }

        //function for payment to the patient
        if (inputParam.pay_type == "P") {
          runningNumber(req.db, 7, "PYMNT_NO", (error, numgenId, newNumber) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            debugLog("new PAYMENT no : ", newNumber);
            inputParam.receipt_number = newNumber;
            req.body.receipt_number = newNumber;

            //R-->recieved amount   P-->payback amount

            // receipt header table insert
            connection.query(
              "INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, billing_header_id, total_amount,\
created_by, created_date, updated_by, updated_date,  counter_id, shift_id, pay_type) VALUES (?,?,?\
,?,?,?,?,?,?,?,?)",
              [
                inputParam.receipt_number,
                new Date(),
                inputParam.billing_header_id,
                inputParam.total_amount,
                inputParam.created_by,
                new Date(),
                inputParam.updated_by,
                new Date(),
                inputParam.counter_id,
                inputParam.shift_id,
                inputParam.pay_type
              ],
              (error, headerRcptResult) => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }

                debugFunction("inside header result");
                if (
                  headerRcptResult.insertId != null &&
                  headerRcptResult.insertId != ""
                ) {
                  // let detailsInsert = [];

                  // bulkInputArrayObject(
                  //   inputParam.receiptdetails,
                  //   detailsInsert,
                  //   {
                  //     hims_f_receipt_header_id: headerRcptResult.insertId
                  //   }
                  // );
                  // receipt details table insert
                  const receptSample = [
                    "card_check_number",
                    "expiry_date",
                    "pay_type",
                    "amount",
                    "created_by",
                    "updated_by",
                    "card_type"
                  ];
                  connection.query(
                    "INSERT  INTO hims_f_receipt_details ( " +
                      receptSample.join(",") +
                      ",hims_f_receipt_header_id) VALUES ? ",
                    [
                      jsonArrayToObject({
                        sampleInputObject: receptSample,
                        arrayObj: inputParam.receiptdetails,
                        req: req,
                        newFieldToInsert: [headerRcptResult.insertId]
                      })
                    ],
                    (error, RcptDetailsRecords) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      debugFunction("inside details result");

                      let inputParameters = extend(advanceModel, req.body);

                      // patient advance table insert
                      connection.query(
                        "INSERT  INTO hims_f_patient_advance ( hims_f_patient_id, hims_f_receipt_header_id,\
          transaction_type, advance_amount, created_by, \
     created_date, updated_by, update_date,  record_status) VALUES (?,?,?,?,?,?,?,?,?) ",
                        [
                          inputParameters.hims_f_patient_id,
                          headerRcptResult.insertId,
                          inputParameters.transaction_type,
                          inputParameters.advance_amount,
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          inputParameters.record_status
                        ],
                        (error, AdvanceRecords) => {
                          if (error) {
                            connection.rollback(() => {
                              releaseDBConnection(db, connection);
                              next(error);
                            });
                          }
                          debugFunction("inside patient advance result");
                          connection.query(
                            "SELECT advance_amount FROM hims_f_patient WHERE hims_d_patient_id=?",
                            [inputParameters.hims_f_patient_id],
                            (error, result) => {
                              if (error) {
                                releaseDBConnection(db, connection);
                                next(error);
                              }
                              let existingAdvance = result[0].advance_amount;
                              if (result.length != 0) {
                                //advance adding
                                //                     if (inputParameters.transaction_type == "AD") {
                                //                       inputParameters.advance_amount += existingAdvance;
                                //                       debugLog("existingAdvance:", existingAdvance);

                                //                       connection.query(
                                //                         "UPDATE  `hims_f_patient` SET  `advance_amount`=?, \
                                //  `updated_by`=?, `updated_date`=? WHERE `hims_d_patient_id`=?",
                                //                         [
                                //                           inputParameters.advance_amount,
                                //                           inputParameters.updated_by,
                                //                           new Date(),
                                //                           inputParameters.hims_f_patient_id
                                //                         ],
                                //                         (error, appendAdvance) => {
                                //                           if (error) {
                                //                             connection.rollback(() => {
                                //                               releaseDBConnection(db, connection);
                                //                               next(error);
                                //                             });
                                //                           }

                                //                           //commit comes here

                                //                           connection.commit(error => {
                                //                             releaseDBConnection(db, connection);
                                //                             if (error) {
                                //                               connection.rollback(() => {
                                //                                 next(error);
                                //                               });
                                //                             }
                                //                             req.records = {
                                //                               RCPT_or_PYMNT_NUM: RCPT_or_PYMNT_NUM
                                //                             };
                                //                             next();
                                //                           });
                                //                         }
                                //                       );
                                //                     }

                                //refund  perform substraction
                                if (inputParameters.transaction_type == "RF") {
                                  inputParameters.advance_amount =
                                    existingAdvance -
                                    inputParameters.advance_amount;
                                  connection.query(
                                    "UPDATE  `hims_f_patient` SET  `advance_amount`=?, \
             `updated_by`=?, `updated_date`=? WHERE `hims_d_patient_id`=?",
                                    [
                                      inputParameters.advance_amount,
                                      req.userIdentity.algaeh_d_app_user_id,
                                      new Date(),
                                      inputParameters.hims_f_patient_id
                                    ],
                                    (error, subtractAdvance) => {
                                      if (error) {
                                        connection.rollback(() => {
                                          releaseDBConnection(db, connection);
                                          next(error);
                                        });
                                      }

                                      //commit comes here
                                      connection.commit(error => {
                                        if (error) {
                                          connection.rollback(() => {
                                            releaseDBConnection(db, connection);
                                            next(error);
                                          });
                                        }
                                        releaseDBConnection(db, connection);
                                        req.records = {
                                          payment_no: newNumber,
                                          total_advance_amount:
                                            inputParameters.advance_amount
                                        };
                                        next();
                                      });
                                    }
                                  );
                                }
                                if (inputParameters.transaction_type == "CA") {
                                  // cancel
                                }
                              }
                            }
                          );
                        }
                      );
                    }
                  );
                } else {
                  debugLog("Data is not inerted to billing header");
                  next(
                    httpStatus.generateError(
                      httpStatus.badRequest,
                      "Technical issue while billis notinserted"
                    )
                  );
                }
              }
            );
          }); //end of runing number PYMNT
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

function insuranceServiceDetails(body, db, next, connection, resolve) {
  // req = req;
  // let db = req.db;
  debugLog("reqbodyin insurance func:", body);
  let NetOffModel = {
    hims_d_insurance_network_office_id: null
  };
  let input = extend(NetOffModel, body);
  debugLog(
    "hims_d_insurance_network_office_id:",
    input.hims_d_insurance_network_office_id
  );

  debugLog("connection string:", connection);
  connection.query(
    "select price_from ,copay_consultation,copay_percent,copay_percent_rad,copay_percent_trt,copay_percent_dental,\
    copay_medicine, preapp_limit, deductible, deductible_lab,deductible_rad, deductible_trt, deductible_medicine from hims_d_insurance_network_office where hims_d_insurance_network_office_id=?",
    [input.hims_d_insurance_network_office_id],
    (error, resultOffic) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      debugLog("result of network offic", resultOffic);
      debugFunction("inside result of network office  ");

      // if s
      if (resultOffic != null && resultOffic[0].price_from == "S") {
        let insuranceModel = {
          insurance_id: null,
          service_type_id: null,
          services_id: null
        };
        let inputparam = extend(insuranceModel, body);
        debugLog("val second:", inputparam.insurance_id);

        connection.query(
          "select Inp.company_service_price_type,copay_status,copay_amt,deductable_status,deductable_amt,pre_approval,covered,\
           net_amount,gross_amt, cpt_code from hims_d_services_insurance sI inner join hims_d_insurance_provider Inp on\
           Inp.hims_d_insurance_provider_id=sI.insurance_id where sI.insurance_id =? and sI.service_type_id =? and \
           sI.services_id =?  and sI.record_status='A' and Inp.record_status='A'",
          [
            insuranceModel.insurance_id,
            insuranceModel.service_type_id,
            insuranceModel.services_id
          ],
          (error, result_s) => {
            if (error) {
              releaseDBConnection(db, connection);
              next(error);
            }
            debugFunction("inside result of second query if s is there  ");
            debugLog("S is :", result_s);
            // req.records = extend({
            //   insurence_result: result_s[0]
            // });

            let result = extend(result_s[0], resultOffic[0]);
            return resolve(result);
          }
        );
      }

      // if p
      if (resultOffic != null && resultOffic[0].price_from == "P") {
        let networkModel = {
          network_id: null,
          service_type_id: null,
          services_id: null
        };

        let input = extend(networkModel, body);
        connection.query(
          "select Inp.insurance_provider_name, Inp.company_service_price_type, net.network_type, \
          copay_status,copay_amt,deductable_status,deductable_amt,pre_approval,\
          net_amount,gross_amt from (( hims_d_services_insurance_network Sin\
          inner join hims_d_insurance_network net on net.hims_d_insurance_network_id=Sin.network_id) \
           inner join hims_d_insurance_provider Inp on Sin.insurance_id=Inp.hims_d_insurance_provider_id  )\
           where  Sin.network_id=? AND Sin.services_id=? and service_type_id=? and  Sin.record_status='A' and net.record_status='A'",
          [input.network_id, input.services_id, input.service_type_id],
          (error, result_p) => {
            if (error) {
              releaseDBConnection(db, connection);
              next(error);
            }
            debugLog("p is :", result_p);
            debugFunction("inside result of second query if  p is there  ");
            // req.records = extend({
            //   policy_result: result_p[0]
            // });
            extend(result_p, resultOffic);
            return resolve(result_p);
          }
        );
      }
    }
  );
}
//created by irfan to add episode and encounter
let addEpisodeEncounter = (connection, req, res, callBack, next) => {
  let episodeModel = {
    patient_id: null,
    provider_id: null,
    visit_id: null,
    source: null,
    status: null,
    episode_id: null,
    encounter_id: null,
    checked_in: null,
    nurse_examine: null,
    age: null,
    patient_type: null,
    queue_no: null
  };

  debugFunction("addEpisode");
  try {
    if (connection == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    let db = req.db;
    let input = extend(episodeModel, req.body);

    let currentEncounterNo = null;

    connection.query(
      "select encounter_id from hims_d_options where hims_d_options_id=1",
      (error, result) => {
        if (error) {
          releaseDBConnection(db, connection);
          next(error);
        }

        currentEncounterNo = result[0].encounter_id;
        debugLog("currentEncounterNo:", currentEncounterNo);

        if (currentEncounterNo > 0) {
          let nextEncounterNo = currentEncounterNo + 1;
          debugLog("nextEncounterNo:", nextEncounterNo);

          connection.query(
            "update hims_d_options set encounter_id=? where hims_d_options_id=1",
            [nextEncounterNo],
            (error, updateResult) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }

              if (updateResult != null) {
                connection.query(
                  "insert into hims_f_patient_encounter(patient_id,provider_id,visit_id,source,status,\
                       episode_id,encounter_id,checked_in,nurse_examine,age,patient_type,queue_no)values(\
                        ?,?,?,?,?,?,?,?,?,?,?,?)",
                  [
                    input.patient_id,
                    input.provider_id,
                    input.visit_id,
                    input.source,
                    input.status,
                    input.episode_id,
                    currentEncounterNo,
                    input.checked_in,
                    input.nurse_examine,
                    input.age,
                    input.patient_type,
                    input.queue_no
                  ],
                  (error, results) => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }
                    if (typeof callBack == "function") {
                      callBack(error, results);
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (e) {
    next(e);
  }
};

//Created by noor for synchronus
let addEpisodeEncounterData = (req, res, next) => {
  debugFunction("addEpisode");

  let db = req.options == null ? req.db : req.options.db;
  let input = extend(
    {
      patient_id: null,
      provider_id: null,
      visit_id: null,
      source: null,
      status: null,
      episode_id: null,
      encounter_id: null,
      checked_in: null,
      nurse_examine: null,
      age: null,
      payment_type: null,
      queue_no: null
    },
    req.body
  );

  debugLog("Input:", req.body);

  //created_date, created_by, updated_date, updated_by,
  db.query(
    "insert into hims_f_patient_encounter(patient_id,provider_id,visit_id,source,\
           episode_id,age,payment_type,created_date,created_by,updated_date,updated_by)values(\
            ?,?,?,?,?,?,?,?,?,?,?) ",
    [
      input.patient_id,
      input.provider_id,
      input.visit_id,
      input.source,
      input.episode_id,
      input.age,
      input.payment_type,
      new Date(),
      input.created_by,
      new Date(),
      input.updated_by
    ],
    (error, results) => {
      if (error) {
        debugLog("error", error);
        if (req.options == null) {
          connection.rollback(() => {
            releaseDBConnection(req.db, db);
            next(error);
          });
        }
      }
      db.query(
        "update hims_f_patient_appointment set visit_created='Y',updated_date=?, \
       updated_by=? where record_status='A' and hims_f_patient_appointment_id=?",
        [new Date(), input.updated_by, input.hims_f_patient_appointment_id],
        (error, patAppointment) => {
          if (error) {
            debugLog("error", error);
            if (req.options == null) {
              connection.rollback(() => {
                releaseDBConnection(req.db, db);
                next(error);
              });
            }
          }
          if (req.options == null) {
            req.records = results;
          } else {
            debugLog("Success");
            req.options.onSuccess(results);
          }
        }
      );
    }
  );

  // let currentEncounterNo = null;

  // db.query(
  //   "select encounter_id from hims_d_options where hims_d_options_id=1",
  //   (error, result) => {
  //     if (error) {
  //       if (req.options == null) {
  //         releaseDBConnection(req.db, db);
  //         next(error);
  //       } else {
  //         req.options.onFailure(error);
  //       }
  //     }

  //     debugLog("Episode", input);

  //     currentEncounterNo = result[0].encounter_id;
  //     if (currentEncounterNo > 0) {
  //       let nextEncounterNo = currentEncounterNo + 1;

  //       db.query(
  //         "update hims_d_options set encounter_id=? where hims_d_options_id=1",
  //         [nextEncounterNo],
  //         (error, updateResult) => {
  //           if (error) {
  //             if (req.options == null) {
  //               db.rollback(() => {
  //                 releaseDBConnection(req.db, db);
  //                 next(error);
  //               });
  //             } else {
  //               req.options.onFailure(error);
  //             }
  //           }

  //           if (updateResult != null) {
  //             db.query(
  //               "insert into hims_f_patient_encounter(patient_id,provider_id,visit_id,source,status,\
  //                      episode_id,encounter_id,checked_in,nurse_examine,age,patient_type,queue_no)values(\
  //                       ?,?,?,?,?,?,?,?,?,?,?,?)",
  //               [
  //                 input.patient_id,
  //                 input.provider_id,
  //                 input.visit_id,
  //                 input.source,
  //                 input.status,
  //                 input.episode_id,
  //                 currentEncounterNo,
  //                 input.checked_in,
  //                 input.nurse_examine,
  //                 input.age,
  //                 input.patient_type,
  //                 input.queue_no
  //               ],
  //               (error, results) => {
  //                 if (error) {
  //                   if (req.options == null) {
  //                     connection.rollback(() => {
  //                       releaseDBConnection(req.db, db);
  //                       next(error);
  //                     });
  //                   }
  //                 }
  //                 if (req.options == null) {
  //                   req.records = results;
  //                 } else {
  //                   req.options.onSuccess(results);
  //                 }
  //               }
  //             );
  //           }
  //         }
  //       );
  //     }
  //   }
  // );
};

//get bill details
let getBillDetails = (req, res, next) => {
  debugFunction("getBillDetails");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      new Promise((resolve, reject) => {
        try {
          getBillDetailsFunctionality(req, res, next, resolve);
        } catch (e) {
          reject(e);
        }
      }).then(result => {
        debugLog("result", result);
        req.records = result;
        releaseDBConnection(db, connection);
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//Created by noor for synchronus
let newReceiptData = (req, res, next) => {
  try {
    debugFunction("newReceiptFUnc");

    let db = req.options == null ? req.db : req.options.db;

    let inputParam = extend(
      {
        hims_f_receipt_header_id: null,
        receipt_number: null,
        receipt_date: null,
        billing_header_id: null,
        total_amount: null,
        created_by: req.userIdentity.algaeh_d_app_user_id,
        updated_by: req.userIdentity.algaeh_d_app_user_id,
        counter_id: null,
        shift_id: null
      },
      req.body
    );

    if (
      inputParam.receiptdetails == null ||
      inputParam.receiptdetails.length == 0
    ) {
      const genErr = httpStatus.generateError(
        httpStatus.badRequest,
        "Please select atleast one payment mode."
      );
      if (req.options == null) {
        next(genErr);
      } else {
        req.options.onFailure(genErr);
      }
    }
    inputParam.receipt_number = req.body.receipt_number;
    db.query(
      "INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, billing_header_id, total_amount,\
       created_by, created_date, updated_by, updated_date,  counter_id, shift_id) VALUES (?,?,?\
    ,?,?,?,?,?,?,?)",
      [
        inputParam.receipt_number,
        new Date(),
        inputParam.billing_header_id,
        inputParam.total_amount,
        inputParam.created_by,
        new Date(),
        inputParam.updated_by,
        new Date(),
        inputParam.counter_id,
        inputParam.shift_id
      ],
      (error, headerRcptResult) => {
        if (error) {
          if (req.options == null) {
            db.rollback(() => {
              releaseDBConnection(req.db, db);
              next(error);
            });
          } else {
            req.options.onSuccess(headerRcptResult);
          }
        }

        if (
          headerRcptResult.insertId != null &&
          headerRcptResult.insertId != ""
        ) {
          //let detailsInsert = [];

          // bulkInputArrayObject(inputParam.receiptdetails, detailsInsert, {
          //   hims_f_receipt_header_id: headerRcptResult.insertId
          // });
          const receptSample = [
            "card_check_number",
            "expiry_date",
            "pay_type",
            "amount",
            "created_by",
            "updated_by",
            "card_type"
          ];
          //   debugLog("Detail Body: ", detailsInsert);

          db.query(
            "INSERT  INTO hims_f_receipt_details ( " +
              receptSample.join(",") +
              ",hims_f_receipt_header_id) VALUES ? ",
            [
              jsonArrayToObject({
                sampleInputObject: receptSample,
                arrayObj: inputParam.receiptdetails,
                req: req,
                newFieldToInsert: [headerRcptResult.insertId]
              })
            ],
            (error, RcptDetailsRecords) => {
              if (error) {
                if (req.options == null) {
                  db.rollback(() => {
                    releaseDBConnection(req.db, db);
                    next(error);
                  });
                } else {
                  req.options.onFailure(error);
                }
              }
              debugLog("Final", req.options);
              if (req.options == null) {
                req.records = headerRcptResult;
              } else {
                req.options.onSuccess(headerRcptResult);
                debugLog("Final", headerRcptResult);
              }
            }
          );
        }
      }
    );
  } catch (e) {
    next(e);
  }
};
//End synchronus

//-------------------------------------

//Created by irfan :for synchronus
let addCashHandover = (req, res, next) => {
  try {
    debugFunction("cash api");
    let db = req.options == null ? req.db : req.options.db;

    let inputParam = extend(
      {
        shift_id: null
      },
      req.body
    );
    debugLog("group_type:", req.userIdentity.group_type);
    if (
      inputParam.receiptdetails == null ||
      inputParam.receiptdetails.length == 0
    ) {
      const genErr = httpStatus.generateError(
        httpStatus.badRequest,
        "Please select atleast one payment mode."
      );
      if (req.options == null) {
        next(genErr);
      } else {
        req.options.onFailure(genErr);
      }
    }

    if (
      req.userIdentity.group_type == "C" ||
      req.userIdentity.group_type == "FD"
    ) {
      let hims_f_cash_handover_detail_id = "";
      db.query(
        "select hims_f_cash_handover_detail_id, cash_handover_header_id, casher_id, shift_status,open_date\
      from  hims_f_cash_handover_detail where record_status='A' and casher_id=? and shift_status='O'",
        [inputParam.created_by],
        (error, checkShiftStatus) => {
          if (error) {
            if (req.options == null) {
              db.rollback(() => {
                releaseDBConnection(req.db, db);
                next(error);
              });
            } else {
              req.options.onFailure(checkShiftStatus);
            }
          }

          debugLog("number of shift open", checkShiftStatus);
          if (checkShiftStatus.length > 0) {
            hims_f_cash_handover_detail_id =
              checkShiftStatus[0].hims_f_cash_handover_detail_id;
          }

          new Promise((resolve, reject) => {
            try {
              if (
                checkShiftStatus.length == null ||
                checkShiftStatus.length == ""
              ) {
                db.query(
                  "INSERT INTO `hims_f_cash_handover_header` ( shift_id, daily_handover_date,\
               created_date, created_by, updated_date, updated_by)\
              VALUE(?,?,?,?,?,?)",
                  [
                    inputParam.shift_id,
                    new Date(),
                    new Date(),
                    inputParam.created_by,
                    new Date(),
                    inputParam.updated_by
                  ],
                  (error, headerCashHandover) => {
                    if (error) {
                      if (req.options == null) {
                        db.rollback(() => {
                          releaseDBConnection(req.db, db);
                          next(error);
                        });
                      } else {
                        req.options.onFailure(headerCashHandover);
                      }
                    }

                    debugLog("headerCashHandover", headerCashHandover);

                    if (
                      headerCashHandover.insertId != null &&
                      headerCashHandover.insertId != ""
                    ) {
                      db.query(
                        "INSERT INTO `hims_f_cash_handover_detail` ( cash_handover_header_id, casher_id,\
                        shift_status,open_date,  expected_cash, expected_card,  expected_cheque, \
                      no_of_cheques,created_date, created_by, updated_date, updated_by)\
                    VALUE(?,?,?,?,?,?,?,?,?,?,?,?)",
                        [
                          headerCashHandover.insertId,
                          inputParam.created_by,
                          "O",
                          new Date(),
                          0,
                          0,
                          0,
                          0,
                          new Date(),
                          inputParam.created_by,
                          new Date(),
                          inputParam.updated_by
                        ],
                        (error, CashHandoverDetails) => {
                          if (error) {
                            if (req.options == null) {
                              db.rollback(() => {
                                releaseDBConnection(req.db, db);
                                next(error);
                              });
                            } else {
                              req.options.onFailure(error);
                            }
                          }
                          if (
                            CashHandoverDetails.insertId != null &&
                            CashHandoverDetails.insertId != ""
                          ) {
                            hims_f_cash_handover_detail_id =
                              CashHandoverDetails.insertId;
                          }
                          debugLog("CashHandoverDetails", CashHandoverDetails);
                          resolve(CashHandoverDetails);
                        }
                      );
                    }
                  }
                );
              } else if (checkShiftStatus.length > 0) {
                resolve({});
              }
            } catch (e) {
              reject(e);
            }
          }).then(result => {
            //hjjh

            let expected_cash = 0;
            let expected_card = 0;
            let expected_cheque = 0;
            let no_of_cheques = 0;

            expected_cash = new LINQ(inputParam.receiptdetails)
              .Where(w => w.pay_type == "CA")
              .Sum(s => s.amount);
            debugLog("expected_cash:", expected_cash);

            expected_card = new LINQ(inputParam.receiptdetails)
              .Where(w => w.pay_type == "CD")
              .Sum(s => s.amount);
            debugLog("expected_card:", expected_card);

            expected_cheque = new LINQ(inputParam.receiptdetails)
              .Where(w => w.pay_type == "CH")
              .Sum(s => s.amount);
            debugLog("expected_cheque:", expected_cheque);

            no_of_cheques = new LINQ(inputParam.receiptdetails)
              .Where(w => w.pay_type == "CH")
              .ToArray().length;

            debugLog("no_of_cheques:", no_of_cheques);

            db.query(
              "select expected_cash,expected_card, expected_cheque, no_of_cheques from \
          hims_f_cash_handover_detail where record_status='A' and hims_f_cash_handover_detail_id=?",
              [hims_f_cash_handover_detail_id],
              (error, selectCurrentCash) => {
                if (error) {
                  if (req.options == null) {
                    db.rollback(() => {
                      releaseDBConnection(req.db, db);
                      next(error);
                    });
                  } else {
                    req.options.onFailure(selectCurrentCash);
                  }
                }
                debugLog("selectCurrentCash:", selectCurrentCash);
                expected_cash += selectCurrentCash[0].expected_cash;
                expected_card += selectCurrentCash[0].expected_card;
                expected_cheque += selectCurrentCash[0].expected_cheque;
                no_of_cheques += selectCurrentCash[0].no_of_cheques;

                db.query(
                  "update hims_f_cash_handover_detail set expected_cash=?,expected_card=?,\
              expected_cheque=?,no_of_cheques=?,updated_date=?,updated_by=? where record_status='A' \
              and hims_f_cash_handover_detail_id=?;",
                  [
                    expected_cash,
                    expected_card,
                    expected_cheque,
                    no_of_cheques,
                    new Date(),
                    inputParam.updated_by,
                    hims_f_cash_handover_detail_id
                  ],
                  (error, updateResult) => {
                    if (error) {
                      if (req.options == null) {
                        db.rollback(() => {
                          releaseDBConnection(req.db, db);
                          next(error);
                        });
                      } else {
                        req.options.onFailure(updateResult);
                      }
                    }

                    if (req.options == null) {
                      req.records = updateResult;
                      next();
                      debugLog("indi pendent", updateResult);
                    } else {
                      req.options.onSuccess(updateResult);
                      debugLog("updateResult", updateResult);
                    }
                  }
                );
              }
            );
          });
        }
      );
    } else {
      if (req.options == null) {
        req.records = { mesage: "not a cahsier" };
        next();
        debugLog("ELSE KK");
      } else {
        req.options.onSuccess({});
      }
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addBill,
  addBillData,
  billingCalculations,
  getBillDetails,
  newReceipt,
  patientAdvanceRefund,
  addEpisodeEncounter,
  getBillDetailsFunctionality,
  addEpisodeEncounterData,
  newReceiptData,
  addCashHandover
};
