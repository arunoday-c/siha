const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;
      const writtenForm = options.writtenForm;

      let str = "";
      let input = {};
      let params = options.args.reportParams;
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      // console.log("INPUT:", input);
      options.mysql
        .executeQuery({
          query: `SELECT E.hims_d_employee_id, E.employee_code,LA.employee_joined,LA.early_rejoin, E.full_name,LA.actual_to_date,
          DATE_ADD(LA.actual_to_date, INTERVAL 1 DAY) as expectedDate, E.last_salary_process_date,LA.from_date,LA.to_date, 
          SD.sub_department_name, D.department_name, EG.group_description,LA.leave_application_code, HO.hospital_name, 
          LA.hims_f_leave_application_id FROM hims_d_employee E 
          inner join hims_d_sub_department SD on E.sub_department_id = SD.hims_d_sub_department_id 
          inner join hims_d_department D on SD.department_id = D.hims_d_department_id 
          inner join hims_d_employee_group EG on EG.hims_d_employee_group_id = E.employee_group_id 
          left join hims_f_leave_application LA on E.hims_d_employee_id = LA.employee_id 
          left join hims_d_hospital as HO on HO.hims_d_hospital_id = LA.hospital_id
          where E.record_status = 'A'  and LA.status='APR' and LA.processed='Y' and E.hospital_id=? order by LA.to_date desc; `,
          values: [input.hospital_id],
          printQuery: true,
        })
        .then((result) => {
          const header = result.length ? result[0] : {};
          // const total_approved_amount = options.currencyFormat(_.sumBy(result, s => parseFloat(s.approved_amount)),options.args.crypto);
          const detail = result.filter((f) => f.salary_header_id !== null);
          resolve({
            result: detail,
            header,
            start_month: moment(header.start_month, "M").format("MMMM"),
            // total_approved_amount,
            currency: {
              decimal_places,
              addSymbol: true,
              symbol_position,
              currency_symbol,
            },
            currencyheader: {
              decimal_places,
              addSymbol: true,
              symbol_position,
              currency_symbol,
            },
          });

          console.log(month);
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
