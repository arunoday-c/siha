"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _nodeLinq = require("node-linq");

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan:
var addTreatmentPlan = function addTreatmentPlan(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO `hims_f_treatment_plan` (plan_name,patient_id,episode_id,visit_id,remarks,consult_date,       created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?,?)", [input.plan_name, input.patient_id, input.episode_id, input.visit_id, input.remarks, input.consult_date, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
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

//created by irfan: to

//import moment from "moment";
var addDentalTreatmentBack = function addDentalTreatmentBack(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    //let input = extend({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      var working_days = [];

      var inputDays = [req.body.sunday, req.body.monday, req.body.tuesday, req.body.wednesday, req.body.thursday, req.body.friday, req.body.saturday];

      for (var d = 0; d < 7; d++) {
        if (inputDays[d] == "Y") {
          working_days.push(d);
        }
      }

      var insurtColumns = ["patient_id", "episode_id", "treatment_plan_id", "service_id", "teeth_number", "scheduled_date", "distal", "incisal", "occlusal", "mesial", "buccal", "labial", "cervical", "palatal", "lingual", "billed", "treatment_status", "created_by", "updated_by"];

      connection.query("INSERT INTO hims_f_dental_treatment(" + insurtColumns.join(",") + ",created_date,updated_date) VALUES ?", [(0, _utils.jsonArrayToObject)({
        sampleInputObject: insurtColumns,
        arrayObj: req.body,
        newFieldToInsert: [new Date(), new Date()],
        req: req
      })], function (error, result) {
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
//created by irfan: to
var addDentalTreatment = function addDentalTreatment(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var finalInput = [];
      for (var i = 0; i < input.send_teeth.length; i++) {
        var surfaceArray = {
          distal: "N",
          incisal: "N",
          occlusal: "N",
          mesial: "N",
          buccal: "N",
          labial: "N",
          cervical: "N",
          palatal: "N",
          lingual: "N"
        };
        var singleObj = new _nodeLinq.LINQ(input.send_teeth[i]["details"]).Select(function (s) {
          return s.surface;
        }).ToArray();

        var teeth_number = input.send_teeth[i]["teeth_number"];
        (0, _extend2.default)(surfaceArray, { teeth_number: teeth_number });

        for (var d = 0; d < singleObj.length; d++) {
          if (singleObj[d] == "M") {
            (0, _extend2.default)(surfaceArray, { mesial: "Y" });
          }
          if (singleObj[d] == "P") {
            (0, _extend2.default)(surfaceArray, { palatal: "Y" });
          }
          if (singleObj[d] == "D") {
            (0, _extend2.default)(surfaceArray, { distal: "Y" });
          }
          if (singleObj[d] == "I") {
            (0, _extend2.default)(surfaceArray, { incisal: "Y" });
          }
          if (singleObj[d] == "L") {
            (0, _extend2.default)(surfaceArray, { labial: "Y" });
          }
        }

        finalInput.push(surfaceArray);
      }

      var insurtColumns = ["teeth_number", "distal", "incisal", "occlusal", "mesial", "buccal", "labial", "cervical", "palatal", "lingual", "created_by", "updated_by"];

      connection.query("INSERT INTO hims_f_dental_treatment(" + insurtColumns.join(",") + ",patient_id,episode_id,treatment_plan_id,service_id,\
          scheduled_date,created_date,updated_date) VALUES ?", [(0, _utils.jsonArrayToObject)({
        sampleInputObject: insurtColumns,
        arrayObj: finalInput,
        newFieldToInsert: [input.patient_id, input.episode_id, input.treatment_plan_id, input.service_id, new Date(input.scheduled_date), new Date(), new Date()],
        req: req
      })], function (error, result) {
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

//created by irfan: to
var getTreatmentPlan = function getTreatmentPlan(req, res, next) {
  var selectWhere = {
    patient_id: "ALL",
    episode_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select hims_f_treatment_plan_id, plan_name, patient_id, episode_id, visit_id, remarks,\
         approve_status, plan_status,consult_date from  hims_f_treatment_plan where record_status='A' and " + where.condition, where.values, function (error, result) {
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

//created by irfan: to
var getDentalTreatment = function getDentalTreatment(req, res, next) {
  var selectWhere = {
    patient_id: "ALL",
    episode_id: "ALL",
    treatment_plan_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select hims_f_dental_treatment_id, patient_id, episode_id, treatment_plan_id, service_id, teeth_number\
        , scheduled_date, distal, incisal, occlusal, mesial, buccal, labial, cervical, palatal, lingual,\
         billed, treatment_status from hims_f_dental_treatment  where record_status='A' and " + where.condition, where.values, function (error, result) {
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

//created by irfan: to
var approveTreatmentPlan = function approveTreatmentPlan(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      if (input.approve_status == "Y") {
        connection.query("update hims_f_treatment_plan set approve_status=? ,\
             updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_f_treatment_plan_id`=?;", [input.approve_status, new Date(), input.updated_by, input.hims_f_treatment_plan_id], function (error, results) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = results;
          next();
        });
      } else if (input.approve_status == "C") {
        connection.beginTransaction(function (error) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }
          connection.query("delete from hims_f_dental_treatment where treatment_plan_id=?;", [input.hims_f_treatment_plan_id], function (error, results) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }
            if (results != null) {
              connection.query("  delete from hims_f_treatment_plan where hims_f_treatment_plan_id=?", [input.hims_f_treatment_plan_id], function (error, planResult) {
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
                  req.records = planResult;
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
        });
      } else {
        (0, _utils.releaseDBConnection)(db, connection);
        req.records = { invalid_input: true };
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
var deleteDentalPlan = function deleteDentalPlan(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("delete from hims_f_dental_treatment where hims_f_dental_treatment_id=?", [req.body.hims_f_dental_treatment_id], function (error, deleteRes) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }

        req.records = deleteRes;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};
//created by irfan: to
var updateDentalPlanStatus = function updateDentalPlanStatus(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var input = (0, _extend2.default)({}, req.body);
      if (input.plan_status == "C" || input.plan_status == "O") {
        connection.query("update hims_f_treatment_plan set plan_status=? ,\
             updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_f_treatment_plan_id`=?;", [input.plan_status, new Date(), input.updated_by, input.hims_f_treatment_plan_id], function (error, results) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = results;
          next();
        });
      } else {
        (0, _utils.releaseDBConnection)(db, connection);
        req.records = { invalid_input: true };
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
var updateDentalTreatmentStatus = function updateDentalTreatmentStatus(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var input = (0, _extend2.default)({}, req.body);
      if (input.treatment_status == "WIP" || input.treatment_status == "CP") {
        connection.query("update hims_f_dental_treatment set treatment_status=? ,\
             updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_f_dental_treatment_id`=?;", [input.treatment_status, new Date(), input.updated_by, input.hims_f_dental_treatment_id], function (error, results) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = results;
          next();
        });
      } else {
        (0, _utils.releaseDBConnection)(db, connection);
        req.records = { invalid_input: true };
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
var updateDentalTreatmentBilledStatus = function updateDentalTreatmentBilledStatus(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var input = (0, _extend2.default)({}, req.body);
      if (input.billed == "SB" || input.billed == "Y") {
        connection.query("update hims_f_dental_treatment set billed=? ,\
             updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_f_dental_treatment_id`=?;", [input.billed, new Date(), input.updated_by, input.hims_f_dental_treatment_id], function (error, results) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }

          if (results.affectedRows > 0) {
            req.records = results;
            next();
          } else {
            req.records = { affectedRows: 0 };
            next();
          }
        });
      } else {
        (0, _utils.releaseDBConnection)(db, connection);
        req.records = { invalid_input: true };
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
var updateDentalTreatment = function updateDentalTreatment(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var input = (0, _extend2.default)({}, req.body);
      if (input.hims_f_dental_treatment_id != "null" || input.hims_f_dental_treatment_id != undefined) {
        connection.query("update hims_f_dental_treatment set  scheduled_date=?, distal=?, incisal=?,\
           occlusal=?, mesial=?, buccal=?, labial=?, cervical=?, palatal=?, lingual=?,\
             updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_f_dental_treatment_id`=?;", [input.scheduled_date, input.distal, input.incisal, input.occlusal, input.mesial, input.buccal, input.labial, input.cervical, input.palatal, input.lingual, new Date(), input.updated_by, input.hims_f_dental_treatment_id], function (error, results) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }

          if (results.affectedRows > 0) {
            req.records = results;
            next();
          } else {
            req.records = { affectedRows: 0 };
            next();
          }
        });
      } else {
        (0, _utils.releaseDBConnection)(db, connection);
        req.records = { invalid_input: true };
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addTreatmentPlan: addTreatmentPlan,
  addDentalTreatment: addDentalTreatment,
  getTreatmentPlan: getTreatmentPlan,
  getDentalTreatment: getDentalTreatment,
  approveTreatmentPlan: approveTreatmentPlan,
  deleteDentalPlan: deleteDentalPlan,
  updateDentalPlanStatus: updateDentalPlanStatus,
  updateDentalTreatmentStatus: updateDentalTreatmentStatus,
  updateDentalTreatmentBilledStatus: updateDentalTreatmentBilledStatus,
  updateDentalTreatment: updateDentalTreatment
};
//# sourceMappingURL=dental.js.map