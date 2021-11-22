const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const { decimal_places, symbol_position, currency_symbol } =
        options.args.crypto;

      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      console.log("input===", input);

      str = `select * from  finance_voucher_sub_header FSH where FSH.finance_voucher_header_id=? group by FSH.finance_voucher_sub_header_id;`;

      options.mysql
        .executeQuery({
          query:
            ` SELECT VD.voucher_type,VD.voucher_no,VD.amount,VD.payment_mode,VD.payment_date,
            VD.narration,VD.due_date,VD.settled_amount,VD.created_by,
            VN.vendor_name,VN.vendor_code,VN.contact_number,VN.address,VN.vat_number
            FROM finance_voucher_header VD
            left join hims_f_procurement_grn_header IVH on IVH.inovice_number = VD.invoice_ref_no
            left join hims_d_vendor VN on VN.hims_d_vendor_id = IVH.vendor_id
            where VD.finance_voucher_header_id=?;` + str,
          values: [
            input.voucher_header_id,
            input.voucher_header_id,
            input.voucher_header_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          const advanceArray = result[1].filter(
            (f) => f.voucher_type_group === "advance"
          );
          const debitNoteArray = result[1].filter(
            (f) => f.voucher_type_group === "debit_note"
          );
          const paymentArray = result[1].filter(
            (f) => f.voucher_type_group === "payment"
          );

          const finalResult = {
            resultHeader: result[0].length > 0 ? result[0][0] : {},
            debitNoteArray: debitNoteArray,
            advanceArray: advanceArray,
            paymentArray: paymentArray,
            // resultInvoice: result[1],
            totalNetPayable: _.sumBy(result[1], (s) =>
              parseFloat(s.net_payable)
            ),

            debitNoteTotals: {
              subTotal: _.sumBy(debitNoteArray, (s) => parseFloat(s.sub_total)),
              netTotal: _.sumBy(debitNoteArray, (s) => parseFloat(s.net_total)),
            },
            advanceTotals: {
              subTotal: _.sumBy(advanceArray, (s) => parseFloat(s.sub_total)),
              netTotal: _.sumBy(advanceArray, (s) => parseFloat(s.net_total)),
            },
            receiptTotals: {
              subTotal: _.sumBy(paymentArray, (s) => parseFloat(s.sub_total)),
              netTotal: _.sumBy(paymentArray, (s) => parseFloat(s.net_total)),
            },
            totalReceiptAmount: _.sumBy(paymentArray, (s) =>
              parseFloat(s.net_payable)
            ),
            totalDebitNoteAmount: _.sumBy(debitNoteArray, (s) =>
              parseFloat(s.net_payable)
            ),
            totalAdvanceAmount: _.sumBy(advanceArray, (s) =>
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
          };
          const tNetAmt = {
            ...finalResult,
            totalNetAmount:
              parseFloat(finalResult.totalReceiptAmount) -
              parseFloat(finalResult.totalDebitNoteAmount) -
              parseFloat(finalResult.totalAdvanceAmount),
          };
          console.log("finalResult", tNetAmt);
          resolve(tNetAmt);
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
