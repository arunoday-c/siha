const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      console.log("INPUT:", input);
      // if (input.department_id) {
      //   str += ` and EM.department_id= '${input.department_id}'`;
      // }
      if (input.hospital_id > 0) {
        str += ` and SLR.hospital_id=${input.hospital_id}`;
      }
      options.mysql
        .executeQuery({
          query: `select  distinct EM.employee_code, EM.employee_code, EM.full_name,SLR.salary_number,SLR.year,
          MONTHNAME(CONCAT('2011-',SLR.month,'-01')) as revert_month,SLR.revert_reason,SLR.net_salary,H.hospital_name,date(SLR.created_date) as created_date,USR.user_display_name
          from hims_f_salary_history as SLR
          left join hims_d_employee as EM on SLR.employee_id = EM.hims_d_employee_id
          left join hims_d_hospital as H on H.hims_d_hospital_id=SLR.hospital_id
          left join algaeh_d_app_user as USR on USR.algaeh_d_app_user_id=SLR.created_by
          where SLR.year=? and SLR.month=?   and SLR.salary_type <> 'LS'  ${str}  ORDER BY SLR.salary_number DESC;`,
          values: [input.year, input.month],
          printQuery: true,
        })
        .then((result) => {
          const header = result.length ? result[0] : {};

          resolve({
            result: result,
            header,

            no_employees: result.length,
          });
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
