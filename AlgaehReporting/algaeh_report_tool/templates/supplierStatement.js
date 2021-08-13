// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    // const utilities = new algaehUtilities();
    try {
      const _ = options.loadash;
      let str = "";
      let input = {};
      let params = options.args.reportParams;
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      //   if (input.hospital_id > 0) {
      //     str += ` and S.hospital_id=${input.hospital_id}`;
      //   }

      options.mysql
        .executeQuery({
          query: `select H.finance_voucher_header_id,round(H.amount ,${decimal_places}) as invoice_amount,
          round(H.amount-coalesce(FSH.amount,settled_amount),${decimal_places})as balance_amount,
          round(coalesce(FSH.amount,settled_amount),${decimal_places}) as settled_amount,
          coalesce(FSH.invoice_ref_no,invoice_no) as invoice_no ,
          FSH.invoice_ref_no,
         H.voucher_type,H.narration,
         H.payment_date as invoice_date,
         due_date, H.updated_date as last_modified,
          case when settlement_status  ='S' then 'closed'
          when settlement_status='P' and curdate()> due_date then 'over due'
          when settlement_status='P' and settled_amount<1 then 'open'
          when settlement_status='P' and settled_amount>0 then 'paid' end as invoice_status,
          D.child_id,D.head_id, D.is_opening_bal, H.voucher_no
          from finance_voucher_header H
          inner join finance_voucher_details D on
          H.finance_voucher_header_id=D.voucher_header_id
            and H.voucher_type='purchase' and H.invoice_no is not null  and   D.child_id=?
            left join finance_voucher_sub_header FSH on H.invoice_no = FSH.invoice_ref_no 
            where date(H.payment_date) between date(?) and date(?)`,
          values: [input.child_id, input.from_date, input.to_date],
          printQuery: true,
        })
        .then((results) => {
          const rptResult = _.chain(results)
            .groupBy((g) => g.invoice_no)
            .map((item, key) => {
              //   console.log("1", item);
              const header = _.head(item);
              //   console.log("2", header.invoice_amount);
              const settled_amount = _.sumBy(item, (s) =>
                parseFloat(s.settled_amount)
              );
              //   console.log("3", settled_amount);
              const balance_amount =
                parseFloat(header.invoice_amount ?? 0) - settled_amount;
              //   console.log("4", balance_amount);
              return {
                ...header,
                settled_amount,
                balance_amount,
              };
            })
            .orderBy((o) => o.invoice_date, "desc")
            .value();

          //   console.log("rptResult", rptResult);
          resolve({
            detail: rptResult,
            total_amount: _.sumBy(rptResult, (s) =>
              parseFloat(s.balance_amount)
            ),
            currencyOnly: {
              decimal_places,
              addSymbol: false,
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
