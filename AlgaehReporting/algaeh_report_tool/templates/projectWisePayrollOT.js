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
      let groupBy = " group by PWP.employee_id ";

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
        groupBy = " group by PWP.project_id ";
      }

      options.mysql
        .executeQuery({
          query: `select hims_f_project_wise_payroll_id, PWP.employee_id,E.employee_code,E.full_name,d.designation, 
          project_id, P.project_code,P.project_desc, PWP.month, PWP.year,sum(worked_hours) as worked_hours, 
          sum(worked_minutes) as worked_minutes, sum(cost) as project_cost,PWP.hospital_id, SD.sub_department_name, 
           DPT.department_name,coalesce(SAL.ot_work_hours + SAL.ot_weekoff_hours + SAL.ot_holiday_hours,0)as ot_work, 
           coalesce(SAL.total_working_hours,0) as total_working_hours, coalesce (SE.amount, 0) as ot_amount,SE.component_type,
           (sum(cost)-coalesce (SE.amount, 0)) as project_cost_amount from hims_f_project_wise_payroll PWP 
          inner join hims_d_employee  E on PWP.employee_id=E.hims_d_employee_id 
          inner join hims_d_project  P on PWP.project_id=P.hims_d_project_id  
          left join hims_d_employee_group EG on EG.hims_d_employee_group_id = E.employee_group_id  
          left join hims_d_designation d on E.employee_designation_id = d.hims_d_designation_id 
          left join hims_d_sub_department SD on SD.hims_d_sub_department_id = E.sub_department_id
          inner join hims_d_department DPT on SD.department_id = DPT.hims_d_department_id 
          left join hims_f_salary SAL on SAL.employee_id = PWP.employee_id and  SAL.month = PWP.month and 
          SAL.year = PWP.year left join 
          (select ER.*,ERD.component_type from  hims_f_salary_earnings ER 
          inner join hims_d_earning_deduction ERD on ER.earnings_id=ERD.hims_d_earning_deduction_id 
          and ERD.component_type='OV') as SE on SAL.hims_f_salary_id=SE.salary_header_id 
          where  PWP.year=? and PWP.month=? ${strData} ${groupBy};`,
          values: [input.year, input.month, input.hospital_id],
          printQuery: true,
        })
        .then((result) => {
          // console.log("resut", result);
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
