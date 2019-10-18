// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    try {
      let input = {};
      let params = options.args.reportParams;
      const moment = options.moment;
      // const utilities = new algaehUtilities();
      params.forEach(para => {
        input[para["name"]] = para["value"];
      });
      console.log("noor", input.month + input.year);
      let from_date = null;
      let to_date = null;

      if (parseFloat(input.month) > 0) {
        from_date = moment(
          input.year + "-" + input.month + "-" + "01",
          "YYYY-MM-DD"
        ).format("YYYY-MM-DD");

        to_date = moment(from_date)
          .endOf("month")
          .format("YYYY-MM-DD");
      } else {
        from_date = moment(
          input.year + "-" + "01" + "-" + "01",
          "YYYY-MM-DD"
        ).format("YYYY-MM-DD");

        to_date = moment(new Date()).format("YYYY-MM-DD");
      }

      console.log("from_date", from_date);
      console.log("to_date", to_date);
      options.mysql
        .executeQuery({
          query: `select sum(net_total) as total_before_vat, sum(net_amount) as total_after_vat,  \
					sum(patient_tax) as patient_tax, sum(company_tax) as company_tax,bill_date,date_format(bill_date,'%m')as month_name, \
					"OP Billing" as data_from from hims_f_billing_header  where cancelled='N'  and hospital_id=1 and \
					bill_date between date(?) and date(?) group by date_format(bill_date,'%m'); \
					select sum(net_total) as total_before_vat, sum(gross_total) as total_after_vat, sum(patient_tax) as patient_tax,\
					sum(company_tax) as company_tax, pos_date, date_format(pos_date,'%m')as month_name, "Pharmacy" as data_from  \
					from hims_f_pharmacy_pos_header where cancelled='N' and posted='Y' and hospital_id=? and \
					pos_date between date(?) and date(?) group by date_format(pos_date,'%m');`,
          values: [
            from_date,
            to_date,
            input.hospital_id,
            from_date,
            to_date,
            input.hospital_id
          ],
          printQuery: true
        })
        .then(ress => {
          let final_result = ress[0];
          final_result = final_result.concat(ress[1]);
          const result = {
            details: final_result
          };

          resolve(result);
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
