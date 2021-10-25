// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      const { decimal_places, symbol_position, currency_symbol } =
        options.args.crypto;

      let input = {};

      const params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let strQuery = "";

      if (input.card_name > 0) {
        strQuery += `and  B.hims_d_bank_card_id=${input.card_name}`;
      }

      options.mysql
        .executeQuery({
          query: `select hims_f_billing_header_id,
          RH.hims_f_receipt_header_id, RH.receipt_number, BH.bill_number,B.card_name,
          date(RH.receipt_date)as receipt_date ,RD.hims_f_receipt_details_id,RD.pay_type,RD.amount,RD.bank_card_id
          from  hims_f_billing_header BH
          inner join hims_f_receipt_header RH on BH.receipt_header_id=RH.hims_f_receipt_header_id
          inner join hims_f_receipt_details RD  on RH.hims_f_receipt_header_id=RD.hims_f_receipt_header_id
          inner join hims_d_bank_card B on B.hims_d_bank_card_id = RD.bank_card_id
          where date(BH.bill_date)  between date(?) and date(?) and RD.pay_type='CD' and RD.amount <> 0 and
          BH.adjusted='N' and RH.record_status='A' and RD.record_status='A' and cancelled='N' and adjusted='N' and BH.hospital_id= ? ${strQuery};`,
          values: [input.from_date, input.to_date, input.hospital_id],
          printQuery: true,
        })
        .then((ress) => {
          const CardWise = _.chain(ress)
            .groupBy((g) => g.bank_card_id)
            .map((billNo) => {
              const { card_name } = billNo[0];
              const receiptList = _.chain(billNo)
                .groupBy((g) => g.hims_f_receipt_header_id)
                .map((docs) => {
                  // const { full_name, patient_code } = docs[0];
                  return {
                    docs: docs.map((n) => {
                      return {
                        ...n,
                      };
                    }),
                  };
                })
                // .sortBy((s) => s.bill_date)
                .value();

              return {
                card_name,
                receiptList: receiptList,
              };
            })
            .value();

          resolve({
            result: CardWise,
            // decimalOnly: {
            //   decimal_places,
            //   addSymbol: false,
            //   symbol_position,
            //   currency_symbol,
            // },
            // currencyOnly: {
            //   decimal_places,
            //   addSymbol: true,
            //   symbol_position,
            //   currency_symbol,
            // },
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
