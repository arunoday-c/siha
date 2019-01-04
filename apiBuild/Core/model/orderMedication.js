"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan: to add Patient Prescription
var addPatientPrescription = function addPatientPrescription(req, res, next) {
  // created_by: req.userIdentity.algaeh_d_app_user_id,
  // updated_by: req.userIdentity.algaeh_d_app_user_id

  (0, _logging.debugFunction)("addPatientPrescription");
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
      connection.beginTransaction(function (error) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }

        connection.query("INSERT INTO `hims_f_prescription` (`patient_id`, `encounter_id`, `provider_id`, `episode_id`, `prescription_date`, `created_by`, `created_date`, `updated_by`, `updated_date`) values(\
            ?,?,?,?,?,?,?,?,?)", [input.patient_id, input.encounter_id, input.provider_id, input.episode_id, new Date(), input.created_by, new Date(), input.updated_by, new Date()], function (error, results) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }
          // debugLog("Results are recorded...");

          if (results.insertId != null) {
            req.body.prescription_id = results.insertId;

            var insurtColumns = ["item_id", "generic_id", "dosage", "service_id", "uom_id", "item_category_id", "item_group_id", "frequency", "no_of_days", "dispense", "frequency_type", "frequency_time"];

            connection.query("INSERT INTO hims_f_prescription_detail(" + insurtColumns.join(",") + ",`prescription_id`) VALUES ?", [(0, _utils.jsonArrayToObject)({
              sampleInputObject: insurtColumns,
              arrayObj: req.body.medicationitems,
              newFieldToInsert: [req.body.prescription_id],
              req: req
            })], function (error, detailResult) {
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
                req.records = detailResult;
                next();
              });
            });
          }
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: getPatientPrescription

//import { LINQ } from "node-linq";
//import moment from "moment";
var getPatientPrescription = function getPatientPrescription(req, res, next) {
  var selectWhere = {
    provider_id: "ALL",
    patient_id: "ALL",
    prescription_date: "ALL"
  };

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    req.query["date(prescription_date)"] = req.query.prescription_date;

    delete req.query.prescription_date;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      db.query("SELECT H.hims_f_prescription_id,H.patient_id, P.patient_code,P.full_name,H.encounter_id, H.provider_id, H.episode_id, \
        H.prescription_date,H.prescription_status,H.cancelled,D.hims_f_prescription_detail_id, D.prescription_id, D.item_id, D.generic_id, D.dosage,\
        D.frequency, D.no_of_days,D.dispense, D.frequency_type, D.frequency_time, D.start_date, D.item_status \
        from hims_f_prescription H,hims_f_prescription_detail D ,hims_f_patient P WHERE H.hims_f_prescription_id = D.prescription_id and P.hims_d_patient_id=H.patient_id and " + where.condition, where.values, function (error, result) {
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

module.exports = { addPatientPrescription: addPatientPrescription, getPatientPrescription: getPatientPrescription };
//# sourceMappingURL=orderMedication.js.map