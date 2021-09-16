// const algaehUtilities = require("algaeh-utilities/utilities");
// const utilities = new algaehUtilities();
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const { decimal_places, symbol_position, currency_symbol } =
        options.args.crypto;

      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      // utilities.logger().log("input: ", input);

      let qry = "";

      //   switch (input.receipt_type) {
      // case "OP":
      if (input.sub_department_id > 0) {
        str += ` and V.sub_department_id= ${input.sub_department_id}`;
      }
      if (input.provider_id > 0) {
        str += ` and V.doctor_id= ${input.provider_id}`;
      }
      if (input.cashier_name > 0) {
        str += ` and BH.created_by= ${input.cashier_name}`;
      }

      qry = ` select A.receipt_number , A.bill_number,date_format(receipt_date,'%d-%m-%Y') as receipt_date ,patient_code,full_name ,sub_department_code,
          sub_department_name,employee_code,doctor_name,cashier_name,sum(amount)as total
           from (select hims_f_billing_header_id,BH.patient_id,BH.visit_id ,
          RH.hims_f_receipt_header_id, RH.receipt_number, BH.bill_number,
          date(RH.receipt_date)as receipt_date ,RD.hims_f_receipt_details_id,RD.pay_type,RD.amount,
          P.patient_code,P.full_name ,V.hims_f_patient_visit_id,SD.sub_department_code,SD.sub_department_name,
          E.employee_code,E.full_name as doctor_name,EE.user_display_name as cashier_name from  hims_f_billing_header BH
          inner join hims_f_receipt_header RH on BH.receipt_header_id=RH.hims_f_receipt_header_id
          inner join hims_f_receipt_details RD  on RH.hims_f_receipt_header_id=RD.hims_f_receipt_header_id
          inner join hims_f_patient P on BH.patient_id=P.hims_d_patient_id
          inner join hims_f_patient_visit V on BH.visit_id=V.hims_f_patient_visit_id
          inner join hims_d_sub_department SD on V.sub_department_id=SD.hims_d_sub_department_id
          inner join hims_d_employee E on V.doctor_id=E.hims_d_employee_id
          inner join algaeh_d_app_user EE on RH.created_by=EE.algaeh_d_app_user_id
          where date(BH.bill_date)  between date(?) and date(?) and RD.pay_type=? and RD.amount <> 0 and
          BH.adjusted='N' and RH.record_status='A' and RD.record_status='A' and cancelled='N' and adjusted='N' and BH.hospital_id= ?  ${str}) as A
          group by hims_f_receipt_header_id`;
      //   }

      options.mysql
        .executeQuery({
          query: qry,
          values: [
            input.from_date,
            input.to_date,
            input.pay_type,
            input.hospital_id,
          ],
          printQuery: true,
        })
        .then((results) => {
          //  utilities.logger().log("result: ", results);

          const total_cash = _.chain(results)
            .sumBy((s) => parseFloat(s.total))
            .value();

          // utilities.logger().log("result: ", {
          //   total_cash: total_cash,
          //   total_card: total_card,
          //   total_check: total_check,
          //   total_collection: total_collection
          // });

          resolve({
            details: results,
            total_cash: total_cash,

            currency: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol,
            },

            currencyheader: {
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
