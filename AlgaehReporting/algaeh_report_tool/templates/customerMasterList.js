// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    try {
      let input = {};
      let params = options.args.reportParams;
      // const utilities = new algaehUtilities();
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      const decimal_places = options.args.crypto.decimal_places;

      let strData = "";

      if (input.hospital_id > 0) {
        strData += ` and E.hospital_id= ${input.hospital_id}`;
      }

      options.mysql
        .executeQuery({
          query: `select hims_d_customer_id, customer_code, customer_name, arabic_customer_name, 
          customer_status, business_registration_no, email_id_1,email_id_2, website, contact_number, 
          case when payment_terms is NULL then '-' else payment_terms end as payment_terms, 
          payment_mode, bank_name,purchase_inch_name, purchase_inch_number,purchase_inch_emailid, 
          project_inch_name,project_inch_number, project_inch_emailid, finance_inch_name, 
          finance_inch_number, finance_inch_emailid,postal_code,address, country_id, state_id, 
          city_id, vat_number, bank_account_no,iban_number 
          from hims_d_customer 
          where record_status='A' order by hims_d_customer_id desc ${strData} ;`,
          // values: [input.hospital_id],
          printQuery: true,
        })
        .then((ress) => {
          if (ress.length > 0) {
            const result = {
              detailsList: ress,
            };
            resolve(result);
          } else {
            resolve({
              result: {
                detailsList: ress,
              },
            });
          }
        })
        .catch((error) => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
