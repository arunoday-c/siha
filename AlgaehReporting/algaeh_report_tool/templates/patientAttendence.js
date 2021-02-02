const executePDF = function executePDFMethod(options) {
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
          query: `select P.patient_code,P.full_name as patient_full_name,P.arabic_name as
            patient_arabaic_full_name, P.registration_date,PV.visit_date,EC.comment, ID.icd_description,
            SDEP.sub_department_name,SDEP.arabic_sub_department_name, EMP.full_name,
            EMP.arabic_name, ? as from_time, ? as to_time
            from hims_f_patient_visit PV
            inner join hims_f_patient P on P.hims_d_patient_id = PV.patient_id
            left join hims_f_episode_chief_complaint EC on EC.episode_id = PV.episode_id
            left join hims_f_patient_diagnosis PD on PD.episode_id = PV.episode_id
            left join hims_d_icd ID on ID.hims_d_icd_id = PD.daignosis_id
            inner join hims_d_employee EMP on PV.doctor_id = EMP.hims_d_employee_id
            inner join hims_d_sub_department SDEP on PV.sub_department_id = SDEP.hims_d_sub_department_id
            where PV.patient_id=? and PV.hims_f_patient_visit_id=? and PV.episode_id = ?;`,
          values: [
            input.from_time,
            input.to_time,
            input.patient_id,
            input.visit_id,
            input.episode_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          const header = result.length == 0 ? [] : result[0];
          console.log("header===", header);
          resolve(header);
        });

      // console.log("result: ", options.result[0]);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
