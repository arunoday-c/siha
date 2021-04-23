// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      // const utilities = new algaehUtilities();
      let input = {};

      const params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      // console.log(params);

      options.mysql
        .executeQuery({
          query: `
          select P.patient_code,trim(E.full_name) as doctor_name,P.full_name as patient_name,SD.sub_department_name,
          gender, age_in_years,   age_in_months,age_in_days, IP.insurance_provider_name, P.primary_id_no
          from hims_f_patient P
          inner join hims_f_patient_visit V on P.hims_d_patient_id = V.patient_id
          inner join hims_d_employee E on E.hims_d_employee_id = V.doctor_id
          inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id
          left join hims_m_patient_insurance_mapping IM on IM.patient_visit_id=V.hims_f_patient_visit_id
          left join hims_d_insurance_provider IP on IM.primary_insurance_provider_id=IP.hims_d_insurance_provider_id   
          where P.hims_d_patient_id=? and V.hims_f_patient_visit_id=?;  
          
          select MS.hims_d_lab_specimen_id,MS.description as  specimen,S.service_name , A.antibiotic_name, 
          MR.susceptible,case MR.susceptible when 'Y' then 'YES' else 'NO' end as  susceptibleText,
          MR.intermediate,case MR.intermediate when 'Y' then 'YES' else 'NO' end as  intermediateText,
          MR.resistant, case MR.resistant when 'Y' then 'YES' else 'NO' end as  resistantText, 
          CASE WHEN LO.organism_type='F' THEN 'Fascideous' else 'Non-Fascideous' END as organism_type, 
          CASE WHEN LO.bacteria_type='G' THEN 'Growth' else 'No Growth' END as bacteria_type,LO.bacteria_name, 
          CASE WHEN LO.contaminated_culture='Y' THEN 'Yes' else 'No' END as contaminated_culture,
          E.full_name as validated_by,TC.category_name, LO.ordered_date,LS.collected_date,LO.entered_date,LO.validated_date,LO.comments 
          from hims_f_lab_order LO 
          inner join hims_f_lab_sample LS on LO.hims_f_lab_order_id = LS.order_id 
          left join hims_f_micro_result MR on  LO.hims_f_lab_order_id = MR.order_id 
          inner join hims_d_lab_specimen MS on LS.sample_id = MS.hims_d_lab_specimen_id 
          left join hims_d_antibiotic A on MR.antibiotic_id = A.hims_d_antibiotic_id 
          inner join algaeh_d_app_user U on LO.validated_by=U.algaeh_d_app_user_id 
          inner join hims_d_employee E on U.employee_id=E.hims_d_employee_id
          inner join hims_d_investigation_test IT on IT.services_id= LO.service_id
          inner join hims_d_test_category TC on TC.hims_d_test_category_id= IT.category_id
          inner join  hims_d_services S on LO.service_id=S.hims_d_services_id where LO.visit_id = ?;`,
          values: [input.hims_d_patient_id, input.visit_id, input.visit_id],
          printQuery: true,
        })
        .then((res) => {
          options.mysql.releaseConnection();
          const header = {
            ..._.head(res[0]),
            ..._.head(res[1]),
          };
          const result = res[1];
          resolve({
            header: header,
            result: result,
          });
        })
        .catch((e) => {
          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
