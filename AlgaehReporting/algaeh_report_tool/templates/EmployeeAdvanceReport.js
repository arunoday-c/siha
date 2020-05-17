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

      if (input.status) {
        str += ` and adv.advance_status= "${input.status}"`;
      }

      options.mysql
        .executeQuery({
          query: `select adv.hims_f_employee_advance_id, adv.advance_number as request_number,\
		  DATE_FORMAT(adv.created_date, '%d-%m-%Y')  as request_date, adv.employee_id,\
		  emp.employee_code,emp.full_name,MONTHNAME(CONCAT('2011-',adv.deducting_month,'-01')) as deducting_month,\
		  adv.deducting_year,adv.advance_amount as payment_amount,adv.advance_reason as adv_reason,\
		  case when advance_status='PAI' then 'Approved & Paid'  when advance_status='APR' then 'Approved & Unpaid' \
		  when advance_status='REJ' then 'Rejected & Unpaid' end as status from hims_f_employee_advance adv,\
		  hims_d_employee emp where adv.employee_id = emp.hims_d_employee_id and adv.hospital_id=?\
		  and adv.deducting_year = ?  and adv.deducting_month = ? ${str}`,
          values: [input.hospital_id, input.year, input.month],
          printQuery: true,
        })
        .then((result) => {
          resolve({
            result: result,
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
