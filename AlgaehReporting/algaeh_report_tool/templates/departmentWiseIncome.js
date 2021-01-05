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
          query: `select S.sub_department_id,SD.sub_department_code,SD.sub_department_name , sum(BD.net_amout) as total_amount 
            from hims_f_billing_header BH 
            inner join hims_f_billing_details BD on BH.hims_f_billing_header_id=BD.hims_f_billing_header_id  
            inner join hims_d_services S on BD.services_id = S.hims_d_services_id and S.record_status='A' 
            inner join hims_d_sub_department SD on S.sub_department_id=SD.hims_d_sub_department_id 
            where BH.record_status='A' and BD.record_status='A' and BH.hospital_id=? and date(BH.bill_date) between date(?) and date(?) group by S.sub_department_id`,
          values: [input.hospital_id, input.from_date, input.to_date],
          printQuery: true,
        })
        .then((result) => {
          const data = {
            details: result,
            net_payable: options.currencyFormat(
              _.sumBy(result, (s) => parseFloat(s.total_amount)),
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
