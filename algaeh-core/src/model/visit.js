import extend from "extend";
import httpStatus from "../utils/httpStatus";
import logUtils from "../utils/logging";
import utils from "../utils";
import moment from "moment";
import mysql from "mysql";

const { runningNumber, releaseDBConnection } = utils;
const { debugLog, debugFunction, logger } = logUtils;

//Added by noor for code optimization aug-20-1018
let insertPatientVisitData = (req, res, next) => {
  try {
    debugFunction("insertPatientVisitData");

    let inputParam = extend(
      {
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
        appointment_patient: null,
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
      },
      req.query["data"] == null ? req.body : req.query
    );

    let db = req.options != null ? req.options.db : req.db;
    let existingExparyDate = null;
    let currentPatientEpisodeNo = null;
    let today = moment().format("YYYY-MM-DD");

    inputParam.patient_id = req.patient_id || req.body.patient_id;
    debugLog("Body:", req.body);
    const internalInsertPatientVisitData = () => {
      debugFunction("1");
      if (inputParam.age_in_years == null) {
        let fromDate = moment(inputParam.date_of_birth);
        let toDate = new Date();
        let years = moment(toDate).diff(fromDate, "year");
        fromDate.add(years, "years");
        let months = moment(toDate).diff(fromDate, "months");
        fromDate.add(months, "months");
        let days = moment(toDate).diff(fromDate, "days");
        inputParam.age_in_years = years;
        inputParam.age_in_months = months;
        inputParam.age_in_days = days;
      }
      debugFunction("2");

      debugLog("internal Inside: ", existingExparyDate);
      debugLog("internal Inside: ", currentPatientEpisodeNo);
      debugLog("today: ", today);
      if (
        (existingExparyDate != null || existingExparyDate != undefined) &&
        moment(existingExparyDate).format("YYYY-MM-DD") >= today
      ) {
        debugFunction("Inside");
        inputParam.visit_expiery_date = existingExparyDate;
        inputParam.episode_id = currentPatientEpisodeNo;
      }
      debugFunction("3");
      debugLog("inside internalInsertPatientVisitData");
      db.query(
        "INSERT INTO `hims_f_patient_visit` (`patient_id`, `visit_type`, \
`age_in_years`, `age_in_months`, `age_in_days`, `insured`,`sec_insured`,\
`visit_date`, `department_id`, `sub_department_id`, `doctor_id`, `maternity_patient`,\
`is_mlc`, `mlc_accident_reg_no`, `mlc_police_station`, `mlc_wound_certified_date`, `existing_plan`,`treatment_plan_id`,\
`created_by`, `created_date`,`visit_code`,`visit_expiery_date`,`episode_id`,`appointment_id`, `appointment_patient`)\
VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?, ?, ?);",
        [
          inputParam.patient_id,
          inputParam.visit_type,
          inputParam.age_in_years,
          inputParam.age_in_months,
          inputParam.age_in_days,
          inputParam.insured,
          inputParam.sec_insured,
          new Date(),
          inputParam.department_id,
          inputParam.sub_department_id,
          inputParam.doctor_id,
          inputParam.maternity_patient,
          inputParam.is_mlc,
          inputParam.mlc_accident_reg_no,
          inputParam.mlc_police_station,
          inputParam.mlc_wound_certified_date != null
            ? new Date(inputParam.mlc_wound_certified_date)
            : inputParam.mlc_wound_certified_date,
          inputParam.existing_plan,
          inputParam.treatment_plan_id,
          inputParam.created_by,
          new Date(),
          inputParam.visit_code,
          inputParam.visit_expiery_date != null
            ? new Date(inputParam.visit_expiery_date)
            : inputParam.visit_expiery_date,
          inputParam.episode_id,
          inputParam.appointment_id,
          inputParam.appointment_patient
        ],
        (error, visitresult) => {
          if (error) {
            debugLog("error: ", error);
            if (req.options == null) {
              db.rollback(() => {
                releaseDBConnection(req.db, db);
              });
            } else {
              req.options.onFailure(error);
            }
          }
          req.visit_id = visitresult.insertId;
          let patient_visit_id = visitresult.insertId;

          if (patient_visit_id != null) {
            db.query(
              "INSERT INTO `hims_f_patient_visit_message` (`patient_visit_id`\
, `patient_message`, `is_critical_message`, `message_active_till`, `created_by`, `created_date`\
) VALUES ( ?, ?, ?, ?, ?, ?);",
              [
                patient_visit_id,
                inputParam.patient_message,
                inputParam.is_critical_message,
                inputParam.message_active_till,
                inputParam.created_by,
                new Date()
              ],
              (error, resultData) => {
                if (error) {
                  if (req.options == null) {
                    db.rollback(() => {
                      releaseDBConnection(req.db, db);
                      next(error);
                    });
                  } else {
                    req.options.onFailure(eror);
                  }
                } else {
                  req.options.onSuccess(visitresult);
                }
              }
            );
          }
        }
      );
    };
    //for consultaion
    if (inputParam.consultation == "Y") {
      debugLog("In consultation == Y ");
      db.query(
        " select max(visit_expiery_date) as visit_expiery_date,max(episode_id) as episode_id from hims_f_patient_visit where\
         patient_id=? and doctor_id=? and record_status='A';",
        [inputParam.patient_id, inputParam.doctor_id],
        (error, expResult) => {
          debugLog("In consultation Query", expResult);
          if (error) {
            if (req.options == null) {
              db.rollback(() => {
                releaseDBConnection(req.db, db);
              });
            } else {
              req.options.onFailure(error);
            }
          } else {
            debugLog("Else ", expResult);
            if (inputParam.existing_plan === "Y") {
              inputParam.visit_expiery_date = moment(
                expResult[0]["visit_expiery_date"]
              ).format("YYYY-MM-DD");
              inputParam.episode_id = expResult[0]["episode_id"];
              internalInsertPatientVisitData();
              //Data
            } else {
              //fetching expiry date and episode id for existing patient
              if (
                expResult[0].visit_expiery_date != null &&
                expResult[0].episode_id != null
              ) {
                existingExparyDate = moment(
                  expResult[0]["visit_expiery_date"]
                ).format("YYYY-MM-DD");
                currentPatientEpisodeNo = expResult[0]["episode_id"];
                debugLog("expResult Inside ", existingExparyDate);
                debugLog("expResult Inside ", currentPatientEpisodeNo);
              }
              // req.body.episode_id = expResult[0]["episode_id"];
              let currentEpisodeNo = null;
              //checking expiry if expired or not_there create new expiry date
              debugLog("existingExparyDate ", existingExparyDate);
              if (
                existingExparyDate == null ||
                existingExparyDate == undefined ||
                existingExparyDate < today
              ) {
                debugLog("existingExparyDate ", existingExparyDate);
                //create new expiry date
                db.query(
                  "SELECT param_value,episode_id from algaeh_d_app_config WHERE algaeh_d_app_config_id=11 \
                and record_status='A'",
                  (error, record) => {
                    debugLog("In Expiry date records ", record);
                    if (error) {
                      if (req.options == null) {
                        db.rollback(() => {
                          releaseDBConnection(req.db, db);
                          next(error);
                        });
                      } else {
                        req.options.onFailure(error);
                      }
                    } else {
                      if (record.length == 0) {
                        if (req.options == null) {
                          db.rollback(() => {
                            releaseDBConnection(req.db, db);
                            next(
                              httpStatus.generateError(
                                httpStatus.notModified,
                                "Episode value not found.Please contact administrator."
                              )
                            );
                          });
                        } else {
                          req.options.onFailure(
                            httpStatus.generateError(
                              httpStatus.notModified,
                              "Episode value not found.Please contact administrator."
                            )
                          );
                        }
                      }
                      inputParam.visit_expiery_date = moment()
                        .add(parseInt(record[0]["param_value"], 10), "days")
                        .format("YYYY-MM-DD");
                      currentEpisodeNo = record[0].episode_id;

                      if (currentEpisodeNo > 0) {
                        let nextEpisodeNo = currentEpisodeNo + 1;
                        inputParam.episode_id = currentEpisodeNo;
                        req.body.episode_id = inputParam.episode_id;
                        db.query(
                          "update algaeh_d_app_config set episode_id=? where algaeh_d_app_config_id=11 and record_status='A' ",
                          [nextEpisodeNo],
                          (error, updateResult) => {
                            if (error) {
                              if (req.options == null) {
                                db.rollback(() => {
                                  releaseDBConnection(req.db, dataBase);
                                  next(error);
                                });
                              } else {
                                req.options.onFailure(error);
                              }
                            } else {
                              internalInsertPatientVisitData();
                            }
                          }
                        );
                      }
                    }
                  }
                );
              } else {
                inputParam.episode_id = expResult[0]["episode_id"];
                req.body.episode_id = inputParam.episode_id;
                internalInsertPatientVisitData();
              }
            }
          }
        }
      );
    }
    //for non consultaion
    else if (inputParam.consultation == "N") {
      inputParam.visit_expiery_date = new Date();
      inputParam.episode_id = null;
      internalInsertPatientVisitData();
    } else {
      if (req.options == null) {
        db.rollback(() => {
          releaseDBConnection(req.db, db);
          next(
            httpStatus.generateError(
              httpStatus.noContent,
              "Please select consultation type"
            )
          );
        });
      } else {
        req.options.onFailure(
          httpStatus.generateError(
            httpStatus.noContent,
            "Please select consultation type"
          )
        );
      }
    }
  } catch (e) {
    next(e);
  }
};

//----end

let addVisit = (req, res, next) => {
  try {
    debugFunction("addVisit");
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
            next(error);
          });
        }

        let patient_id =
          req.body.patient_id != null
            ? req.body.patient_id
            : req.query.patient_id;
        let visit_code =
          req.body.visit_code != null
            ? req.body.visit_code
            : req.query.visit_code;
        if (visit_code != "" && patient_id != null) {
          insertVisitData(connection, req, res, (error, result) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(req.db, connection);
                next(error);
              });
            }
            connection.commit(error => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(req.db, connection);
                  next(error);
                });
              }
              req.records = result;
              releaseDBConnection(req.db, connection);
              next();
            });
          });
        } else {
          if (patient_id == null) {
            next(
              httpStatus.generateError(400, "Patient Code is not generated")
            );
          } else {
            runningNumber(
              connection,
              2,
              "VISIT_NUMGEN",
              (error, numUpdate, completeNumber) => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }
                req.query.visit_code = completeNumber;
                req.body.visit_code = completeNumber;
                debugLog("req.body.visit_code : " + completeNumber);
                insertVisitData(connection, req, res, (error, result) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(req.db, connection);
                      next(error);
                    });
                  }
                  connection.commit(error => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(req.db, connection);
                        next(error);
                      });
                    }
                    releaseDBConnection(req.db, connection);
                    req.records = result;
                    next();
                  });
                });
              }
            );
          }
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

//old method to be deleted
let insertVisitData = (dataBase, req, res, callBack) => {
  let visitDetails = {
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
    debugFunction("insertVisitData");
    let inputParam = extend(
      visitDetails,
      req.query["data"] == null ? req.body : req.query
    );

    let today = moment().format("YYYY-MM-DD");

    //for consultaion
    if (inputParam.consultation == "Y") {
      dataBase.query(
        " select max(visit_expiery_date) as visit_expiery_date,episode_id from hims_f_patient_visit where\
         patient_id=? and doctor_id=? and record_status='A' group by patient_id, doctor_id;",
        [inputParam.patient_id, inputParam.doctor_id],
        (error, expResult) => {
          if (error) {
            dataBase.rollback(() => {
              dataBase.release();
              debugLog("error ", error);
            });
          }

          let existingExparyDate = null;
          let currentPatientEpisodeNo = null;

          //fetching expiry date and episode id for existing patient
          if (expResult[0] != null || expResult.length != 0) {
            existingExparyDate = moment(
              expResult[0]["visit_expiery_date"]
            ).format("YYYY-MM-DD");

            debugLog("existingExparyDate:", existingExparyDate);

            currentPatientEpisodeNo = expResult[0]["episode_id"];
            debugLog("currentPatientEpisodeNo:", currentPatientEpisodeNo);
          }

          let currentEpisodeNo = null;

          //checking expiry if expired or not_there create new expiry date
          if (
            existingExparyDate == null ||
            existingExparyDate == undefined ||
            existingExparyDate < today
          ) {
            //create new expiry date
            dataBase.query(
              "SELECT param_value from algaeh_d_app_config WHERE param_name=?",
              ["VISITEXPERIDAY"],
              (error, record) => {
                if (error) {
                  dataBase.rollback(() => {
                    dataBase.release();
                    logger.log("error", "Add new visit %j", error);
                  });
                }

                inputParam.visit_expiery_date = moment()
                  .add(
                    record != null && record.length != 0
                      ? parseInt(record[0]["param_value"], 10)
                      : 0,
                    "days"
                  )
                  .format("YYYY-MM-DD");
                debugLog(
                  "new expiry date created:",
                  inputParam.visit_expiery_date
                );

                // create new episode
                dataBase.query(
                  "select episode_id from algaeh_d_app_config where algaeh_d_app_config_id=11 and record_status='A'",
                  (error, result) => {
                    if (error) {
                      releaseDBConnection(req.db, dataBase);
                      next(error);
                    }

                    currentEpisodeNo = result[0].episode_id;
                    debugLog("currentEpisodeNo:", currentEpisodeNo);

                    //increament episode id
                    if (currentEpisodeNo > 0) {
                      let nextEpisodeNo = currentEpisodeNo + 1;
                      debugLog("nextEpisodeNo :", nextEpisodeNo);
                      inputParam.episode_id = currentEpisodeNo;

                      dataBase.query(
                        "update algaeh_d_app_config set episode_id=? where algaeh_d_app_config_id=11 and record_status='A' ",
                        [nextEpisodeNo],
                        (error, updateResult) => {
                          if (error) {
                            dataBase.rollback(() => {
                              releaseDBConnection(req.db, dataBase);
                              next(error);
                            });
                          }

                          // inserting patient visit
                          dataBase.query(
                            "INSERT INTO `hims_f_patient_visit` (`patient_id`, `visit_type`, \
    `age_in_years`, `age_in_months`, `age_in_days`, `insured`,`sec_insured`,\
  `visit_date`, `department_id`, `sub_department_id`, `doctor_id`, `maternity_patient`,\
   `is_mlc`, `mlc_accident_reg_no`, `mlc_police_station`, `mlc_wound_certified_date`, \
   `created_by`, `created_date`,`visit_code`,`visit_expiery_date`,`episode_id`)\
  VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?);",
                            [
                              inputParam.patient_id,
                              inputParam.visit_type,
                              inputParam.age_in_years,
                              inputParam.age_in_months,
                              inputParam.age_in_days,
                              inputParam.insured,
                              inputParam.sec_insured,
                              inputParam.visit_date,
                              inputParam.department_id,
                              inputParam.sub_department_id,
                              inputParam.doctor_id,
                              inputParam.maternity_patient,
                              inputParam.is_mlc,
                              inputParam.mlc_accident_reg_no,
                              inputParam.mlc_police_station,
                              inputParam.mlc_wound_certified_date,
                              inputParam.created_by,
                              new Date(),
                              inputParam.visit_code,
                              inputParam.visit_expiery_date,
                              inputParam.episode_id
                            ],
                            (error, visitresult) => {
                              if (error) {
                                dataBase.rollback(() => {
                                  dataBase.release();
                                  logger.log(
                                    "error",
                                    "Add new visit %j",
                                    error
                                  );
                                });
                              }
                              req.visit_id = visitresult.insertId;
                              let patient_visit_id = visitresult.insertId;

                              debugLog(
                                "patient_visit_id : " + patient_visit_id
                              );

                              if (patient_visit_id != null) {
                                dataBase.query(
                                  "INSERT INTO `hims_f_patient_visit_message` (`patient_visit_id`\
, `patient_message`, `is_critical_message`, `message_active_till`, `created_by`, `created_date`\
) VALUES ( ?, ?, ?, ?, ?, ?);",
                                  [
                                    patient_visit_id,
                                    inputParam.patient_message,
                                    inputParam.is_critical_message,
                                    inputParam.message_active_till,
                                    inputParam.created_by,
                                    new Date()
                                  ],
                                  (error, resultData) => {
                                    if (typeof callBack == "function") {
                                      callBack(error, visitresult);
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      );
                    }
                  }
                );
              }
            );
          } else if (existingExparyDate > today) {
            inputParam.visit_expiery_date = existingExparyDate;
            inputParam.episode_id = currentPatientEpisodeNo;

            // inserting patient visit
            dataBase.query(
              "INSERT INTO `hims_f_patient_visit` (`patient_id`, `visit_type`, \
            `age_in_years`, `age_in_months`, `age_in_days`, `insured`,`sec_insured`,\
          `visit_date`, `department_id`, `sub_department_id`, `doctor_id`, `maternity_patient`,\
           `is_mlc`, `mlc_accident_reg_no`, `mlc_police_station`, `mlc_wound_certified_date`, \
           `created_by`, `created_date`,`visit_code`,`visit_expiery_date`,`episode_id`)\
          VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?);",
              [
                inputParam.patient_id,
                inputParam.visit_type,
                inputParam.age_in_years,
                inputParam.age_in_months,
                inputParam.age_in_days,
                inputParam.insured,
                inputParam.sec_insured,
                inputParam.visit_date,
                inputParam.department_id,
                inputParam.sub_department_id,
                inputParam.doctor_id,
                inputParam.maternity_patient,
                inputParam.is_mlc,
                inputParam.mlc_accident_reg_no,
                inputParam.mlc_police_station,
                inputParam.mlc_wound_certified_date,
                inputParam.created_by,
                new Date(),
                inputParam.visit_code,
                inputParam.visit_expiery_date,
                inputParam.episode_id
              ],
              (error, visitresult) => {
                if (error) {
                  dataBase.rollback(() => {
                    dataBase.release();
                    logger.log("error", "Add new visit %j", error);
                  });
                }
                req.visit_id = visitresult.insertId;
                let patient_visit_id = visitresult.insertId;

                debugLog("patient_visit_id : " + patient_visit_id);

                if (patient_visit_id != null) {
                  dataBase.query(
                    "INSERT INTO `hims_f_patient_visit_message` (`patient_visit_id`\
        , `patient_message`, `is_critical_message`, `message_active_till`, `created_by`, `created_date`\
        ) VALUES ( ?, ?, ?, ?, ?, ?);",
                    [
                      patient_visit_id,
                      inputParam.patient_message,
                      inputParam.is_critical_message,
                      inputParam.message_active_till,
                      inputParam.created_by,
                      new Date()
                    ],
                    (error, resultData) => {
                      if (typeof callBack == "function") {
                        callBack(error, visitresult);
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    } //not for consultaion
    else if (inputParam.consultation == "N") {
      debugFunction("not for consultaion");
      dataBase.query(
        "INSERT INTO `hims_f_patient_visit` (`patient_id`, `visit_type`, \
      `age_in_years`, `age_in_months`, `age_in_days`, `insured`,`sec_insured`,\
    `visit_date`, `department_id`, `sub_department_id`, `doctor_id`, `maternity_patient`,\
     `is_mlc`, `mlc_accident_reg_no`, `mlc_police_station`, `mlc_wound_certified_date`, \
     `created_by`, `created_date`,`visit_code`,`visit_expiery_date`)\
    VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);",
        [
          inputParam.patient_id,
          inputParam.visit_type,
          inputParam.age_in_years,
          inputParam.age_in_months,
          inputParam.age_in_days,
          inputParam.insured,
          inputParam.sec_insured,
          inputParam.visit_date,
          inputParam.department_id,
          inputParam.sub_department_id,
          inputParam.doctor_id,
          inputParam.maternity_patient,
          inputParam.is_mlc,
          inputParam.mlc_accident_reg_no,
          inputParam.mlc_police_station,
          inputParam.mlc_wound_certified_date,
          inputParam.created_by,
          new Date(),
          inputParam.visit_code,
          today
        ],
        (error, result) => {
          if (error) {
            dataBase.rollback(() => {
              dataBase.release();
              logger.log("error", "Add new visit %j", error);
            });
          }
          req.visit_id = result.insertId;
          let patient_visit_id = result.insertId;

          debugLog("patient_visit_id : " + patient_visit_id);

          if (patient_visit_id != null) {
            dataBase.query(
              "INSERT INTO `hims_f_patient_visit_message` (`patient_visit_id`\
  , `patient_message`, `is_critical_message`, `message_active_till`, `created_by`, `created_date`\
  ) VALUES ( ?, ?, ?, ?, ?, ?);",
              [
                patient_visit_id,
                inputParam.patient_message,
                inputParam.is_critical_message,
                inputParam.message_active_till,
                inputParam.created_by,
                new Date()
              ],
              (error, resultData) => {
                if (typeof callBack == "function") {
                  callBack(error, result);
                }
              }
            );
          }
        }
      );
    }
  } catch (e) {
    next(e);
  }
};

let updateVisit = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      updateData(connection, req, (error, result) => {
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

let updateData = (dataBase, req, callBack) => {
  let visitDetails = {
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
    let inputParam = extend(visitDetails, req.body);
    dataBase.query(
      "UPDATE `hims_f_patient_visit`\
    SET `visit_type`=?, `visit_date`=?, `department_id`=?, `sub_department_id`=?\
    ,`doctor_id`=?, `maternity_patient`=?, `is_mlc`=?, `mlc_accident_reg_no`=?,\
    `mlc_police_station`=?, `mlc_wound_certified_date`=?, `updated_by`=?, `updated_date`=?\
    WHERE `hims_f_patient_visit_id`=?;",
      [
        inputParam.visit_type,
        inputParam.visit_date,
        inputParam.department_id,
        inputParam.sub_department_id,
        inputParam.doctor_id,
        inputParam.maternity_patient,
        inputParam.is_mlc,
        inputParam.mlc_accident_reg_no,
        inputParam.mlc_police_station,
        inputParam.mlc_wound_certified_date,
        inputParam.updated_by,
        new Date(),
        inputParam.hims_f_patient_visit_id
      ],
      (error, result) => {
        if (typeof callBack == "function") {
          callBack(error, result);
        }
      }
    );
  } catch (e) {
    next(e);
  }
};

let checkVisitExists = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputParam = extend(
      {
        sub_department_id: null,
        doctor_id: null,
        patient_id: null
      },
      req.body
    );
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      db.query(
        "select visit_code from hims_d_sub_department,hims_f_patient_visit where \
      hims_f_patient_visit.sub_department_id=hims_d_sub_department.hims_d_sub_department_id \
      and hims_d_sub_department.record_status='A' and hims_f_patient_visit.record_status='A' \
      and hims_f_patient_visit.visit_date =DATE(now()) and hims_d_sub_department.hims_d_sub_department_id=?\
      and hims_f_patient_visit.doctor_id=? and patient_id =? \
      ",
        [
          inputParam.sub_department_id,
          inputParam.doctor_id,
          inputParam.patient_id
        ],
        (error, records) => {
          connection.release();
          if (error) {
            next(error);
          }
          req.records = records;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

let closeVisit = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      let inputParam = extend([], req.body);

      let qry = "";
      debugLog("inputParam: ", inputParam);
      for (let i = 0; i < inputParam.length; i++) {
        debugLog("qry: ", inputParam[i].hims_f_patient_visit_id);
        qry += mysql.format(
          "UPDATE `hims_f_patient_visit` SET visit_status='C' WHERE hims_f_patient_visit_id=?;",
          [inputParam[i].hims_f_patient_visit_id]
        );
        debugLog("qry: ", qry);
      }
      debugLog("qry: ", qry);

      if (qry != "") {
        connection.query(qry, (error, detailResult) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          req.records = detailResult;
          next();
        });
      } else {
        releaseDBConnection(db, connection);
        req.records = [];
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};

export default {
  addVisit,
  updateVisit,
  insertVisitData,
  checkVisitExists,
  insertPatientVisitData,
  closeVisit
};
