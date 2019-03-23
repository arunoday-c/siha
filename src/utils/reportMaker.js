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
          "select HH.daily_handover_date,\
          sum(expected_cash+expected_card+expected_cheque) as expected_total ,\
          sum(actual_cash+actual_card+actual_cheque) as collected_total\
          from hims_f_cash_handover_header HH inner join\
          hims_f_cash_handover_detail HD on HH.hims_f_cash_handover_header_id=HD.cash_handover_header_id\
          where HH.record_status='A' and HD.record_status='A' and  date(daily_handover_date) between date(?)\
          and date(?) group by HH.daily_handover_date",

        questionOrder: ["from_date", "to_date"]
      },
      {
        reportName: "subDepartmentIncome",
        reportQuery:
          " select S.sub_department_id,SD.sub_department_code,SD.sub_department_name ,sum(BD.net_amout) as total_amount\
          from hims_f_billing_header BH inner join hims_f_billing_details BD on \
          BH.hims_f_billing_header_id=BD.hims_f_billing_header_id inner join hims_d_services S on\
          BD.services_id = S.hims_d_services_id and S.record_status='A'   inner join hims_d_sub_department SD on\
          S.sub_department_id=SD.hims_d_sub_department_id where    date(bill_date)   between    date(?)\
          and  date(?) and   BH.record_status='A'  and BD.record_status='A'  group by S.sub_department_id",

        questionOrder: ["from_date", "to_date"]
      },
      {
        reportName: "leaveReport",
        reportQuery:
          "select hims_f_leave_application_id, leave_application_code,employee_id, leave_id ,\
          from_date,to_date,total_applied_days,`status` ,L.leave_code,L.leave_description,L.leave_type,\
          E.employee_code,full_name as employee_name,E.sex,E.employee_status,\
          SD.sub_department_code,SD.sub_department_name\
          FROM hims_f_leave_application LA inner join  hims_d_leave L on LA.leave_id=L.hims_d_leave_id\
          inner join hims_d_employee E  on LA.employee_id=E.hims_d_employee_id\
          inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
          where((from_date>= ? and from_date <= ?) or (to_date >= ? and to_date <= ?) or (from_date <= ? and to_date >= ?))",
        questionOrder: [
          "from_date",
          "to_date",
          "from_date",
          "to_date",
          "from_date",
          "to_date"
        ]
      },
      {
        reportName: "employeeDetails",
        reportQuery:
          "select E.employee_code,full_name as employee_name,E.sex,E.date_of_joining,E.employee_status,\
          D.designation_code,D.designation,SD.sub_department_code,SD.sub_department_name\
          FROM hims_d_employee E  left join hims_d_designation D on E.employee_designation_id=D.hims_d_designation_id\
          left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id",
        questionOrder: []
      },
      {
        reportName: "salaryStatement",
        reportQuery:
          "select employee_id,S.total_earnings,S.total_deductions,S.total_contributions,\
        S.net_salary,S.advance_due,S.loan_due_amount,E.employee_code,full_name as employee_name,\
        E.mode_of_payment,SD.sub_department_code,SD.sub_department_name\
        from hims_f_salary S inner join  hims_d_employee E  on S.employee_id=E.hims_d_employee_id\
        left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
        WHERE month=? and year=?",
        questionOrder: ["month", "year"]
      },
      {
        reportName: "absentReport",
        reportQuery:
          "select  hims_f_absent_id,employee_id,absent_date,from_session,to_session,absent_reason,\
          absent_duration,cancel,cancel_reason,cancel_by,cancel_date,E.employee_code,E.full_name as employee_name,\
          SD.sub_department_code,SD.sub_department_name from hims_f_absent AB inner join hims_d_employee E on \
          AB.employee_id=E.hims_d_employee_id inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
          where date(absent_date) between date(?) and date(?)",
        questionOrder: ["from_date", "to_date"]
      },
      {
        reportName: "loanApplication",
        reportQuery:
          "select loan_application_number,employee_id,loan_id,application_reason,loan_application_date,\
          loan_authorized,loan_closed,loan_amount,approved_amount,start_month,start_year,loan_tenure,\
          pending_tenure,installment_amount,pending_loan,loan_dispatch_from,E.employee_code,E.full_name as employee_name,\
          SD.sub_department_code,SD.sub_department_name from hims_f_loan_application LA inner join  hims_d_employee E on \
           LA.employee_id=E.hims_d_employee_id inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
           where date(loan_application_date) between date(?) and date(?)",
        questionOrder: ["from_date", "to_date"]
      },
      {
        reportName: "opBillReceipt",
        reportQuery:
          "select hims_f_billing_header_id,BH.patient_id,BH.visit_id ,BH.incharge_or_provider ,date(bill_date) as bill_date,\
          RH.hims_f_receipt_header_id, RH.receipt_number,RH.pay_type ,RD.hims_f_receipt_details_id,RD.pay_type,RD.amount,\
          P.patient_code,P.full_name,V.hims_f_patient_visit_id,SD.sub_department_code,SD.sub_department_name,\
          E.employee_code,E.full_name as doctor_name from  hims_f_billing_header BH\
          inner join hims_f_receipt_header RH on BH.receipt_header_id=RH.hims_f_receipt_header_id\
          inner join hims_f_receipt_details RD  on RH.hims_f_receipt_header_id=RD.hims_f_receipt_header_id \
          inner join hims_f_patient P on BH.patient_id=P.hims_d_patient_id\
          inner join hims_f_patient_visit V on BH.visit_id=V.hims_f_patient_visit_id\
          inner join hims_d_sub_department SD on V.sub_department_id=SD.hims_d_sub_department_id\
          inner join hims_d_employee E on V.doctor_id=E.hims_d_employee_id\
          where date(bill_date)  between date(?) and date(?) and RH.pay_type='R' and RH.record_status='A'\
          and RD.record_status='A' ",
        questionOrder: ["from_date", "to_date"]
      },
      {
        reportName: "posReceipt",
        reportQuery:
          "select PH.receipt_header_id,PH.patient_id,PH.patient_name,PH.referal_doctor,visit_id,date(pos_date) as pos_date ,\
          RH.hims_f_receipt_header_id,RH.receipt_number,RH.pay_type, RD.hims_f_receipt_details_id,RD.pay_type,RD.amount,\
          P.patient_code,P.full_name,V.hims_f_patient_visit_id,SD.sub_department_code,\
          SD.sub_department_name,E.employee_code,E.full_name as doctor_name from \
          hims_f_pharmacy_pos_header PH inner join hims_f_receipt_header RH on PH.receipt_header_id=RH.hims_f_receipt_header_id\
          inner join hims_f_receipt_details RD  on RH.hims_f_receipt_header_id=RD.hims_f_receipt_header_id \
          left join hims_f_patient P on PH.patient_id=P.hims_d_patient_id\
          left join hims_f_patient_visit V on PH.visit_id=V.hims_f_patient_visit_id\
          left join hims_d_sub_department SD on V.sub_department_id=SD.hims_d_sub_department_id\
          left join hims_d_employee E on V.doctor_id=E.hims_d_employee_id\
          where date(pos_date) between date(?) and date(?) and RH.pay_type='R' and\
           RH.record_status='A'  and RD.record_status='A'",
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
