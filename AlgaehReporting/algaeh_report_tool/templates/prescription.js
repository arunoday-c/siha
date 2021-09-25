const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      console.log("input", input);

      if (input.visit_id != null) {
        str += " and H.visit_id=" + input.visit_id;
      }
      if (input.ip_id != null) {
        str += " and H.ip_id=" + input.ip_id;
      }

      options.mysql
        .executeQuery({
          query: `
          select G.generic_name, I.item_description, P.full_name as pat_name, 
case when H.ip_id is NULL then V.visit_date else ADM.admission_date end as visit_date, 
P.patient_code,
case when H.ip_id is NULL then V.age_in_years else ADM.age_in_years end as age_in_years, P.gender, P.contact_number, trim(N.nationality)as nationality,  S.sub_department_name,
          D.frequency, date_format(D.start_date ,'%d-%m-%Y')as from_date, D.dosage, D.no_of_days,  D.instructions,
          E.full_name as full_name, E.license_number, coalesce(IP.insurance_provider_name,'--')as insurance_provider_name,
          coalesce(M.card_class,'--')as card_class , coalesce(M.primary_policy_num,'--')as primary_policy_num, I.sfda_code,
          ICD.daignosis_id, IC.icd_code,IC.icd_description
          -- CC.comment,
          from hims_f_prescription as H
          left join hims_f_patient_visit as V on H.visit_id = V.hims_f_patient_visit_id
          left join hims_adm_atd_admission as ADM on H.ip_id = ADM.hims_adm_atd_admission_id
          inner join hims_f_prescription_detail as D on prescription_id = H.hims_f_prescription_id
          inner join hims_d_item_generic as G on G.hims_d_item_generic_id = D.generic_id
          inner join hims_d_item_master as I on I.hims_d_item_master_id = D.item_id
          inner join hims_f_patient as P on P.hims_d_patient_id = H.patient_id
          inner join hims_d_nationality as N on N.hims_d_nationality_id = P.nationality_id
          left join hims_d_sub_department S on (S.hims_d_sub_department_id = V.sub_department_id or S.hims_d_sub_department_id = ADM.sub_department_id)
          inner join hims_d_employee E on E.hims_d_employee_id = H.provider_id
          -- inner join hims_f_episode_chief_complaint CC on H.episode_id = CC.episode_id
          left join hims_f_patient_diagnosis ICD on H.episode_id = ICD.episode_id  and ICD.diagnosis_type = 'P' and ICD.record_status='A'
          left join hims_d_icd IC on ICD.daignosis_id = IC.hims_d_icd_id
          left join hims_m_patient_insurance_mapping as M on (M.patient_visit_id = V.hims_f_patient_visit_id or M.patient_visit_id = H.ip_id)
          left join hims_d_insurance_provider as IP on IP.hims_d_insurance_provider_id = M.primary_insurance_provider_id  
          where H.patient_id=?  ${str} ;
          `,
          values: [input.hims_d_patient_id],
          printQuery: true,
        })
        .then((result) => {
          const final = {
            header: { ..._.head(result), ..._.head(options.mainData) },
            detail: result,
          };
          resolve(final);
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
