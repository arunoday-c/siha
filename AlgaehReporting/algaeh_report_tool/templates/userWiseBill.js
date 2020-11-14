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

      if (input.cashier_name > 0) {
        strQuery += ` and BH.created_by= ${input.cashier_name}`;
      }

      options.mysql
        .executeQuery({
          query: `select BH.created_by, PV.visit_code,PV.visit_date, PV.department_id, D.department_name,PV.sub_department_id,
          SD.sub_department_name, E.full_name as doctor_name, E.employee_code, E.hims_d_employee_id,
          SE.service_name as service_name,BD.service_type_id,ST.service_type, P.patient_code, P.full_name, BD.services_id, BD.net_amout,
          EU.full_name as cashier_name,BH.created_by, EU.employee_code as cashier_code, BH.bill_number, BH.bill_date
          from  hims_f_patient_visit PV
          inner join hims_f_billing_header BH on PV.hims_f_patient_visit_id=BH.visit_id
          inner join hims_f_billing_details BD on BH.hims_f_billing_header_id=BD.hims_f_billing_header_id
          inner join hims_d_services SE on BD.services_id=SE.hims_d_services_id
          inner join hims_d_service_type ST on BD.service_type_id=ST.hims_d_service_type_id
          left join hims_d_sub_department SD on PV.sub_department_id=SD.hims_d_sub_department_id
          left join hims_d_department D on PV.department_id=D.hims_d_department_id
          inner join hims_d_employee E on PV.doctor_id=E.hims_d_employee_id
          inner join hims_f_patient P on PV.patient_id=P.hims_d_patient_id
          inner join algaeh_d_app_user U on BH.created_by=U.algaeh_d_app_user_id
          inner join hims_d_employee EU on U.employee_id = EU.hims_d_employee_id
          where BH.cancelled='N' and adjusted='N' and BD.cancel_yes_no='N' and date(PV.visit_date) between date(?) and date(?) and PV.hospital_id=? ${strQuery};`,
          values: [input.from_date, input.to_date, input.hospital_id],
          printQuery: true,
        })
        .then((res) => {
          options.mysql.releaseConnection();
          const result = res;
          const cashierWise = _.chain(result)
            .groupBy((g) => g.created_by)
            .map((subDept) => {
              const { cashier_name } = subDept[0];
              const doctors = _.chain(subDept)
                .groupBy((g) => g.service_type_id)
                .map((docs) => {
                  const { service_type } = docs[0];
                  return {
                    service_type,
                    totalAmt: options.currencyFormat(
                      _.sumBy(docs, (s) => parseFloat(s.net_amout)),
                      options.args.crypto
                    ),
                    total_Amt: _.sumBy(docs, (s) => parseFloat(s.net_amout)),
                    docs: docs.map((n) => {
                      return {
                        ...n,
                        net_amout: options.currencyFormat(
                          n.net_amout,
                          options.args.crypto
                        ),
                      };
                    }),
                  };
                })
                .sortBy((s) => s.visit_date)
                .value();
              return {
                cashier_name,
                doctors: doctors,
                cashierTotal: _.sumBy(doctors, (s) => parseFloat(s.total_Amt)),
                cashier_total: options.currencyFormat(
                  _.sumBy(doctors, (s) => parseFloat(s.total_Amt)),
                  options.args.crypto
                )
              };
            })
            .value();

          const net_total = options.currencyFormat(
            _.sumBy(cashierWise, (s) => parseFloat(s.cashierTotal)),
            options.args.crypto
          )
          resolve({ result: cashierWise, net_total: net_total });
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
