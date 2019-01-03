"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var billingCounter = 0;
//created by Nowshad :to save POS Cancellation data
var addPOSCreidtSettlement = function addPOSCreidtSettlement(req, res, next) {
  (0, _logging.debugFunction)("addPOSCreidtSettlement");
  billingCounter = billingCounter + 1;
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var inputParam = (0, _extend2.default)({}, req.body);

    inputParam.reciept_header_id = req.records.receipt_header_id;
    inputParam.hospital_id = 1;

    var connection = req.connection;

    return new Promise(function (resolve, reject) {
      (0, _utils.runningNumberGen)({
        db: connection,
        counter: billingCounter,
        module_desc: ["POS_CRD"],
        onFailure: function onFailure(error) {
          reject(error);
        },
        onSuccess: function onSuccess(result) {
          resolve(result);
        }
      });
    }).then(function (result) {
      var documentCode = result[0].completeNumber;
      (0, _logging.debugLog)("documentCode:", documentCode);

      connection.query("INSERT INTO hims_f_pos_credit_header ( pos_credit_number, pos_credit_date, patient_id, reciept_amount, write_off_amount,\
          hospital_id,recievable_amount, remarks, reciept_header_id,transaction_type, write_off_account,\
          created_by, created_date) \
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", [documentCode, inputParam.pos_credit_date != null ? new Date(inputParam.pos_credit_date) : inputParam.pos_credit_date, inputParam.patient_id, inputParam.reciept_amount, inputParam.write_off_amount, inputParam.hospital_id, inputParam.recievable_amount, inputParam.remarks, inputParam.reciept_header_id, inputParam.transaction_type, inputParam.write_off_account, inputParam.created_by, new Date()], function (error, headerResult) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }

        (0, _logging.debugLog)(" pos header id :", headerResult);

        if (headerResult.insertId != null) {
          (0, _logging.debugLog)("Billing Header ", headerResult.insertId);

          var insurtColumns = ["pos_header_id", "include", "bill_date", "credit_amount", "receipt_amount", "balance_amount", "previous_balance", "bill_amount"];

          connection.query("INSERT INTO hims_f_pos_credit_detail(" + insurtColumns.join(",") + ", pos_credit_header_id) VALUES ?", [(0, _utils.jsonArrayToObject)({
            sampleInputObject: insurtColumns,
            arrayObj: inputParam.criedtdetails,
            newFieldToInsert: [headerResult.insertId],
            req: req
          })], function (error, detailsRecords) {
            if (error) {
              (0, _logging.debugLog)("error: ", error);
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            }

            req.records = {
              pos_credit_number: documentCode,
              hims_f_pos_credit_header_id: headerResult.insertId,
              receipt_number: req.records.receipt_number
            };
            (0, _utils.releaseDBConnection)(db, connection);
            next();
          });
        } else {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

var getPOSCreidtSettlement = function getPOSCreidtSettlement(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var connection = req.connection;

    connection.query("SELECT *, bh.reciept_header_id as cal_receipt_header_id FROM hims_f_pos_credit_header bh \
      inner join hims_f_patient as PAT on bh.patient_id = PAT.hims_d_patient_id \
      where  bh.pos_credit_number='" + req.query.pos_credit_number + "'", function (error, headerResult) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      (0, _logging.debugLog)("result: ", headerResult);
      if (headerResult.length != 0) {
        (0, _logging.debugLog)("hims_f_pos_credit_header_id: ", headerResult[0].hims_f_pos_credit_header_id);
        connection.query("select * from hims_f_pos_credit_detail bh inner join hims_f_pharmacy_pos_header as pos on \
            bh.pos_header_id = pos.hims_f_pharmacy_pos_header_id where pos_credit_header_id=?", headerResult[0].hims_f_pos_credit_header_id, function (error, criedtdetails) {
          if (error) {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          }
          req.records = _extends({}, headerResult[0], { criedtdetails: criedtdetails }, {
            hims_f_receipt_header_id: headerResult[0].cal_receipt_header_id
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

//created by Nowshad: to Update PO Entry
var updatePOSBilling = function updatePOSBilling(req, res, next) {
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  var connection = req.connection;
  var inputParam = (0, _extend2.default)({}, req.body);

  var details = inputParam.criedtdetails;
  var qry = "";
  for (var i = 0; i < details.length; i++) {
    (0, _logging.debugLog)("pos_header_id: ", details[i].pos_header_id);
    var balance_credit = details[i].previous_balance - details[i].receipt_amount;

    qry += " UPDATE `hims_f_pharmacy_pos_header` SET balance_credit='" + balance_credit + "' WHERE hims_f_pharmacy_pos_header_id='" + details[i].pos_header_id + "';";
  }
  (0, _logging.debugLog)("qry: ", qry);
  if (qry != "") {
    connection.query(qry, function (error, result) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }
      req.data = result;
      next();
    });
  } else {
    (0, _utils.releaseDBConnection)(db, connection);
    req.records = {};
    next();
  }
};

//Created by nowshad to get the POS which has creidt amount
var getPatientPOSCriedt = function getPatientPOSCriedt(req, res, next) {
  var whereStatement = {
    patient_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var where = (0, _utils.whereCondition)((0, _extend2.default)(whereStatement, req.query));
      connection.query("SELECT * from hims_f_pharmacy_pos_header  \
           WHERE record_status='A' AND balance_credit > 0 AND" + where.condition + " order by hims_f_pharmacy_pos_header_id desc", where.values, function (error, result) {
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

module.exports = {
  addPOSCreidtSettlement: addPOSCreidtSettlement,
  getPOSCreidtSettlement: getPOSCreidtSettlement,
  updatePOSBilling: updatePOSBilling,
  getPatientPOSCriedt: getPatientPOSCriedt
};
//# sourceMappingURL=POSCreditSettlement.js.map