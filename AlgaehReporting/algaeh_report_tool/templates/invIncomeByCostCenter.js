// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      let input = {};
      let str = "";
      const params = options.args.reportParams;
      const { decimal_places, symbol_position, currency_symbol } =
        options.args.crypto;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      if (
        input.cost_center_id !== null &&
        input.cost_center_id !== undefined &&
        input.cost_center_id !== ""
      ) {
        str += ` and IH.project_id = ${input.cost_center_id}`;
      }

      options.mysql
        .executeQuery({
          query: `select SUM(net_extended_cost) net_extended_cost, SUM(total_amount) total_amount, 
          MAX(IH.hospital_id) hospital_id, MAX(hospital_name) hospital_name, 
            MAX(IH.project_id) project_id, MAX(project_desc) project_desc, MAX(waited_avg_cost) waited_avg_cost, 
            ROUND(SUM(dispatch_quantity),0) dispatch_quantity, 
            ROUND(MAX(waited_avg_cost) * SUM(dispatch_quantity),2) cost_price,
            ROUND(SUM(net_extended_cost) - (MAX(waited_avg_cost) * SUM(dispatch_quantity)),2) gross_profit,
            MAX(item_description) item_description, MAX(category_desc) category_desc 
            from hims_f_sales_invoice_header IH 
            inner join hims_f_sales_invoice_detail ID on ID.sales_invoice_header_id =  IH.hims_f_sales_invoice_header_id             
            inner join hims_f_sales_dispatch_note_detail DD on DD.dispatch_note_header_id = ID.dispatch_note_header_id 
            inner join hims_f_sales_dispatch_note_batches DB on DB.sales_dispatch_note_detail_id =  DD.hims_f_sales_dispatch_note_detail_id 
            inner join hims_d_inventory_item_master IT on IT.hims_d_inventory_item_master_id =  DB.item_id 
            inner join hims_d_inventory_tem_category TC on TC.hims_d_inventory_tem_category_id =  DB.item_category_id 
            inner join hims_d_project P on P.hims_d_project_id =  IH.project_id 
            inner join hims_d_hospital H on H.hims_d_hospital_id =  IH.hospital_id 
            where is_cancelled='N' and  date(IH.invoice_date) between date(?) and date(?)  ${str}
            group by DB.item_id, IH.project_id;`,
          values: [input.from_date, input.to_date],
          printQuery: true,
        })
        .then((res) => {
          options.mysql.releaseConnection();

          const grpcostCenter = _.chain(res)
            .groupBy((g) => g.project_id)
            .map((cost_center) => {
              //   console.log("cost_center", cost_center);
              const { project_desc } = cost_center[0];

              const _branches = _.chain(cost_center)
                .groupBy((g) => g.hospital_id)
                .map((branch_data) => {
                  const { hospital_name } = branch_data[0];

                  return {
                    hospital_name,
                    net_extended_cost: options.currencyFormat(
                      _.sumBy(branch_data, (s) =>
                        parseFloat(s.net_extended_cost)
                      ),
                      options.args.crypto
                    ),
                    gross_profit: options.currencyFormat(
                      _.sumBy(branch_data, (s) => parseFloat(s.gross_profit)),
                      options.args.crypto
                    ),
                    cost_price: options.currencyFormat(
                      _.sumBy(branch_data, (s) => parseFloat(s.cost_price)),
                      options.args.crypto
                    ),
                    branch_data: branch_data,
                  };
                })
                .value();

              //   console.log("_branches", _branches);
              return {
                project_desc,
                cost_center: _branches,
                project_total: options.currencyFormat(
                  _.sumBy(cost_center, (s) => parseFloat(s.net_extended_cost)),
                  options.args.crypto
                ),
                projectTotal: _.sumBy(cost_center, (s) =>
                  parseFloat(s.net_extended_cost)
                ),
              };
            })
            .value();

          //   console.log("grpcostCenter", grpcostCenter[0].cost_center);
          const net_total = options.currencyFormat(
            _.sumBy(grpcostCenter, (s) => parseFloat(s.projectTotal)),
            options.args.crypto
          );

          resolve({
            result: grpcostCenter,
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
