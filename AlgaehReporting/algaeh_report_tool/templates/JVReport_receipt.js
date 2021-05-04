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
          CU.customer_name,CU.customer_code,CU.contact_number,CU.address,CU.vat_number
          FROM finance_voucher_header VD
          inner join hims_f_sales_invoice_header IVH on IVH.invoice_number = VD.invoice_ref_no
          inner join hims_d_customer CU on CU.hims_d_customer_id = IVH.customer_id
          where VD.finance_voucher_header_id=?;
          select FH.amount as opening_amount, FSH.amount as paid_amount, coalesce(FSHH.amount,0) as previous_amount,
          FSH.invoice_ref_no
          from finance_voucher_sub_header FSH
          inner join finance_voucher_header FH on FH.invoice_no in ( FSH.invoice_ref_no)
          left join finance_voucher_sub_header FSHH on FSHH.finance_voucher_header_id<? and FSHH.invoice_ref_no in ( FSH.invoice_ref_no)
          where FSH.finance_voucher_header_id=? and FH.voucher_type='sales' ;
          select FH.voucher_type,FH.amount as opening_amount,FSH.amount, FSH.amount, 
          (FH.amount - FSH.amount) as closing_amount, FSH.invoice_ref_no from finance_voucher_sub_header FSH
          inner join finance_voucher_header FH on FH.invoice_no in ( FSH.invoice_ref_no)           
          where FSH.finance_voucher_header_id=? and FH.voucher_type='credit_note';
          `,
          values: [
            input.voucher_header_id,
            input.voucher_header_id,
            input.voucher_header_id,
            input.voucher_header_id,
            input.voucher_header_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          // console.log(subTotal);
          const totalNetPayable = _.sumBy(result[1], (s) =>
            parseFloat(s.paid_amount)
          );
          const totalCredit_Amt = _.sumBy(result[2], (s) =>
            parseFloat(s.amount)
          );
          const invoiceReArrange = _.chain(result[1])
            .groupBy((g) => g.invoice_ref_no)
            .map((details, key) => {
              const { invoice_ref_no, opening_amount, paid_amount } = _.head(
                details
              );

              return {
                invoice_ref_no,
                opening_amount,
                paid_amount,
                previous_amount: _.sumBy(details, (s) =>
                  parseFloat(s.previous_amount)
                ),
                closing_amount:
                  opening_amount -
                  paid_amount -
                  _.sumBy(details, (s) => parseFloat(s.previous_amount)),

                // resultFor: result,
              };
            })
            .value();

          resolve({
            resultHeader: result[0].length > 0 ? result[0][0] : {},
            resultInvoice: invoiceReArrange,
            resultCredit_note: result[2],
            totalNetPayable: totalNetPayable,
            totalCredit_Amt: totalCredit_Amt,
            totalpaid_amt: totalNetPayable - totalCredit_Amt,
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
