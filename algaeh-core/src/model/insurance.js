"use strict";
import extend from "extend";
import utils from "../utils";
import moment from "moment";
import httpStatus from "../utils/httpStatus";
import logUtils from "../utils/logging";
import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");

const { debugFunction, debugLog } = logUtils;
const { whereCondition, releaseDBConnection, jsonArrayToObject } = utils;

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
        (select mIns.patient_id as pri_patient_id, mIns.patient_visit_id as pri_patient_visit_id,\
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
        left join\
        (select  mIns.patient_id as sec_patient_id , mIns.patient_visit_id  as sec_patient_visit_id, mIns.secondary_insurance_provider_id , \
         Ins.insurance_provider_name as secondary_insurance_provider_name,\
         mIns.secondary_sub_id as secondary_sub_insurance_provider_id,\
         sIns.insurance_sub_name as secondary_sub_insurance_provider_name, \
         mIns.secondary_network_id ,\
         net.network_type as secondary_network_type,\
         netoff.policy_number as secondary_policy_number,netoff.hims_d_insurance_network_office_id as secondary_network_office_id ,mIns.secondary_card_number,mIns.secondary_inc_card_path,\
        mIns.secondary_effective_start_date,mIns.secondary_effective_end_date from ((((\
        hims_d_insurance_provider Ins \
        INNER JOIN  hims_m_patient_insurance_mapping mIns ON mIns.secondary_insurance_provider_id=Ins.hims_d_insurance_provider_id)\
         INNER JOIN  hims_d_insurance_sub sIns ON mIns.secondary_sub_id= sIns.hims_d_insurance_sub_id) \
         INNER JOIN hims_d_insurance_network net ON mIns.secondary_network_id=net.hims_d_insurance_network_id)\
         INNER JOIN hims_d_insurance_network_office netoff ON mIns.secondary_policy_num=netoff.policy_number) where mIns.patient_id=? and mIns.patient_visit_id =?\
         GROUP BY mIns.secondary_policy_num) AS B  on A.pri_patient_id=B.sec_patient_id ;",
          [
            patientInsuranceModel.patient_id,
            patientInsuranceModel.patient_visit_id,
            patientInsuranceModel.patient_id,
            patientInsuranceModel.patient_visit_id
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
            mIns.secondary_network_id, net.network_type,netoff.policy_number,netoff.hims_d_insurance_network_office_id as\
             secondary_network_office_id,mIns.secondary_card_number,mIns.secondary_inc_card_path,\
           mIns.secondary_effective_start_date,mIns.secondary_effective_end_date from ((((\
          hims_d_insurance_provider Ins \
          INNER JOIN  hims_m_patient_insurance_mapping mIns ON mIns.secondary_insurance_provider_id=Ins.hims_d_insurance_provider_id)\
           INNER JOIN  hims_d_insurance_sub sIns ON mIns.secondary_sub_id= sIns.hims_d_insurance_sub_id) \
           INNER JOIN hims_d_insurance_network net ON mIns.secondary_network_id=net.hims_d_insurance_network_id)\
           INNER JOIN hims_d_insurance_network_office netoff ON mIns.secondary_policy_num=netoff.policy_number) where mIns.patient_id=?\
           GROUP BY mIns.secondary_policy_num);",

          [patientInsuranceModel.patient_id, patientInsuranceModel.patient_id],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
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

//Addded by noor code modification
let addPatientInsuranceData = (req, res, next) => {
  try {
    let db = req.options == null ? req.db : req.options.db;
    debugLog("Body: ", req.body);

    // let x = req.db;
    // let y = req.options;
    // debugLog("reg DB", x);
    // debugLog("reg Options", y);
    // debugLog("DB", JSON.stringify(db));
    let input = extend(
      {
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
        created_by: req.userIdentity.algaeh_d_app_user_id,

        updated_by: req.userIdentity.algaeh_d_app_user_id
      },
      req.body
    );

    debugLog("Input: ", input);

    db.query(
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
        input.created_by,
        new Date(),
        input.updated_by,
        new Date()
      ],
      (error, resdata) => {
        debugLog("Result: ", resdata);
        if (error) {
          if (req.options == null) {
            db.rollback(() => {
              releaseDBConnection(req.db, db);
              next(error);
            });
          } else {
            req.options.onFailure(error);
          }
        } else {
          if (req.options == null) {
            req.records = resdata;
            releaseDBConnection(db, connection);
            next();
          } else {
            req.options.onSuccess(resdata);
          }
        }
      }
    );
  } catch (e) {
    next(e);
  }
};

//Code modification end

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
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
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
        releaseDBConnection(db, connection);
        if (error) {
          next(error);
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
  let insuranceWhereCondition = {
    hims_d_insurance_provider_id: "ALL"
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
      // extend(insuranceWhereCondition, req.query);
      let where = whereCondition(extend(insuranceWhereCondition, req.query));

      connection.query(
        "select * from hims_d_insurance_provider where record_status='A' AND" +
          where.condition +
          " order by hims_d_insurance_provider_id desc",
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

//created by:nowshad,to get list of all sub insurence
let getSubInsurance = (req, res, next) => {
  let insuranceWhereCondition = {
    insurance_sub_code: "ALL"
  };

  debugFunction("getSubInsurance");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      // extend(insuranceWhereCondition, req.query);
      let where = whereCondition(extend(insuranceWhereCondition, req.query));

      connection.query(
        "select * from hims_d_insurance_sub where record_status='A' AND" +
          where.condition,
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
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id
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
        "INSERT INTO hims_d_insurance_provider(`insurance_provider_code`,`insurance_provider_name`,`arabic_provider_name`,\
        `deductible_proc`,`deductible_lab`,`co_payment`,`insurance_type`,`package_claim`,`hospital_id`, `payer_id`,\
        `credit_period`,`insurance_limit`,`payment_type`,`insurance_remarks`,`cpt_mandate`,`child_id`,`currency`,\
        `preapp_valid_days`,`claim_submit_days`,`lab_result_check`,`resubmit_all`,`company_service_price_type`,`ins_rej_per`,`effective_start_date`,\
        `effective_end_date`,`created_by`)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          inputparam.insurance_provider_code,
          inputparam.insurance_provider_name,
          inputparam.arabic_provider_name,
          inputparam.deductible_proc,
          inputparam.deductible_lab,
          inputparam.co_payment,
          inputparam.insurance_type,
          inputparam.package_claim,
          inputparam.hospital_id,
          inputparam.payer_id,
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
          inputparam.company_service_price_type,
          inputparam.ins_rej_per,
          inputparam.effective_start_date,
          inputparam.effective_end_date,
          inputparam.created_by
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

//created by irfan: to Update insurence provider
let updateInsuranceProvider = (req, res, next) => {
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
    updated_by: req.userIdentity.algaeh_d_app_user_id
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
        "update hims_d_insurance_provider SET `insurance_provider_code`=?,`insurance_provider_name`=?,`arabic_provider_name`=?,\
        `deductible_proc`=?,`deductible_lab`=?,`co_payment`=?,`insurance_type`=?,`package_claim`=?,`hospital_id`=?, `payer_id`=?,\
        `credit_period`=?,`insurance_limit`=?,`payment_type`=?,`insurance_remarks`=?,`cpt_mandate`=?,`child_id`=?,`currency`=?,\
        `preapp_valid_days`=?,`claim_submit_days`=?,`lab_result_check`=?,`resubmit_all`=?,`company_service_price_type`=?,`ins_rej_per`=?,`effective_start_date`=?,\
        `effective_end_date`=?,`updated_by`=? WHERE  `hims_d_insurance_provider_id`=? AND `record_status`='A'",
        [
          inputparam.insurance_provider_code,
          inputparam.insurance_provider_name,
          inputparam.arabic_provider_name,
          inputparam.deductible_proc,
          inputparam.deductible_lab,
          inputparam.co_payment,
          inputparam.insurance_type,
          inputparam.package_claim,
          inputparam.hospital_id,
          inputparam.payer_id,
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
          inputparam.company_service_price_type,
          inputparam.ins_rej_per,
          inputparam.effective_start_date,
          inputparam.effective_end_date,
          inputparam.updated_by,
          inputparam.hims_d_insurance_provider_id
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

//created by irfan: to add SUB-insurence provider
let addSubInsuranceProvider = (req, res, next) => {
  let insuranceSubProviderModel = {};

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      // let inputObj = req.body;
      debugLog("req.body: ", req.body);
      const insurtColumns = [
        "insurance_sub_code",
        "insurance_sub_name",
        "arabic_sub_name",
        "insurance_provider_id",
        "card_format",
        "transaction_number",
        "effective_start_date",
        "effective_end_date",
        "created_by"
      ];

      debugLog("Test: ", req.body);
      connection.query(
        "INSERT INTO hims_d_insurance_sub(" +
          insurtColumns.join(",") +
          ",`created_date`) VALUES ?",
        [
          jsonArrayToObject({
            sampleInputObject: insurtColumns,
            arrayObj: req.body,
            newFieldToInsert: [new Date()],
            req: req
          })
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

//created by irfan: to updateSubInsuranceProvider SUB-insurence provider

let updateSubInsuranceProvider = (req, res, next) => {
  let insuranceSubProviderModel = {};

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputparam = extend(insuranceSubProviderModel, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "update hims_d_insurance_sub SET `insurance_sub_code`=?,`insurance_sub_name`=?,`arabic_sub_name`=?,`insurance_provider_id`=?,`card_format`=?,\
        `transaction_number`=?,`effective_start_date`=?,`effective_end_date`=?,`updated_by`=? WHERE  `hims_d_insurance_sub_id`=? AND `record_status`='A'",
        [
          inputparam.insurance_sub_code,
          inputparam.insurance_sub_name,
          inputparam.arabic_sub_name,
          inputparam.insurance_provider_id,
          inputparam.card_format,
          inputparam.transaction_number,
          inputparam.effective_start_date,
          inputparam.effective_end_date,
          inputparam.updated_by,
          inputparam.hims_d_insurance_sub_id
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

//created by irfan: to add network(insurence plan master)
let addNetwork = (req, res, next) => {
  let NetworkModel = {
    hims_d_insurance_network_id: null,
    network_type: null,
    insurance_provider_id: null,
    insurance_sub_id: null,
    effective_start_date: null,
    effective_end_date: null,
    sub_insurance_status: null,

    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
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

//created by irfan: to add networkoffice(policy master)
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
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id
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

//created by irfan: to add  both network and network office andservices
//of hospital (insurence plan master)
let addPlanAndPolicy = (req, res, next) => {
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
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        let flag = 0;

        let jsonArr = req.body; //extend(models, req.body);

        for (let i = 0; i < jsonArr.length; i++) {
          let obj = extend(
            {
              hims_d_insurance_network_id: null,
              network_type: null,
              insurance_provider_id: null,
              insurance_sub_id: null,
              effective_start_date: null,
              effective_end_date: null,
              sub_insurance_status: null,
              created_date: null,
              created_by: req.userIdentity.algaeh_d_app_user_id,
              updated_date: null,
              updated_by: req.userIdentity.algaeh_d_app_user_id,
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
              diagnostic_max: null
            },
            jsonArr[i]
          );
          debugLog("Raw Object :", jsonArr[i]);

          debugLog("objects :", obj);

          connection.query(
            "INSERT INTO hims_d_insurance_network(`network_type`,`insurance_provider_id`,`insurance_sub_id`,\
        `effective_start_date`,`effective_end_date`,`created_by`, `updated_by`)\
        VALUE(?,?,?,?,?,?,?)",
            [
              obj.network_type,
              obj.insurance_provider_id,
              obj.insurance_sub_id,
              moment(String(obj.effective_start_date)).format("YYYY-MM-DD"),
              moment(String(obj.effective_end_date)).format("YYYY-MM-DD"),
              obj.created_by,
              obj.created_by
            ],
            (error, result) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
              // req.records = result;
              // next();

              if (result != null && result.length != 0) {
                obj.network_id = result["insertId"];

                //----------------------------------begin of service insurance
                if (jsonArr[i].price_from == "P") {
                  connection.query(
                    "INSERT INTO hims_d_services_insurance_network(`insurance_id`,`network_id`,`services_id`,`service_code`,`service_type_id`,`cpt_code`,`service_name`,`insurance_service_name`,\
                    `hospital_id`,`gross_amt`,`net_amount`,`created_by`,`updated_by`)\
                    SELECT " +
                      obj.insurance_provider_id +
                      "," +
                      obj.network_id +
                      ",hims_d_services_id,service_code,service_type_id,cpt_code,service_name,service_name,hospital_id,standard_fee,standard_fee," +
                      obj.created_by +
                      "," +
                      obj.created_by +
                      " from hims_d_services",
                    (error, result_service_network) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }

                      debugLog("result of pppp:", result_service_network);
                    }
                  );
                }
                if (jsonArr[i].price_from == "S" && flag == 0) {
                  flag = 1;
                  connection.query(
                    "INSERT IGNORE INTO hims_d_services_insurance(`insurance_id`,`services_id`,`service_code`,`service_type_id`,`cpt_code`,`service_name`,`insurance_service_name`,\
                          `hospital_id`,`gross_amt`,`net_amount`,`created_by`,`updated_by`)\
                          SELECT " +
                      obj.insurance_provider_id +
                      ",hims_d_services_id,service_code,service_type_id,cpt_code,service_name,service_name,hospital_id,standard_fee,standard_fee," +
                      obj.created_by +
                      "," +
                      obj.created_by +
                      " from hims_d_services",
                    (error, result_service_Ins) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      debugLog("result of pppp:", result_service_Ins);
                      //code
                    }
                  );

                  //code
                }

                //----------------------------------end of service insurance

                connection.query(
                  "INSERT INTO hims_d_insurance_network_office(`network_id`,`hospital_id`,`deductible`,`deductable_type`,`min_value`,`max_value`,`copay_consultation`,\
              `deductible_lab`,`for_alllab`,`copay_percent`,`deductible_rad`,`for_allrad`,`copay_percent_rad`,`copay_percent_trt`,\
              `copay_percent_dental`,`copay_medicine`,`insur_network_limit`,`deductible_trt`,`deductible_dental`,`deductible_medicine`,`lab_min`,\
              `lab_max`,`rad_min`,`rad_max`,`trt_max`,`trt_min`,`dental_min`,`dental_max`,`medicine_min`,`medicine_max`,`invoice_max_liability`,\
              `for_alltrt`,`for_alldental`,`for_allmedicine`,`invoice_max_deduct`,`price_from`,`employer`,`policy_number`,`follow_up`,`preapp_limit`,\
              `deductible_ip`,`copay_ip`,`ip_min`,`ip_max`,`for_allip`,`consult_limit`,`preapp_limit_from`,`copay_maternity`,`maternity_min`,`maternity_max`,\
              `copay_optical`,`optical_min`,`optical_max`,`copay_diagnostic`,`diagnostic_min`,`diagnostic_max`,`created_by`,`updated_by`)\
              SELECT " +
                    obj.network_id +
                    ",hims_d_hospital_id," +
                    obj.deductible +
                    "," +
                    obj.deductable_type +
                    "," +
                    obj.min_value +
                    "," +
                    obj.max_value +
                    "," +
                    obj.copay_consultation +
                    "," +
                    obj.deductible_lab +
                    "," +
                    obj.for_alllab +
                    "," +
                    obj.copay_percent +
                    "," +
                    obj.deductible_rad +
                    "," +
                    obj.for_allrad +
                    "," +
                    obj.copay_percent_rad +
                    "," +
                    obj.copay_percent_trt +
                    "," +
                    obj.copay_percent_dental +
                    "," +
                    obj.copay_medicine +
                    "," +
                    obj.insur_network_limit +
                    "," +
                    obj.deductible_trt +
                    "," +
                    obj.deductible_dental +
                    "," +
                    obj.deductible_medicine +
                    "," +
                    obj.lab_min +
                    "," +
                    obj.lab_max +
                    "," +
                    obj.rad_min +
                    "," +
                    obj.rad_max +
                    "," +
                    obj.trt_max +
                    "," +
                    obj.trt_min +
                    "," +
                    obj.dental_min +
                    "," +
                    obj.dental_max +
                    "," +
                    obj.medicine_min +
                    "," +
                    obj.medicine_max +
                    "," +
                    obj.invoice_max_liability +
                    "," +
                    obj.for_alltrt +
                    "," +
                    obj.for_alldental +
                    "," +
                    obj.for_allmedicine +
                    "," +
                    obj.invoice_max_deduct +
                    ",'" +
                    obj.price_from +
                    "','" +
                    obj.employer +
                    "','" +
                    obj.policy_number +
                    "'," +
                    obj.follow_up +
                    "," +
                    obj.preapp_limit +
                    "," +
                    obj.deductible_ip +
                    "," +
                    obj.copay_ip +
                    "," +
                    obj.ip_min +
                    "," +
                    obj.ip_max +
                    "," +
                    obj.for_allip +
                    "," +
                    obj.consult_limit +
                    ",'" +
                    obj.preapp_limit_from +
                    "'," +
                    obj.copay_maternity +
                    "," +
                    obj.maternity_min +
                    "," +
                    obj.maternity_max +
                    "," +
                    obj.copay_optical +
                    "," +
                    obj.optical_min +
                    "," +
                    obj.optical_max +
                    "," +
                    obj.copay_diagnostic +
                    "," +
                    obj.diagnostic_min +
                    "," +
                    obj.diagnostic_max +
                    "," +
                    obj.created_by +
                    "," +
                    obj.created_by +
                    " from hims_d_hospital",
                  (error, resultoff) => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }

                    connection.commit(error => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      releaseDBConnection(db, connection);
                      req.records = resultoff;
                      next();
                    });
                  }
                );
              }
            }
          );
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

//delet sub insurance
let deleteSubInsurance = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "UPDATE hims_d_insurance_sub SET  record_status='I', \
         updated_by=?,updated_date=? WHERE hims_d_insurance_sub_id=?",
        [req.body.updated_by, new Date(), req.body.hims_d_insurance_sub_id],
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

//created by:nowshad,to get list of all Price List of selected insurance
let getPriceList = (req, res, next) => {
  let priselistWhereCondition = {
    insurance_id: "ALL",
    services_id: "ALL"
  };

  debugFunction("getPriceList");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      // extend(insuranceWhereCondition, req.query);
      let where = whereCondition(extend(priselistWhereCondition, req.query));

      connection.query(
        "select * from hims_d_services_insurance where record_status='A' AND" +
          where.condition,
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

let getPolicyPriceList = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let inputValues = [];
    let _stringData = "";

    if (req.query.insurance_id != null) {
      _stringData += " and insurance_id=?";
      inputValues.push(req.query.insurance_id);
    }

    if (req.query.network_id != null) {
      _stringData += " and network_id=?";
      inputValues.push(req.query.network_id);
    }

    _mysql
      .executeQuery({
        query:
          "select hims_d_services_insurance_network_id,insurance_id,network_id,services_id,service_code,\
        service_type_id,cpt_code,service_name,insurance_service_name,hospital_id,pre_approval,covered,\
        deductable_status,deductable_amt,copay_status,copay_amt,gross_amt,corporate_discount_percent,\
        corporate_discount_amt,net_amount from hims_d_services_insurance_network where record_status='A' " +
          _stringData,
        values: inputValues,
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//created by:irfan,to get list of network and its network_office records
// based on insuranceProvider id

let getNetworkAndNetworkOfficRecords = (req, res, next) => {
  debugFunction("getNetworkAndNetworkOfficRecords");

  const _mysql = new algaehMysql({ path: keyPath });
  try {
    // const utilities = new algaehUtilities();
    // utilities.logger().log("getRadOrderedServices: ");
    let inputValues = [req.userIdentity.hospital_id];
    let _stringData = "";

    if (req.query.insuranceProviderId != null) {
      _stringData += " and insurance_provider_id=?";
      inputValues.push(req.query.insuranceProviderId);
    }

    if (req.query.hims_d_insurance_network_office_id != null) {
      _stringData += " and netoff.hims_d_insurance_network_office_id=?";
      inputValues.push(req.query.hims_d_insurance_network_office_id);
    }

    if (req.query.price_from != null) {
      _stringData += " and netoff.price_from=?";
      inputValues.push(req.query.price_from);
    }

    // utilities.logger().log("_stringData: ", _stringData);
    _mysql
      .executeQuery({
        query:
          "SELECT hims_d_insurance_network_id,network_type,arabic_network_type,insurance_sub_id,insurance_provider_id,\
        netoff.hospital_id, netoff.hims_d_insurance_network_office_id, netoff.employer,netoff.policy_number,effective_start_date,effective_end_date,netoff.preapp_limit,netoff.price_from,netoff.deductible,\
        netoff.copay_consultation,netoff.max_value,netoff.deductible_lab,netoff.copay_percent,\
        netoff.lab_max,netoff.deductible_rad,netoff.copay_percent_rad,netoff.rad_max,netoff.deductible_trt,\
        netoff.copay_percent_trt,netoff.trt_max,netoff.deductible_dental,\
        netoff.copay_percent_dental,netoff.dental_max, netoff.hospital_id,netoff.deductible_medicine,netoff.copay_medicine,netoff.medicine_max,netoff.invoice_max_deduct, netoff.preapp_limit_from \
        FROM hims_d_insurance_network net,hims_d_insurance_network_office netoff\
        where netoff.hospital_id=? and netoff.network_id = net.hims_d_insurance_network_id \
        and net.record_status='A' and netoff.record_status='A' " +
          _stringData,
        values: inputValues,
        printQuery: true
      })
      .then(result => {
        // utilities.logger().log("result: ", result);
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
  // try {
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;

  //   db.getConnection((error, connection) => {
  //     if (error) {
  //       next(error);
  //     }
  //     let insuranceProviderId = req.query.insuranceProviderId;

  //     debugLog("insuranceProviderId: ", insuranceProviderId);
  //     connection.query(
  //       "SELECT hims_d_insurance_network_id,network_type,arabic_network_type,insurance_sub_id,insurance_provider_id,\
  //       netoff.hospital_id, netoff.hims_d_insurance_network_office_id, netoff.employer,netoff.policy_number,effective_start_date,effective_end_date,netoff.preapp_limit,netoff.price_from,netoff.deductible,\
  //       netoff.copay_consultation,netoff.max_value,netoff.deductible_lab,netoff.copay_percent,\
  //       netoff.lab_max,netoff.deductible_rad,netoff.copay_percent_rad,netoff.rad_max,netoff.deductible_trt,\
  //       netoff.copay_percent_trt,netoff.trt_max,netoff.deductible_dental,\
  //       netoff.copay_percent_dental,netoff.dental_max, netoff.hospital_id,netoff.deductible_medicine,netoff.copay_medicine,netoff.medicine_max,netoff.invoice_max_deduct, netoff.preapp_limit_from \
  //       FROM hims_d_insurance_network net,hims_d_insurance_network_office netoff\
  //       where insurance_provider_id=? and  netoff.hospital_id=? and netoff.network_id = net.hims_d_insurance_network_id \
  //       and net.record_status='A' and netoff.record_status='A';",
  //       [insuranceProviderId, req.userIdentity.hospital_id],
  //       (error, result) => {
  //         releaseDBConnection(db, connection);
  //         if (error) {
  //           next(error);
  //         }
  //         req.records = result;

  //         next();
  //       }
  //     );
  //   });
  // } catch (e) {
  //   next(e);
  // }
};

let updatePriceList = (req, res, next) => {
  let services_insurance = {
    hims_d_services_insurance_id: null,
    insurance_service_name: null,
    cpt_code: null,
    gross_amt: null,
    corporate_discount_amt: null,
    net_amount: null,
    pre_approval: null,
    covered: null,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(services_insurance, req.body);
    connection.query(
      "UPDATE `hims_d_services_insurance` \
     SET `insurance_service_name`=?, `cpt_code`=?, `gross_amt`=?, `corporate_discount_amt`=?, `net_amount`=?,\
     `pre_approval`=?,`covered`=?,`updated_by`=?, `updated_date`=? WHERE `record_status`='A' and \
     `hims_d_services_insurance_id`=?",
      [
        inputParam.insurance_service_name,
        inputParam.cpt_code,
        inputParam.gross_amt,
        inputParam.corporate_discount_amt,
        inputParam.net_amount,
        inputParam.pre_approval,
        inputParam.covered,
        inputParam.updated_by,
        new Date(),
        inputParam.hims_d_services_insurance_id
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
};

//created by irfan: to update Network And NetworkOffice

let updateNetworkAndNetworkOffice = (req, res, next) => {
  let networkAndNetworkOfficeModel = {
    hims_d_insurance_network_id: null,
    network_type: null,
    insurance_provider_id: null,
    insurance_sub_id: null,
    effective_start_date: null,
    effective_end_date: null,
    sub_insurance_status: null,

    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id,
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
    arabic_network_type: null
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputparam = extend(networkAndNetworkOfficeModel, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        debugLog("inputparam: ", inputparam);

        connection.query(
          "update hims_d_insurance_network SET `network_type`=?,`arabic_network_type`=?,`insurance_provider_id`=?,`insurance_sub_id`=?,\
        `effective_start_date`=?,`effective_end_date`=?, `updated_date`=?,`updated_by`=? WHERE  `hims_d_insurance_network_id`=? AND `record_status`='A'",
          [
            inputparam.network_type,
            inputparam.arabic_network_type,
            inputparam.insurance_provider_id,
            inputparam.insurance_sub_id,
            inputparam.effective_start_date,
            inputparam.effective_end_date,
            new Date(),
            inputparam.updated_by,
            inputparam.hims_d_insurance_network_id
          ],
          (error, result) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }

            // req.records = result;
            // next();
            if (result != null) {
              connection.query(
                "update hims_d_insurance_network_office SET `network_id`=?,`hospital_id`=?,`deductible`=?,`deductable_type`=?,`min_value`=?,`max_value`=?,`copay_consultation`=?,\
            `deductible_lab`=?,`for_alllab`=?,`copay_percent`=?,`deductible_rad`=?,`for_allrad`=?,`copay_percent_rad`=?,`copay_percent_trt`=?,\
            `copay_percent_dental`=?,`copay_medicine`=?,`insur_network_limit`=?,`deductible_trt`=?,`deductible_dental`=?,`deductible_medicine`=?,`lab_min`=?,\
            `lab_max`=?,`rad_min`=?,`rad_max`=?,`trt_max`=?,`trt_min`=?,`dental_min`=?,`dental_max`=?,`medicine_min`=?,`medicine_max`=?,`invoice_max_liability`=?,\
            `for_alltrt`=?,`for_alldental`=?,`for_allmedicine`=?,`invoice_max_deduct`=?,`price_from`=?,`employer`=?,`policy_number`=?,`follow_up`=?,`preapp_limit`=?,\
            `deductible_ip`=?,`copay_ip`=?,`ip_min`=?,`ip_max`=?,`for_allip`=?,`consult_limit`=?,`preapp_limit_from`=?,`copay_maternity`=?,`maternity_min`=?,`maternity_max`=?,\
            `copay_optical`=?,`optical_min`=?,`optical_max`=?,`copay_diagnostic`=?,`diagnostic_min`=?,`diagnostic_max`=?,`updated_date`=?,`updated_by`=? WHERE  `hims_d_insurance_network_office_id`=? AND `record_status`='A'",
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
                  inputparam.updated_by,
                  inputparam.hims_d_insurance_network_office_id
                ],
                (error, results) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  connection.commit(error => {
                    releaseDBConnection(db, connection);
                    if (error) {
                      connection.rollback(() => {
                        next(error);
                      });
                    }
                    releaseDBConnection(db, connection);
                    req.records = results;
                    next();
                  });
                }
              );
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by nowshad
let updatePriceListBulk = (req, res, next) => {
  let services_insurance = {
    hims_d_services_insurance_id: null,
    corporate_discount_percent: null,
    corporate_discount_amt: null,
    net_amount: null,
    pre_approval: null,
    covered: null,
    updated_by: req.userIdentity.algaeh_d_app_user_id,
    record_status: null
  };

  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  let inputParam = extend(services_insurance, req.body);
  let strQuery = "";
  let parameters = [];
  if (inputParam.update === "pre_approval") {
    strQuery =
      "UPDATE `hims_d_services_insurance` \
    SET `pre_approval`=?,`updated_by`=?, `updated_date`=? WHERE `record_status`='A' and \
    `insurance_id`=?";
    parameters = [
      inputParam.pre_approval,
      inputParam.updated_by,
      new Date(),
      inputParam.insurance_id
    ];
  } else if (inputParam.update === "covered") {
    strQuery =
      "UPDATE `hims_d_services_insurance` \
    SET `covered`=?,`updated_by`=?, `updated_date`=? WHERE `record_status`='A' and \
    `insurance_id`=?";
    parameters = [
      inputParam.covered,
      inputParam.updated_by,
      new Date(),
      inputParam.insurance_id
    ];
  } else if (inputParam.update === "corporate_discount") {
    if (inputParam.discountType === "P") {
      strQuery =
        "UPDATE `hims_d_services_insurance` \
        SET `corporate_discount_percent`=?, `corporate_discount_amt`=(gross_amt*?)/100,`net_amount`=(gross_amt-(gross_amt*?)/100),\
        `updated_by`=?, `updated_date`=? WHERE `record_status`='A' and `insurance_id`=?";

      parameters = [
        inputParam.corporate_discount,
        inputParam.corporate_discount,
        inputParam.corporate_discount,
        inputParam.updated_by,
        new Date(),
        inputParam.insurance_id
      ];
    } else if (inputParam.discountType === "A") {
      strQuery =
        "UPDATE `hims_d_services_insurance` \
        SET `corporate_discount_amt`=?, `corporate_discount_percent`=(?/gross_amt)*100,`net_amount`=gross_amt-?, \
        `updated_by`=?, `updated_date`=? WHERE `record_status`='A' and `insurance_id`=?";

      parameters = [
        inputParam.corporate_discount,
        inputParam.corporate_discount,
        inputParam.corporate_discount,
        inputParam.updated_by,
        new Date(),
        inputParam.insurance_id
      ];
    }
  }
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }

    connection.query(strQuery, parameters, (error, result) => {
      releaseDBConnection(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};

//delet sub insurance
let deleteNetworkAndNetworkOfficRecords = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "UPDATE hims_d_insurance_network_office SET  record_status='I', \
         updated_by=?,updated_date=? WHERE hims_d_insurance_network_office_id=?",
        [
          req.body.updated_by,
          new Date(),
          req.body.hims_d_insurance_network_office_id
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

let getInsuranceProviders = (req, res, next) => {
  let selectWhere = {
    hims_d_insurance_provider_id: null
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let where = whereCondition(extend(selectWhere, req.query));
      connection.query(
        " SELECT hims_d_insurance_provider_id, insurance_provider_code,\
        insurance_provider_name, arabic_provider_name from hims_d_insurance_provider where record_status='A' AND " +
          where.condition,
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

let getSubInsuraces = (req, res, next) => {
  let selectWhere = {
    insurance_provider_id: null
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let where = whereCondition(extend(selectWhere, req.query));
      connection.query(
        " SELECT hims_d_insurance_sub_id, insurance_sub_code, insurance_sub_name, arabic_sub_name,\
        insurance_provider_id  from hims_d_insurance_sub where record_status='A' AND " +
          where.condition,
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

export default {
  getPatientInsurance,
  addPatientInsurance,
  getListOfInsuranceProvider,
  addInsuranceProvider,
  updateInsuranceProvider,
  addSubInsuranceProvider,
  updateSubInsuranceProvider,
  getSubInsurance,
  deleteSubInsurance,
  addNetwork,
  NetworkOfficeMaster,
  addPlanAndPolicy,
  getPriceList,
  getPolicyPriceList,
  getNetworkAndNetworkOfficRecords,
  updatePriceList,
  updateNetworkAndNetworkOffice,
  updatePriceListBulk,
  addPatientInsuranceData,
  deleteNetworkAndNetworkOfficRecords,
  getInsuranceProviders,
  getSubInsuraces
  // getPreAprovalList
};
