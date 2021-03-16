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
          select P.patient_code,trim(E.full_name) as doctor_name,P.full_name as patient_name from hims_f_patient P    
          inner join hims_f_patient_visit V on P.hims_d_patient_id = V.patient_id    
          inner join hims_d_employee E on E.hims_d_employee_id = V.doctor_id   
          where P.hims_d_patient_id=? and V.hims_f_patient_visit_id=?;  
          select MS.hims_d_lab_specimen_id,MS.description as  specimen,S.service_name , A.antibiotic_name, 
          case MR.susceptible when 'Y' then 'YES' else 'NO' end as  susceptible, 
          case MR.intermediate when 'Y' then 'YES' else 'NO' end as  intermediate, 
          case MR.resistant when 'Y' then 'YES' else 'NO' end as  resistant, 
          CASE WHEN LO.organism_type='F' THEN 'Fascideous' else 'Non-Fascideous' END as organism_type, 
          CASE WHEN LO.bacteria_type='G' THEN 'Growth' else 'No Growth' END as bacteria_type,LO.bacteria_name, 
          E.full_name as validated_by, LO.ordered_date,LO.entered_date,LO.validated_date,LO.comments 
          from hims_f_lab_order LO 
          inner join hims_f_lab_sample LS on LO.hims_f_lab_order_id = LS.order_id 
          left join hims_f_micro_result MR on  LO.hims_f_lab_order_id = MR.order_id 
          inner join hims_d_lab_specimen MS on LS.sample_id = MS.hims_d_lab_specimen_id 
          left join hims_d_antibiotic A on MR.antibiotic_id = A.hims_d_antibiotic_id 
          inner join algaeh_d_app_user U on LO.validated_by=U.algaeh_d_app_user_id 
          inner join hims_d_employee E on U.employee_id=E.hims_d_employee_id 
          inner join  hims_d_services S on LO.service_id=S.hims_d_services_id where LO.visit_id = ?;`,
          values: [input.hims_d_patient_id, input.visit_id, input.visit_id],
          printQuery: true,
        })
        .then((res) => {
          options.mysql.releaseConnection();

          // console.log("header---", header);
          const result = res;

          if (result[0].length > 0) {
            resolve({
              patient_code: result[0][0]["patient_code"],
              patient_name: result[0][0]["patient_name"],
              doctor_name: result[0][0]["doctor_name"],
              ordered_date: result[1][0]["ordered_date"],
              entered_date: result[1][0]["entered_date"],
              validated_date: result[1][0]["validated_date"],
              specimen: result[1][0]["specimen"],
              service_name: result[1][0]["service_name"],
              bacteria_type: result[1][0]["bacteria_type"],
              organism_type: result[1][0]["organism_type"],
              bacteria_name: result[1][0]["bacteria_name"],
              validated_by: result[1][0]["validated_by"],
              comments: result[1][0]["comments"],
              details: result[1],
            });
            // console.log(result);
          } else {
            resolve({
              header: header,
              // no_employees: result.length,
              result: result,
            });
            // console.log(result);
          }
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

// const executePDF = function executePDFMethod(options) {
//   return new Promise(function (resolve, reject) {
//     try {
//       resolve({
//         patient_code: options.result[0][0]["patient_code"],
//         patient_name: options.result[0][0]["patient_name"],
//         doctor_name: options.result[0][0]["doctor_name"],
//         ordered_date: options.result[1][0]["ordered_date"],
//         entered_date: options.result[1][0]["entered_date"],
//         validated_date: options.result[1][0]["validated_date"],
//         specimen: options.result[1][0]["specimen"],
//         service_name: options.result[1][0]["service_name"],
//         bacteria_type: options.result[1][0]["bacteria_type"],
//         organism_type: options.result[1][0]["organism_type"],
//         bacteria_name: options.result[1][0]["bacteria_name"],
//         validated_by: options.result[1][0]["validated_by"],
//         comments: options.result[1][0]["comments"],
//         details: options.result[1],
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
// module.exports = { executePDF };
