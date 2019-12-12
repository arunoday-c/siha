// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    try {
      let input = {};
      const decimal_places = options.args.crypto.decimal_places;
      let params = options.args.reportParams;
      // const utilities = new algaehUtilities();
      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      let strData = "";

      if (input.employee_group_id > 0) {
        strData += ` and E.employee_group_id= ${input.employee_group_id}`;
      }

      if (input.department_id > 0) {
        strData += " and SD.department_id=" + input.department_id;
      }

      if (input.sub_department_id > 0) {
        strData += " and E.sub_department_id=" + input.sub_department_id;
      }

      options.mysql
        .executeQuery({
          query: `select S.salary_amount,S.leave_amount,S.airfare_amount,S.total_amount,
            S.leave_salary_number,E.employee_code,full_name as employee_name,
            E.mode_of_payment,SD.hims_d_sub_department_id,SD.sub_department_code,SD.sub_department_name,
            DP.hims_d_department_id, DP.department_name, NA.nationality,HO.hospital_name
            from hims_f_leave_salary_header S inner join  hims_d_employee E  on S.employee_id=E.hims_d_employee_id
            left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id
            left join hims_d_department DP on SD.department_id=DP.hims_d_department_id
            left join  hims_d_nationality NA  on E.nationality=NA.hims_d_nationality_id
            left join  hims_d_hospital HO  on E.hospital_id=HO.hims_d_hospital_id
            WHERE  E.hospital_id=? and S.year=? and S.month=? ${strData} ;`,
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

            const total_salary_amount = _.sumBy(ress, s =>
              parseFloat(s.salary_amount)
            ).toFixed(decimal_places);
            const total_leave_amount = _.sumBy(ress, s =>
              parseFloat(s.leave_amount)
            ).toFixed(decimal_places);
            const total_airfare_amount = _.sumBy(ress, s =>
              parseFloat(s.airfare_amount)
            ).toFixed(decimal_places);
            const net_total_amount = _.sumBy(ress, s =>
              parseFloat(s.total_amount)
            ).toFixed(decimal_places);

            const result = {
              details: outputArray,
              total_salary_amount: total_salary_amount,
              total_leave_amount: total_leave_amount,
              total_airfare_amount: total_airfare_amount,
              net_total_amount: net_total_amount
            };

            // utilities.logger().log("outputArray:", result);
            resolve(result);
          } else {
            resolve({
              result: { details: ress }
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
