const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    try {
      let input = {};
      let params = options.args.reportParams;
      const utilities = new algaehUtilities();
      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      let strData = "";

      if (input.department_id > 0) {
        strData += " and SD.department_id=" + input.department_id;
      }

      if (input.sub_department_id > 0) {
        strData += " and E.sub_department_id=" + input.sub_department_id;
      }

      options.mysql
        .executeQuery({
          query: `select employee_id,S.total_earnings,S.total_deductions,S.total_contributions,
              S.total_days,S.display_present_days,
            S.net_salary,S.advance_due,S.loan_due_amount,E.employee_code,full_name as employee_name,
            E.mode_of_payment,SD.hims_d_sub_department_id,SD.sub_department_code,SD.sub_department_name,
            DP.hims_d_department_id, DP.department_name, NA.nationality,HO.hospital_name
            from hims_f_salary S inner join  hims_d_employee E  on S.employee_id=E.hims_d_employee_id
            left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id
            left join hims_d_department DP on SD.department_id=DP.hims_d_department_id
            left join  hims_d_nationality NA  on E.nationality=NA.hims_d_nationality_id
            left join  hims_d_hospital HO  on E.hospital_id=HO.hims_d_hospital_id
            WHERE S.salary_type='NS' E.hospital_id=? and S.year=? and S.month=? ${strData} ;`,
          values: [input.hospital_id, input.year, input.month],
          printQuery: true
        })
        .then(ress => {
          if (ress.length > 0) {
            const departmentWise = _.chain(ress)
              .groupBy(g => g.hims_d_department_id)
              .map(m => m)
              .value();

            const outputArray = [];

            for (let i = 0; i < departmentWise.length; i++) {
              const sub_dept = _.chain(departmentWise[i])
                .groupBy(g => g.hims_d_sub_department_id)
                .map(sub => {
                  return {
                    sub_department_name: sub[0].sub_department_name,
                    sub_no_employee: sub.length,
                    employees: sub
                  };
                })
                .value();

              outputArray.push({
                department_name: departmentWise[i][0]["department_name"],
                dep_no_employee: departmentWise[i].length,
                sub_dept: sub_dept
              });
            }

            const result = {
              details: outputArray
            };

            utilities.logger().log("outputArray:", result);
            resolve(result);
          } else {
            resolve({
              result: ress
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
