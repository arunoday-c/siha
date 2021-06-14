import algaehMysql from "algaeh-mysql";
import moment from "moment";
import mysql from "mysql";
import _ from "lodash";
import extend from "extend";

export default {
  //Addded by noor code modification
  addPatientInsuranceData: (req, res, next) => {
    const _mysql = req.options == null ? req.db : new algaehMysql();
    try {
      let input = req.body;

      _mysql
        .executeQuery({
          query:
            "INSERT INTO hims_m_patient_insurance_mapping(`patient_id`,`patient_visit_id`,\
            `primary_insurance_provider_id`,`primary_sub_id`,`primary_network_id`,\
            `primary_inc_card_path`,`primary_policy_num`,`primary_effective_start_date`,\
            `primary_effective_end_date`,`primary_card_number`,`secondary_insurance_provider_id`,`secondary_sub_id`,\
            `secondary_network_id`,`secondary_effective_start_date`,`secondary_effective_end_date`,\
            `secondary_card_number`,`secondary_inc_card_path`,`secondary_policy_num`,`created_by`,`created_date`,`updated_by`,\
            `updated_date`)VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
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
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
          ],

          printQuery: false,
        })
        .then((resdata) => {
          // _mysql.releaseConnection();
          // req.records = result;

          if (req.options == null) {
            req.records = resdata;
            _mysql.releaseConnection();
            next();
          } else {
            req.options.onSuccess(resdata);
          }
        })
        .catch((error) => {
          if (req.options == null) {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          } else {
            req.options.onFailure(error);
          }
        });
    } catch (e) {
      next(e);
    }
  },
  //created by:irfan,to get list of all insurence providers
  getListOfInsuranceProvider: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.query;

      let qryStr = "";
      if (input.hims_d_insurance_provider_id > 0) {
        qryStr =
          " and hims_d_insurance_provider_id=" +
          input.hims_d_insurance_provider_id;
      }

      _mysql
        .executeQuery({
          query: `select * from hims_d_insurance_provider where record_status='A'\ ${qryStr} order by hims_d_insurance_provider_id desc`,

          printQuery: false,
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
      next(e);
    }
  },
  //created by:irfan
  // getSubInsurance: (req, res, next) => {
  //   const _mysql = new algaehMysql();
  //   try {
  //     let input = req.query;

  //     let qryStr = "";
  //     if (input.insurance_provider_id > 0) {
  //       qryStr += " and insurance_provider_id=" + input.insurance_provider_id;
  //     }

  //     if (input.insurance_provider_id != null) {
  //       qryStr += " and insurance_provider_id=" + input.insurance_provider_id;
  //     }

  //     // left join finance_account_head P on I.head_id=P.finance_account_head_id\
  //     //     left join finance_account_child C on I.child_id=C.finance_account_child_id \
  //     _mysql
  //       .executeQuery({
  //         query: `select * from hims_d_insurance_sub where record_status='A' ${qryStr} `,

  //         printQuery: false,
  //       })
  //       .then((result) => {
  //         _mysql.releaseConnection();
  //         req.records = result;

  //         next();
  //       })
  //       .catch((error) => {
  //         _mysql.releaseConnection();
  //         next(error);
  //       });
  //   } catch (e) {
  //     next(e);
  //   }
  // },
  //created by:irfan
  addInsuranceProvider: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputparam = req.body;

      _mysql
        .executeQuery({
          query:
            "INSERT INTO hims_d_insurance_provider(`insurance_provider_code`,`insurance_provider_name`,`arabic_provider_name`,\
          `deductible_proc`,`deductible_lab`,`co_payment`,`insurance_type`,`hospital_id`, `payer_id`,\
          `credit_period`,`insurance_limit`,`payment_type`,`insurance_remarks`,`cpt_mandate`,`child_id`,`currency`,\
          `preapp_valid_days`,`claim_submit_days`,`lab_result_check`,`resubmit_all`,`company_service_price_type`,`ins_rej_per`,\
          `prefix`,`effective_start_date`, `effective_end_date`,`created_by`)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
            inputparam.insurance_provider_code,
            inputparam.insurance_provider_name,
            inputparam.arabic_provider_name,
            inputparam.deductible_proc,
            inputparam.deductible_lab,
            inputparam.co_payment,
            inputparam.insurance_type,
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
            inputparam.prefix,
            inputparam.effective_start_date,
            inputparam.effective_end_date,
            inputparam.created_by,
          ],

          printQuery: false,
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
      next(e);
    }
  },

  //created by:irfan
  updateInsuranceProvider: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputparam = req.body;

      _mysql
        .executeQuery({
          query:
            "update hims_d_insurance_provider SET `insurance_provider_code`=?,`insurance_provider_name`=?,`arabic_provider_name`=?,\
          `deductible_proc`=?,`deductible_lab`=?,`co_payment`=?,`insurance_type`=?,`package_claim`=?,`hospital_id`=?, `payer_id`=?,\
          `credit_period`=?,`insurance_limit`=?,`payment_type`=?,`insurance_remarks`=?,`cpt_mandate`=?,`child_id`=?,`currency`=?,\
          `preapp_valid_days`=?,`claim_submit_days`=?,`lab_result_check`=?,`resubmit_all`=?,`company_service_price_type`=?,`ins_rej_per`=?,\
          `prefix`=?, `effective_start_date`=?, `effective_end_date`=?,`updated_by`=? WHERE  `hims_d_insurance_provider_id`=? AND `record_status`='A'",
          values: [
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
            inputparam.prefix,
            inputparam.effective_start_date,
            inputparam.effective_end_date,
            req.userIdentity.algaeh_d_app_user_id,
            inputparam.hims_d_insurance_provider_id,
          ],

          printQuery: false,
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
      next(e);
    }
  },
  //created by:irfan
  addSubInsuranceProvider_17_06_2020: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputparam = req.body;

      const insurtColumns = [
        "insurance_sub_code",
        "insurance_sub_name",
        "arabic_sub_name",
        "insurance_provider_id",
        "card_format",
        "ins_template_name",
        "transaction_number",
        "effective_start_date",
        "effective_end_date",
      ];

      _mysql
        .executeQuery({
          query: "INSERT INTO hims_d_insurance_sub(??) VALUES ?",
          values: inputparam,
          includeValues: insurtColumns,
          bulkInsertOrUpdate: true,
          extraValues: {
            created_date: new Date(),
            created_by: req.userIdentity.algaeh_d_app_user_id,
            updated_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id,
          },
          printQuery: false,
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
      next(e);
    }
  },
  //created by:irfan
  addSubInsuranceProvider: (req, res, next) => {
    let input = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select product_type from hims_d_organization where hims_d_organization_id=1 limit 1;\
            select finance_account_head_id from finance_account_head where account_code='1.2.3.1' limit 1;",
          printQuery: false,
        })
        .then((result) => {
          if (
            result[0][0]["product_type"] == "HIMS_ERP" ||
            result[0][0]["product_type"] == "FINANCE_ERP"
          ) {
            const head_id = result[1][0]["finance_account_head_id"];

            _mysql
              .executeQueryWithTransaction({
                query:
                  "INSERT INTO `finance_account_child` (child_name,ledger_code,head_id,created_from\
                    ,created_date, created_by, updated_date, updated_by)  VALUE(?,?,?,?,?,?,?,?)",
                values: [
                  input[0].insurance_sub_name,
                  input[0].insurance_sub_code,
                  head_id,
                  "S",
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                ],
                printQuery: false,
              })
              .then((childRes) => {
                const insurtColumns = [
                  "insurance_sub_code",
                  "insurance_sub_name",
                  "arabic_sub_name",
                  "insurance_provider_id",
                  "card_format",
                  "ins_template_name",
                  "transaction_number",
                  "effective_start_date",
                  "effective_end_date",
                  "user_id",
                  "creidt_limit",
                  "creidt_limit_req",
                ];

                _mysql
                  .executeQuery({
                    query: "INSERT INTO hims_d_insurance_sub(??) VALUES ?",
                    values: input,
                    includeValues: insurtColumns,
                    bulkInsertOrUpdate: true,
                    extraValues: {
                      created_date: new Date(),
                      created_by: req.userIdentity.algaeh_d_app_user_id,
                      updated_date: new Date(),
                      updated_by: req.userIdentity.algaeh_d_app_user_id,

                      head_id: head_id,
                      child_id: childRes.insertId,
                    },
                    printQuery: false,
                  })
                  .then((sunIns) => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = sunIns;
                      next();
                    });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            const insurtColumns = [
              "insurance_sub_code",
              "insurance_sub_name",
              "arabic_sub_name",
              "insurance_provider_id",
              "card_format",
              "ins_template_name",
              "transaction_number",
              "effective_start_date",
              "effective_end_date",
            ];

            _mysql
              .executeQuery({
                query: "INSERT INTO hims_d_insurance_sub(??) VALUES ?",
                values: input,
                includeValues: insurtColumns,
                bulkInsertOrUpdate: true,
                extraValues: {
                  created_date: new Date(),
                  created_by: req.userIdentity.algaeh_d_app_user_id,
                  updated_date: new Date(),
                  updated_by: req.userIdentity.algaeh_d_app_user_id,
                },
                printQuery: false,
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
          }
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
  verifyUserIdExist: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const { user_id } = req.query;

      _mysql
        .executeQuery({
          query: `select user_id,insurance_sub_code from hims_d_insurance_sub where LOWER(user_id) = LOWER(?)`,
          values: [user_id],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result.length > 0 ? false : true;

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
  //created by:irfan
  updateSubInsuranceProvider: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputparam = req.body;

      _mysql
        .executeQuery({
          query:
            "update hims_d_insurance_sub SET `insurance_sub_code`=?,`insurance_sub_name`=?,\
            `arabic_sub_name`=?,`insurance_provider_id`=?,`card_format`=?,`ins_template_name`=?,\
            `transaction_number`=?,`effective_start_date`=?,`effective_end_date`=?,`updated_by`=?,\
           head_id=?,child_id=?\
             WHERE  `hims_d_insurance_sub_id`=? AND `record_status`='A'",
          values: [
            inputparam.insurance_sub_code,
            inputparam.insurance_sub_name,
            inputparam.arabic_sub_name,
            inputparam.insurance_provider_id,
            inputparam.card_format,
            inputparam.ins_template_name,
            inputparam.transaction_number,
            inputparam.effective_start_date,
            inputparam.effective_end_date,
            req.userIdentity.algaeh_d_app_user_id,

            inputparam.head_id,
            inputparam.child_id,
            inputparam.hims_d_insurance_sub_id,
          ],

          printQuery: false,
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
      next(e);
    }
  },

  //created by:irfan  to add network(insurence plan master)
  addNetwork: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputparam = req.body;

      _mysql
        .executeQuery({
          query:
            "INSERT INTO hims_d_insurance_network(`network_type`,`insurance_provider_id`,`insurance_sub_id`,\
          `effective_start_date`,`effective_end_date`, `sub_insurance_status`,`created_date`,`created_by`,\
          `updated_date`,`updated_by`)\
          VALUE(?,?,?,?,?,?,?,?,?,?)",
          values: [
            inputparam.network_type,
            inputparam.insurance_provider_id,
            inputparam.insurance_sub_id,
            inputparam.effective_start_date,
            inputparam.effective_end_date,
            inputparam.sub_insurance_status,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
          ],
          printQuery: false,
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
      next(e);
    }
  },
  //created by:irfan to add networkoffice(policy master)
  NetworkOfficeMaster: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputparam = req.body;

      _mysql
        .executeQuery({
          query:
            "INSERT INTO hims_d_insurance_network_office(`network_id`,`hospital_id`,`deductible`,`deductable_type`,`min_value`,`max_value`,`copay_consultation`,\
          `deductible_lab`,`for_alllab`,`copay_percent`,`deductible_rad`,`for_allrad`,`copay_percent_rad`,`copay_percent_trt`,\
          `copay_percent_dental`,`copay_medicine`,`insur_network_limit`,`deductible_trt`,`deductible_dental`,`deductible_medicine`,`lab_min`,\
          `lab_max`,`rad_min`,`rad_max`,`trt_max`,`trt_min`,`dental_min`,`dental_max`,`medicine_min`,`medicine_max`,`invoice_max_liability`,\
          `for_alltrt`,`for_alldental`,`for_allmedicine`,`invoice_max_deduct`,`price_from`,`employer`,`policy_number`,`follow_up`,`preapp_limit`,\
          `deductible_ip`,`copay_ip`,`ip_min`,`ip_max`,`for_allip`,`consult_limit`,`preapp_limit_from`,`copay_maternity`,`maternity_min`,`maternity_max`,\
          `copay_optical`,`optical_min`,`optical_max`,`copay_diagnostic`,`diagnostic_min`,`diagnostic_max`,`created_date`,`created_by`,`updated_date`,`updated_by`)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
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
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
          ],

          printQuery: false,
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
      next(e);
    }
  },

  //created by irfan: to add  both network and network office andservices
  //of hospital (insurence plan master)

  addPlanAndPolicy: (req, res, next) => {
    // console.log("result:", "addPlanAndPolicy");
    const _mysql = new algaehMysql();
    try {
      let input = extend(
        {
          hims_d_insurance_network_id: null,
          network_type: null,
          insurance_provider_id: null,
          insurance_sub_id: null,
          effective_start_date: null,
          effective_end_date: null,
          sub_insurance_status: null,

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
        },
        req.body[0]
      );
      _mysql
        .executeQueryWithTransaction({
          query:
            "INSERT INTO hims_d_insurance_network(`network_type`,`insurance_provider_id`,`insurance_sub_id`,\
        `effective_start_date`,`effective_end_date`,`created_by`, `updated_by`)\
        VALUE(?,?,?,?,?,?,?)",
          values: [
            input.network_type,
            input.insurance_provider_id,
            input.insurance_sub_id,
            input.effective_start_date,
            input.effective_end_date,
            req.userIdentity.algaeh_d_app_user_id,
            req.userIdentity.algaeh_d_app_user_id,
          ],

          printQuery: true,
        })
        .then((result) => {
          if (result.insertId > 0) {
            // _mysql.commitTransaction(() => {
            //   _mysql.releaseConnection();
            //   req.records = result;
            //   next();
            // });

            _mysql
              .executeQuery({
                query:
                  "INSERT INTO hims_d_insurance_network_office(`network_id`,`hospital_id`,`deductible`,`min_value`,`max_value`,`copay_consultation`,\
              `deductible_lab`,`for_alllab`,`copay_percent`,`deductible_rad`,`for_allrad`,`copay_percent_rad`,`copay_percent_trt`,\
              `copay_percent_dental`,`copay_medicine`,`insur_network_limit`,`deductible_trt`,`deductible_dental`,`deductible_medicine`,`lab_min`,\
              `lab_max`,`rad_min`,`rad_max`,`trt_max`,`trt_min`,`dental_min`,`dental_max`,`medicine_min`,`medicine_max`,`invoice_max_liability`,\
              `for_alltrt`,`for_alldental`,`for_allmedicine`,`invoice_max_deduct`,`price_from`,`employer`,`policy_number`,`follow_up`,`preapp_limit`,\
              `deductible_ip`,`copay_ip`,`ip_min`,`ip_max`,`for_allip`,`consult_limit`,`preapp_limit_from`,`copay_maternity`,`maternity_min`,`maternity_max`,\
              `copay_optical`,`optical_min`,`optical_max`,`copay_diagnostic`,`diagnostic_min`,`diagnostic_max`,`created_by`,`updated_by`,`deductable_type`,\
               `covered_dental`,`coverd_optical`)\
              SELECT " +
                  result.insertId +
                  ",hims_d_hospital_id," +
                  input.deductible +
                  "," +
                  input.min_value +
                  "," +
                  input.max_value +
                  "," +
                  input.copay_consultation +
                  "," +
                  input.deductible_lab +
                  "," +
                  input.for_alllab +
                  "," +
                  input.copay_percent +
                  "," +
                  input.deductible_rad +
                  "," +
                  input.for_allrad +
                  "," +
                  input.copay_percent_rad +
                  "," +
                  input.copay_percent_trt +
                  "," +
                  input.copay_percent_dental +
                  "," +
                  input.copay_medicine +
                  "," +
                  input.insur_network_limit +
                  "," +
                  input.deductible_trt +
                  "," +
                  input.deductible_dental +
                  "," +
                  input.deductible_medicine +
                  "," +
                  input.lab_min +
                  "," +
                  input.lab_max +
                  "," +
                  input.rad_min +
                  "," +
                  input.rad_max +
                  "," +
                  input.trt_max +
                  "," +
                  input.trt_min +
                  "," +
                  input.dental_min +
                  "," +
                  input.dental_max +
                  "," +
                  input.medicine_min +
                  "," +
                  input.medicine_max +
                  "," +
                  input.invoice_max_liability +
                  "," +
                  input.for_alltrt +
                  "," +
                  input.for_alldental +
                  "," +
                  input.for_allmedicine +
                  "," +
                  input.invoice_max_deduct +
                  ",'" +
                  input.price_from +
                  "','" +
                  input.employer +
                  "','" +
                  input.policy_number +
                  "'," +
                  input.follow_up +
                  "," +
                  input.preapp_limit +
                  "," +
                  input.deductible_ip +
                  "," +
                  input.copay_ip +
                  "," +
                  input.ip_min +
                  "," +
                  input.ip_max +
                  "," +
                  input.for_allip +
                  "," +
                  input.consult_limit +
                  ",'" +
                  input.preapp_limit_from +
                  "'," +
                  input.copay_maternity +
                  "," +
                  input.maternity_min +
                  "," +
                  input.maternity_max +
                  "," +
                  input.copay_optical +
                  "," +
                  input.optical_min +
                  "," +
                  input.optical_max +
                  "," +
                  input.copay_diagnostic +
                  "," +
                  input.diagnostic_min +
                  "," +
                  input.diagnostic_max +
                  "," +
                  req.userIdentity.algaeh_d_app_user_id +
                  "," +
                  req.userIdentity.algaeh_d_app_user_id +
                  ",'" +
                  input.deductable_type +
                  "','" +
                  input.covered_dental +
                  "','" +
                  input.coverd_optical +
                  "' from hims_d_hospital",
                printQuery: false,
              })
              .then((priceResult) => {
                //price from policy
                if (input.price_from == "P") {
                  _mysql
                    .executeQuery({
                      query:
                        "INSERT INTO hims_d_services_insurance_network(`insurance_id`,`network_id`,`services_id`,`service_code`,`service_type_id`,`cpt_code`,`service_name`,`insurance_service_name`,\
                `hospital_id`,`gross_amt`,`net_amount`,`created_by`,`updated_by`)\
                SELECT " +
                        input.insurance_provider_id +
                        "," +
                        result.insertId +
                        ",hims_d_services_id,service_code,service_type_id,cpt_code,service_name,service_name,hospital_id,standard_fee,standard_fee," +
                        req.userIdentity.algaeh_d_app_user_id +
                        "," +
                        req.userIdentity.algaeh_d_app_user_id +
                        " from hims_d_services",

                      printQuery: false,
                    })
                    .then((policyresult) => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = policyresult;
                        next();
                      });
                    })
                    .catch((error) => {
                      console.log("error:", error);
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    });
                } else if (input.price_from == "S") {
                  _mysql
                    .executeQuery({
                      query:
                        "INSERT IGNORE INTO hims_d_services_insurance(`insurance_id`,`services_id`,`service_code`,`service_type_id`,`cpt_code`,`service_name`,`insurance_service_name`,\
                          `hospital_id`,`gross_amt`,`net_amount`,`created_by`,`updated_by`)\
                          SELECT " +
                        input.insurance_provider_id +
                        ",hims_d_services_id,service_code,service_type_id,cpt_code,service_name,service_name,hospital_id,standard_fee,standard_fee," +
                        req.userIdentity.algaeh_d_app_user_id +
                        "," +
                        req.userIdentity.algaeh_d_app_user_id +
                        " from hims_d_services",

                      printQuery: false,
                    })
                    .then((result_service_Ins) => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = result_service_Ins;
                        next();
                      });
                    })
                    .catch((error) => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    });
                } else {
                  _mysql.rollBackTransaction(() => {
                    req.records = result;

                    next();
                  });
                }
              })
              .catch((error) => {
                console.log("error:", error);
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            _mysql.rollBackTransaction(() => {
              req.records = result;
              next();
            });
          }
        })
        .catch((error) => {
          console.log("error:", error);
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      next(e);
    }
  },
  //created by:irfan
  deleteSubInsurance: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputparam = req.body;

      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_insurance_sub SET  record_status='I', \
          updated_by=?,updated_date=? WHERE hims_d_insurance_sub_id=?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.body.hims_d_insurance_sub_id,
          ],

          printQuery: false,
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
      next(e);
    }
  },
  //created by:irfan
  getPriceList: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.query;

      console.log("input === ", input);

      let qryStr = "";
      if (input.insurance_id > 0) {
        qryStr += ` and insurance_id=${input.insurance_id}`;
      }

      if (input.services_id > 0) {
        qryStr += ` and services_id=${input.services_id}`;
      }

      if (input.service_type_id > 0) {
        qryStr += ` and service_type_id=${input.service_type_id} `;
      }

      console.log("qryStr === ", qryStr);
      _mysql
        .executeQuery({
          query:
            "select * from hims_d_services_insurance where record_status='A'" +
            qryStr,
          printQuery: true,
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
      next(e);
    }
  },
  //created by:irfan
  getPolicyPriceList: (req, res, next) => {
    const _mysql = new algaehMysql();
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
          printQuery: false,
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
      next(e);
    }
  },
  //created by:irfan
  getNetworkAndNetworkOfficRecords: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
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
          netoff.copay_percent_trt,netoff.trt_max,netoff.deductible_dental,netoff.deductable_type,netoff.deductible,\
          netoff.copay_percent_dental,netoff.dental_max, netoff.hospital_id,netoff.deductible_medicine,netoff.copay_medicine,netoff.medicine_max,netoff.invoice_max_deduct, netoff.preapp_limit_from, \
          netoff.covered_dental,netoff.coverd_optical,netoff.copay_optical FROM hims_d_insurance_network net,hims_d_insurance_network_office netoff\
          where netoff.hospital_id=? and netoff.network_id = net.hims_d_insurance_network_id \
          and net.record_status='A' and netoff.record_status='A' " +
            _stringData,
          values: inputValues,
          printQuery: true,
        })
        .then((result) => {
          // utilities.logger().log("result: ", result);
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      next(e);
    }
  },

  //created by:irfan
  updatePriceList: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = req.body;

      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_services_insurance` \
          SET `insurance_service_name`=?, `cpt_code`=?, `gross_amt`=?, `corporate_discount_amt`=?, `net_amount`=?,\
          `pre_approval`=?,`covered`=?, `interval`=?, `updated_by`=?, `updated_date`=? WHERE `record_status`='A' and \
          `hims_d_services_insurance_id`=?",
          values: [
            inputParam.insurance_service_name,
            inputParam.cpt_code,
            inputParam.gross_amt,
            inputParam.corporate_discount_amt,
            inputParam.net_amount,
            inputParam.pre_approval,
            inputParam.covered,
            inputParam.interval,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_d_services_insurance_id,
          ],

          printQuery: false,
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
      next(e);
    }
  },

  //created by:irfan
  updateNetworkAndNetworkOffice: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputparam = req.body;

      _mysql
        .executeQueryWithTransaction({
          query:
            "update hims_d_insurance_network SET `network_type`=?,`arabic_network_type`=?,`insurance_provider_id`=?,`insurance_sub_id`=?,\
        `effective_start_date`=?,`effective_end_date`=?, `updated_date`=?,`updated_by`=? WHERE  `hims_d_insurance_network_id`=? AND `record_status`='A'",
          values: [
            inputparam.network_type,
            inputparam.arabic_network_type,
            inputparam.insurance_provider_id,
            inputparam.insurance_sub_id,
            inputparam.effective_start_date,
            inputparam.effective_end_date,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputparam.hims_d_insurance_network_id,
          ],

          printQuery: false,
        })
        .then((result) => {
          _mysql
            .executeQuery({
              query:
                "update hims_d_insurance_network_office SET `network_id`=?,`hospital_id`=?,`deductible`=?,`deductable_type`=?,`min_value`=?,`max_value`=?,`copay_consultation`=?,\
              `deductible_lab`=?,`for_alllab`=?,`copay_percent`=?,`deductible_rad`=?,`for_allrad`=?,`copay_percent_rad`=?,`copay_percent_trt`=?,\
              `copay_percent_dental`=?,`copay_medicine`=?,`insur_network_limit`=?,`deductible_trt`=?,`deductible_dental`=?,`deductible_medicine`=?,`lab_min`=?,\
              `lab_max`=?,`rad_min`=?,`rad_max`=?,`trt_max`=?,`trt_min`=?,`dental_min`=?,`dental_max`=?,`medicine_min`=?,`medicine_max`=?,`invoice_max_liability`=?,\
              `for_alltrt`=?,`for_alldental`=?,`for_allmedicine`=?,`invoice_max_deduct`=?,`price_from`=?,`employer`=?,`policy_number`=?,`follow_up`=?,`preapp_limit`=?,\
              `deductible_ip`=?,`copay_ip`=?,`ip_min`=?,`ip_max`=?,`for_allip`=?,`consult_limit`=?,`preapp_limit_from`=?,`copay_maternity`=?,`maternity_min`=?,`maternity_max`=?,\
              `copay_optical`=?,`optical_min`=?,`optical_max`=?,`copay_diagnostic`=?,`diagnostic_min`=?,`diagnostic_max`=?,`updated_date`=?,`updated_by`=?,  \
               `covered_dental`=?,`coverd_optical`=? \
              WHERE  `hims_d_insurance_network_office_id`=? AND `record_status`='A'",
              values: [
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
                req.userIdentity.algaeh_d_app_user_id,
                inputparam.covered_dental,
                inputparam.coverd_optical,
                inputparam.hims_d_insurance_network_office_id,
              ],
              printQuery: false,
            })
            .then((result2) => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = result2;
                next();
              });
            })
            .catch((error) => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        })
        .catch((error) => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      next(e);
    }
  },

  //created by nowshad
  updatePriceListBulk: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = req.body;
      let strQuery = "";
      let parameters = "";

      console.log("inputParam.service_type_id", inputParam.service_type_id);
      if (inputParam.service_type_id > 0) {
        parameters = " and service_type_id=" + inputParam.service_type_id;
      }
      if (inputParam.update === "pre_approval") {
        strQuery += mysql.format(
          "UPDATE `hims_d_services_insurance` SET `pre_approval`=?,`updated_by`=?, `updated_date`=? \
          WHERE `record_status`='A' and `insurance_id`=?" +
            parameters,
          [
            inputParam.pre_approval,
            inputParam.updated_by,
            new Date(),
            inputParam.insurance_id,
          ]
        );
      } else if (inputParam.update === "covered") {
        strQuery += mysql.format(
          "UPDATE `hims_d_services_insurance` SET `covered`=?,`updated_by`=?, `updated_date`=? \
          WHERE `record_status`='A' and `insurance_id`=?" +
            parameters,
          [
            inputParam.covered,
            inputParam.updated_by,
            new Date(),
            inputParam.insurance_id,
          ]
        );
      } else if (inputParam.update === "corporate_discount") {
        if (inputParam.discountType === "P") {
          strQuery += mysql.format(
            "UPDATE `hims_d_services_insurance` SET `corporate_discount_percent`=?,\
            `corporate_discount_amt`=(gross_amt*?)/100, `net_amount`=(gross_amt-(gross_amt*?)/100),\
            `updated_by`=?, `updated_date`=? WHERE `record_status`='A' and `insurance_id`=?" +
              parameters,
            [
              inputParam.corporate_discount,
              inputParam.corporate_discount,
              inputParam.corporate_discount,
              inputParam.updated_by,
              new Date(),
              inputParam.insurance_id,
            ]
          );
        } else if (inputParam.discountType === "A") {
          strQuery += mysql.format(
            "UPDATE `hims_d_services_insurance` SET `corporate_discount_amt`=?, \
            `corporate_discount_percent`=(?/gross_amt)*100,`net_amount`=gross_amt-?, \
            `updated_by`=?, `updated_date`=? WHERE `record_status`='A' and `insurance_id`=?" +
              parameters,
            [
              inputParam.corporate_discount,
              inputParam.corporate_discount,
              inputParam.corporate_discount,
              inputParam.updated_by,
              new Date(),
              inputParam.insurance_id,
            ]
          );
        }
      }

      _mysql
        .executeQuery({
          query: strQuery,
          printQuery: true,
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
      next(e);
    }
  },
  //created by irfan
  deleteNetworkAndNetworkOfficRecords: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select hims_f_patient_insurance_mapping_id from hims_m_patient_insurance_mapping where primary_network_id=?;",
          values: [req.body.hims_d_insurance_network_id],
          printQuery: false,
        })
        .then((ins_policy_result) => {
          if (ins_policy_result.length > 0) {
            _mysql.releaseConnection();
            req.records = {
              invalid_data: true,
              message: "Selected Policy is already is used, Cannot Delete.",
            };
            next();
            return;
          }
          _mysql
            .executeQuery({
              query:
                "UPDATE hims_d_insurance_network_office SET  record_status='I', \
            updated_by=?,updated_date=? WHERE hims_d_insurance_network_office_id=?",
              values: [
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.body.hims_d_insurance_network_office_id,
              ],
              printQuery: false,
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
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      next(e);
    }
  },
  //created by irfan
  getInsuranceProviders: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _stringData = "";

      if (req.query.hims_d_insurance_provider_id != null) {
        _stringData =
          " and hims_d_insurance_provider_id=" +
          req.query.hims_d_insurance_provider_id;
      }

      _mysql
        .executeQuery({
          query:
            " SELECT hims_d_insurance_provider_id, insurance_provider_code,\
        insurance_provider_name, arabic_provider_name from hims_d_insurance_provider where record_status='A' " +
            _stringData,

          printQuery: false,
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
      next(e);
    }
  },
  //created by irfan
  getSubInsurance: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _stringData = "";

      if (req.query.insurance_provider_id > 0) {
        _stringData =
          " and insurance_provider_id=" + req.query.insurance_provider_id;
      }

      _mysql
        .executeQuery({
          query:
            "select product_type from  hims_d_organization where hims_d_organization_id=1\
             and (product_type='HIMS_ERP' or product_type='FINANCE_ERP') limit 1; ",
          printQuery: false,
        })
        .then((product_type) => {
          let sqlQry;
          if (product_type.length == 1) {
            sqlQry = `SELECT hims_d_insurance_sub_id,insurance_sub_code,insurance_sub_name,arabic_sub_name,insurance_provider_id,
            card_format,ins_template_name,transaction_number,effective_start_date,effective_end_date, 
            finance_account_child_id,concat('(',ledger_code,') ',child_name) as child_name ,I.head_id, I.child_id
            from hims_d_insurance_sub  I      
            left join finance_account_child C on I.child_id=C.finance_account_child_id 
            where record_status='A'${_stringData}; `;
          } else {
            sqlQry = ` select hims_d_insurance_sub_id,insurance_sub_code,insurance_sub_name,arabic_sub_name,insurance_provider_id,
            card_format,ins_template_name,transaction_number,effective_start_date,effective_end_date  from hims_d_insurance_sub where record_status='A' ${_stringData};`;
          }

          _mysql
            .executeQuery({
              query: sqlQry,
              printQuery: false,
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
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      next(e);
    }
  },

  //created by irfan
  getFinanceInsuranceProviders: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select product_type from  hims_d_organization where hims_d_organization_id=1\
               and (product_type='HIMS_ERP' or product_type='FINANCE_ERP') limit 1; ",
          printQuery: false,
        })
        .then((product_type) => {
          if (product_type.length == 1) {
            _mysql
              .executeQuery({
                query: `select finance_account_child_id,concat('(',ledger_code,') ',child_name) as child_name ,head_id from
                finance_account_child  where head_id in ( with recursive cte  as (          
                select  finance_account_head_id from finance_account_head where  account_code ='1.2.3.1'
                union select H.finance_account_head_id from finance_account_head 
                H inner join cte on H.parent_acc_id = cte.finance_account_head_id  )select * from cte);`,
                printQuery: false,
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
          } else {
            _mysql.releaseConnection();
            req.records = [];
            next();
          }
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      next(e);
    }
  },
};
export function saveMultiStatement(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { invoiceList, from_date, to_date } = req.body;
    const { algaeh_d_app_user_id } = req.userIdentity;
    _mysql
      .executeQueryWithTransaction({
        query: `select hims_f_invoice_header_id,insurance_provider_id,sub_insurance_id,gross_amount, discount_amount, 
        net_amount, patient_resp, patient_tax, patient_payable, company_resp, company_tax, company_payable, 
        sec_company_resp, sec_company_tax, sec_company_payable, submission_date, submission_amount, 
        remittance_date, remittance_amount, denial_amount,P.prefix,P.insurance_statement_count from hims_f_invoice_header as H 
        inner join hims_d_insurance_provider as P on H.insurance_provider_id = P.hims_d_insurance_provider_id 
        where hims_f_invoice_header_id in (?) FOR UPDATE;`,
        values: [invoiceList],
        printQuery: true,
      })
      .then((result) => {
        if (result.length > 0) {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool,
          };

          const {
            prefix,
            insurance_statement_count,
            insurance_provider_id,
            sub_insurance_id,
          } = result[0];
          const total_gross_amount = _.sumBy(result, (s) =>
            parseFloat(s.gross_amount)
          );
          const total_company_responsibility = _.sumBy(result, (s) =>
            parseFloat(s.company_resp)
          );
          const total_company_vat = _.sumBy(result, (s) =>
            parseFloat(s.company_tax)
          );
          const total_company_payable = _.sumBy(result, (s) =>
            parseFloat(s.company_payable)
          );
          const total_remittance_amount = 0;
          const total_balance_amount =
            total_gross_amount - total_remittance_amount;

          const update_ins_count = parseInt(insurance_statement_count) + 1;

          const invNum = `${prefix}-${moment().format(
            "YY"
          )}-${update_ins_count}`;

          _mysql
            .executeQuery({
              query: `insert into hims_f_insurance_statement(insurance_statement_number, total_gross_amount,
              total_company_responsibility, total_company_vat, total_company_payable, total_remittance_amount,
              total_balance_amount, insurance_provider_id, sub_insurance_id, created_by, created_date, updated_by,
              updated_date, insurance_status,from_date,to_date)VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
              values: [
                invNum,
                total_gross_amount,
                total_company_responsibility,
                total_company_vat,
                total_company_payable,
                total_remittance_amount,
                total_balance_amount,
                insurance_provider_id,
                sub_insurance_id,
                algaeh_d_app_user_id,
                new Date(),
                algaeh_d_app_user_id,
                new Date(),
                "P",
                from_date,
                to_date,
              ],
              printQuery: true,
            })
            .then((result) => {
              req.body.insurance_statement_number = invNum;
              req.body.sub_insurance_id = sub_insurance_id;
              req.body.total_company_payable = total_company_payable;
              req.body.hims_f_insurance_statement_id = result.insertId;

              _mysql
                .executeQuery({
                  query: `update hims_d_insurance_provider set insurance_statement_count=? 
                  where hims_d_insurance_provider_id=?; 
                  update hims_f_invoice_header set insurance_statement_id=?,claim_status='S1',submission_amount=company_payable,
                  submission_date = ? where hims_f_invoice_header_id in (?);
                  update hims_f_invoice_details set s1_amt=company_payable where invoice_header_id in (?) and hims_f_invoice_details_id>0;`,
                  values: [
                    update_ins_count,
                    insurance_provider_id,
                    result.insertId,
                    new Date(),
                    invoiceList,
                    invoiceList,
                  ],
                  printQuery: true,
                })
                .then((updated) => {
                  // _mysql.commitTransaction(() => {
                  //   _mysql.releaseConnection();
                  req.records = {
                    record_number: invNum,
                  };
                  next();
                  // });
                })
                .catch((error) => {
                  _mysql.closeConnection(() => {
                    next(error);
                  });
                });
            })
            .catch((error) => {
              _mysql.closeConnection(() => {
                next(error);
              });
            });
        }
      })
      .catch((error) => {
        _mysql.closeConnection(() => {
          next(error);
        });
      });
  } catch (error) {
    _mysql.releaseConnection();
  }
}

//Generate Accounting entry once statement generates(CR -- OP ctrl DR -- Customer)
export function generateAccountingEntry(req, res, next) {
  try {
    const _options = req.connection == null ? {} : req.connection;

    const _mysql = new algaehMysql(_options);
    // const utilities = new algaehUtilities();

    _mysql
      .executeQuery({
        query:
          "select product_type from  hims_d_organization where hims_d_organization_id=1\
        and (product_type='HIMS_ERP' or product_type='FINANCE_ERP') limit 1; ",
        printQuery: true,
      })
      .then((product_type) => {
        const inputParam = req.body;

        console.log("inputParam.sub_insurance_id", inputParam.sub_insurance_id);
        if (product_type.length == 1 && inputParam.sub_insurance_id > 0) {
          _mysql
            .executeQuery({
              query: `select head_id, child_id from finance_accounts_maping where account in ('OP_CTRL');
                  select insurance_sub_name, head_id, child_id from hims_d_insurance_sub 
                  where hims_d_insurance_sub_id=${inputParam.sub_insurance_id} limit 1`,
              printQuery: true,
            })
            .then((Result) => {
              const OP_CTRL = Result[0][0];
              const insurance_data = Result[1][0];
              console.log("OP_CTRL", OP_CTRL);
              console.log("insurance_data", insurance_data);

              console.log("OP_CTRL", OP_CTRL);

              let voucher_type = "";
              let narration = "";
              // let amount = 0;

              const EntriesArray = [];

              voucher_type = "sales";
              narration = `, insurance (${insurance_data.insurance_sub_name}) receivable: ${inputParam.total_company_payable}`;

              EntriesArray.push({
                payment_date: new Date(),
                head_id: OP_CTRL.head_id,
                child_id: OP_CTRL.child_id,
                debit_amount: 0,
                payment_type: "CR",
                credit_amount: inputParam.total_company_payable,
                hospital_id: req.userIdentity.hospital_id,
              });

              EntriesArray.push({
                payment_date: new Date(),
                head_id: insurance_data.head_id,
                child_id: insurance_data.child_id,
                debit_amount: inputParam.total_company_payable,
                payment_type: "DR",
                credit_amount: 0,
                hospital_id: req.userIdentity.hospital_id,
              });

              console.log("EntriesArray", EntriesArray);
              _mysql
                .executeQueryWithTransaction({
                  query:
                    "INSERT INTO finance_day_end_header (transaction_date,amount,voucher_type,document_id,\
                document_number,from_screen,narration, invoice_no, entered_by,entered_date) \
                VALUES (?,?,?,?,?,?,?,?,?,?);",
                  values: [
                    new Date(),
                    inputParam.total_company_payable,
                    voucher_type,
                    inputParam.hims_f_insurance_statement_id,
                    inputParam.insurance_statement_number,
                    inputParam.ScreenCode,
                    narration,
                    inputParam.insurance_statement_number,
                    req.userIdentity.algaeh_d_app_user_id,
                    new Date(),
                  ],
                  printQuery: true,
                })
                .then((header_result) => {
                  let project_id = null;

                  console.log("header_result", header_result);
                  let headerDayEnd = header_result;
                  // headerDayEnd = header_result;

                  const month = moment().format("M");
                  const year = moment().format("YYYY");
                  const IncludeValuess = [
                    "payment_date",
                    "head_id",
                    "child_id",
                    "debit_amount",
                    "payment_type",
                    "credit_amount",
                    "hospital_id",
                  ];

                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ;",
                      values: EntriesArray,
                      includeValues: IncludeValuess,
                      bulkInsertOrUpdate: true,
                      extraValues: {
                        year: year,
                        month: month,
                        day_end_header_id: headerDayEnd.insertId,
                        // project_id: project_id,
                        // sub_department_id: req.body.sub_department_id
                      },
                      printQuery: true,
                    })
                    .then((subResult) => {
                      console.log("subResult", subResult);
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        next();
                      });
                    })
                    .catch((error) => {
                      console.log("error", error);
                      _mysql.closeConnection(() => {
                        next(error);
                      });
                    });
                })
                .catch((error) => {
                  console.log("error", error);
                  _mysql.closeConnection(() => {
                    next(error);
                  });
                });
            })
            .catch((error) => {
              _mysql.closeConnection(() => {
                next(error);
              });
            });
        } else {
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            next();
          });
        }
      })
      .catch((error) => {
        _mysql.closeConnection(() => {
          next(error);
        });
      });
  } catch (e) {
    _mysql.releaseConnection();
  }
}
export function getInsuranceStatement(req, res, next) {
  const _mysql = new algaehMysql();
  const { submission_step, hims_f_insurance_statement_id } = req.query;

  let condition = `IH.insurance_statement_id=${hims_f_insurance_statement_id}`;
  if (submission_step == 2) {
    condition = `IH.insurance_statement_id_2=${hims_f_insurance_statement_id}`;
  }
  if (submission_step == 3) {
    condition = `IH.insurance_statement_id_3=${hims_f_insurance_statement_id}`;
  }
  try {
    _mysql
      .executeQuery({
        query: `select INH.insurance_provider_name,INH.arabic_provider_name,INSH.insurance_sub_name,INSH.arabic_sub_name,
        hims_f_insurance_statement_id, INS.insurance_statement_number, total_gross_amount, total_company_responsibility, total_company_vat, total_company_payable,
        total_remittance_amount, total_denial_amount, total_balance_amount, insurance_status,
        INS.insurance_provider_id, INS.sub_insurance_id,INS.insurance_status,INS.from_date,INS.to_date  from hims_f_insurance_statement INS
        inner join hims_d_insurance_provider INH on INH.hims_d_insurance_provider_id = INS.insurance_provider_id
        inner join hims_d_insurance_sub INSH on INSH.hims_d_insurance_sub_id = INS.sub_insurance_id
        where INS.hims_f_insurance_statement_id = ?;
        select hims_f_invoice_header_id, invoice_number, invoice_date, invoice_type, IH.patient_id, visit_id, episode_id, IH.claim_status,
 policy_number, insurance_provider_id, sub_insurance_id, network_id, network_office_id, card_number, 
 gross_amount, discount_amount, net_amount, patient_resp, patient_tax, 
 patient_payable, company_resp, company_tax, company_payable, sec_company_resp, 
 sec_company_tax, sec_company_payable, submission_date, 
 remittance_date, COALESCE(remittance_amount,0) as remittance_amount, denial_amount, claim_validated, card_holder_name, 
 card_holder_age, card_holder_gender, card_class, insurance_statement_id,P.patient_code,P.full_name as pat_name,
 submission_amount2,submission_amount3,E.employee_code,E.full_name as doc_name,
 COALESCE(remittance_amount2, 0) as remittance_amount2,COALESCE(remittance_amount3, 0) as remittance_amount3,
 denial_amount2,denial_amount3,submission_amount from hims_f_invoice_header as IH
 inner join hims_f_patient as P on P.hims_d_patient_id = IH.patient_id inner join hims_f_patient_visit as V
 on V.hims_f_patient_visit_id = IH.visit_id inner join hims_d_employee as E on E.hims_d_employee_id = V.doctor_id where
  ${condition} and claim_status like '%${submission_step}';`,
        values: [hims_f_insurance_statement_id],
        printQuery: true,
      })
      .then((result) => {
        let otherObjet = {};
        let level = submission_step;
        const claims = result[1];
        // const remittance_amount = _.sumBy(claims, (s) =>
        //   parseFloat(s[`remittance_amount${level === "1" ? "" : level}`])
        // );
        const denial_amount = _.sumBy(claims, (s) =>
          parseFloat(s[`denial_amount${level === "1" ? "" : level}`])
        );
        const submission_amount = _.sumBy(claims, (s) =>
          parseFloat(s[`submission_amount${level === "1" ? "" : level}`])
        );

        console.log("claims", claims);

        const remittance_amount = _.sumBy(
          claims,
          (s) =>
            parseFloat(s.remittance_amount) +
            parseFloat(s.remittance_amount2) +
            parseFloat(s.remittance_amount3)
        );

        console.log("remittance_amount", remittance_amount);
        // const remittance_amount = _.sumBy(claims, (s) =>
        //   parseFloat(s.remittance_amount2)
        // );
        // const remittance_amount = _.sumBy(claims, (s) =>
        //   parseFloat(s.remittance_amount3)
        // );

        otherObjet = {
          calc_remittance_amount:
            result[0][0].insurance_status === "C"
              ? result[0][0].total_remittance_amount
              : remittance_amount,
          calc_denial_amount:
            result[0][0].insurance_status === "C"
              ? result[0][0].total_denial_amount
              : denial_amount,
          cals_submission_amount: submission_amount,
        };

        let final_result = {
          ...result[0][0],
          ...otherObjet,
          ...{ claims: result[1] },
        };
        _mysql.releaseConnection();
        req.records = final_result;
        next();
      })
      .catch((error) => {
        _mysql.closeConnection();
        next(error);
      });
  } catch (error) {
    _mysql.releaseConnection();
    next();
  }
}

export function updateInsuranceStatement_backup(req, res, next) {
  const _mysql = new algaehMysql();
  const input = req.body;
  try {
    // updating invoice header
    _mysql
      .executeQuery({
        query: `update hims_f_invoice_header set remittance_amount=?, denial_amount=? where hims_f_invoice_header_id=?;`,
        values: [
          input.remittance_amount,
          input.denial_amount,
          input.hims_f_invoice_header_id,
        ],
      })
      .then(() => {
        // getting sum of all invoice headers belong to a statement
        _mysql
          .executeQuery({
            query: `select sum(remittance_amount) as total_remittance_amount, sum(denial_amount) as total_denial_amount from hims_f_invoice_header where insurance_statement_id=?;`,
            values: [input.insurance_statement_id],
          })
          .then((result) => {
            // updating the total amount in statement
            _mysql
              .executeQuery({
                query: `update hims_f_insurance_statement set total_remittance_amount=?, total_denial_amount=? where hims_f_insurance_statement_id=?`,
                values: [
                  result[0].total_remittance_amount,
                  result[0].total_denial_amount,
                  input.insurance_statement_id,
                ],
              })
              .then((result) => {
                _mysql.releaseConnection();
                req.records = result;
                next();
              })
              .catch((error) => {
                _mysql.closeConnection(() => {
                  next(error);
                });
              });
          })
          .catch((error) => {
            _mysql.closeConnection(() => {
              next(error);
            });
          });
      })
      .catch((error) => {
        _mysql.closeConnection(() => {
          next(error);
        });
      });
  } catch (error) {
    _mysql.releaseConnection();
    next(error);
  }
}

export function updateInsuranceStatement(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const {
      invoice_header_id,
      invoice_detail_id,
      insurance_statement_id,
      remittance_amount,
      denial_amount,
      denial_reason_id,
      cpt_code,
      claim_status,
    } = req.body;

    let level = claim_status ? claim_status.match(/(\d+)/)[0] : "1";

    console.log("level", level);
    _mysql
      .executeQueryWithTransaction({
        query: `update hims_f_invoice_details set r${level}_amt= ${remittance_amount},
        s${level == 1 ? 2 : 3}_amt= ${denial_amount},
      d${level}_amt= ${denial_amount},
      d${level}_reason_id=${denial_reason_id},
      cpt_code="${cpt_code}"
      where hims_f_invoice_details_id =${invoice_detail_id};`,
      })
      .then((result) => {
        _mysql
          .executeQuery({
            query: `select sum(r${level}_amt) as ramt,sum(d${level}_amt) as damt from hims_f_invoice_details 
      where invoice_header_id=?`,
            values: [invoice_header_id],
          })
          .then((result) => {
            let rest = { ramt: 0, damt: 0 };
            if (result.length > 0) {
              rest = { ...result[0] };
            }
            _mysql
              .executeQuery({
                query: `update hims_f_invoice_header set remittance_amount${
                  level == 1 ? "" : level
                }=${rest["ramt"]}, claim_status=?,
                  denial_amount${level == 1 ? "" : level}=${
                  rest["damt"]
                },remittance_date=?,submission_amount${level == 1 ? 2 : 3}=${
                  rest["damt"]
                } where hims_f_invoice_header_id=?`,
                values: [claim_status, new Date(), invoice_header_id],
              })
              .then((records) => {
                //submission_step=? level,
                _mysql
                  .executeQuery({
                    query: `update hims_f_insurance_statement set total_remittance_amount =?,total_denial_amount=? where 
           hims_f_insurance_statement_id=?`,
                    values: [
                      rest["ramt"],
                      rest["damt"],

                      insurance_statement_id,
                    ],
                  })
                  .then(() => {
                    _mysql.commitTransaction(() => {
                      next();
                    });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          })
          .catch((error) => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      })
      .catch((error) => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
}

export function getInvoiceDetails(req, res, next) {
  const _mysql = new algaehMysql();
  const input = req.query;
  try {
    _mysql
      .executeQuery({
        query: `SELECT hims_f_invoice_details_id,IVD.cpt_code,invoice_header_id,company_payable,company_resp,company_tax,SE.service_name, s1_amt, s2_amt, s3_amt, r1_amt, d1_amt, d1_reason_id,
        r2_amt, d2_amt, d2_reason_id, r3_amt, d3_amt, d3_reason_id FROM hims_d_services SE, hims_f_invoice_details IVD
          where IVD.service_id = SE.hims_d_services_id and invoice_header_id=?;`,
        values: [input.invoice_header_id],
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
}

export function closeStatement(req, res, next) {
  const _mysql = new algaehMysql();
  const input = req.body;
  try {
    _mysql
      .executeQuery({
        query: `update hims_f_insurance_statement set total_remittance_amount=?,total_denial_amount=?,writeoff_amount=?,insurance_status=? where 
        hims_f_insurance_statement_id=?`,
        values: [
          input.total_remittance_amount,
          input.total_denial_amount,
          input.writeoff_amount,
          input.insurance_status,
          input.hims_f_insurance_statement_id,
        ],
        printQuery: true,
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
}
