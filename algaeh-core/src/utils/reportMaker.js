import { LINQ } from 'node-linq';

let algaehReportConfig = (reportName) => {
	let queries = {
		allQueries: [
			{
				reportName: 'patientData',
				reportQuery:
					"select hims_f_patient_appointment_id, patient_id, patient_code, provider_id, sub_department_id, number_of_slot,\
          appointment_date, appointment_from_time, appointment_to_time, appointment_status_id, patient_name, arabic_name, \
          date_of_birth, age, contact_number, email, send_to_provider, gender, confirmed, confirmed_by, comfirmed_date, \
          cancelled, cancelled_by, cancelled_date, cancel_reason, appointment_remarks, visit_created, is_stand_by\
          from hims_f_patient_appointment where record_status='A' ",
				orderBy: 'hims_f_patient_appointment_id desc'
			},
			{
				reportName: 'OPBillSummary',
				reportQuery:
					"select BH.hims_f_billing_header_id,BH.bill_date,BD.hims_f_billing_details_id,BD.service_type_id, \
        ST.service_type_code,ST.service_type, sum(BD.net_amout)as total_amount \
        from hims_f_billing_header BH inner join hims_f_billing_details BD on  \
        BH.hims_f_billing_header_id=BD.hims_f_billing_header_id inner join hims_d_service_type ST on \
        BD.service_type_id=ST.hims_d_service_type_id and ST.record_status='A' \
        where BH.record_status='A' and BD.record_status='A' and date(BH.bill_date) \
         between date(?) and date(?)  group by BD.service_type_id",
				questionOrder: [ 'from_date', 'to_date' ]
			},

			{
				reportName: 'OPBillDetails',
				reportQuery:
					"select BH.bill_date,BH.hims_f_billing_header_id,BH.bill_number,BD.services_id,sum(BD.net_amout) as total_amount,\
          ST.service_type_code,ST.service_type,S.service_code,S.service_name\
          from hims_f_billing_header BH inner join hims_f_billing_details BD on\
          BH.hims_f_billing_header_id=BD.hims_f_billing_header_id  inner join hims_d_service_type ST\
          on BD.service_type_id=ST.hims_d_service_type_id and ST.record_status='A'\
          inner join hims_d_services S on  BD.services_id = S.hims_d_services_id and S.record_status='A'\
          where    date(bill_date)   between    date(?) and  date(?) and  BD.service_type_id=?\
          and   BH.record_status='A'  and BD.record_status='A'  group by BD.services_id ",
				questionOrder: [ 'from_date', 'to_date', 'service_type_id' ]
			},

			{
				reportName: 'staffCashCollection',
				reportQuery:
					"select HH.daily_handover_date,\
          sum(expected_cash+expected_card+expected_cheque) as expected_total ,\
          sum(actual_cash+actual_card+actual_cheque) as collected_total\
          from hims_f_cash_handover_header HH inner join\
          hims_f_cash_handover_detail HD on HH.hims_f_cash_handover_header_id=HD.cash_handover_header_id\
          where HH.record_status='A' and HD.record_status='A' and  date(daily_handover_date) between date(?)\
          and date(?) group by HH.daily_handover_date",

				questionOrder: [ 'from_date', 'to_date' ]
			},
			{
				reportName: 'subDepartmentIncome',
				reportQuery:
					"select S.sub_department_id,SD.sub_department_code,SD.sub_department_name ,sum(BD.net_amout) as total_amount from hims_f_billing_header BH inner join hims_f_billing_details BD on BH.hims_f_billing_header_id=BD.hims_f_billing_header_id inner join hims_d_services S on BD.services_id = S.hims_d_services_id and S.record_status='A'   inner join hims_d_sub_department SD on S.sub_department_id=SD.hims_d_sub_department_id where date(bill_date) between    date(?) and  date(?) and   BH.record_status='A'  and BD.record_status='A'  group by S.sub_department_id",

				questionOrder: [ 'from_date', 'to_date' ]
			},
			{
				reportName: 'leaveReport',
				reportQuery:
					'select hims_f_leave_application_id, leave_application_code,employee_id, leave_id ,\
          from_date,to_date,total_applied_days,`status` ,L.leave_code,L.leave_description,L.leave_type,\
          E.employee_code,full_name as employee_name,E.sex,E.employee_status,\
          SD.sub_department_code,SD.sub_department_name\
          FROM hims_f_leave_application LA inner join  hims_d_leave L on LA.leave_id=L.hims_d_leave_id\
          inner join hims_d_employee E  on LA.employee_id=E.hims_d_employee_id\
          inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
          where((from_date>= ? and from_date <= ?) or (to_date >= ? and to_date <= ?) or (from_date <= ? and to_date >= ?))',
				questionOrder: [ 'from_date', 'to_date', 'from_date', 'to_date', 'from_date', 'to_date' ]
			},
			{
				reportName: 'employeeDetails',
				reportQuery:
					'select E.employee_code,full_name as employee_name,E.sex,E.date_of_joining,E.employee_status,\
          D.designation_code,D.designation,SD.sub_department_code,SD.sub_department_name\
          FROM hims_d_employee E  left join hims_d_designation D on E.employee_designation_id=D.hims_d_designation_id\
          left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id',
				questionOrder: []
			},
			{
				reportName: 'salaryStatement',
				reportQuery:
					'select employee_id,S.total_earnings,S.total_deductions,S.total_contributions,\
        S.net_salary,S.advance_due,S.loan_due_amount,E.employee_code,full_name as employee_name,\
        E.mode_of_payment,SD.sub_department_code,SD.sub_department_name,NA.nationality,HO.hospital_name\
        from hims_f_salary S inner join  hims_d_employee E  on S.employee_id=E.hims_d_employee_id\
        left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
        left join  hims_d_nationality NA  on E.nationality=NA.hims_d_nationality_id\
        left join  hims_d_hospital HO  on E.hospital_id=HO.hims_d_hospital_id\
        WHERE month=? and year=? and S.sub_department_id=? and E.hospital_id=?',
				questionOrder: [ 'month', 'year', 'sub_department_id', 'hospital_id' ]
			},
			{
				reportName: 'absentReport',
				reportQuery:
					'select  hims_f_absent_id,employee_id,absent_date,from_session,to_session,absent_reason,\
          absent_duration,cancel,cancel_reason,cancel_by,cancel_date,E.employee_code,E.full_name as employee_name,\
          SD.sub_department_code,SD.sub_department_name from hims_f_absent AB inner join hims_d_employee E on \
          AB.employee_id=E.hims_d_employee_id inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
          where date(absent_date) between date(?) and date(?)',
				questionOrder: [ 'from_date', 'to_date' ]
			},
			{
				reportName: 'loanApplication',
				reportQuery:
					'select loan_application_number,employee_id,loan_id,application_reason,loan_application_date,\
          loan_authorized,loan_closed,loan_amount,approved_amount,start_month,start_year,loan_tenure,\
          pending_tenure,installment_amount,pending_loan,loan_dispatch_from,E.employee_code,E.full_name as employee_name,\
          SD.sub_department_code,SD.sub_department_name from hims_f_loan_application LA inner join  hims_d_employee E on \
           LA.employee_id=E.hims_d_employee_id inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
           where date(loan_application_date) between date(?) and date(?)',
				questionOrder: [ 'from_date', 'to_date' ]
			},
			{
				reportName: 'opBillReceipt',
				reportQuery:
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
          and RD.record_status='A' ",
				questionOrder: [ 'from_date', 'to_date' ]
			},
			{
				reportName: 'posReceipt',
				reportQuery:
					"select PH.receipt_header_id,PH.patient_id,PH.patient_name,PH.referal_doctor,visit_id,date(pos_date) as pos_date ,\
          RH.receipt_number,RH.pay_type, date(RH.receipt_date)as receipt_date, RD.hims_f_receipt_details_id,RD.pay_type,RD.amount,\
          P.patient_code,P.full_name ,V.hims_f_patient_visit_id,SD.sub_department_code,\
          SD.sub_department_name,E.employee_code,E.full_name as doctor_name from \
          hims_f_pharmacy_pos_header PH inner join hims_f_receipt_header RH on PH.receipt_header_id=RH.hims_f_receipt_header_id\
          inner join hims_f_receipt_details RD  on RH.hims_f_receipt_header_id=RD.hims_f_receipt_header_id \
          left join hims_f_patient P on PH.patient_id=P.hims_d_patient_id\
          left join hims_f_patient_visit V on PH.visit_id=V.hims_f_patient_visit_id\
          left join hims_d_sub_department SD on V.sub_department_id=SD.hims_d_sub_department_id\
          left join hims_d_employee E on V.doctor_id=E.hims_d_employee_id\
          where date(pos_date) between date(?) and date(?) and RH.pay_type='R' and\
           RH.record_status='A'  and RD.record_status='A'",
				questionOrder: [ 'from_date', 'to_date' ]
			},
			{
				reportName: 'advanceReceipt',
				reportQuery:
					"select PA.hims_f_patient_id,PA.hims_f_receipt_header_id,PA.transaction_type,\
          RH.receipt_number,RH.pay_type, date(receipt_date)as receipt_date, RD.hims_f_receipt_details_id,RD.pay_type,RD.amount,\
          P.patient_code,P.full_name  from hims_f_patient_advance PA \
          inner join hims_f_receipt_header RH on PA.hims_f_receipt_header_id=RH.hims_f_receipt_header_id\
          inner join hims_f_receipt_details RD  on RH.hims_f_receipt_header_id=RD.hims_f_receipt_header_id \
          inner join hims_f_patient P on PA.hims_f_patient_id=P.hims_d_patient_id\
          where PA.transaction_type='AD' and date(receipt_date) between date(?) and date(?) \
          and RH.record_status='A'  and RD.record_status='A'",
				questionOrder: [ 'from_date', 'to_date' ]
			},
			{
				reportName: 'posCreditReceipt',
				reportQuery:
					"select  PC.patient_id ,PC.reciept_header_id,\
          RH.hims_f_receipt_header_id,RH.receipt_number,RH.pay_type, date(receipt_date)as receipt_date,\
          RD.hims_f_receipt_details_id,RD.pay_type,RD.amount,P.patient_code,P.full_name \
          from hims_f_pos_credit_header PC inner join hims_f_receipt_header RH on PC.reciept_header_id=RH.hims_f_receipt_header_id\
          inner join hims_f_receipt_details RD  on RH.hims_f_receipt_header_id=RD.hims_f_receipt_header_id \
          inner join hims_f_patient P on PC.patient_id=P.hims_d_patient_id where  RH.pay_type='R'and \
          date(receipt_date) between date(?) and date(?) and RH.record_status='A'  and RD.record_status='A' ",
				questionOrder: [ 'from_date', 'to_date' ]
			},
			{
				reportName: 'opCreditReceipt',
				reportQuery:
					"select  C.credit_number,C.patient_id ,C.reciept_header_id,\
          RH.hims_f_receipt_header_id,RH.receipt_number,RH.pay_type, date(receipt_date)as receipt_date,\
          RD.hims_f_receipt_details_id,RD.pay_type,RD.amount,P.patient_code,P.full_name \
          from hims_f_credit_header C inner join hims_f_receipt_header RH on C.reciept_header_id=RH.hims_f_receipt_header_id\
          inner join hims_f_receipt_details RD  on RH.hims_f_receipt_header_id=RD.hims_f_receipt_header_id \
          inner join hims_f_patient P on C.patient_id=P.hims_d_patient_id where  RH.pay_type='R'and \
          date(receipt_date)   between date(?) and date(?)  and RH.record_status='A'  and RD.record_status='A'",
				questionOrder: [ 'from_date', 'to_date' ]
			},
			{
				reportName: 'patOutstandingSum',
				reportQuery:
					"SELECT P.patient_code,P.full_name,P.advance_amount,P.created_date FROM hims_f_patient P, \
          hims_f_patient_advance PA where P.hims_d_patient_id = PA.hims_f_patient_id \
          and date(PA.created_date) < date(?) and P.advance_amount>0 and P.record_status='A'",
				questionOrder: [ 'till_date' ]
			},
			{
				reportName: 'leaveAccrual',
				reportQuery:
					' select hims_f_leave_salary_accrual_detail_id,employee_id,year,month,leave_days,\
          leave_salary,airfare_amount,E.employee_code,E.full_name, SD.sub_department_name \
          from hims_f_leave_salary_accrual_detail LA \
          inner join hims_d_employee E on LA.employee_id=E.hims_d_employee_id\
          left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
          where LA.year=? and LA.month=? and E.hospital_id=? and E.sub_department_id=?;',
				questionOrder: [ 'year', 'month', 'hospital_id', 'sub_department_id' ]
			},
			{
				reportName: 'gratuityProvision',
				reportQuery:
					' select hims_f_gratuity_provision_id,employee_id,gratuity_amount,E.employee_code,E.full_name, \
          SD.sub_department_name from hims_f_gratuity_provision GP \
          inner join hims_d_employee E on GP.employee_id=E.hims_d_employee_id\
          left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
          where GP.year=? and GP.month=? and E.hospital_id=? and E.sub_department_id=?;',
				questionOrder: [ 'year', 'month', 'hospital_id', 'sub_department_id' ]
			},
			{
				reportName: 'procedureExistingItem',
				reportQuery:
					" select batchno,expirydt,barcode,qtyhand,qtypo,cost_uom,avgcost,\
          last_purchase_cost,item_type,item_id,item_description,item_code from\
          hims_m_inventory_item_location L inner join hims_d_item_master IM on L.item_id=IM.hims_d_item_master_id\
          where inventory_location_id=? and item_id in (select item_id from  hims_d_procedure PH\
          inner join hims_d_procedure_detail PD on PH.hims_d_procedure_id=PD.procedure_header_id\
          where PH.service_id=? and PH.record_status='A') and L.record_status='A'  ",
				questionOrder: [ 'inventory_location_id', 'service_id' ]
			}
		]
	};

	let row = new LINQ(queries.allQueries)
		.Where((w) => String(w.reportName).toUpperCase() === String(reportName).toUpperCase())
		.FirstOrDefault();
	return row;
};

export default {
	algaehReportConfig
};
