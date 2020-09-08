// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      let input = {};

      const params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let strQuery = "";

      // if (input.cashier_name > 0) {
      //   strQuery += ` and PV.created_by= ${input.cashier_name}`;
      // }

      console.log("params=====", params);

      if (input.hospital_id > 0) {
        strQuery += ` and BH.hospital_id= ${input.hospital_id}`;
      }

      options.mysql
        .executeQuery({
          query: `SELECT BH.patient_id, PT.patient_code,PT.full_name,V.visit_code,V.visit_date,ST.service_type,S.service_name,BD.net_amout,BH.bill_number,BH.bill_date, BH.hospital_id
            FROM hims_f_billing_details as BD
            inner join hims_f_billing_header BH on BD.hims_f_billing_header_id=BH.hims_f_billing_header_id 
            inner join hims_f_patient PT on BH.patient_id = PT.hims_d_patient_id
            inner join hims_d_service_type ST on BD.service_type_id = ST.hims_d_service_type_id
            inner join hims_d_services S on BD.services_id = S.hims_d_services_id
            inner join hims_f_patient_visit V on BH.visit_id = V.hims_f_patient_visit_id where cancel_yes_no='Y' ${strQuery};`,
          // values: [],
          printQuery: true,
        })
        .then((res) => {
          options.mysql.releaseConnection();
          const result = res;
          const ServiceTypetWise = _.chain(result)
            .groupBy((g) => g.service_type_id)
            .map((subDept) => {
              const { service_type } = subDept[0];
              const patientList = _.chain(subDept)
                .groupBy((g) => g.patient_id)
                .map((docs) => {
                  const { full_name, patient_code } = docs[0];
                  return {
                    full_name,
                    patient_code,

                    // total_weighted_cost: _.sumBy(docs, (s) =>
                    //   parseFloat(s.weighted_cost)
                    // ),

                    // total_stock_value: _.sumBy(docs, (s) =>
                    //   parseFloat(s.stock_value)
                    // ),

                    docs: docs.map((n) => {
                      return {
                        ...n,
                        // weighted_cost: options.currencyFormat(
                        //   n.weighted_cost,
                        //   options.args.crypto
                        // ),
                        // stock_value: options.currencyFormat(
                        //   n.stock_value,
                        //   options.args.crypto
                        // ),
                      };
                    }),
                  };
                })
                // .sortBy((s) => s.visit_date)
                .value();

              return {
                service_type,
                patientList: patientList,
                // weighted_cost_total: _.sumBy(patientList, (s) =>
                //   parseFloat(s.total_weighted_cost)
                // ),

                // stock_value_total: _.sumBy(patientList, (s) =>
                //   parseFloat(s.total_stock_value)
                // ),

                // stock_value_total = options.currencyFormat(
                //   _.sumBy(patientList, (s) => parseFloat(s.total_stock_value)),
                //   options.args.crypto
                // );
              };
            })
            .value();

          //   const net_stock_value = options.currencyFormat(
          //     _.sumBy(ServiceTypetWise, (s) => parseFloat(s.stock_value_total)),
          //     options.args.crypto
          //   );
          // , net_total: net_total
          console.log("ServiceTypetWise==", ServiceTypetWise);
          resolve({
            result: ServiceTypetWise,
            // net_qty_hand: net_qty_hand,
            // net_weighted_cost: net_weighted_cost,
            // net_stock_value: net_stock_value,
          });
        })
        .catch((e) => {
          console.log("e:", e);
          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
