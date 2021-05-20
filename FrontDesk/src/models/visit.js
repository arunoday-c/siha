import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";
import moment from "moment";
export default {
  closeVisit: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      const inputParam = req.body;
      // const utilities = new algaehUtilities();
      /* Select statemwnt  */

      // utilities.logger().log("inputParam: ", inputParam);

      let qry = "";
      for (let i = 0; i < inputParam.length; i++) {
        // utilities
        //   .logger()
        //   .log("inputParam: ", inputParam[i].hims_f_patient_visit_id);
        qry += mysql.format(
          "UPDATE `hims_f_patient_visit` SET visit_status='C' WHERE hims_f_patient_visit_id=?;",
          [inputParam[i].hims_f_patient_visit_id]
        );
      }
      // utilities.logger().log("qry: ", qry);
      if (qry != "") {
        _mysql
          .executeQuery({
            query: qry,
            printQuery: true,
          })
          .then((patient_details) => {
            _mysql.releaseConnection();
            req.records = patient_details;

            next();
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      } else {
        _mysql.releaseConnection();
        req.records = [];
        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  updateExpiryDate: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      const inputParam = req.body;

      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_f_patient_visit` SET visit_expiery_date=? WHERE hims_f_patient_visit_id=?;",
          values: [
            inputParam.visit_expiery_date,
            inputParam.hims_f_patient_visit_id,
          ],
          printQuery: true,
        })
        .then((visit_update) => {
          _mysql.releaseConnection();
          req.records = visit_update;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  checkVisitExists: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let inputParam = req.query;

      // const utilities = new algaehUtilities();
      /* Select statemwnt  */

      //utilities.logger().log("inputParam: ", inputParam);

      _mysql
        .executeQuery({
          query: `select visit_code from hims_f_patient_visit V \
          inner join hims_d_sub_department SD on V.sub_department_id=SD.hims_d_sub_department_id and SD.record_status='A' \
          inner join hims_d_visit_type VT on V.visit_type=VT.hims_d_visit_type_id and consultation='Y'\
          where date(V.visit_expiery_date) between date(now()) and DATE(V.visit_expiery_date) \
          and SD.hims_d_sub_department_id=? and V.doctor_id=? and patient_id =? and V.hospital_id=? and V.visit_status!='CN'`,
          values: [
            inputParam.sub_department_id,
            inputParam.doctor_id,
            inputParam.patient_id,
            req.userIdentity.hospital_id,
          ],
          printQuery: false,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;

          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  insertPatientVisitData: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      const inputParam = { ...req.body };
      // const utilities = new algaehUtilities();
      // utilities.logger().log("insertPatientVisitData: ");

      let existingExparyDate = null;
      let currentPatientEpisodeNo = null;
      let today = moment().format("YYYY-MM-DD");

      // inputParam.patient_id = req.body.patient_id;

      // utilities.logger().log("inputParam: ", inputParam);

      const internalInsertPatientVisitData = () => {
        let fromDate = moment(inputParam.date_of_birth);
        let toDate = new Date();
        let years = moment(toDate).diff(fromDate, "year");
        fromDate.add(years, "years");
        let months = moment(toDate).diff(fromDate, "months");
        fromDate.add(months, "months");
        let days = moment(toDate).diff(fromDate, "days");
        req.body.age_in_years = years;
        inputParam.age_in_years = years;
        inputParam.age_in_months = months;
        inputParam.age_in_days = days;

        if (inputParam.new_visit_patient === "P") {
          inputParam.new_visit_patient = "P";
        } else {
          inputParam.new_visit_patient = "Y";
          if (
            (existingExparyDate != null || existingExparyDate != undefined) &&
            moment(existingExparyDate).format("YYYY-MM-DD") >= today
          ) {
            inputParam.visit_expiery_date = existingExparyDate;
            inputParam.episode_id = currentPatientEpisodeNo;
            inputParam.new_visit_patient = "N";
          }
        }

        _mysql
          .executeQuery({
            query:
              "INSERT INTO `hims_f_patient_visit` (`patient_id`, `visit_type`, \
                `age_in_years`, `age_in_months`, `age_in_days`, `insured`,`sec_insured`,\
                `visit_date`, `department_id`, `sub_department_id`, `doctor_id`, `maternity_patient`,\
                `is_mlc`, `mlc_accident_reg_no`, `mlc_police_station`, `mlc_wound_certified_date`, `existing_plan`,\
                `treatment_plan_id`,`created_by`, `created_date`,`visit_code`,`visit_expiery_date`,`episode_id`,\
                `appointment_id`, `appointment_patient`, `new_visit_patient`,hospital_id, eligible, \
                eligible_reference_number, shift_id, updated_by,updated_date)\
                VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?, ?, ?, ?,?,?,?,?,?,?);",
            values: [
              inputParam.patient_id,
              inputParam.visit_type,
              inputParam.age_in_years,
              inputParam.age_in_months,
              inputParam.age_in_days,
              inputParam.insured ? inputParam.insured : "N",
              inputParam.sec_insured ? inputParam.sec_insured : "N",
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
              // inputParam.appointment_patient,
              inputParam.appointment_id ? "Y" : "N",
              inputParam.new_visit_patient,
              req.userIdentity.hospital_id,
              // inputParam.eligible,
              inputParam.eligible_reference_number ? "Y" : "N",
              inputParam.eligible_reference_number,
              inputParam.shift_id,
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
            ],
            printQuery: true,
          })
          .then((visitresult) => {
            req.body.visit_id = visitresult.insertId;
            let patient_visit_id = visitresult.insertId;

            if (patient_visit_id != null) {
              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO `hims_f_patient_visit_message` (`patient_visit_id`\
                      , `patient_message`, `is_critical_message`, `message_active_till`, `created_by`, `created_date`\
                      ) VALUES ( ?, ?, ?, ?, ?, ?); SELECT full_name, sub_department_name from hims_d_employee E \
                      INNER JOIN hims_d_sub_department SD ON E.sub_department_id = SD.hims_d_sub_department_id where hims_d_employee_id=?;",
                  values: [
                    patient_visit_id,
                    inputParam.patient_message,
                    inputParam.is_critical_message,
                    inputParam.message_active_till,
                    req.userIdentity.algaeh_d_app_user_id,
                    new Date(),
                    inputParam.doctor_id,
                  ],
                  printQuery: true,
                })
                .then((resultData) => {
                  req.body.doctor_name = resultData[1][0].full_name;
                  req.body.sub_department_name =
                    resultData[1][0].sub_department_name;
                  if (req.connection == null) {
                    _mysql.commitTransaction(() => {
                      _mysql.visitresult();
                      req.records = result;
                      next();
                    });
                  } else {
                    next();
                  }
                })
                .catch((e) => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            }
          })
          .catch((e) => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      };

      // if (inputParam.consultation == "Y") {
      _mysql
        .executeQuery({
          query:
            "SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));select max(visit_expiery_date) as visit_expiery_date,\
              max(episode_id) as episode_id, no_free_visit from hims_f_patient_visit V \
              inner join hims_d_visit_type VT on V.visit_type=VT.hims_d_visit_type_id and consultation='Y' where\
              patient_id=? and doctor_id=? and  hospital_id=?;",
          values: [
            inputParam.patient_id,
            inputParam.doctor_id,
            req.userIdentity.hospital_id,
          ],
          printQuery: true,
        })
        .then((expectedResult) => {
          expectedResult.shift();
          let expResult = expectedResult[0];

          console.log("1", inputParam.existing_plan);
          if (inputParam.existing_plan === "Y") {
            inputParam.visit_expiery_date = moment(
              expResult[0]["visit_expiery_date"]
            ).format("YYYY-MM-DD");
            inputParam.episode_id = expResult[0]["episode_id"];
            req.body.episode_id = inputParam.episode_id;
            internalInsertPatientVisitData();
          } else {
            console.log("2", expResult[0]);
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
            console.log("2", existingExparyDate);
            let currentEpisodeNo = null;
            if (
              existingExparyDate == null ||
              existingExparyDate == undefined ||
              existingExparyDate < today
            ) {
              _mysql
                .executeQuery({
                  query:
                    "SELECT (param_value - 1) as param_value,episode_id from algaeh_d_app_config WHERE algaeh_d_app_config_id=11 \
                        and record_status='A';",
                  printQuery: true,
                })
                .then((record) => {
                  if (record.length == 0) {
                    if (req.connection == null) {
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
                      next();
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
                        printQuery: true,
                      })
                      .then((updateResult) => {
                        internalInsertPatientVisitData();
                      })
                      .catch((e) => {
                        _mysql.rollBackTransaction(() => {
                          next(e);
                        });
                      });
                  }
                })
                .catch((e) => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            } else {
              inputParam.episode_id = expResult[0]["episode_id"];
              req.body.episode_id = inputParam.episode_id;
              internalInsertPatientVisitData();
            }
          }
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
      // } //for non consultaion
      // else if (inputParam.consultation == "N") {
      //   inputParam.visit_expiery_date = new Date();
      //   inputParam.episode_id = null;
      //   internalInsertPatientVisitData();
      // } else {
      //   if (req.options == null) {
      //     _mysql.rollBackTransaction(() => {
      //       next(
      //         utilities
      //           .httpStatus()
      //           .generateError(
      //             utilities.httpStatus().noContent,
      //             "Please select consultation type"
      //           )
      //       );
      //     });
      //   } else {
      //     req.options.onFailure(
      //       utilities
      //         .httpStatus()
      //         .generateError(
      //           httpStatus.noContent,
      //           "Please select consultation type"
      //         )
      //     );
      //   }
      // }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  addEpisodeEncounterData: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      const input = { ...req.body };
      // const utilities = new algaehUtilities();
      // if (input.consultation == "Y") {
      //utilities.logger().log("consultation: ", input);
      _mysql
        .executeQuery({
          query:
            "insert into hims_f_patient_encounter(patient_id,provider_id,visit_id,source,\
                episode_id,age,payment_type,created_date,created_by,updated_date,updated_by,hospital_id)values(\
                 ?,?,?,?,?,?,?,?,?,?,?,?) ",
          values: [
            input.patient_id,
            input.doctor_id ? input.doctor_id : input.provider_id,
            input.visit_id,
            input.source ? input.source : "0",
            input.episode_id,
            input.age ? input.age : input.age_in_years,
            input.payment_type
              ? input.payment_type
              : input.insured === "Y"
              ? "I"
              : "S",
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            req.userIdentity.hospital_id,
          ],
          printQuery: true,
        })
        .then((encounter_details) => {
          _mysql
            .executeQuery({
              query:
                "update hims_f_patient_appointment set visit_created='Y',updated_date=?, \
                  updated_by=? where record_status='A' and hims_f_patient_appointment_id=?",
              values: [
                new Date(),
                input.updated_by,
                input.hims_f_patient_appointment_id,
              ],
              printQuery: true,
            })
            .then((patAppointment) => {
              // if (req.connection == null) {
              //   _mysql.commitTransaction(() => {
              //     _mysql.releaseConnection();
              //     req.records = result;
              //     next();
              //   });
              // } else {
              //   next();
              // }
              console.log("input.age_in_years", input.age_in_years);
              let result = {
                patient_code: input.patient_code,
                receipt_number: input.receipt_number,
                bill_number: input.bill_number,
                patient_visit_id: input.visit_id,
                hims_d_patient_id: input.patient_id,
                hims_f_billing_header_id: input.hims_f_billing_header_id,
                full_name: req.full_name,
                age: input.age_in_years,
                visit_code: input.visit_code,
                ins_doctor_id: input.doctor_id,
                hospital_id: req.userIdentity.hospital_id,
                visit_date: new Date(),
                doctor_name: input.doctor_name,
                department: input.sub_department_name,
              };
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = result;
                next();
              });
            })
            .catch((e) => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
      // } else {
      //   // utilities.logger().log("Non consultation: ", input);
      //   let result = {
      //     patient_code: input.patient_code,
      //     receipt_number: input.receipt_number,
      //     bill_number: input.bill_number,
      //     patient_visit_id: input.visit_id,
      //     hims_d_patient_id: input.patient_id,
      //     hims_f_billing_header_id: input.hims_f_billing_header_id,
      //     full_name: req.full_name,
      //     arabic_name: req.pat_arabic_name,
      //   };
      //   _mysql.commitTransaction(() => {
      //     _mysql.releaseConnection();
      //     req.records = result;
      //     next();
      //   });
      // }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  addPatientInsuranceData: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let input = { ...req.body };

      // const utilities = new algaehUtilities();
      /* Select statemwnt  */
      //utilities.logger().log("addPatientInsuranceData: ");
      //utilities.logger().log("insured: ", input.insured);

      if (input.insured == "Y") {
        _mysql
          .executeQuery({
            query:
              "INSERT INTO hims_m_patient_insurance_mapping(`patient_id`,`patient_visit_id`,\
          `primary_insurance_provider_id`,`primary_sub_id`,`primary_network_id`,\
          `primary_inc_card_path`,`primary_policy_num`,`primary_effective_start_date`,\
          `primary_effective_end_date`,`primary_card_number`,`secondary_insurance_provider_id`,`secondary_sub_id`,\
          `secondary_network_id`,`secondary_effective_start_date`,`secondary_effective_end_date`,\
          `secondary_card_number`,`secondary_inc_card_path`,`secondary_policy_num`,\
          `card_holder_name`, `created_by`,`created_date`,`updated_by`,\
          `updated_date`)VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            values: [
              input.patient_id,
              input.visit_id,
              input.primary_insurance_provider_id,
              input.primary_sub_id,
              input.primary_network_id,
              input.primary_inc_card_path,
              input.primary_policy_num,
              input.primary_effective_start_date != null
                ? new Date(input.primary_effective_start_date)
                : input.primary_effective_start_date,
              input.primary_effective_end_date != null
                ? new Date(input.primary_effective_end_date)
                : input.primary_effective_end_date,
              input.primary_card_number,
              input.secondary_insurance_provider_id,
              input.secondary_sub_id,
              input.secondary_network_id,
              input.secondary_effective_start_date != null
                ? new Date(input.secondary_effective_start_date)
                : input.secondary_effective_start_date,
              input.secondary_effective_end_date != null
                ? new Date(input.secondary_effective_end_date)
                : input.secondary_effective_end_date,

              input.secondary_card_number,
              input.secondary_inc_card_path,
              input.secondary_policy_num,

              input.card_holder_name,
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
            ],
            printQuery: true,
          })
          .then((patient_insurance) => {
            if (req.connection == null) {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = patient_insurance;
                next();
              });
            } else {
              next();
            }
          })
          .catch((e) => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      } else {
        //  utilities.logger().log("insured: ", "N");
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  getProviders: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      // "SELECT E.*, E.hims_d_employee_id as employee_id ,E.services_id, SD.department_type, SD.department_id \
      // FROM hims_d_employee E \
      // left join hims_d_sub_department SD on SD.hims_d_sub_department_id = E.sub_department_id \
      // where isdoctor = 'Y' and employee_status = 'A' and E.hospital_id=?;",
      _mysql
        .executeQuery({
          query: `SELECT E.employee_code,E.full_name,E.title_id,E.arabic_name,E.employee_designation_id,E.sub_department_id, E.hims_d_employee_id as employee_id ,E.services_id, SD.department_type, SD.department_id \
            FROM hims_d_employee E \
            left join hims_d_sub_department SD on SD.hims_d_sub_department_id = E.sub_department_id \
            where isdoctor = 'Y' and employee_status = 'A' and E.hospital_id=?;`,
          values: [req.userIdentity.hospital_id],
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
};
export function getPatientDetails(req, res, next) {
  const _options = req.connection == null ? {} : req.connection;
  const _mysql = new algaehMysql(_options);
  try {
    const { patient_id } = req.body;
    _mysql
      .executeQuery({
        query: `select full_name,arabic_name from hims_f_patient where hims_d_patient_id=?`,
        values: [patient_id],
      })
      .then((result) => {
        if (result.length > 0) {
          const { full_name, arabic_name } = result[0];
          req.pat_name = full_name;
          req.pat_arabic_name = arabic_name;
        } else {
          req.pat_name = "";
          req.pat_arabic_name = "";
        }
        next();
      })
      .catch((error) => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
}
