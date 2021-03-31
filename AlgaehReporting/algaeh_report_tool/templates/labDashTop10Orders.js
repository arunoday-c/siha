// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      // const moment = options.moment;
      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      // let _stringDataSendIn = "";
      let _stringDataTop10 = "";

      if (input.objDataTop10OrdersFrom != null) {
        _stringDataTop10 +=
          "  date(ordered_date) between date('" +
          input.objDataTop10OrdersFrom +
          "') AND date('" +
          input.objDataTop10OrdersTo +
          "')";
      }

      options.mysql
        .executeQuery({
          query: `  SELECT LO.service_id,S.service_name, count(LO.service_id) as service_count FROM hims_f_lab_order as LO
            inner join hims_d_services S on S.hims_d_services_id=LO.service_id
        where ${_stringDataTop10} group by LO.service_id order by service_count DESC limit 0,10;
            
               `,
          values: [],
          printQuery: true,
        })
        .then((result) => {
          resolve({ result });
        })
        .catch((error) => {
          options.mysql.releaseConnection();
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = { executePDF };
