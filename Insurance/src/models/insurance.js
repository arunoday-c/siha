import algaehMysql from "algaeh-mysql";
module.exports = {
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
            new Date()
          ],

          printQuery: false
        })
        .then(resdata => {
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
        .catch(error => {
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
          query: `select * from hims_d_insurance_provider where record_status='A' ${qryStr} order by hims_d_insurance_provider_id desc`,

          printQuery: false
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
      next(e);
    }
  },
  //created by:irfan
  getSubInsurance: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.query;

      let qryStr = "";
      if (input.insurance_sub_code > 0) {
        qryStr += " and insurance_sub_code=" + input.insurance_sub_code;
      }

      _mysql
        .executeQuery({
          query: `select * from hims_d_insurance_sub where record_status='A' ${qryStr} `,

          printQuery: false
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
      next(e);
    }
  },
  //created by:irfan
  addInsuranceProvider: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputparam = req.body;

      _mysql
        .executeQuery({
          query:
            "INSERT INTO hims_d_insurance_provider(`insurance_provider_code`,`insurance_provider_name`,`arabic_provider_name`,\
          `deductible_proc`,`deductible_lab`,`co_payment`,`insurance_type`,`package_claim`,`hospital_id`, `payer_id`,\
          `credit_period`,`insurance_limit`,`payment_type`,`insurance_remarks`,`cpt_mandate`,`child_id`,`currency`,\
          `preapp_valid_days`,`claim_submit_days`,`lab_result_check`,`resubmit_all`,`company_service_price_type`,`ins_rej_per`,`effective_start_date`,\
          `effective_end_date`,`created_by`)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
            inputparam.effective_start_date,
            inputparam.effective_end_date,
            inputparam.created_by
          ],

          printQuery: false
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
          `preapp_valid_days`=?,`claim_submit_days`=?,`lab_result_check`=?,`resubmit_all`=?,`company_service_price_type`=?,`ins_rej_per`=?,`effective_start_date`=?,\
          `effective_end_date`=?,`updated_by`=? WHERE  `hims_d_insurance_provider_id`=? AND `record_status`='A'",
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
            inputparam.effective_start_date,
            inputparam.effective_end_date,
            req.userIdentity.algaeh_d_app_user_id,
            inputparam.hims_d_insurance_provider_id
          ],

          printQuery: false
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
      next(e);
    }
  },
  //created by:irfan
  addSubInsuranceProvider: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputparam = req.body;

      const insurtColumns = [
        "insurance_sub_code",
        "insurance_sub_name",
        "arabic_sub_name",
        "insurance_provider_id",
        "card_format",
        "transaction_number",
        "effective_start_date",
        "effective_end_date"
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
            updated_by: req.userIdentity.algaeh_d_app_user_id
          },
          printQuery: false
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
            `arabic_sub_name`=?,`insurance_provider_id`=?,`card_format`=?,\
            `transaction_number`=?,`effective_start_date`=?,`effective_end_date`=?,`updated_by`=?\
             WHERE  `hims_d_insurance_sub_id`=? AND `record_status`='A'",
          values: [
            inputparam.insurance_sub_code,
            inputparam.insurance_sub_name,
            inputparam.arabic_sub_name,
            inputparam.insurance_provider_id,
            inputparam.card_format,
            inputparam.transaction_number,
            inputparam.effective_start_date,
            inputparam.effective_end_date,
            req.userIdentity.algaeh_d_app_user_id,
            inputparam.hims_d_insurance_sub_id
          ],

          printQuery: false
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
            req.userIdentity.algaeh_d_app_user_id
          ],
          printQuery: false
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
            req.userIdentity.algaeh_d_app_user_id
          ],

          printQuery: false
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
      next(e);
    }
  },

  //created by irfan: to add  both network and network office andservices
  //of hospital (insurence plan master)

  addPlanAndPolicy: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.body[0];

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
            new Date(),
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            req.userIdentity.algaeh_d_app_user_id
          ],

          printQuery: false
        })
        .then(result => {
          if (result.length > 0) {
            // _mysql.commitTransaction(() => {
            //   _mysql.releaseConnection();
            //   req.records = result;
            //   next();
            // });

            _mysql
              .executeQuery({
                query:
                  "INSERT INTO hims_d_insurance_network_office(`network_id`,`hospital_id`,`deductible`,`deductable_type`,`min_value`,`max_value`,`copay_consultation`,\
              `deductible_lab`,`for_alllab`,`copay_percent`,`deductible_rad`,`for_allrad`,`copay_percent_rad`,`copay_percent_trt`,\
              `copay_percent_dental`,`copay_medicine`,`insur_network_limit`,`deductible_trt`,`deductible_dental`,`deductible_medicine`,`lab_min`,\
              `lab_max`,`rad_min`,`rad_max`,`trt_max`,`trt_min`,`dental_min`,`dental_max`,`medicine_min`,`medicine_max`,`invoice_max_liability`,\
              `for_alltrt`,`for_alldental`,`for_allmedicine`,`invoice_max_deduct`,`price_from`,`employer`,`policy_number`,`follow_up`,`preapp_limit`,\
              `deductible_ip`,`copay_ip`,`ip_min`,`ip_max`,`for_allip`,`consult_limit`,`preapp_limit_from`,`copay_maternity`,`maternity_min`,`maternity_max`,\
              `copay_optical`,`optical_min`,`optical_max`,`copay_diagnostic`,`diagnostic_min`,`diagnostic_max`,`created_by`,`updated_by`)\
              SELECT " +
                  input.network_id +
                  ",hims_d_hospital_id," +
                  input.deductible +
                  "," +
                  input.deductable_type +
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
                  " from hims_d_hospital",
                printQuery: false
              })
              .then(result => {
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
                        input.network_id +
                        ",hims_d_services_id,service_code,service_type_id,cpt_code,service_name,service_name,hospital_id,standard_fee,standard_fee," +
                        input.created_by +
                        "," +
                        input.created_by +
                        " from hims_d_services",

                      printQuery: false
                    })
                    .then(policyresult => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = policyresult;
                        next();
                      });
                    })
                    .catch(error => {
                      mysql.rollBackTransaction(() => {
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
                        obj.insurance_provider_id +
                        ",hims_d_services_id,service_code,service_type_id,cpt_code,service_name,service_name,hospital_id,standard_fee,standard_fee," +
                        obj.created_by +
                        "," +
                        obj.created_by +
                        " from hims_d_services",

                      printQuery: false
                    })
                    .then(result_service_Ins => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = result_service_Ins;
                        next();
                      });
                    })
                    .catch(error => {
                      mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    });
                } else {
                  mysql.rollBackTransaction(() => {
                    req.records = result;

                    next();
                  });
                }
              })
              .catch(error => {
                mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            mysql.rollBackTransaction(() => {
              req.records = result;

              next();
            });
          }
        })
        .catch(error => {
          mysql.rollBackTransaction(() => {
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
            req.body.hims_d_insurance_sub_id
          ],

          printQuery: false
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
      next(e);
    }
  },
  //created by:irfan
  getPriceList: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.query;

      let val_inputs = [];

      let qryStr = "";
      if (input.insurance_id > 0) {
        qryStr += " and insurance_id=? ";
        val_inputs.push(input.insurance_id);
      }
      if (input.services_id > 0) {
        qryStr += " and services_id=? ";
        val_inputs.push(input.services_id);
      }

      _mysql
        .executeQuery({
          query:
            "select * from hims_d_services_insurance where record_status='A'  " +
            qryStr,
          values: [val_inputs],

          printQuery: false
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
          `pre_approval`=?,`covered`=?,`updated_by`=?, `updated_date`=? WHERE `record_status`='A' and \
          `hims_d_services_insurance_id`=?",
          values: [
            inputParam.insurance_service_name,
            inputParam.cpt_code,
            inputParam.gross_amt,
            inputParam.corporate_discount_amt,
            inputParam.net_amount,
            inputParam.pre_approval,
            inputParam.covered,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_d_services_insurance_id
          ],

          printQuery: false
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
            inputparam.hims_d_insurance_network_id
          ],

          printQuery: false
        })
        .then(result => {
          if (result.length > 0) {
            _mysql
              .executeQuery({
                query:
                  "update hims_d_insurance_network_office SET `network_id`=?,`hospital_id`=?,`deductible`=?,`deductable_type`=?,`min_value`=?,`max_value`=?,`copay_consultation`=?,\
              `deductible_lab`=?,`for_alllab`=?,`copay_percent`=?,`deductible_rad`=?,`for_allrad`=?,`copay_percent_rad`=?,`copay_percent_trt`=?,\
              `copay_percent_dental`=?,`copay_medicine`=?,`insur_network_limit`=?,`deductible_trt`=?,`deductible_dental`=?,`deductible_medicine`=?,`lab_min`=?,\
              `lab_max`=?,`rad_min`=?,`rad_max`=?,`trt_max`=?,`trt_min`=?,`dental_min`=?,`dental_max`=?,`medicine_min`=?,`medicine_max`=?,`invoice_max_liability`=?,\
              `for_alltrt`=?,`for_alldental`=?,`for_allmedicine`=?,`invoice_max_deduct`=?,`price_from`=?,`employer`=?,`policy_number`=?,`follow_up`=?,`preapp_limit`=?,\
              `deductible_ip`=?,`copay_ip`=?,`ip_min`=?,`ip_max`=?,`for_allip`=?,`consult_limit`=?,`preapp_limit_from`=?,`copay_maternity`=?,`maternity_min`=?,`maternity_max`=?,\
              `copay_optical`=?,`optical_min`=?,`optical_max`=?,`copay_diagnostic`=?,`diagnostic_min`=?,`diagnostic_max`=?,`updated_date`=?,`updated_by`=? WHERE  `hims_d_insurance_network_office_id`=? AND `record_status`='A'",
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
                  inputparam.hims_d_insurance_network_office_id
                ],
                printQuery: false
              })
              .then(result2 => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = result2;
                  next();
                });
              })
              .catch(error => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            mysql.rollBackTransaction(() => {
              req.records = result;

              next();
            });
          }
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      next(e);
    }
  },

  //created by nowshad
  updatePriceListBulk: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputparam = req.body;
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

      _mysql
        .executeQuery({
          query: strQuery,
          values: [parameters],
          printQuery: false
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
            "UPDATE hims_d_insurance_network_office SET  record_status='I', \
          updated_by=?,updated_date=? WHERE hims_d_insurance_network_office_id=?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.body.hims_d_insurance_network_office_id
          ],
          printQuery: false
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

          printQuery: false
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
      next(e);
    }
  },
  //created by irfan
  getSubInsuraces: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _stringData = "";

      if (req.query.insurance_provider_id != null) {
        _stringData =
          " and insurance_provider_id=" + req.query.insurance_provider_id;
      }

      _mysql
        .executeQuery({
          query:
            " SELECT hims_d_insurance_provider_id, insurance_provider_code,\
        insurance_provider_name, arabic_provider_name from hims_d_insurance_provider where record_status='A' " +
            _stringData,

          printQuery: false
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
      next(e);
    }
  }
};
