import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import { LINQ } from "node-linq";
import { insertPatientData } from "./patientRegistration";

module.exports = {
  selectFrontDesk: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      const input = req.query;
      /* Select statemwnt  */

      let inputValues = [];
      let _stringData = "";
      if (input.hims_d_patient_id != null) {
        _stringData += " and hims_d_patient_id=?";
        inputValues.push(input.hims_d_patient_id);
      }

      if (input.patient_code != null) {
        _stringData += " and patient_code=?";
        inputValues.push(input.patient_code);
      }

      _mysql
        .executeQuery({
          query:
            "SELECT  `hims_d_patient_id`, `patient_code`\
          , `registration_date`, `title_id`,`first_name`, `middle_name`, `last_name`,`full_name`, `arabic_name`\
          , `gender`, `religion_id`,`date_of_birth`, `age`, `marital_status`, `address1`\
          , `address2`,`contact_number`, `secondary_contact_number`, `email`\
          , `emergency_contact_name`,`emergency_contact_number`, `relationship_with_patient`\
          , `visa_type_id`,`nationality_id`, `postal_code`, `primary_identity_id`\
          , `primary_id_no`,`secondary_identity_id`, `secondary_id_no`, `photo_file`,`vat_applicable`\
          , `primary_id_file`,`secondary_id_file`,`city_id`,`state_id`,`country_id`, `advance_amount`,`patient_type` FROM `hims_f_patient` \
           WHERE `record_status`='A'" +
            _stringData,
          values: inputValues,
          printQuery: true
        })
        .then(patient_details => {
          if (patient_details.length > 0) {
            let hims_d_patient_id = patient_details[0]["hims_d_patient_id"];

            _mysql
              .executeQuery({
                query:
                  "SELECT 0 radioselect, `hims_f_patient_visit_id`, `patient_id`,`visit_code`,`visit_status`\
              , `visit_type`, `visit_date`, `department_id`, `sub_department_id`\
              , `doctor_id`, `maternity_patient`, `is_mlc`, `mlc_accident_reg_no`\
              , `mlc_police_station`, `mlc_wound_certified_date`, `insured`, `sec_insured`, `no_free_visit`,\
              `visit_expiery_date`,`visit_status`\
               FROM `hims_f_patient_visit` WHERE `record_status`='A' AND \
               patient_id=? ORDER BY hims_f_patient_visit_id desc ",
                values: [hims_d_patient_id],
                printQuery: true
              })
              .then(visit_detsils => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  let result = {
                    patientRegistration: patient_details[0],
                    visitDetails: visit_detsils
                  };
                  req.records = result;
                  resolve(result);
                  next();
                });
              })
              .catch(e => {
                reject(e);
                next(e);
              });
          }
        })
        .catch(e => {
          reject(e);
          next(e);
        });
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  addFrontDesk: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };

    _mysql
      .generateRunningNumber({
        modules: ["PAT_REGS", "PAT_VISIT", "PAT_BILL", "RECEIPT"]
      })
      .then(generatedNumbers => {
        let patients = new LINQ(generatedNumbers)
          .Where(w => w.module_desc == "PAT_REGS")
          .FirstOrDefault();

        req.query.patient_code = patients.completeNumber;
        req.body.patient_code = patients.completeNumber;

        let visit = new LINQ(output)
          .Where(w => w.module_desc == "PAT_VISIT")
          .FirstOrDefault();

        req.query.visit_code = visit.completeNumber;
        req.body.visit_code = visit.completeNumber;

        const syscCall = async function() {
          let _insertPatient = await insertPatientData(req, res, next);

          let _insertPatientVisit = await insertPatientVisitData(
            req,
            res,
            next
          );
        };
        syscCall();
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  }
};
