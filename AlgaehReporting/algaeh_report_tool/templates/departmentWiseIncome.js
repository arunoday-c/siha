const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    try {
      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      options.mysql
        .executeQuery({
          query: `select EM.full_name,SD.hims_d_sub_department_id,SD.sub_department_name,SD.sub_department_code,BH.bill_number,
          BD.patient_resp,BD.comapany_resp, sum(BD.patient_resp + BD.comapany_resp) as net_income from hims_f_billing_details as BD
          inner join hims_f_billing_header BH on BH.hims_f_billing_header_id = BD.hims_f_billing_header_id
          inner join hims_d_employee EM on EM.hims_d_employee_id = BH.incharge_or_provider
          inner join hims_d_sub_department SD on SD.hims_d_sub_department_id = EM.sub_department_id
          where BH.hospital_id=? and BD.cancel_yes_no <> 'Y' and date(BH.bill_date) between date(?) and date(?) 
          group by SD.hims_d_sub_department_id  order by SD.hims_d_sub_department_id ASC;`,
          values: [input.hospital_id, input.from_date, input.to_date],
          printQuery: true,
        })
        .then((result) => {
          const data = {
            details: result,
            net_payable: options.currencyFormat(
              _.sumBy(result, (s) => parseFloat(s.net_income)),
              options.args.crypto
            ),
          };
          resolve(data);
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
