const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  const encodeHexaDecimal = options.encodeHexaDecimal;

  return new Promise(function (resolve, reject) {
    try {
      // const header = options.result[0].length > 0 ? options.result[0] : [{}];
      // const detail = options.result[1];
      const userObject = options.args.crypto;

      // const utilities = new algaehUtilities();
      let input = {};

      const params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      const { qr_encrypt } = _.head(options.mainData);
      options.mysql
        .executeQuery({
          query: `select H.hospital_name,H.qr_encrypt,ORG.organization_name,ORG.business_registration_number,BH.bill_number as invoice_number,BH.bill_date as invoice_date,P.patient_code, P.full_name as patient_full_name,  P.arabic_name as patient_arabaic_full_name, P.primary_id_no, V.visit_date,E.full_name,E.arabic_name,SD.arabic_sub_department_name, SD.sub_department_name,N.nationality,  P.registration_date, V.age_in_years, P.gender,IP.insurance_sub_name,IP.transaction_number,USR.user_display_name as cashier_name,BH.total_tax,BH.net_total from hims_f_patient P inner join hims_f_patient_visit V on P.hims_d_patient_id = V.patient_id inner join hims_d_nationality as N on N.hims_d_nationality_id = P.nationality_id inner join hims_d_sub_department SD on V.sub_department_id =SD.hims_d_sub_department_id inner join hims_d_employee E on V.doctor_id =E.hims_d_employee_id inner join hims_f_billing_header BH on V.hims_f_patient_visit_id = BH.visit_id left join hims_m_patient_insurance_mapping IM on IM.patient_visit_id = V.hims_f_patient_visit_id left join hims_d_insurance_sub IP on IP.hims_d_insurance_sub_id = IM.primary_sub_id 
          inner join algaeh_d_app_user USR on USR.algaeh_d_app_user_id = BH.created_by 
          inner join hims_d_hospital H on H.hims_d_hospital_id = BH.hospital_id 
          inner join hims_d_organization ORG on ORG.hims_d_organization_id = H.organization_id 
          where (BH.hims_f_billing_header_id=? or BH.bill_number=?);
          select BH.hims_f_billing_header_id,BH.bill_number ,ST.service_type,	ST.arabic_service_type, S.service_name,	  S.arabic_service_name,    BD.quantity,	BD.unit_cost as price,	BD.gross_amount, BD.patient_resp as patient_share,	  BD.patient_payable,	coalesce(BD.discount_amout,	0)as discount_amount, coalesce(BD.net_amout,	0)as net_amount,	  BD.comapany_resp,	BD.company_tax,	BD.company_payble, BD.patient_tax,	coalesce(BD.company_tax,	0)+   coalesce(BD.comapany_resp,	0) as net_claim, BD.service_type_id,V.new_visit_patient from hims_f_billing_header BH       inner join hims_f_patient_visit V on BH.visit_id = V.hims_f_patient_visit_id    inner join hims_f_billing_details BD on BH.hims_f_billing_header_id=BD.hims_f_billing_header_id    inner join hims_d_services S on S.hims_d_services_id = BD.services_id    inner join hims_d_service_type ST on BD.service_type_id = ST.hims_d_service_type_id where (BH.hims_f_billing_header_id=? or BH.bill_number=?);
          `,

          // ["hims_f_billing_header_id","hims_f_billing_header_id","hims_f_billing_header_id","hims_f_billing_header_id"]
          values: [
            input.hims_f_billing_header_id,
            input.hims_f_billing_header_id,
            input.hims_f_billing_header_id,
            input.hims_f_billing_header_id,
          ],
          printQuery: true,
        })
        .then((ress) => {
          const header = _.head(ress[0]);

          const detail = ress[1];
          let qrString = `Seller : ${header.organization_name}
          Vat No. : ${header.business_registration_number}
          Date & Time : ${header.invoice_date}
          Net Total : ${header.net_total}
          Vat : ${header.total_tax}
          `;
          if (qr_encrypt === "Y") encodeHexaDecimal(qrString);
          const result = {
            header: header,
            detail: _.chain(detail)
              .groupBy((g) => g.service_type)
              .map(function (dtl, key) {
                const find = _.find(dtl, (f) => f.service_type === key);
                return {
                  service_type: key,
                  arabic_service_type: find["arabic_service_type"],
                  detailList: dtl,
                };
              })
              .value(),

            total_gross_amount: options.currencyFormat(
              _.sumBy(detail, (s) => parseFloat(s.gross_amount)),
              userObject,
              false
            ),
            total_discount_amount: options.currencyFormat(
              _.sumBy(detail, (s) => parseFloat(s.discount_amount)),
              userObject,
              false
            ),
            total_patient_share: options.currencyFormat(
              _.sumBy(detail, (s) => parseFloat(s.patient_share)),
              userObject,
              false
            ),
            total_patient_payable: options.currencyFormat(
              _.sumBy(detail, (s) => parseFloat(s.patient_payable)),
              userObject,
              false
            ),

            // total_copay_amount: _.sumBy(detail, s => parseFloat(s.company_resp)),
            total_patient_tax: options.currencyFormat(
              _.sumBy(detail, (s) => parseFloat(s.patient_tax)),
              userObject,
              false
            ),
            total_company_resp: options.currencyFormat(
              _.sumBy(detail, (s) => parseFloat(s.company_resp)),
              userObject,
              false
            ),
            vat_amount_total: options.currencyFormat(
              _.sumBy(
                detail,
                (s) => parseFloat(s.patient_tax) + parseFloat(s.company_tax)
              ),
              userObject,
              false
            ),
            total_net_amount: options.currencyFormat(
              _.sumBy(detail, (s) => parseFloat(s.net_amount)),
              userObject,
              false
            ),
            total_company_tax: options.currencyFormat(
              _.sumBy(detail, (s) => parseFloat(s.company_tax)),
              userObject,
              false
            ),
            total_net_claim: options.currencyFormat(
              _.sumBy(detail, (s) => parseFloat(s.net_claim)),
              userObject,
              false
            ),
            vat_applicable: userObject.vat_applicable,
            default_vat_percent: parseFloat(userObject.vat_percent),

            // Here condition required if its qr_encript = yes

            qrData: qrString,
          };

          resolve(result);
        });

      // {"header":${JSON.stringify({...result[0][0],...data[1][0]})},"detail":${JSON.stringify(result[1])}}

      // console.log("userObject", userObject)
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
