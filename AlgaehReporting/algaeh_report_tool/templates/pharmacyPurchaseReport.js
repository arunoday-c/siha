// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

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
          select H.*,D.*, IM.item_code, IM.item_description, IU.uom_description  from hims_f_procurement_po_header H 
          inner join hims_f_procurement_po_detail D on D.procurement_header_id= H.hims_f_procurement_po_header_id 
          inner join hims_d_item_master IM on IM.hims_d_item_master_id = D.phar_item_id 
          inner join hims_d_pharmacy_uom IU on IU.hims_d_pharmacy_uom_id = D.pharmacy_uom_id 
          where po_from = 'PHR' and date(po_date)  between date(?) and date(?) and hospital_id=? ${strQuery}; `,
          values: [input.from_date, input.to_date, input.hospital_id],
          printQuery: true
        })
        .then(result => {
          options.mysql.releaseConnection();

          if (result.length > 0) {
            const nationgWiseEmp = _.chain(result)
              .groupBy(g => g.hims_f_procurement_po_header_id)
              .map(m => {
                return {
                  purchase_number: m[0].purchase_number,
                  net_total: m[0].net_total,
                  poitems: m
                };
              })
              .value();

            resolve({
              result: nationgWiseEmp
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
