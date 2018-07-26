"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

var _utils = require("../utils");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addVisit = function addVisit(req, res, next) {
  try {
    (0, _logging.debugFunction)("addVisit");
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
            next(error);
          });
        }

        var patient_id = req.body.patient_id != null ? req.body.patient_id : req.query.patient_id;
        var visit_code = req.body.visit_code != null ? req.body.visit_code : req.query.visit_code;
        if (visit_code != "" && patient_id != null) {
          insertVisitData(connection, req, res, function (error, result) {
            if (error) {
              connection.rollback(function () {
                next(error);
              });
            }
            connection.commit(function (error) {
              if (error) {
                connection.rollback(function () {
                  next(error);
                });
              }
              req.records = result;
              next();
            });
          });
        } else {
          if (patient_id == null) {
            next(_httpStatus2.default.generateError(400, "Patient Code is not generated"));
          } else {
            (0, _utils.runningNumber)(connection, 2, "VISIT_NUMGEN", function (error, numUpdate, completeNumber) {
              if (error) {
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
              }
              req.query.visit_code = completeNumber;
              req.body.visit_code = completeNumber;
              (0, _logging.debugLog)("req.body.visit_code : " + completeNumber);
              insertVisitData(connection, req, res, function (error, result) {
                if (error) {
                  connection.rollback(function () {
                    next(error);
                  });
                }
                connection.commit(function (error) {
                  if (error) {
                    connection.rollback(function () {
                      next(error);
                    });
                  }
                  req.records = result;
                  next();
                });
              });
            });
          }
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

var insertVisitData = function insertVisitData(dataBase, req, res, callBack) {
  var visitDetails = {
    hims_f_patient_visit_id: null,
    patient_id: null,
    visit_type: null,
    visit_date: null,
    visit_code: null,
    age_in_years: null,
    age_in_months: null,
    age_in_days: null,
    insured: null,
    sec_insured: null,
    department_id: null,
    sub_department_id: null,
    doctor_id: null,
    maternity_patient: null,
    is_mlc: null,
    mlc_accident_reg_no: null,
    mlc_police_station: null,
    mlc_wound_certified_date: null,
    created_by: null,
    created_date: null,
    updated_by: null,
    updated_date: null,
    record_status: null,
    patient_message: null,
    is_critical_message: null,
    message_active_till: null,
    visit_expiery_date: null
  };
  try {
    (0, _logging.debugFunction)("insertVisitData");
    var inputParam = (0, _extend2.default)(visitDetails, req.query["data"] == null ? req.body : req.query);

    dataBase.query("SELECT param_value from algaeh_d_app_config WHERE param_name=?", ["VISITEXPERIDAY"], function (error, record) {
      if (error) {
        dataBase.rollback(function () {
          dataBase.release();
          _logging.logger.log("error", "Add new visit %j", error);
        });
      }
      inputParam.visit_expiery_date = (0, _moment2.default)(inputParam.visit_date).add(record != null && record.length != 0 ? parseInt(record[0]["param_value"]) : 0, "days")._d;
      dataBase.query("INSERT INTO `hims_f_patient_visit` (`patient_id`, `visit_type`, \
          `age_in_years`, `age_in_months`, `age_in_days`, `insured`,`sec_insured`,\
        `visit_date`, `department_id`, `sub_department_id`, `doctor_id`, `maternity_patient`,\
         `is_mlc`, `mlc_accident_reg_no`, `mlc_police_station`, `mlc_wound_certified_date`, \
         `created_by`, `created_date`,`visit_code`,`visit_expiery_date`)\
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [inputParam.patient_id, inputParam.visit_type, inputParam.age_in_years, inputParam.age_in_months, inputParam.age_in_days, inputParam.insured, inputParam.sec_insured, inputParam.visit_date, inputParam.department_id, inputParam.sub_department_id, inputParam.doctor_id, inputParam.maternity_patient, inputParam.is_mlc, inputParam.mlc_accident_reg_no, inputParam.mlc_police_station, inputParam.mlc_wound_certified_date, inputParam.created_by, new Date(), inputParam.visit_code, inputParam.visit_expiery_date], function (error, result) {
        if (error) {
          dataBase.rollback(function () {
            dataBase.release();
            _logging.logger.log("error", "Add new visit %j", error);
          });
        }
        req.visit_id = result.insertId;
        var patient_visit_id = result.insertId;

        (0, _logging.debugLog)("patient_visit_id : " + patient_visit_id);

        if (patient_visit_id != null) {
          dataBase.query("INSERT INTO `hims_f_patient_visit_message` (`patient_visit_id`\
      , `patient_message`, `is_critical_message`, `message_active_till`, `created_by`, `created_date`\
      ) VALUES ( ?, ?, ?, ?, ?, ?);", [patient_visit_id, inputParam.patient_message, inputParam.is_critical_message, inputParam.message_active_till, inputParam.created_by, new Date()], function (error, resultData) {
            if (typeof callBack == "function") {
              callBack(error, result);
            }
          });
        }
      });
    });
  } catch (e) {
    next(e);
  }
};
var updateVisit = function updateVisit(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      updateData(connection, req, function (error, result) {
        connection.release();
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

var updateData = function updateData(dataBase, req, callBack) {
  var visitDetails = {
    hims_f_patient_visit_id: null,
    patient_id: null,
    visit_type: null,
    visit_date: null,
    visit_code: null,
    department_id: null,
    sub_department_id: null,
    doctor_id: null,
    maternity_patient: null,
    is_mlc: null,
    mlc_accident_reg_no: null,
    mlc_police_station: null,
    mlc_wound_certified_date: null,
    created_by: null,
    created_date: null,
    updated_by: null,
    updated_date: null,
    record_status: null,
    patient_message: null,
    is_critical_message: null,
    message_active_till: null,
    visit_expiery_date: null
  };

  try {
    var inputParam = (0, _extend2.default)(visitDetails, req.body);
    dataBase.query("UPDATE `hims_f_patient_visit`\
    SET `visit_type`=?, `visit_date`=?, `department_id`=?, `sub_department_id`=?\
    ,`doctor_id`=?, `maternity_patient`=?, `is_mlc`=?, `mlc_accident_reg_no`=?,\
    `mlc_police_station`=?, `mlc_wound_certified_date`=?, `updated_by`=?, `updated_date`=?\
    WHERE `hims_f_patient_visit_id`=?;", [inputParam.visit_type, inputParam.visit_date, inputParam.department_id, inputParam.sub_department_id, inputParam.doctor_id, inputParam.maternity_patient, inputParam.is_mlc, inputParam.mlc_accident_reg_no, inputParam.mlc_police_station, inputParam.mlc_wound_certified_date, inputParam.updated_by, new Date(), inputParam.hims_f_patient_visit_id], function (error, result) {
      if (typeof callBack == "function") {
        callBack(error, result);
      }
    });
  } catch (e) {
    next(e);
  }
};

var checkVisitExists = function checkVisitExists(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var inputParam = (0, _extend2.default)({
      sub_department_id: null,
      doctor_id: null,
      patient_id: null
    }, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      db.query("select visit_code from hims_d_sub_department,hims_f_patient_visit where \
      hims_f_patient_visit.sub_department_id=hims_d_sub_department.hims_d_sub_department_id \
      and hims_d_sub_department.record_status='A' and hims_f_patient_visit.record_status='A' \
      and hims_f_patient_visit.visit_date =DATE(now()) and hims_d_sub_department.hims_d_sub_department_id=?\
      and hims_f_patient_visit.doctor_id=? and patient_id =? \
      ", [inputParam.sub_department_id, inputParam.doctor_id, inputParam.patient_id], function (error, records) {
        connection.release();
        if (error) {
          next(error);
        }
        req.records = records;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addVisit: addVisit,
  updateVisit: updateVisit,
  insertVisitData: insertVisitData,
  checkVisitExists: checkVisitExists
};
//# sourceMappingURL=visit.js.map