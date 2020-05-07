// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    try {
      let input = {};
      let params = options.args.reportParams;

      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      let strQuery = "";
      if (input.HRMNGMT_Active) {
        strQuery =
          "SELECT SQ.*, C.customer_name, E.full_name as employee_name, E.primary_contact_no, E.work_email\
          from hims_f_sales_quotation SQ \
          inner join  hims_d_customer C on  SQ.customer_id = C.hims_d_customer_id \
          inner join  hims_d_employee E on  SQ.sales_person_id = E.hims_d_employee_id \
          where SQ.hims_f_sales_quotation_id =? ";
      } else {
        strQuery =
          "SELECT SQ.*, C.customer_name, SQ.sales_man as employee_name from hims_f_sales_quotation SQ \
          inner join  hims_d_customer C on  SQ.customer_id = C.hims_d_customer_id \
          where SQ.hims_f_sales_quotation_id =? ";
      }

      options.mysql
        .executeQuery({
          query: strQuery,
          values: [input.hims_f_sales_quotation_id],
          printQuery: true
        })
        .then(headerResult => {
          // console.log("headerResult.comment_list", headerResult.terms_conditions)

          // const str = "1*2"
          // var string = str.split("*");

          // console.log(string);

          headerResult[0].comment_list =
            headerResult[0].terms_conditions !== null
              ? headerResult[0].terms_conditions.split("<br/>")
              : [];


          // // headerResult.comment_list
          console.log("headerResult.comment_list", headerResult[0].comment_list)
          options.mysql
            .executeQuery({
              query:
                "select QI.*, IM.item_description, IU.uom_description from hims_f_sales_quotation_items QI \
              inner join hims_d_inventory_item_master IM on IM.hims_d_inventory_item_master_id = QI.item_id \
              inner join hims_d_inventory_uom IU on IU.hims_d_inventory_uom_id = QI.uom_id where sales_quotation_id=?;\
              select QS.*, S.service_name, CASE WHEN QS.service_frequency='M' THEN 'Monthly' \
              WHEN QS.service_frequency='W' THEN 'Weekly' WHEN QS.service_frequency='D' THEN 'Daily' \
              WHEN QS.service_frequency='H' THEN 'Hourly' WHEN QS.service_frequency='PT' THEN 'Per Trip' \
              WHEN QS.service_frequency='PP' THEN 'Per Person' END as service_frequency from hims_f_sales_quotation_services QS \
              inner join hims_d_services S on S.hims_d_services_id = QS.services_id where sales_quotation_id=?;",
              values: [
                headerResult[0].hims_f_sales_quotation_id,
                headerResult[0].hims_f_sales_quotation_id
              ],
              printQuery: true
            })
            .then(qutation_detail => {
              let sales_quotation_items = qutation_detail[0];
              let sales_quotation_services = qutation_detail[1];

              const result = {
                ...headerResult[0],
                ...{ sales_quotation_items },
                ...{ sales_quotation_services }
              };

              resolve(result);
            })
            .catch(error => {
              options.mysql.releaseConnection();
            });
        })
        .catch(error => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
