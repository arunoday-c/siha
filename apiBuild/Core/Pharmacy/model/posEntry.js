"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utils = require("../../utils");

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../../utils/logging");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _billing = require("../../model/billing");

var _commonFunction = require("./commonFunction");

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _nodeLinq = require("node-linq");

var _winston = require("winston");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by Nowshad: to Insert POS Entry
var addPosEntry = function addPosEntry(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    (0, _logging.debugLog)("inside", "add stock");
    (0, _logging.debugLog)("req date: ", req.records);

    var connection = req.connection;

    var requestCounter = 1;

    return new _bluebird2.default(function (resolve, reject) {
      (0, _utils.runningNumberGen)({
        db: connection,
        counter: requestCounter,
        module_desc: ["POS_NUM"],
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

      var year = (0, _moment2.default)().format("YYYY");
      (0, _logging.debugLog)("onlyyear:", year);

      var today = (0, _moment2.default)().format("YYYY-MM-DD");
      (0, _logging.debugLog)("today:", today);

      var month = (0, _moment2.default)().format("MM");
      (0, _logging.debugLog)("month:", month);
      var period = month;

      (0, _logging.debugLog)("period:", period);
      connection.query("INSERT INTO `hims_f_pharmacy_pos_header` (pos_number,pos_date,patient_id,visit_id,ip_id,`year`,period,\
                location_id, location_type, sub_total, discount_percentage, discount_amount, net_total, copay_amount, patient_responsibility,\
                patient_tax, patient_payable,company_responsibility,company_tax,company_payable,comments, sec_company_responsibility,\
                sec_company_tax,sec_company_payable,sec_copay_amount,net_tax,gross_total,sheet_discount_amount,\
                sheet_discount_percentage,net_amount,credit_amount,balance_credit,receiveable_amount, card_number,effective_start_date,effective_end_date,\
                insurance_provider_id, sub_insurance_provider_id, network_id, network_type, network_office_id, policy_number, \
                secondary_card_number, secondary_effective_start_date, secondary_effective_end_date, secondary_insurance_provider_id,\
                secondary_network_id, secondary_network_type, secondary_sub_insurance_provider_id, secondary_network_office_id, \
                receipt_header_id, created_date,created_by,updated_date,updated_by) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [documentCode, today, input.patient_id, input.visit_id, input.ip_id, year, period, input.location_id, input.location_type, input.sub_total, input.discount_percentage, input.discount_amount, input.net_total, input.copay_amount, input.patient_responsibility, input.patient_tax, input.patient_payable, input.company_responsibility, input.company_tax, input.company_payable, input.comments, input.sec_company_responsibility, input.sec_company_tax, input.sec_company_payable, input.sec_copay_amount, input.net_tax, input.gross_total, input.sheet_discount_amount, input.sheet_discount_percentage, input.net_amount, input.credit_amount, input.balance_credit, input.receiveable_amount, input.card_number, input.effective_start_date, input.effective_end_date, input.insurance_provider_id, input.sub_insurance_provider_id, input.network_id, input.network_type, input.network_office_id, input.policy_number, input.secondary_card_number, input.secondary_effective_start_date, input.secondary_effective_end_date, input.secondary_insurance_provider_id, input.secondary_network_id, input.secondary_network_type, input.secondary_sub_insurance_provider_id, input.secondary_network_office_id, req.records.receipt_header_id, new Date(), req.userIdentity.algaeh_d_app_user_id, new Date(), req.userIdentity.algaeh_d_app_user_id], function (error, headerResult) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }

        (0, _logging.debugLog)(" pos header id :", headerResult);

        if (headerResult.insertId != null) {
          var insurtColumns = ["item_id", "item_category", "item_group_id", "service_id", "grn_no", "barcode", "qtyhand", "expiry_date", "batchno", "uom_id", "quantity", "insurance_yesno", "tax_inclusive", "unit_cost", "extended_cost", "discount_percentage", "discount_amount", "net_extended_cost", "copay_percent", "copay_amount", "patient_responsibility", "patient_tax", "patient_payable", "company_responsibility", "company_tax", "company_payable", "sec_copay_percent", "sec_copay_amount", "sec_company_responsibility", "sec_company_tax", "sec_company_payable"];

          connection.query("INSERT INTO hims_f_pharmacy_pos_detail(" + insurtColumns.join(",") + ",pharmacy_pos_header_id) VALUES ?", [(0, _utils.jsonArrayToObject)({
            sampleInputObject: insurtColumns,
            arrayObj: req.body.pharmacy_stock_detail,
            newFieldToInsert: [headerResult.insertId],
            req: req
          })], function (error, detailResult) {
            if (error) {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            }

            req.records = {
              pos_number: documentCode,
              hims_f_pharmacy_pos_header_id: headerResult.insertId,
              receipt_number: req.records.receipt_number,
              year: year,
              period: period
            };
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

//created by Nowshad: to get Pharmacy POS Entry
var getPosEntry = function getPosEntry(req, res, next) {
  var selectWhere = {
    pos_number: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    var connection = req.connection;
    // PH.recieve_amount
    connection.query("SELECT hims_f_pharmacy_pos_header_id,receipt_header_id,PH.pos_number,PH.patient_id,P.patient_code,P.full_name as full_name,PH.visit_id,V.visit_code,PH.ip_id,PH.pos_date,PH.year,\
        PH.period,PH.location_id,L.location_description,PH.location_type,PH.sub_total,PH.discount_percentage,PH.discount_amount,PH.net_total,\
        PH.copay_amount,PH.patient_responsibility,PH.patient_tax,PH.patient_payable,PH.company_responsibility,PH.company_tax,\
        PH.company_payable,PH.comments,PH.sec_company_responsibility,PH.sec_company_tax,PH.sec_company_payable,\
        PH.sec_copay_amount,PH.net_tax,PH.gross_total,PH.sheet_discount_amount,PH.sheet_discount_percentage,\
        PH.net_amount,PH.credit_amount,PH.balance_credit,PH.receiveable_amount,PH.posted,PH.card_number,PH.effective_start_date,\
        PH.effective_end_date,PH.insurance_provider_id,PH.sub_insurance_provider_id,PH.network_id,PH.network_type,\
        PH.network_office_id,PH.policy_number,PH.secondary_card_number,PH.secondary_effective_start_date,\
        PH.secondary_effective_end_date,PH.secondary_insurance_provider_id,PH.secondary_network_id,PH.secondary_network_type,\
        PH.secondary_sub_insurance_provider_id,PH.secondary_network_office_id from  hims_f_pharmacy_pos_header PH inner join hims_d_pharmacy_location L\
         on PH.location_id=L.hims_d_pharmacy_location_id left outer join hims_f_patient_visit V on\
         PH.visit_id=V.hims_f_patient_visit_id left outer join hims_f_patient P on PH.patient_id=P.hims_d_patient_id\
        where PH.record_status='A' and L.record_status='A' and  " + where.condition, where.values, function (error, headerResult) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      (0, _logging.debugLog)("result: ", headerResult);
      if (headerResult.length != 0) {
        (0, _logging.debugLog)("hims_f_pharmacy_pos_header_id: ", headerResult[0].hims_f_pharmacy_pos_header_id);
        connection.query("select * from hims_f_pharmacy_pos_detail where pharmacy_pos_header_id=? and record_status='A'", headerResult[0].hims_f_pharmacy_pos_header_id, function (error, pharmacy_stock_detail) {
          if (error) {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          }
          req.records = _extends({}, headerResult[0], { pharmacy_stock_detail: pharmacy_stock_detail }, {
            hims_f_receipt_header_id: headerResult[0].receipt_header_id
          });
          (0, _utils.releaseDBConnection)(db, connection);
          next();
          (0, _logging.debugLog)("POS Result: ", req.records);
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

//created by Nowshad: to Post POS Entry
var updatePosEntry = function updatePosEntry(req, res, next) {
  var PosEntry = {
    posted: null,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  (0, _logging.debugLog)("hims_f_pharmacy_pos_header_id", req.records.hims_f_pharmacy_pos_header_id);

  req.body.hims_f_pharmacy_pos_header_id = req.records.hims_f_pharmacy_pos_header_id;
  req.body.transaction_id = req.records.hims_f_pharmacy_pos_header_id;
  req.body.year = req.records.year;
  req.body.period = req.records.period;

  (0, _logging.debugLog)("Body : ", req.body);
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var connection = req.connection;

    return new _bluebird2.default(function (resolve, reject) {
      var inputParam = (0, _extend2.default)(PosEntry, req.body);

      (0, _logging.debugLog)("posted", inputParam.posted);
      (0, _logging.debugLog)("pharmacy_stock_detail", req.body.pharmacy_stock_detail);
      connection.query("UPDATE `hims_f_pharmacy_pos_header` SET `posted`=?, `updated_by`=?, `updated_date`=? \
          WHERE `record_status`='A' and `hims_f_pharmacy_pos_header_id`=?", [inputParam.posted, req.userIdentity.algaeh_d_app_user_id, new Date(), inputParam.hims_f_pharmacy_pos_header_id], function (error, result) {
        (0, _logging.debugLog)("error", error);
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }).then(function (output) {
      return new _bluebird2.default(function (resolve, reject) {
        (0, _logging.debugLog)("output", output);
        req.options = {
          db: connection,
          onFailure: function onFailure(error) {
            (0, _logging.debugLog)("error: ", error);
            reject(error);
          },
          onSuccess: function onSuccess(result) {
            (0, _logging.debugLog)("Success: ", result);
            resolve(result);
          }
        };
        // const error = new Error();
        // error.message = "Test";
        // reject(error);
        (0, _commonFunction.updateIntoItemLocation)(req, res, next);
      }).then(function (records) {
        (0, _logging.debugLog)("records: ", records);
        if (records == null) {
          throw new _winston.exception();
        }

        req.posUpdate = records;
        next();
      }).catch(function (error) {
        (0, _logging.debugLog)("caught1: ", error);
        connection.rollback(function () {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        });
      });
    }).catch(function (error) {
      (0, _logging.debugLog)("caught2: ", error);
      connection.rollback(function () {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      });
    });
  } catch (e) {
    next(e);
  }
};

//get Prescription POS
var getPrescriptionPOS = function getPrescriptionPOS(req, res, next) {
  (0, _logging.debugFunction)("getPrescriptionPOS");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      (0, _logging.debugLog)("req.body", req.body);
      var _reqBody = req.body;
      var item_ids = new _nodeLinq.LINQ(_reqBody).Select(function (s) {
        return s.item_id;
      }).ToArray();
      var location_ids = new _nodeLinq.LINQ(_reqBody).Select(function (s) {
        return s.pharmacy_location_id;
      }).ToArray();
      var _message = "";
      return new _bluebird2.default(function (resolve, reject) {
        connection.query("select itmloc.item_id, itmloc.pharmacy_location_id, itmloc.batchno, itmloc.expirydt, itmloc.qtyhand, itmloc.grnno, itmloc.sales_uom, item.item_description \
          from hims_m_item_location as itmloc inner join hims_d_item_master as item on itmloc.item_id = item.hims_d_item_master_id  \
          where item_id in (?) and pharmacy_location_id in (?) and qtyhand > 0", [item_ids, location_ids], function (error, result) {
          if (error) {
            reject(error);
          }
          (0, _logging.debugLog)("result", result);

          var _req = new _nodeLinq.LINQ(result).Select(function (s) {
            var ItemcatrgoryGroup = new _nodeLinq.LINQ(_reqBody).Where(function (w) {
              return w.item_id == s.item_id && w.pharmacy_location_id == s.pharmacy_location_id;
            }).FirstOrDefault();

            (0, _logging.debugLog)("ItemcatrgoryGroup", ItemcatrgoryGroup);
            return _extends({}, new _nodeLinq.LINQ(_reqBody).Where(function (w) {
              return w.item_id == s.item_id && w.pharmacy_location_id == s.pharmacy_location_id;
            }).FirstOrDefault(), {
              batchno: s.batchno,
              expirydt: s.expirydt,
              grnno: s.grnno,
              sales_uom: s.sales_uom,
              qtyhand: s.qtyhand,

              item_category_id: ItemcatrgoryGroup.item_category_id,
              item_group_id: ItemcatrgoryGroup.item_group_id
            });
          }).ToArray();

          req.body = _req;

          var _loop = function _loop(i) {
            (0, _logging.debugLog)("for: ", _reqBody[i]);
            var _mess = new _nodeLinq.LINQ(result).Where(function (w) {
              return w.item_id !== _reqBody[i].item_id;
            }).FirstOrDefault();
            (0, _logging.debugLog)("_mess: ", _mess);

            if (_mess != null) {
              _message = "Invalid Input. Some Items not avilable in selected location, Please check Prescription and stock enquiry for more details.";
            }
            // _message +=
            //   "Some of Items '" +
            //   _reqBody[i]["item_id"] +
            //   "' not avilable in selected location ";
          };

          for (var i = 0; i < _reqBody.length; i++) {
            _loop(i);
          }

          resolve(result);
        });
      }).then(function (result) {
        //check then
        (0, _logging.debugLog)("result them:", result);
        if (result.length > 0) {
          (0, _logging.debugLog)("result them:", result);
          return new _bluebird2.default(function (resolve, reject) {
            try {
              (0, _billing.getBillDetailsFunctionality)(req, res, next, resolve);
            } catch (e) {
              reject(e);
            }
          }).then(function (resultbilling) {
            //expiry_date, uom_id, and batchno add with the result
            (0, _logging.debugLog)("Check result: ", resultbilling);

            var _result = result != null && result.length > 0 ? result[0] : {};
            // if (resultbilling != null && resultbilling.length > 0) {
            (0, _logging.debugLog)("_message: ", _message);
            _result.message = _message;
            (0, _logging.debugLog)("_result", _result);
            (0, _logging.debugLog)("resultbilling", resultbilling);
            var obj = {
              result: [_extends({}, resultbilling, _result)]
            };
            (0, _logging.debugLog)("obj: ", obj);
            req.records = obj;
            (0, _utils.releaseDBConnection)(db, connection);
            next();
          });
        } else {
          (0, _logging.debugLog)("result else:  ", result);
          var message = "Invalid Input. Items not avilable in selected location, for this Prescription Please check Prescription List or stock enquiry for more details.";
          var obj = {
            result: result,
            message: message
          };

          (0, _logging.debugLog)("result message:  ", obj);
          req.records = obj;
          (0, _utils.releaseDBConnection)(db, connection);
          next();
        }
      }).catch(function (e) {
        connection.rollback(function () {
          (0, _utils.releaseDBConnection)(db, connection);
          next(e);
        });
      });
      // });
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addPosEntry: addPosEntry,
  getPosEntry: getPosEntry,
  updatePosEntry: updatePosEntry,
  getPrescriptionPOS: getPrescriptionPOS
};
//# sourceMappingURL=posEntry.js.map