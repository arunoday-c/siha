import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

module.exports = {
  closeVisit: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        const inputParam = req.body;
        const utilities = new algaehUtilities();
        /* Select statemwnt  */

        utilities.logger().log("inputParam: ", inputParam);

        let qry = "";
        for (let i = 0; i < inputParam.length; i++) {
          utilities
            .logger()
            .log("inputParam: ", inputParam[i].hims_f_patient_visit_id);
          qry += mysql.format(
            "UPDATE `hims_f_patient_visit` SET visit_status='C' WHERE hims_f_patient_visit_id=?;",
            [inputParam[i].hims_f_patient_visit_id]
          );
        }
        utilities.logger().log("qry: ", qry);
        if (qry != "") {
          _mysql
            .executeQuery({
              query: qry,
              printQuery: true
            })
            .then(patient_details => {
              _mysql.releaseConnection();
              req.records = patient_details;
              resolve(patient_details);
              next();
            })
            .catch(e => {
              reject(e);
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = [];
          resolve([]);
          next();
        }
      } catch (e) {
        next(e);
        reject(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  checkVisitExists: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        let inputParam = req.query;

        const utilities = new algaehUtilities();
        /* Select statemwnt  */

        utilities.logger().log("inputParam: ", inputParam);

        _mysql
          .executeQuery({
            query:
              "select visit_code from hims_d_sub_department,hims_f_patient_visit where \
          hims_f_patient_visit.sub_department_id=hims_d_sub_department.hims_d_sub_department_id \
          and hims_d_sub_department.record_status='A' and hims_f_patient_visit.record_status='A' \
          and hims_f_patient_visit.visit_date =DATE(now()) and hims_d_sub_department.hims_d_sub_department_id=?\
          and hims_f_patient_visit.doctor_id=? and patient_id =? ",
            values: [
              inputParam.sub_department_id,
              inputParam.doctor_id,
              inputParam.patient_id
            ],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(e => {
            reject(e);
            next(e);
          });
      } catch (e) {
        next(e);
        reject(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  insertPatientVisitData: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        const inputParam = req.body;
        const utilities = new algaehUtilities();

        let existingExparyDate = null;
        let currentPatientEpisodeNo = null;
        let today = moment().format("YYYY-MM-DD");

        inputParam.patient_id = req.body.patient_id;

        utilities.logger().log("inputParam: ", inputParam);

        const internalInsertPatientVisitData = () => {
          inputParam.new_visit_patient = "Y";
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

          if (
            (existingExparyDate != null || existingExparyDate != undefined) &&
            moment(existingExparyDate).format("YYYY-MM-DD") >= today
          ) {
            debugFunction("Inside");
            inputParam.visit_expiery_date = existingExparyDate;
            inputParam.episode_id = currentPatientEpisodeNo;
            inputParam.new_visit_patient = "N";
          }

          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_patient_visit` (`patient_id`, `visit_type`, \
                `age_in_years`, `age_in_months`, `age_in_days`, `insured`,`sec_insured`,\
                `visit_date`, `department_id`, `sub_department_id`, `doctor_id`, `maternity_patient`,\
                `is_mlc`, `mlc_accident_reg_no`, `mlc_police_station`, `mlc_wound_certified_date`, `existing_plan`,\
                `treatment_plan_id`,`created_by`, `created_date`,`visit_code`,`visit_expiery_date`,`episode_id`,\
                `appointment_id`, `appointment_patient`, `new_visit_patient`)\
                VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?, ?, ?, ?);",
              values: [
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
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                inputParam.visit_code,
                inputParam.visit_expiery_date != null
                  ? new Date(inputParam.visit_expiery_date)
                  : inputParam.visit_expiery_date,
                inputParam.episode_id,
                inputParam.appointment_id,
                inputParam.appointment_patient,
                inputParam.new_visit_patient
              ],
              printQuery: true
            })
            .then(visitresult => {
              req.body.visit_id = visitresult.insertId;
              let patient_visit_id = visitresult.insertId;

              if (patient_visit_id != null) {
                _mysql
                  .executeQuery({
                    query:
                      "INSERT INTO `hims_f_patient_visit_message` (`patient_visit_id`\
                      , `patient_message`, `is_critical_message`, `message_active_till`, `created_by`, `created_date`\
                      ) VALUES ( ?, ?, ?, ?, ?, ?);",
                    values: [
                      patient_visit_id,
                      inputParam.patient_message,
                      inputParam.is_critical_message,
                      inputParam.message_active_till,
                      req.userIdentity.algaeh_d_app_user_id,
                      new Date()
                    ],
                    printQuery: true
                  })
                  .then(resultData => {
                    resolve(visitresult);
                  })
                  .catch(e => {
                    reject(e);
                    next(e);
                  });
              }
            })
            .catch(e => {
              reject(e);
              next(e);
            });
        };

        if (inputParam.consultation == "Y") {
          _mysql
            .executeQuery({
              query:
                "select max(visit_expiery_date) as visit_expiery_date,max(episode_id) as episode_id, no_free_visit\
                 from hims_f_patient_visit where\
                patient_id=? and doctor_id=? and record_status='A';",
              values: [inputParam.patient_id, inputParam.doctor_id],
              printQuery: true
            })
            .then(expResult => {
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
                }
                let currentEpisodeNo = null;
                if (
                  existingExparyDate == null ||
                  existingExparyDate == undefined ||
                  existingExparyDate < today
                ) {
                  _mysql
                    .executeQuery({
                      query:
                        "SELECT param_value,episode_id from algaeh_d_app_config WHERE algaeh_d_app_config_id=11 \
                        and record_status='A';",
                      printQuery: true
                    })
                    .then(record => {
                      if (record.length == 0) {
                        if (req.mySQl == null) {
                          _mysql.rollBackTransaction(() => {
                            next(
                              utilities
                                .httpStatus()
                                .generateError(
                                  utilities.httpStatus().noContent,
                                  "Episode value not found.Please contact administrator."
                                )
                            );
                          });
                        } else {
                          reject();
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

                        _mysql
                          .executeQuery({
                            query:
                              "update algaeh_d_app_config set episode_id=? where algaeh_d_app_config_id=11 and record_status='A';",
                            values: [nextEpisodeNo],
                            printQuery: true
                          })
                          .then(updateResult => {
                            internalInsertPatientVisitData();
                          })
                          .catch(e => {
                            reject(e);
                            next(e);
                          });
                      }
                    })
                    .catch(e => {
                      reject(e);
                      next(e);
                    });
                } else {
                  inputParam.episode_id = expResult[0]["episode_id"];
                  req.body.episode_id = inputParam.episode_id;
                  internalInsertPatientVisitData();
                }
              }
            })
            .catch(e => {
              reject(e);
              next(e);
            });
        } //for non consultaion
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
        reject(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  }
};
