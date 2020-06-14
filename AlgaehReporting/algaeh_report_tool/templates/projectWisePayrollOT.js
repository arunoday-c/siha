// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      let strData = "";

      if (input.project_id > 0) {
        strData += " and PWP.project_id=" + input.project_id;
      }
      if (input.department_id > 0) {
        strData += " and SD.department_id=" + input.department_id;
      }

      if (input.sub_department_id > 0) {
        strData += " and E.sub_department_id=" + input.sub_department_id;
      }
      if (input.employee_group_id > 0) {
        strData += " and E.employee_group_id=" + input.employee_group_id;
      }

      options.mysql
        .executeQuery({
          query: `Select hims_f_project_wise_payroll_id,employee_id,  month, year,group_description,
          E.employee_code,E.full_name,d.designation, project_id, P.project_code,P.project_desc,SD.sub_department_name,
          COALESCE(worked_hours,0) + COALESCE(concat(floor(worked_minutes/60)  ,'.',worked_minutes%60),0)
          as total_hours,COALESCE(basic_hours,0) + COALESCE(concat(floor(basic_minutes/60)  ,'.',basic_minutes%60),0)
          as basic_hours,COALESCE(ot_hours,0) + COALESCE(concat(floor(ot_minutes/60)  ,'.',ot_minutes%60),0)
          as ot_hours,COALESCE(wot_hours,0) + COALESCE(concat(floor(wot_minutes/60)  ,'.',wot_minutes%60),0)
          as wot_hours,COALESCE(hot_hours,0) + COALESCE(concat(floor(hot_minutes/60)  ,'.',hot_minutes%60),0)
          as hot_hours,basic_cost, ot_cost, wot_cost, hot_cost, cost from hims_f_project_wise_payroll PWP 
          inner join hims_d_employee  E on PWP.employee_id=E.hims_d_employee_id 
          inner join hims_d_project  P on PWP.project_id=P.hims_d_project_id  
          left join hims_d_employee_group EG on EG.hims_d_employee_group_id = E.employee_group_id  
          left join hims_d_designation d on E.employee_designation_id = d.hims_d_designation_id 
          left join hims_d_sub_department SD on SD.hims_d_sub_department_id = E.sub_department_id
          where year=? and month=? and PWP.hospital_id=? ${strData}  ;`,
          values: [input.year, input.month, input.hospital_id],
          printQuery: true,
        })
        .then((result) => {
          // console.log("resut", result);

          const outputArray = [];
          resolve({ result });
        })
        .catch((error) => {
          options.mysql.releaseConnection();
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
