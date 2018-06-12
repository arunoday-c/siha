"use strict";

var _patientRegistration = require("../model/patientRegistration");

var _visit = require("../model/visit");

var _utils = require("../utils");

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addFrontDesk = function addFrontDesk(req, res, next) {
  (0, _logging.debugFunction)("addFrontDesk");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    if (req.query["data"] != null) {
      req.query = JSON.parse(req.query["data"]);
      req.body = req.query;
    }

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
        (0, _utils.runningNumber)(connection, 1, "PATCODE_NUMGEN", function (error, records, newNumber) {
          (0, _logging.debugLog)("newNumber:" + newNumber);
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }
          if (records.length != 0) {
            connection.beginTransaction(function (error) {
              if (error) {
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
              }
              req.query.patient_code = newNumber;
              req.body.patient_code = newNumber;
              (0, _patientRegistration.insertData)(connection, req, res, function (error, result) {
                if (error) {
                  connection.rollback(function () {
                    (0, _utils.releaseDBConnection)(db, connection);
                    next(error);
                  });
                }
                if (result != null && result.length != 0) {
                  req.query.patient_id = result[0][0]["hims_d_patient_id"];
                  req.body.patient_id = result[0][0]["hims_d_patient_id"];
                  (0, _logging.debugLog)("req.body.patient_id:" + result[0][0]["hims_d_patient_id"]);
                  (0, _utils.runningNumber)(connection, 2, "VISIT_NUMGEN", function (error, patResults, completeNum) {
                    if (error) {
                      connection.rollback(function () {
                        (0, _utils.releaseDBConnection)(db, connection);
                        next(error);
                      });
                    }
                    req.query.visit_code = completeNum;
                    req.body.visit_code = completeNum;
                    (0, _logging.debugLog)("req.body.visit_code : " + completeNum);
                    (0, _visit.insertVisitData)(connection, req, res, function (error, resultdata) {
                      if (error) {
                        connection.rollback(function () {
                          (0, _utils.releaseDBConnection)(db, connection);
                          next(error);
                        });
                      }
                      connection.commit(function (error) {
                        (0, _utils.releaseDBConnection)(db, connection);
                        if (error) {
                          connection.rollback(function () {
                            next(error);
                          });
                        }
                        (0, _logging.debugLog)("patient_code : " + req.body.patient_code);
                        resultdata["patient_code"] = req.body.patient_code;
                        resultdata["visit_code"] = req.body.visit_code;
                        req.records = resultdata;
                        //Upload Images to server.
                        // createFolder(req, res);
                        next();
                        return;
                      });
                    });
                  });
                } else {
                  connection.commit(function (error) {
                    (0, _utils.releaseDBConnection)(db, connection);
                    if (error) {
                      connection.rollback(function () {
                        next(error);
                      });
                    }
                    req.records = result;
                    next();
                  });
                }
              }, true, next);
            });
          }
        });
      });
    });
  } catch (e) {
    next(e);
  }
};
var selectWhere = {
  patient_code: "ALL",
  hims_d_patient_id: "ALL"
};
var selectFrontDesk = function selectFrontDesk(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));
      connection.query("SELECT `hims_d_patient_id`, `patient_code`\
      , `registration_date`, `title_id`,`first_name`, `middle_name`, `last_name`\
      , `gender`, `religion_id`,`date_of_birth`, `age`, `marital_status`, `address1`\
      , `address2`,`contact_number`, `secondary_contact_number`, `email`\
      , `emergency_contact_name`,`emergency_contact_number`, `relationship_with_patient`\
      , `visa_type_id`,`nationality_id`, `postal_code`, `primary_identity_id`\
      , `primary_id_no`,`secondary_identity_id`, `secondary_id_no`, `photo_file`\
      , `primary_id_file`,`secondary_id_file`,`city_id`,`state_id`,`country_id` FROM `hims_f_patient` \
       WHERE `record_status`='A' AND " + where.condition, where.values, function (error, result) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }
        var showresult = void 0;
        if (result.length != 0) {
          var hims_d_patient_id = result[0]["hims_d_patient_id"];
          connection.query("SELECT `hims_f_patient_visit_id`, `patient_id`,`visit_code`\
            , `visit_type`, `visit_date`, `department_id`, `sub_department_id`\
            , `doctor_id`, `maternity_patient`, `is_mlc`, `mlc_accident_reg_no`\
            , `mlc_police_station`, `mlc_wound_certified_date`\
             FROM `hims_f_patient_visit` WHERE `record_status`='A' AND \
             patient_id=? ORDER BY hims_f_patient_visit_id desc ", [hims_d_patient_id], function (error, resultFields) {
            if (error) {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            }
            showresult = {
              patientRegistration: result[0],
              visitDetails: resultFields
            };
            req.records = showresult;
            next();
          });
        } else {
          req.records = showresult;
          next();
        }
      });
    });
  } catch (e) {
    next(e);
  }
};
module.exports = {
  addFrontDesk: addFrontDesk,
  selectFrontDesk: selectFrontDesk
};
//# sourceMappingURL=frontDesk.js.map