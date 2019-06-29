const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    try {
      const _ = options.loadash;
      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      utilities.logger().log("input: ", input);

      if (input.location_id > 0) {
        str += ` and IL.pharmacy_location_id= ${input.location_id}`;
      }

      let qry = "";

      switch (input.receipt_type) {
        case "OP":
          qry =
            "select hims_f_billing_header_id,BH.patient_id,BH.visit_id ,BH.incharge_or_provider ,date(bill_date) as bill_date,\
		RH.hims_f_receipt_header_id, RH.receipt_number,RH.pay_type, date(RH.receipt_date)as receipt_date ,RD.hims_f_receipt_details_id,RD.pay_type,RD.amount,\
		P.patient_code,P.full_name ,V.hims_f_patient_visit_id,SD.sub_department_code,SD.sub_department_name,\
		E.employee_code,E.full_name as doctor_name from  hims_f_billing_header BH\
		inner join hims_f_receipt_header RH on BH.receipt_header_id=RH.hims_f_receipt_header_id\
		inner join hims_f_receipt_details RD  on RH.hims_f_receipt_header_id=RD.hims_f_receipt_header_id \
		inner join hims_f_patient P on BH.patient_id=P.hims_d_patient_id\
		inner join hims_f_patient_visit V on BH.visit_id=V.hims_f_patient_visit_id\
		inner join hims_d_sub_department SD on V.sub_department_id=SD.hims_d_sub_department_id\
		inner join hims_d_employee E on V.doctor_id=E.hims_d_employee_id\
		where date(bill_date)  between date(?) and date(?) and RH.pay_type='R' and RH.record_status='A'\
		and RD.record_status='A' ";

          if (input.location_id > 0) {
            str += ` and V.sub_department_id= ${input.location_id}`;
          }
      }

      options.mysql
        .executeQuery({
          query: `select hims_m_item_location_id,IL.item_id,IL.expirydt,IL.pharmacy_location_id,IL.qtyhand,
					  PL.location_description as pharmacy_location,IM.item_description,IM.item_code,IL.batchno
					  from hims_m_item_location IL inner join  hims_d_item_master IM on IL.item_id=IM.hims_d_item_master_id
					  inner join hims_d_pharmacy_location PL on IL.pharmacy_location_id=PL.hims_d_pharmacy_location_id
					  where IL.record_status='A' and PL.hospital_id=? ${str};`,
          values: [input.hospital_id],
          printQuery: true
        })
        .then(results => {
          options.mysql.releaseConnection();
          utilities.logger().log("result: ", results);
          resolve({ details: results });
        })
        .catch(error => {
          options.mysql.releaseConnection();
          console.log("error", error);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
