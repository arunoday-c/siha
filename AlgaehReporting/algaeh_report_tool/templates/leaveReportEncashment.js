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
      const decimal_places = options.args.crypto.decimal_places;

      //utilities.logger().log("input: ", input);

      if (input.hims_d_leave_id > 0) {
        str += ` and H.leave_id=${input.hims_d_leave_id}`;
      }
      if (input.employee_group_id > 0) {
        str += ` and E.employee_group_id= ${input.employee_group_id}`;
      }
      let is_local = "";

      if (input.is_local === "Y") {
        is_local = " and HO.default_nationality=E.nationality ";
      } else if (input.is_local === "N") {
        is_local = " and HO.default_nationality<>E.nationality ";
      }
      options.mysql
        .executeQuery({
          query: `select hims_f_leave_encash_header_id, encashment_number,encashment_date,leave_days,E.employee_code,group_description,
                E.full_name,total_amount,L.leave_description, case H.posted when 'Y' then 'YES' else 'NO' end as paid
                from hims_f_leave_encash_header H inner join hims_d_employee E on H.employee_id=E.hims_d_employee_id
                inner join hims_d_leave L on H.leave_id=L.hims_d_leave_id
                left join hims_d_employee_group G on E.employee_group_id=G.hims_d_employee_group_id\
                left join hims_d_hospital HO  on E.hospital_id=HO.hims_d_hospital_id \
                where authorized='APR' and H.hospital_id=? and year=?  and date_format(encashment_date,'%m')=? ${is_local}  ${str};`,
          values: [input.hospital_id, input.year, input.month],
          printQuery: true
        })
        .then(results => {
          let sum_encash_amt = 0;

          if (results.length) {
            sum_encash_amt = _.sumBy(results, s => parseFloat(s.total_amount));
            resolve({
              detail: results,
              sum_encash_amt: sum_encash_amt.toFixed(decimal_places)
            });
          } else {
            resolve({
              detail: results,
              sum_encash_amt: sum_encash_amt.toFixed(decimal_places)
            });
          }
        })
        .catch(error => {
          options.mysql.releaseConnection();
        });
      //sum_encash_amt
      //const result = { detailList: options.result };
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
