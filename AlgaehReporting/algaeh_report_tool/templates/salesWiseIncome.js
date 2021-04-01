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

      if (input.posted_status == "Y") {
        str += ` and SI.is_posted='Y'`;
      } else if (input.posted_status == "N") {
        str += ` and SI.is_posted='N'`;
      }

      if (input.revert_status == "Y") {
        str += ` and SI.is_revert='Y'`;
      } else if (input.revert_status == "N") {
        str += ` and SI.is_revert='N'`;
      }

      if (input.return_status == "Y") {
        str += ` and SI.return_done='Y'`;
      } else if (input.return_status == "N") {
        str += ` and SI.return_done='N'`;
      }
      if (input.cancel_status == "Y") {
        str += ` and SI.is_cancelled='Y'`;
      } else if (input.cancel_status == "N") {
        str += ` and SI.is_cancelled='N'`;
      }

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
          case when SI.return_done='Y' then 'Yes' else 'No' end as return_done,
          case when SI.is_revert='Y' then 'Yes' else 'No' end as is_revert,
          case when SI.is_posted='Y' then 'Yes' else 'No' end as is_posted,
          case when SI.is_cancelled='Y' then 'Yes' else 'No' end as is_cancelled,
          SI.sales_person_id,EM.full_name as sales_per_name, CO.customer_name
          from hims_f_sales_invoice_header SI
          inner join hims_d_customer as CO on SI.customer_id = CO.hims_d_customer_id 
          left join hims_f_sales_order as SO on SI.sales_order_id = SO.hims_f_sales_order_id 
          left join hims_d_employee as EM on SO.sales_person_id = EM.hims_d_employee_id 
          where date(SI.invoice_date) between date(?) and date(?) and SI.return_done='N'` +
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
