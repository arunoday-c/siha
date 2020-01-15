const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    try {
      const header = options.result[0].length > 0 ? options.result[0] : [{}];
      const detail = options.result[1];
      const userObject = options.args.crypto;
      let otherObj = {};
      const result = {
        header: { ...header[0], ...options.mainData[0] },
        detail: _.chain(detail)
          .groupBy(g => g.service_type)
          .map(function(dtl, key) {
            const find = _.find(dtl, f => f.service_type === key);
            return {
              service_type: key,
              arabic_service_type: find["arabic_service_type"],
              detailList: dtl
            };
          })
          .value(),
        total_gross_amount: options.currencyFormat(
          _.sumBy(detail, s => parseFloat(s.gross_amount)),
          userObject,
          false
        ),
        total_discount_amount: options.currencyFormat(
          _.sumBy(detail, s => parseFloat(s.discount_amount)),
          userObject,
          false
        ),
        total_patient_share: options.currencyFormat(
          _.sumBy(detail, s => parseFloat(s.patient_share)),
          userObject,
          false
        ),
        // total_copay_amount: _.sumBy(detail, s => parseFloat(s.company_resp)),
        total_patient_tax: options.currencyFormat(
          _.sumBy(detail, s => parseFloat(s.patient_tax)),
          userObject,
          false
        ),
        total_company_resp: options.currencyFormat(
          _.sumBy(detail, s => parseFloat(s.company_resp)),
          userObject,
          false
        ),
        vat_amount_total: options.currencyFormat(
          _.sumBy(
            detail,
            s => parseFloat(s.patient_tax) + parseFloat(s.company_tax)
          ),
          userObject,
          false
        ),
        total_net_amount: options.currencyFormat(
          _.sumBy(detail, s => parseFloat(s.net_amount)),
          userObject,
          false
        ),
        total_company_tax: options.currencyFormat(
          _.sumBy(detail, s => parseFloat(s.company_tax)),
          userObject,
          false
        ),
        total_net_claim: options.currencyFormat(
          _.sumBy(detail, s => parseFloat(s.net_claim)),
          userObject,
          false
        )
      };
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
