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
let getPatientInsurance = (req, res, next) => {
  let patientInsuranceModel = {
    patient_id: null,
    patient_visit_id: null
  };

  debugFunction("getPatientInsurance");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      extend(patientInsuranceModel, req.query);

      if (req.query.patient_visit_id != null) {
        connection.query(
          "SELECT A.* ,B.* FROM \
        (select  mIns.patient_id, mIns.patient_visit_id,\
         mIns.primary_insurance_provider_id as insurance_provider_id,\
         Ins.insurance_provider_name as insurance_provider_name,\
        mIns.primary_sub_id as sub_insurance_provider_id ,\
         sIns.insurance_sub_name as sub_insurance_provider_name,\
        mIns.primary_network_id as network_id, \
         net.network_type,netoff.policy_number,netoff.hims_d_insurance_network_office_id,\
         mIns.primary_card_number as card_number,\
        mIns.primary_inc_card_path as insurance_card_path,\
        mIns.primary_effective_start_date as effective_start_date,mIns.primary_effective_end_date as effective_end_date\
        from ((((hims_d_insurance_provider Ins \
        INNER JOIN  hims_m_patient_insurance_mapping mIns ON mIns.primary_insurance_provider_id=Ins.hims_d_insurance_provider_id)\
        INNER JOIN  hims_d_insurance_sub sIns ON mIns.primary_sub_id= sIns.hims_d_insurance_sub_id) \
        INNER JOIN hims_d_insurance_network net ON mIns.primary_network_id=net.hims_d_insurance_network_id)\
        INNER JOIN hims_d_insurance_network_office netoff ON mIns.primary_policy_num=netoff.policy_number) where mIns.patient_id=?  and mIns.patient_visit_id =?\
        GROUP BY mIns.primary_policy_num)  AS A\
        ,\
         (select  mIns.secondary_insurance_provider_id , \
         Ins.insurance_provider_name as secondary_insurance_provider_name,\
         mIns.secondary_sub_id as secondary_sub_insurance_provider_id,\
         sIns.insurance_sub_name as secondary_sub_insurance_provider_name, \
         mIns.secondary_network_id ,\
         net.network_type as secondary_network_type,\
         netoff.policy_number as secondary_policy_number ,mIns.secondary_card_number,mIns.secondary_inc_card_path,\
        mIns.secondary_effective_start_date,mIns.secondary_effective_end_date from ((((\
        hims_d_insurance_provider Ins \
        INNER JOIN  hims_m_patient_insurance_mapping mIns ON mIns.secondary_insurance_provider_id=Ins.hims_d_insurance_provider_id)\
         INNER JOIN  hims_d_insurance_sub sIns ON mIns.secondary_sub_id= sIns.hims_d_insurance_sub_id) \
         INNER JOIN hims_d_insurance_network net ON mIns.secondary_network_id=net.hims_d_insurance_network_id)\
         INNER JOIN hims_d_insurance_network_office netoff ON mIns.secondary_policy_num=netoff.policy_number) where mIns.patient_id=? and mIns.patient_visit_id =?\
         GROUP BY mIns.secondary_policy_num) AS B  ;",

          [
            patientInsuranceModel.patient_id,
            patientInsuranceModel.patient_visit_id,
            patientInsuranceModel.patient_id,
            patientInsuranceModel.patient_visit_id
          ],
          (error, result) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            req.records = result;

            next();
          }
        );
      } else {
        connection.query(
          "(select  mIns.patient_id,mIns.primary_insurance_provider_id as insurance_provider_id,Ins.insurance_provider_name,\
          mIns.primary_sub_id as sub_insurance_provider_id, sIns.insurance_sub_name as sub_insurance_provider_name,\
          mIns.primary_network_id as network_id,  net.network_type,netoff.policy_number,netoff.hims_d_insurance_network_office_id,mIns.primary_card_number as card_number,\
          mIns.primary_inc_card_path as insurance_card_path,\
         mIns.primary_effective_start_date as effective_start_date,mIns.primary_effective_end_date as effective_end_date  from ((((\
          hims_d_insurance_provider Ins \
          INNER JOIN  hims_m_patient_insurance_mapping mIns ON mIns.primary_insurance_provider_id=Ins.hims_d_insurance_provider_id)\
           INNER JOIN  hims_d_insurance_sub sIns ON mIns.primary_sub_id= sIns.hims_d_insurance_sub_id) \
           INNER JOIN hims_d_insurance_network net ON mIns.primary_network_id=net.hims_d_insurance_network_id)\
           INNER JOIN hims_d_insurance_network_office netoff ON mIns.primary_policy_num=netoff.policy_number) where mIns.patient_id=?\
           GROUP BY mIns.primary_policy_num)\
           union\
           (select  mIns.patient_id,mIns.secondary_insurance_provider_id , Ins.insurance_provider_name,\
            mIns.secondary_sub_id,sIns.insurance_sub_name, \
            mIns.secondary_network_id, net.network_type,netoff.policy_number,netoff.hims_d_insurance_network_office_id,mIns.secondary_card_number,mIns.secondary_inc_card_path,\
           mIns.secondary_effective_start_date,mIns.secondary_effective_end_date from ((((\
          hims_d_insurance_provider Ins \
          INNER JOIN  hims_m_patient_insurance_mapping mIns ON mIns.secondary_insurance_provider_id=Ins.hims_d_insurance_provider_id)\
           INNER JOIN  hims_d_insurance_sub sIns ON mIns.secondary_sub_id= sIns.hims_d_insurance_sub_id) \
           INNER JOIN hims_d_insurance_network net ON mIns.secondary_network_id=net.hims_d_insurance_network_id)\
           INNER JOIN hims_d_insurance_network_office netoff ON mIns.secondary_policy_num=netoff.policy_number) where mIns.patient_id=?\
           GROUP BY mIns.secondary_policy_num);",

          [patientInsuranceModel.patient_id, patientInsuranceModel.patient_id],
          (error, result) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            req.records = result;

            next();
          }
        );
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add(save) patient insurence  details to DB
let addPatientInsurance = (connection, req, res, next) => {
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
    primary_card_number: null,
    secondary_insurance_provider_id: null,
    secondary_sub_id: null,
    secondary_network_id: null,
    secondary_effective_start_date: null,
    secondary_effective_end_date: null,
    secondary_card_number: null,
    secondary_inc_card_path: null,
    secondary_policy_num: null,
    created_by: null,
    created_date: null,
    updated_by: null,
    updated_date: null,
    record_status: null
  };
  debugFunction("addPatientInsurence");
  try {
    if (connection == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    let input = extend(patientInsuranceMappingModel, req.body);

    connection.query(
      "INSERT INTO hims_m_patient_insurance_mapping(`patient_id`,`patient_visit_id`,\
                `primary_insurance_provider_id`,`primary_sub_id`,`primary_network_id`,\
                `primary_inc_card_path`,`primary_policy_num`,`primary_effective_start_date`,\
                `primary_effective_end_date`,`primary_card_number`,`secondary_insurance_provider_id`,`secondary_sub_id`,\
                `secondary_network_id`,`secondary_effective_start_date`,`secondary_effective_end_date`,\
                `secondary_card_number`,`secondary_inc_card_path`,`secondary_policy_num`,`created_by`,`created_date`,`updated_by`,\
                `updated_date`)VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
        input.primary_card_number,
        input.secondary_insurance_provider_id,
        input.secondary_sub_id,
        input.secondary_network_id,
        input.secondary_effective_start_date,
        input.secondary_effective_end_date,
        input.secondary_card_number,
        input.secondary_inc_card_path,
        input.secondary_policy_num,
        input.created_by,
        new Date(),
        input.updated_by,
        new Date()
      ],
      (error, resdata) => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }
        req.records = resdata;
        next();
      }
    );
  } catch (e) {
    next(e);
  }
};

//created by:irfan,to get list of all insurence providers
let getListOfInsuranceProvider = (req, res, next) => {
  let patientInsuranceModel = {
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
      extend(patientInsuranceModel, req.query);

      connection.query(
        "select insurance_type,insurance_provider_name,insurance_provider_code,\
        currency,effective_start_date,effective_end_date from hims_d_insurance_provider where record_status='A'",

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

//created by irfan: to add new insurence provider
let addInsuranceProvider = (req, res, next) => {
  let insuranceProviderModel = {
    hims_d_insurance_provider_id: null,
    insurance_provider_code: null,
    insurance_provider_name: null,
    deductible_proc: null,
    deductible_lab: null,
    co_payment: null,
    insurance_type: null,
    package_claim: null,
    hospital_id: null,
    credit_period: null,
    insurance_limit: null,
    payment_type: null,
    insurance_remarks: null,
    cpt_mandate: null,
    child_id: null,
    currency: null,
    preapp_valid_days: null,
    claim_submit_days: null,
    lab_result_check: null,
    resubmit_all: null,
    ins_rej_per: null,
    effective_start_date: null,
    effective_end_date: null,
    created_date: null,
    created_by: null,
    updated_date: null,
    updated_by: null
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputparam = extend(insuranceProviderModel, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO hims_d_insurance_provider(`insurance_provider_code`,`insurance_provider_name`,\
        `deductible_proc`,`deductible_lab`,`co_payment`,`insurance_type`,`package_claim`,`hospital_id`,\
        `credit_period`,`insurance_limit`,`payment_type`,`insurance_remarks`,`cpt_mandate`,`child_id`,`currency`,\
        `preapp_valid_days`,`claim_submit_days`,`lab_result_check`,`resubmit_all`,`ins_rej_per`,`effective_start_date`,\
        `effective_end_date`,`created_date`,`created_by`,`updated_date`,`updated_by`)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          inputparam.insurance_provider_code,
          inputparam.insurance_provider_name,
          inputparam.deductible_proc,
          inputparam.deductible_lab,
          inputparam.co_payment,
          inputparam.insurance_type,
          inputparam.package_claim,
          inputparam.hospital_id,
          inputparam.credit_period,
          inputparam.insurance_limit,
          inputparam.payment_type,
          inputparam.insurance_remarks,
          inputparam.cpt_mandate,
          inputparam.child_id,
          inputparam.currency,
          inputparam.preapp_valid_days,
          inputparam.claim_submit_days,
          inputparam.lab_result_check,
          inputparam.resubmit_all,
          inputparam.ins_rej_per,
          inputparam.effective_start_date,
          inputparam.effective_end_date,
          new Date(),
          inputparam.created_by,
          new Date(),
          inputparam.updated_by
        ],
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

//created by irfan: to add SUB-insurence provider
let addSubInsuranceProvider = (req, res, next) => {
  let insuranceSubProviderModel = {
    hims_d_insurance_sub_id: null,
    insurance_sub_code: null,
    insurance_sub_name: null,
    insurance_provider_id: null,
    card_format: null,
    transaction_number: null,
    effective_start_date: null,
    effective_end_date: null,
    created_date: null,
    created_by: null,
    updated_date: null,
    updated_by: null
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let subInsurance = extend(insuranceSubProviderModel, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO hims_d_insurance_sub(`insurance_sub_code`,`insurance_sub_name`,`insurance_provider_id`,\
        `card_format`,`transaction_number`,`effective_start_date`,`effective_end_date`,\
        `created_date`,`created_by`,`updated_date`,`updated_by`)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?)",
        [
          subInsurance.insurance_sub_code,
          subInsurance.insurance_sub_name,
          subInsurance.insurance_provider_id,
          subInsurance.card_format,
          subInsurance.transaction_number,
          subInsurance.effective_start_date,
          subInsurance.effective_end_date,
          new Date(),
          subInsurance.created_by,
          new Date(),
          subInsurance.updated_by
        ],
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

//created by irfan: to add network(insurence plan)
let addNetwork = (req, res, next) => {
  let NetworkModel = {
    hims_d_insurance_network_id: null,
    network_type: null,
    insurance_provider_id: null,
    insurance_sub_id: null,
    effective_start_date: null,
    effective_end_date: null,
    sub_insurance_status: null,
    created_date: null,
    created_by: null,
    updated_date: null,
    updated_by: null
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputparam = extend(NetworkModel, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO hims_d_insurance_network(`network_type`,`insurance_provider_id`,`insurance_sub_id`,\
        `effective_start_date`,`effective_end_date`, `sub_insurance_status`,`created_date`,`created_by`,\
        `updated_date`,`updated_by`)\
        VALUE(?,?,?,?,?,?,?,?,?,?)",
        [
          inputparam.network_type,
          inputparam.insurance_provider_id,
          inputparam.insurance_sub_id,
          inputparam.effective_start_date,
          inputparam.effective_end_date,
          inputparam.sub_insurance_status,
          new Date(),
          inputparam.created_by,
          new Date(),
          inputparam.updated_by,
          inputparam.record_status
        ],
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

//created by irfan: to add networkoffice(policy)
let NetworkOfficeMaster = (req, res, next) => {
  let NetworkOfficeModel = {
    hims_d_insurance_network_office_id: null,
    network_id: null,
    hospital_id: null,
    deductible: null,
    deductable_type: null,
    min_value: null,
    max_value: null,
    copay_consultation: null,
    deductible_lab: null,
    for_alllab: null,
    copay_percent: null,
    deductible_rad: null,
    for_allrad: null,
    copay_percent_rad: null,
    copay_percent_trt: null,
    copay_percent_dental: null,
    copay_medicine: null,
    insur_network_limit: null,
    deductible_trt: null,
    deductible_dental: null,
    deductible_medicine: null,
    lab_min: null,
    lab_max: null,
    rad_min: null,
    rad_max: null,
    trt_max: null,
    trt_min: null,
    dental_min: null,
    dental_max: null,
    medicine_min: null,
    medicine_max: null,
    invoice_max_liability: null,
    for_alltrt: null,
    for_alldental: null,
    for_allmedicine: null,
    invoice_max_deduct: null,
    price_from: null,
    employer: null,
    policy_number: null,
    follow_up: null,
    preapp_limit: null,
    deductible_ip: null,
    copay_ip: null,
    ip_min: null,
    ip_max: null,
    for_allip: null,
    consult_limit: null,
    preapp_limit_from: null,
    copay_maternity: null,
    maternity_min: null,
    maternity_max: null,
    copay_optical: null,
    optical_min: null,
    optical_max: null,
    copay_diagnostic: null,
    diagnostic_min: null,
    diagnostic_max: null,
    created_date: null,
    created_by: null,
    updated_date: null,
    updated_by: null
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputparam = extend(NetworkOfficeModel, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO hims_d_insurance_network_office(`network_id`,`hospital_id`,`deductible`,`deductable_type`,`min_value`,`max_value`,`copay_consultation`,\
        `deductible_lab`,`for_alllab`,`copay_percent`,`deductible_rad`,`for_allrad`,`copay_percent_rad`,`copay_percent_trt`,\
        `copay_percent_dental`,`copay_medicine`,`insur_network_limit`,`deductible_trt`,`deductible_dental`,`deductible_medicine`,`lab_min`,\
        `lab_max`,`rad_min`,`rad_max`,`trt_max`,`trt_min`,`dental_min`,`dental_max`,`medicine_min`,`medicine_max`,`invoice_max_liability`,\
        `for_alltrt`,`for_alldental`,`for_allmedicine`,`invoice_max_deduct`,`price_from`,`employer`,`policy_number`,`follow_up`,`preapp_limit`,\
        `deductible_ip`,`copay_ip`,`ip_min`,`ip_max`,`for_allip`,`consult_limit`,`preapp_limit_from`,`copay_maternity`,`maternity_min`,`maternity_max`,\
        `copay_optical`,`optical_min`,`optical_max`,`copay_diagnostic`,`diagnostic_min`,`diagnostic_max`,`created_date`,`created_by`,`updated_date`,`updated_by`)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          inputparam.network_id,
          inputparam.hospital_id,
          inputparam.deductible,
          inputparam.deductable_type,
          inputparam.min_value,
          inputparam.max_value,
          inputparam.copay_consultation,
          inputparam.deductible_lab,
          inputparam.for_alllab,
          inputparam.copay_percent,
          inputparam.deductible_rad,
          inputparam.for_allrad,
          inputparam.copay_percent_rad,
          inputparam.copay_percent_trt,
          inputparam.copay_percent_dental,
          inputparam.copay_medicine,
          inputparam.insur_network_limit,
          inputparam.deductible_trt,
          inputparam.deductible_dental,
          inputparam.deductible_medicine,
          inputparam.lab_min,
          inputparam.lab_max,
          inputparam.rad_min,
          inputparam.rad_max,
          inputparam.trt_max,
          inputparam.trt_min,
          inputparam.dental_min,
          inputparam.dental_max,
          inputparam.medicine_min,
          inputparam.medicine_max,
          inputparam.invoice_max_liability,
          inputparam.for_alltrt,
          inputparam.for_alldental,
          inputparam.for_allmedicine,
          inputparam.invoice_max_deduct,
          inputparam.price_from,
          inputparam.employer,
          inputparam.policy_number,
          inputparam.follow_up,
          inputparam.preapp_limit,
          inputparam.deductible_ip,
          inputparam.copay_ip,
          inputparam.ip_min,
          inputparam.ip_max,
          inputparam.for_allip,
          inputparam.consult_limit,
          inputparam.preapp_limit_from,
          inputparam.copay_maternity,
          inputparam.maternity_min,
          inputparam.maternity_max,
          inputparam.copay_optical,
          inputparam.optical_min,
          inputparam.optical_max,
          inputparam.copay_diagnostic,
          inputparam.diagnostic_min,
          inputparam.diagnostic_max,
          new Date(),
          inputparam.created_by,
          new Date(),
          inputparam.updated_by
        ],
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
  getPatientInsurance,
  addPatientInsurance,
  getListOfInsuranceProvider,
  addInsuranceProvider,
  addSubInsuranceProvider,
  addNetwork,
  NetworkOfficeMaster
};
