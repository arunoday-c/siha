import algaehMysql from "algaeh-mysql";
import { LINQ } from "node-linq";
import moment from "moment";
import algaehUtilities from "algaeh-utilities/utilities";
import _ from "lodash";
export default {
  getPatientMrdList: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _stringData = "";

      if (req.query.from_date != null) {
        _stringData +=
          " and date(registration_date) between date('" +
          req.query.from_date +
          "') AND date('" +
          req.query.to_date +
          "')";
      } else {
        _stringData += " and date(registration_date) <= date(now())";
      }

      _mysql
        .executeQuery({
          query:
            "select hims_d_patient_id,patient_code,registration_date,first_name,middle_name,\
            last_name,full_name,arabic_name,gender,date_of_birth,age,marital_status,\
            contact_number,P.nationality_id ,N.nationality,secondary_contact_number,email,emergency_contact_name,emergency_contact_number,\
            relationship_with_patient,postal_code,\
            primary_identity_id,DOC.identity_document_name as primary_document_name,\
            primary_id_no,secondary_id_no,photo_file,primary_id_file,\
            secondary_id_file,advance_amount,patient_type,vat_applicable\
            from hims_f_patient P, hims_d_nationality N,hims_d_identity_document DOC\
            where P.record_status='A' and N.record_status='A' and DOC.record_status='A' and\
            P.nationality_id=N.hims_d_nationality_id and P.primary_identity_id=DOC.hims_d_identity_document_id \
            and P.hospital_id=? " +
            _stringData +
            "order by registration_date desc",
          values: [req.userIdentity.hospital_id],
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
      _mysql.releaseConnection();
      next(e);
    }
  },
  getPatientMrd: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select hims_d_patient_id, patient_code,registration_date,first_name,middle_name,\
            last_name,full_name,arabic_name,gender,date_of_birth,age,marital_status,\
            contact_number,P.nationality_id ,N.nationality,secondary_contact_number,email,emergency_contact_name,emergency_contact_number,\
            relationship_with_patient,postal_code,\
            primary_identity_id,DOC.identity_document_name as primary_document_name,\
            primary_id_no,secondary_id_no,photo_file,primary_id_file,\
            secondary_id_file,advance_amount,patient_type,vat_applicable\
            from hims_f_patient P, hims_d_nationality N,hims_d_identity_document DOC\
            where P.record_status='A' and N.record_status='A' and DOC.record_status='A' and\
            P.nationality_id=N.hims_d_nationality_id and P.primary_identity_id=DOC.hims_d_identity_document_id \
            and P.hospital_id=? and hims_d_patient_id=?",

          values: [req.userIdentity.hospital_id, req.query.hims_d_patient_id],
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
      _mysql.releaseConnection();
      next(e);
    }
  },
  getPatientEncounterDetails: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let _stringData = "";

      if (req.query.from_date != null) {
        _stringData += " and visit_id =" + req.query.visit_id;
      }
      _mysql
        .executeQuery({
          query:
            "select hims_f_patient_encounter_id, V.visit_code,PE.patient_id,P.full_name,PE.provider_id,\
              E.full_name as provider_name, visit_id,significant_signs,\
              V.insured,V.sec_insured,V.sub_department_id,SD.sub_department_name,PE.episode_id,PE.encounter_id,PE.updated_date as encountered_date,\
              primary_insurance_provider_id,IP.insurance_provider_name as pri_insurance_provider_name,PE.examination_notes,PE.assesment_notes,\
              secondary_insurance_provider_id,IPR.insurance_provider_name as sec_insurance_provider_name  from hims_f_patient_encounter PE  inner join  hims_f_patient P on\
              PE.patient_id=P.hims_d_patient_id   inner join hims_d_employee E on E.hims_d_employee_id=PE.provider_id  inner join hims_f_patient_visit V on V.hims_f_patient_visit_id=PE.visit_id\
              inner join hims_d_sub_department SD on V.sub_department_id=SD.hims_d_sub_department_id   left join hims_m_patient_insurance_mapping IM on\
              V.hims_f_patient_visit_id=IM.patient_visit_id  left join hims_d_insurance_provider IP  on IM.primary_insurance_provider_id=IP.hims_d_insurance_provider_id   left join hims_d_insurance_provider IPR  on \
              IM.secondary_insurance_provider_id=IPR.hims_d_insurance_provider_id   where PE.record_status='A' and P.record_status='A' and E.record_status='A' \
              and V.record_status='A' and SD.record_status='A'   and encounter_id <>'null' and PE.patient_id=?" +
            _stringData +
            "order by encountered_date desc;",
          values: [req.query.patient_id],
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
      _mysql.releaseConnection();
      next(e);
    }
  },
  getPatientEncounterDetailsForVisit: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      _mysql
        .executeQuery({
          query:
            "select hims_f_patient_encounter_id, V.visit_code,PE.patient_id,P.full_name,PE.provider_id,\
              E.full_name as provider_name, visit_id,significant_signs,\
              V.insured,V.sec_insured,V.sub_department_id,SD.sub_department_name,PE.episode_id,PE.encounter_id,PE.updated_date as encountered_date,\
              primary_insurance_provider_id,IP.insurance_provider_name as pri_insurance_provider_name,PE.examination_notes,PE.assesment_notes,\
              secondary_insurance_provider_id,IPR.insurance_provider_name as sec_insurance_provider_name  from hims_f_patient_encounter PE  inner join  hims_f_patient P on\
              PE.patient_id=P.hims_d_patient_id   inner join hims_d_employee E on E.hims_d_employee_id=PE.provider_id  inner join hims_f_patient_visit V on V.hims_f_patient_visit_id=PE.visit_id\
              inner join hims_d_sub_department SD on V.sub_department_id=SD.hims_d_sub_department_id   left join hims_m_patient_insurance_mapping IM on\
              V.hims_f_patient_visit_id=IM.patient_visit_id  left join hims_d_insurance_provider IP  on IM.primary_insurance_provider_id=IP.hims_d_insurance_provider_id   left join hims_d_insurance_provider IPR  on \
              IM.secondary_insurance_provider_id=IPR.hims_d_insurance_provider_id   where PE.record_status='A' and P.record_status='A' and E.record_status='A' \
              and V.record_status='A' and SD.record_status='A'   and encounter_id <>'null' and PE.patient_id=? and PE.visit_id=\
              order by encountered_date desc;",
          values: [req.query.patient_id],
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
      _mysql.releaseConnection();
      next(e);
    }
  },
  getPatientChiefComplaint: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select hims_f_episode_chief_complaint_id ,episode_id,chief_complaint_id,HH.hpi_description as chief_complaint, comment from hims_f_episode_chief_complaint ECC \
            left join hims_d_hpi_header HH on ECC.chief_complaint_id=HH.hims_d_hpi_header_id\
            Where ECC.record_status='A' and episode_id=?",
          values: [req.query.episode_id],
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
      _mysql.releaseConnection();
      next(e);
    }
  },

  getPatientDiagnosis: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _stringData = "";
      const input = req.query;
      if (input.episode_id != null) {
        _stringData += " and episode_id = ?" + input.episode_id;
      }
      if (input.patient_id != null) {
        _stringData += " and patient_id = ?" + input.patient_id;
      }
      _mysql
        .executeQuery({
          query: `select hims_f_patient_diagnosis_id,AU.user_display_name, patient_id, episode_id, daignosis_id,ICD.icd_code as daignosis_code,
            ICD.icd_description as daignosis_description  ,diagnosis_type, final_daignosis,
            PD.created_date as diagnosis_date    
              from hims_f_patient_diagnosis PD left join algaeh_d_app_user AU on AU.algaeh_d_app_user_id = PD.created_by,hims_d_icd ICD
             where PD.record_status='A' and   ICD.record_status='A'
             and PD.daignosis_id=ICD.hims_d_icd_id
            ${_stringData} order by diagnosis_date desc`,
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          if (input.fromHistoricalData) {
            const arrangedData = _.chain(result)
              .groupBy((g) => moment(g.diagnosis_date).format("DD-MM-YYYY"))
              .map((details, key) => {
                const { diagnosis_date, user_display_name } = _.head(details);

                return {
                  display_date: diagnosis_date,
                  user_name: user_display_name,
                  detailsOf: details,
                };
              })
              .value();
            // console.log("arrangedData", arrangedData);
            req.records = arrangedData;
          } else {
            req.records = result;
          }

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

  getPatientMedication: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _stringData = "";
      const input = req.query;

      if (input.encounter_id != null) {
        _stringData += " and encounter_id = ?" + input.encounter_id;
      }
      if (input.episode_id != null) {
        _stringData += " and episode_id = ?" + input.episode_id;
      }
      if (input.patient_id != null) {
        _stringData += " and patient_id = ?" + input.patient_id;
      }
      _mysql
        .executeQuery({
          query:
            "select  hims_f_prescription_id, patient_id,E.full_name as user_name,  encounter_id, provider_id, episode_id,\
            prescription_date, prescription_status , \
            hims_f_prescription_detail_id, prescription_id, item_id,IM.item_description, PD.generic_id, IG.generic_name, \
            dosage,med_units, frequency, no_of_days,\
            dispense, frequency_type, frequency_time, frequency_route, date(start_date) as start_date, PD.service_id, uom_id, \
            item_category_id, PD.item_status, PD.instructions\
             from hims_f_prescription P left join hims_d_employee E on E.hims_d_employee_id=P.provider_id ,hims_f_prescription_detail PD,hims_d_item_master IM,hims_d_item_generic IG\
            where P.record_status='A' and IM.record_status='A' and IG.record_status='A' and \
            P.hims_f_prescription_id=PD.prescription_id and PD.item_id=IM.hims_d_item_master_id \
            and PD.generic_id =IG.hims_d_item_generic_id " +
            _stringData +
            " order by prescription_date desc;",
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          if (input.fromHistoricalData) {
            const arrangedData = _.chain(result)
              .groupBy((g) => g.prescription_date)
              .map((details, key) => {
                const { prescription_date, user_name } = _.head(details);

                return {
                  display_date: prescription_date,
                  user_name: user_name,
                  detailsOf: details,
                };
              })
              .value();
            // console.log("arrangedData", arrangedData);
            req.records = arrangedData;
          } else {
            req.records = result;
          }

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
  getPatientDietHis: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _stringData = "";
      const input = req.query;

      if (input.episode_id != null) {
        _stringData += " and PD.episode_id = ?" + input.episode_id;
      }
      if (input.patient_id != null) {
        _stringData += " and PD.patient_id = ?" + input.patient_id;
      }
      _mysql
        .executeQuery({
          query:
            "SELECT D.hims_d_diet_description,PD.till_date,PD.created_date,USR.user_display_name \
            FROM hims_f_patient_diet PD \
            inner join hims_d_diet_master D on D.hims_d_diet_master_id=PD.diet_id \
            inner join algaeh_d_app_user USR on USR.algaeh_d_app_user_id=PD.created_by where PD.record_status='A' " +
            _stringData +
            ` order by PD.created_date desc;`,
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          if (input.fromHistoricalData) {
            const arrangedData = _.chain(result)
              .groupBy((g) => moment(g.created_date).format("DD-MM-YYYY"))
              // .groupBy((g) => g.created_date)
              .map((details, key) => {
                const { created_date, user_display_name } = _.head(details);

                return {
                  display_date: created_date,
                  user_name: user_display_name,
                  detailsOf: details,
                };
              })
              .value();
            // console.log("arrangedData", arrangedData);
            req.records = arrangedData;
          } else {
            req.records = result;
          }

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
  getPatientAllergyHis: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _stringData = "";
      const input = req.query;

      _mysql
        .executeQuery({
          query: `SELECT A.allergy_name,if(PA.onset_date is null,'1990-01-01',PA.onset_date) as onset_date,
          E.full_name as user_name,PA.comment as instructions
          FROM hims_f_patient_allergy as PA inner join hims_d_allergy as A
          on A.hims_d_allergy_id = PA.allergy_id 
          inner join algaeh_d_app_user as U on PA.updated_by=U.algaeh_d_app_user_id
          inner join hims_d_employee as E on E.hims_d_employee_id=U.employee_id
          where  PA.allergy_inactive <>'Y' and PA.patient_id=? order by PA.onset_date;`,
          values: [input.patient_id],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          if (input.fromHistoricalData) {
            const arrangedData = _.chain(result)
              .groupBy((g) => g.onset_date)
              .map((details, key) => {
                const { onset_date, user_name } = _.head(details);

                return {
                  display_date: onset_date,
                  user_name: user_name,
                  detailsOf: details.map((itx) => {
                    return {
                      generic_name: itx.allergy_name,
                      item_description: itx.allergy_name,
                      instructions: itx.instructions,
                      start_date: itx.onset_date,
                    };
                  }),
                };
              })
              .value();
            // console.log("arrangedData", arrangedData);
            req.records = arrangedData;
          } else {
            req.records = result;
          }

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

  getPatientInvestigation: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _stringData = "";
      const input = req.query;

      if (input.patient_id != null) {
        _stringData += " and LO.patient_id = ?" + input.patient_id;
      }
      if (input.visit_id != null) {
        _stringData += " and visit_id = ?" + input.visit_id;
      }

      // "select hims_f_ordered_services_id, OS.patient_id, OS.visit_id,visit_date, OS.doctor_id,\
      //     E.full_name as provider_name, OS.service_type_id,\
      //     OS.services_id,S.service_name,hims_f_lab_order_id, L.billed as lab_billed, \
      //     L.status as lab_ord_status,R.hims_f_rad_order_id,R.billed as rad_billed, R.status as rad_ord_status\
      //     from  hims_f_ordered_services OS \
      //     inner join hims_d_services S on  OS.services_id=S.hims_d_services_id \
      //     inner join hims_d_employee  E on OS.doctor_id=E.hims_d_employee_id\
      //     inner join hims_f_patient_visit V on OS.visit_id=V.hims_f_patient_visit_id\
      //     left join  hims_f_lab_order L on OS.visit_id=L.visit_id and OS.services_id= L.service_id\
      //     left join hims_f_rad_order R on OS.visit_id=R.visit_id  and OS.services_id=R.service_id\
      //     where (OS.service_type_id=5 or OS.service_type_id=11)" +
      //       _stringData +
      //       " group by hims_f_ordered_services_id order by OS.visit_id desc",
      _mysql
        .executeQuery({
          query: `select hims_f_lab_order_id,LO.lab_id_number, LO.visit_id, LO.patient_id,LO.send_out_test, case when LO.ip_id is NULL then V.visit_date else ADM.admission_date end as visit_date
          , E.full_name as provider_name, S.service_name, LO.billed as lab_billed, 
          LO.status as lab_ord_status, S.service_type_id from hims_f_lab_order LO 
          left join hims_f_patient_visit V on LO.visit_id = V.hims_f_patient_visit_id
          left join hims_adm_atd_admission ADM on ADM.hims_adm_atd_admission_id = LO.ip_id
          inner join hims_d_services S on LO.service_id=S.hims_d_services_id 
          inner join hims_d_employee  E on LO.provider_id=E.hims_d_employee_id where 1=1  ${_stringData} order by LO.hims_f_lab_order_id desc;
          select hims_f_rad_order_id, case when LO.ip_id is NULL then V.visit_date else ADM.admission_date end as visit_date
          , E.full_name as provider_name, S.service_name, LO.billed as rad_billed, 
          LO.status as rad_ord_status,  S.service_type_id from hims_f_rad_order LO 
          left join hims_f_patient_visit V on LO.visit_id = V.hims_f_patient_visit_id
          left join hims_adm_atd_admission ADM on ADM.hims_adm_atd_admission_id = LO.ip_id
          inner join hims_d_services S on LO.service_id=S.hims_d_services_id 
          inner join hims_d_employee  E on LO.provider_id=E.hims_d_employee_id where 1=1 ${_stringData} order by LO.hims_f_rad_order_id desc;`,
          // values: [req.query.patient_id, req.query.patient_id],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();

          let final_result = result[0];
          final_result = final_result.concat(result[1]);
          if (input.fromHistoricalData) {
            const arrangedData = _.chain(final_result)
              .groupBy((g) => g.visit_date)
              .map((details, key) => {
                const { visit_date, provider_name } = _.head(details);

                return {
                  display_date: visit_date,
                  user_name: provider_name,
                  detailsOf: details,
                };
              })
              .value();
            // console.log("arrangedData", arrangedData);
            req.records = arrangedData;
          } else {
            req.records = final_result;
          }

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

  getPatientProcedures: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _stringData = "";
      const input = req.query;
      if (input.visit_id != null) {
        _stringData += " and OS.visit_id = ?" + input.visit_id;
      }
      _mysql
        .executeQuery({
          query: `SELECT S.service_code, S.service_name,
          case when OS.pre_approval='N' then 'Not Required' else 'Required' end as pre_approval, 
          case when OS.insurance_yesno='N' then 'Not Covered' else 'Covered' end as insurance_yesno 
          FROM hims_f_ordered_services as OS 
          inner join hims_d_services S on S.hims_d_services_id=OS.services_id
          where OS.service_type_id=2  ${_stringData}  order by OS.updated_date desc;`,
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
      _mysql.releaseConnection();
      next(e);
    }
  },

  getPatientInvestigationForDashBoard: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let _stringData = "";
      const input = req.query;

      if (input.from_date != null) {
        _stringData +=
          "  date(visit_date) between date('" +
          input.from_date +
          "') AND date('" +
          input.to_date +
          "')";
      }

      _mysql
        .executeQuery({
          query: `  select hims_f_lab_order_id,LO.lab_id_number, LO.visit_id, LO.patient_id, visit_date,P.patient_code, E.full_name as provider_name, S.service_name, LO.billed as lab_billed, 
          LO.status as lab_ord_status, S.service_type_id from hims_f_lab_order LO 
          inner join hims_f_patient_visit V on LO.visit_id = V.hims_f_patient_visit_id
          inner join hims_d_services S on LO.service_id=S.hims_d_services_id 
          inner join hims_f_patient P  on V.patient_id=P.hims_d_patient_id
          inner join hims_d_employee  E on LO.provider_id=E.hims_d_employee_id where   
          ${_stringData}  order by hims_f_lab_order_id;
          select hims_f_rad_order_id, visit_date, E.full_name as provider_name, S.service_name, RO.billed as rad_billed, 
          RO.status as rad_ord_status,  S.service_type_id from hims_f_rad_order RO 
          inner join hims_f_patient_visit V on RO.visit_id = V.hims_f_patient_visit_id
          inner join hims_d_services S on RO.service_id=S.hims_d_services_id 
          inner join hims_d_employee  E on RO.provider_id=E.hims_d_employee_id where  ${_stringData}
          order by hims_f_rad_order_id;`,

          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();

          let final_result = result[0];
          final_result = final_result.concat(result[1]);

          req.records = final_result;
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

  getPatientPaymentDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    utilities.logger().log("getPatientPaymentDetails: ");
    try {
      _mysql
        .executeQuery({
          query:
            "select distinct  visit_id from hims_f_billing_header where record_status='A' and patient_id=? order by visit_id desc;",
          values: [req.query.patient_id],
          printQuery: true,
        })
        .then((result) => {
          // _mysql.releaseConnection();
          // req.records = result;
          // next();

          let allVisits = new LINQ(result)
            .Where((w) => w.visit_id != null)
            .Select((s) => s.visit_id)
            .ToArray();

          let outputArray = [];
          if (result.length > 0) {
            utilities.logger().log("result: ");
            //bill for each visit
            for (let i = 0; i < allVisits.length; i++) {
              _mysql
                .executeQuery({
                  query:
                    "select hims_f_billing_header_id ,bill_number,patient_id,visit_id,E.full_name provider_name,\
                    incharge_or_provider,bill_date, receipt_header_id, net_amount, patient_payable,\
                    receiveable_amount, credit_amount from hims_f_billing_header BH,hims_d_employee E \
                    where BH.record_status='A' and E.record_status='A' and\
                    BH.incharge_or_provider=E.hims_d_employee_id and visit_id=? order by bill_date desc;",
                  values: [allVisits[i]],
                  printQuery: true,
                })
                .then((billHeadResult) => {
                  // _mysql.releaseConnection();
                  // req.records = result;
                  // next();

                  utilities
                    .logger()
                    .log("billHeadResult: ", billHeadResult.length);
                  if (billHeadResult.length > 0) {
                    for (let k = 0; k < billHeadResult.length; k++) {
                      new Promise((resolve, reject) => {
                        try {
                          if (billHeadResult.length == 0) {
                            return resolve(billHeadResult);
                          } else {
                            _mysql
                              .executeQuery({
                                query:
                                  "select hims_f_receipt_header_id, receipt_number, receipt_date, total_amount\
                                  from hims_f_receipt_header where record_status='A' and hims_f_receipt_header_id=?;",
                                values: [billHeadResult[k].receipt_header_id],
                                printQuery: true,
                              })
                              .then((recptResult) => {
                                // _mysql.releaseConnection();
                                // req.records = result;
                                // next();

                                return resolve(recptResult);
                              })
                              .catch((error) => {
                                _mysql.releaseConnection();
                                next(error);
                              });
                          }
                        } catch (e) {
                          reject(e);
                        }
                      }).then((resultRCPT) => {
                        _mysql
                          .executeQuery({
                            query:
                              "select BH.hims_f_billing_header_id,company_payable as pri_company_payble, sec_company_payable,\
                hims_f_patient_insurance_mapping_id,IM.patient_id,primary_insurance_provider_id,IP.insurance_provider_name as pri_insurance_provider_name,\
                secondary_insurance_provider_id,IPR.insurance_provider_name as sec_insurance_provider_name \
                from  hims_f_billing_header BH \
                 left join hims_m_patient_insurance_mapping IM on  BH.visit_id=IM.patient_visit_id and   IM.record_status='A'\
                 left join hims_d_insurance_provider IP  on IM.primary_insurance_provider_id=IP.hims_d_insurance_provider_id and   IP.record_status='A'  \
                 left join hims_d_insurance_provider IPR  on  IM.secondary_insurance_provider_id=IPR.hims_d_insurance_provider_id   \
                where BH.record_status='A'  and   BH.hims_f_billing_header_id=?",
                            values: [
                              billHeadResult[k].hims_f_billing_header_id,
                            ],
                            printQuery: true,
                          })
                          .then((insResult) => {
                            // _mysql.releaseConnection();
                            // req.records = result;
                            // next();

                            outputArray.push({
                              ...billHeadResult[k],
                              prov_date:
                                moment(billHeadResult[k].bill_date).format(
                                  "DD-MM-YYYY"
                                ) +
                                " " +
                                billHeadResult[k].provider_name,
                              ...insResult[0],
                              receipt: resultRCPT,
                            });

                            if (i == allVisits.length - 1) {
                              _mysql.releaseConnection();
                              req.records = outputArray;
                              next();
                            }
                          })
                          .catch((error) => {
                            _mysql.releaseConnection();
                            next(error);
                          });
                      });
                    }
                  } else {
                    if (i == allVisits.length - 1) {
                      _mysql.releaseConnection();
                      req.records = outputArray;

                      next();
                    }
                  }
                })
                .catch((error) => {
                  _mysql.releaseConnection();
                  next(error);
                });
            }
          } else {
            _mysql.releaseConnection();
            req.records = result;
            next();
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

  getPatientTreatments: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select hims_d_service_type_id from hims_d_service_type  where \
          record_status='A' and service_type='Procedure'",
          printQuery: true,
        })
        .then((result) => {
          if (result.length > 0) {
            _mysql
              .executeQuery({
                query: `select hims_f_ordered_services_id,E.full_name as user_name,OS.patient_id,OS.doctor_id,E.full_name as doctor_name,OS.service_type_id,V.visit_date,OS.services_id,OS.teeth_number,
              S.service_name,S.service_desc from hims_f_ordered_services OS ,hims_f_patient_visit V,hims_d_services S,hims_d_employee E
              where OS.record_status='A' and V.record_status='A' and S.record_status='A' and E.record_status='A' and 
              OS.visit_id=V.hims_f_patient_visit_id and OS.services_id=S.hims_d_services_id and OS.doctor_id=E.hims_d_employee_id 
              and OS.service_type_id=? and OS.patient_id=? order by visit_date desc`,
                values: [
                  result[0].hims_d_service_type_id,
                  req.query.patient_id,
                ],
                printQuery: true,
              })
              .then((result1) => {
                _mysql.releaseConnection();
                const arrangedData = _.chain(result1)
                  .groupBy((g) => g.visit_date)
                  .map((details, key) => {
                    const { visit_date, user_name } = _.head(details);

                    return {
                      display_date: visit_date,
                      user_name: user_name,
                      detailsOf: details,
                    };
                  })
                  .value();

                req.records = arrangedData;

                next();
              })
              .catch((error) => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            _mysql.releaseConnection();
            req.records = result;
            next();
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
  getPatientSummary: (req, res, next) => {
    const _mysql = new algaehMysql();
    const input = req.query;
    try {
      _mysql
        .executeQuery({
          query: ` -- Investigation Lab (Result - 1)
          select hims_f_lab_order_id, visit_date, E.full_name as provider_name, S.service_name, LO.billed as lab_billed,
          LO.status as lab_ord_status from hims_f_lab_order LO
          inner join hims_f_patient_visit V on LO.visit_id = V.hims_f_patient_visit_id
          inner join hims_d_services S on LO.service_id=S.hims_d_services_id
          inner join hims_d_employee  E on LO.provider_id=E.hims_d_employee_id where 1=1 and  V.patient_id=? and LO.visit_id=? order by hims_f_lab_order_id;
          -- Investigation Rad (Result - 2)
          select hims_f_rad_order_id, visit_date, E.full_name as provider_name, S.service_name, RO.billed as rad_billed,
          RO.status as rad_ord_status from hims_f_rad_order RO
          inner join hims_f_patient_visit V on RO.visit_id = V.hims_f_patient_visit_id
          inner join hims_d_services S on RO.service_id=S.hims_d_services_id
          inner join hims_d_employee  E on RO.provider_id=E.hims_d_employee_id where 1=1 and  V.patient_id=? and RO.visit_id=? order by hims_f_rad_order_id;
          -- Consumable (Result - 3)
          SELECT OS.instructions,S.service_code, S.cpt_code, S.service_name, S.arabic_service_name,S.service_desc, S.procedure_type,
          S.service_status, ST.service_type FROM hims_f_ordered_inventory OS 
          inner join  hims_d_services S on OS.services_id = S.hims_d_services_id 
          inner join  hims_d_service_type ST on OS.service_type_id = ST.hims_d_service_type_id 
          inner join  hims_d_inventory_item_master IM on OS.inventory_item_id = IM.hims_d_inventory_item_master_id 
          WHERE OS.record_status='A' and visit_id=?;
          -- Package (Result - 4)
          select S.service_name from hims_f_package_header H  
          inner join hims_f_package_detail D on H.hims_f_package_header_id=D.package_header_id 
          inner join hims_d_services S on D.service_id = S.hims_d_services_id 
          inner join hims_d_service_type ST on D.service_type_id = ST.hims_d_service_type_id 
          where H.record_status='A'  and H.patient_id=? and H.visit_id=?;
          -- Examination (Result - 5)
          SELECT EX.episode_id,EXH.description as ex_desc,EXD.description as ex_type,EXS.description  as ex_severity,EX.comments FROM hims_f_episode_examination EX
          inner join hims_d_physical_examination_header EXH on EXH.hims_d_physical_examination_header_id=EX.exam_header_id
          left join hims_d_physical_examination_details EXD on EXD.hims_d_physical_examination_details_id=EX.exam_details_id
          left join hims_d_physical_examination_subdetails EXS on EXS.hims_d_physical_examination_subdetails_id=EX.exam_subdetails_id
          where EX.episode_id=? and EX.record_status='A';
          -- Procedure (Result - 6)
          SELECT S.service_name,S.service_code from hims_f_ordered_services OS
          inner join hims_d_services S on S.hims_d_services_id = OS.services_id
          where OS.service_type_id='2' and OS.visit_id=? and OS.patient_id=?;`,
          printQuery: true,
          values: [
            input.patient_id,
            input.visit_id,
            input.patient_id,
            input.visit_id,
            input.visit_id,
            input.patient_id,
            input.visit_id,
            input.episode_id,
            input.visit_id,
            input.patient_id,
          ],
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = {
            lab: result[0],
            rad: result[1],
            consumableList: result[2],
            packageList: result[3],
            examinationList: result[4],
            procedureList: result[5],
          };

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
};
