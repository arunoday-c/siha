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
          query: `select BH.hims_f_billing_header_id,BH.bill_date,BD.hims_f_billing_details_id,BD.service_type_id, ST.service_type_code,ST.service_type, sum(BD.net_amout)as total_amount 
			from hims_f_billing_header BH 
			inner join hims_f_billing_details BD on BH.hims_f_billing_header_id=BD.hims_f_billing_header_id 
			inner join hims_d_service_type ST on BD.service_type_id=ST.hims_d_service_type_id and ST.record_status='A' 
			where BH.hospital_id=? and  BH.record_status='A' and BD.cancel_yes_no='N' and adjusted='N' and BD.record_status='A' and date(BH.bill_date) between date(?) and date(?)  group by BD.service_type_id `,
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
