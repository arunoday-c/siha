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

      // if (input.employee_id > 0) {
      //   str += ` and SO.sales_person_id= ${input.employee_id}`;
      // }

      options.mysql
        .executeQuery({
          query: `

          -- Refferal Details (Result - 0)
          select case when DR.referral_type='E' then external_doc_name else E.full_name end as ref_doctor_name, case when DR.referral_type='E' then 'External' else 'Internal' end as referral_type_text,DR.hospital_name,DR.reason,DR.created_date as referral_date,
          P.patient_code,P.full_name as patient_full_name,P.arabic_name as
          patient_arabaic_full_name, P.registration_date,PV.visit_date,
          SD.sub_department_name,SD.arabic_sub_department_name, EMP.full_name
          from hims_f_patient_referral DR
          left join hims_f_patient_visit PV on PV.hims_f_patient_visit_id = DR.visit_id
          left join hims_f_patient P on P.hims_d_patient_id = DR.patient_id
          left join hims_d_employee EMP on PV.doctor_id = EMP.hims_d_employee_id
          left join hims_d_sub_department SD on SD.hims_d_sub_department_id = DR.sub_department_id 
          left join hims_d_employee E on E.hims_d_employee_id = DR.doctor_id
          where DR.hims_f_patient_referral_id=?;
          
          
          -- Patient Details (Result - 1)
          SELECT P.patient_code,P.registration_date, P.full_name,P.arabic_name,P.gender,P.date_of_birth,P.blood_group,P.tel_code,P.contact_number,P.primary_identity_id,ID.identity_document_name,EM.full_name as doctor_name,EM.license_number, VI.visit_code,VI.visit_date,SUB.sub_department_name,VI.insured
          FROM hims_f_patient_visit VI
          left join hims_f_patient P on P.hims_d_patient_id = VI.patient_id
          left join hims_d_identity_document ID on ID.hims_d_identity_document_id = P.primary_identity_id
          left join hims_d_employee EM on EM.hims_d_employee_id = VI.doctor_id
          left join hims_d_sub_department SUB on SUB.hims_d_sub_department_id = VI.sub_department_id
          where VI.hims_f_patient_visit_id=?;
          -- Chief Complaint (Result - 2)
          select hims_f_episode_chief_complaint_id ,ECC.episode_id,chief_complaint_id,HH.hpi_description as chief_complaint, comment
          from hims_f_episode_chief_complaint ECC
          left join hims_d_hpi_header HH on ECC.chief_complaint_id=HH.hims_d_hpi_header_id
          Where ECC.record_status='A' and ECC.episode_id=?;
          -- Patient Encounter (Result - 3)
          select PE.other_signs, PE.significant_signs
          from hims_f_patient_encounter PE
          Where PE.record_status='A' and PE.visit_id=?;
          -- ICD (Result - 4)
          select hims_f_patient_diagnosis_id, patient_id, episode_id, daignosis_id,ICD.icd_code as daignosis_code,
          ICD.icd_description as daignosis_description,
          case when diagnosis_type='P' then 'Primary' else 'Secondary' end as diagnosis_type,final_daignosis,
          PD.created_date as diagnosis_date  from hims_f_patient_diagnosis PD,hims_d_icd ICD
          where PD.record_status='A' and   ICD.record_status='A'
          and PD.daignosis_id=ICD.hims_d_icd_id and episode_id=?;
          -- Vitals (Result - 5)
          select PH.sequence_order,hims_f_patient_vitals_id, patient_id, visit_id, visit_date, visit_time, PV.updated_by, PV.updated_Date,
          case_type, vital_id, PH.vitals_name, vital_short_name, PH.uom, vital_value,
          formula_value, PH.sequence_order, PH.display, AU.user_display_name,PH.box_type,PV.created_date from hims_f_patient_vitals PV 
          inner join hims_d_vitals_header PH on PV.vital_id=PH.hims_d_vitals_header_id  
          left join algaeh_d_app_user AU on AU.algaeh_d_app_user_id=PV.updated_by  
          where PV.record_status='A' and PH.record_status='A' and PV.visit_id=?
          group by PV.created_date, vital_id order by PH.sequence_order asc;
          -- Examination (Result - 6)
          SELECT EX.episode_id,EXH.description as ex_desc,EXD.description as ex_type,EXS.description  as ex_severity,EX.comments FROM hims_f_episode_examination EX
          inner join hims_d_physical_examination_header EXH on EXH.hims_d_physical_examination_header_id=EX.exam_header_id
          left join hims_d_physical_examination_details EXD on EXD.hims_d_physical_examination_details_id=EX.exam_details_id
          left join hims_d_physical_examination_subdetails EXS on EXS.hims_d_physical_examination_subdetails_id=EX.exam_subdetails_id
          where EX.episode_id=? and EX.record_status='A';
          -- Allergey (Result - 7)
          SELECT ALG.allergy_name,
          case when ALG.allergy_type='F' then 'Food' when ALG.allergy_type='A' then 'Airborne' when ALG.allergy_type='AI' then 'Animal & Insect' when ALG.allergy_type='C' then 'Chemical & Others' when ALG.allergy_type='D' then 'Drugs' end as allergy_type,
          case when PALG.onset='C' then 'Childhood' when PALG.onset='P' then 'Preterm' when PALG.onset='T' then 'Teens' when PALG.onset='A' then 'Adulthood' when PALG.onset='O' then onset_date  end as onset,
          case when PALG.severity='MI' then 'Mild' when PALG.severity='MO' then 'Moderate' when PALG.severity='SE' then 'Severe' end as severity
          FROM hims_f_patient_allergy as PALG 
          inner join hims_d_allergy ALG on ALG.hims_d_allergy_id=PALG.allergy_id
          where PALG.patient_id=? and PALG.record_status='A';
          -- History (Result - 8)
          SELECT case when PHIS.history_type='SOH' then 'Social History' when PHIS.history_type='MEH' then 'Medical History' 
          when PHIS.history_type='SGH' then 'Surgical History' when PHIS.history_type='FMH' then 'Family History' 
          when PHIS.history_type='BRH' then 'Birth History' end as history_type,PHIS.remarks
          FROM hims_f_patient_history PHIS where PHIS.patient_id=? and PHIS.record_status;

          `,
          values: [
            input.hims_f_patient_referral_id,
            input.visit_id,
            input.episode_id,
            input.visit_id,
            input.episode_id,
            input.visit_id,
            input.episode_id,
            input.patient_id,
            input.patient_id,
            input.patient_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          let refferal_details = result[0];
          let pat_details = result[1];
          let chief_details = result[2];
          let pat_Encounter = result[3];
          let pat_icd = result[4];
          let vital_details = result[5];
          let examinationList = result[6];
          let allergyList = result[7];
          let historyList = result[8];

          const records = {
            refferal_details: _.head(refferal_details),
            pat_details: _.head(pat_details),
            chief_details: _.head(chief_details),
            pat_Encounter: _.head(pat_Encounter),
            vital_details,
            pat_icd,
            examinationList,
            allergyList,
            historyList,
          };
          resolve(records);
        });

      // console.log("result: ", options.result[0]);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
