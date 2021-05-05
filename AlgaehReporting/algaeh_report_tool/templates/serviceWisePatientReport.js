// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;

      let input = {};
      let params = options.args.reportParams;
      // const utilities = new algaehUtilities();
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let strData = "";

      if (input.nationality_id > 0) {
        strData += ` and P.nationality_id= ${input.nationality_id}`;
      }
      if (input.service_type_id > 0) {
        strData += ` and BD.service_type_id= ${input.service_type_id}`;
      }

      options.mysql
        .executeQuery({
          query: `SELECT V.visit_date, P.hims_d_patient_id,P.full_name, P.patient_code,  N.nationality,
          S.service_code,S.service_name
              FROM hims_f_billing_details as BD
              left join hims_f_billing_header BH on BD.hims_f_billing_header_id = BH.hims_f_billing_header_id
              inner join hims_f_patient P on P.hims_d_patient_id = BH.patient_id
              inner join  hims_f_patient_visit V on BH.visit_id = hims_f_patient_visit_id
              inner join hims_d_nationality N on N.hims_d_nationality_id = P.nationality_id
              inner join hims_d_services S on BD.services_id=S.hims_d_services_id
             where BD.cancel_yes_no='N' and adjusted='N' and date(V.visit_date) between date(?) and date(?) and BH.hospital_id=? ${strData};`,
          values: [input.from_date, input.to_date, input.hospital_id],
          printQuery: true,
        })
        .then((ress) => {
          const BillWise = _.chain(ress)
            .groupBy((g) => g.hims_d_patient_id)
            .map((billNo) => {
              const {
                visit_date,
                full_name,
                patient_code,
                nationality,
              } = billNo[0];
              const patientList = _.chain(billNo)
                .groupBy((g) => g.patient_id)
                .map((docs) => {
                  // const { full_name, patient_code } = docs[0];
                  return {
                    docs: docs.map((n) => {
                      return {
                        ...n,
                      };
                    }),
                  };
                })
                // .sortBy((s) => s.bill_date)
                .value();

              return {
                visit_date,
                full_name,
                patient_code,
                nationality,
                patientList: patientList,
              };
            })
            .value();

          resolve({
            result: BillWise,

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
        .catch((error) => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
