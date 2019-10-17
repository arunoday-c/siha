// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    try {
      let input = {};
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
          query: `select hims_f_gratuity_provision_id, employee_id, gratuity_amount, E.employee_code, E.full_name,  \
					SD.sub_department_name, D.department_name, EG.group_description from hims_f_gratuity_provision GP \
					inner join hims_d_employee E on GP.employee_id = E.hims_d_employee_id \
					left join hims_d_sub_department SD on E.sub_department_id = SD.hims_d_sub_department_id  \
					left join hims_d_department D on SD.department_id=D.hims_d_department_id \
					left join hims_d_employee_group EG on E.employee_group_id=EG.hims_d_employee_group_id \
					where GP.year=? and GP.month=? and E.hospital_id=?  ${strData} ;`,
          values: [input.year, input.month, input.hospital_id],
          printQuery: true
        })
        .then(ress => {
          if (ress.length > 0) {
            const result = {
              details: ress
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
