"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

var _billing = require("../model/billing");

var _nodeLinq = require("node-linq");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//import { insertLadOrderedServices } from "../model/laboratory";

var billingCounter = 0;
//created by irfan :to save opbilling data
var addOpBIlling = function addOpBIlling(req, res, next) {
  (0, _logging.debugFunction)("addOpBIlling");
  billingCounter = billingCounter + 1;
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    (0, _logging.debugLog)("db:", req.db);
    if (req.query["data"] != null) {
      req.query = JSON.parse(req.query["data"]);
      req.body = req.query;
    }

    var connection = req.connection;
    connection.beginTransaction(function (error) {
      if (error) {
        connection.rollback(function () {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        });
      }
      (0, _logging.debugFunction)("updateFrontDesk Promise");
      return new Promise(function (resolve, reject) {
        (0, _utils.runningNumberGen)({
          db: connection,
          counter: billingCounter,
          module_desc: ["PAT_BILL", "RECEIPT"],
          onFailure: function onFailure(error) {
            reject(error);
          },
          onSuccess: function onSuccess(result) {
            resolve(result);
          }
        });
      }).then(function (output) {
        var receipt = new _nodeLinq.LINQ(output).Where(function (w) {
          return w.module_desc == "RECEIPT";
        }).FirstOrDefault();
        req.body.receipt_number = receipt.completeNumber;

        return new Promise(function (resolve, reject) {
          (0, _logging.debugLog)("Inside Receipts");

          req.options = {
            db: connection,
            onFailure: function onFailure(error) {
              reject(error);
            },
            onSuccess: function onSuccess(result) {
              resolve(result);
            }
          };

          (0, _billing.newReceiptData)(req, res, next);
        }).then(function (billOutput) {
          (0, _logging.debugLog)("Orver all records number gen", output);
          (0, _logging.debugLog)("Data: ", output);

          req.query.receipt_header_id = billOutput.insertId;
          req.body.receipt_header_id = billOutput.insertId;

          var bill = new _nodeLinq.LINQ(output).Where(function (w) {
            return w.module_desc == "PAT_BILL";
          }).FirstOrDefault();

          (0, _logging.debugLog)("Data: ", bill);
          req.bill_number = bill.completeNumber;
          req.body.bill_number = bill.completeNumber;
          return new Promise(function (resolve, reject) {
            (0, _logging.debugLog)("Inside Billing");
            delete req["options"]["onFailure"];
            delete req["options"]["onSuccess"];
            req.options = {
              db: connection,
              onFailure: function onFailure(error) {
                reject(error);
              },
              onSuccess: function onSuccess(result) {
                resolve(result);
              }
            };
            //Bill generation
            (0, _billing.addBillData)(req, res, next);
          }).then(function (receiptData) {
            req.records = receiptData;
            if (billingCounter != 0) billingCounter = billingCounter - 1;
            (0, _utils.releaseDBConnection)(db, connection);
            next();
          });
        });
      }).catch(function (error) {
        if (billingCounter != 0) billingCounter = billingCounter - 1;
        connection.rollback(function () {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

var selectBill = function selectBill(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var connection = req.connection;
    // db.getConnection((error, connection) => {
    //   if (error) {
    //     next(error);
    //   }
    // let where = whereCondition(extend(selectWhere, req.query));
    connection.query(
    //   "SELECT  `hims_f_billing_header_id`, `patient_id`, `billing_type_id`, `visit_id`, `bill_number`,\
    //   'incharge_or_provider`,`bill_date`,`advance_amount`,`advance_adjust`,`discount_amount`,`sub_total_amount`,\
    //   `total_tax`,`net_total`,`billing_status`,`copay_amount`,`deductable_amount`,`sec_copay_amount`,\
    //   `sec_deductable_amount`,`gross_total`,`sheet_discount_amount`,`sheet_discount_percentage`,`net_amount`,\
    //   `patient_res`,`company_res`,`sec_company_res`,`patient_payable`,`company_payable`,`sec_company_payable`,\
    //   `patient_tax`,`company_tax`,`sec_company_tax`,`net_tax`,`credit_amount`,`receiveable_amount' \
    //   FROM `hims_f_billing_header` \
    //  WHERE `record_status`='A' AND " +

    //===========
    // SELECT * FROM hims_f_billing_header INNER JOIN hims_f_billing_details ON \
    //         hims_f_billing_header.hims_f_billing_header_id=hims_f_billing_details.hims_f_billing_header_id \
    //         inner join hims_f_patient as PAT on hims_f_billing_header.patient_id = PAT.hims_d_patient_id \
    //         where hims_f_billing_header.record_status='A' AND hims_f_billing_header.bill_number

    // INNER JOIN hims_f_billing_details bd  ON\
    // bh.hims_f_billing_header_id=bd.hims_f_billing_header_id\
    "SELECT * FROM hims_f_billing_header bh \
      inner join hims_f_patient as PAT on bh.patient_id = PAT.hims_d_patient_id\
      inner join hims_f_patient_visit as vst on bh.visit_id = vst.hims_f_patient_visit_id\
      where bh.record_status='A' AND bh.bill_number='" + req.query.bill_number + "'", function (error, headerResult) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }
      (0, _logging.debugLog)("result: ", headerResult);
      if (headerResult.length != 0) {
        (0, _logging.debugLog)("hims_f_billing_header_id: ", headerResult[0].hims_f_billing_header_id);
        connection.query("select * from hims_f_billing_details where hims_f_billing_header_id=? and record_status='A'", headerResult[0].hims_f_billing_header_id, function (error, billdetails) {
          if (error) {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          }
          req.records = _extends({}, headerResult[0], { billdetails: billdetails }, {
            hims_f_receipt_header_id: headerResult[0].receipt_header_id
          });
          (0, _utils.releaseDBConnection)(db, connection);
          next();
          (0, _logging.debugLog)("Billing Result: ", req.records);
        });
      } else {
        req.records = headerResult;
        (0, _utils.releaseDBConnection)(db, connection);
        next();
      }
    });
    // });
  } catch (e) {
    next(e);
  }
};

var getPednigBills = function getPednigBills(req, res, next) {
  var selectWhere = _defineProperty({
    visit_id: "ALL",
    patient_id: "ALL"
  }, "visit_id", "ALL");

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    req.query["date(S.created_date)"] = req.query.created_date;
    delete req.query.created_date;

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));
      connection.query("SELECT  S.patient_id, S.visit_id, S.insurance_yesno, P.patient_code,P.full_name FROM hims_f_ordered_services S,hims_f_patient P  \
       WHERE S.record_status='A' AND S.billed='N' AND P.hims_d_patient_id=S.patient_id AND" + where.condition, where.values, function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { addOpBIlling: addOpBIlling, selectBill: selectBill, getPednigBills: getPednigBills };
//# sourceMappingURL=opBilling.js.map