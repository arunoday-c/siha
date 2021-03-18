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
          query: `SELECT USR.user_display_name,CSH.daily_handover_date,CSD.cash_handover_header_id,
          coalesce(CSD.expected_cash,0) as expected_cash,
          coalesce(CSD.expected_card,0) as expected_card,
          coalesce(CSD.expected_cheque,0) as expected_cheque,
          (coalesce(CSD.expected_cash,0) + coalesce(CSD.expected_card,0) + coalesce(CSD.expected_cheque,0)) as total_expected,
          (coalesce(CSD.actual_cash,0) + coalesce(CSD.actual_card,0) + coalesce(CSD.actual_cheque,0)) as total_collected,
          (coalesce(CSD.expected_cash,0) + coalesce(CSD.expected_card,0) + coalesce(CSD.expected_cheque,0)) - (coalesce(CSD.actual_cash,0) + coalesce(CSD.actual_card,0) + coalesce(CSD.actual_cheque,0)) as total_diff,
          case 
          when (coalesce(CSD.expected_cash,0) + coalesce(CSD.expected_card,0) + coalesce(CSD.expected_cheque,0)) = (coalesce(CSD.actual_cash,0) + coalesce(CSD.actual_card,0) + coalesce(CSD.actual_cheque,0)) then 'Tallied'
          when (coalesce(CSD.expected_cash,0) + coalesce(CSD.expected_card,0) + coalesce(CSD.expected_cheque,0)) > (coalesce(CSD.actual_cash,0) + coalesce(CSD.actual_card,0) + coalesce(CSD.actual_cheque,0)) then 'Shortage' 
          when (coalesce(CSD.expected_cash,0) + coalesce(CSD.expected_card,0) + coalesce(CSD.expected_cheque,0)) < (coalesce(CSD.actual_cash,0) + coalesce(CSD.actual_card,0) + coalesce(CSD.actual_cheque,0)) then 'Shortage' 
          end as status
          FROM hims_f_cash_handover_detail as CSD
          inner join hims_f_cash_handover_header CSH on CSH.hims_f_cash_handover_header_id=CSD.cash_handover_header_id
          left join algaeh_d_app_user USR on USR.algaeh_d_app_user_id=CSD.casher_id
          where CSD.hospital_id=? and CSH.record_status = 'A' and CSD.record_status = 'A' and date(CSH.daily_handover_date) between date(?) and date(?);`,
          values: [input.hospital_id, input.from_date, input.to_date],
          printQuery: true,
        })
        .then((results) => {
          const result = _.chain(results)
            .groupBy((g) => g.cash_handover_header_id)
            .map(function (dtl) {
              const { daily_handover_date } = dtl[0];
              return {
                daily_handover_date,
                user_count: dtl.length,
                detailList: dtl,
                total_expected_cash: _.sumBy(dtl, (s) =>
                  parseFloat(s.expected_cash)
                ),
                total_expected_card: _.sumBy(dtl, (s) =>
                  parseFloat(s.expected_card)
                ),
                total_expected_cheque: _.sumBy(dtl, (s) =>
                  parseFloat(s.expected_cheque)
                ),
                net_total_expected: _.sumBy(dtl, (s) =>
                  parseFloat(s.total_expected)
                ),
                net_total_collected: _.sumBy(dtl, (s) =>
                  parseFloat(s.total_collected)
                ),
                net_total_diff: _.sumBy(dtl, (s) => parseFloat(s.total_diff)),
              };
            })
            .value();
          resolve({
            detail: result,
            ftr_total_expected_cash: _.sumBy(result, (s) =>
              parseFloat(s.total_expected_cash)
            ),
            ftr_total_expected_card: _.sumBy(result, (s) =>
              parseFloat(s.total_expected_card)
            ),
            ftr_total_expected_cheque: _.sumBy(result, (s) =>
              parseFloat(s.total_expected_cheque)
            ),
            ftr_net_total_expected: _.sumBy(result, (s) =>
              parseFloat(s.net_total_diff)
            ),
            ftr_net_total_collected: _.sumBy(result, (s) =>
              parseFloat(s.net_total_expected)
            ),
            ftr_net_total_diff: _.sumBy(result, (s) =>
              parseFloat(s.net_total_diff)
            ),
            decimalOnly: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol,
            },
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
