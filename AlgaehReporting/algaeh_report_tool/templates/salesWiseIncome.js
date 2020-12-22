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

      if (input.employee_id > 0) {
        str += ` and SO.sales_person_id= ${input.employee_id}`;
      }
      if (input.customer_id > 0) {
        str += ` and SI.customer_id= ${input.customer_id}`;
      }

      options.mysql
        .executeQuery({
          query:
            `SELECT SI.invoice_number, date(SI.invoice_date) as invoice_date,SI.net_payable, 
          SI.return_done,SI.is_posted, SO.sales_person_id,EM.full_name as sales_per_name, 
          CO.customer_name from hims_f_sales_invoice_header SI 
          inner join hims_d_customer as CO on SI.customer_id = CO.hims_d_customer_id 
          inner join hims_f_sales_order as SO on SI.sales_order_id = SO.hims_f_sales_order_id 
          inner join hims_d_employee as EM on SO.sales_person_id = EM.hims_d_employee_id 
          where date(SI.invoice_date) between date(?) and date(?) and SI.is_posted='Y' and SI.return_done='N'` +
            str,
          values: [input.from_date, input.to_date],
          printQuery: true,
        })
        .then((result) => {
          const data = {
            details: result,
            net_payable: options.currencyFormat(
              _.sumBy(result, (s) => parseFloat(s.net_payable)),
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
