"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _nodeLinq = require("node-linq");

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan: to get doctors commission
var getDoctorsCommission = function getDoctorsCommission(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var input = (0, _extend2.default)({}, req.query);

    db.getConnection(function (error, connection) {
      connection.query("select hims_f_billing_header_id from hims_f_billing_header where record_status='A'\
           and incharge_or_provider=? and date(bill_date) between ? and ? ", [input.incharge_or_provider, input.from_date, input.to_date], function (error, result) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }

        var bill_header_id_all = new _nodeLinq.LINQ(result).Where(function (w) {
          return w.hims_f_billing_header_id != null;
        }).Select(function (s) {
          return s.hims_f_billing_header_id;
        }).ToArray();

        if (result.length != 0) {
          var service_type_id = "";
          if (input.select_type == "SS" && input.service_type_id != "null") {
            service_type_id = "service_type_id=" + input.service_type_id + " and";
          }

          connection.query("select BD.hims_f_billing_header_id,incharge_or_provider as provider_id,hims_f_billing_details_id,BH.bill_number,BH.bill_date,service_type_id as servtype_id,services_id as service_id,quantity,\
              unit_cost,gross_amount as extended_cost,discount_amout as discount_amount,net_amout as net_amount,BD.patient_payable as patient_share,company_payble as company_share,sec_company_paybale\
              from hims_f_billing_details BD,hims_f_billing_header BH where BH.record_status='A' and BD.record_status='A' and \
               BD.hims_f_billing_header_id=BH.hims_f_billing_header_id and " + service_type_id + " BD.hims_f_billing_header_id in (" + bill_header_id_all + ");", function (error, results) {
            if (error) {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            }

            if (results.length != 0) {
              var _loop = function _loop(i) {
                connection.query(" select hims_m_doctor_service_commission_id,op_cash_commission_percent as op_cash_comission_percentage, op_credit_commission_percent as op_crd_comission_percentage,\
                     ip_cash_commission_percent, ip_credit_commission_percent from\
                     hims_m_doctor_service_commission where record_status='A' and provider_id=?  and services_id=? and service_type_id=?", [results[i].provider_id, results[i].service_id, results[i].servtype_id], function (error, service_commission) {
                  if (error) {
                    (0, _utils.releaseDBConnection)(db, connection);
                    next(error);
                  }

                  new Promise(function (resolve, reject) {
                    try {
                      if (service_commission.length != 0) {
                        results[i] = _extends({}, results[i], service_commission[0]);
                        return resolve(results);
                      } else {
                        connection.query(" SELECT hims_m_doctor_service_type_commission_id, op_cash_comission_percent as op_cash_comission_percentage, op_credit_comission_percent as op_crd_comission_percentage, \
                                 ip_cash_commission_percent, ip_credit_commission_percent from hims_m_doctor_service_type_commission where record_status='A'  and provider_id=?\
                               and service_type_id=?", [results[i].provider_id, results[i].servtype_id], function (error, sType_comm) {
                          if (error) {
                            (0, _utils.releaseDBConnection)(db, connection);
                            next(error);
                          }

                          if (sType_comm.length != 0) {
                            results[i] = _extends({}, results[i], sType_comm[0]);

                            return resolve(results);
                          } else {
                            results[i] = _extends({}, results[i], { commission_not_exist: true });
                            return resolve();
                          }
                        });
                      }
                    } catch (e) {
                      reject(e);
                    }
                  }).then(function (result) {
                    if (i == results.length - 1) {
                      req.records = result;
                      (0, _utils.releaseDBConnection)(db, connection);
                      next();
                    }
                  });
                });
              };

              for (var i = 0; i < results.length; i++) {
                _loop(i);
              }
            } else {
              req.records = results;
              (0, _utils.releaseDBConnection)(db, connection);
              next();
            }
          });
        } else {
          (0, _utils.releaseDBConnection)(db, connection);
          req.records = result;
          next();
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to doctorsCommissionCal
var doctorsCommissionCal = function doctorsCommissionCal(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var input = (0, _extend2.default)([], req.body);
    var outputArray = [];
    for (var i = 0; i < input.length; i++) {
      var op_cash_comission_amount = 0;
      var op_cash_comission = 0;
      var op_crd_comission_amount = 0;
      var op_crd_comission = 0;

      var inputData = input[i];
      if (inputData.patient_share != 0 && inputData.op_cash_comission_percentage != 0) {
        op_cash_comission_amount = inputData.patient_share * inputData.op_cash_comission_percentage / 100;
        op_cash_comission = op_cash_comission_amount;
      }

      if (inputData.company_share != 0 && inputData.op_crd_comission_percentage != 0) {
        op_cash_comission_amount = inputData.company_share * inputData.op_crd_comission_percentage / 100;

        op_crd_comission = op_crd_comission_amount;
      }

      inputData.op_cash_comission_amount = op_cash_comission_amount;
      inputData.op_cash_comission = op_cash_comission;
      inputData.op_crd_comission_amount = op_crd_comission_amount;
      inputData.op_crd_comission = op_crd_comission;
      outputArray.push(inputData);

      // debugLog("op_cash_comission_amount:", op_cash_comission_amount);
      // debugLog("op_cash_comission:", op_cash_comission);
    }

    req.records = outputArray;
    next();
  } catch (e) {
    next(e);
  }
};

//created by irfan: performing only calculation
var commissionCalculations = function commissionCalculations(req, res, next) {
  try {
    var inputParam = req.body;

    var sendingObject = {};

    var adjust_amount = inputParam.adjust_amount === undefined ? 0 : inputParam.adjust_amount;

    (0, _logging.debugLog)("Input", req.body);
    (0, _logging.debugLog)("adjust_amount", adjust_amount);

    if (adjust_amount == 0) {
      sendingObject.op_commision = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.op_cash_comission;
      });
      sendingObject.op_credit_comission = new _nodeLinq.LINQ(inputParam).Sum(function (d) {
        return d.op_crd_comission;
      });

      sendingObject.gross_comission = sendingObject.op_commision + sendingObject.op_credit_comission;

      sendingObject.net_comission = sendingObject.gross_comission;
    } else {
      sendingObject.net_comission = inputParam.gross_comission - inputParam.adjust_amount;
    }

    sendingObject.comission_payable = sendingObject.net_comission;

    req.records = sendingObject;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getDoctorsCommission: getDoctorsCommission,
  doctorsCommissionCal: doctorsCommissionCal,
  commissionCalculations: commissionCalculations
};
//# sourceMappingURL=doctorsCommission.js.map