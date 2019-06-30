const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    const utilities = new algaehUtilities();
    try {
      const _ = options.loadash;
      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      utilities.logger().log("input: ", input);

      if (input.location_id > 0) {
        str += ` and IL.pharmacy_location_id= ${input.location_id}`;
      }

      if (input.group_id > 0) {
        str += ` and  IM.group_id= ${input.group_id}`;
      }

      if (input.category_id > 0) {
        str += ` and  IM.category_id= ${input.category_id}`;
      }
      if (input.item_id > 0) {
        str += ` and  IL.item_id= ${input.item_id}`;
      }

      if (input.expiry_status == "E") {
        str += ` and   date(expirydt)<= curdate()`;
      } else if (input.expiry_status == "EW") {
        str += ` and  date(expirydt) between date('${
          input.from_date
        }') and date('${input.to_date}')`;
      } else if (input.expiry_status == "EO") {
        str += ` and date(expirydt)=date('${input.from_date}')`;
      }

      options.mysql
        .executeQuery({
          query: `select hims_m_item_location_id,IL.item_id,IL.expirydt,IL.pharmacy_location_id,IL.qtyhand,
				PL.location_description as pharmacy_location,IM.item_description,IM.item_code,IL.batchno
				from hims_m_item_location IL inner join  hims_d_item_master IM on IL.item_id=IM.hims_d_item_master_id
				inner join hims_d_pharmacy_location PL on IL.pharmacy_location_id=PL.hims_d_pharmacy_location_id
				where IL.record_status='A' and PL.hospital_id=? ${str};`,
          values: [input.hospital_id],
          printQuery: true
        })
        .then(results => {
          options.mysql.releaseConnection();
          // utilities.logger().log("result: ", results);
          resolve({ details: results });
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
