const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      // const utilities = new algaehUtilities();
      let input = {};

      // console.log("im here");

      const params = options.args.reportParams;
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;

      const decimal_places_6 = "6";

      console.log("decimal_places", decimal_places);
      console.log("decimal_places", decimal_places_6);

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      // console.log(params);
      let strQuery = "";
      if (input.location_id > 0) {
        strQuery += ` IL.inventory_location_id= ${input.location_id}`;
      }

      if (input.item_id > 0) {
        strQuery += ` and IM.hims_d_inventory_item_master_id= ${input.item_id}`;
      }

      if (input.hospital_id > 0) {
        strQuery += ` and IL.hospital_id= ${input.hospital_id}`;
      }

      options.mysql
        .executeQuery({
          query: `
          select hims_f_inventory_trans_history_id, hims_d_inventory_item_master_id, 
          max(item_code) as item_code, max(item_description) as item_description,           
          if (avgcost is null, 0, SUM(avgcost * IL.qtyhand))as avgcost,
          sum(IL.qtyhand) as quantity, max(item_code_id) as item_code_id, 
          max(transaction_qty) as transaction_qty, operation, max(waited_avg_cost) as waited_avg_cost  
          from hims_d_inventory_item_master IM
          left join hims_m_inventory_item_location IL on IM.hims_d_inventory_item_master_id = IL.item_id
          left join hims_f_inventory_trans_history TH on TH.item_code_id = IM.hims_d_inventory_item_master_id and 
          date(TH.transaction_date)>date(?) and TH.from_location_id= IL.inventory_location_id and TH.hospital_id= IL.hospital_id
          where ${strQuery} group by hims_f_inventory_trans_history_id,hims_d_inventory_item_master_id, operation;`,
          values: [input.till_date],
          printQuery: true,
        })
        .then((stock_details) => {
          options.mysql.releaseConnection();

          if (stock_details.length > 0) {
            let outputArray = [];

            outputArray = _.chain(stock_details)
              .groupBy((g) => g.hims_d_inventory_item_master_id)
              .map((details, key) => {
                const first_record = _.head(details);
                let quantity = 0;
                const minus = details.filter((f) => f.operation === "-");
                const plus = details.filter((f) => f.operation === "+");

                if (minus.length === 0 && plus.length === 0) {
                  quantity = parseFloat(first_record.quantity);
                } else {
                  if (minus.length > 0) {
                    quantity =
                      parseFloat(first_record.quantity) +
                      _.sumBy(minus, (s) => parseFloat(s.transaction_qty));
                  }
                  if (plus.length > 0) {
                    quantity =
                      parseFloat(quantity) -
                      _.sumBy(plus, (s) => parseFloat(s.transaction_qty));
                  }
                }

                const waited_avg_cost =
                  first_record.waited_avg_cost === null
                    ? 0
                    : parseFloat(
                        parseFloat(first_record.waited_avg_cost) *
                          parseFloat(quantity)
                      ).toFixed(6);

                return { ...first_record, quantity, waited_avg_cost };
              })
              .value();
            const total_stock = _.sumBy(outputArray, (s) =>
              parseFloat(s.avgcost)
            );
            const total_waited_stock = _.sumBy(outputArray, (s) =>
              parseFloat(s.waited_avg_cost)
            );
            resolve({
              result: outputArray,
              total_stock: total_stock,
              total_waited_stock: total_waited_stock,
              currencyOnly: {
                decimal_places,
                addSymbol: true,
                symbol_position,
                currency_symbol,
              },
              currencyOnlyWithoutSymbol: {
                decimal_places_6,
                addSymbol: false,
                symbol_position,
                currency_symbol,
              },
            });
          } else {
            resolve({
              result: stock_details,
            });
          }
        })
        .catch((e) => {
          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
