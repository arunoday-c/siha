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

//Added by noor for code optimization aug-20-1018
var insertPatientVisitData = function insertPatientVisitData(req, res, next) {
  try {
    (0, _logging.debugFunction)("insertPatientVisitData");

    var inputParam = (0, _extend2.default)({
      hims_f_patient_visit_id: null,
      patient_id: null,
      visit_type: null,
      visit_date: new Date(),
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
      created_by: req.userIdentity.algaeh_d_app_user_id,

      updated_by: req.userIdentity.algaeh_d_app_user_id,

      record_status: null,
      patient_message: null,
      is_critical_message: null,
      message_active_till: null,
      visit_expiery_date: null,
      episode_id: null,
      consultation: null,
      appointment_id: null
    }, req.query["data"] == null ? req.body : req.query);

    var db = req.options != null ? req.options.db : req.db;
    var existingExparyDate = null;
    var currentPatientEpisodeNo = null;
    var today = (0, _moment2.default)().format("YYYY-MM-DD");

    inputParam.patient_id = req.patient_id || req.body.patient_id;
    (0, _logging.debugLog)("Body:", req.body);
    var internalInsertPatientVisitData = function internalInsertPatientVisitData() {
      if (inputParam.age_in_years == null) {
        var fromDate = (0, _moment2.default)(inputParam.date_of_birth);
        var toDate = new Date();
        var years = (0, _moment2.default)(toDate).diff(fromDate, "year");
        fromDate.add(years, "years");
        var months = (0, _moment2.default)(toDate).diff(fromDate, "months");
        fromDate.add(months, "months");
        var days = (0, _moment2.default)(toDate).diff(fromDate, "days");
        inputParam.age_in_years = years;
        inputParam.age_in_months = months;
        inputParam.age_in_days = days;
      }
      if (existingExparyDate != null || existingExparyDate != undefined) {
        inputParam.visit_expiery_date = existingExparyDate;
        inputParam.episode_id = currentPatientEpisodeNo;
      }
      (0, _logging.debugLog)("inside internalInsertPatientVisitData");
      db.query("INSERT INTO `hims_f_patient_visit` (`patient_id`, `visit_type`, \
`age_in_years`, `age_in_months`, `age_in_days`, `insured`,`sec_insured`,\
`visit_date`, `department_id`, `sub_department_id`, `doctor_id`, `maternity_patient`,\
`is_mlc`, `mlc_accident_reg_no`, `mlc_police_station`, `mlc_wound_certified_date`, \
`created_by`, `created_date`,`visit_code`,`visit_expiery_date`,`episode_id`,`appointment_id`)\
VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?);", [inputParam.patient_id, inputParam.visit_type, inputParam.age_in_years, inputParam.age_in_months, inputParam.age_in_days, inputParam.insured, inputParam.sec_insured, inputParam.visit_date, inputParam.department_id, inputParam.sub_department_id, inputParam.doctor_id, inputParam.maternity_patient, inputParam.is_mlc, inputParam.mlc_accident_reg_no, inputParam.mlc_police_station, inputParam.mlc_wound_certified_date, inputParam.created_by, new Date(), inputParam.visit_code, inputParam.visit_expiery_date, inputParam.episode_id, inputParam.appointment_id], function (error, visitresult) {
        if (error) {
          if (req.options == null) {
            db.rollback(function () {
              (0, _utils.releaseDBConnection)(req.db, db);
            });
          } else {
            req.options.onFailure(error);
          }
        }
        req.visit_id = visitresult.insertId;
        var patient_visit_id = visitresult.insertId;

        if (patient_visit_id != null) {
          db.query("INSERT INTO `hims_f_patient_visit_message` (`patient_visit_id`\
, `patient_message`, `is_critical_message`, `message_active_till`, `created_by`, `created_date`\
) VALUES ( ?, ?, ?, ?, ?, ?);", [patient_visit_id, inputParam.patient_message, inputParam.is_critical_message, inputParam.message_active_till, inputParam.created_by, new Date()], function (error, resultData) {
            if (error) {
              if (req.options == null) {
                db.rollback(function () {
                  (0, _utils.releaseDBConnection)(req.db, db);
                  next(error);
                });
              } else {
                req.options.onFailure(eror);
              }
            } else {
              req.options.onSuccess(visitresult);
            }
          });
        }
      });
    };
    //for consultaion
    if (inputParam.consultation == "Y") {
      (0, _logging.debugLog)("In consultation == Y ");
      db.query(" select max(visit_expiery_date) as visit_expiery_date,episode_id from hims_f_patient_visit where\
         patient_id=? and doctor_id=? and record_status='A' group by patient_id, doctor_id;", [inputParam.patient_id, inputParam.doctor_id], function (error, expResult) {
        (0, _logging.debugLog)("In consultation Query", expResult);
        if (error) {
          if (req.options == null) {
            db.rollback(function () {
              (0, _utils.releaseDBConnection)(req.db, db);
            });
          } else {
            req.options.onFailure(error);
          }
        } else {
          //fetching expiry date and episode id for existing patient
          if (expResult[0] != null || expResult.length != 0) {
            existingExparyDate = (0, _moment2.default)(expResult[0]["visit_expiery_date"]).format("YYYY-MM-DD");
            currentPatientEpisodeNo = expResult[0]["episode_id"];
          }
          // req.body.episode_id = expResult[0]["episode_id"];
          var currentEpisodeNo = null;
          //checking expiry if expired or not_there create new expiry date
          if (existingExparyDate == null || existingExparyDate == undefined || existingExparyDate < today) {
            //create new expiry date
            db.query("SELECT param_value,episode_id from algaeh_d_app_config WHERE algaeh_d_app_config_id=11 \
                and record_status='A'", function (error, record) {
              (0, _logging.debugLog)("In Expiry date records ", record);
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
                if (record.length == 0) {
                  if (req.options == null) {
                    db.rollback(function () {
                      (0, _utils.releaseDBConnection)(req.db, db);
                      next(_httpStatus2.default.generateError(_httpStatus2.default.notModified, "Episode value not found.Please contact administrator."));
                    });
                  } else {
                    req.options.onFailure(_httpStatus2.default.generateError(_httpStatus2.default.notModified, "Episode value not found.Please contact administrator."));
                  }
                }
                inputParam.visit_expiery_date = (0, _moment2.default)().add(parseInt(record[0]["param_value"]), "days").format("YYYY-MM-DD");
                currentEpisodeNo = record[0].episode_id;

                if (currentEpisodeNo > 0) {
                  var nextEpisodeNo = currentEpisodeNo + 1;
                  inputParam.episode_id = currentEpisodeNo;
                  req.body.episode_id = inputParam.episode_id;
                  db.query("update algaeh_d_app_config set episode_id=? where algaeh_d_app_config_id=11 and record_status='A' ", [nextEpisodeNo], function (error, updateResult) {
                    if (error) {
                      if (req.options == null) {
                        db.rollback(function () {
                          (0, _utils.releaseDBConnection)(req.db, dataBase);
                          next(error);
                        });
                      } else {
                        req.options.onFailure(error);
                      }
                    } else {
                      internalInsertPatientVisitData();
                    }
                  });
                }
              }
            });
          } else {
            inputParam.episode_id = expResult[0]["episode_id"];
            req.body.episode_id = inputParam.episode_id;
            internalInsertPatientVisitData();
          }
        }
      });
    }
    //for non consultaion
    else if (inputParam.consultation == "N") {
        inputParam.visit_expiery_date = new Date();
        inputParam.episode_id = null;
        internalInsertPatientVisitData();
      } else {
        if (req.options == null) {
          db.rollback(function () {
            (0, _utils.releaseDBConnection)(req.db, db);
            next(_httpStatus2.default.generateError(_httpStatus2.default.noContent, "Please select consultation type"));
          });
        } else {
          req.options.onFailure(_httpStatus2.default.generateError(_httpStatus2.default.noContent, "Please select consultation type"));
        }
      }
  } catch (e) {
    next(e);
  }
};

//----end

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

//old method to be deleted
var insertVisitData = function insertVisitData(dataBase, req, res, callBack) {
  var visitDetails = {
    hims_f_patient_visit_id: null,
    patient_id: null,
    visit_type: null,
    visit_date: new Date(),
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
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id,

    patient_message: null,
    is_critical_message: null,
    message_active_till: null,
    visit_expiery_date: null,
    episode_id: null,
    consultation: null
  };
  try {
    (0, _logging.debugFunction)("insertVisitData");
    var inputParam = (0, _extend2.default)(visitDetails, req.query["data"] == null ? req.body : req.query);

    var today = (0, _moment2.default)().format("YYYY-MM-DD");

    //for consultaion
    if (inputParam.consultation == "Y") {
      dataBase.query(" select max(visit_expiery_date) as visit_expiery_date,episode_id from hims_f_patient_visit where\
         patient_id=? and doctor_id=? and record_status='A' group by patient_id, doctor_id;", [inputParam.patient_id, inputParam.doctor_id], function (error, expResult) {
        if (error) {
          dataBase.rollback(function () {
            dataBase.release();
            (0, _logging.debugLog)("error ", error);
          });
        }

        var existingExparyDate = null;
        var currentPatientEpisodeNo = null;

        //fetching expiry date and episode id for existing patient
        if (expResult[0] != null || expResult.length != 0) {
          existingExparyDate = (0, _moment2.default)(expResult[0]["visit_expiery_date"]).format("YYYY-MM-DD");

          (0, _logging.debugLog)("existingExparyDate:", existingExparyDate);

          currentPatientEpisodeNo = expResult[0]["episode_id"];
          (0, _logging.debugLog)("currentPatientEpisodeNo:", currentPatientEpisodeNo);
        }

        var currentEpisodeNo = null;

        //checking expiry if expired or not_there create new expiry date
        if (existingExparyDate == null || existingExparyDate == undefined || existingExparyDate < today) {
          //create new expiry date
          dataBase.query("SELECT param_value from algaeh_d_app_config WHERE param_name=?", ["VISITEXPERIDAY"], function (error, record) {
            if (error) {
              dataBase.rollback(function () {
                dataBase.release();
                _logging.logger.log("error", "Add new visit %j", error);
              });
            }

            inputParam.visit_expiery_date = (0, _moment2.default)().add(record != null && record.length != 0 ? parseInt(record[0]["param_value"]) : 0, "days").format("YYYY-MM-DD");
            (0, _logging.debugLog)("new expiry date created:", inputParam.visit_expiery_date);

            // create new episode
            dataBase.query("select episode_id from algaeh_d_app_config where algaeh_d_app_config_id=11 and record_status='A'", function (error, result) {
              if (error) {
                (0, _utils.releaseDBConnection)(req.db, dataBase);
                next(error);
              }

              currentEpisodeNo = result[0].episode_id;
              (0, _logging.debugLog)("currentEpisodeNo:", currentEpisodeNo);

              //increament episode id
              if (currentEpisodeNo > 0) {
                var nextEpisodeNo = currentEpisodeNo + 1;
                (0, _logging.debugLog)("nextEpisodeNo :", nextEpisodeNo);
                inputParam.episode_id = currentEpisodeNo;

                dataBase.query("update algaeh_d_app_config set episode_id=? where algaeh_d_app_config_id=11 and record_status='A' ", [nextEpisodeNo], function (error, updateResult) {
                  if (error) {
                    dataBase.rollback(function () {
                      (0, _utils.releaseDBConnection)(req.db, dataBase);
                      next(error);
                    });
                  }

                  // inserting patient visit
                  dataBase.query("INSERT INTO `hims_f_patient_visit` (`patient_id`, `visit_type`, \
    `age_in_years`, `age_in_months`, `age_in_days`, `insured`,`sec_insured`,\
  `visit_date`, `department_id`, `sub_department_id`, `doctor_id`, `maternity_patient`,\
   `is_mlc`, `mlc_accident_reg_no`, `mlc_police_station`, `mlc_wound_certified_date`, \
   `created_by`, `created_date`,`visit_code`,`visit_expiery_date`,`episode_id`)\
  VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?);", [inputParam.patient_id, inputParam.visit_type, inputParam.age_in_years, inputParam.age_in_months, inputParam.age_in_days, inputParam.insured, inputParam.sec_insured, inputParam.visit_date, inputParam.department_id, inputParam.sub_department_id, inputParam.doctor_id, inputParam.maternity_patient, inputParam.is_mlc, inputParam.mlc_accident_reg_no, inputParam.mlc_police_station, inputParam.mlc_wound_certified_date, inputParam.created_by, new Date(), inputParam.visit_code, inputParam.visit_expiery_date, inputParam.episode_id], function (error, visitresult) {
                    if (error) {
                      dataBase.rollback(function () {
                        dataBase.release();
                        _logging.logger.log("error", "Add new visit %j", error);
                      });
                    }
                    req.visit_id = visitresult.insertId;
                    var patient_visit_id = visitresult.insertId;

                    (0, _logging.debugLog)("patient_visit_id : " + patient_visit_id);

                    if (patient_visit_id != null) {
                      dataBase.query("INSERT INTO `hims_f_patient_visit_message` (`patient_visit_id`\
, `patient_message`, `is_critical_message`, `message_active_till`, `created_by`, `created_date`\
) VALUES ( ?, ?, ?, ?, ?, ?);", [patient_visit_id, inputParam.patient_message, inputParam.is_critical_message, inputParam.message_active_till, inputParam.created_by, new Date()], function (error, resultData) {
                        if (typeof callBack == "function") {
                          callBack(error, visitresult);
                        }
                      });
                    }
                  });
                });
              }
            });
          });
        } else if (existingExparyDate > today) {
          inputParam.visit_expiery_date = existingExparyDate;
          inputParam.episode_id = currentPatientEpisodeNo;

          // inserting patient visit
          dataBase.query("INSERT INTO `hims_f_patient_visit` (`patient_id`, `visit_type`, \
            `age_in_years`, `age_in_months`, `age_in_days`, `insured`,`sec_insured`,\
          `visit_date`, `department_id`, `sub_department_id`, `doctor_id`, `maternity_patient`,\
           `is_mlc`, `mlc_accident_reg_no`, `mlc_police_station`, `mlc_wound_certified_date`, \
           `created_by`, `created_date`,`visit_code`,`visit_expiery_date`,`episode_id`)\
          VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?);", [inputParam.patient_id, inputParam.visit_type, inputParam.age_in_years, inputParam.age_in_months, inputParam.age_in_days, inputParam.insured, inputParam.sec_insured, inputParam.visit_date, inputParam.department_id, inputParam.sub_department_id, inputParam.doctor_id, inputParam.maternity_patient, inputParam.is_mlc, inputParam.mlc_accident_reg_no, inputParam.mlc_police_station, inputParam.mlc_wound_certified_date, inputParam.created_by, new Date(), inputParam.visit_code, inputParam.visit_expiery_date, inputParam.episode_id], function (error, visitresult) {
            if (error) {
              dataBase.rollback(function () {
                dataBase.release();
                _logging.logger.log("error", "Add new visit %j", error);
              });
            }
            req.visit_id = visitresult.insertId;
            var patient_visit_id = visitresult.insertId;

            (0, _logging.debugLog)("patient_visit_id : " + patient_visit_id);

            if (patient_visit_id != null) {
              dataBase.query("INSERT INTO `hims_f_patient_visit_message` (`patient_visit_id`\
        , `patient_message`, `is_critical_message`, `message_active_till`, `created_by`, `created_date`\
        ) VALUES ( ?, ?, ?, ?, ?, ?);", [patient_visit_id, inputParam.patient_message, inputParam.is_critical_message, inputParam.message_active_till, inputParam.created_by, new Date()], function (error, resultData) {
                if (typeof callBack == "function") {
                  callBack(error, visitresult);
                }
              });
            }
          });
        }
      });
    } //not for consultaion
    else if (inputParam.consultation == "N") {
        (0, _logging.debugFunction)("not for consultaion");
        dataBase.query("INSERT INTO `hims_f_patient_visit` (`patient_id`, `visit_type`, \
      `age_in_years`, `age_in_months`, `age_in_days`, `insured`,`sec_insured`,\
    `visit_date`, `department_id`, `sub_department_id`, `doctor_id`, `maternity_patient`,\
     `is_mlc`, `mlc_accident_reg_no`, `mlc_police_station`, `mlc_wound_certified_date`, \
     `created_by`, `created_date`,`visit_code`,`visit_expiery_date`)\
    VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);", [inputParam.patient_id, inputParam.visit_type, inputParam.age_in_years, inputParam.age_in_months, inputParam.age_in_days, inputParam.insured, inputParam.sec_insured, inputParam.visit_date, inputParam.department_id, inputParam.sub_department_id, inputParam.doctor_id, inputParam.maternity_patient, inputParam.is_mlc, inputParam.mlc_accident_reg_no, inputParam.mlc_police_station, inputParam.mlc_wound_certified_date, inputParam.created_by, new Date(), inputParam.visit_code, today], function (error, result) {
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
      }
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
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id,

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
  checkVisitExists: checkVisitExists,
  insertPatientVisitData: insertPatientVisitData
};
//# sourceMappingURL=visit.js.map