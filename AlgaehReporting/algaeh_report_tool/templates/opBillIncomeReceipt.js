const algaehUtilities = require("algaeh-utilities/utilities");
const utilities = new algaehUtilities();
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    try {
      const _ = options.loadash;
      let str = "";
      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      utilities.logger().log("input: ", input);

      let qry = "";

      switch (input.receipt_type) {
        case "OP":
          if (input.sub_department_id > 0) {
            str += ` and V.sub_department_id= ${input.sub_department_id}`;
          }
          if (input.provider_id > 0) {
            str += ` and V.doctor_id= ${input.provider_id}`;
          }

          qry = ` select A.receipt_number , receipt_date ,patient_code,full_name ,sub_department_code,
          sub_department_name,employee_code,doctor_name,sum(cash) as cash ,sum(card) as card,sum(cheque) as cheque,sum(amount)as total
           from(select hims_f_billing_header_id,BH.patient_id,BH.visit_id ,
          RH.hims_f_receipt_header_id, RH.receipt_number, 
          date(RH.receipt_date)as receipt_date ,RD.hims_f_receipt_details_id,RD.pay_type,RD.amount,    
          case RD.pay_type when 'CA' then RD.amount else '0.00' end as cash,
          case RD.pay_type when 'CD' then RD.amount else '0.00' end as card,
          case RD.pay_type when 'CH' then RD.amount else '0.00' end as cheque,
          P.patient_code,P.full_name ,V.hims_f_patient_visit_id,SD.sub_department_code,SD.sub_department_name,  
          E.employee_code,E.full_name as doctor_name from  hims_f_billing_header BH
          inner join hims_f_receipt_header RH on BH.receipt_header_id=RH.hims_f_receipt_header_id  
          inner join hims_f_receipt_details RD  on RH.hims_f_receipt_header_id=RD.hims_f_receipt_header_id     
          inner join hims_f_patient P on BH.patient_id=P.hims_d_patient_id            
          inner join hims_f_patient_visit V on BH.visit_id=V.hims_f_patient_visit_id
          inner join hims_d_sub_department SD on V.sub_department_id=SD.hims_d_sub_department_id        
          inner join hims_d_employee E on V.doctor_id=E.hims_d_employee_id           
          where date(bill_date)  between date(?) and date(?) and RH.pay_type='R' and
          RH.record_status='A'    and RD.record_status='A'  and BH.hospital_id= ?  ${str}) as A
          group by hims_f_receipt_header_id`;

          break;

        case "AD":
          qry = ` select pay_type,amount,patient_code,full_name ,receipt_date,receipt_number,
          sum(cash) as cash ,sum(card) as card,sum(cheque) as cheque,sum(amount)as total
          from   (select PA.hims_f_patient_id,PA.hims_f_receipt_header_id,PA.transaction_type,
          RH.receipt_number,  receipt_date, RD.pay_type,RD.amount,P.patient_code,P.full_name ,
          case RD.pay_type when 'CA' then RD.amount else '0.00' end as cash,
          case RD.pay_type when 'CD' then RD.amount else '0.00' end as card,
          case RD.pay_type when 'CH' then RD.amount else '0.00' end as cheque
          from hims_f_patient_advance PA 
          inner join hims_f_receipt_header RH on PA.hims_f_receipt_header_id=RH.hims_f_receipt_header_id
          inner join hims_f_receipt_details RD  on RH.hims_f_receipt_header_id=RD.hims_f_receipt_header_id 
          inner join hims_f_patient P on PA.hims_f_patient_id=P.hims_d_patient_id
          where PA.transaction_type='AD' and date(receipt_date) between date(?) and date(?)  
          and PA.hospital_id=? and RH.record_status='A'  and RD.record_status='A')  as A
          group by hims_f_receipt_header_id`;

          break;

        //     case "POS":
        //       qry =
        //         "select PH.receipt_header_id,PH.patient_id,PH.patient_name,PH.referal_doctor,visit_id,date(pos_date) as pos_date ,\
        // RH.receipt_number,RH.pay_type, date(RH.receipt_date)as receipt_date, RD.hims_f_receipt_details_id,RD.pay_type,RD.amount,\
        // P.patient_code,P.full_name ,V.hims_f_patient_visit_id,SD.sub_department_code,\
        // SD.sub_department_name,E.employee_code,E.full_name as doctor_name from \
        // hims_f_pharmacy_pos_header PH inner join hims_f_receipt_header RH on PH.receipt_header_id=RH.hims_f_receipt_header_id\
        // inner join hims_f_receipt_details RD  on RH.hims_f_receipt_header_id=RD.hims_f_receipt_header_id \
        // left join hims_f_patient P on PH.patient_id=P.hims_d_patient_id\
        // left join hims_f_patient_visit V on PH.visit_id=V.hims_f_patient_visit_id\
        // left join hims_d_sub_department SD on V.sub_department_id=SD.hims_d_sub_department_id\
        // left join hims_d_employee E on V.doctor_id=E.hims_d_employee_id\
        // where date(pos_date) between date(?) and date(?) and RH.pay_type='R' and\
        //  RH.record_status='A'  and RD.record_status='A'";

        //       if (input.hospital_id > 0) {
        //         str += ` and PH.hospital_id= ${input.hospital_id}`;
        //       }
        //       if (input.sub_department_id > 0) {
        //         str += ` and V.sub_department_id= ${input.sub_department_id}`;
        //       }
        //       if (input.provider_id > 0) {
        //         str += ` and V.doctor_id= ${input.provider_id}`;
        //       }

        //       break;

        case "OPC":
          qry = `select credit_number,receipt_number,receipt_date,pay_type,amount,patient_code ,full_name 
         ,sum(cash) as cash ,sum(card) as card,sum(cheque) as cheque,sum(amount)as total
         from ( select C.credit_number,C.patient_id ,RH.hims_f_receipt_header_id,RH.receipt_number,  receipt_date,
         RD.hims_f_receipt_details_id,RD.pay_type,RD.amount,P.patient_code,P.full_name ,
         case RD.pay_type when 'CA' then RD.amount else '0.00' end as cash,
         case RD.pay_type when 'CD' then RD.amount else '0.00' end as card,
         case RD.pay_type when 'CH' then RD.amount else '0.00' end as cheque
         from hims_f_credit_header C inner join hims_f_receipt_header RH on C.reciept_header_id=RH.hims_f_receipt_header_id
         inner join hims_f_receipt_details RD  on RH.hims_f_receipt_header_id=RD.hims_f_receipt_header_id 
         inner join hims_f_patient P on C.patient_id=P.hims_d_patient_id where  RH.pay_type='R'and 
         date(receipt_date)   between date(?) and date(?) and C.hospital_id=? and RH.record_status='A' 
         and RD.record_status='A') as A group by hims_f_receipt_header_id`;

          break;
        // case "POSC":
        //   qry =
        //     "select  PC.patient_id ,PC.reciept_header_id,\
        //   RH.hims_f_receipt_header_id,RH.receipt_number,RH.pay_type, date(receipt_date)as receipt_date,\
        //   RD.hims_f_receipt_details_id,RD.pay_type,RD.amount,P.patient_code,P.full_name \
        //   from hims_f_pos_credit_header PC inner join hims_f_receipt_header RH on PC.reciept_header_id=RH.hims_f_receipt_header_id\
        //   inner join hims_f_receipt_details RD  on RH.hims_f_receipt_header_id=RD.hims_f_receipt_header_id \
        //   inner join hims_f_patient P on PC.patient_id=P.hims_d_patient_id where  RH.pay_type='R'and \
        //   date(receipt_date) between date(?) and date(?) and RH.record_status='A'  and RD.record_status='A' ";

        //   if (input.hospital_id > 0) {
        //     str += ` and PC.hospital_id= ${input.hospital_id}`;
        //   }
        //   break;
      }

      options.mysql
        .executeQuery({
          query: qry,
          values: [input.from_date, input.to_date, input.hospital_id],
          printQuery: true
        })
        .then(results => {
          //  utilities.logger().log("result: ", results);

          const total_cash = _.chain(results)

            .sumBy(s => parseFloat(s.cash))
            .value()
            .toFixed(decimal_places);

          const total_card = _.chain(results)

            .sumBy(s => parseFloat(s.card))
            .value()
            .toFixed(decimal_places);

          const total_check = _.chain(results)

            .sumBy(s => parseFloat(s.cheque))
            .value()
            .toFixed(decimal_places);
          const total_collection = parseFloat(
            parseFloat(total_cash) +
              parseFloat(total_card) +
              parseFloat(total_check)
          ).toFixed(decimal_places);

          // utilities.logger().log("result: ", {
          //   total_cash: total_cash,
          //   total_card: total_card,
          //   total_check: total_check,
          //   total_collection: total_collection
          // });

          resolve({
            details: results,
            total_cash: total_cash,
            total_card: total_card,
            total_check: total_check,
            total_collection: total_collection
          });
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
