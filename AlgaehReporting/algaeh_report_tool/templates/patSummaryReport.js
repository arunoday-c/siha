const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    try {
      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      options.mysql
        .executeQuery({
          query: `
          -- Patient Details
          SELECT P.patient_code,P.registration_date, P.full_name,P.arabic_name,P.gender,P.date_of_birth,P.blood_group,P.tel_code,P.contact_number,P.primary_identity_id,ID.identity_document_name,EM.full_name as doctor_name,EM.license_number, VI.visit_code,VI.visit_date,SUB.sub_department_name,VI.insured
          FROM hims_f_patient_visit VI
          left join hims_f_patient P on P.hims_d_patient_id = VI.patient_id
          left join hims_d_identity_document ID on ID.hims_d_identity_document_id = P.primary_identity_id
          left join algaeh_d_app_user USR on USR.algaeh_d_app_user_id = VI.doctor_id
          left join hims_d_employee EM on EM.hims_d_employee_id = USR.employee_id
          left join hims_d_sub_department SUB on SUB.hims_d_sub_department_id = VI.sub_department_id
          where VI.patient_id = ? and VI.hims_f_patient_visit_id=?;
          -- Chief Complaint
          select hims_f_episode_chief_complaint_id ,ECC.episode_id,chief_complaint_id,HH.hpi_description as chief_complaint, comment
          from hims_f_episode_chief_complaint ECC
          left join hims_d_hpi_header HH on ECC.chief_complaint_id=HH.hims_d_hpi_header_id
          Where ECC.record_status='A' and ECC.patient_id=? and ECC.episode_id=?;
          -- Patient Encounter
          select PE.other_signs, PE.significant_signs
          from hims_f_patient_encounter PE
          Where PE.record_status='A' and PE.patient_id=? and PE.visit_id=?;
          -- ICD
          select hims_f_patient_diagnosis_id, patient_id, episode_id, daignosis_id,ICD.icd_code as daignosis_code,
          ICD.icd_description as daignosis_description  ,diagnosis_type, final_daignosis,
          PD.created_date as diagnosis_date  from hims_f_patient_diagnosis PD,hims_d_icd ICD
          where PD.record_status='A' and   ICD.record_status='A'
          and PD.daignosis_id=ICD.hims_d_icd_id and patient_id=? and episode_id=1914;
          -- Vitals
          select hims_f_patient_vitals_id, PV.patient_id, visit_id, PV.visit_date, visit_time,
          case_type, vital_id,PH.vitals_name,vital_short_name,PH.uom, vital_value, vital_value_one,
          vital_value_two, formula_value from hims_f_patient_vitals PV,hims_d_vitals_header PH,hims_f_patient_visit V
          where PV.record_status='A' and PH.record_status='A' and PV.vital_id=PH.hims_d_vitals_header_id and PV.patient_id=?
          and visit_id =? and  PH.display='Y' and V.hims_f_patient_visit_id=PV.vital_id and V.hospital_id
          group by visit_date,vital_id;
          -- Medication
          select  hims_f_prescription_id, patient_id, encounter_id, provider_id, episode_id,
          prescription_date, prescription_status ,
          hims_f_prescription_detail_id, prescription_id, item_id,IM.item_description, PD.generic_id, IG.generic_name,
          dosage,med_units, frequency, no_of_days,
          dispense, frequency_type, frequency_time, frequency_route, start_date, PD.service_id, uom_id,
          item_category_id, PD.item_status, PD.instructions
          from hims_f_prescription P,hims_f_prescription_detail PD,hims_d_item_master IM,hims_d_item_generic IG
          where P.record_status='A' and IM.record_status='A' and IG.record_status='A' and
          P.hims_f_prescription_id=PD.prescription_id and PD.item_id=IM.hims_d_item_master_id
          and PD.generic_id =IG.hims_d_item_generic_id and patient_id=? and visit_id=?;
          -- Investigation Lab
          select hims_f_lab_order_id, visit_date, E.full_name as provider_name, S.service_name, LO.billed as lab_billed,
          LO.status as lab_ord_status from hims_f_lab_order LO
          inner join hims_f_patient_visit V on LO.visit_id = V.hims_f_patient_visit_id
          inner join hims_d_services S on LO.service_id=S.hims_d_services_id
          inner join hims_d_employee  E on LO.provider_id=E.hims_d_employee_id where 1=1 and  V.patient_id=? and LO.visit_id=? order by hims_f_lab_order_id;
          -- Investigation Rad
          select hims_f_rad_order_id, visit_date, E.full_name as provider_name, S.service_name, RO.billed as rad_billed,
          RO.status as rad_ord_status from hims_f_rad_order RO
          inner join hims_f_patient_visit V on RO.visit_id = V.hims_f_patient_visit_id
          inner join hims_d_services S on RO.service_id=S.hims_d_services_id
          inner join hims_d_employee  E on RO.provider_id=E.hims_d_employee_id where 1=1 and  V.patient_id=? and RO.visit_id=? order by hims_f_rad_order_id;
          `,
          values: [
            input.patient_id,
            input.visit_id,
            input.patient_id,
            input.episode_id,
            input.patient_id,
            input.visit_id,
            input.patient_id,
            input.episode_id,
            input.patient_id,
            input.visit_id,
            input.patient_id,
            input.visit_id,
            input.patient_id,
            input.visit_id,
            input.patient_id,
            input.visit_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          let pat_details = result[0];
          let chief_details = result[1];
          let pat_Encounter = result[2];
          let pat_icd = result[3];
          // let med_details = result[3];
          // let lab_details = result[4];
          // let rad_details = result[5];

          const records = {
            pat_details: _.head(pat_details),
            chief_details: _.head(chief_details),
            pat_Encounter: _.head(pat_Encounter),
            pat_icd,
            // icd_details: icd_details,
            // med_details: med_details,
            // lab_details: lab_details,
            // rad_details: rad_details,
          };

          resolve(records);
        })
        .catch((error) => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
