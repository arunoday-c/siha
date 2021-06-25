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
      let is_SendOut = "";

      if (input.is_SendOut === "Y") {
        is_SendOut = " and LO.send_out_test = 'Y'";
      } else if (input.SENDOUT_TYPE === "N") {
        is_SendOut = " and LO.send_out_test ='N'";
      }

      options.mysql
        .executeQuery({
          query: `
          
          SELECT 
BH.hims_f_billing_header_id,BH.bill_number,BH.bill_date,
LO.send_out_test,LO.provider_id,
BD.unit_cost,BD.quantity,BD.patient_tax,BD.patient_resp,BD.company_tax,BD.comapany_resp,
(BD.patient_payable + BD.company_payble) as net_amout,
 P.primary_id_no,P.patient_code, P.full_name,
 E.full_name as doctor_name,S.service_code,
 S.service_name
 FROM hims_f_billing_header BH
 inner join hims_f_lab_order LO on LO.billing_header_id = BH.hims_f_billing_header_id
inner join hims_f_billing_details BD on BD.hims_f_billing_header_id=BH.hims_f_billing_header_id and BD.services_id=LO.service_id
 inner join hims_d_services S on S.hims_d_services_id=LO.service_id
 inner join hims_f_patient P on P.hims_d_patient_id=LO.patient_id
 inner join hims_d_employee E on E.hims_d_employee_id=LO.provider_id
where BH.hospital_id=? and date(BH.bill_date) between date(?) and date(?) and
BD.service_type_id='5' and BD.cancel_yes_no='N' ${is_SendOut};`,
          values: [input.hospital_id, input.from_date, input.to_date],
          printQuery: true,
        })
        .then((res) => {
          options.mysql.releaseConnection();
          const result = res;
          const subDepartmentWise = _.chain(result)
            .groupBy((g) => g.provider_id)
            .map((subDept) => {
              const { doctor_name } = subDept[0];
              const doctors = _.chain(subDept)
                .groupBy((g) => g.hims_f_billing_header_id)
                .map((docs) => {
                  const { bill_number, bill_date } = docs[0];

                  return {
                    bill_number,
                    bill_date,
                    net_amount_total: _.sumBy(docs, (s) =>
                      parseFloat(s.net_amout)
                    ),
                    // totalPatient: patient.length,
                    // pat_tax_total: _.sumBy(docs, (s) =>
                    //   parseFloat(s.patient_tax)
                    // ),
                    // pat_pay_total: _.sumBy(docs, (s) =>
                    //   parseFloat(s.patient_resp)
                    // ),
                    // comp_tax_total: _.sumBy(docs, (s) =>
                    //   parseFloat(s.company_tax)
                    // ),
                    // comp_pay_total: _.sumBy(docs, (s) =>
                    //   parseFloat(s.comapany_resp)
                    // ),

                    docs: docs.map((n) => {
                      return {
                        ...n,
                        // patient_tax: n.patient_tax,
                        // patient_resp: n.patient_resp,
                        // company_tax: n.company_tax,
                        // comapany_resp: n.comapany_resp,
                        net_amout: n.net_amout,
                      };
                    }),
                  };
                })
                .sortBy((s) => s.bill_date)
                .value();

              console.log(doctors);

              return {
                doctor_name,
                doctors: doctors,
                // net_pat_tax_total: _.sumBy(doctors, (s) =>
                //   parseFloat(s.pat_tax_total)
                // ),
                // net_pat_pay_total: _.sumBy(doctors, (s) =>
                //   parseFloat(s.pat_pay_total)
                // ),
                // net_comp_tax_total: _.sumBy(doctors, (s) =>
                //   parseFloat(s.comp_tax_total)
                // ),
                // net_comp_pay_total: _.sumBy(doctors, (s) =>
                //   parseFloat(s.comp_pay_total)
                // ),
                net_net_amount_total: _.sumBy(doctors, (s) =>
                  parseFloat(s.net_amount_total)
                ),
              };
            })
            .value();

          resolve({
            result: subDepartmentWise,

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
