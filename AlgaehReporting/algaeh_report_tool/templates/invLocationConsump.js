// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      let input = {};

      const params = options.args.reportParams;
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      options.mysql
        .executeQuery({
          query: `select  CD.item_id, ROUND(SUM(quantity),0) quantity, SUM(extended_cost) extended_cost, 
          MAX(CH.location_id) location_id, MAX(location_description) location_description,
          MAX(item_description) item_description, MAX(category_desc) category_desc 
          from hims_f_inventory_consumption_header CH 
          inner join hims_f_inventory_consumption_detail CD on CD.inventory_consumption_header_id = CH.hims_f_inventory_consumption_header_id
          inner join hims_d_inventory_location L on L.hims_d_inventory_location_id = CH.location_id
          inner join hims_d_inventory_item_master IT on IT.hims_d_inventory_item_master_id =CD.item_id 
          inner join hims_d_inventory_tem_category TC on TC.hims_d_inventory_tem_category_id =  CD.item_category_id 
          where date(consumption_date) between(?) and (?) group by CD.item_id;`,
          values: [input.from_date, input.to_date],
          printQuery: true,
        })
        .then((res) => {
          options.mysql.releaseConnection();

          const grpLocationWise = _.chain(res)
            .groupBy((g) => g.location_id)
            .map((location_wise) => {
              const { location_description } = location_wise[0];

              return {
                location_description,
                location_wise: location_wise,
                location_total: options.currencyFormat(
                  _.sumBy(location_wise, (s) => parseFloat(s.extended_cost)),
                  options.args.crypto
                ),
                locationTotal: _.sumBy(location_wise, (s) =>
                  parseFloat(s.extended_cost)
                ),
              };
            })
            .value();

          const net_total = options.currencyFormat(
            _.sumBy(grpLocationWise, (s) => parseFloat(s.locationTotal)),
            options.args.crypto
          );

          resolve({
            result: grpLocationWise,
            net_total: net_total,
            currency: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol,
            },
          });
        })
        .catch((e) => {
          // console.log("e:", e);

          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
