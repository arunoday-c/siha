import algaehUtilities from "algaeh-utilities/utilities";
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  const mysql = options.mysql;
  const parameters = options.args;
  return new Promise(function(resolve, reject) {
    const internalParameters = parameters.reportParams;
    let inputs = {};
    const from_date = _.find(internalParameters, f => f.name == "from_date");
    if (from_date == null || from_date.value == "" || from_date.value == null) {
      reject(new Error("Please provide from date"));
      return;
    }
    const to_date = _.find(internalParameters, f => f.name == "to_date");
    if (to_date == null || to_date.value == "" || to_date.value == null) {
      reject(new Error("Please provide to date"));
      return;
    }

    try {
      mysql
        .executeQuery({
          query:
            "select pos_number,date(pos_date) as invoice_date,coalesce(net_total,0)as invoice_amt,\
coalesce(company_responsibility,0) as insurance_amt,coalesce(discount_amount,0) as discount_amount \
from hims_f_pharmacy_pos_header where  date(pos_date) between date(?) and date(?)",
          values: [from_date.value, to_date.value],
          printQuery: true
        })
        .then(result => {
          mysql.releaseConnection();
          const total_invoice_amt = _.groupBy(result, f =>
            parseFloat(f.invoice_amt)
          );
          const total_discount_amount = _.groupBy(result, f =>
            parseFloat(f.discount_amount)
          );
          resolve({
            details: result,
            total_invoice_amt: total_invoice_amt,
            total_discount_amount: total_discount_amount
          });
        })
        .catch(error => {
          mysql.releaseConnection();
          console.log("error", error);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
