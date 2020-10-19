const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;

      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });


      options.mysql
        .executeQuery({
          query: `
          SELECT VD.voucher_no,CD.child_name,FD.credit_amount, FD.payment_date,VD.narration as narration_head
          FROM finance_voucher_details as FD
          inner join finance_account_head AD on FD.head_id = AD.finance_account_head_id
          inner join finance_account_child CD on FD.child_id = CD.finance_account_child_id
          inner join finance_voucher_header VD on FD.voucher_header_id = VD.finance_voucher_header_id
          where VD.finance_voucher_header_id=? and payment_type='CR';
          SELECT AD.account_name, AD.arabic_account_name, CD.child_name,CD.arabic_child_name, FD.debit_amount, FD.credit_amount, FD.payment_type, FD.payment_date, FD.narration as narration_detail,VD.narration as narration_head
          FROM finance_voucher_details as FD
          inner join finance_account_head AD on FD.head_id = AD.finance_account_head_id
          inner join finance_account_child CD on FD.child_id = CD.finance_account_child_id
          inner join finance_voucher_header VD on FD.voucher_header_id = VD.finance_voucher_header_id
          where VD.finance_voucher_header_id=? and payment_type='DR';`,
          values: [input.voucher_header_id,input.voucher_header_id],
          printQuery: true,
        })
        .then((result) => {         
          resolve({            
            resultHeader: result[0].length > 0 ? result[0][0] : {},
            // subTotal:resultHeader.amount,
            resultInvoice: result[1],
            currency: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol
            },
            currencyHeader: {
              decimal_places,
              addSymbol: true,
              symbol_position,
              currency_symbol
            }
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
