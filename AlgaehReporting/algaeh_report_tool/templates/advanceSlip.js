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
          query: `SELECT HO.hospital_name,EM.employee_code,EM.full_name,EM.arabic_name,ED.designation, AD.advance_reason, AD.advance_number,AD.advance_amount,
          AD.deducting_year,AD.created_date,
          MONTHNAME(concat(AD.deducting_year,'-',AD.deducting_month,'-01')) as month_name,AD.advance_status,
          CASE WHEN AD.advance_status='PAI' THEN 'Approved & Paid'  WHEN AD.advance_status='APR' THEN 'Approved & Unpaid' WHEN AD.advance_status='REJ' THEN 'Rejected & Unpaid' END AS advance_status
          FROM hims_f_employee_advance AD
          left join hims_d_employee as EM on EM.hims_d_employee_id = AD.employee_id
          left join hims_d_hospital as HO on HO.hims_d_hospital_id = AD.hospital_id
          left join hims_d_designation as ED on ED.hims_d_designation_id=EM.employee_designation_id
          where hims_f_employee_advance_id=?;`,
          values: [input.hims_f_employee_advance_id],
          printQuery: true,
        })
        .then((result) => {
          const header = result.length ? result[0] : {};
          // const total_approved_amount = options.currencyFormat(_.sumBy(result, s => parseFloat(s.approved_amount)),options.args.crypto);
          const detail = result.filter((f) => f.salary_header_id !== null);
          resolve({
            result: detail,
            header,
            // start_month: moment(header.start_month, "M").format("MMMM"),
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
