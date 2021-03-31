// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;
      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let _stringDataTestCategory = "";

      if (input.startOfWeekOrderByTestCategory != null) {
        _stringDataTestCategory +=
          "  date(ordered_date) between date('" +
          input.startOfWeekOrderByTestCategory +
          "') AND date('" +
          input.endOfWeekOrderByTestCategory +
          "')";
      }

      options.mysql
        .executeQuery({
          query: `SELECT L.category_id,T.category_name,L.description FROM hims_f_lab_order as LO
            inner join hims_d_investigation_test L on L.hims_d_investigation_test_id=LO.test_id
            inner join hims_d_test_category T on T.hims_d_test_category_id=L.category_id
            where ${_stringDataTestCategory};
               `,
          values: [],
          printQuery: true,
        })
        .then((result) => {
          const getOrderByTestCategory = _.chain(result)
            .groupBy((g) => g.category_id)
            .map((details, key) => {
              const { category_name } = _.head(details);

              return {
                category_name: category_name,
                detailsOf: details,
                // length: details.length,
              };
            })
            .value();
          resolve({ result: getOrderByTestCategory });
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
