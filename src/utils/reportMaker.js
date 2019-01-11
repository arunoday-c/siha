import { LINQ } from "node-linq";

let algaehReportConfig = reportName => {
  let queries = {
    allQueries: [
      {
        reportName: "patientData",
        reportQuery:
          "select hims_f_patient_appointment_id, patient_id, patient_code, provider_id, sub_department_id, number_of_slot,\
          appointment_date, appointment_from_time, appointment_to_time, appointment_status_id, patient_name, arabic_name, \
          date_of_birth, age, contact_number, email, send_to_provider, gender, confirmed, confirmed_by, comfirmed_date, \
          cancelled, cancelled_by, cancelled_date, cancel_reason, appointment_remarks, visit_created, is_stand_by\
          from hims_f_patient_appointment where record_status='A' ",
        orderBy: "hims_f_patient_appointment_id desc"
      },
      {
        reportName: "OPBillSummary",
        reportQuery:
          "select BH.hims_f_billing_header_id,BH.bill_date,BD.hims_f_billing_details_id,BD.service_type_id, \
        ST.service_type_code,ST.service_type, sum(BD.net_amout)as total_amount \
        from hims_f_billing_header BH inner join hims_f_billing_details BD on  \
        BH.hims_f_billing_header_id=BD.hims_f_billing_header_id inner join hims_d_service_type ST on \
        BD.service_type_id=ST.hims_d_service_type_id and ST.record_status='A' \
        where BH.record_status='A' and BD.record_status='A' and date(BH.bill_date) \
         between date(?) and date(?)  group by BD.service_type_id",
        questionOrder: ["from_date", "to_date"]
      },

      {
        reportName: "OPBillDetails",
        reportQuery:
          "select BH.bill_date,BH.hims_f_billing_header_id,BH.bill_number,BD.services_id,sum(BD.net_amout) as total_amount,\
  ST.service_type_code,ST.service_type,S.service_code,S.service_name\
   from hims_f_billing_header BH inner join hims_f_billing_details BD on\
   BH.hims_f_billing_header_id=BD.hims_f_billing_header_id  inner join hims_d_service_type ST\
   on BD.service_type_id=ST.hims_d_service_type_id and ST.record_status='A'\
   inner join hims_d_services S on  BD.services_id = S.hims_d_services_id and S.record_status='A'\
   where    date(bill_date)   between    date(?) and  date(?) and  BD.service_type_id=?\
   and   BH.record_status='A'  and BD.record_status='A'  group by BD.services_id ",

        questionOrder: ["from_date", "to_date", "service_type_id"]
      },

      {
        reportName: "staffCashCollection",
        reportQuery:
          "select HH.hims_f_cash_handover_header_id,HH.shift_id,HH.daily_handover_date,\
          hims_f_cash_handover_detail_id,\
          sum(expected_cash+expected_card+expected_cheque) as expected_total ,\
          sum(actual_cash+actual_card+actual_cheque) as collected_total\
          from hims_f_cash_handover_header HH inner join\
          hims_f_cash_handover_detail HD on HH.hims_f_cash_handover_header_id=HD.cash_handover_header_id\
          where HH.record_status='A' and HD.record_status='A' and  date(daily_handover_date) between date(?)\
          and date(?) group by HH.daily_handover_date",

        questionOrder: ["from_date", "to_date"]
      }
    ]
  };

  let row = new LINQ(queries.allQueries)
    .Where(
      w =>
        String(w.reportName).toUpperCase() === String(reportName).toUpperCase()
    )
    .FirstOrDefault();
  return row;
};

module.exports = {
  algaehReportConfig
};
