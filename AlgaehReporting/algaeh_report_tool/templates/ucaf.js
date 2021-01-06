const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    try {
      let str = "";
      let input = {};
      let params = options.args.reportParams;
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      options.mysql
        .executeQuery({
          query: `
          select H.hospital_name,H.arabic_hospital_name ,U.* from hims_f_ucaf_header U inner join hims_d_hospital H on H.hims_d_hospital_id = U.hospital_id where patient_id =? and (date(visit_date)=date(?) or visit_id=?);
select * from hims_f_ucaf_insurance_details ID inner join hims_f_ucaf_header H on ID.hims_f_ucaf_header_id= H.hims_f_ucaf_header_id where H.patient_id =? and (date(H.visit_date)=date(?) or H.visit_id=?);
select * from hims_f_ucaf_medication M inner join hims_f_ucaf_header H on M.hims_f_ucaf_header_id= H.hims_f_ucaf_header_id where H.patient_id =? and (date(H.visit_date)=date(?) or H.visit_id=?);
select * from hims_f_ucaf_services S inner join hims_f_ucaf_header H on S.hims_f_ucaf_header_id= H.hims_f_ucaf_header_id where H.patient_id =? and (date(H.visit_date)=date(?) or H.visit_id=?);`,
          values: [
            input.hims_d_patient_id,
            input.visit_date,
            input.visit_id,
            input.hims_d_patient_id,
            input.visit_date,
            input.visit_id,
            input.hims_d_patient_id,
            input.visit_date,
            input.visit_id,
            input.hims_d_patient_id,
            input.visit_date,
            input.visit_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          // debugger;
          // return;

          // result = result;
          const data = {
            // result: result,
            header: result[0][0],
            insurance: result[1],
            medication: result[2],
            services: result[3],
            sum_service_net_amout: _.sumBy(options.result[3], (s) =>
              parseFloat(s.service_net_amout)
            ),
          };
          resolve({
            ...data,
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
