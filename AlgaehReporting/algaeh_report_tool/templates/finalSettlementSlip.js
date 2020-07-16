const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;
      const writtenForm = options.writtenForm;

      const params = options.args.reportParams;
      let input = {};

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      // const month = moment(input.month, "M").format("MMMM");

      options.mysql
        .executeQuery({
          query: `select H.hospital_name,E.full_name,E.arabic_name,
E.employee_code,DE.designation, SD.sub_department_name,
E.exit_date,E.date_of_joining,E.date_of_resignation,FL.final_settlement_number,
case FL.final_settlement_status when 'PEN' then 'Pending for Authorize' when 'AUT' then 'Authorized'
else 'Settled' end as final_settlement_status,FL.settled_date,FL.total_amount,
FL.total_earnings,FL.total_deductions,FL.total_loans,FL.total_salary,
FL.total_eos,FL.total_leave_encash,FL.forfiet,FL.remarks,FL.posted,
FL.posted_date,FL.posted_by,FL.cancelled,FL.cancelled_by,FL.cancelled_date,
S.month,S.year,FL.remarks
FROM hims_f_final_settlement_header as FL
inner join hims_d_employee E on E.hims_d_employee_id = FL.employee_id
inner join hims_d_hospital H on H.hims_d_hospital_id = E.hospital_id
inner join hims_d_designation DE on DE.hims_d_designation_id = E.employee_designation_id
left join hims_f_salary as S  on S.hims_f_salary_id = FL.salary_id
 inner join hims_d_sub_department as SD on SD.hims_d_sub_department_id=E.sub_department_id
where FL.employee_id=?;
select SE.earnings_id,ED.earning_deduction_description,SE.amount,'Normal' as salary_type
 from hims_f_salary_earnings as SE left join hims_f_final_settlement_header as FH
 on  SE.salary_header_id = FH.salary_id
inner  join hims_d_earning_deduction as ED on ED.hims_d_earning_deduction_id = SE.earnings_id
 where FH.employee_id=?
 union
 select FE.earnings_id,ED.earning_deduction_description,FE.amount,'Misc' as salary_type
 from hims_f_final_settle_earnings_detail as FE left join hims_f_final_settlement_header as FH
 on  FE.final_settlement_header = FH.hims_f_final_settlement_header_id
inner  join hims_d_earning_deduction as ED on ED.hims_d_earning_deduction_id = FE.earnings_id
 where FH.employee_id=?;
 select SD.deductions_id,ED.earning_deduction_description,SD.amount,'Normal' as salary_type
 from hims_f_salary_deductions as SD left join hims_f_final_settlement_header as FH
 on  SD.salary_header_id = FH.salary_id
inner  join hims_d_earning_deduction as ED on ED.hims_d_earning_deduction_id = SD.deductions_id
 where FH.employee_id=?
 union
 select FD.deductions_id,ED.earning_deduction_description,FD.amount,'Misc' as salary_type
 from hims_f_final_settle_deductions_detail as FD left join hims_f_final_settlement_header as FH
 on  FD.final_settlement_header_id = FH.hims_f_final_settlement_header_id
inner  join hims_d_earning_deduction as ED on ED.hims_d_earning_deduction_id = FD.deductions_id
 where FH.employee_id=?;`,
          values: [
            input.employee_id,
            input.employee_id,
            input.employee_id,
            input.employee_id,
            input.employee_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          if (result.length > 0) {
            const headerData = result[0][0];
            const earningsData = result[1];
            const deductionData = result[2];

            const emp_ded_length = deductionData.length;
            const emp_ear_length = earningsData.length;

            if (emp_ded_length > emp_ear_length) {
              const blankIndexs = emp_ded_length - emp_ear_length;
              for (let d = 0; d < blankIndexs; d++) {
                earningsData.push({});
              }
            } else if (emp_ear_length > emp_ded_length) {
              const blankIndexs = emp_ear_length - emp_ded_length;
              for (let d = 0; d < blankIndexs; d++) {
                deductionData.push({});
              }
            }

            resolve({
              ...headerData,
              ...{
                month: moment(headerData.month, "MM").format("MMMM"),

                total_amount: options.currencyFormat(
                  headerData.total_amount,
                  options.args.crypto
                ),

                salary_in_words:
                  options.args.crypto.currency_symbol +
                  " " +
                  writtenForm(headerData.total_amount) +
                  " Only",
              },
              earningsData,
              deductionData,
            });
          } else {
            resolve({});
          }
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
