// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  const moment = options.moment;
  return new Promise(function (resolve, reject) {
    try {
      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      options.mysql
        .executeQuery({
          query:
            "select QS.*, case QS.service_frequency WHEN 'M' then 'Monthly' WHEN 'W' then 'Weekly' \
              WHEN 'D' then 'Daily' WHEN 'H' then 'Hourly' WHEN 'PT' then 'Per Trip' \
              WHEN 'PV' THEN 'Per Visit' WHEN 'PS' THEN 'Per Test' \
                else 'Per Person' end as service_freq, QS.quantity as quantity ,SO.net_payable, SO.sub_total, \
                SO.discount_amount as net_discount, SO.net_total, SO.total_tax, S.service_name, \
                SO.sales_order_number,SO.sales_order_date,CASE SO.sales_person_id WHEN '' then SO.sales_man \
                else E.full_name end as employee_name,C.customer_name, C.address from hims_f_sales_order SO   \
                inner join hims_f_sales_order_services QS on SO.hims_f_sales_order_id=QS.sales_order_id   \
                inner join hims_d_customer C on SO.customer_id = C.hims_d_customer_id   \
                left join hims_d_employee E on SO.sales_person_id = E.hims_d_employee_id    \
                inner join hims_d_services S on S.hims_d_services_id = QS.services_id where \
                SO.sales_order_number=?;",
          values: [input.sales_order_number],
          printQuery: true,
        })
        .then((sales_service) => {
          resolve({
            sub_total: parseFloat(sales_service[0]["sub_total"]).toFixed(
              decimal_places
            ),
            net_discount: parseFloat(sales_service[0]["net_discount"]).toFixed(
              decimal_places
            ),
            net_total: parseFloat(sales_service[0]["net_total"]).toFixed(
              decimal_places
            ),
            total_tax: parseFloat(sales_service[0]["total_tax"]).toFixed(
              decimal_places
            ),
            net_payable: parseFloat(sales_service[0]["net_payable"]).toFixed(
              decimal_places
            ),

            sales_quotation_id: sales_service[0]["sales_quotation_id"],
            sales_quotation_number: sales_service[0]["sales_quotation_number"],
            customer_name: sales_service[0]["customer_name"],
            sales_order_number: sales_service[0]["sales_order_number"],
            sales_order_date: sales_service[0]["sales_order_date"],
            delivery_date: sales_service[0]["delivery_date"],
            employee_name: sales_service[0]["employee_name"],
            narration: sales_service[0]["narration"],
            address: sales_service[0]["address"],
            detailList: sales_service,
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

// const executePDF = function executePDFMethod(options) {
//   return new Promise(function (resolve, reject) {
//     try {
//       const decimal_places = options.args.crypto.decimal_places;
//       if (options.result.length > 0) {
//       } else {
//         resolve({ detailList: options.result });
//       }
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
// module.exports = { executePDF };
