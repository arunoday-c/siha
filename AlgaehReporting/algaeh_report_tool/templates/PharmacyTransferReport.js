// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      // const utilities = new algaehUtilities();
      let input = {};

      const params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      // utilities.logger().log("input: ", input);

      let strQuery = "";

      if (input.location_id > 0) {
        strQuery += ` and from_location_id= ${input.location_id}`;
      }

      options.mysql
        .executeQuery({
          query: `
          select H.*,B.*, ROUND(B.unit_cost, 3) as unit_cost, ROUND(B.quantity_transfer * B.unit_cost, 3) as net_extended_cost,
          IM.item_code, IM.item_description, IU.uom_description,IC.category_desc,
          PLF.location_description as from_location,PLT.location_description as to_location
          from hims_f_pharmacy_transfer_header H 
          inner join hims_f_pharmacy_transfer_detail D on D.transfer_header_id = H.hims_f_pharmacy_transfer_header_id
          inner join hims_f_pharmacy_transfer_batches B on B.transfer_detail_id = D.hims_f_pharmacy_transfer_detail_id
          inner join hims_d_item_master IM on IM.hims_d_item_master_id = D.item_id 
          left join hims_d_item_category IC on IM.category_id= IC.hims_d_item_category_id	
          inner join hims_d_pharmacy_uom IU on IU.hims_d_pharmacy_uom_id = D.uom_transferred_id 
          inner join hims_d_pharmacy_location PLF on PLF.hims_d_pharmacy_location_id = H.from_location_id
          inner join hims_d_pharmacy_location PLT on PLT.hims_d_pharmacy_location_id = H.to_location_id 
          where date(transfer_date)  between date(?) and date(?) and H.hospital_id=? ${strQuery}; `,
          values: [input.from_date, input.to_date, input.hospital_id],
          printQuery: true,
        })
        .then((result) => {
          options.mysql.releaseConnection();

          if (result.length > 0) {
            const item_details = _.chain(result)
              .groupBy((g) => g.hims_f_pharmacy_transfer_header_id)
              .map((m) => {
                return {
                  transfer_number: m[0].transfer_number,
                  from_location: m[0].from_location,
                  to_location: m[0].to_location,
                  transfer_date: moment(m[0].transfer_date).format(
                    "DD/MM/YYYY"
                  ),
                  sum_total_net_extended_cost: options.currencyFormat(
                    _.sumBy(m, (s) => parseFloat(s.net_extended_cost)),
                    options.args.crypto
                  ),
                  transfer_items: m,
                };
              })
              .value();

            resolve({
              result: item_details,
            });
          } else {
            resolve({
              result: result,
            });
          }
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
