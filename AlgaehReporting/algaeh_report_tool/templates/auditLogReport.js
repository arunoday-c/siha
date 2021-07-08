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

      if (input.employee_id) {
        str = ` and AU.employee_id='${input.employee_id}' `;
      }

      console.log("INPUT:", input);

      options.mysql
        .executeQuery({
          query: `SELECT AL.user_id, AL.action,AL.table_name,AL.column_name,AL.table_frendly_name,
          AL.old_row,AL.new_row,AL.date_time_stamp,AL.branch_id,AL.reference_id,AL.reference_name,
          AU.user_display_name,AU.username,AU.locked,
          case AU.user_type when 'SU' then 'SUPER USER' when 'AD' then 'ADMIN'
          when 'D' then 'DOCTOR' when 'N' then 'NURSE' when 'C' then 'CASHIER' when 'L' then 'LAB TECHNICIAN' when 'HR'
          then 'HR' when 'PM' then 'PAYROLL MANAGER' else 'OTHERS' end user_type ,AU.user_status
          FROM algaeh_audit_log as AL left join  algaeh_d_app_user as AU
          on AU.algaeh_d_app_user_id=AL.user_id
          where date(date_time_stamp) between date(?) and date(?) and AL.branch_id=? and AU.username <>'algaeh' ${str}
          order by AL.date_time_stamp desc;`,
          values: [input.from_date, input.to_date, input.hospital_id],
          printQuery: true,
        })
        .then((result) => {
          resolve({
            result,
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
