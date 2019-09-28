"use strict";
import extend from "extend";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");

const { whereCondition, releaseDBConnection, jsonArrayToObject } = utils;

//created by irfan:
let addTreatmentPlan = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO `hims_f_treatment_plan` (plan_name,patient_id,episode_id,visit_id,remarks,\
          consult_date,       created_date, created_by, updated_date, updated_by,hospital_id)\
            VALUE(?,?,?,?,?,?,?,?,?,?,?)",
        [
          input.plan_name,
          input.patient_id,
          input.episode_id,
          input.visit_id,
          input.remarks,

          input.consult_date,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by,
          req.userIdentity.hospital_id
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

//created by irfan: to
let addDentalTreatmentBack = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    //let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      let working_days = [];

      let inputDays = [
        req.body.sunday,
        req.body.monday,
        req.body.tuesday,
        req.body.wednesday,
        req.body.thursday,
        req.body.friday,
        req.body.saturday
      ];

      for (let d = 0; d < 7; d++) {
        if (inputDays[d] == "Y") {
          working_days.push(d);
        }
      }

      const insurtColumns = [
        "patient_id",
        "episode_id",
        "treatment_plan_id",
        "service_id",
        "teeth_number",
        "scheduled_date",
        "distal",
        "incisal",
        "occlusal",
        "mesial",
        "buccal",
        "labial",
        "cervical",
        "palatal",
        "lingual",
        "billed",
        "treatment_status",
        "created_by",
        "updated_by"
      ];

      connection.query(
        "INSERT INTO hims_f_dental_treatment(" +
          insurtColumns.join(",") +
          ",created_date,updated_date) VALUES ?",
        [
          jsonArrayToObject({
            sampleInputObject: insurtColumns,
            arrayObj: req.body,
            newFieldToInsert: [new Date(), new Date()],
            req: req
          })
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
//created by irfan: to
let addDentalTreatment = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let finalInput = [];
      for (let i = 0; i < input.send_teeth.length; i++) {
        let surfaceArray = {
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
        let singleObj = new LINQ(input.send_teeth[i]["details"])
          .Select(s => s.surface)
          .ToArray();

        let teeth_number = input.send_teeth[i]["teeth_number"];
        extend(surfaceArray, { teeth_number });

        for (let d = 0; d < singleObj.length; d++) {
          if (singleObj[d] == "M") {
            extend(surfaceArray, { mesial: "Y" });
          }
          if (singleObj[d] == "P") {
            extend(surfaceArray, { palatal: "Y" });
          }
          if (singleObj[d] == "D") {
            extend(surfaceArray, { distal: "Y" });
          }
          if (singleObj[d] == "I") {
            extend(surfaceArray, { incisal: "Y" });
          }
          if (singleObj[d] == "L") {
            extend(surfaceArray, { labial: "Y" });
          }
        }

        finalInput.push(surfaceArray);
      }

      const insurtColumns = [
        "teeth_number",
        "distal",
        "incisal",
        "occlusal",
        "mesial",
        "buccal",
        "labial",
        "cervical",
        "palatal",
        "lingual",

        "created_by",
        "updated_by"
      ];

      connection.query(
        "INSERT INTO hims_f_dental_treatment(" +
          insurtColumns.join(",") +
          ",patient_id,episode_id,treatment_plan_id,service_id,\
          scheduled_date,created_date,updated_date,hospital_id) VALUES ?",
        [
          jsonArrayToObject({
            sampleInputObject: insurtColumns,
            arrayObj: finalInput,
            newFieldToInsert: [
              input.patient_id,
              input.episode_id,
              input.treatment_plan_id,
              input.service_id,
              new Date(input.scheduled_date),

              new Date(),
              new Date(),
              req.userIdentity.hospital_id
            ],
            req: req
          })
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

//created by irfan: to
let getTreatmentPlan = (req, res, next) => {
  let selectWhere = {
    patient_id: "ALL",
    episode_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_treatment_plan_id, plan_name, patient_id, episode_id, visit_id, remarks,\
         approve_status, plan_status,consult_date from  hims_f_treatment_plan where record_status='A' and " +
          where.condition,
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

//created by irfan: to
let getDentalTreatment = (req, res, next) => {
  let selectWhere = {
    patient_id: "ALL",
    episode_id: "ALL",
    treatment_plan_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_dental_treatment_id, patient_id, episode_id, treatment_plan_id, service_id, teeth_number\
        , scheduled_date, distal, incisal, occlusal, mesial, buccal, labial, cervical, palatal, lingual,\
         billed, treatment_status from hims_f_dental_treatment  where record_status='A' and " +
          where.condition,
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

//created by irfan: to
let approveTreatmentPlan = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      if (input.approve_status == "Y") {
        connection.query(
          "update hims_f_treatment_plan set approve_status=? ,\
             updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_f_treatment_plan_id`=?;",
          [
            input.approve_status,
            new Date(),
            input.updated_by,
            input.hims_f_treatment_plan_id
          ],
          (error, results) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }
            req.records = results;
            next();
          }
        );
      } else if (input.approve_status == "C") {
        connection.beginTransaction(error => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }
          connection.query(
            "delete from hims_f_dental_treatment where treatment_plan_id=?;",
            [input.hims_f_treatment_plan_id],
            (error, results) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
              if (results != null) {
                connection.query(
                  "  delete from hims_f_treatment_plan where hims_f_treatment_plan_id=?",
                  [input.hims_f_treatment_plan_id],
                  (error, planResult) => {
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
                      req.records = planResult;
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
        });
      } else {
        releaseDBConnection(db, connection);
        req.records = { invalid_input: true };
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
let deleteDentalPlan = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "delete from hims_f_dental_treatment where hims_f_dental_treatment_id=?",
        [req.body.hims_f_dental_treatment_id],
        (error, deleteRes) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }

          req.records = deleteRes;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};
//created by irfan: to
let updateDentalPlanStatus = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let input = extend({}, req.body);
      if (input.plan_status == "C" || input.plan_status == "O") {
        connection.query(
          "update hims_f_treatment_plan set plan_status=? ,\
             updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_f_treatment_plan_id`=?;",
          [
            input.plan_status,
            new Date(),
            input.updated_by,
            input.hims_f_treatment_plan_id
          ],
          (error, results) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }
            req.records = results;
            next();
          }
        );
      } else {
        releaseDBConnection(db, connection);
        req.records = { invalid_input: true };
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
let updateDentalTreatmentStatus = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;

    _mysql
      .executeQueryWithTransaction({
        query:
          "update hims_f_dental_treatment set treatment_status=? , updated_date=?, updated_by=? \
          WHERE  `record_status`='A' and `hims_f_dental_treatment_id`=?;",
        values: [
          input.treatment_status,
          new Date(),
          input.updated_by,
          input.hims_f_dental_treatment_id
        ],
        printQuery: true
      })
      .then(update_result => {
        _mysql
          .executeQuery({
            query:
              "select treatment_plan_id from hims_f_dental_treatment where treatment_plan_id = ? and \
              treatment_status !='CP';",
            values: [input.treatment_plan_id],
            printQuery: true
          })
          .then(result => {
            if (result.length === 0) {
              _mysql
                .executeQuery({
                  query:
                    "update hims_f_treatment_plan set plan_status='C' ,updated_date=?, updated_by=? \
                    WHERE  `hims_f_treatment_plan_id`=?;",
                  values: [
                    new Date(),
                    input.updated_by,
                    input.treatment_plan_id
                  ],
                  printQuery: true
                })
                .then(plan_result => {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = plan_result;
                    next();
                  });
                })
                .catch(error => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            } else {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = result;
                next();
              });
            }
          })
          .catch(error => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      })
      .catch(error => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });

    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    //
    // db.getConnection((error, connection) => {
    //   if (error) {
    //     next(error);
    //   }
    //   let input = extend({}, req.body);
    //   if (input.treatment_status == "WIP" || input.treatment_status == "CP") {
    //     connection.query(
    //       "update hims_f_dental_treatment set treatment_status=? ,\
    //          updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_f_dental_treatment_id`=?;",
    //       [
    //         input.treatment_status,
    //         new Date(),
    //         input.updated_by,
    //         input.hims_f_dental_treatment_id
    //       ],
    //       (error, results) => {
    //         releaseDBConnection(db, connection);
    //         if (error) {
    //           next(error);
    //         }
    //         req.records = results;
    //         next();
    //       }
    //     );
    //   } else {
    //     releaseDBConnection(db, connection);
    //     req.records = { invalid_input: true };
    //     next();
    //   }
    // });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to
let updateDentalTreatmentBilledStatus = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let input = extend({}, req.body);
      if (input.billed == "SB" || input.billed == "Y") {
        connection.query(
          "update hims_f_dental_treatment set billed=? ,\
             updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_f_dental_treatment_id`=?;",
          [
            input.billed,
            new Date(),
            input.updated_by,
            input.hims_f_dental_treatment_id
          ],
          (error, results) => {
            releaseDBConnection(db, connection);
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
          }
        );
      } else {
        releaseDBConnection(db, connection);
        req.records = { invalid_input: true };
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
let updateDentalTreatment = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let input = extend({}, req.body);
      if (
        input.hims_f_dental_treatment_id != "null" ||
        input.hims_f_dental_treatment_id != undefined
      ) {
        connection.query(
          "update hims_f_dental_treatment set  scheduled_date=?, distal=?, incisal=?,\
           occlusal=?, mesial=?, buccal=?, labial=?, cervical=?, palatal=?, lingual=?,\
             updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_f_dental_treatment_id`=?;",
          [
            input.scheduled_date,

            input.distal,
            input.incisal,
            input.occlusal,
            input.mesial,
            input.buccal,
            input.labial,
            input.cervical,
            input.palatal,
            input.lingual,
            new Date(),
            input.updated_by,
            input.hims_f_dental_treatment_id
          ],
          (error, results) => {
            releaseDBConnection(db, connection);
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
          }
        );
      } else {
        releaseDBConnection(db, connection);
        req.records = { invalid_input: true };
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};

export default {
  addTreatmentPlan,
  addDentalTreatment,
  getTreatmentPlan,
  getDentalTreatment,
  approveTreatmentPlan,
  deleteDentalPlan,
  updateDentalPlanStatus,
  updateDentalTreatmentStatus,
  updateDentalTreatmentBilledStatus,
  updateDentalTreatment
};
