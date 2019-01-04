"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utils = require("../utils");

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by Nowshad: to get Pharmacy POS Entry
var getReceiptEntry = function getReceiptEntry(req, res, next) {
  var selectWhere = {
    pos_number: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    (0, _logging.debugLog)("Records: ", req.records);

    var connection = req.connection;
    var hims_f_receipt_header_id = req.records.hims_f_receipt_header_id || req.records[0].receipt_header_id;

    (0, _logging.debugLog)("hims_f_receipt_header_id: ", hims_f_receipt_header_id);
    // PH.recieve_amount
    connection.query("select * from hims_f_receipt_header where hims_f_receipt_header_id=? and record_status='A'", hims_f_receipt_header_id, function (error, headerResult) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      (0, _logging.debugLog)("result: ", headerResult);
      if (headerResult.length != 0) {
        (0, _logging.debugLog)("hims_f_receipt_header_id: ", headerResult[0].hims_f_receipt_header_id);
        connection.query("select * from hims_f_receipt_details where hims_f_receipt_header_id=? and record_status='A'", headerResult[0].hims_f_receipt_header_id, function (error, receiptdetails) {
          if (error) {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          }
          req.receptEntry = _extends({}, headerResult[0], { receiptdetails: receiptdetails });
          (0, _utils.releaseDBConnection)(db, connection);
          next();
          (0, _logging.debugLog)("Receipt Result: ", req.receptEntry);
        });
      } else {
        req.records = headerResult;
        (0, _utils.releaseDBConnection)(db, connection);
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by:irfan, Patient-receipt if advance or  Refund to patient
var ReceiptPaymentInsert = function ReceiptPaymentInsert(req, res, next) {
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

  (0, _logging.debugFunction)("Receipt POS and Sales");

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var connection = req.connection;
    connection.beginTransaction(function (error) {
      if (error) {
        connection.rollback(function () {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        });
      }

      var inputParam = (0, _extend2.default)(P_receiptHeaderModel, req.body);

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
                req.records = {
                  receipt_header_id: headerRcptResult.insertId,
                  receipt_number: inputParam.receipt_number
                };
                (0, _utils.releaseDBConnection)(db, connection);
                next();

                (0, _logging.debugLog)("Records: ", req.records);
              });
            } else {
              (0, _logging.debugLog)("Data is not inerted to billing header");
              (0, _utils.releaseDBConnection)(db, connection);
              connection.rollback(function () {
                next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Technical issue while Sale Retun"));
              });
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
            (0, _logging.debugLog)("Insert : ", inputParam.receiptdetails);
            if (headerRcptResult.insertId != null && headerRcptResult.insertId != "") {
              // receipt details table insert
              var receptSample = ["card_check_number", "expiry_date", "pay_type", "amount", "created_by", "updated_by", "card_type"];
              connection.query("INSERT  INTO hims_f_receipt_details ( " + receptSample.join(",") + ",hims_f_receipt_header_id) VALUES ? ", [(0, _utils.jsonArrayToObject)({
                sampleInputObject: receptSample,
                arrayObj: inputParam.receiptdetails,
                req: req,
                newFieldToInsert: [headerRcptResult.insertId]
              })], function (error, RcptDetailsRecords) {
                (0, _logging.debugLog)("Error : ", error);
                if (error) {
                  connection.rollback(function () {
                    (0, _utils.releaseDBConnection)(db, connection);
                    next(error);
                  });
                }
                (0, _logging.debugFunction)("inside details result");
                req.records = {
                  receipt_header_id: headerRcptResult.insertId,
                  receipt_number: inputParam.receipt_number
                };
                (0, _utils.releaseDBConnection)(db, connection);
                next();

                (0, _logging.debugLog)("Records: ", req.records);
              });
            } else {
              (0, _logging.debugLog)("Data is not inerted to billing header");
              (0, _utils.releaseDBConnection)(db, connection);
              connection.rollback(function () {
                next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Technical issue while Sale Retun"));
              });
            }
          });
        }); //end of runing number PYMNT
      }
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getReceiptEntry: getReceiptEntry,
  ReceiptPaymentInsert: ReceiptPaymentInsert
};
//# sourceMappingURL=receiptentry.js.map