import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";

module.exports = {
  insertPatientData: (req, res, next) => {
    try {
      const _mysql = req.mySQl == null ? new algaehMysql() : req.mySQl;
      let inputparam = { ...req.body };
      const utilities = new algaehUtilities();

      utilities.logger().log("genNumber: ", inputparam.patient_code);
      inputparam.registration_date = new Date();
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_f_patient` (`patient_code`, `registration_date`\
          , `title_id`, `first_name`, `middle_name`, `last_name`, `full_name`, `arabic_name`, `gender`, `religion_id`\
          , `date_of_birth`, `age`, `marital_status`, `address1`, `address2`, `contact_number`\
          , `secondary_contact_number`, `email`, `emergency_contact_name`, `emergency_contact_number`\
          , `relationship_with_patient`, `visa_type_id`, `nationality_id`, `postal_code`\
          , `primary_identity_id`, `primary_id_no`, `secondary_identity_id`, `secondary_id_no`\
          , `photo_file`, `primary_id_file`, `secondary_id_file`, `patient_type`,`vat_applicable`, `created_by`, `created_date`\
          ,`city_id`,`state_id`,`country_id`)\
           VALUES (?,?,?,?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);",
          values: [
            inputparam.patient_code,
            inputparam.registration_date != null
              ? new Date(inputparam.registration_date)
              : inputparam.registration_date,
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
            inputparam.marital_status,
            inputparam.address1,
            inputparam.address2,
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
            inputparam.primary_id_no,
            inputparam.secondary_identity_id,
            inputparam.secondary_id_no,
            inputparam.photo_file,
            inputparam.primary_id_file,
            inputparam.secondary_id_file,
            inputparam.patient_type,
            inputparam.vat_applicable,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputparam.city_id,
            inputparam.state_id,
            inputparam.country_id
          ]
        })
        .then(result => {
          req.body.patient_id = result.insertId;

          if (req.mySQl == null) {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            });
          } else {
            next();
          }
        })
        .catch(e => {
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
  getPatientInsurance: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        let inputParam = req.query;

        const utilities = new algaehUtilities();
        /* Select statemwnt  */

        utilities.logger().log("inputParam: ", inputParam);

        if (req.query.patient_visit_id != null) {
          _mysql
            .executeQuery({
              query:
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
              values: [
                inputParam.patient_id,
                inputParam.patient_visit_id,
                inputParam.patient_id,
                inputParam.patient_visit_id
              ],
              printQuery: true
            })
            .then(result => {
              _mysql.releaseConnection();
              req.records = result;
              resolve(result);
              next();
            })
            .catch(e => {
              reject(e);
              next(e);
            });
        } else {
          _mysql
            .executeQuery({
              query:
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
              values: [inputParam.patient_id, inputParam.patient_id],
              printQuery: true
            })
            .then(result => {
              _mysql.releaseConnection();
              req.records = result;
              resolve(result);
              next();
            })
            .catch(e => {
              reject(e);
              next(e);
            });
        }
      } catch (e) {
        next(e);
        reject(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  }
};
