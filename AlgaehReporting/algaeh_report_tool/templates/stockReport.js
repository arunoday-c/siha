// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      let input = {};
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;
      const params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let strQuery = "";

      // if (input.cashier_name > 0) {
      //   strQuery += ` and PV.created_by= ${input.cashier_name}`;
      // }

      console.log("params=====", params);

      if (input.location_id > 0) {
        strQuery += ` ILM.inventory_location_id= ${input.location_id}`;
      }
      if (input.hospital_id > 0) {
        strQuery += ` and ILM.hospital_id= ${input.hospital_id}`;
      }

      options.mysql
        .executeQuery({
          query: `SELECT ILM.item_id,ILM.inventory_location_id,IL.location_description,
          IM.item_code,IM.item_description,IM.item_type,IM.purchase_cost, sum(ILM.qtyhand) as qty_hand,
          coalesce(IM.waited_avg_cost,0) as weighted_cost,(sum(ILM.qtyhand)*coalesce(IM.waited_avg_cost,0)) as stock_value,
          IM.category_id,IC.category_desc,IM.group_id,IG.group_description
          FROM hims_m_inventory_item_location as ILM
          inner join hims_d_inventory_item_master IM on ILM.item_id = IM.hims_d_inventory_item_master_id
          inner join hims_d_inventory_tem_category IC on IM.category_id = IC.hims_d_inventory_tem_category_id
          inner join hims_d_inventory_item_group IG on IM.group_id = IG.hims_d_inventory_item_group_id
          inner join hims_d_inventory_location IL on ILM.inventory_location_id = IL.hims_d_inventory_location_id 
          where ${strQuery} group by ILM.item_id;`,
          // values: [],
          printQuery: true,
        })
        .then((res) => {
          options.mysql.releaseConnection();
          const result = res;
          const locationWise = _.chain(result)
            .groupBy((g) => g.inventory_location_id)
            .map((subDept) => {
              const { location_description } = subDept[0];
              const cateList = _.chain(subDept)
                .groupBy((g) => g.category_id)
                .map((docs) => {
                  const { category_desc } = docs[0];
                  return {
                    category_desc,

                    total_weighted_cost: _.sumBy(docs, (s) =>
                      parseFloat(s.weighted_cost)
                    ),

                    total_stock_value: _.sumBy(docs, (s) =>
                      parseFloat(s.stock_value)
                    ),
                    docs: docs.map((n) => {
                      return {
                        ...n,
                        weighted_cost: n.weighted_cost,
                        stock_value: n.stock_value,
                      };
                    }),
                  };
                })
                // .sortBy((s) => s.visit_date)
                .value();

              return {
                location_description,
                cateList: cateList,
                // weighted_cost_total: _.sumBy(cateList, (s) =>
                //   parseFloat(s.total_weighted_cost)
                // ),

                stock_value_total: _.sumBy(cateList, (s) =>
                  parseFloat(s.total_stock_value)
                ),

                // stock_value_total = options.currencyFormat(
                //   _.sumBy(cateList, (s) => parseFloat(s.total_stock_value)),
                //   options.args.crypto
                // );
              };
            })
            .value();

          const net_stock_value = _.sumBy(locationWise, (s) =>
            parseFloat(s.stock_value_total)
          );

          // , net_total: net_total
          // console.log("locationWise==", locationWise);
          resolve({
            result: locationWise,
            currencyOnly: {
              decimal_places,
              addSymbol: true,
              symbol_position,
              currency_symbol,
            },
            currencyOnlyWithoutSymbol: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol,
            },
            // net_qty_hand: net_qty_hand,
            // net_weighted_cost: net_weighted_cost,
            net_stock_value: net_stock_value,
          });
        })
        .catch((e) => {
          console.log("e:", e);
          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
