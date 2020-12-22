const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      let input = {};

      const params = options.args.reportParams;
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let strQuery = "";

      if (input.cashier_name > 0) {
        strQuery += ` and BH.created_by= ${input.cashier_name}`;
      }

      options.mysql
        .executeQuery({
          query: `SELECT PV.visit_code,PV.visit_date,
          E.full_name as doctor_name, E.employee_code, E.hims_d_employee_id,
          P.patient_code, P.full_name, PH.net_amount,
          EU.full_name as cashier_name,PH.created_by, EU.employee_code as cashier_code, PH.pos_number, PH.pos_date FROM hims_f_pharmacy_pos_header as PH
          left join hims_f_patient_visit PV on PV.hims_f_patient_visit_id=PH.visit_id
          left join hims_d_employee E on PV.doctor_id=E.hims_d_employee_id
          left join hims_f_patient P on PV.patient_id=P.hims_d_patient_id
          left join algaeh_d_app_user U on PH.created_by=U.algaeh_d_app_user_id
          left join hims_d_employee EU on U.employee_id = EU.hims_d_employee_id
          where PH.cancelled='N' and PH.posted='Y' and date(PH.pos_date) between date(?) and date(?) and PH.hospital_id=? ${strQuery} ;`,
          values: [input.from_date, input.to_date, input.hospital_id],
          printQuery: true,
        })
        .then((results) => {
          const result = _.chain(results)
            .groupBy((g) => g.created_by)
            .map(function (dtl, key) {
              const { cashier_name } = _.head(dtl);

              return {
                created_by: key,
                cashier_name,
                detailList: dtl,
                cashier_total: _.sumBy(dtl, (s) => parseFloat(s.net_amount)),
                // sum_amount: sum_amount,
              };
            })
            .value();
          // const grandTotal =

          const net_total = _.sumBy(result, (s) => parseFloat(s.cashier_total));

          resolve({
            detail: result,
            net_total: net_total,
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
