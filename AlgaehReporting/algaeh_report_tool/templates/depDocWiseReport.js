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

      if (input.sub_department_id > 0) {
        strQuery += ` and PV.sub_department_id= ${input.sub_department_id}`;
      }
      if (input.provider_id > 0) {
        strQuery += ` and PV.doctor_id= ${input.provider_id}`;
      }

      options.mysql
        .executeQuery({
          query: `select PV.visit_code,PV.visit_date, PV.department_id, D.department_name,PV.sub_department_id, 
          SD.sub_department_name, E.full_name as doctor_name, E.employee_code, E.hims_d_employee_id, 
          SE.service_name as service_name, P.hims_d_patient_id, P.patient_code, P.full_name, BD.net_amout, BH.bill_number, BH.bill_date
          from  hims_f_patient_visit PV
          inner join hims_f_billing_header BH on PV.hims_f_patient_visit_id=BH.visit_id
          inner join hims_f_billing_details BD on BH.hims_f_billing_header_id=BD.hims_f_billing_header_id
          inner join hims_d_services SE on BD.services_id=SE.hims_d_services_id
          inner join hims_d_service_type ST on BD.service_type_id=ST.hims_d_service_type_id
          left join hims_d_sub_department SD on PV.sub_department_id=SD.hims_d_sub_department_id
          left join hims_d_department D on PV.department_id=D.hims_d_department_id
          inner join hims_d_employee E on PV.doctor_id=E.hims_d_employee_id
          inner join hims_f_patient P on PV.patient_id=P.hims_d_patient_id
          where BH.adjusted='N' and BD.cancel_yes_no='N' and date(PV.visit_date) between date(?) and date(?) and PV.hospital_id=? ${strQuery};`,
          values: [input.from_date, input.to_date, input.hospital_id],
          printQuery: true,
        })
        .then((res) => {
          options.mysql.releaseConnection();
          const result = res;
          const subDepartmentWise = _.chain(result)
            .groupBy((g) => g.sub_department_id)
            .map((subDept) => {
              const { sub_department_name } = subDept[0];
              const doctors = _.chain(subDept)
                .groupBy((g) => g.hims_d_employee_id)
                .map((docs) => {
                  const { employee_code, doctor_name } = docs[0];
                  const patient = _.chain(docs)
                    .groupBy((g) => g.hims_d_patient_id)
                    .map((pat) => {
                      return pat;
                    })
                    .value();

                  return {
                    employee_code,
                    doctor_name,
                    totalPatient: patient.length,
                    totalAmt: options.currencyFormat(
                      _.sumBy(docs, (s) => parseFloat(s.net_amout)),
                      options.args.crypto
                    ),
                    total_Amt: _.sumBy(docs, (s) => parseFloat(s.net_amout)),
                    docs: docs.map((n) => {
                      return {
                        ...n,
                        net_amout: n.net_amout,
                      };
                    }),
                  };
                })
                .sortBy((s) => s.visit_date)
                .value();
              return {
                sub_department_name,
                doctors: doctors,
                dep_total: options.currencyFormat(
                  _.sumBy(doctors, (s) => parseFloat(s.total_Amt)),
                  options.args.crypto
                ),
                depTotal: _.sumBy(doctors, (s) => parseFloat(s.total_Amt)),
              };
            })
            .value();
          // console.log(JSON.stringify(subDepartmentWise));
          const net_total = options.currencyFormat(
            _.sumBy(subDepartmentWise, (s) => parseFloat(s.depTotal)),
            options.args.crypto
          );

          resolve({ result: subDepartmentWise, net_total: net_total });
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
