// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    // const utilities = new algaehUtilities();
    try {
      const _ = options.loadash;
      let str = "";
      let input = {};
      let params = options.args.reportParams;
      const { decimal_places, symbol_position, currency_symbol } =
        options.args.crypto;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      //   if (input.hospital_id > 0) {
      //     str += ` and S.hospital_id=${input.hospital_id}`;
      //   }

      options.mysql
        .executeQuery({
          query: `select FC.child_name,H.finance_voucher_header_id,H.day_end_header_id,
            -- round(H.amount ,${decimal_places}) as invoice_amount,
             case when H.voucher_type = 'sales' then round(H.amount ,${decimal_places}) when H.voucher_type = 'credit_note' then round(-H.amount,${decimal_places}) end as invoice_amount,
            round(H.amount-coalesce(FSH.amount,settled_amount),${decimal_places}) as balance_amount,
            round(coalesce(FSH.amount,settled_amount),${decimal_places}) as settled_amount,
            coalesce(FSH.invoice_ref_no, invoice_no) as invoice_no ,
            case when H.voucher_type = 'sales' then 'Sales' when H.voucher_type = 'credit_note' then 'Credit Note' end as voucher_type  ,H.narration,
            H.payment_date as invoice_date,
            due_date, H.updated_date as last_modified,
            case when settlement_status  ='S' then 'closed'
            when settlement_status='P' and curdate()> due_date then 'Over Due'
            when settlement_status='P' and settled_amount <> H.amount then 'Open'
            when settlement_status='P' and settled_amount = H.amount then 'Paid' end as invoice_status,
            D.child_id,D.head_id, D.is_opening_bal, H.voucher_no
            from finance_voucher_header H
            inner join finance_voucher_details D on H.finance_voucher_header_id=D.voucher_header_id
            and H.voucher_type in ('sales','credit_note') and H.invoice_no is not null  and  D.child_id=?
            left join finance_voucher_sub_header FSH on H.invoice_no = FSH.invoice_ref_no 
            left join finance_account_child FC on FC.finance_account_child_id = D.child_id            
            where date(H.payment_date) between date(?) and date(?)`,
          values: [input.child_id, input.from_date, input.to_date],
          printQuery: true,
        })
        .then((results) => {
          if (results.length > 0) {
            const rptResult = _.chain(results)
              .groupBy((g) => g.finance_voucher_header_id)
              .map((item, key) => {
                const header = _.head(item);
                const settled_amount = _.sumBy(item, (s) =>
                  parseFloat(s.settled_amount)
                );
                const balance_amount =
                  parseFloat(header ? header.invoice_amount : "0") -
                  settled_amount;

                return {
                  ...header,
                  settled_amount,
                  balance_amount,
                  // child_name,
                };
              })
              .orderBy((o) => o.invoice_date, "asc")
              .value();
            const overDueAmt = _.sumBy(rptResult, (s) => {
              if (s.invoice_status === "Over Due") {
                return parseFloat(s.balance_amount);
              } else {
                return 0.0;
              }
            });

            const creditAmt = _.sumBy(rptResult, (t) => {
              if (t.voucher_type === "Credit Note") {
                return parseFloat(t.balance_amount);
              } else {
                return 0.0;
              }
            });
            const invAmt = _.sumBy(rptResult, (t) => {
              if (t.voucher_type === "Sales") {
                return parseFloat(t.invoice_amount);
              } else {
                return 0.0;
              }
            });
            const balAmt = _.sumBy(rptResult, (t) => {
              if (t.voucher_type === "Sales") {
                return parseFloat(t.balance_amount);
              } else {
                return 0.0;
              }
            });

            resolve({
              detail: rptResult,
              child_name: results[0].child_name,
              total_invoice_amount: parseFloat(invAmt) + parseFloat(creditAmt),
              total_settled_amount: _.sumBy(rptResult, (s) =>
                parseFloat(s.settled_amount)
              ),
              total_amount: parseFloat(balAmt) + parseFloat(creditAmt),
              total_amountOut: parseFloat(balAmt),
              overDueAmt: overDueAmt,
              creditAmt: creditAmt,
              decimalOnly: {
                decimal_places,
                addSymbol: false,
                symbol_position,
                currency_symbol,
              },
              currencyOnly: {
                decimal_places,
                addSymbol: true,
                symbol_position,
                currency_symbol,
              },
            });
          } else {
            resolve({
              decimalOnly: {
                decimal_places,
                addSymbol: false,
                symbol_position,
                currency_symbol,
              },
              currencyOnly: {
                decimal_places,
                addSymbol: true,
                symbol_position,
                currency_symbol,
              },
            });
          }
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
