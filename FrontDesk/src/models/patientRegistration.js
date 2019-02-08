import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";

module.exports = {
  insertPatientData: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        const utilities = new algaehUtilities();
        utilities.logger().log("genNumber: ", req.genNumber);
        let inputparam = { ...req.body };
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
            req.body.patient_id = result.patient_id;
            if (req.mySQl == null) {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = result;
                next();
              });
            } else {
              resolve(result);
            }
          })
          .catch(e => {
            next(e);
            reject(e);
          });
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
