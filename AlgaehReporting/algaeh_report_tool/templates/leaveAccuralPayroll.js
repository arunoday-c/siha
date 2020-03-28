// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    try {
      let input = {};
      let params = options.args.reportParams;
      // const utilities = new algaehUtilities();
      params.forEach(para => {
        input[para["name"]] = para["value"];
      });
      const decimal_places = options.args.crypto.decimal_places;

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
          query: `select balance_leave_days,balance_leave_salary_amount,
          balance_airticket_amount, E.employee_code, E.full_name, SD.sub_department_name, D.department_name, EG.group_description 
          from hims_f_employee_leave_salary_header LA inner join hims_d_employee E on LA.employee_id=E.hims_d_employee_id 
          left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id 
          left join hims_d_department D on SD.department_id=D.hims_d_department_id 
          left join hims_d_employee_group EG on E.employee_group_id=EG.hims_d_employee_group_id
          where E.hospital_id=? ${strData} ;`,
          values: [input.hospital_id],
          printQuery: true
        })
        .then(ress => {
          let sum_leave_salary = 0;
          let sum_airfare_amount = 0;

          if (ress.length > 0) {
            sum_leave_salary = _.sumBy(ress, s => parseFloat(s.balance_leave_salary_amount));
            sum_airfare_amount = _.sumBy(ress, s =>
              parseFloat(s.balance_airticket_amount)
            );

            const result = {
              detailsList: ress,
              sum_leave_salary: sum_leave_salary.toFixed(decimal_places),
              sum_airfare_amount: sum_airfare_amount.toFixed(decimal_places)
            };

            // utilities.logger().log("outputArray:", result);
            resolve(result);
          } else {
            resolve({
              result: {
                detailsList: ress,
                sum_leave_salary: sum_leave_salary.toFixed(decimal_places),
                sum_airfare_amount: sum_airfare_amount.toFixed(decimal_places)
              }
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
