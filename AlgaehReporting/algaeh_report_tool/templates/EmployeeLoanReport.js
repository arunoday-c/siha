// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    try {
      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;
      // const utilities = new algaehUtilities();
      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      let strData = "";

      if (input.employee_group_id > 0) {
        strData += ` and E.employee_group_id= ${input.employee_group_id}`;
      }

      if (input.department_id > 0) {
        strData += " and SD.department_id=" + input.department_id;
      }

      if (input.sub_department_id > 0) {
        strData += " and E.sub_department_id=" + input.sub_department_id;
      }

      let is_local = "";
      if (input.is_local === "Y") {
        is_local = " and H.default_nationality=E.nationality ";
      } else if (input.is_local === "N") {
        is_local = " and H.default_nationality<>E.nationality ";
      }

      options.mysql
        .executeQuery({
          query: `select loan_application_number, employee_id, loan_id, L.loan_description, application_reason, date_format(loan_application_date,'%d-%m-%Y') as loan_application_date, \
						loan_authorized, loan_closed, loan_amount, approved_amount, start_month, start_year, loan_tenure, \
						pending_tenure, installment_amount, pending_loan, loan_dispatch_from, E.employee_code, \
						E.full_name as employee_name, SD.sub_department_code, SD.sub_department_name, D.department_name, \
            EG.group_description from hims_f_loan_application LA    inner join hims_d_loan L \
            on LA.loan_id=L.hims_d_loan_id \
						inner join  hims_d_employee E on LA.employee_id=E.hims_d_employee_id \
						inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id \
						left join hims_d_department D on SD.department_id=D.hims_d_department_id \
						left join hims_d_employee_group EG on E.employee_group_id=EG.hims_d_employee_group_id \ left join hims_d_hospital H  on E.hospital_id=H.hims_d_hospital_id \
						where date(loan_application_date) between date(?) and date(?) and LA.hospital_id=?  ${is_local} ${strData} ;`,
          values: [input.from_date, input.to_date, input.hospital_id],
          printQuery: true
        })
        .then(ress => {
          if (ress.length > 0) {
            let total_loan_amount = 0;
            total_loan_amount = _.sumBy(ress, s =>
              parseFloat(s.loan_amount)
            ).toFixed(decimal_places);

            let total_approved_amount = 0;
            total_approved_amount = _.sumBy(ress, s =>
              parseFloat(s.approved_amount)
            ).toFixed(decimal_places);

            let total_installment_amount = 0;
            total_installment_amount = _.sumBy(ress, s =>
              parseFloat(s.installment_amount)
            ).toFixed(decimal_places);

            let total_pending_loan = 0;
            total_pending_loan = _.sumBy(ress, s =>
              parseFloat(s.pending_loan)
            ).toFixed(decimal_places);

            const result = {
              details: ress,
              total_loan_amount: total_loan_amount,
              total_approved_amount: total_approved_amount,
              total_installment_amount: total_installment_amount,
              total_pending_loan: total_pending_loan
            };

            // utilities.logger().log("outputArray:", result);
            resolve(result);
          } else {
            resolve({
              result: { details: ress }
            });
          }
        })
        .catch(error => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
