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
          query: `select H.hospital_name,ER.*,ED.designation,
          case when ER.reciepts_type ='LO' then LA.loan_application_number else FL.final_settlement_number end as appl_no,
          case when ER.reciepts_type ='LO' then 'Loan Receipt' else 'Final Settlement Receipt' end as reciepts_type,
          case when ER.reciepts_mode ='CS' then 'Cash' when ER.reciepts_mode ='CH' then 'Card' else 'Salary' end as reciepts_mode,
          case when ER.reciepts_mode ='CS' then '' when ER.reciepts_mode ='CH' then ER.cheque_number else SL.salary_number end as paymentNo,
          E.employee_code,E.full_name as employee_name,SL.salary_number
          from hims_f_employee_reciepts ER 
          left join hims_f_loan_application LA on ER.loan_application_id=LA.hims_f_loan_application_id
          left join hims_d_loan L on LA.loan_id=L.hims_d_loan_id 
          left join hims_d_employee E on ER.employee_id=E.hims_d_employee_id 
          left join hims_f_salary SL on SL.hims_f_salary_id=ER.salary_id 
          left join hims_f_final_settlement_header FL on FL.hims_f_final_settlement_header_id=ER.final_settlement_id
          left join hims_d_hospital H on H.hims_d_hospital_id=ER.hospital_id
          left join hims_d_designation as ED on ED.hims_d_designation_id=E.employee_designation_id
          where ER.hims_f_employee_reciepts_id=? order by hims_f_employee_reciepts_id desc;`,
          values: [input.hims_f_employee_reciepts_id],
          printQuery: true,
        })
        .then((result) => {
          //   const header = result.length ? result[0] : {};
          // const total_approved_amount = options.currencyFormat(_.sumBy(result, s => parseFloat(s.approved_amount)),options.args.crypto);
          //   const detail = result.filter((f) => f.salary_header_id !== null);
          console.log("result==", result);
          resolve({
            // result: detail,
            result,
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
