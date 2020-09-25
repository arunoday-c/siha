const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  const mysql = options.mysql;
  const parameters = options.args;
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      let input = {};
      let params = options.args.reportParams;
      // const utilities = new algaehUtilities();
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      // let strData = "";

      // if (input.hospital_id > 0) {
      //   strData += ` and P.hims_f_pharmcy_sales_return_header_id= ${input.hims_f_pharmcy_sales_return_header_id}`;
      // }
      console.log("params=", params);

      options.mysql
        .executeQuery({
          query: `select H.hims_f_pharmcy_sales_return_header_id,P.patient_code, H.sales_return_number, \ 
          P.full_name as patient_full_name, date_format(V.visit_date,'%d-%m-%Y') as visit_date, \
          P.arabic_name as patient_arabaic_full_name,H.sales_return_date as invoice_date,H.policy_number, \
          date_format(P.registration_date,'%d-%m-%Y') as registration_date,E.full_name,E.arabic_name, \
          trim(sub_department_name)as sub_department_name,H.card_number,V.age_in_years,P.gender,N.nationality, \
          arabic_sub_department_name,IP.insurance_provider_name,IP.arabic_provider_name,E.license_number, \
          H.patient_tax, H.company_tax, coalesce(H.patient_tax,0) + coalesce(H.company_tax,0) as net_tax, \
          H.patient_payable, coalesce(H.patient_payable,0)+0 as due_amout,H.net_total \
  from hims_f_patient P \
  inner join  hims_f_pharmcy_sales_return_header H on P.hims_d_patient_id = H.patient_id \
  inner join hims_f_patient_visit V on V.hims_f_patient_visit_id = H.visit_id \
  inner join hims_d_employee E on E.hims_d_employee_id = V.doctor_id \
  inner join hims_d_sub_department SD on SD.hims_d_sub_department_id = V.sub_department_id \
  left join hims_d_insurance_provider IP on IP.hims_d_insurance_provider_id = H.insurance_provider_id \
  left join hims_d_nationality as N on N.hims_d_nationality_id = P.nationality_id \
  where H.hims_f_pharmcy_sales_return_header_id=?;\
  select item.sfda_code as registration_number, item.item_description, D.quantity, D.unit_cost as price, 	\
  D.extended_cost as gross_amount, coalesce(D.patient_responsibility,0) as patient_share, \
  coalesce(D.discount_amount,0) as discount_amount, coalesce(D.net_extended_cost,0) as net_amount, \
  coalesce(D.company_responsibility,0) as company_resp, coalesce(D.company_tax,0) as company_tax, \
  coalesce(D.company_payable, 0) as net_claim, coalesce(D.patient_tax,0) as patient_tax, \
  coalesce(D.patient_payable,0) as patient_payable \
  from hims_f_pharmacy_sales_return_detail D \
  inner join  hims_f_pharmcy_sales_return_header H on D.sales_return_header_id = H.hims_f_pharmcy_sales_return_header_id \
  inner join hims_d_services S on 	 S.hims_d_services_id = D.service_id \
  inner join hims_d_item_master item on 	D.item_id = item.hims_d_item_master_id \
  where H.hims_f_pharmcy_sales_return_header_id=?;`,
          values: [
            input.hims_f_pharmcy_sales_return_header_id,
            input.hims_f_pharmcy_sales_return_header_id,
          ],
          printQuery: true,
        })
        .then((output) => {
          const header = output[0].length > 0 ? output[0] : [{}];
          const detail = output[1];
          let otherObj = {};
          const result = {
            header: { ...header[0], ...options.mainData[0] },
            detail: detail,
            total_quantity: _.sumBy(detail, (s) => parseFloat(s.quantity)),
            total_price: _.sumBy(detail, (s) => parseFloat(s.price)),
            total_gross_amount: _.sumBy(detail, (s) =>
              parseFloat(s.gross_amount)
            ),
            total_discount_amount: _.sumBy(detail, (s) =>
              parseFloat(s.discount_amount)
            ),
            total_patient_share: _.sumBy(detail, (s) =>
              parseFloat(s.patient_share)
            ),

            total_net_amount: _.sumBy(detail, (s) => parseFloat(s.net_amount)),
            total_patient_tax: _.sumBy(detail, (s) =>
              parseFloat(s.patient_tax)
            ),
            total_patient_payable: _.sumBy(detail, (s) =>
              parseFloat(s.patient_payable)
            ),
          };
          mysql.releaseConnection();
          resolve(result);
        })
        .catch((error) => {
          mysql.releaseConnection();
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
