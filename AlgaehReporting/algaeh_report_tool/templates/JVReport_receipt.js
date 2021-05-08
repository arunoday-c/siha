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

      console.log("input===", input);

      if (input.receipt_type === "S") {
        str = `SELECT IVH.invoice_number,
        IVH.invoice_date,IVH.sales_invoice_mode,IVH.sales_order_id,IVH.customer_id,
        IVH.sub_total,IVH.net_total,IVH.discount_amount,IVH.total_tax,IVH.net_payable,
        IVH.narration as invNarration,IVH.hospital_id
        FROM finance_voucher_header VD
        inner join hims_f_sales_invoice_header IVH on IVH.invoice_number = VD.invoice_ref_no
        where VD.finance_voucher_header_id=?;`;
      } else {
        str = `select IVH.invoice_number,
        IVH.invoice_date,IVH.sales_invoice_mode,IVH.sales_order_id,IVH.customer_id,
        FH.amount as sub_total, FSH.amount as net_total,FSH.amount as net_payable,
        FSH.invoice_ref_no
        from finance_voucher_sub_header FSH
        inner join finance_voucher_header FH on FH.invoice_no in ( FSH.invoice_ref_no)
        inner join hims_f_sales_invoice_header IVH on IVH.invoice_number = FSH.invoice_ref_no
        left join finance_voucher_sub_header FSHH on FSHH.finance_voucher_header_id<? and FSHH.invoice_ref_no in ( FSH.invoice_ref_no)
        where FSH.finance_voucher_header_id=? and FH.voucher_type='sales';`;
      }

      options.mysql
        .executeQuery({
          query:
            `SELECT VD.voucher_type,VD.voucher_no,VD.amount,VD.payment_mode,VD.payment_date,
          VD.narration,VD.due_date,VD.settled_amount,VD.created_by,IVH.customer_id,IVH.sales_order_id,
          CO.customer_name,CO.customer_code,CO.contact_number,CO.address,CO.vat_number,
          VDD.payment_type,VDD.head_id,VDD.child_id,FCD.head_id,FCD.finance_account_child_id,FCD.child_name,FCD.arabic_child_name
          FROM finance_voucher_header VD
          inner join hims_f_sales_invoice_header IVH on IVH.invoice_number = VD.invoice_ref_no
          inner join hims_d_customer CO on CO.hims_d_customer_id = IVH.customer_id
          inner join finance_voucher_details VDD on VDD.voucher_header_id = VD.finance_voucher_header_id and VDD.payment_type='DR'
          inner join finance_account_child FCD on FCD.finance_account_child_id = VDD.child_id and FCD.head_id = VDD.head_id
          where VD.finance_voucher_header_id=?;` + str,
          values: [
            input.voucher_header_id,
            input.voucher_header_id,
            input.voucher_header_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          // console.log(subTotal);
          resolve({
            resultHeader: result[0].length > 0 ? result[0][0] : {},
            resultInvoice: result[1],
            totalNetPayable: _.sumBy(result[1], (s) =>
              parseFloat(s.net_payable)
            ),
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
