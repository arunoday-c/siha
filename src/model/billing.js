import httpStatus from "../utils/httpStatus";
import extend from "extend";
import {
  bulkInputArrayObject,
  runningNumber,
  releaseDBConnection
} from "../utils";

import moment from "moment";
import { debugLog, debugFunction } from "../utils/logging";

import { LINQ } from "node-linq";
import { inflate } from "zlib";

//created by irfan: Adding bill headder and bill details
//AddBill
let addBill = (dataBase, req, res, callBack, isCommited, next) => {
  isCommited = isCommited || false;

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
    created_by: null,
    created_date: null,
    updated_by: null,
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
                  req.billing_header_id = headerResult.insertId;
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
    created_by: null,
    created_date: null,
    updated_by: null,
    updated_date: null,
    record_status: null,
    counter_id: null,
    shift_id: null
  };

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
            dataBase.rollback(() => {
              releaseDBConnection(db, dataBase);
              next(error);
            });
          }
          if (
            headerRcptResult.insertId != null &&
            headerRcptResult.insertId != ""
          ) {
            let detailsInsert = [];

            bulkInputArrayObject(inputParam.receiptdetails, detailsInsert, {
              hims_f_receipt_header_id: headerRcptResult.insertId
            });

            dataBase.query(
              "INSERT  INTO hims_f_receipt_details ( hims_f_receipt_header_id, card_check_number, expiry_date, pay_type, amount, \
                  created_by, created_date, updated_by, updated_date,  card_type) VALUES ? ",
              [detailsInsert],
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
      req.body.intCalculateall === undefined ? true : req.body.intCalculateall;
    let inputParam =
      req.body.intCalculateall === undefined ? req.body.billdetails : req.body;
    if (inputParam.length == 0) {
      next(
        httpStatus.generateError(
          httpStatus.badRequest,
          "Please select atleast one service"
        )
      );
    }
    let sendingObject = {};

    debugLog("bool Value: ", inputParam.intCalculateall);
    if (hasCalculateall == true) {
      sendingObject.sub_total_amount = new LINQ(inputParam).Sum(
        d => d.gross_amount
      );
      sendingObject.net_total = new LINQ(inputParam).Sum(d => d.net_amout);
      sendingObject.discount_amount = new LINQ(inputParam).Sum(
        d => d.discount_amout
      );
      sendingObject.gross_total = new LINQ(inputParam).Sum(d => d.net_amout);

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
      sendingObject.company_payable = new LINQ(inputParam).Sum(
        d => d.company_payable
      );
      sendingObject.sec_company_payable = new LINQ(inputParam).Sum(
        d => d.sec_company_payable
      );
      // Sheet Level Discount Nullify
      sendingObject.sheet_discount_amount = 0;
      sendingObject.sheet_discount_percentage = 0;
      sendingObject.advance_adjust = 0;

      sendingObject.net_amount = sendingObject.gross_total;
      sendingObject.receiveable_amount = sendingObject.net_amount;

      //Reciept
      sendingObject.cash_amount = sendingObject.receiveable_amount;
      sendingObject.total_amount = sendingObject.receiveable_amount;

      sendingObject.unbalanced_amount = 0;
      sendingObject.card_amount = 0;
      sendingObject.cheque_amount = 0;
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

        sendingObject.net_amount =
          inputParam.gross_total - sendingObject.sheet_discount_amount;
        sendingObject.receiveable_amount =
          sendingObject.net_amount - inputParam.advance_adjust;

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

    req.records = sendingObject;
    next();
  } catch (e) {
    next(e);
  }
};

//created by irfan: only calculation bill headder and bill details
let getBillDetails = (req, res, next) => {
  let billingHeaderModel = {
    hims_f_billing_header_id: null,
    patient_id: null,
    billing_type_id: null,
    visit_id: null,
    bill_number: null,
    incharge_or_provider: null,
    bill_date: new Date(),
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
    created_by: null,
    created_date: null,
    updated_by: null,
    updated_date: null,
    record_status: null,
    cancel_remarks: null,
    cancel_by: null,
    bill_comments: null
  };

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
    sec_company: 0,
    sec_deductable_percentage: 0,
    sec_deductable_amount: 0,
    sec_company_res: 0,
    sec_company_tax: 0,
    sec_company_paybale: 0,
    sec_copay_percntage: 0,
    sec_copay_amount: 0,
    created_by: null,
    created_date: null,
    updated_by: null,
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
    created_by: null,
    created_date: null,
    updated_by: null,
    updated_date: null,
    record_status: null
  };

  let receiptHeaderModel = {
    total_amount: 0,
    unbalanced_amount: 0,
    cash_amount: 0,
    card_amount: 0,
    cheque_amount: 0
  };
  debugFunction("getBillDetails");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let servicesDetails = extend(servicesModel, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      debugLog("Service ID" + servicesDetails.hims_d_services_id);

      connection.query(
        "SELECT * FROM `hims_d_services` WHERE `hims_d_services_id`=? ",
        [servicesDetails.hims_d_services_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          let records = result[0];
          let quantity =
            servicesDetails.quantity === undefined
              ? 1
              : servicesDetails.quantity;

          let discount_amout =
            servicesDetails.discount_amout === undefined
              ? 0
              : servicesDetails.discount_amout;

          let discount_percentage =
            servicesDetails.discount_percentage === undefined
              ? 0
              : servicesDetails.discount_percentage;

          let gross_amount = quantity * records.standard_fee;

          if (discount_amout > 0) {
            discount_percentage = (discount_amout / gross_amount) * 100;
          } else if (discount_percentage > 0) {
            discount_amout = (gross_amount * discount_percentage) / 100;
          }

          let net_amout = gross_amount - discount_amout;
          extend(billingDetailsModel, {
            service_type_id: result[0].service_type_id,
            services_id: servicesDetails.hims_d_services_id,
            quantity: quantity,
            unit_cost: records.standard_fee,
            gross_amount: gross_amount,
            discount_amout: discount_amout,
            discount_percentage: discount_percentage,
            net_amout: net_amout,
            patient_resp: net_amout,
            patient_payable: net_amout
          });

          // let sub_total_amount = new LINQ([billingDetailsModel]).Sum(
          //   s => s.gross_amount
          // );
          // let gross_total = new LINQ([billingDetailsModel]).Sum(
          //   s => s.net_amout
          // );
          // // debugLog("Net amount" + billingDetailsModel.);
          // extend(
          //   billingHeaderModel,
          //   {
          //     sub_total_amount: sub_total_amount,
          //     gross_total: gross_total,
          //     patient_res: gross_total,
          //     patient_payable: gross_total,
          //     sheet_discount_amount: 0,
          //     sheet_discount_percentage: 0,
          //     net_amount: 0,
          //     receiveable_amount: 0
          //   },
          //   req.body
          // );

          // if (billingHeaderModel.sheet_discount_amount > 0) {
          //   billingHeaderModel.sheet_discount_percentage =
          //     (billingHeaderModel.sheet_discount_amount / gross_total) * 100;
          // } else if (billingHeaderModel.sheet_discount_percentage > 0) {
          //   billingHeaderModel.sheet_discount_amount =
          //     (gross_total * billingHeaderModel.sheet_discount_percentage) /
          //     100;
          // }

          // billingHeaderModel.advance_amount = records.advance_amount;

          // billingHeaderModel.net_amount =
          //   billingHeaderModel.gross_total -
          //   billingHeaderModel.sheet_discount_amount;

          // billingHeaderModel.receiveable_amount =
          //   billingHeaderModel.net_amount -
          //   billingHeaderModel.credit_amount -
          //   billingHeaderModel.advance_adjust;

          // debugLog("Sheet Amount ", billingHeaderModel.sheet_discount_amount);

          // req.body.sheet_discount_amount =
          //   billingHeaderModel.sheet_discount_amount;

          // req.body.sheet_discount_percentage =
          //   billingHeaderModel.sheet_discount_percentage;

          // req.body.isReceipt =
          //   req.body.isReceipt == null ? false : req.body.isReceipt;

          // if (req.body.isReceipt == false) {
          //   extend(receiptHeaderModel, req.body, {
          //     total_amount: 0,
          //     unbalanced_amount: 0,
          //     cash_amount: billingHeaderModel.receiveable_amount,
          //     card_amount: 0,
          //     cheque_amount: 0
          //   });
          // } else {
          //   extend(receiptHeaderModel, req.body);
          // }

          // debugLog("Receipt Log", receiptHeaderModel);

          // receiptHeaderModel.total_amount =
          //   receiptHeaderModel.cash_amount +
          //   receiptHeaderModel.card_amount +
          //   receiptHeaderModel.cheque_amount;

          // receiptHeaderModel.unbalanced_amount =
          //   billingHeaderModel.receiveable_amount -
          //   receiptHeaderModel.total_amount;

          debugLog("Results are recorded...", result);
          req.records = extend({
            billdetails: [billingDetailsModel]
          });
          next();
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
    created_by: null,
    created_date: null,
    updated_by: null,
    updated_date: null,
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
    created_by: null,
    created_date: null,
    updated_by: null,
    update_date: null,
    record_status: null
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
                  let detailsInsert = [];

                  bulkInputArrayObject(
                    inputParam.receiptdetails,
                    detailsInsert,
                    {
                      hims_f_receipt_header_id: headerRcptResult.insertId
                    }
                  );
                  // receipt details table insert

                  connection.query(
                    "INSERT  INTO hims_f_receipt_details ( hims_f_receipt_header_id, card_check_number, expiry_date, pay_type, amount, \
              created_by, created_date, updated_by, updated_date,  card_type) VALUES ? ",
                    [detailsInsert],
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
                                          receipt_number: newNumber
                                        };
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
                  let detailsInsert = [];

                  bulkInputArrayObject(
                    inputParam.receiptdetails,
                    detailsInsert,
                    {
                      hims_f_receipt_header_id: headerRcptResult.insertId
                    }
                  );
                  // receipt details table insert

                  connection.query(
                    "INSERT  INTO hims_f_receipt_details ( hims_f_receipt_header_id, card_check_number, expiry_date, pay_type, amount, \
created_by, created_date, updated_by, updated_date,  card_type) VALUES ? ",
                    [detailsInsert],
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
                                      inputParameters.updated_by,
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
                                        releaseDBConnection(db, connection);
                                        if (error) {
                                          connection.rollback(() => {
                                            next(error);
                                          });
                                        }
                                        req.records = { payment_no: newNumber };
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

module.exports = {
  addBill,
  billingCalculations,
  getBillDetails,
  newReceipt,
  patientAdvanceRefund
};
