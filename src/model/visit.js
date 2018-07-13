import extend from "extend";
import httpStatus from "../utils/httpStatus";
import { debugLog, debugFunction, logger } from "../utils/logging";
import { whereCondition, runningNumber, releaseDBConnection } from "../utils";
import moment from "moment";

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
                next(error);
              });
            }
            connection.commit(error => {
              if (error) {
                connection.rollback(() => {
                  next(error);
                });
              }
              req.records = result;
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
                      next(error);
                    });
                  }
                  connection.commit(error => {
                    if (error) {
                      connection.rollback(() => {
                        next(error);
                      });
                    }
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

let insertVisitData = (dataBase, req, res, callBack) => {
  let visitDetails = {
    hims_f_patient_visit_id: null,
    patient_id: null,
    visit_type: null,
    visit_date: null,
    visit_code: null,
    age_in_years: null,
    age_in_months: null,
    age_in_days: null,
    insured: null,
    department_id: null,
    sub_department_id: null,
    doctor_id: null,
    maternity_patient: null,
    is_mlc: null,
    mlc_accident_reg_no: null,
    mlc_police_station: null,
    mlc_wound_certified_date: null,
    created_by: null,
    created_date: null,
    updated_by: null,
    updated_date: null,
    record_status: null,
    patient_message: null,
    is_critical_message: null,
    message_active_till: null,
    visit_expiery_date: null
  };
  try {
    debugFunction("insertVisitData");
    let inputParam = extend(
      visitDetails,
      req.query["data"] == null ? req.body : req.query
    );

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
        inputParam.visit_expiery_date = moment(inputParam.visit_date).add(
          record != null && record.length != 0
            ? parseInt(record[0]["param_value"])
            : 0,
          "days"
        )._d;
        dataBase.query(
          "INSERT INTO `hims_f_patient_visit` (`patient_id`, `visit_type`, \
          `age_in_years`, `age_in_months`, `age_in_days`, `insured`,\
        `visit_date`, `department_id`, `sub_department_id`, `doctor_id`, `maternity_patient`,\
         `is_mlc`, `mlc_accident_reg_no`, `mlc_police_station`, `mlc_wound_certified_date`, \
         `created_by`, `created_date`,`visit_code`,`visit_expiery_date`)\
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          [
            inputParam.patient_id,
            inputParam.visit_type,
            inputParam.age_in_years,
            inputParam.age_in_months,
            inputParam.age_in_days,
            inputParam.insured,
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
            inputParam.visit_expiery_date
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
    );
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
    created_by: null,
    created_date: null,
    updated_by: null,
    updated_date: null,
    record_status: null,
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

module.exports = {
  addVisit,
  updateVisit,
  insertVisitData,
  checkVisitExists
};
