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
            query: `SELECT LA.hims_f_leave_application_id,HO.hospital_name,EM.employee_code,EM.full_name,LM.leave_description,LA.leave_application_code,DATE(LA.application_date) as application_date,LA.from_date,LA.actual_to_date,LA.to_date,LA.total_applied_days,LA.remarks,LA.leave_type, LA.leave_category, EMP.payment_date,
            CASE WHEN LA.early_rejoin='Y' THEN 'Yes' else 'No' END as early_rejoin 
            FROM hims_f_leave_application as LA
            left join hims_d_employee as EM on EM.hims_d_employee_id=LA.employee_id
            left join hims_d_leave as LM on LM.hims_d_leave_id=LA.leave_id
            left join hims_d_hospital as HO on HO.hims_d_hospital_id = LA.hospital_id
            left join hims_f_leave_salary_detail as LSD on LSD.leave_application_id = LA.hims_f_leave_application_id
            left join hims_f_leave_salary_header as LSH on LSH.hims_f_leave_salary_header_id = LSD.leave_salary_header_id
            left join hims_f_employee_payments as EMP on EMP.employee_leave_settlement_id = LSH.hims_f_leave_salary_header_id
            where LA.employee_joined='Y' and LA.status='APR' and LA.leave_category='A' and EMP.cancel='N'  and LA.hospital_id=? group by LA.hims_f_leave_application_id `,
            values: [input.hospital_id],
            printQuery: true,
          })
          .then((result) => {              
            const header = result.length ? result[0] : {};
            // const total_approved_amount = options.currencyFormat(_.sumBy(result, s => parseFloat(s.approved_amount)),options.args.crypto);
            const detail=result.filter(f => f.salary_header_id !== null);
            resolve({
              result: detail,
              header,
              start_month:moment(header.start_month, "M").format("MMMM"),
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
  