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

      console.log(input, "=== input");
      //   let strQuery = "";

      options.mysql
        .executeQuery({
          query: `SELECT CH.comission_code,CH.created_date,CH.provider_id,E.full_name,E.employee_code,E.identity_no,CH.from_date,CH.to_date,CH.created_date,CD.bill_number,CD.bill_date,CD.servtype_id,ST.service_type,CD.service_id,S.service_name,
          COALESCE(CD.net_amount,0) as net_amount,
          COALESCE(CD.op_cash_comission_percentage,0) as op_cash_comission_percentage,
          COALESCE(CD.op_cash_comission_amount,0) as op_cash_comission_amount,
          COALESCE(CD.op_crd_comission_percentage,0) as op_crd_comission_percentage,
          COALESCE(CD.op_crd_comission_amount,0) as op_crd_comission_amount,
          (COALESCE(CD.op_cash_comission_amount,0) + COALESCE(CD.op_crd_comission_amount,0)) as total_comm
          -- ,CD.* 
          FROM hims_f_doctor_comission_header CH
          inner join hims_d_employee E on E.hims_d_employee_id = CH.provider_id
          inner join hims_f_doctor_comission_detail CD on CD.doctor_comission_header_id = CH.hims_f_doctor_comission_header_id
          inner join hims_d_service_type ST on ST.hims_d_service_type_id = CD.servtype_id
          inner join hims_d_services S on S.hims_d_services_id = CD.service_id
          where CH.hims_f_doctor_comission_header_id=?;`,
          values: [input.hims_f_doctor_comission_header_id],
          printQuery: true,
        })
        .then((res) => {
          options.mysql.releaseConnection();
          const header = res.length ? res[0] : {};
          const result = res;
          const subDepartmentWise = _.chain(result)
            .groupBy((g) => g.sub_department_id)
            .map((subDept) => {
              const { sub_department_name, full_name } = subDept[0];
              // const doctors = _.chain(subDept)
              //   .groupBy((g) => g.hims_d_employee_id)
              //   .map((docs) => {
              //
              //     const { employee_code, doctor_name } = docs[0];
              //     const patient = _.chain(docs)
              //       .groupBy((g) => g.hims_d_patient_id)
              //       .map((pat) => {
              //
              //         return pat;
              //       })
              //       .value();

              //   return {
              //     employee_code,
              //     doctor_name,
              //     totalPatient: patient.length,
              //     // totalAmt: options.currencyFormat(
              //     //   _.sumBy(docs, (s) => parseFloat(s.net_amount)),
              //     //   options.args.crypto
              //     // ),
              //     // total_Amt: _.sumBy(docs, (s) => parseFloat(s.net_amount)),
              //     docs: docs.map((n) => {
              //       return {
              //         ...n,
              //         net_amount: n.net_amount,
              //       };
              //     }),
              //   };
              // })
              // .sortBy((s) => s.visit_date)
              // .value();
              return {
                sub_department_name,
                details: subDept,
                net_total: options.currencyFormat(
                  _.sumBy(subDept, (s) => parseFloat(s.net_amount)),
                  options.args.crypto
                ),
                op_cash_comission_amount: options.currencyFormat(
                  _.sumBy(subDept, (s) =>
                    parseFloat(s.op_cash_comission_amount)
                  ),
                  options.args.crypto
                ),
                op_crd_comission_amount: options.currencyFormat(
                  _.sumBy(subDept, (s) =>
                    parseFloat(s.op_crd_comission_amount)
                  ),
                  options.args.crypto
                ),
                dep_total: options.currencyFormat(
                  _.sumBy(subDept, (s) => parseFloat(s.total_Amt)),
                  options.args.crypto
                ),
                // depTotal: _.sumBy(doctors, (s) => parseFloat(s.total_Amt)),
              };
            })
            .value();
          // console.log(JSON.stringify(subDepartmentWise));
          // const net_total = options.currencyFormat(
          //   _.sumBy(subDepartmentWise, (s) => parseFloat(s.depTotal)),
          //   options.args.crypto
          // );

          resolve({ header, result: subDepartmentWise });
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
