"use strict";
import extend from "extend";
import {
  selectStatement,
  whereCondition,
  deleteRecord,
  releaseDBConnection,
  jsonArrayToObject
} from "../../utils";
import httpStatus from "../../utils/httpStatus";
import { LINQ } from "node-linq";

import { debugLog } from "../../utils/logging";
import moment from "moment";

//created by irfan: to get eployee basic details
let getEmployeeBasicDetails = (req, res, next) => {
  let employeeWhereCondition = {
    employee_code: "ALL",
    sex: "ALL",
    blood_group: "ALL",
    employee_status: "ALL",
    date_of_joining: "ALL",
    date_of_resignation: "ALL",
    primary_contact_no: "ALL",
    email: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(employeeWhereCondition, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "SELECT E.hims_d_employee_id,E.employee_code,E.title_id,E.full_name,E.arabic_name,E.employee_designation_id,\
        E.license_number,E.sex,E.date_of_birth,E.date_of_joining,E.date_of_resignation,E.present_address,E.present_address2,\
        E.present_pincode,E.present_pincode,E.present_state_id,E.present_country_id,\
        E.permanent_address , E.permanent_address2, E.permanent_pincode, E.permanent_city_id, E.permanent_state_id,\
        E.permanent_country_id, E.primary_contact_no, E.secondary_contact_no,E.email,\
        E.emergency_contact_person,E.emergency_contact_no,E.blood_group,\
        E.isdoctor,E.employee_status,E.exclude_machine_data ,E.company_bank_id ,E.employee_bank_name , E.effective_start_date,E.effective_end_date,\
        E.employee_bank_ifsc_code , E.employee_account_number, E.mode_of_payment, E.accomodation_provided,\
         E.late_coming_rule, E.leave_salary_process, E.entitled_daily_ot, E.suspend_salary, E.gratuity_applicable, E.contract_type, E.employee_group_id,\
         E.weekoff_from,E.overtime_group_id, E.reporting_to_id, E.hospital_id,\
        ED.hims_d_employee_department_id,ED.employee_id,ED.sub_department_id,ED.category_speciality_id,ED.user_id,\
         ED.services_id,CS.hims_m_category_speciality_mappings_id,CS.category_id,CS.speciality_id,\
        CS.category_speciality_status,CS.effective_start_date,CS.effective_end_date\
        from hims_d_employee E,hims_m_employee_department_mappings ED,hims_m_category_speciality_mappings CS\
         Where E.record_status='A' and ED.record_status='A' and CS.record_status='A' and E.hims_d_employee_id=ED.employee_id\
          and ED.category_speciality_id=CS.hims_m_category_speciality_mappings_id AND " +
          where.condition +
          "order by E.hims_d_employee_id desc ",
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

module.exports = {};
