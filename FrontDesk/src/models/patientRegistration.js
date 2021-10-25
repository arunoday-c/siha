import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";

import axios from "axios";
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") dotenv.config();

const processENV = process.env;
const PORTAL_HOST = processENV.PORTAL_HOST ?? "http://localhost:4402/api/v1/";
export default {
  registerPatient: (req, res, next) => {
    const _mysql = new algaehMysql();
    //ss
    let custom = {};
    let numGens = ["PAT_REGS"];
    if (
      req.body.mrn_num_sep_cop_client === "Y" &&
      req.body.insurance_type === "C"
    ) {
      custom = {
        custom: {
          returnKey: "PAT_REGS",
          primaryKeyName: "hims_d_insurance_provider_id",
          tableName: "hims_d_insurance_provider",
          primaryKeyValue: req.body.hims_d_insurance_provider_id,
          descriptionKeyName: "insurance_provider_name",
        },
      };
    } else {
      numGens.push("PAT_REGS");
      custom = {};
    }

    _mysql
      .generateRunningNumber({
        user_id: req.userIdentity.algaeh_d_app_user_id,
        // numgexn_codes: ["PAT_REGS", "PAT_VISIT", "PAT_BILL", "RECEIPT"],
        numgen_codes: numGens,
        table_name: "hims_f_app_numgen",
        ...custom,
      })
      .then((generatedNumbers) => {
        req.connection = {
          connection: _mysql.connection,
          isTransactionConnection: _mysql.isTransactionConnection,
          pool: _mysql.pool,
        };
        req.body.patient_code = generatedNumbers.PAT_REGS;
        next();
      })
      .catch((e) => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },

  insertPatientData: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputparam = { ...req.body };
      // const utilities = new algaehUtilities();

      // console.log("genNumber: ", inputparam.patient_code);
      // inputparam.registration_date = new Date();
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_f_patient` (`patient_code`, `registration_date`\
          , `title_id`, `first_name`, `middle_name`, `last_name`, `full_name`, `arabic_name`, `gender`, `religion_id`\
          , `date_of_birth`, `age`, `blood_group`,`marital_status`, `address1`, `address2`, `tel_code`, `contact_number`\
          , `secondary_contact_number`, `email`, `emergency_contact_name`, `emergency_contact_number`\
          , `relationship_with_patient`, `visa_type_id`, `nationality_id`, `postal_code`\
          , `primary_identity_id`, `primary_id_no`, `secondary_identity_id`, `secondary_id_no`,referring_institute_id\
          , `photo_file`, `primary_id_file`, `secondary_id_file`, `patient_type`,`vat_applicable`, `created_by`, `created_date`\
          ,`city_id`,`state_id`,`country_id`,`employee_id`,hospital_id)\
           VALUES (?,?,?,?, ?, ?, ?,?, ?, ?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?);",
          values: [
            inputparam.patient_code,
            new Date(),
            // inputparam.registration_date != null
            //   ? new Date(inputparam.registration_date)
            //   : inputparam.registration_date,
            inputparam.title_id,
            inputparam.first_name,
            inputparam.middle_name,
            inputparam.last_name,
            inputparam.full_name,
            inputparam.arabic_name,
            inputparam.gender,
            inputparam.religion_id,
            inputparam.date_of_birth != null
              ? new Date(inputparam.date_of_birth)
              : inputparam.date_of_birth,
            inputparam.age,
            inputparam.blood_group,
            inputparam.marital_status,
            inputparam.address1,
            inputparam.address2,
            inputparam.tel_code,
            inputparam.contact_number,
            inputparam.secondary_contact_number,
            inputparam.email,
            inputparam.emergency_contact_name,
            inputparam.emergency_contact_number,
            inputparam.relationship_with_patient,
            inputparam.visa_type_id,
            inputparam.nationality_id,
            inputparam.postal_code,
            inputparam.primary_identity_id,
            inputparam.primary_id_no.trim(),
            inputparam.secondary_identity_id,
            inputparam.secondary_id_no
              ? inputparam.secondary_id_no.trim()
              : null,

            inputparam.referring_institute_id,
            inputparam.photo_file,
            inputparam.primary_id_file,
            inputparam.secondary_id_file,
            inputparam.patient_type,
            inputparam.vat_applicable,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputparam.city_id,
            inputparam.state_id,
            inputparam.country_id,
            inputparam.employee_id,
            req.userIdentity.hospital_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          req.body.patient_id = result.insertId;

          if (req.connection == null || req.pat_reg === true) {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            });
          } else {
            next();
          }
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  getVisitServiceAmount: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select ins_services_amount, approval_limit_yesno from hims_f_patient_visit where hims_f_patient_visit_id=?",
          values: [req.query.hims_f_patient_visit_id],
          printQuery: true,
        })
        .then((VisitServiceAmount) => {
          console.log("VisitServiceAmount", VisitServiceAmount);
          _mysql.releaseConnection();
          req.records = VisitServiceAmount;
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
  },
  //created by:irfan
  getAdmissionInsurance: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let inputParam = req.query;

      const utilities = new algaehUtilities();
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  //created by:irfan
  getPatientInsurance: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let inputParam = req.query;

      const utilities = new algaehUtilities();
      /* Select statemwnt  */

      console.log("inputParam", inputParam);
      if (req.query.source === "I") {
        _mysql
          .executeQuery({
            query:
              "SELECT insurance_yesno, insurance_provider_id, insurance_network_office_id, \
              insurance_network_office_id as  hims_d_insurance_network_office_id, network_id FROM \
              hims_adm_atd_admission where hims_adm_atd_admission_id=?;",
            values: [inputParam.ip_id],
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
      } else {
        if (req.query.patient_visit_id != null) {
          _mysql
            .executeQuery({
              query:
                "SELECT A.* ,B.* FROM \
              (select mIns.patient_id as pri_patient_id, mIns.patient_visit_id as pri_patient_visit_id,\
              mIns.primary_insurance_provider_id as insurance_provider_id,\
              Ins.insurance_provider_name as insurance_provider_name,\
              mIns.primary_sub_id as sub_insurance_provider_id ,\
              sIns.insurance_sub_name as sub_insurance_provider_name, sIns.user_id, sIns.creidt_limit_req, \
              sIns.creidt_limit, sIns.creidt_amount_till, mIns.primary_network_id as network_id, \
              net.network_type,netoff.policy_number,netoff.hims_d_insurance_network_office_id, netoff.preapp_limit as preapp_limit_amount, \
              mIns.primary_card_number as card_number,\
              mIns.primary_inc_card_path as insurance_card_path,\
              mIns.primary_effective_start_date,mIns.primary_effective_end_date,mIns.primary_effective_end_date as effective_end_date,\
              mIns.card_holder_name, mIns.card_holder_age, mIns.card_holder_gender, mIns.card_class ,iCClas.card_class_name, \
              Ins.insurance_type from (((((hims_d_insurance_provider Ins \
              INNER JOIN  hims_m_patient_insurance_mapping mIns ON mIns.primary_insurance_provider_id=Ins.hims_d_insurance_provider_id)\
              INNER JOIN  hims_d_insurance_sub sIns ON mIns.primary_sub_id= sIns.hims_d_insurance_sub_id) \
              LEFT JOIN hims_d_insurance_card_class iCClas ON mIns.card_class = iCClas.hims_d_insurance_card_class_id)\
              INNER JOIN hims_d_insurance_network net ON mIns.primary_network_id=net.hims_d_insurance_network_id)\
              INNER JOIN hims_d_insurance_network_office netoff ON mIns.primary_policy_num=netoff.policy_number and mIns.primary_network_id = netoff.network_id) where mIns.patient_id=?  and mIns.patient_visit_id =?\
              GROUP BY mIns.primary_policy_num)  AS A\
              left join\
              (select  mIns.patient_id as sec_patient_id , mIns.patient_visit_id  as sec_patient_visit_id, mIns.secondary_insurance_provider_id , \
              Ins.insurance_provider_name as secondary_insurance_provider_name,\
              mIns.secondary_sub_id as secondary_sub_insurance_provider_id,\
              sIns.insurance_sub_name as secondary_sub_insurance_provider_name, sIns.user_id as sec_user_id,\
              sIns.creidt_limit_req as sec_creidt_limit_req, \
              sIns.creidt_limit as sec_creidt_limit, sIns.creidt_amount_till as sec_creidt_amount_till,mIns.secondary_network_id ,\
              net.network_type as secondary_network_type,\
              netoff.policy_number as secondary_policy_number,netoff.hims_d_insurance_network_office_id as secondary_network_office_id ,mIns.secondary_card_number,mIns.secondary_inc_card_path,\
              mIns.secondary_effective_start_date,mIns.secondary_effective_end_date, netoff.preapp_limit as sec_preapp_limit \
              from ((((hims_d_insurance_provider Ins \
              INNER JOIN  hims_m_patient_insurance_mapping mIns ON mIns.secondary_insurance_provider_id=Ins.hims_d_insurance_provider_id)\
              INNER JOIN  hims_d_insurance_sub sIns ON mIns.secondary_sub_id= sIns.hims_d_insurance_sub_id) \
              INNER JOIN hims_d_insurance_network net ON mIns.secondary_network_id=net.hims_d_insurance_network_id)\
              INNER JOIN hims_d_insurance_network_office netoff ON mIns.secondary_policy_num=netoff.policy_number and mIns.primary_network_id = netoff.network_id) where mIns.patient_id=? and mIns.patient_visit_id =?\
              GROUP BY mIns.secondary_policy_num) AS B  on A.pri_patient_id=B.sec_patient_id ;",
              values: [
                inputParam.patient_id,
                inputParam.patient_visit_id,
                inputParam.patient_id,
                inputParam.patient_visit_id,
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
        } else {
          _mysql
            .executeQuery({
              query:
                "(select  mIns.patient_id,mIns.primary_insurance_provider_id as insurance_provider_id,Ins.insurance_provider_name,\
                mIns.primary_sub_id as sub_insurance_provider_id, sIns.insurance_sub_name as sub_insurance_provider_name,\
                sIns.user_id, sIns.creidt_limit_req, \
                sIns.creidt_limit, sIns.creidt_amount_till, \
                mIns.primary_network_id as network_id,  net.network_type,netoff.policy_number,netoff.hims_d_insurance_network_office_id,mIns.primary_card_number as card_number,\
                mIns.primary_inc_card_path as insurance_card_path,\
               mIns.primary_effective_start_date,mIns.primary_effective_end_date,mIns.primary_effective_end_date as effective_end_date,\
               mIns.card_holder_name, mIns.card_holder_age, mIns.card_holder_gender, mIns.card_class  \
               from ((((hims_d_insurance_provider Ins \
                INNER JOIN  hims_m_patient_insurance_mapping mIns ON mIns.primary_insurance_provider_id=Ins.hims_d_insurance_provider_id)\
                 INNER JOIN  hims_d_insurance_sub sIns ON mIns.primary_sub_id= sIns.hims_d_insurance_sub_id) \
                 INNER JOIN hims_d_insurance_network net ON mIns.primary_network_id=net.hims_d_insurance_network_id)\
                 INNER JOIN hims_d_insurance_network_office netoff ON mIns.primary_policy_num=netoff.policy_number and mIns.primary_network_id = netoff.network_id) where mIns.patient_id=?\
                 GROUP BY mIns.primary_policy_num)\
                 union\
                 (select  mIns.patient_id,mIns.secondary_insurance_provider_id , Ins.insurance_provider_name,\
                  mIns.secondary_sub_id,sIns.insurance_sub_name, sIns.user_id as sec_user_id, sIns.creidt_limit_req as sec_creidt_limit_req, \
                  sIns.creidt_limit as sec_creidt_limit, sIns.creidt_amount_till as sec_creidt_amount_till,\
                  mIns.secondary_network_id, net.network_type,netoff.policy_number,netoff.hims_d_insurance_network_office_id as\
                   secondary_network_office_id,mIns.secondary_card_number,mIns.secondary_inc_card_path,\
                 mIns.secondary_effective_start_date,mIns.secondary_effective_end_date,mIns.secondary_effective_end_date as effective_end_date,\
                 mIns.card_holder_name, mIns.card_holder_age, mIns.card_holder_gender, mIns.card_class \
                 from ((((hims_d_insurance_provider Ins \
                INNER JOIN  hims_m_patient_insurance_mapping mIns ON mIns.secondary_insurance_provider_id=Ins.hims_d_insurance_provider_id)\
                 INNER JOIN  hims_d_insurance_sub sIns ON mIns.secondary_sub_id= sIns.hims_d_insurance_sub_id) \
                 INNER JOIN hims_d_insurance_network net ON mIns.secondary_network_id=net.hims_d_insurance_network_id)\
                 INNER JOIN hims_d_insurance_network_office netoff ON mIns.secondary_policy_num=netoff.policy_number and mIns.primary_network_id = netoff.network_id) where mIns.patient_id=?\
                 GROUP BY mIns.secondary_policy_num);",
              values: [inputParam.patient_id, inputParam.patient_id],
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
        }
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  updatePatientData: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputparam = { ...req.body };
      // const utilities = new algaehUtilities();

      // utilities.logger().log("genNumber: ", inputparam.patient_code);
      // inputparam.registration_date = new Date();
      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_f_patient` SET `title_id`=?, `full_name`=?, \
            `arabic_name`=?, `gender`=?, `religion_id`=?,\
           `date_of_birth`=?, `age`=?,`blood_group`=?, `marital_status`=?, `address1`=?, `address2`=?, `tel_code`=?, `contact_number`=?,\
           `secondary_contact_number`=?, `email`=?, `emergency_contact_name`=?, `emergency_contact_number`=?,\
           `relationship_with_patient`=?, `visa_type_id`=?, `nationality_id`=?, `postal_code`=?,\
           `primary_identity_id`=?, `primary_id_no`=?, `secondary_identity_id`=?, `secondary_id_no`=?,referring_institute_id=?,\
           `photo_file`=?, `primary_id_file`=?, `secondary_id_file`=?, `patient_type`=?,\
          `city_id`=?,`state_id`=?,`country_id` =?, `employee_id`=?,`updated_by`=?, `updated_date`=? where hims_d_patient_id=?",
          values: [
            inputparam.title_id,
            inputparam.full_name,
            inputparam.arabic_name,
            inputparam.gender,
            inputparam.religion_id,
            inputparam.date_of_birth != null
              ? new Date(inputparam.date_of_birth)
              : inputparam.date_of_birth,
            inputparam.age,
            inputparam.blood_group,
            inputparam.marital_status,
            inputparam.address1,
            inputparam.address2,
            inputparam.tel_code,
            inputparam.contact_number,
            inputparam.secondary_contact_number,
            inputparam.email,
            inputparam.emergency_contact_name,
            inputparam.emergency_contact_number,
            inputparam.relationship_with_patient,
            inputparam.visa_type_id,
            inputparam.nationality_id,
            inputparam.postal_code,
            inputparam.primary_identity_id,
            inputparam.primary_id_no.trim(),
            inputparam.secondary_identity_id,
            inputparam.secondary_id_no === null
              ? null
              : inputparam.secondary_id_no.trim(),
            inputparam.referring_institute_id,
            inputparam.photo_file,
            inputparam.primary_id_file,
            inputparam.secondary_id_file,
            inputparam.patient_type,

            inputparam.city_id,
            inputparam.state_id,
            inputparam.country_id,
            inputparam.employee_id,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputparam.hims_d_patient_id,
          ],
          printQuery: true,
        })
        .then(async (result) => {
          if (inputparam.portal_exists === "Y") {
            const portal_data = {
              patient_identity: inputparam.primary_id_no,
              patient_code: inputparam.patient_code,
              identity_type: inputparam.identity_type,
              patient_name: inputparam.full_name,
              patient_dob: inputparam.date_of_birth,
              patient_gender: inputparam.gender,
              mobile_no: `${inputparam.tel_code}${inputparam.contact_number}`,
              email_id: inputparam.email,
            };

            // console.log("PORTAL_HOST", PORTAL_HOST);
            // console.log("portal_data", portal_data);
            // consol.log("portal_data", portal_data);
            await axios
              .post(
                `${PORTAL_HOST}/info/updatepatientRegistration`,
                portal_data
              )
              .catch((e) => {
                throw e;
              });
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            });
          } else {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            });
          }
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  //created by:irfan
  getPatientAdvaceAndRefund: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let inputParam = req.query;

      const utilities = new algaehUtilities();
      /* Select statemwnt  */

      _mysql
        .executeQuery({
          query: `select hims_f_patient_advance_id,hims_f_patient_id,A.hims_f_receipt_header_id,A.advance_amount,
              case transaction_type  when 'AD' then 'Advance' when 'RF' then 'Refund' end as transaction_type,
              date_format(R.receipt_date, '%d-%m-%Y') as receipt_date, U.username as cashier, R.receipt_number  from hims_f_patient_advance A
              inner join hims_f_receipt_header R on A.hims_f_receipt_header_id = R.hims_f_receipt_header_id
              left join algaeh_d_app_user U on A.created_by = U.algaeh_d_app_user_id
              where A.hims_f_patient_id = ? and A.record_status = 'A' and R.record_status = 'A';`,
          values: [inputParam.patient_id],
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
  },
  releaseDB: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      _mysql.commitTransaction(() => {
        _mysql.releaseConnection();
        req.records = { patient_code: req.body.patient_code };
        next();
      });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
};
