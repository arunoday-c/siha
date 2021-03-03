// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      let input = {};
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;

      const params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let strQuery = "";

      if (input.hospital_id > 0) {
        strQuery += ` and IH.hospital_id= ${input.hospital_id}`;
      }
      if (input.insurance_provider_id > 0) {
        strQuery += ` and IH.insurance_provider_id= ${input.insurance_provider_id}`;
      }

      options.mysql
        .executeQuery({
          query: `select IH.insurance_provider_id,IH.network_id,IH.invoice_number,IH.invoice_date,IH.card_number,IH.policy_number,
          ID.*,INN.network_type as policy_name,
          IP.insurance_provider_name as company_name, INO.policy_number as provider_code,
          IP.insurance_provider_code as policy_holder, P.patient_code,P.full_name, SI.service_name
          from hims_f_invoice_header as IH
          left outer join hims_d_insurance_network INN on IH.network_id = INN.hims_d_insurance_network_id
          left outer join hims_d_insurance_provider IP on IH.insurance_provider_id = IP.hims_d_insurance_provider_id
          inner join hims_d_insurance_network_office INO on IH.network_office_id = INO.hims_d_insurance_network_office_id
          inner join  hims_f_invoice_details ID on IH.hims_f_invoice_header_id = ID.invoice_header_id
          inner join hims_f_patient P on P.hims_d_patient_id = IH.patient_id
          inner  join hims_d_services as SI on SI.hims_d_services_id = ID.service_id
          where IH.claim_validated ='V' and date(IH.invoice_date) between date(?) and date(?) ${strQuery};`,
          values: [input.from_date, input.to_date],
          printQuery: true,
        })
        .then((res) => {
          options.mysql.releaseConnection();
          const result = res;
          const ProviderWise = _.chain(result)
            .groupBy((g) => g.insurance_provider_id)
            .map((subDept) => {
              const { company_name } = subDept[0];
              const networkList = _.chain(subDept)
                .groupBy((g) => g.network_id)
                .map((docs) => {
                  const { policy_name } = docs[0];
                  return {
                    policy_name,
                    totalNetworkAmt: _.sumBy(docs, (s) =>
                      parseFloat(s.company_resp)
                    ),
                    vatNetworkAmt: _.sumBy(docs, (s) =>
                      parseFloat(s.company_tax)
                    ),
                    netNetworkAmt: _.sumBy(docs, (s) =>
                      parseFloat(s.company_payable)
                    ),
                    docs: docs.map((n) => {
                      return {
                        ...n,
                      };
                    }),
                  };
                })
                // .sortBy((s) => s.visit_date)
                .value();

              return {
                company_name,
                totalCompanyAmt: _.sumBy(subDept, (s) =>
                  parseFloat(s.company_resp)
                ),
                vatCompanyAmt: _.sumBy(subDept, (s) =>
                  parseFloat(s.company_tax)
                ),
                netCompanyAmt: _.sumBy(subDept, (s) =>
                  parseFloat(s.company_payable)
                ),
                networkList: networkList,
              };
            })
            .value();

          console.log("ProviderWise==", ProviderWise);
          resolve({
            result: ProviderWise,
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
