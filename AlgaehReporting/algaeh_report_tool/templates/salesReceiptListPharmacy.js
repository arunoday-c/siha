import algaehUtilities from "algaeh-utilities/utilities";

const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    const utilities = new algaehUtilities();
    try {
      //--------------------
      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      if (input.cashier_id > 0) {
        str += ` and RH.created_by= ${input.cashier_id}`;
      }

      if (
        input.pay_type !== "null" &&
        input.pay_type !== null &&
        input.pay_type !== undefined
      ) {
        str += ` and RD.pay_type= '${input.pay_type}'`;
      }

      options.mysql
        .executeQuery({
          query: `	select RH.receipt_number,PH.pos_number,RH.created_date as collected_time, date(RH.receipt_date) as receipt_date ,CASE WHEN PH.pos_customer_type='OP' THEN 
		  P.full_name else PH.patient_name END as patient_full_name ,
		  CASE WHEN PH.pos_customer_type='OP' THEN   P.patient_code else null END as mrn_no ,  
		  RH.total_amount,RH.hims_f_receipt_header_id,PH.patient_id,RD.pay_type,RD.amount,
		  concat(E.full_name ,'-',E.employee_code) as cashier
		  from hims_f_pharmacy_pos_header PH 
		  inner join hims_f_receipt_header RH on PH.receipt_header_id=RH.hims_f_receipt_header_id
		  inner join hims_f_receipt_details RD on RH.hims_f_receipt_header_id=RD.hims_f_receipt_header_id
		  left join   hims_f_patient P on PH.patient_id = P.hims_d_patient_id 
		  left join algaeh_d_app_user U on RH.created_by=U.algaeh_d_app_user_id
		  left join hims_d_employee E on U.employee_id=E.hims_d_employee_id 
		  where  PH.record_status ='A' and RH.record_status ='A' and RD.record_status ='A' and RH.pay_type='R'
		  and  PH.hospital_id=? and   RH.hospital_id=? and PH.cancelled='N' and PH.posted='Y'and PH.location_id=?
		  and date(RH.receipt_date) between date(?) and date(?)
		   and time(RH.created_date) between ? and ? ${str} ;`,
          values: [
            input.hospital_id,
            input.hospital_id,
            input.location_id,
            input.from_date,
            input.to_date,
            input.from_time,
            input.to_time
          ],

          printQuery: true
        })
        .then(result => {
          utilities.logger().log("result: ", result);

          const data = _.chain(result)
            .groupBy(g => g.hims_f_receipt_header_id)
            .map(function(item, key) {
              const cash = _.chain(item)
                .filter(f => f.pay_type == "CA")
                .sumBy(s => parseFloat(s.amount))
                .value()
                .toFixed(3);

              //   utilities.logger().log("cash: ", cash);

              const card = _.chain(item)
                .filter(f => f.pay_type == "CD")
                .sumBy(s => parseFloat(s.amount))
                .value()
                .toFixed(3);
              const check = _.chain(item)
                .filter(f => f.pay_type == "CH")
                .sumBy(s => parseFloat(s.amount))
                .value()
                .toFixed(3);
              return {
                receipt_number: item[0]["receipt_number"],
                pos_number: item[0]["pos_number"],
                receipt_date: item[0]["receipt_date"],
                patient_full_name: item[0]["patient_full_name"],
                mrn_no: item[0]["mrn_no"],
                total_amount: item[0]["total_amount"],
                cash: cash,
                card: card,
                check: check
              };
            })
            .value();

          const total_cash = _.chain(result)
            .filter(f => f.pay_type == "CA")
            .sumBy(s => parseFloat(s.amount))
            .value()
            .toFixed(3);

          const total_card = _.chain(result)
            .filter(f => f.pay_type == "CD")
            .sumBy(s => parseFloat(s.amount))
            .value()
            .toFixed(3);

          const total_check = _.chain(result)
            .filter(f => f.pay_type == "CH")
            .sumBy(s => parseFloat(s.amount))
            .value()
            .toFixed(3);
          const total_sum =
            parseFloat(total_cash) +
            parseFloat(total_card) +
            parseFloat(total_check);

          const output = {
            details: data,
            total_cash: total_cash,
            total_card: total_card,
            total_check: total_check,
            total_sum: total_sum.toFixed(3)
          };
          utilities.logger().log("output: ", output);
          resolve(output);
        })
        .catch(error => {
          options.mysql.releaseConnection();
          console.log("error", error);
        });

      //----------------------------------
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
