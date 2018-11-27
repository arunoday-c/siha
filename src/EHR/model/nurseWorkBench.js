"use strict";
import extend from "extend";
import {
  paging,
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject
} from "../../utils";
import httpStatus from "../../utils/httpStatus";
import { debugFunction, debugLog } from "../../utils/logging";
import moment from "moment";
import formater from "../../keys/keys";

// created by : irfan to
let addPatientNurseChiefComplaints = (req, res, next) => {
  debugFunction("addPatientNurseChiefComplaints");

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    //let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      const insurtColumns = [
        "episode_id",
        "patient_id",
        "chief_complaint_id",
        "onset_date",
        "duration",
        "interval",
        "severity",
        "score",
        "pain",
        "comment",
        "created_by",
        "updated_by"
      ];

      connection.query(
        "INSERT INTO hims_f_nurse_episode_chief_complaint(`" +
          insurtColumns.join("`,`") +
          "`,created_date,updated_date) VALUES ?",
        [
          jsonArrayToObject({
            sampleInputObject: insurtColumns,
            arrayObj: req.body,
            newFieldToInsert: [new Date(), new Date()],
            req: req
          })
        ],
        (error, Result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = Result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
let getPatientNurseChiefComplaints = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputData = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "select hh.hims_d_hpi_header_id,hh.hpi_description as chief_complaint_name,PE.hims_f_patient_encounter_id,PE.patient_id,\
        max(PE.updated_date) as Encounter_Date , NC.hims_f_nurse_episode_chief_complaint_id,NC.episode_id,NC.chief_complaint_id,\
        NC.onset_date,NC.`interval`,NC.duration,NC.severity,NC.score,NC.pain,NC.`comment`\
        from ( (hims_f_nurse_episode_chief_complaint NC inner join hims_d_hpi_header hh on hh.hims_d_hpi_header_id=NC.chief_complaint_id ) \
           inner join hims_f_patient_encounter PE on PE.episode_id=NC.episode_id)\
        where NC.record_status='A'and NC.episode_id=? group by chief_complaint_id ",
        [inputData.episode_id],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          debugLog("result", result);
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let deletePatientNurseChiefComplaints = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    //let inputData = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "update hims_f_nurse_episode_chief_complaint set record_status='I',updated_date=?,\
        updated_by=? where `record_status`='A' and hims_f_nurse_episode_chief_complaint_id=?",
        [
          new Date(),
          req.body.updated_by,
          req.body.hims_f_nurse_episode_chief_complaint_id
        ],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let updatePatientNurseChiefComplaints = (req, res, next) => {
  try {
    debugFunction("updatePatientNurseChiefComplaints");
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        let inputParam = extend([], req.body.chief_complaints);

        let qry = "";

        for (let i = 0; i < req.body.chief_complaints.length; i++) {
          const _complaint_inactive_date =
            inputParam[i].complaint_inactive_date != null
              ? "'" + inputParam[i].complaint_inactive_date + "'"
              : null;
          qry +=
            "UPDATE `hims_f_nurse_episode_chief_complaint` SET  episode_id='" +
            inputParam[i].episode_id +
            "', chief_complaint_id='" +
            inputParam[i].chief_complaint_id +
            "', onset_date='" +
            inputParam[i].onset_date +
            "', `interval`='" +
            inputParam[i].interval +
            "', duration='" +
            inputParam[i].duration +
            "', severity='" +
            inputParam[i].severity +
            "', score='" +
            inputParam[i].score +
            "', pain='" +
            inputParam[i].pain +
            "\
            , comment='" +
            inputParam[i].comment +
            "', updated_date='" +
            new Date().toLocaleString() +
            "',updated_by=\
'" +
            req.body.updated_by +
            "' WHERE hims_f_nurse_episode_chief_complaint_id='" +
            inputParam[i].hims_f_nurse_episode_chief_complaint_id +
            "';";
        }

        connection.query(qry, (error, updateResult) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }

          connection.commit(error => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            releaseDBConnection(db, connection);
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
let getNurseMyDay = (req, res, next) => {
  let getMydayWhere = {
    provider_id: "ALL",
    sub_department_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let dateDiff = "";
    if (req.query.fromDate != null && req.query.toDate != null) {
      dateDiff +=
        " date(E.created_date) BETWEEN date('" +
        moment(req.query.fromDate).format(formater.dbFormat.date) +
        "') AND date('" +
        moment(req.query.toDate).format(formater.dbFormat.date) +
        "')";
      delete req.query.fromDate;
      delete req.query.toDate;
    } else if (req.query.toDate != null) {
      dateDiff = " date(E.created_date) = date('" + req.query.toDate + "')";
      delete req.query.toDate;
    }

    let statusFlag = "";
    if (req.query.status == "A") {
      statusFlag = " E.status <> 'V' AND";
      delete req.query.status;
    } else if (req.query.status == "V") {
      statusFlag = " E.status='V' AND";
      delete req.query.status;
    }

    debugLog("req query:", req.query);
    let where = whereCondition(extend(getMydayWhere, req.query));

    debugLog("where conditn:", where);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      db.query(
        "select  E.hims_f_patient_encounter_id,P.patient_code,P.full_name,E.patient_id ,V.appointment_patient,E.provider_id,E.`status`,E.nurse_examine,E.checked_in,\
         E.payment_type,E.episode_id,E.encounter_id,E.`source`,E.updated_date as encountered_date,E.visit_id ,sub_department_id from hims_f_patient_encounter E\
         INNER JOIN hims_f_patient P ON E.patient_id=P.hims_d_patient_id \
            inner join hims_f_patient_visit V on E.visit_id=V.hims_f_patient_visit_id  where E.record_status='A' AND  V.record_status='A' AND " +
          statusFlag +
          "" +
          dateDiff +
          " AND " +
          where.condition +
          " order by E.updated_date desc",
        where.values,

        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }

          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};
module.exports = {
  addPatientNurseChiefComplaints,
  getPatientNurseChiefComplaints,
  deletePatientNurseChiefComplaints,
  updatePatientNurseChiefComplaints,
  getNurseMyDay
};
