const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      console.log("INPUT:", input);

      options.mysql
        .executeQuery({
          query: `SELECT AD.account_name, AD.arabic_account_name, CD.child_name,CD.arabic_child_name, FD.debit_amount, FD.credit_amount, FD.payment_type, FD.payment_date, VD.narration
          FROM finance_voucher_details as FD
          inner join finance_account_head AD on FD.head_id = AD.finance_account_head_id
          inner join finance_account_child CD on FD.child_id = CD.finance_account_child_id
          inner join finance_voucher_header VD on FD.voucher_header_id = VD.finance_voucher_header_id
          where VD.finance_voucher_header_id=?;`,
          values: [input.voucher_header_id],
          printQuery: true,
        })
        .then((result) => {
          resolve({
            result: result,
            no_employees: result.length,
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
