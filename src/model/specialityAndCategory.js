"use strict";
import extend from "extend";
import {
  whereCondition,
  deleteRecord,
  releaseDBConnection,
  jsonArrayToObject
} from "../utils";
//import moment from "moment";
import httpStatus from "../utils/httpStatus";
//import { LINQ } from "node-linq";
import { debugLog } from "../utils/logging";

//created by irfan: to add addSpecialityMaster
let addEmployeeSpecialityMaster = (req, res, next) => {
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
        "INSERT INTO `hims_d_employee_speciality` (sub_department_id, speciality_code, speciality_name, speciality_desc  ,created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?)",
        [
          input.sub_department_id,
          input.speciality_code,
          input.speciality_name,
          input.speciality_desc,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
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

//created by irfan: to get SpecialityMaster
let getEmployeeSpecialityMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    //et where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_employee_speciality_id, sub_department_id, speciality_code,\
        speciality_name, speciality_desc from hims_d_employee_speciality where record_status='A'  order by hims_d_employee_speciality_id desc",
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

//created by irfan: to add
let addEmployeeCategoryMaster = (req, res, next) => {
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
        "INSERT INTO `hims_d_employee_category` (employee_category_code, employee_category_name, employee_category_desc, employee_category_status, \
            effective_start_date, effective_end_date,  created_date, created_by, updated_date, updated_by)\
              VALUE(?,?,?,?,?,?,?,?,?,?)",
        [
          input.employee_category_code,
          input.employee_category_name,
          input.employee_category_desc,
          input.employee_category_status,
          input.effective_start_date,
          input.effective_end_date,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
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

//created by irfan: to get
let getEmployeeCategoryMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_employee_category_id, employee_category_code, employee_category_name, employee_category_desc, employee_category_status, \
          effective_start_date, effective_end_date from hims_d_employee_category where record_status='A' order by hims_employee_category_id desc",
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
  addEmployeeSpecialityMaster,
  getEmployeeSpecialityMaster,
  addEmployeeCategoryMaster,
  getEmployeeCategoryMaster
};
