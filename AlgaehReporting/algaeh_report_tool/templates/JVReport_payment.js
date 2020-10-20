const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      const _ = options.loadash;
      const {
        decimal_places,
        symbol_position,
        currency_symbol
      } = options.args.crypto;

      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      options.mysql
        .executeQuery({
          query: `SELECT VH.voucher_no,VH.voucher_type,VH.amount,VH.payment_date,VH.settled_amount, VD.child_id, VN.vendor_name,VN.address,VN.contact_number,VH.narration
          FROM finance_voucher_header as VH
          left join finance_voucher_details as VD on  VD.voucher_header_id = VH.finance_voucher_header_id
          inner join hims_d_vendor as VN on  VN.child_id = VD.child_id
          where VH.finance_voucher_header_id=? group by VN.hims_d_vendor_id;
          SELECT VH.voucher_no,VH.invoice_no,VH.due_date,VH.amount,VH.payment_date,VH.settled_amount,VH.voucher_type, (VH.amount - VH.settled_amount) as balance
          FROM finance_voucher_header as VH
          left join finance_voucher_sub_header as VSH on VH.invoice_no=VSH.invoice_ref_no
          where VH.finance_voucher_header_id=?;`,
          values: [input.voucher_header_id, input.voucher_header_id],
          printQuery: true
        })
        .then(result => {
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
        .catch(error => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
