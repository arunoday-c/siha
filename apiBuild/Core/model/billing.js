"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _logging = require("../utils/logging");

var _appsettings = require("../utils/appsettings.json");

var _appsettings2 = _interopRequireDefault(_appsettings);

var _nodeLinq = require("node-linq");

var _mathjs = require("mathjs");

var _mathjs2 = _interopRequireDefault(_mathjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import { inflate } from "zlib";

var addBillData = function addBillData(req, res, next) {
  var db = req.options == null ? req.db : req.options.db;

  try {
    var inputParam = (0, _extend2.default)({
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
    }, req.body);

    if (inputParam.billdetails == null || inputParam.billdetails.length == 0) {
      var errorGen = _httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Please select atleast one service.");
      if (req.options == null) {
        next(errorGen);
      } else {
        req.options.onFailure(errorGen);
      }
    }

    inputParam.hims_f_patient_visit_id = req.body.patient_visit_id;
    inputParam.patient_id = req.body.patient_id;

    if (inputParam.sheet_discount_amount != 0 && inputParam.bill_comments == "") {
      var errorGene = _httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Please enter sheet level discount comments. ");
      if (req.options == null) {
        next(errorGene);
      } else {
        req.options.onFailure(errorGene);
      }
    }

    inputParam.bill_number = req.bill_number;
    inputParam.patient_id = req.patient_id || req.body.patient_id;
    inputParam.visit_id = req.body.visit_id;
    db.query("INSERT INTO hims_f_billing_header ( patient_id, visit_id, bill_number,receipt_header_id,\
            incharge_or_provider, bill_date, advance_amount,advance_adjust, discount_amount, sub_total_amount \
            , total_tax,  billing_status, sheet_discount_amount, sheet_discount_percentage, net_amount, net_total \
            , company_res, sec_company_res, patient_res, patient_payable, company_payable, sec_company_payable \
            , patient_tax, company_tax, sec_company_tax, net_tax, credit_amount, receiveable_amount,balance_credit \
            , created_by, created_date, updated_by, updated_date, copay_amount, deductable_amount) VALUES (?,?,?,?\
              ,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [inputParam.patient_id, inputParam.visit_id, inputParam.bill_number, inputParam.receipt_header_id, inputParam.incharge_or_provider, inputParam.bill_date != null ? new Date(inputParam.bill_date) : inputParam.bill_date, inputParam.advance_amount, inputParam.advance_adjust, inputParam.discount_amount, inputParam.sub_total_amount, inputParam.total_tax, inputParam.billing_status, inputParam.sheet_discount_amount, inputParam.sheet_discount_percentage, inputParam.net_amount, inputParam.net_total, inputParam.company_res, inputParam.sec_company_res, inputParam.patient_res, inputParam.patient_payable, inputParam.company_payable, inputParam.sec_company_payable, inputParam.patient_tax, inputParam.company_tax, inputParam.sec_company_tax, inputParam.net_tax, inputParam.credit_amount, inputParam.receiveable_amount, inputParam.balance_credit, inputParam.created_by, new Date(), inputParam.updated_by, new Date(), inputParam.copay_amount, inputParam.deductable_amount], function (error, headerResult) {
      (0, _logging.debugLog)("Header status", error, headerResult);
      if (error) {
        if (req.options == null) {
          db.rollback(function () {
            (0, _utils.releaseDBConnection)(req.db, db);
            next(error);
          });
        } else {
          req.options.onFailure(error);
        }
      } else {
        // if a patient utilizing his advance amount for his current payment
        if (headerResult.insertId != null && headerResult.insertId != "" && inputParam.advance_adjust > 0) {
          db.query("SELECT advance_amount FROM hims_f_patient WHERE hims_d_patient_id=?", [inputParam.patient_id], function (error, result) {
            if (error) {
              if (req.options == null) {
                (0, _utils.releaseDBConnection)(req.db, db);
                next(error);
              } else {
                req.options.onFailure(error);
              }
            }
            var existingAdvance = result[0].advance_amount;

            if (result.length != 0) {
              inputParam.advance_amount = existingAdvance - inputParam.advance_adjust;
              db.query("UPDATE  `hims_f_patient` SET  `advance_amount`=?, \
                    `updated_by`=?, `updated_date`=? WHERE `hims_d_patient_id`=?", [inputParam.advance_amount, inputParam.updated_by, new Date(), inputParam.patient_id], function (error, subtractAdvance) {
                if (error) {
                  if (req.options == null) {
                    db.rollback(function () {
                      (0, _utils.releaseDBConnection)(req.db, db);
                      next(error);
                    });
                  } else {
                    req.options.onFailure(error);
                  }
                }
              });
            }
          });
        }

        // req.billing_header_id = headerResult.insertId;
        (0, _logging.debugLog)("Billing Header ", headerResult.insertId);
        var newDtls = new _nodeLinq.LINQ(inputParam.billdetails).Select(function (s) {
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
        }).ToArray();

        var detailsInsert = [];
        (0, _logging.debugLog)("befor Detail Insert Data", newDtls);
        (0, _utils.bulkInputArrayObject)(newDtls, detailsInsert);

        (0, _logging.debugLog)("Detail Insert Data", detailsInsert);

        db.query("INSERT  INTO hims_f_billing_details (hims_f_billing_header_id, service_type_id,\
                     services_id, quantity, unit_cost,insurance_yesno,gross_amount, discount_amout, \
                     discount_percentage, net_amout, copay_percentage, copay_amount, \
                     deductable_amount, deductable_percentage, tax_inclusive, patient_tax, \
                     company_tax, total_tax, patient_resp, patient_payable, comapany_resp,\
                     company_payble, sec_company, sec_deductable_percentage, sec_deductable_amount,\
                     sec_company_res, sec_company_tax, sec_company_paybale, sec_copay_percntage, \
                     sec_copay_amount, created_by, created_date, updated_by, updated_date) VALUES ? ", [detailsInsert], function (error, detailsRecords) {
          if (error) {
            if (req.options == null) {
              db.rollback(function () {
                (0, _utils.releaseDBConnection)(req.db, db);
                next(error);
              });
            } else {
              req.options.onFailure(error);
            }
          }
          if (req.options == null) {
            req.records = headerResult;
            (0, _utils.releaseDBConnection)(req.db, db);
            next();
          } else {
            req.options.onSuccess(headerResult);
          }
        });
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: Adding bill headder and bill details
//AddBill
var addBill = function addBill(dataBase, req, res, callBack, isCommited, next) {
  isCommited = isCommited || false;
  var db = req.db;

  var billingHeaderModel = {
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
    (0, _logging.debugFunction)("addBill");

    if (dataBase == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    var inputParam = (0, _extend2.default)(billingHeaderModel, req.body);

    if (inputParam.billdetails == null || inputParam.billdetails.length == 0) {
      next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Please select atleast one service."));
    }
    inputParam.hims_f_patient_visit_id = req.body.visit_id;

    dataBase.query("select hims_f_patient_visit_id,visit_expiery_date from hims_f_patient_visit where hims_f_patient_visit_id=? \
           and record_status='A'", [inputParam.hims_f_patient_visit_id], function (error, records) {
      (0, _logging.debugFunction)("Test", error, records);
      if (error) {
        dataBase.rollback(function () {
          (0, _utils.releaseDBConnection)(db, dataBase);
          next(error);
        });
      }

      var fromDate = void 0;
      var toDate = void 0;
      if (records.length == 0) {
        fromDate = 0;
        toDate = 0;
      } else {
        fromDate = (0, _moment2.default)(records[0].visit_expiery_date).format("YYYYMMDD");
        toDate = (0, _moment2.default)(new Date()).format("YYYYMMDD");
      }

      if (toDate > fromDate) {
        dataBase.rollback(function () {
          (0, _utils.releaseDBConnection)(db, dataBase);
          next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Visit expired please create new visit to process"));
        });
      } else {
        (0, _utils.runningNumber)(req.db, 3, "PAT_BILL", function (error, records, newNumber) {
          if (error) {
            dataBase.rollback(function () {
              (0, _utils.releaseDBConnection)(db, dataBase);
              next(error);
            });
          }
          (0, _logging.debugLog)("new Bill number : " + newNumber);
          inputParam["bill_number"] = newNumber;
          req.body.bill_number = newNumber;
          if (inputParam.sheet_discount_amount != 0 && inputParam.bill_comments == "") {
            next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Please enter sheet level discount comments. "));
          }
          dataBase.query("INSERT INTO hims_f_billing_header ( patient_id, billing_type_id, visit_id, bill_number,\
                  incharge_or_provider, bill_date, advance_amount,advance_adjust, discount_amount \
                  , total_tax,  billing_status, sheet_discount_amount, sheet_discount_percentage, net_amount \
                  , company_res, sec_company_res, patient_payable, company_payable, sec_company_payable \
                  , patient_tax, company_tax, sec_company_tax, net_tax, credit_amount, receiveable_amount \
                  , created_by, created_date, updated_by, updated_date, copay_amount, deductable_amount) VALUES (?,?,?,?\
                    ,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [inputParam.patient_id, inputParam.billing_type_id, inputParam.visit_id, inputParam.bill_number, inputParam.incharge_or_provider, inputParam.bill_date, inputParam.advance_amount, inputParam.advance_adjust, inputParam.discount_amount, inputParam.total_tax, inputParam.billing_status, inputParam.sheet_discount_amount, inputParam.sheet_discount_percentage, inputParam.net_amount, inputParam.company_res, inputParam.sec_company_res, inputParam.patient_payable, inputParam.company_payable, inputParam.sec_company_payable, inputParam.patient_tax, inputParam.company_tax, inputParam.sec_company_tax, inputParam.net_tax, inputParam.credit_amount, inputParam.receiveable_amount, inputParam.created_by, inputParam.created_date, inputParam.updated_by, inputParam.updated_date, inputParam.copay_amount, inputParam.deductable_amount], function (error, headerResult) {
            if (error) {
              dataBase.rollback(function () {
                (0, _utils.releaseDBConnection)(db, dataBase);
                next(error);
              });
            }
            // if a patient utilizing his advance amount for his current payment
            if (headerResult.insertId != null && headerResult.insertId != "" && inputParam.advance_adjust > 0) {
              dataBase.query("SELECT advance_amount FROM hims_f_patient WHERE hims_d_patient_id=?", [inputParam.patient_id], function (error, result) {
                if (error) {
                  (0, _utils.releaseDBConnection)(db, dataBase);
                  next(error);
                }
                var existingAdvance = result[0].advance_amount;
                (0, _logging.debugLog)("existingAdvance:", existingAdvance);
                (0, _logging.debugLog)("before ", inputParam.advance_adjust);
                if (result.length != 0) {
                  inputParam.advance_amount = existingAdvance - inputParam.advance_adjust;

                  (0, _logging.debugLog)("after ", inputParam.advance_amount);
                  dataBase.query("UPDATE  `hims_f_patient` SET  `advance_amount`=?, \
                          `updated_by`=?, `updated_date`=? WHERE `hims_d_patient_id`=?", [inputParam.advance_amount, inputParam.updated_by, new Date(), inputParam.patient_id], function (error, subtractAdvance) {
                    if (error) {
                      dataBase.rollback(function () {
                        (0, _utils.releaseDBConnection)(db, dataBase);
                        next(error);
                      });
                    }
                  });
                }
              });
            }

            if (headerResult.insertId != null && headerResult.insertId != "") {
              // req.billing_header_id = headerResult.insertId;
              var detailsInsert = [];
              (0, _utils.bulkInputArrayObject)(inputParam.billdetails, detailsInsert, {
                hims_f_billing_header_id: headerResult.insertId
              });

              dataBase.query("INSERT  INTO hims_f_billing_details (hims_f_billing_details_id,hims_f_billing_header_id, service_type_id,\
                           services_id, quantity, unit_cost,insurance_yesno,gross_amount, discount_amout, \
                           discount_percentage, net_amout, copay_percentage, copay_amount, \
                           deductable_amount, deductable_percentage, tax_inclusive, patient_tax, \
                           company_tax, total_tax, patient_resp, patient_payable, comapany_resp,\
                           company_payble, sec_company, sec_deductable_percentage, sec_deductable_amount,\
                           sec_company_res, sec_company_tax, sec_company_paybale, sec_copay_percntage, \
                           sec_copay_amount, created_by, created_date, updated_by, updated_date) VALUES ? ", [detailsInsert], function (error, detailsRecords) {
                if (error) {
                  dataBase.rollback(function () {
                    (0, _utils.releaseDBConnection)(db, dataBase);
                    next(error);
                  });
                }
                //headerResult
                if (typeof callBack == "function") {
                  callBack(error, headerResult);
                }
              });
            } else {
              debuglog("Data is not inerted to billing header");
              next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Technical issue while billis notinserted"));
            }
          });
        });
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by:irfan, add receipt headder and details
//AddReceipt
var newReceipt = function newReceipt(dataBase, req, res, callBack, next) {
  var P_receiptHeaderModel = {
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
  var db = req.db;
  try {
    (0, _logging.debugFunction)("newReceiptFUnc");

    if (dataBase == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    var inputParam = (0, _extend2.default)(P_receiptHeaderModel, req.body);
    if (inputParam.receiptdetails == null || inputParam.receiptdetails.length == 0) {
      next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Please select atleast one service."));
    }

    (0, _utils.runningNumber)(req.db, 5, "PAT_RCPT", function (error, numgenId, newNumber) {
      if (error) {
        dataBase.rollback(function () {
          (0, _utils.releaseDBConnection)(db, dataBase);
          next(error);
        });
      }
      (0, _logging.debugLog)("new receipt number : " + newNumber);
      inputParam["receipt_number"] = newNumber;
      req.body.receipt_number = newNumber;
      (0, _logging.debugLog)("bil hdr id:", inputParam.billing_header_id);

      dataBase.query("INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, total_amount,\
             created_by, created_date, updated_by, updated_date,  counter_id, shift_id) VALUES (?,?,?\
          ,?,?,?,?,?,?)", [inputParam.receipt_number, new Date(), inputParam.total_amount, inputParam.created_by, new Date(), inputParam.updated_by, new Date(), inputParam.counter_id, inputParam.shift_id], function (error, headerRcptResult) {
        if (error) {
          dataBase.rollback(function () {
            (0, _utils.releaseDBConnection)(db, dataBase);
            next(error);
          });
        }
        if (headerRcptResult.insertId != null && headerRcptResult.insertId != "") {
          // let detailsInsert = [];

          // bulkInputArrayObject(
          //   inputParam.receiptdetails,
          //   detailsInsert,
          //   {
          //     hims_f_receipt_header_id: headerRcptResult.insertId
          //   },
          //   req
          // );
          var receptSample = ["card_check_number", "expiry_date", "pay_type", "amount", "created_by", "updated_by", "card_type"];

          dataBase.query("INSERT  INTO hims_f_receipt_details ( " + receptSample.join(",") + ",hims_f_receipt_header_id) VALUES ? ", [(0, _utils.jsonArrayToObject)({
            sampleInputObject: receptSample,
            arrayObj: inputParam.receiptdetails,
            req: req,
            newFieldToInsert: [headerRcptResult.insertId]
          })], function (error, RcptDetailsRecords) {
            if (error) {
              dataBase.rollback(function () {
                (0, _utils.releaseDBConnection)(db, dataBase);
                next(error);
              });
            }
            if (typeof callBack == "function") {
              callBack(error, headerRcptResult);
            }
          });
        } else {
          debuglog("Data is not inerted to billing header");
          next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Technical issue while billis notinserted"));
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: performing only calculation
var billingCalculations = function billingCalculations(req, res, next) {
  try {
    var hasCalculateall = req.body.intCalculateall == undefined ? true : req.body.intCalculateall;
    var inputParam = req.body.intCalculateall == undefined ? req.body.billdetails : req.body;
    if (inputParam.length == 0) {
      next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Please select atleast one service"));
    }
    var sendingObject = {};

    (0, _logging.debugLog)("bool Value: ", hasCalculateall);
    (0, _logging.debugLog)("Input", req.body);
    if (hasCalculateall == true) {
      sendingObject.sub_total_amount = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.gross_amount;
      });
      sendingObject.net_total = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.net_amout;
      });
      sendingObject.discount_amount = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.discount_amout;
      });
      sendingObject.gross_total = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.patient_payable;
      });

      // Primary Insurance
      sendingObject.copay_amount = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.copay_amount;
      });
      sendingObject.deductable_amount = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.deductable_amount;
      });

      // Secondary Insurance
      sendingObject.sec_copay_amount = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.sec_copay_amount;
      });
      sendingObject.sec_deductable_amount = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.sec_deductable_amount;
      });

      // Responsibilities
      sendingObject.patient_res = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.patient_resp;
      });
      sendingObject.company_res = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.comapany_resp;
      });
      sendingObject.sec_company_res = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.sec_company_res;
      });

      // Tax Calculation
      sendingObject.total_tax = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.total_tax;
      });
      sendingObject.patient_tax = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.patient_tax;
      });
      sendingObject.company_tax = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.company_tax;
      });
      sendingObject.sec_company_tax = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.sec_company_tax;
      });

      // Payables
      sendingObject.patient_payable = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.patient_payable;
      });

      sendingObject.company_payble = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.company_payble;
      });
      sendingObject.sec_company_paybale = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.sec_company_paybale;
      });
      // Sheet Level Discount Nullify
      sendingObject.sheet_discount_amount = 0;
      sendingObject.sheet_discount_percentage = 0;
      sendingObject.advance_adjust = 0;
      sendingObject.net_amount = sendingObject.patient_payable;
      if (inputParam.credit_amount > 0) {
        sendingObject.receiveable_amount = sendingObject.net_amount - inputParam.credit_amount;
      } else {
        sendingObject.receiveable_amount = sendingObject.net_amount;
      }

      //Reciept
      sendingObject.cash_amount = sendingObject.receiveable_amount;
      sendingObject.total_amount = sendingObject.receiveable_amount;

      sendingObject.unbalanced_amount = 0;
      sendingObject.card_amount = 0;
      sendingObject.cheque_amount = 0;

      sendingObject.patient_payable = _mathjs2.default.round(sendingObject.patient_payable, 2);
      sendingObject.total_tax = _mathjs2.default.round(sendingObject.total_tax, 2);
      sendingObject.patient_tax = _mathjs2.default.round(sendingObject.patient_tax, 2);
      sendingObject.company_tax = _mathjs2.default.round(sendingObject.company_tax, 2);
      sendingObject.sec_company_tax = _mathjs2.default.round(sendingObject.sec_company_tax, 2);
    } else {
      //Reciept

      if (inputParam.isReceipt == false) {
        // Sheet Level Discount Nullify
        sendingObject.sheet_discount_percentage = 0;
        sendingObject.sheet_discount_amount = 0;

        if (inputParam.sheet_discount_amount > 0) {
          sendingObject.sheet_discount_percentage = inputParam.sheet_discount_amount / inputParam.gross_total * 100;

          sendingObject.sheet_discount_amount = inputParam.sheet_discount_amount;
        } else if (inputParam.sheet_discount_percentage > 0) {
          sendingObject.sheet_discount_percentage = inputParam.sheet_discount_percentage;
          sendingObject.sheet_discount_amount = inputParam.gross_total * inputParam.sheet_discount_percentage / 100;
        }

        sendingObject.sheet_discount_amount = _mathjs2.default.round(sendingObject.sheet_discount_amount, 2);
        sendingObject.sheet_discount_percentage = _mathjs2.default.round(sendingObject.sheet_discount_percentage, 2);

        sendingObject.net_amount = inputParam.gross_total - sendingObject.sheet_discount_amount;

        if (inputParam.credit_amount > 0) {
          sendingObject.receiveable_amount = sendingObject.net_amount - inputParam.advance_adjust - inputParam.credit_amount;
        } else {
          sendingObject.receiveable_amount = sendingObject.net_amount - inputParam.advance_adjust;
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

      sendingObject.total_amount = sendingObject.cash_amount + sendingObject.card_amount + sendingObject.cheque_amount;

      sendingObject.unbalanced_amount = sendingObject.receiveable_amount - sendingObject.total_amount;
    }

    // debugLog("patient_payable", sendingObject.patient_payable);
    req.records = sendingObject;
    next();
  } catch (e) {
    next(e);
  }
};
//logic part for getBill details API
var getBillDetailsFunctionality = function getBillDetailsFunctionality(req, res, next, resolve) {
  var billingDetailsModel = {
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
  var servicesModel = {
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

  (0, _logging.debugFunction)("getBillDetailsFunctionality");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    (0, _logging.debugLog)("req.body");

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      (0, _logging.debugLog)("erroe");
      // debugLog("Service ID:",  servicesDetails.hims_d_services_id);
      var service_ids = null;
      var questions = "?";
      (0, _logging.debugLog)("req.body", req.body);
      if (Array.isArray(req.body)) {
        var len = req.body.length;
        service_ids = new _nodeLinq.LINQ(req.body).Select(function (g) {
          return g.hims_d_services_id;
        });

        for (var i = 1; i < len; i++) {
          questions += ",?";
        }
      }

      connection.query("SELECT * FROM `hims_d_services` WHERE `hims_d_services_id` IN (" + questions + ") AND record_status='A'", service_ids.items, function (error, result) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }
        var outputArray = [];

        var _loop = function _loop(m) {
          var servicesDetails = (0, _extend2.default)({
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
          }, req.body[m]);

          var records = result[m];
          req.body[m].service_type_id = result[m].service_type_id;
          req.body[m].services_id = servicesDetails.hims_d_services_id;

          //Calculation Declarations
          var unit_cost = servicesDetails.unit_cost == undefined ? 0 : servicesDetails.unit_cost;

          var zeroBill = servicesDetails.zeroBill == undefined ? false : servicesDetails.zeroBill;

          var FollowUp = servicesDetails.FollowUp == undefined ? false : servicesDetails.FollowUp;
          var gross_amount = 0,
              net_amout = 0,
              sec_unit_cost = 0;

          var patient_resp = 0,
              patient_payable = 0;

          var copay_percentage = 0,
              copay_amount = 0,
              sec_copay_percntage = 0,
              sec_copay_amount = 0;

          var comapany_resp = 0,
              company_payble = 0,
              sec_company_res = 0,
              sec_company_paybale = 0;

          var patient_tax = 0,
              company_tax = 0,
              sec_company_tax = 0,
              total_tax = 0;

          var after_dect_amout = 0,
              deductable_percentage = 0,
              deductable_amount = 0;

          var sec_deductable_percentage = 0,
              sec_deductable_amount = 0;
          var conversion_factor = servicesDetails.conversion_factor == undefined ? 0 : servicesDetails.conversion_factor;
          var quantity = servicesDetails.quantity == undefined ? 1 : servicesDetails.quantity;

          var discount_amout = servicesDetails.discount_amout == undefined ? 0 : servicesDetails.discount_amout;

          var discount_percentage = servicesDetails.discount_percentage == undefined ? 0 : servicesDetails.discount_percentage;

          var insured = servicesDetails.insured == undefined ? "N" : servicesDetails.insured;

          var sec_insured = servicesDetails.sec_insured == undefined ? "N" : servicesDetails.sec_insured;

          var approval_amt = servicesDetails.approval_amt == undefined ? 0 : servicesDetails.approval_amt;
          var approval_limit_yesno = servicesDetails.approval_limit_yesno == undefined ? "N" : servicesDetails.approval_limit_yesno;

          var apprv_status = servicesDetails.apprv_status == undefined ? "NR" : servicesDetails.apprv_status;

          var approved_amount = servicesDetails.approved_amount == undefined ? 0 : servicesDetails.approved_amount;
          (0, _logging.debugLog)("Pre app", servicesDetails.pre_approval);
          var pre_approval = servicesDetails.pre_approval == undefined ? "N" : servicesDetails.pre_approval;

          var vat_applicable = servicesDetails.vat_applicable;
          var preapp_limit_exceed = "N";
          var ser_net_amount = 0;
          var ser_gross_amt = 0;
          var icd_code = "";
          var covered = "Y";
          var preapp_limit_amount = servicesDetails.preapp_limit_amount == undefined ? 0 : servicesDetails.preapp_limit_amount;
          (0, _logging.debugLog)("zeroBill: ", zeroBill);
          if (zeroBill === true) {
            var out = {
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
            return {
              v: void 0
            };
          }

          (0, _logging.debugLog)("After zeroBill: ", zeroBill);
          new Promise(function (resolve, reject) {
            try {
              if (insured == "Y") {
                // let callInsurance =
                (0, _logging.debugLog)("Data: ", req.body[m]);
                req.body[m].insurance_id = req.body[m].primary_insurance_provider_id;
                req.body[m].hims_d_insurance_network_office_id = req.body[m].primary_network_office_id;
                req.body[m].network_id = req.body[m].primary_network_id;

                insuranceServiceDetails(req.body[m], req.db, next, connection, resolve);
                //if (callInsurance != null) resolve(callInsurance);
              } else if (sec_insured == "Y") {
                req.body[m].insurance_id = req.body[m].secondary_insurance_provider_id;
                req.body[m].hims_d_insurance_network_office_id = req.body[m].secondary_network_office_id;
                req.body[m].network_id = req.body[m].secondary_network_id;

                insuranceServiceDetails(req.body[m], req.db, next, connection, resolve);
              } else {
                resolve({});
              }
            } catch (e) {
              reject(e);
            }
          }).then(function (policydtls) {
            if (covered == "N" || pre_approval == "Y" && apprv_status == "RJ") {
              insured = "N";
            }

            if (approval_limit_yesno == "Y") {
              pre_approval = "Y";
            }

            if (pre_approval == "N") {
              pre_approval = policydtls !== null ? policydtls.pre_approval : "N";
            }

            covered = policydtls !== null ? policydtls.covered : "Y";

            icd_code = policydtls.cpt_code !== null ? policydtls.cpt_code : records.cpt_code;

            if (insured == "Y" && policydtls.covered == "Y") {
              ser_net_amount = policydtls.net_amount;
              ser_gross_amt = policydtls.gross_amt;

              if (policydtls.company_service_price_type == "N") {
                unit_cost = unit_cost != 0 ? unit_cost : policydtls.net_amount;
              } else {
                unit_cost = unit_cost != 0 ? unit_cost : policydtls.gross_amt;
              }

              if (conversion_factor != 0) {
                unit_cost = unit_cost * conversion_factor;
              }
              gross_amount = quantity * unit_cost;

              if (discount_amout > 0) {
                discount_percentage = discount_amout / gross_amount * 100;
              } else if (discount_percentage > 0) {
                discount_amout = gross_amount * discount_percentage / 100;
                discount_amout = _mathjs2.default.round(discount_amout, 2);
              }
              net_amout = gross_amount - discount_amout;

              //Patient And Company
              if (policydtls.copay_status == "Y") {
                copay_amount = policydtls.copay_amt;
                copay_percentage = copay_amount / net_amout * 100;
              } else {
                (0, _logging.debugLog)("policydtls: ", policydtls);

                if (_appsettings2.default.hims_d_service_type.service_type_id.Consultation == records.service_type_id) {
                  copay_percentage = policydtls.copay_consultation;
                  deductable_percentage = policydtls.deductible;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Procedure == records.service_type_id) {
                  copay_percentage = policydtls.copay_percent_trt;
                  deductable_percentage = policydtls.deductible_trt;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Provider == records.service_type_id) {
                  copay_percentage = policydtls.copay_percent;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.InventoryItem == records.service_type_id) {
                  //Not there
                  copay_percentage = policydtls.copay_percent;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Lab == records.service_type_id) {
                  copay_percentage = policydtls.copay_percent;
                  deductable_percentage = policydtls.deductible_lab;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.NursingCare == records.service_type_id) {
                  //Not There
                  copay_percentage = policydtls.copay_percent;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Miscellaneous == records.service_type_id) {
                  //Not There
                  copay_percentage = policydtls.copay_percent;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Anesthesia == records.service_type_id) {
                  //Not There
                  copay_percentage = policydtls.copay_percent;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Bed == records.service_type_id) {
                  //Not There
                  copay_percentage = policydtls.copay_percent;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.OT == records.service_type_id) {
                  //Not There
                  copay_percentage = policydtls.copay_percent;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Radiology == records.service_type_id) {
                  copay_percentage = policydtls.copay_percent_rad;
                  deductable_percentage = policydtls.deductible_rad;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Pharmacy == records.service_type_id) {
                  copay_percentage = policydtls.copay_medicine;
                  deductable_percentage = policydtls.deductible_medicine;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.NonService == records.service_type_id) {
                  //Not There
                  copay_percentage = policydtls.copay_percent;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Package == records.service_type_id) {
                  //Not There
                  copay_percentage = policydtls.copay_percent;
                }

                deductable_amount = net_amout * deductable_percentage / 100;
                after_dect_amout = net_amout - deductable_amount;
                copay_amount = after_dect_amout * copay_percentage / 100;
                copay_amount = _mathjs2.default.round(copay_amount, 2);
              }

              (0, _logging.debugLog)("net_amout: ", net_amout);
              (0, _logging.debugLog)("copay_amount: ", copay_amount);
              patient_resp = copay_amount + deductable_amount;
              comapany_resp = _mathjs2.default.round(net_amout - patient_resp, 2);

              (0, _logging.debugLog)("patient_resp: ", patient_resp);

              if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                patient_tax = _mathjs2.default.round(patient_resp * records.vat_percent / 100, 2);
              }

              if (records.vat_applicable == "Y") {
                company_tax = _mathjs2.default.round(comapany_resp * records.vat_percent / 100, 2);
              }
              total_tax = _mathjs2.default.round(patient_tax + company_tax, 2);

              patient_payable = _mathjs2.default.round(patient_resp + patient_tax, 2);

              if (approved_amount !== 0 && approved_amount < comapany_resp) {
                var diff_val = comapany_resp - approved_amount;
                patient_payable = _mathjs2.default.round(patient_payable + diff_val, 2);
                patient_resp = _mathjs2.default.round(patient_resp + diff_val, 2);
                comapany_resp = approved_amount;
              }

              (0, _logging.debugLog)("comapany_resp 2: ", comapany_resp);

              company_payble = net_amout - patient_resp;

              company_payble = _mathjs2.default.round(company_payble + company_tax, 2);

              preapp_limit_amount = policydtls.preapp_limit;
              if (policydtls.preapp_limit !== 0) {
                approval_amt = approval_amt + company_payble;
                if (approval_amt > policydtls.preapp_limit) {
                  preapp_limit_exceed = "Y";
                }
              }

              //If primary and secondary exists
              if (sec_insured == "Y") {
                req.body[m].insurance_id = req.body[m].secondary_insurance_provider_id;
                req.body[m].hims_d_insurance_network_office_id = req.body[m].secondary_network_office_id;
                req.body[m].network_id = req.body[m].secondary_network_id;
                //Secondary Insurance
                return new Promise(function (resolve, reject) {
                  try {
                    // let callInsurance =
                    insuranceServiceDetails(req.body[m], req.db, next, connection, resolve);
                    //if (callInsurance != null) resolve(callInsurance);
                  } catch (e) {
                    reject(e);
                  }
                });
              }
            } else {
              if (FollowUp === true) {
                unit_cost = unit_cost != 0 ? unit_cost : records.followup_free_fee;
              } else {
                unit_cost = unit_cost != 0 ? unit_cost : records.standard_fee;
              }

              if (conversion_factor != 0) {
                unit_cost = unit_cost * conversion_factor;
              }
              gross_amount = quantity * unit_cost;

              if (discount_amout > 0) {
                discount_percentage = discount_amout / gross_amount * 100;
              } else if (discount_percentage > 0) {
                discount_amout = gross_amount * discount_percentage / 100;
                discount_amout = _mathjs2.default.round(discount_amout, 2);
              }
              net_amout = gross_amount - discount_amout;
              patient_resp = net_amout;

              if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                patient_tax = _mathjs2.default.round(patient_resp * records.vat_percent / 100, 2);
                total_tax = patient_tax;
              }

              // patient_payable = net_amout + patient_tax;
              patient_payable = _mathjs2.default.round(patient_resp + patient_tax, 2);
            }
          }).then(function (secpolicydtls) {
            if (secpolicydtls != null) {
              (0, _logging.debugFunction)("secpolicydtls");
              //secondary Insurance
              sec_unit_cost = patient_resp;

              //Patient And Company
              if (secpolicydtls.copay_status == "Y") {
                (0, _logging.debugFunction)("secpolicydtls Y");
                sec_copay_amount = secpolicydtls.copay_amt;
                sec_copay_percntage = sec_copay_amount / sec_unit_cost * 100;
              } else {
                (0, _logging.debugFunction)("secpolicydtls N");
                if (_appsettings2.default.hims_d_service_type.service_type_id.Consultation == records.service_type_id) {
                  sec_copay_percntage = secpolicydtls.copay_consultation;
                  sec_deductable_percentage = secpolicydtls.deductible;
                  (0, _logging.debugLog)("sec_copay_percntage", sec_copay_percntage);
                  (0, _logging.debugLog)("sec_deductable_percentage", sec_deductable_percentage);
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Procedure == records.service_type_id) {
                  sec_copay_percntage = secpolicydtls.copay_percent_trt;
                  sec_deductable_percentage = secpolicydtls.deductible_trt;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Provider == records.service_type_id) {
                  sec_copay_percntage = secpolicydtls.copay_percent;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.InventoryItem == records.service_type_id) {
                  //Not there
                  sec_copay_percntage = secpolicydtls.copay_percent;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Lab == records.service_type_id) {
                  sec_copay_percntage = secpolicydtls.copay_percent;
                  sec_deductable_percentage = secpolicydtls.deductible_lab;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.NursingCare == records.service_type_id) {
                  //Not There
                  sec_copay_percntage = secpolicydtls.copay_percent;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Miscellaneous == records.service_type_id) {
                  //Not There
                  sec_copay_percntage = secpolicydtls.copay_percent;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Anesthesia == records.service_type_id) {
                  //Not There
                  sec_copay_percntage = secpolicydtls.copay_percent;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Bed == records.service_type_id) {
                  //Not There
                  sec_copay_percntage = secpolicydtls.copay_percent;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.OT == records.service_type_id) {
                  //Not There
                  sec_copay_percntage = secpolicydtls.copay_percent;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Radiology == records.service_type_id) {
                  sec_copay_percntage = secpolicydtls.copay_percent_rad;
                  sec_deductable_percentage = secpolicydtls.deductible_rad;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Pharmacy == records.service_type_id) {
                  sec_copay_percntage = secpolicydtls.copay_medicine;
                  sec_deductable_percentage = secpolicydtls.deductible_medicine;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.NonService == records.service_type_id) {
                  //Not There
                  sec_copay_percntage = secpolicydtls.copay_percent;
                } else if (_appsettings2.default.hims_d_service_type.service_type_id.Package == records.service_type_id) {
                  //Not There
                  sec_copay_percntage = secpolicydtls.copay_percent;
                }

                sec_deductable_amount = sec_unit_cost * sec_deductable_percentage / 100;
                after_dect_amout = sec_unit_cost - deductable_amount;

                sec_copay_amount = after_dect_amout * sec_copay_percntage / 100;

                sec_copay_amount = _mathjs2.default.round(sec_copay_amount, 2);
              }

              patient_resp = sec_copay_amount + sec_deductable_amount;
              sec_company_res = sec_unit_cost - patient_resp;

              if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                patient_tax = _mathjs2.default.round(patient_resp * records.vat_percent / 100, 2);
              }

              if (records.vat_applicable == "Y") {
                sec_company_tax = _mathjs2.default.round(sec_company_res * records.vat_percent / 100, 2);
              }
              total_tax = patient_tax + company_tax + sec_company_res;

              patient_payable = _mathjs2.default.round(patient_resp + patient_tax, 2);
              sec_company_paybale = sec_unit_cost - patient_resp + sec_company_tax;
            }
            var out = (0, _extend2.default)({
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
            }, {
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
            });

            outputArray.push(out);
          }).then(function () {
            if (m == result.length - 1) {
              (0, _logging.debugLog)("outputArray", outputArray);
              return resolve({ billdetails: outputArray });
            }
          }).catch(function (e) {
            next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, e));
          });
        };

        for (var m = 0; m < result.length; m++) {
          var _ret = _loop(m);

          if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by:irfan, Patient-receipt if advance or  Refund to patient
var patientAdvanceRefund = function patientAdvanceRefund(req, res, next) {
  var P_receiptHeaderModel = {
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

  var advanceModel = {
    hims_f_patient_id: null,
    hims_f_receipt_header_id: null,
    transaction_type: null,
    advance_amount: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  (0, _logging.debugFunction)("patientAdvanceRefund");

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.beginTransaction(function (error) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }

        var inputParam = (0, _extend2.default)(P_receiptHeaderModel, req.body);
        if (inputParam.receiptdetails == null || inputParam.receiptdetails.length == 0) {
          next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Please select atleast one service."));
        }
        var RCPT_or_PYMNT_NUM = null;
        // fuction for advance recieved from patient
        if (inputParam.pay_type == "R") {
          (0, _utils.runningNumber)(req.db, 5, "PAT_RCPT", function (error, numgenId, newNumber) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }
            req.query.receipt_number = newNumber;
            req.body.receipt_number = newNumber;
            inputParam.receipt_number = newNumber;
            (0, _logging.debugLog)("new R for recpt number:", newNumber);
            // receipt header table insert
            connection.query("INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, billing_header_id, total_amount,\
         created_by, created_date, updated_by, updated_date,  counter_id, shift_id, pay_type) VALUES (?,?,?\
      ,?,?,?,?,?,?,?,?)", [inputParam.receipt_number, new Date(), inputParam.billing_header_id, inputParam.total_amount, inputParam.created_by, new Date(), inputParam.updated_by, new Date(), inputParam.counter_id, inputParam.shift_id, inputParam.pay_type], function (error, headerRcptResult) {
              if (error) {
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
              }

              (0, _logging.debugFunction)("inside header result");
              if (headerRcptResult.insertId != null && headerRcptResult.insertId != "") {
                //   let detailsInsert = [];

                // bulkInputArrayObject(
                //   inputParam.receiptdetails,
                //   detailsInsert,
                //   {
                //     hims_f_receipt_header_id: headerRcptResult.insertId
                //   }
                // );
                // receipt details table insert
                var receptSample = ["card_check_number", "expiry_date", "pay_type", "amount", "created_by", "updated_by", "card_type"];

                connection.query("INSERT  INTO hims_f_receipt_details ( " + receptSample.join(",") + ",hims_f_receipt_header_id) VALUES ? ", [(0, _utils.jsonArrayToObject)({
                  sampleInputObject: receptSample,
                  arrayObj: inputParam.receiptdetails,
                  req: req,
                  newFieldToInsert: [headerRcptResult.insertId]
                })], function (error, RcptDetailsRecords) {
                  if (error) {
                    connection.rollback(function () {
                      (0, _utils.releaseDBConnection)(db, connection);
                      next(error);
                    });
                  }
                  (0, _logging.debugFunction)("inside details result");

                  var inputParameters = (0, _extend2.default)(advanceModel, req.body);

                  //  if (inputParameters.transaction_type)
                  // patient advance table insert
                  connection.query("INSERT  INTO hims_f_patient_advance ( hims_f_patient_id, hims_f_receipt_header_id,\
                        transaction_type, advance_amount, created_by, \
                   created_date, updated_by, update_date,  record_status) VALUES (?,?,?,?,?,?,?,?,?) ", [inputParameters.hims_f_patient_id, headerRcptResult.insertId, inputParameters.transaction_type, inputParameters.advance_amount, inputParameters.created_by, new Date(), inputParameters.updated_by, new Date(), inputParameters.record_status], function (error, AdvanceRecords) {
                    if (error) {
                      connection.rollback(function () {
                        (0, _utils.releaseDBConnection)(db, connection);
                        next(error);
                      });
                    }
                    (0, _logging.debugFunction)("inside patient advance result");
                    connection.query("SELECT advance_amount FROM hims_f_patient WHERE hims_d_patient_id=?", [inputParameters.hims_f_patient_id], function (error, result) {
                      if (error) {
                        (0, _utils.releaseDBConnection)(db, connection);
                        next(error);
                      }
                      var existingAdvance = result[0].advance_amount;
                      if (result.length != 0) {
                        //advance adding
                        if (inputParameters.transaction_type == "AD") {
                          inputParameters.advance_amount += existingAdvance;
                          (0, _logging.debugLog)("existingAdvance:", existingAdvance);

                          connection.query("UPDATE  `hims_f_patient` SET  `advance_amount`=?, \
                           `updated_by`=?, `updated_date`=? WHERE `hims_d_patient_id`=?", [inputParameters.advance_amount, inputParameters.updated_by, new Date(), inputParameters.hims_f_patient_id], function (error, appendAdvance) {
                            if (error) {
                              connection.rollback(function () {
                                (0, _utils.releaseDBConnection)(db, connection);
                                next(error);
                              });
                            }

                            //commit comes here

                            connection.commit(function (error) {
                              (0, _utils.releaseDBConnection)(db, connection);
                              if (error) {
                                connection.rollback(function () {
                                  next(error);
                                });
                              }
                              req.records = {
                                receipt_number: newNumber,
                                total_advance_amount: inputParameters.advance_amount
                              };
                              (0, _utils.releaseDBConnection)(db, connection);
                              next();
                            });
                          });
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
                    });
                  });
                });
              } else {
                (0, _logging.debugLog)("Data is not inerted to billing header");
                next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Technical issue while billis notinserted"));
              }
            });
          });
        }

        //function for payment to the patient
        if (inputParam.pay_type == "P") {
          (0, _utils.runningNumber)(req.db, 7, "PYMNT_NO", function (error, numgenId, newNumber) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }
            (0, _logging.debugLog)("new PAYMENT no : ", newNumber);
            inputParam.receipt_number = newNumber;
            req.body.receipt_number = newNumber;

            //R-->recieved amount   P-->payback amount

            // receipt header table insert
            connection.query("INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, billing_header_id, total_amount,\
created_by, created_date, updated_by, updated_date,  counter_id, shift_id, pay_type) VALUES (?,?,?\
,?,?,?,?,?,?,?,?)", [inputParam.receipt_number, new Date(), inputParam.billing_header_id, inputParam.total_amount, inputParam.created_by, new Date(), inputParam.updated_by, new Date(), inputParam.counter_id, inputParam.shift_id, inputParam.pay_type], function (error, headerRcptResult) {
              if (error) {
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
              }

              (0, _logging.debugFunction)("inside header result");
              if (headerRcptResult.insertId != null && headerRcptResult.insertId != "") {
                // let detailsInsert = [];

                // bulkInputArrayObject(
                //   inputParam.receiptdetails,
                //   detailsInsert,
                //   {
                //     hims_f_receipt_header_id: headerRcptResult.insertId
                //   }
                // );
                // receipt details table insert
                var receptSample = ["card_check_number", "expiry_date", "pay_type", "amount", "created_by", "updated_by", "card_type"];
                connection.query("INSERT  INTO hims_f_receipt_details ( " + receptSample.join(",") + ",hims_f_receipt_header_id) VALUES ? ", [(0, _utils.jsonArrayToObject)({
                  sampleInputObject: receptSample,
                  arrayObj: inputParam.receiptdetails,
                  req: req,
                  newFieldToInsert: [headerRcptResult.insertId]
                })], function (error, RcptDetailsRecords) {
                  if (error) {
                    connection.rollback(function () {
                      (0, _utils.releaseDBConnection)(db, connection);
                      next(error);
                    });
                  }
                  (0, _logging.debugFunction)("inside details result");

                  var inputParameters = (0, _extend2.default)(advanceModel, req.body);

                  // patient advance table insert
                  connection.query("INSERT  INTO hims_f_patient_advance ( hims_f_patient_id, hims_f_receipt_header_id,\
          transaction_type, advance_amount, created_by, \
     created_date, updated_by, update_date,  record_status) VALUES (?,?,?,?,?,?,?,?,?) ", [inputParameters.hims_f_patient_id, headerRcptResult.insertId, inputParameters.transaction_type, inputParameters.advance_amount, req.userIdentity.algaeh_d_app_user_id, new Date(), req.userIdentity.algaeh_d_app_user_id, new Date(), inputParameters.record_status], function (error, AdvanceRecords) {
                    if (error) {
                      connection.rollback(function () {
                        (0, _utils.releaseDBConnection)(db, connection);
                        next(error);
                      });
                    }
                    (0, _logging.debugFunction)("inside patient advance result");
                    connection.query("SELECT advance_amount FROM hims_f_patient WHERE hims_d_patient_id=?", [inputParameters.hims_f_patient_id], function (error, result) {
                      if (error) {
                        (0, _utils.releaseDBConnection)(db, connection);
                        next(error);
                      }
                      var existingAdvance = result[0].advance_amount;
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
                          inputParameters.advance_amount = existingAdvance - inputParameters.advance_amount;
                          connection.query("UPDATE  `hims_f_patient` SET  `advance_amount`=?, \
             `updated_by`=?, `updated_date`=? WHERE `hims_d_patient_id`=?", [inputParameters.advance_amount, req.userIdentity.algaeh_d_app_user_id, new Date(), inputParameters.hims_f_patient_id], function (error, subtractAdvance) {
                            if (error) {
                              connection.rollback(function () {
                                (0, _utils.releaseDBConnection)(db, connection);
                                next(error);
                              });
                            }

                            //commit comes here
                            connection.commit(function (error) {
                              if (error) {
                                connection.rollback(function () {
                                  (0, _utils.releaseDBConnection)(db, connection);
                                  next(error);
                                });
                              }
                              (0, _utils.releaseDBConnection)(db, connection);
                              req.records = {
                                payment_no: newNumber,
                                total_advance_amount: inputParameters.advance_amount
                              };
                              next();
                            });
                          });
                        }
                        if (inputParameters.transaction_type == "CA") {
                          // cancel
                        }
                      }
                    });
                  });
                });
              } else {
                (0, _logging.debugLog)("Data is not inerted to billing header");
                next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Technical issue while billis notinserted"));
              }
            });
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
  (0, _logging.debugLog)("reqbodyin insurance func:", body);
  var NetOffModel = {
    hims_d_insurance_network_office_id: null
  };
  var input = (0, _extend2.default)(NetOffModel, body);
  (0, _logging.debugLog)("hims_d_insurance_network_office_id:", input.hims_d_insurance_network_office_id);

  (0, _logging.debugLog)("connection string:", connection);
  connection.query("select price_from ,copay_consultation,copay_percent,copay_percent_rad,copay_percent_trt,copay_percent_dental,\
    copay_medicine, preapp_limit, deductible, deductible_lab,deductible_rad, deductible_trt, deductible_medicine from hims_d_insurance_network_office where hims_d_insurance_network_office_id=?", [input.hims_d_insurance_network_office_id], function (error, resultOffic) {
    if (error) {
      (0, _utils.releaseDBConnection)(db, connection);
      next(error);
    }

    (0, _logging.debugLog)("result of network offic", resultOffic);
    (0, _logging.debugFunction)("inside result of network office  ");

    // if s
    if (resultOffic != null && resultOffic[0].price_from == "S") {
      var insuranceModel = {
        insurance_id: null,
        service_type_id: null,
        services_id: null
      };
      var inputparam = (0, _extend2.default)(insuranceModel, body);
      (0, _logging.debugLog)("val second:", inputparam.insurance_id);

      connection.query("select Inp.company_service_price_type,copay_status,copay_amt,deductable_status,deductable_amt,pre_approval,covered,\
           net_amount,gross_amt, cpt_code from hims_d_services_insurance sI inner join hims_d_insurance_provider Inp on\
           Inp.hims_d_insurance_provider_id=sI.insurance_id where sI.insurance_id =? and sI.service_type_id =? and \
           sI.services_id =?  and sI.record_status='A' and Inp.record_status='A'", [insuranceModel.insurance_id, insuranceModel.service_type_id, insuranceModel.services_id], function (error, result_s) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }
        (0, _logging.debugFunction)("inside result of second query if s is there  ");
        (0, _logging.debugLog)("S is :", result_s);
        // req.records = extend({
        //   insurence_result: result_s[0]
        // });

        var result = (0, _extend2.default)(result_s[0], resultOffic[0]);
        return resolve(result);
      });
    }

    // if p
    if (resultOffic != null && resultOffic[0].price_from == "P") {
      var networkModel = {
        network_id: null,
        service_type_id: null,
        services_id: null
      };

      var _input = (0, _extend2.default)(networkModel, body);
      connection.query("select Inp.insurance_provider_name, Inp.company_service_price_type, net.network_type, \
          copay_status,copay_amt,deductable_status,deductable_amt,pre_approval,\
          net_amount,gross_amt from (( hims_d_services_insurance_network Sin\
          inner join hims_d_insurance_network net on net.hims_d_insurance_network_id=Sin.network_id) \
           inner join hims_d_insurance_provider Inp on Sin.insurance_id=Inp.hims_d_insurance_provider_id  )\
           where  Sin.network_id=? AND Sin.services_id=? and service_type_id=? and  Sin.record_status='A' and net.record_status='A'", [_input.network_id, _input.services_id, _input.service_type_id], function (error, result_p) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }
        (0, _logging.debugLog)("p is :", result_p);
        (0, _logging.debugFunction)("inside result of second query if  p is there  ");
        // req.records = extend({
        //   policy_result: result_p[0]
        // });
        (0, _extend2.default)(result_p, resultOffic);
        return resolve(result_p);
      });
    }
  });
}
//created by irfan to add episode and encounter
var addEpisodeEncounter = function addEpisodeEncounter(connection, req, res, callBack, next) {
  var episodeModel = {
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

  (0, _logging.debugFunction)("addEpisode");
  try {
    if (connection == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    var db = req.db;
    var input = (0, _extend2.default)(episodeModel, req.body);

    var currentEncounterNo = null;

    connection.query("select encounter_id from hims_d_options where hims_d_options_id=1", function (error, result) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      currentEncounterNo = result[0].encounter_id;
      (0, _logging.debugLog)("currentEncounterNo:", currentEncounterNo);

      if (currentEncounterNo > 0) {
        var nextEncounterNo = currentEncounterNo + 1;
        (0, _logging.debugLog)("nextEncounterNo:", nextEncounterNo);

        connection.query("update hims_d_options set encounter_id=? where hims_d_options_id=1", [nextEncounterNo], function (error, updateResult) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }

          if (updateResult != null) {
            connection.query("insert into hims_f_patient_encounter(patient_id,provider_id,visit_id,source,status,\
                       episode_id,encounter_id,checked_in,nurse_examine,age,patient_type,queue_no)values(\
                        ?,?,?,?,?,?,?,?,?,?,?,?)", [input.patient_id, input.provider_id, input.visit_id, input.source, input.status, input.episode_id, currentEncounterNo, input.checked_in, input.nurse_examine, input.age, input.patient_type, input.queue_no], function (error, results) {
              if (error) {
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
              }
              if (typeof callBack == "function") {
                callBack(error, results);
              }
            });
          }
        });
      }
    });
  } catch (e) {
    next(e);
  }
};

//Created by noor for synchronus
var addEpisodeEncounterData = function addEpisodeEncounterData(req, res, next) {
  (0, _logging.debugFunction)("addEpisode");

  var db = req.options == null ? req.db : req.options.db;
  var input = (0, _extend2.default)({
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
  }, req.body);

  (0, _logging.debugLog)("Input:", req.body);

  //created_date, created_by, updated_date, updated_by,
  db.query("insert into hims_f_patient_encounter(patient_id,provider_id,visit_id,source,\
           episode_id,age,payment_type,created_date,created_by,updated_date,updated_by)values(\
            ?,?,?,?,?,?,?,?,?,?,?) ", [input.patient_id, input.provider_id, input.visit_id, input.source, input.episode_id, input.age, input.payment_type, new Date(), input.created_by, new Date(), input.updated_by], function (error, results) {
    if (error) {
      (0, _logging.debugLog)("error", error);
      if (req.options == null) {
        connection.rollback(function () {
          (0, _utils.releaseDBConnection)(req.db, db);
          next(error);
        });
      }
    }
    db.query("update hims_f_patient_appointment set visit_created='Y',updated_date=?, \
       updated_by=? where record_status='A' and hims_f_patient_appointment_id=?", [new Date(), input.updated_by, input.hims_f_patient_appointment_id], function (error, patAppointment) {
      if (error) {
        (0, _logging.debugLog)("error", error);
        if (req.options == null) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(req.db, db);
            next(error);
          });
        }
      }
      if (req.options == null) {
        req.records = results;
      } else {
        (0, _logging.debugLog)("Success");
        req.options.onSuccess(results);
      }
    });
  });

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
var getBillDetails = function getBillDetails(req, res, next) {
  (0, _logging.debugFunction)("getBillDetails");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      new Promise(function (resolve, reject) {
        try {
          getBillDetailsFunctionality(req, res, next, resolve);
        } catch (e) {
          reject(e);
        }
      }).then(function (result) {
        (0, _logging.debugLog)("result", result);
        req.records = result;
        (0, _utils.releaseDBConnection)(db, connection);
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//Created by noor for synchronus
var newReceiptData = function newReceiptData(req, res, next) {
  try {
    (0, _logging.debugFunction)("newReceiptFUnc");

    var db = req.options == null ? req.db : req.options.db;

    var inputParam = (0, _extend2.default)({
      hims_f_receipt_header_id: null,
      receipt_number: null,
      receipt_date: null,
      billing_header_id: null,
      total_amount: null,
      created_by: req.userIdentity.algaeh_d_app_user_id,
      updated_by: req.userIdentity.algaeh_d_app_user_id,
      counter_id: null,
      shift_id: null
    }, req.body);

    if (inputParam.receiptdetails == null || inputParam.receiptdetails.length == 0) {
      var genErr = _httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Please select atleast one payment mode.");
      if (req.options == null) {
        next(genErr);
      } else {
        req.options.onFailure(genErr);
      }
    }
    inputParam.receipt_number = req.body.receipt_number;
    db.query("INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, billing_header_id, total_amount,\
       created_by, created_date, updated_by, updated_date,  counter_id, shift_id) VALUES (?,?,?\
    ,?,?,?,?,?,?,?)", [inputParam.receipt_number, new Date(), inputParam.billing_header_id, inputParam.total_amount, inputParam.created_by, new Date(), inputParam.updated_by, new Date(), inputParam.counter_id, inputParam.shift_id], function (error, headerRcptResult) {
      if (error) {
        if (req.options == null) {
          db.rollback(function () {
            (0, _utils.releaseDBConnection)(req.db, db);
            next(error);
          });
        } else {
          req.options.onSuccess(headerRcptResult);
        }
      }

      if (headerRcptResult.insertId != null && headerRcptResult.insertId != "") {
        //let detailsInsert = [];

        // bulkInputArrayObject(inputParam.receiptdetails, detailsInsert, {
        //   hims_f_receipt_header_id: headerRcptResult.insertId
        // });
        var receptSample = ["card_check_number", "expiry_date", "pay_type", "amount", "created_by", "updated_by", "card_type"];
        //   debugLog("Detail Body: ", detailsInsert);

        db.query("INSERT  INTO hims_f_receipt_details ( " + receptSample.join(",") + ",hims_f_receipt_header_id) VALUES ? ", [(0, _utils.jsonArrayToObject)({
          sampleInputObject: receptSample,
          arrayObj: inputParam.receiptdetails,
          req: req,
          newFieldToInsert: [headerRcptResult.insertId]
        })], function (error, RcptDetailsRecords) {
          if (error) {
            if (req.options == null) {
              db.rollback(function () {
                (0, _utils.releaseDBConnection)(req.db, db);
                next(error);
              });
            } else {
              req.options.onFailure(error);
            }
          }
          (0, _logging.debugLog)("Final", req.options);
          if (req.options == null) {
            req.records = headerRcptResult;
          } else {
            req.options.onSuccess(headerRcptResult);
            (0, _logging.debugLog)("Final", headerRcptResult);
          }
        });
      }
    });
  } catch (e) {
    next(e);
  }
};
//End synchronus

//-------------------------------------

//Created by irfan :for synchronus
var addCashHandover = function addCashHandover(req, res, next) {
  try {
    (0, _logging.debugFunction)("cash api");
    var db = req.options == null ? req.db : req.options.db;

    var inputParam = (0, _extend2.default)({
      shift_id: null
    }, req.body);
    (0, _logging.debugLog)("group_type:", req.userIdentity.group_type);
    if (inputParam.receiptdetails == null || inputParam.receiptdetails.length == 0) {
      var genErr = _httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Please select atleast one payment mode.");
      if (req.options == null) {
        next(genErr);
      } else {
        req.options.onFailure(genErr);
      }
    }

    if (req.userIdentity.group_type == "C" || req.userIdentity.group_type == "FD") {
      var hims_f_cash_handover_detail_id = "";
      db.query("select hims_f_cash_handover_detail_id, cash_handover_header_id, casher_id, shift_status,open_date\
      from  hims_f_cash_handover_detail where record_status='A' and casher_id=? and shift_status='O'", [inputParam.created_by], function (error, checkShiftStatus) {
        if (error) {
          if (req.options == null) {
            db.rollback(function () {
              (0, _utils.releaseDBConnection)(req.db, db);
              next(error);
            });
          } else {
            req.options.onFailure(checkShiftStatus);
          }
        }

        (0, _logging.debugLog)("number of shift open", checkShiftStatus);
        if (checkShiftStatus.length > 0) {
          hims_f_cash_handover_detail_id = checkShiftStatus[0].hims_f_cash_handover_detail_id;
        }

        new Promise(function (resolve, reject) {
          try {
            if (checkShiftStatus.length == null || checkShiftStatus.length == "") {
              db.query("INSERT INTO `hims_f_cash_handover_header` ( shift_id, daily_handover_date,\
               created_date, created_by, updated_date, updated_by)\
              VALUE(?,?,?,?,?,?)", [inputParam.shift_id, new Date(), new Date(), inputParam.created_by, new Date(), inputParam.updated_by], function (error, headerCashHandover) {
                if (error) {
                  if (req.options == null) {
                    db.rollback(function () {
                      (0, _utils.releaseDBConnection)(req.db, db);
                      next(error);
                    });
                  } else {
                    req.options.onFailure(headerCashHandover);
                  }
                }

                (0, _logging.debugLog)("headerCashHandover", headerCashHandover);

                if (headerCashHandover.insertId != null && headerCashHandover.insertId != "") {
                  db.query("INSERT INTO `hims_f_cash_handover_detail` ( cash_handover_header_id, casher_id,\
                        shift_status,open_date,  expected_cash, expected_card,  expected_cheque, \
                      no_of_cheques,created_date, created_by, updated_date, updated_by)\
                    VALUE(?,?,?,?,?,?,?,?,?,?,?,?)", [headerCashHandover.insertId, inputParam.created_by, "O", new Date(), 0, 0, 0, 0, new Date(), inputParam.created_by, new Date(), inputParam.updated_by], function (error, CashHandoverDetails) {
                    if (error) {
                      if (req.options == null) {
                        db.rollback(function () {
                          (0, _utils.releaseDBConnection)(req.db, db);
                          next(error);
                        });
                      } else {
                        req.options.onFailure(error);
                      }
                    }
                    if (CashHandoverDetails.insertId != null && CashHandoverDetails.insertId != "") {
                      hims_f_cash_handover_detail_id = CashHandoverDetails.insertId;
                    }
                    (0, _logging.debugLog)("CashHandoverDetails", CashHandoverDetails);
                    resolve(CashHandoverDetails);
                  });
                }
              });
            } else if (checkShiftStatus.length > 0) {
              resolve({});
            }
          } catch (e) {
            reject(e);
          }
        }).then(function (result) {
          //hjjh

          var expected_cash = 0;
          var expected_card = 0;
          var expected_cheque = 0;
          var no_of_cheques = 0;

          expected_cash = new _nodeLinq.LINQ(inputParam.receiptdetails).Where(function (w) {
            return w.pay_type == "CA";
          }).Sum(function (s) {
            return s.amount;
          });
          (0, _logging.debugLog)("expected_cash:", expected_cash);

          expected_card = new _nodeLinq.LINQ(inputParam.receiptdetails).Where(function (w) {
            return w.pay_type == "CD";
          }).Sum(function (s) {
            return s.amount;
          });
          (0, _logging.debugLog)("expected_card:", expected_card);

          expected_cheque = new _nodeLinq.LINQ(inputParam.receiptdetails).Where(function (w) {
            return w.pay_type == "CH";
          }).Sum(function (s) {
            return s.amount;
          });
          (0, _logging.debugLog)("expected_cheque:", expected_cheque);

          no_of_cheques = new _nodeLinq.LINQ(inputParam.receiptdetails).Where(function (w) {
            return w.pay_type == "CH";
          }).ToArray().length;

          (0, _logging.debugLog)("no_of_cheques:", no_of_cheques);

          db.query("select expected_cash,expected_card, expected_cheque, no_of_cheques from \
          hims_f_cash_handover_detail where record_status='A' and hims_f_cash_handover_detail_id=?", [hims_f_cash_handover_detail_id], function (error, selectCurrentCash) {
            if (error) {
              if (req.options == null) {
                db.rollback(function () {
                  (0, _utils.releaseDBConnection)(req.db, db);
                  next(error);
                });
              } else {
                req.options.onFailure(selectCurrentCash);
              }
            }
            (0, _logging.debugLog)("selectCurrentCash:", selectCurrentCash);
            expected_cash += selectCurrentCash[0].expected_cash;
            expected_card += selectCurrentCash[0].expected_card;
            expected_cheque += selectCurrentCash[0].expected_cheque;
            no_of_cheques += selectCurrentCash[0].no_of_cheques;

            db.query("update hims_f_cash_handover_detail set expected_cash=?,expected_card=?,\
              expected_cheque=?,no_of_cheques=?,updated_date=?,updated_by=? where record_status='A' \
              and hims_f_cash_handover_detail_id=?;", [expected_cash, expected_card, expected_cheque, no_of_cheques, new Date(), inputParam.updated_by, hims_f_cash_handover_detail_id], function (error, updateResult) {
              if (error) {
                if (req.options == null) {
                  db.rollback(function () {
                    (0, _utils.releaseDBConnection)(req.db, db);
                    next(error);
                  });
                } else {
                  req.options.onFailure(updateResult);
                }
              }

              if (req.options == null) {
                req.records = updateResult;
                next();
                (0, _logging.debugLog)("indi pendent", updateResult);
              } else {
                req.options.onSuccess(updateResult);
                (0, _logging.debugLog)("updateResult", updateResult);
              }
            });
          });
        });
      });
    } else {
      if (req.options == null) {
        req.records = { mesage: "not a cahsier" };
        next();
        (0, _logging.debugLog)("ELSE KK");
      } else {
        req.options.onSuccess({});
      }
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addBill: addBill,
  addBillData: addBillData,
  billingCalculations: billingCalculations,
  getBillDetails: getBillDetails,
  newReceipt: newReceipt,
  patientAdvanceRefund: patientAdvanceRefund,
  addEpisodeEncounter: addEpisodeEncounter,
  getBillDetailsFunctionality: getBillDetailsFunctionality,
  addEpisodeEncounterData: addEpisodeEncounterData,
  newReceiptData: newReceiptData,
  addCashHandover: addCashHandover
};
//# sourceMappingURL=billing.js.map