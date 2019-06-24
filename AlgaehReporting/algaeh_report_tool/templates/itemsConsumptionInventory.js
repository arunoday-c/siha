//const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      const _ = options.loadash;
      //  const utilities = new algaehUtilities();
      let str = "";

      let input = {};
      let params = options.args.reportParams;

      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      // utilities.logger().log("input: ", input);

      if (input.provider_id > 0) {
        str += ` and  H.provider_id=${input.provider_id}`;
      }

      if (input.item_id > 0) {
        str += ` and D.item_id=${input.item_id}`;
      }
      options.mysql
        .executeQuery({
          query: `select hims_f_inventory_consumption_header_id,consumption_number,
          date(consumption_date)as consumption_date,H.provider_id,E.full_name,E.employee_code,
          D.quantity,D.unit_cost,D.extended_cost,IM.item_code,IM.item_description
          from hims_f_inventory_consumption_header H inner join hims_f_inventory_consumption_detail D on
          H.hims_f_inventory_consumption_header_id=D.inventory_consumption_header_id
          inner join  hims_d_employee E on E.hims_d_employee_id=H.provider_id
          inner join hims_d_item_master IM on  D.item_id=IM.hims_d_item_master_id
          inner join hims_d_sub_department SD on H.location_id=SD.inventory_location_id
          where  SD.hims_d_sub_department_id=? and H.hospital_id=?  and  date(H.consumption_date) between 
          date(?) and date(?)	${str};`,
          values: [
            input.sub_department_id,
            input.hospital_id,
            input.from_date,
            input.to_date
          ],
          printQuery: true
        })
        .then(results => {
          // utilities.logger().log("results: ", results);
          const result = _.chain(results)
            .groupBy(g => g.provider_id)
            .map(function(item) {
              const total_cost = _.chain(item)
                .sumBy(s => parseFloat(s.extended_cost))
                .value()
                .toFixed(2);
              return {
                doctor: item[0]["full_name"],
                detailList: item,
                total_cost: total_cost
              };
            })
            .value();
          const grandTotal = _.chain(result)
            .sumBy(s => parseFloat(s.total_cost))
            .value()
            .toFixed(2);

          resolve({ detail: result, grandTotal: grandTotal });
          // utilities
          //   .logger()
          //   .log("results: ", { detail: result, grandTotal: grandTotal });
        })
        .catch(error => {
          options.mysql.releaseConnection();
          console.log("error", error);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
