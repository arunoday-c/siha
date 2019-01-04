"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../../utils/logging");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _keys = require("../../keys/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// created by : irfan to
var addPatientNurseChiefComplaints = function addPatientNurseChiefComplaints(req, res, next) {
  (0, _logging.debugFunction)("addPatientNurseChiefComplaints");

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    //let input = extend({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      connection.beginTransaction(function (error) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }

        var insurtColumns = ["episode_id", "patient_id", "chief_complaint_id", "onset_date", "duration", "interval", "severity", "score", "pain", "comment", "created_by", "updated_by"];

        connection.query("INSERT INTO hims_f_nurse_episode_chief_complaint(`" + insurtColumns.join("`,`") + "`,created_date,updated_date) VALUES ?", [(0, _utils.jsonArrayToObject)({
          sampleInputObject: insurtColumns,
          arrayObj: req.body.chief_complaints,
          newFieldToInsert: [new Date(), new Date()],
          req: req
        })], function (error, Result) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }

          if (Result.insertId != null && Result.insertId != undefined) {
            var _insurtColumns = ["patient_id", "visit_id", "visit_date", "visit_time", "case_type", "vital_id", "vital_value", "vital_value_one", "vital_value_two", "formula_value", "created_by", "updated_by"];

            connection.query("INSERT INTO hims_f_patient_vitals(" + _insurtColumns.join(",") + ",created_date,updated_date) VALUES ?", [(0, _utils.jsonArrayToObject)({
              sampleInputObject: _insurtColumns,
              arrayObj: req.body.patient_vitals,
              newFieldToInsert: [new Date(), new Date()],
              req: req
            })], function (error, results) {
              if (error) {
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
              }

              if (results.insertId != null && results.insertId != undefined) {
                connection.query("UPDATE `hims_f_patient_encounter` SET nurse_examine='Y', nurse_notes=?,\
                     updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_f_patient_encounter_id`=?;", [req.body.nurse_notes, new Date(), req.body.updated_by, req.body.hims_f_patient_encounter_id], function (error, updateResult) {
                  if (error) {
                    connection.rollback(function () {
                      (0, _utils.releaseDBConnection)(db, connection);
                      next(error);
                    });
                  }

                  connection.commit(function (error) {
                    if (error) {
                      connection.rollback(function () {
                        (0, _utils.releaseDBConnection)(db, connection);
                        next(error);
                      });
                    }
                    (0, _utils.releaseDBConnection)(db, connection);
                    req.records = updateResult;
                    next();
                  });
                });
              } else {
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
              }
            });
          } else {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
var getPatientNurseChiefComplaints = function getPatientNurseChiefComplaints(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var inputData = (0, _extend2.default)({}, req.query);

    db.getConnection(function (error, connection) {
      connection.query("select hh.hims_d_hpi_header_id,hh.hpi_description as chief_complaint_name,PE.hims_f_patient_encounter_id,PE.patient_id,\
        max(PE.updated_date) as Encounter_Date , NC.hims_f_nurse_episode_chief_complaint_id,NC.episode_id,NC.chief_complaint_id,\
        NC.onset_date,NC.`interval`,NC.duration,NC.severity,NC.score,NC.pain,NC.`comment`\
        from ( (hims_f_nurse_episode_chief_complaint NC inner join hims_d_hpi_header hh on hh.hims_d_hpi_header_id=NC.chief_complaint_id ) \
           inner join hims_f_patient_encounter PE on PE.episode_id=NC.episode_id)\
        where NC.record_status='A'and NC.episode_id=? group by chief_complaint_id ", [inputData.episode_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        (0, _logging.debugLog)("result", result);
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
var deletePatientNurseChiefComplaints = function deletePatientNurseChiefComplaints(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    //let inputData = extend({}, req.query);

    db.getConnection(function (error, connection) {
      connection.query("update hims_f_nurse_episode_chief_complaint set record_status='I',updated_date=?,\
        updated_by=? where `record_status`='A' and hims_f_nurse_episode_chief_complaint_id=?", [new Date(), req.body.updated_by, req.body.hims_f_nurse_episode_chief_complaint_id], function (error, result) {
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

//created by irfan:
var updatePatientNurseChiefComplaints = function updatePatientNurseChiefComplaints(req, res, next) {
  try {
    (0, _logging.debugFunction)("updatePatientNurseChiefComplaints");
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

        var inputParam = (0, _extend2.default)([], req.body.chief_complaints);

        var qry = "";

        for (var i = 0; i < req.body.chief_complaints.length; i++) {
          var _complaint_inactive_date = inputParam[i].complaint_inactive_date != null ? "'" + inputParam[i].complaint_inactive_date + "'" : null;
          qry += "UPDATE `hims_f_nurse_episode_chief_complaint` SET  episode_id='" + inputParam[i].episode_id + "', chief_complaint_id='" + inputParam[i].chief_complaint_id + "', onset_date='" + inputParam[i].onset_date + "', `interval`='" + inputParam[i].interval + "', duration='" + inputParam[i].duration + "', severity='" + inputParam[i].severity + "', score='" + inputParam[i].score + "', pain='" + inputParam[i].pain + "\
            , nurse_notes='" + inputParam[i].nurse_notes + "', updated_date='" + new Date().toLocaleString() + "',updated_by=\
'" + req.body.updated_by + "' WHERE hims_f_nurse_episode_chief_complaint_id='" + inputParam[i].hims_f_nurse_episode_chief_complaint_id + "';";
        }

        connection.query(qry, function (error, updateResult) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }

          connection.commit(function (error) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }
            (0, _utils.releaseDBConnection)(db, connection);
            req.records = updateResult;
            next();
          });
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to getNursesMyDay in nurse work bench , to show list of todays patients
var getNurseMyDay = function getNurseMyDay(req, res, next) {
  var getMydayWhere = {
    provider_id: "ALL",
    sub_department_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var dateDiff = "";
    if (req.query.fromDate != null && req.query.toDate != null) {
      dateDiff += " date(E.created_date) BETWEEN date('" + (0, _moment2.default)(req.query.fromDate).format(_keys2.default.dbFormat.date) + "') AND date('" + (0, _moment2.default)(req.query.toDate).format(_keys2.default.dbFormat.date) + "')";
      delete req.query.fromDate;
      delete req.query.toDate;
    } else if (req.query.toDate != null) {
      dateDiff = " date(E.created_date) = date('" + req.query.toDate + "')";
      delete req.query.toDate;
    }

    var statusFlag = "";
    if (req.query.status == "A") {
      statusFlag = " E.status <> 'V' AND";
      delete req.query.status;
    } else if (req.query.status == "V") {
      statusFlag = " E.status='V' AND";
      delete req.query.status;
    }

    (0, _logging.debugLog)("req query:", req.query);
    var where = (0, _utils.whereCondition)((0, _extend2.default)(getMydayWhere, req.query));

    (0, _logging.debugLog)("where conditn:", where);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      db.query("select  E.hims_f_patient_encounter_id,P.patient_code,P.full_name,E.patient_id ,V.appointment_patient,E.provider_id,E.`status`,E.nurse_examine,E.checked_in,\
         E.payment_type,E.episode_id,E.encounter_id,E.`source`,E.updated_date as encountered_date,E.visit_id ,sub_department_id from hims_f_patient_encounter E\
         INNER JOIN hims_f_patient P ON E.patient_id=P.hims_d_patient_id \
            inner join hims_f_patient_visit V on E.visit_id=V.hims_f_patient_visit_id  where E.record_status='A' AND  V.record_status='A' AND " + statusFlag + "" + dateDiff + " AND " + where.condition + " order by E.updated_date desc", where.values, function (error, result) {
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
  addPatientNurseChiefComplaints: addPatientNurseChiefComplaints,
  getPatientNurseChiefComplaints: getPatientNurseChiefComplaints,
  deletePatientNurseChiefComplaints: deletePatientNurseChiefComplaints,
  updatePatientNurseChiefComplaints: updatePatientNurseChiefComplaints,
  getNurseMyDay: getNurseMyDay
};
//# sourceMappingURL=nurseWorkBench.js.map