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
          SELECT VD.voucher_type,VD.voucher_no,VD.amount,VD.payment_mode,VD.payment_date,
          VD.narration,VD.due_date,VD.settled_amount,VD.created_by,
          VN.vendor_name,VN.vendor_code,VN.contact_number,VN.address,VN.vat_number
          FROM finance_voucher_header VD
          inner join hims_f_procurement_grn_header IVH on IVH.inovice_number = VD.invoice_ref_no
          inner join hims_d_vendor VN on VN.hims_d_vendor_id = IVH.vendor_id
          where VD.finance_voucher_header_id=?;
          select FH.amount as opening_amount,FSH.amount, (FH.amount - FSH.amount) as closing_amount, FSH.invoice_ref_no
          from finance_voucher_sub_header FSH
          inner join finance_voucher_header FH on FH.invoice_no in ( FSH.invoice_ref_no)
          -- inner join hims_f_procurement_grn_header IVH on IVH.inovice_number = FH.invoice_ref_no
          -- inner join hims_d_vendor VN on VN.hims_d_vendor_id = IVH.vendor_id
          where FSH.finance_voucher_header_id=?;
          -- select IVH.grn_number,DATE(IVH.invoice_date) as invoice_date, IVH.inovice_number,
          -- DATE(IVH.grn_date) as grn_date,IVH.po_id,IVH.sub_total,IVH.net_total,IVH.detail_discount,IVH.total_tax,IVH.net_payable,IVH.hospital_id, FSH.amount
          -- from finance_voucher_sub_header FSH
          -- inner join finance_voucher_header FH on FH.finance_voucher_header_id = FSH.finance_voucher_header_id
          -- inner join hims_f_procurement_grn_header IVH on IVH.inovice_number = FH.invoice_ref_no
          -- inner join hims_d_vendor VN on VN.hims_d_vendor_id = IVH.vendor_id
          -- where FSH.finance_voucher_header_id=?;
          `,
          values: [input.voucher_header_id, input.voucher_header_id],
          printQuery: true,
        })
        .then((result) => {
          // console.log(subTotal);
          resolve({
            resultHeader: result[0].length > 0 ? result[0][0] : {},
            resultInvoice: result[1],
            totalNetPayable: _.sumBy(result[1], (s) => parseFloat(s.amount)),
            currency: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol,
            },
            currencyHeader: {
              decimal_places,
              addSymbol: true,
              symbol_position,
              currency_symbol,
            },
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
