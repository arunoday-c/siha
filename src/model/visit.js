import extend from "extend";
import httpStatus from "../utils/httpStatus";
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
  message_active_till: null
};
let addVisit = (req, res, next) => {
  try {
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
      });
    });
  } catch (e) {
    next(e);
  }
};
let insertVisitData = (dataBase, req, res, callBack) => {
  try {
    let inputParam = extend(visitDetails, req.body);

    dataBase.query(
      "INSERT INTO `hims_f_patient_visit` (`patient_id`, `visit_type`, \
        `visit_date`, `department_id`, `sub_department_id`, `doctor_id`, `maternity_patient`,\
         `is_mlc`, `mlc_accident_reg_no`, `mlc_police_station`, `mlc_wound_certified_date`, \
         `created_by`, `created_date`,`visit_code`)\
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);",
      [
        inputParam.patient_id,
        inputParam.visit_type,
        inputParam.visit_date,
        inputParam.department_id,
        inputParam.sub_department_id,
        inputParam.doctor_id,
        inputParam.maternity_patient,
        inputParam.is_mlc,
        inputParam.mlc_accident_reg_no,
        inputParam.mlc_police_station,
        null, //inputParam.mlc_wound_certified_date
        inputParam.created_by,
        new Date(),
        inputParam.visit_code
      ],
      (error, result) => {
        if (error) {
          dataBase.rollback(() => {
            dataBase.release();
            next(error);
          });
        }
        let patient_visit_id = result.insertId;
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
              callBack(error, resultData);
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
module.exports = {
  addVisit,
  updateVisit,
  insertVisitData
};
