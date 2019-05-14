const executePDF = function executePDFMethod(options) {
    const _ = options.loadash;
    return new Promise(function(resolve, reject) {
      try {
        const header = options.result[0].length > 0 ? options.result[0] : [{}];
        const detail = options.result[1];
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
          total_gross_amount: _.sumBy(detail, s => parseFloat(s.gross_amount)),
          total_discount_amount: _.sumBy(detail, s => parseFloat(s.discount_amount)),
          total_patient_share: _.sumBy(detail, s => parseFloat(s.patient_share)),
          // total_copay_amount: _.sumBy(detail, s => parseFloat(s.company_resp)),
          total_patient_tax: _.sumBy(detail, s => parseFloat(s.patient_tax)),
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
  