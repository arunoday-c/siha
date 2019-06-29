const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    try {
      const header = options.result[0].length > 0 ? options.result[0] : [{}];
      const detail = options.result[1];
      let otherObj = {};
      const result = {
        header: { ...header[0], ...options.mainData[0] },
        detail: detail,
        total_quantity: _.sumBy(detail, s => parseFloat(s.quantity)),
        total_price: _.sumBy(detail, s => parseFloat(s.price)),
        total_gross_amount: _.sumBy(detail, s => parseFloat(s.gross_amount)),
        total_discount_amount: _.sumBy(detail, s =>
          parseFloat(s.discount_amount)
        ),
        total_patient_share: _.sumBy(detail, s => parseFloat(s.patient_share)),

        total_net_amount: _.sumBy(detail, s => parseFloat(s.net_amount)),
        total_company_resp: _.sumBy(detail, s => parseFloat(s.company_resp)),
        total_company_tax: _.sumBy(detail, s => parseFloat(s.company_tax)),
        total_net_claim: _.sumBy(detail, s => parseFloat(s.net_claim))
      };

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
