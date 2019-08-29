const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      const _ = options.loadash;

      const utilities = new algaehUtilities();

      let input = options.args.reportParams;

      console.log("input:", input);
      options.mysql
        .executeQuery({
          query: `select hims_f_salary_id ,S.employee_id, S.year,S.month,ED.hims_d_earning_deduction_id as earning_id,
          ED.earning_deduction_description as earning_description , 
          SE.amount as earning_amount,EDD.hims_d_earning_deduction_id as deduction_id,
          EDD.earning_deduction_description as deduction_description,SD.amount as deduction_amount,
          S.total_earnings,S.total_deductions,SDP.sub_department_name, D.department_name,
          E.employee_code, E.full_name ,DE.designation,H.hospital_name from 
          hims_f_salary S left join  hims_f_salary_earnings SE on SE.salary_header_id = S.hims_f_salary_id
          left join hims_f_salary_deductions SD on SD.salary_header_id = S.hims_f_salary_id
          left join hims_d_earning_deduction ED on ED.hims_d_earning_deduction_id = SE.earnings_id
          left join hims_d_earning_deduction EDD on EDD.hims_d_earning_deduction_id = SD.deductions_id
          left join hims_d_hospital H on H.hims_d_hospital_id = S.hospital_id
          left join hims_d_employee E on E.hims_d_employee_id = S.employee_id
          left join hims_d_designation DE on DE.hims_d_designation_id = E.employee_designation_id
          left join hims_d_sub_department SDP on  E.sub_department_id=SDP.hims_d_sub_department_id 
          left join hims_d_department D on D.hims_d_department_id = SDP.department_id 
          where S.employee_id in(?) and S.year=? and S.month=? ;`,
          values: [input.employees, input.year, input.month],
          printQuery: true
        })
        .then(result => {
          utilities.logger().log("result: ", result);
          const outputArray = [];
          if (result.length > 0) {
            const employees = _.chain(result)
              .groupBy(g => g.hims_f_salary_id)
              .map(m => m)
              .value();

            employees.forEach(employe => {
              const emp_earnings = _.chain(employe)
                .groupBy(g => g.earning_id)
                .map(m => {
                  return {
                    earning_id: m.earning_id,
                    earning_description: m.earning_description,
                    earning_amount: m.earning_amount
                  };
                })
                .value();

              const emp_deductions = _.chain(employe)
                .groupBy(g => g.deduction_id)
                .map(m => {
                  return {
                    deduction_id: m.deduction_id,
                    deduction_description: m.deduction_description,
                    deduction_amount: m.deduction_amount
                  };
                })
                .value();

              outputArray.push({
                total_earnings: employe[0].total_earnings,
                total_deductions: employe[0].total_deductions,
                sub_department_name: employe[0].sub_department_name,
                department_name: employe[0].department_name,
                employee_code: employe[0].employee_code,
                full_name: employe[0].full_name,
                designation: employe[0].designation,
                hospital_name: employe[0].hospital_name,

                emp_earnings: emp_earnings,
                emp_deductions: emp_deductions
              });
            });

            utilities.logger().log("outputArray: ", outputArray);
            resolve({
              result: outputArray
            });
          } else {
            resolve({
              result: result
            });
          }
        })
        .catch(error => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
