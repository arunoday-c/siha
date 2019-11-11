// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      // const utilities = new algaehUtilities();
      let input = {};

      const params = options.args.reportParams;

      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      // utilities.logger().log("input: ", input);

      let strQuery = "";

      options.mysql
        .executeQuery({
          query: `
          select H.*,D.*, IM.item_code, IM.item_description, IU.uom_description, PL.location_description 
          from hims_f_pharmacy_transfer_header H 
          inner join hims_f_pharmacy_transfer_detail D on H.hims_f_pharmacy_transfer_header_id = D.transfer_header_id
          inner join hims_d_item_master IM on IM.hims_d_item_master_id = D.item_id 
          inner join hims_d_pharmacy_uom IU on IU.hims_d_pharmacy_uom_id = D.uom_transferred_id 
          inner join hims_d_pharmacy_location PL on PL.hims_d_pharmacy_location_id = H.to_location_id 
          where date(transfer_date)  between date(?) and date(?) and H.hospital_id=? and from_location_id=? ${strQuery}; `,
          values: [input.from_date, input.to_date, input.hospital_id, input.location_id],
          printQuery: true
        })
        .then(result => {
          options.mysql.releaseConnection();

          if (result.length > 0) {
            const item_details = _.chain(result)
              .groupBy(g => g.hims_f_pharmacy_transfer_header_id)
              .map(m => {
                return {
                  transfer_number: m[0].transfer_number,
                  transfer_date: moment(m[0].transfer_date).format("DD/MM/YYYY"),
                  transfer_items: m
                };
              })
              .value();

            resolve({
              result: item_details
            });
          } else {
            resolve({
              result: result
            });
          }
        })
        .catch(e => {
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
