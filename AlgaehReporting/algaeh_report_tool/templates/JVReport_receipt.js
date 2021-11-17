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

      if (input.receipt_type === "S") {
        str = `SELECT 
        COALESCE(IVH.invoice_number,INS.insurance_statement_number) as invoice_number,
        COALESCE(date(IVH.invoice_date),date(INS.created_date)) as invoice_date,
        IVH.sales_invoice_mode,
        IVH.sub_total,IVH.net_total,IVH.discount_amount,IVH.total_tax,IVH.net_payable,
        IVH.narration as invNarration,IVH.hospital_id
        FROM finance_voucher_header VD
        left join hims_f_sales_invoice_header IVH on IVH.invoice_number = VD.invoice_ref_no
        left join hims_f_insurance_statement INS on INS.insurance_statement_number = VD.invoice_ref_no
        where VD.finance_voucher_header_id=?;`;
      } else {
        str = `select COALESCE(IVH.invoice_number,INS.insurance_statement_number) as invoice_number,
        COALESCE(date(IVH.created_date),date(INS.created_date)) as invoice_date,
        IVH.sales_invoice_mode,
        FH.amount as sub_total, 
        FSH.amount as net_total,FSH.amount as net_payable,
        FSH.invoice_ref_no,FSH.voucher_type as voucher_type_group
        from finance_voucher_sub_header FSH
        left join finance_voucher_header FH on FH.invoice_no in ( FSH.invoice_ref_no)
        left join hims_f_sales_invoice_header IVH on IVH.invoice_number = FSH.invoice_ref_no
        left join hims_f_insurance_statement INS on INS.insurance_statement_number = FSH.invoice_ref_no
        left join finance_voucher_sub_header FSHH on FSHH.finance_voucher_header_id<? 
        where FSH.finance_voucher_header_id=? group by FSH.finance_voucher_sub_header_id;`;
      }

      options.mysql
        .executeQuery({
          query:
            `SELECT VD.voucher_type,VD.voucher_no,VD.custom_ref_no,VD.amount,VD.payment_mode,VD.payment_date,
            VD.narration,VD.due_date,VD.settled_amount,VD.created_by,
            CO.contact_number,CO.address,CO.vat_number,
            COALESCE(CO.customer_name,ISB.insurance_sub_name) as customer_name,
            COALESCE(CO.customer_code,ISB.insurance_sub_code) as customer_code,
            VDD.payment_type,VDD.head_id,VDD.child_id,FCD.head_id,FCD.finance_account_child_id,FCD.child_name,FCD.arabic_child_name
            FROM finance_voucher_header VD
            left join hims_f_sales_invoice_header IVH on IVH.invoice_number = VD.invoice_ref_no
            left join hims_d_customer CO on CO.hims_d_customer_id = IVH.customer_id
            left join hims_f_insurance_statement INS on INS.insurance_statement_number = VD.invoice_ref_no
            left join hims_d_insurance_sub ISB on ISB.hims_d_insurance_sub_id = INS.sub_insurance_id
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
          const advanceArray = result[1].filter(
            (f) => f.voucher_type_group === "advance"
          );
          const creditNoteArray = result[1].filter(
            (f) => f.voucher_type_group === "credit_note"
          );
          const receiptArray = result[1].filter(
            (f) => f.voucher_type_group === "receipt"
          );

          const finalResult = {
            resultHeader: result[0].length > 0 ? result[0][0] : {},
            creditNoteArray: creditNoteArray,
            advanceArray: advanceArray,
            receiptArray: receiptArray,
            // resultInvoice: result[1],
            totalNetPayable: _.sumBy(result[1], (s) =>
              parseFloat(s.net_payable)
            ),

            creditNoteTotals: {
              subTotal: _.sumBy(creditNoteArray, (s) =>
                parseFloat(s.sub_total)
              ),
              netTotal: _.sumBy(creditNoteArray, (s) =>
                parseFloat(s.net_total)
              ),
            },
            advanceTotals: {
              subTotal: _.sumBy(advanceArray, (s) => parseFloat(s.sub_total)),
              netTotal: _.sumBy(advanceArray, (s) => parseFloat(s.net_total)),
            },
            receiptTotals: {
              subTotal: _.sumBy(receiptArray, (s) => parseFloat(s.sub_total)),
              netTotal: _.sumBy(receiptArray, (s) => parseFloat(s.net_total)),
            },
            totalReceiptAmount: _.sumBy(receiptArray, (s) =>
              parseFloat(s.net_payable)
            ),
            totalCreditNoteAmount: _.sumBy(creditNoteArray, (s) =>
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
              parseFloat(finalResult.totalCreditNoteAmount) -
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
