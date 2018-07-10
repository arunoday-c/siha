"use strict";
import extend from "extend";
import {
  selectStatement,
  paging,
  whereCondition,
  deleteRecord,
  releaseDBConnection
} from "../utils";
import httpStatus from "../utils/httpStatus";
//import { LINQ } from "node-linq";

import { logger, debugFunction, debugLog } from "../utils/logging";

//created by:irfan,to get patient insurence details by patient id
let getPatientInsurence = (req, res, next) => {
  let patientInsurenceModel = {
    patient_id: null
  };

  debugFunction("getPatientInsurence");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      extend(patientInsurenceModel, req.query);

      connection.query(
        "select  mIns.patient_id,  Ins.insurance_provider_name, sIns.insurance_sub_name,\
          net.network_type,netoff.policy_number,mIns.primary_effective_start_date,\
          mIns.primary_effective_end_date,mIns.primary_inc_card_path         \
          from  hims_m_patient_insurance_mapping mIns,hims_d_insurance_provider Ins,\
         hims_d_insurance_sub sIns ,hims_d_insurance_network net ,\
         hims_d_insurance_network_office netoff where\
          mIns.`patient_id`=? and (Ins.hims_d_insurance_provider_id = mIns.primary_insurance_provider_id\
           or Ins.hims_d_insurance_provider_id = mIns.secondary_insurance_provider_id)\
           and Ins.hims_d_insurance_provider_id = sIns.insurance_provider_id\
           and net.insurance_provider_id= Ins.hims_d_insurance_provider_id\
           and netoff.network_id = net.hims_d_insurance_network_id\
           group by hims_d_insurance_provider_id",

        [patientInsurenceModel.patient_id],
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

//created by irfan: to add(save) patient insurence  details to DB
let addPatientInsurence = (req, res, next) => {
  let patientInsuranceMappingModel = {
    hims_f_patient_insurance_mapping_id: null,
    patient_id: null,
    patient_visit_id: null,
    primary_insurance_provider_id: null,
    primary_sub_id: null,
    primary_network_id: null,
    primary_inc_card_path: null,
    primary_policy_num: null,
    primary_effective_start_date: null,
    primary_effective_end_date: null,
    secondary_insurance_provider_id: null,
    secondary_sub_id: null,
    secondary_network_id: null,
    secondary_effective_start_date: null,
    secondary_effective_end_date: null,
    secondary_inc_card_path: null,
    secondary_policy_num: null,
    created_by: null,
    created_date: null,
    updated_by: null,
    updated_date: null,
    record_status: null
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend(patientInsuranceMappingModel, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO hims_m_patient_insurance_mapping(`patient_id`,`patient_visit_id`,\
                `primary_insurance_provider_id`,`primary_sub_id`,`primary_network_id`,\
                `primary_inc_card_path`,`primary_policy_num`,`primary_effective_start_date`,\
                `primary_effective_end_date`,`secondary_insurance_provider_id`,`secondary_sub_id`,\
                `secondary_network_id`,`secondary_effective_start_date`,`secondary_effective_end_date`,\
                `secondary_inc_card_path`,`secondary_policy_num`,`created_by`,`created_date`,`updated_by`,\
                `updated_date`,`record_status`)VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          input.patient_id,
          input.patient_visit_id,
          input.primary_insurance_provider_id,
          input.primary_sub_id,
          input.primary_network_id,
          input.primary_inc_card_path,
          input.primary_policy_num,
          input.primary_effective_start_date,
          input.primary_effective_end_date,
          input.secondary_insurance_provider_id,
          input.secondary_sub_id,
          input.secondary_network_id,
          input.secondary_effective_start_date,
          input.secondary_effective_end_date,
          input.secondary_inc_card_path,
          input.secondary_policy_num,
          input.created_by,
          new Date(),
          input.updated_by,
          new Date(),
          input.record_status
        ],
        (error, resdata) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = resdata;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by:irfan,to get patient insurence details by patient id
let getListOfInsurenceProvider = (req, res, next) => {
  let patientInsurenceModel = {
    patient_id: null
  };

  debugFunction("getListOfInsurenceProvider");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      extend(patientInsurenceModel, req.query);

      connection.query(
        "select insurance_type,insurance_provider_name,insurance_provider_code,\
        currency,effective_start_date,effective_end_date,record_status from hims_d_insurance_provider",

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
  getPatientInsurence,
  addPatientInsurence,
  getListOfInsurenceProvider
};
