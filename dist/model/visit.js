"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  message_active_till: null
};
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
    });
  } catch (e) {
    next(e);
  }
};
var insertVisitData = function insertVisitData(dataBase, req, res, callBack) {
  try {
    (0, _logging.debugFunction)("insertVisitData");
    var inputParam = (0, _extend2.default)(visitDetails, req.query["data"] == null ? req.body : req.query);

    dataBase.query("INSERT INTO `hims_f_patient_visit` (`patient_id`, `visit_type`, \
        `visit_date`, `department_id`, `sub_department_id`, `doctor_id`, `maternity_patient`,\
         `is_mlc`, `mlc_accident_reg_no`, `mlc_police_station`, `mlc_wound_certified_date`, \
         `created_by`, `created_date`,`visit_code`)\
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);", [inputParam.patient_id, inputParam.visit_type, inputParam.visit_date, inputParam.department_id, inputParam.sub_department_id, inputParam.doctor_id, inputParam.maternity_patient, inputParam.is_mlc, inputParam.mlc_accident_reg_no, inputParam.mlc_police_station, null, //inputParam.mlc_wound_certified_date
    inputParam.created_by, new Date(), inputParam.visit_code], function (error, result) {
      if (error) {
        dataBase.rollback(function () {
          dataBase.release();
          _logging.logger.logger("error", "Add new visit %j", error);
        });
      }
      var patient_visit_id = result.insertId;
      (0, _logging.debugLog)("patient_visit_id : " + patient_visit_id);
      if (patient_visit_id != null) {
        dataBase.query("INSERT INTO `hims_f_patient_visit_message` (`patient_visit_id`\
      , `patient_message`, `is_critical_message`, `message_active_till`, `created_by`, `created_date`\
      ) VALUES ( ?, ?, ?, ?, ?, ?);", [patient_visit_id, inputParam.patient_message, inputParam.is_critical_message, inputParam.message_active_till, inputParam.created_by, new Date()], function (error, resultData) {
          if (typeof callBack == "function") {
            callBack(error, resultData);
          }
        });
      }
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
module.exports = {
  addVisit: addVisit,
  updateVisit: updateVisit,
  insertVisitData: insertVisitData
};
//# sourceMappingURL=visit.js.map