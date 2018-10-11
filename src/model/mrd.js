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
        contact_number,nationality_id ,N.nationality,secondary_contact_number,email,emergency_contact_name,emergency_contact_number,\
        relationship_with_patient,postal_code,\
        primary_identity_id,DOC.identity_document_name as primary_document_name,\
        primary_id_no,secondary_id_no,photo_file,primary_id_file,\
        secondary_id_file,advance_amount,patient_type,vat_applicable\
        from hims_f_patient P, hims_d_nationality N,hims_d_identity_document DOC\
        where P.record_status='A' and N.record_status='A' and DOC.record_status='A' and\
        P.nationality_id=N.hims_d_nationality_id and P.primary_identity_id=DOC.hims_d_identity_document_id  " +
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

//created by irfan: to get Patient Encounter Details
let getPatientEncounterDetails = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_patient_encounter_id, PE.patient_id,P.full_name,PE.provider_id,E.full_name as provider_name, visit_id,V.insured,\
        V.sub_department_id,\
        SD.sub_department_name,PE.episode_id,PE.encounter_id,PE.updated_date as encountered_date\
        from hims_f_patient_encounter PE,hims_f_patient P,hims_d_employee E,hims_f_patient_visit V,hims_d_sub_department SD\
        where PE.record_status='A' and P.record_status='A' and E.record_status='A' and V.record_status='A' and SD.record_status='A'\
         and PE.patient_id=P.hims_d_patient_id and E.hims_d_employee_id=PE.provider_id\
         and V.hims_f_patient_visit_id=PE.visit_id and V.sub_department_id=SD.hims_d_sub_department_id and\
         encounter_id <>'null' and PE.patient_id=?\
         order by encountered_date desc;",
        [req.query.patient_id],
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

//created by irfan: to get Patient Chief Complaint
let getPatientChiefComplaint = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_episode_chief_complaint_id ,episode_id,chief_complaint_id,HH.hpi_description as chief_complaint\
        from hims_f_episode_chief_complaint ECC,hims_d_hpi_header HH\
        Where ECC.record_status='A' and HH.record_status='A' \
        and ECC.chief_complaint_id=HH.hims_d_hpi_header_id and episode_id=?",
        [req.query.episode_id],
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

//created by irfan: to  get Patient Diagnosis
let getPatientDiagnosis = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_patient_diagnosis_id, patient_id, episode_id, daignosis_id,ICD.icd_code as daignosis_code,\
        ICD.icd_description as daignosis_description  ,diagnosis_type, final_daignosis,\
        PD.created_date as diagnosis_date  from hims_f_patient_diagnosis PD,hims_d_icd ICD\
         where PD.record_status='A' and   ICD.record_status='A'\
         and PD.daignosis_id=ICD.hims_d_icd_id and  PD.episode_id=? order by diagnosis_date desc",
        [req.query.episode_id],
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

//created by irfan: to  get Patient medication
let getPatientMedication = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_prescription_id, patient_id, encounter_id, provider_id, episode_id,\
        prescription_date, prescription_status , \
        hims_f_prescription_detail_id, prescription_id, item_id,IM.item_description, PD.generic_id, IG.generic_name, \
        dosage, frequency, no_of_days,\
        dispense, frequency_type, frequency_time, start_date, PD.service_id, uom_id, item_category_id, PD.item_status\
         from hims_f_prescription P,hims_f_prescription_detail PD,hims_d_item_master IM,hims_d_item_generic IG\
        where P.record_status='A' and IM.record_status='A' and IG.record_status='A' and \
        P.hims_f_prescription_id=PD.prescription_id and PD.item_id=IM.hims_d_item_master_id \
        and PD.generic_id =IG.hims_d_item_generic_id and\
        P.encounter_id=?",
        [req.query.encounter_id],
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

//created by irfan: to  get Patient Investigation
let getPatientInvestigation = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_ordered_services_id, patient_id, visit_id, doctor_id ,services_id,S.service_name \
        from hims_f_ordered_services OS , hims_d_services S  where \
        OS.record_status='A' and S.record_status='A' and \
        OS.services_id=S.hims_d_services_id and visit_id=?",
        [req.query.visit_id],
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

module.exports = {
  getPatientMrdList,
  getPatientEncounterDetails,
  getPatientChiefComplaint,
  getPatientDiagnosis,
  getPatientMedication,
  getPatientInvestigation
};
