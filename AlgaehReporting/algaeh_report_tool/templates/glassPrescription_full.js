const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise((resolve, reject) => {
    try {
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      options.mysql
        .executeQuery({
          query: `
          select PT.full_name,PT.patient_code,PT.gender,PT.contact_number,NA.nationality,
          E.full_name as provider_name,S.sub_department_name,
          PV.age_in_years,PV.visit_date,
          coalesce(IP.insurance_provider_name,'--')as insurance_provider_name, coalesce(M.card_class,'--')as card_class , coalesce(M.primary_policy_num,'--')as primary_policy_num,
          ICD.daignosis_id, IC.icd_code,IC.icd_description,
          P.*
          from hims_f_glass_prescription as P
          inner join hims_f_patient as PT on PT.hims_d_patient_id = P.patient_id
          inner join hims_f_patient_visit as PV on PV.hims_f_patient_visit_id = P.visit_id
          inner join hims_d_employee as E on P.provider_id = E.hims_d_employee_id
          inner join hims_d_nationality NA on NA.hims_d_nationality_id=PT.nationality_id
          left join hims_f_patient_diagnosis ICD on PV.episode_id = ICD.episode_id  and ICD.diagnosis_type = 'P' and ICD.record_status='A'
          left join hims_d_icd IC on ICD.daignosis_id = IC.hims_d_icd_id 
          left join hims_m_patient_insurance_mapping as M on M.patient_visit_id = P.visit_id
          left join hims_d_insurance_provider as IP on IP.hims_d_insurance_provider_id = M.primary_insurance_provider_id
          inner join hims_d_sub_department S on S.hims_d_sub_department_id = PV.sub_department_id  
          where P.patient_id=? and P.visit_id=? and P.provider_id=?;
          `,
          values: [input.patient_id, input.visit_id, input.provider_id],
          printQuery: true,
        })
        .then((result) => {
          resolve({ ..._.head(result) });
        })
        .catch((error) => {
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
