// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      const { decimal_places, symbol_position, currency_symbol } =
        options.args.crypto;

      let input = {};

      const params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let strQuery = "";

      if (input.service_type_id > 0) {
        str += `and  BD.service_type_id=${input.service_type_id}`;
      }

      if (input.hims_d_services_ids.length > 0) {
        str += ` and BD.services_id in (${input.hims_d_services_ids}) `;
      }
      if (input.hims_d_insurance_sub_ids.length > 0) {
        str += ` and INS.hims_d_insurance_sub_id in (${input.hims_d_insurance_sub_ids}) `;
      }

      options.mysql
        .executeQuery({
          query: `select BH.bill_number,INS.hims_d_insurance_sub_id,INS.insurance_sub_name,BD.services_id,
          ST.service_type_code,ST.service_type,S.service_code,S.service_name,BD.unit_cost, BD.quantity,
          BD.comapany_resp,BD.company_tax,BD.company_payble
          from hims_f_billing_header BH
          inner join hims_f_billing_details BD on BH.hims_f_billing_header_id=BD.hims_f_billing_header_id
          inner join hims_d_service_type ST on BD.service_type_id=ST.hims_d_service_type_id and ST.record_status='A'
          inner join hims_d_services S on  BD.services_id = S.hims_d_services_id and S.record_status='A'
          inner join hims_m_patient_insurance_mapping INM on INM.patient_visit_id = BH.visit_id
          inner join hims_d_insurance_sub INS on INS.hims_d_insurance_sub_id = INM.primary_sub_id
          where BD.cancel_yes_no='N' and BH.adjusted='N' and BH.hospital_id=? and 
            date(BH.bill_date) between date(?) and date(?) and BH.record_status='A' and BD.record_status='A'  ${strQuery};`,
          values: [input.hospital_id, input.from_date, input.to_date],
          printQuery: true,
        })
        .then((res) => {
          options.mysql.releaseConnection();
          const result = res;
          const companyWise = _.chain(result)
            .groupBy((g) => g.hims_d_insurance_sub_id)
            .map((subDept) => {
              const { insurance_sub_name } = subDept[0];
              const doctors = _.chain(subDept)
                .groupBy((g) => g.services_id)
                .map((docs) => {
                  const { service_name, unit_cost } = docs[0];
                  return {
                    service_name,
                    unit_cost,
                    total_quantity: _.sumBy(docs, (s) =>
                      parseFloat(s.quantity)
                    ),
                    total_comapany_resp: _.sumBy(docs, (s) =>
                      parseFloat(s.comapany_resp)
                    ),
                    total_company_tax: _.sumBy(docs, (s) =>
                      parseFloat(s.company_tax)
                    ),
                    total_company_payble: _.sumBy(docs, (s) =>
                      parseFloat(s.company_payble)
                    ),
                    docs: docs.map((n) => {
                      return {
                        ...n,
                        comapany_resp: n.comapany_resp,
                        company_tax: n.company_tax,
                        company_payble: n.company_payble,
                      };
                    }),
                  };
                })
                .sortBy((s) => s.visit_date)
                .value();
              return {
                insurance_sub_name,
                doctors: doctors,
              };
            })
            .value();

          resolve({
            result: companyWise,
            net_comapany_resp: _.sumBy(result, (t) =>
              parseFloat(t.comapany_resp)
            ),
            net_company_tax: _.sumBy(result, (t) => parseFloat(t.company_tax)),
            net_company_payble: _.sumBy(result, (t) =>
              parseFloat(t.company_payble)
            ),

            decimalOnly: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol,
            },
            currencyOnly: {
              decimal_places,
              addSymbol: true,
              symbol_position,
              currency_symbol,
            },
          });
        })
        .catch((e) => {
          // console.log("e:", e);
          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
