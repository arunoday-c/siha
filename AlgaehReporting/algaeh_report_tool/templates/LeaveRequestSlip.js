const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;
      const writtenForm = options.writtenForm;

      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      // if (input.hospital_id > 0) {
      //   str += ` and AM.hospital_id= ${input.hospital_id}`;
      // }
      // let is_local = "";

      // if (input.is_local === "Y") {
      //   is_local = " and H.default_nationality=E.nationality ";
      // } else if (input.is_local === "N") {
      //   is_local = " and H.default_nationality<>E.nationality ";
      // }

      // ${str}

      options.mysql
        .executeQuery({
          query: `SELECT H.hospital_name,E.full_name,E.date_of_joining, E.employee_code,L.leave_description,LA.leave_application_code,
          SD.sub_department_name, D.designation,LA.from_date,LA.actual_to_date,LA.to_date, LA.application_date,
          CASE WHEN LA.status ='PEN' THEN 'Pending' WHEN LA.status ='APR' THEN 'Approved' else 'Processed' END as approval_status,LA.total_applied_days,LA.total_approved_days, US.user_display_name,LB.close_balance,
          CASE WHEN LA.leave_type='U' THEN 'Unpaid' else 'Paid' END as leave_type
          FROM hims_f_leave_application LA
          inner join hims_d_hospital H on LA.hospital_id = H.hims_d_hospital_id
          inner join hims_d_employee E on LA.employee_id = E.hims_d_employee_id
          left join algaeh_d_app_user US on LA.approved_by = US.algaeh_d_app_user_id
          inner join hims_d_designation D on E.employee_designation_id = D.hims_d_designation_id
          inner join hims_d_sub_department SD on E.sub_department_id = SD.hims_d_sub_department_id
          inner join hims_d_leave L on LA.leave_id = L.hims_d_leave_id
          inner join hims_f_employee_monthly_leave LB on LA.leave_id = LB.leave_id and LA.employee_id = LB.employee_id
          where hims_f_leave_application_id=?;`,
          values: [input.hims_f_leave_application_id],
          printQuery: true,
        })
        .then((result) => {
          resolve({
            result: result,

            // leave_amount: options.currencyFormat(
            //   result.length > 0 ? result[0].leave_amount : 0,
            //   options.args.crypto
            // ),

            // total_amount: options.currencyFormat(
            //   result.length > 0 ? result[0].total_amount : 0,
            //   options.args.crypto
            // ),
            // salary_in_words:
            //   options.args.crypto.currency_symbol +
            //   " " +
            //   writtenForm(result[0].total_amount) +
            //   " Only",
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
