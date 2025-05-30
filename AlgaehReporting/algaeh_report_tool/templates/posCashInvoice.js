const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  const mysql = options.mysql;
  const parameters = options.args;
  return new Promise(function (resolve, reject) {
    try {
      let inputs = {};
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
        vat_applicable,
        vat_percent,
      } = options.args.crypto;
      const internalParameters = parameters.reportParams;
      const headerID = _.find(
        internalParameters,
        (f) => f.name == "hims_f_pharmacy_pos_header_id"
      );
      inputs["hims_f_pharmacy_pos_header_id"] = headerID["value"];
      const caseType = _.find(
        internalParameters,
        (f) => f.name == "pos_customer_type"
      )["value"];
      let query =
        "select H.hims_f_pharmacy_pos_header_id,P.patient_code, H.pos_number, P.full_name as patient_full_name,  date_format(V.visit_date,'%d-%m-%Y') as visit_date, 	  \
 P.arabic_name as patient_arabaic_full_name,    H.pos_date as invoice_date,	  \
 H.policy_number,  date_format(P.registration_date,'%d-%m-%Y') as registration_date, 	E.full_name, 	   \
 E.arabic_name, 	trim(sub_department_name)as sub_department_name, 	H.card_number, 	V.age_in_years, 	P.gender, 	  \
 N.nationality, 	arabic_sub_department_name, 	IP.insurance_provider_name, 	IP.arabic_provider_name, 	   \
 E.license_number,H.patient_tax, H.company_tax, coalesce(H.patient_tax,0) + coalesce(H.company_tax,0) as net_tax, \
 H.patient_payable, coalesce(H.patient_payable,0)+0 as due_amout,H.net_total,ICD.icd_code,ICD.long_icd_description, USR.user_display_name as cashier_name from 	hims_f_patient P inner join  hims_f_pharmacy_pos_header H on 	P.hims_d_patient_id = H.patient_id   \
 inner join hims_f_patient_visit V on 	V.hims_f_patient_visit_id = H.visit_id inner join hims_d_employee E on   \
 E.hims_d_employee_id = V.doctor_id inner join hims_d_sub_department SD on 	 SD.hims_d_sub_department_id = V.sub_department_id \
 left join hims_d_insurance_provider IP on 	 IP.hims_d_insurance_provider_id = H.insurance_provider_id   left join  \
 hims_d_nationality as N on 	 N.hims_d_nationality_id = P.nationality_id  left join hims_f_patient_diagnosis as DIA on DIA.episode_id = V.episode_id and diagnosis_type='P'  left join hims_d_icd ICD on ICD.hims_d_icd_id = DIA.daignosis_id  left join algaeh_d_app_user USR on USR.algaeh_d_app_user_id = H.created_by  where H.hims_f_pharmacy_pos_header_id=?;\
 select 	item.sfda_code as registration_number, item.item_description, D.quantity, D.unit_cost as price, 	D.extended_cost as gross_amount, \
 coalesce(D.patient_responsibility,0) as patient_share,\
 coalesce(D.discount_amount, 	0)as discount_amount, 	coalesce(D.net_extended_cost, 	0)as net_amount, 	\
 coalesce(D.company_responsibility,0) as company_resp, 	coalesce(D.company_tax,0) as company_tax, 	 \
 coalesce(D.company_payable, 0) as net_claim, 	 coalesce(D.patient_tax,0) as patient_tax,  \
 coalesce(D.patient_payable,0) as patient_payable from 	hims_f_pharmacy_pos_detail D \
 inner join  hims_f_pharmacy_pos_header H on 	 D.pharmacy_pos_header_id = H.hims_f_pharmacy_pos_header_id \
 inner join hims_d_services S on 	 S.hims_d_services_id = D.service_id  \
 inner join hims_d_item_master item on 	D.item_id = item.hims_d_item_master_id \
where  H.hims_f_pharmacy_pos_header_id=?;";

      if (caseType == "OT") {
        query =
          "select '--' as patient_code,patient_name as patient_full_name,pos_number, \
          date_format(pos_date,'%d-%m-%Y') as visit_date, '' as patient_arabaic_full_name,\
pos_date as invoice_date   ,'--'as policy_number, \
'--'as registration_date,referal_doctor as full_name,'--' as arabic_name, \
'--'as sub_department_name, card_number,'--' as age_in_years,'--' as gender, \
N.nationality, '--' as arabic_sub_department_name,'--' as insurance_provider_name,'--' as arabic_provider_name, '--' as license_number,\
coalesce(patient_tax,0) as patient_tax, coalesce(company_tax,0) as company_tax, (coalesce(patient_tax,0) + coalesce(company_tax,0)) as net_tax,net_total, \
 patient_payable, coalesce(patient_payable,0)+0 as due_amout, USR.user_display_name as cashier_name from  hims_f_pharmacy_pos_header H left join hims_d_nationality N on H.nationality_id=N.hims_d_nationality_id left join algaeh_d_app_user USR on USR.algaeh_d_app_user_id = H.created_by  \
  where  hims_f_pharmacy_pos_header_id=?; \
select 	item.sfda_code as registration_number, item.item_description, D.quantity, D.unit_cost as price, 	D.extended_cost as gross_amount, \
coalesce(D.patient_responsibility,0) as patient_share,\
coalesce(D.discount_amount, 	0)as discount_amount, 	coalesce(D.net_extended_cost, 	0)as net_amount, 	\
coalesce(D.company_responsibility,0) as company_resp, 	coalesce(D.company_tax,0) as company_tax, 	 \
coalesce(D.company_payable, 0) as net_claim, 	 coalesce(D.patient_tax,0) as patient_tax,  \
coalesce(D.patient_payable,0) as patient_payable from 	hims_f_pharmacy_pos_detail D \
inner join  hims_f_pharmacy_pos_header H on 	 D.pharmacy_pos_header_id = H.hims_f_pharmacy_pos_header_id \
inner join hims_d_services S on 	 S.hims_d_services_id = D.service_id  \
inner join hims_d_item_master item on 	D.item_id = item.hims_d_item_master_id   where 	\
H.hims_f_pharmacy_pos_header_id=?;";
      }

      mysql
        .executeQuery({
          query: query,
          values: [
            inputs["hims_f_pharmacy_pos_header_id"],
            inputs["hims_f_pharmacy_pos_header_id"],
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

            currency: {
              decimal_places,
              addSymbol: true,
              symbol_position,
              currency_symbol,
            },
            currencyheader: {
              decimal_places,
              addSymbol: true,
              symbol_position,
              currency_symbol,
            },
            vat_applicable: vat_applicable,
            default_vat_percent: parseFloat(vat_percent),
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
