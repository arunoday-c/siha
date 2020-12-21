const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    try {
      resolve({
        header: options.result[0][0],
        insurance: options.result[1],
        medication: options.result[2],
        services: options.result[3],
        sum_service_net_amout: _.sumBy(options.result[3], (s) =>
          parseFloat(s.service_net_amout)
        ),
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
