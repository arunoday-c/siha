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

import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");
// created by : irfan to
let addPatientNurseChiefComplaintsBackup = (req, res, next) => {
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

      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
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
              arrayObj: req.body.chief_complaints,
              newFieldToInsert: [new Date(), new Date()],
              req: req
            })
          ],
          (error, Result) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }

            if (Result.insertId != null && Result.insertId != undefined) {
              const insurtColumns = [
                "patient_id",
                "visit_id",
                "visit_date",
                "visit_time",
                "case_type",
                "vital_id",
                "vital_value",
                "vital_value_one",
                "vital_value_two",
                "formula_value",
                "created_by",
                "updated_by"
              ];

              connection.query(
                "INSERT INTO hims_f_patient_vitals(" +
                  insurtColumns.join(",") +
                  ",created_date,updated_date) VALUES ?",
                [
                  jsonArrayToObject({
                    sampleInputObject: insurtColumns,
                    arrayObj: req.body.patient_vitals,
                    newFieldToInsert: [new Date(), new Date()],
                    req: req
                  })
                ],

                (error, results) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  if (
                    results.insertId != null &&
                    results.insertId != undefined
                  ) {
                    connection.query(
                      "UPDATE `hims_f_patient_encounter` SET nurse_examine='Y', nurse_notes=?,\
                     updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_f_patient_encounter_id`=?;",
                      [
                        req.body.nurse_notes,
                        new Date(),
                        req.body.updated_by,
                        req.body.hims_f_patient_encounter_id
                      ],
                      (error, updateResult) => {
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
                      }
                    );
                  } else {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }
                }
              );
            } else {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

// created by : irfan to
let addPatientNurseChiefComplaints = (req, res, next) => {
  debugFunction("addPatientNurseChiefComplaints");

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        new Promise((resolve, reject) => {
          try {
            if (
              input.chief_complaints != undefined &&
              input.chief_complaints.length > 0
            ) {
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
                  "`,created_date,updated_date,hospital_id) VALUES ?",
                [
                  jsonArrayToObject({
                    sampleInputObject: insurtColumns,
                    arrayObj: req.body.chief_complaints,
                    newFieldToInsert: [
                      new Date(),
                      new Date(),
                      req.userIdentity.hospital_id
                    ],
                    req: req
                  })
                ],
                (error, Result) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }
                  if (Result.insertId > 0) {
                    resolve({ Result });
                  } else {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      req.records = {
                        invalid_data: true,
                        message: "please send correct data"
                      };
                      next();
                      return;
                    });
                  }
                }
              );
            } else {
              resolve({});
            }
          } catch (e) {
            reject(e);
          }
        }).then(NCCResult => {
          new Promise((resolve, reject) => {
            try {
              if (
                input.patient_vitals != undefined &&
                input.patient_vitals.length > 0
              ) {
                const insurtColumns = [
                  "patient_id",
                  "visit_id",
                  "visit_date",
                  "visit_time",
                  "case_type",
                  "vital_id",
                  "vital_value",
                  "vital_value_one",
                  "vital_value_two",
                  "formula_value",
                  "created_by",
                  "updated_by"
                ];

                connection.query(
                  "INSERT INTO hims_f_patient_vitals(" +
                    insurtColumns.join(",") +
                    ",created_date,updated_date,hospital_id) VALUES ?",
                  [
                    jsonArrayToObject({
                      sampleInputObject: insurtColumns,
                      arrayObj: req.body.patient_vitals,
                      newFieldToInsert: [
                        new Date(),
                        new Date(),
                        req.userIdentity.hospital_id
                      ],
                      req: req
                    })
                  ],

                  (error, results) => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }

                    if (results.insertId > 0) {
                      resolve({ results });
                    } else {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        req.records = {
                          invalid_data: true,
                          message: "please send correct data"
                        };
                        next();
                        return;
                      });
                    }
                  }
                );
              } else {
                resolve({ NCCResult });
              }
            } catch (e) {
              reject(e);
            }
          }).then(patientVitalRes => {
            new Promise((resolve, reject) => {
              try {
                // if (
                //   input.nurse_notes != undefined &&
                //   input.nurse_notes != null &&
                //   input.nurse_notes != "null"
                // ) {
                connection.query(
                  "UPDATE `hims_f_patient_encounter` SET nurse_examine='Y', nurse_notes=?,\
                 updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_f_patient_encounter_id`=?;",
                  [
                    req.body.nurse_notes,
                    new Date(),
                    req.body.updated_by,
                    req.body.hims_f_patient_encounter_id
                  ],
                  (error, updateResult) => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }

                    if (updateResult.affectedRows > 0) {
                      resolve({ updateResult });
                    } else {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        req.records = {
                          invalid_data: true,
                          message: "please send correct data"
                        };
                        next();
                        return;
                      });
                    }
                  }
                );
                // } else {
                //   resolve({ patientVitalRes });
                // }
              } catch (e) {
                reject(e);
              }
            }).then(notesResult => {
              connection.commit(error => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }
                releaseDBConnection(db, connection);
                req.records = notesResult;
                next();
              });
            });
          });
        });

        //-----------------------------------------------
      });
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
            , nurse_notes='" +
            inputParam[i].nurse_notes +
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
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _query = "";

    if (
      req.query.fromDate != null &&
      req.query.fromDate != "" &&
      req.query.fromDate != undefined &&
      (req.query.toDate != null &&
        req.query.fromDate != "" &&
        req.query.fromDate != undefined)
    )
      _query += _mysql.mysqlQueryFormat(
        "date(E.created_date) BETWEEN date(?) and date(?)",
        [
          moment(new Date(req.query.fromDate)).format(
            keyPath.default.dbFormat.date
          ),
          moment(new Date(req.query.toDate)).format(
            keyPath.default.dbFormat.date
          )
        ]
      );
    else if (
      req.query.toDate != null &&
      req.query.toDate != "" &&
      req.query.toDate != undefined
    ) {
      _query += _mysql.mysqlQueryFormat("date(E.created_date) = date(?)", [
        moment(new Date(req.query.toDate)).format(keyPath.default.dbFormat.date)
      ]);
    }
    if (req.query.status == "A") {
      _query += _mysql.mysqlQueryFormat("E.status <> 'V' AND");
    } else if (req.query.status == "V") {
      _query += _mysql.mysqlQueryFormat("E.status=? AND", ["V"]);
    }

    if (req.query.provider_id != null) {
      _query += _mysql.mysqlQueryFormat(" and provider_id=? ", [
        req.query.provider_id
      ]);
    }
    if (req.query.sub_department_id != null) {
      _query += _mysql.mysqlQueryFormat(" and sub_department_id=? ", [
        req.query.sub_department_id
      ]);
    }
    _mysql
      .executeQuery({
        query:
          "select  E.hims_f_patient_encounter_id,P.patient_code,P.full_name,P.gender,P.age,E.patient_id ,V.appointment_patient,V.new_visit_patient,E.provider_id,E.`status`,E.nurse_examine,E.checked_in,\
          E.payment_type,E.episode_id,E.encounter_id,E.`source`,E.updated_date as encountered_date,E.visit_id ,sub_department_id from hims_f_patient_encounter E\
          INNER JOIN hims_f_patient P ON E.patient_id=P.hims_d_patient_id \
          inner join hims_f_patient_visit V on E.visit_id=V.hims_f_patient_visit_id  \
          where E.cancelled='N' and E.record_status='A' AND  V.record_status='A' and v.hospital_id=? AND " +
          _query,
        values: [req.userIdentity.hospital_id],
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
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
