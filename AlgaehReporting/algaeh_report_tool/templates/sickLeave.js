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
          query: `select P.patient_code,P.full_name as patient_full_name,P.arabic_name as patient_arabaic_full_name,P.primary_id_no, P.registration_date, PV.visit_date,EC.comment, ID.icd_description, SDEP.sub_department_name,SDEP.arabic_sub_department_name, EMP.full_name, EMP.arabic_name,EMP.license_number,SL.from_date,SL.to_date,SL.no_of_days,SL.remarks,SL.diagnosis_data,
          case when SL.reported_sick = 'Y' then 'Yes' else 'No' end as reported_sick,
          case when SL.accompanying_patient = 'Y' then 'Yes' else 'No' end as accompanying_patient,
          case when SL.patient_unfit = 'Y' then 'Yes' else 'No' end as patient_unfit,
          case when SL.patient_fit = 'Y' then 'Yes' else 'No' end as patient_fit,
          case when SL.advice_light_duty = 'Y' then 'Yes' else 'No' end as advice_light_duty,
          case when SL.pat_need_emp_care = 'Y' then 'Yes' else 'No' end as pat_need_emp_care
          from hims_f_patient_sick_leave as SL
          left join hims_f_patient P on P.hims_d_patient_id = SL.patient_id
          left join hims_f_patient_visit PV on PV.hims_f_patient_visit_id = SL.visit_id
          left join hims_f_episode_chief_complaint EC on EC.episode_id = SL.episode_id
          left join hims_f_patient_diagnosis PD on  PD.episode_id = SL.episode_id
          left join hims_d_icd ID on ID.hims_d_icd_id = PD.daignosis_id
          inner join hims_d_employee EMP on PV.doctor_id = EMP.hims_d_employee_id
          inner join hims_d_sub_department SDEP on PV.sub_department_id = SDEP.hims_d_sub_department_id
          where SL.patient_id=? and SL.visit_id=? and SL.episode_id = ? ;`,
          values: [input.patient_id, input.visit_id, input.episode_id],
          printQuery: true,
        })
        .then((result) => {
          const header = result.length ? result[0] : {};
          resolve({ header });
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
