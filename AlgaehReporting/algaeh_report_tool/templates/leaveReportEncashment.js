const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      const _ = options.loadash;

      let str = "";

      let input = {};
      let params = options.args.reportParams;

      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      //utilities.logger().log("input: ", input);

      if (input.hims_d_leave_id > 0) {
        str += ` and H.leave_id=${input.hims_d_leave_id}`;
      }
      if (input.employee_group_id > 0) {
        str += ` and E.employee_group_id= ${input.employee_group_id}`;
      }

      options.mysql
        .executeQuery({
          query: `select hims_f_leave_encash_header_id, encashment_number,encashment_date,leave_days,E.employee_code,group_description,
                E.full_name,total_amount,L.leave_description, case H.posted when 'Y' then 'YES' else 'NO' end as paid
                from hims_f_leave_encash_header H inner join hims_d_employee E on H.employee_id=E.hims_d_employee_id
                inner join hims_d_leave L on H.leave_id=L.hims_d_leave_id
                left join hims_d_employee_group G on E.employee_group_id=G.hims_d_employee_group_id
                where authorized='APR' and H.hospital_id=? and year=?  and date_format(encashment_date,'%m')=? ${str};`,
          values: [input.hospital_id, input.year, input.month],
          printQuery: true
        })
        .then(results => {
          resolve({ detail: results });
        })
        .catch(error => {
          options.mysql.releaseConnection();
        });

      //const result = { detailList: options.result };
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
