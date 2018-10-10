"use strict";
import extend from "extend";
import {
  selectStatement,
  paging,
  whereCondition,
  deleteRecord,
  bulkInputArrayObject,
  releaseDBConnection,
  jsonArrayToObject
} from "../utils";
import moment from "moment";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import { logger, debugFunction, debugLog } from "../utils/logging";

//

//created by irfan: to get Patient Mrd List
let getPatientMrdList = (req, res, next) => {
  let selectWhere = {
    patient_code: "ALL",
    registration_date: "ALL",
    arabic_name: "ALL",
    date_of_birth: "ALL",
    contact_number: "ALL",
    hims_d_patient_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let patientNmae = "";
    if (req.query.full_name != "null" && req.query.full_name != null) {
      patientNmae = `and full_name like '%${req.query.full_name}%'`;
    }
    delete req.query.full_name;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_patient_id,patient_code,registration_date,first_name,middle_name,\
        last_name,full_name,arabic_name,gender,date_of_birth,age,marital_status,\
        contact_number,secondary_contact_number,email,emergency_contact_name,emergency_contact_number,\
        relationship_with_patient,postal_code,\
        primary_id_no,secondary_identity_id,secondary_id_no,photo_file,primary_id_file,\
        secondary_id_file,advance_amount,patient_type,vat_applicable from hims_f_patient where record_status='A' " +
          patientNmae +
          " AND " +
          where.condition,
        where.values,
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
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

module.exports = { getPatientMrdList };
