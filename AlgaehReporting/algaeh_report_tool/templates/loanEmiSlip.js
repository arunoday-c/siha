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
          query: `SELECT HO.hospital_name,EM.employee_code,EM.full_name,EM.arabic_name,ED.designation,LM.loan_description,LO.loan_application_number,LO.start_month,LO.start_year,SL.salary_number,
            MONTHNAME(concat(SL.year,'-',SL.month,'-01')) as month_name,
            SL.month,SL.year,LO.approved_amount,LO.loan_tenure,LO.pending_tenure,LO.application_reason,LO.installment_amount,LO.loan_tenure,LO.loan_application_date, LO.loan_amount,LS.salary_header_id, PM.payment_date,LS.loan_due_amount,
            CASE WHEN LO.loan_closed='Y' THEN 'Closed' else 'Open' END as loan_status,
            CASE WHEN LS.loan_due_amount='0' THEN 'Skipped' else 'Deducted' END as loan_skipped,
            (LS.balance_amount - LS.loan_due_amount) as closing_balance,
            LS.balance_amount, LO.pending_loan
            FROM hims_f_loan_application as LO
            left join hims_d_employee as EM on EM.hims_d_employee_id = LO.employee_id
            left join hims_d_loan as LM on LM.hims_d_loan_id = LO.loan_id
            left join hims_f_employee_payments as PM on PM.employee_loan_id = LO.hims_f_loan_application_id
            left join hims_d_hospital as HO on HO.hims_d_hospital_id = LO.hospital_id
            left join hims_f_salary_loans as LS on LS.loan_application_id = LO.hims_f_loan_application_id
            left join hims_f_salary as SL on SL.hims_f_salary_id = LS.salary_header_id
            left join hims_d_designation as ED on ED.hims_d_designation_id=EM.employee_designation_id
            where LO.hims_f_loan_application_id=? and LO.loan_authorized='IS' and PM.cancel = 'N' order by SL.month, SL.year;`,
          values: [input.hims_f_loan_application_id],
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
