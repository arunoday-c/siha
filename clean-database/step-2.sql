-- Replace database name
use algaeh_clean_db;

set @Org_name ='CHANGE THIS NAME'; 
set @Org_business_registration_number='00000'; 
set @Hosp_name ='CHANGE THIS NAME';
-- insert default access to api's
 INSERT INTO algaeh_d_api_auth (`algaeh_d_api_auth_id`,`username`,`password`,`created_date`,`created_by`,`updated_date`,`updated_by`)
 VALUES('1','devteam',md5('devteam'),now(),'algaeh',now(),'algaeh');

-- Organization Insert
INSERT INTO hims_d_organization(`hims_d_organization_id`,`product_type`,`organization_code`,`organization_name`,`business_registration_number`,`legal_name`,
`fiscal_period`,`fiscal_quarters`,`tax_number`,`phone1`,`country_id`,`city_id`)
VALUES('1','HIMS_CLINICAL','ORG0001',@Org_name,@Org_business_registration_number,@Org_name,'12','1','0000','0000',1,93);

-- Hospital Insert 
INSERT INTO hims_d_hospital(`hims_d_hospital_id`,`hospital_code`,`product_type`,`hospital_name`,`organization_id`,`algaeh_api_auth_id`)
VALUES('1','HOSP0001','HIMS_CLINICAL',@Hosp_name,1,1);

-- Employee Master Insert
INSERT INTO hims_d_employee(hims_d_employee_id, employee_code, title_id, biometric_id, full_name, arabic_name, employee_designation_id, user_id, sex, religion_id, marital_status, date_of_birth, date_of_joining, date_of_resignation, reliving_date, notice_period, exit_date, employe_exit_type, appointment_type, employee_type, present_address, present_address2, present_pincode, present_city_id, present_state_id, present_country_id, permanent_address, permanent_address2, permanent_pincode, permanent_city_id, permanent_state_id, permanent_country_id, primary_contact_no, secondary_contact_no, email, work_email, nationality, emergency_contact_person, emergency_contact_no, blood_group, isdoctor, license_number, employee_status, inactive_date, exclude_machine_data, company_bank_id, employee_bank_id, employee_bank_name, employee_bank_ifsc_code, employee_account_number, mode_of_payment, accomodation_provided, late_coming_rule, leave_salary_process, pf_applicable, airfare_process, entitled_daily_ot, suspend_salary, last_salary_process_date, gratuity_applicable, contract_type, employee_group_id, weekoff_from, overtime_group_id, reporting_to_id, sub_department_id, hospital_id, gross_salary, yearly_gross_salary, total_earnings, total_deductions, total_contributions, net_salary, cost_to_company, settled, final_settled_id, effective_start_date, effective_end_date, services_id, employee_category, gratuity_encash, identity_type_id, identity_no, eos_id, agency_id, service_dis_percentage, created_date, created_by, updated_date, updated_by, record_status)
VALUES('1', 'ALGAEH0001', '1', NULL, 'Algaeh Admin', 'Algaeh Admin', NULL, '1', 'MALE', NULL, 'S', '2019-01-01', '3019-01-01', NULL, NULL, NULL, NULL, NULL, 'A', 'PE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '966505944170', NULL, 'we@algaeh.com', NULL, '1', NULL, NULL, NULL, 'N', '000', 'A', NULL, 'N', NULL, NULL, NULL, 'SAB-12345', '3475638465333123', 'TRF', 'N', 'N', 'Y', 'N', 'N', 'Y', 'N', NULL, 'N', 'U', NULL, 'STD', NULL, NULL, NULL, '1', '0.000', NULL, '0.000', '0.000', '0.000', '0.000', '0.000', 'N', NULL, '1900-01-01', '9999-12-31', NULL, 'A', '0.000', NULL, NULL, NULL, NULL, '0.000',now(), NULL, now(), NULL, 'I');

-- APP User Insert 
INSERT INTO algaeh_d_app_user(algaeh_d_app_user_id,username,user_display_name,employee_id,`locked`,user_status,user_type,created_by,updated_by)
VALUES('1','algaeh','Algaeh','1','N','A','SU','1','1');

-- App User Password Insert
INSERT INTO algaeh_d_app_password(algaeh_d_app_password_id,userid,`password`,change_password,created_by,updated_by)
VALUES('1','1',md5('12345'),'N','1','1');

-- App User Mapping Insert
INSERT INTO hims_m_user_employee(hims_m_user_employee_id, employee_id, user_id, hospital_id, login_user, created_by, created_date, updated_by, updated_date, record_status)
values('1', '1', '1', '1', 'Y', '1', now(), '1', now(), 'A');

-- Group Insertion
INSERT INTO algaeh_d_app_group(algaeh_d_app_group_id, app_group_code, app_group_name, app_group_desc, group_type, app_group_status, created_by, updated_by)
VALUES('1', 'GRP0000001', 'superuser', 'Super User', 'SU', 'A', '1', '1'); 

-- Role Insertion
INSERT INTO algaeh_d_app_roles(app_d_app_roles_id,app_group_id,role_code,role_name,role_discreption,
role_type,loan_authorize_privilege,leave_authorize_privilege,edit_monthly_attendance,created_by,updated_by,
finance_authorize_privilege)
values('1','1','ROLE0001','Super','Super User','SU','6','6','Y','1','1','2');

-- Roule User Mapping
INSERT INTO algaeh_m_role_user_mappings(algaeh_m_role_user_mappings_id,user_id,role_id,created_by,updated_by)
VALUES('1','1','1','1','1');

-- NumGen Insert
INSERT INTO hims_f_app_numgen(hims_f_app_numgen_id, numgen_code, module_desc, prefix, intermediate_series, postfix, `length`, increment_by, numgen_seperator, postfix_start, postfix_end, current_num, pervious_num, preceding_zeros_req, intermediate_series_req, reset_slno_on_year_change, created_by, created_date, updated_by, updated_date, record_status)
VALUES('1', 'PAT_REGS', 'PAT_REGS', 'PAT', 'A', '0000000', '10', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('2', 'PAT_VISIT', 'PAT_VISIT', 'VIS', 'A', '0000000', '10', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1',now(), 'A'),
('3', 'PAT_BILL', 'PAT_BILL', 'BILL', 'A', '0000000', '10', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('4', 'RECEIPT', 'RECEIPT', 'RCPT', 'A', '0000000', '10', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('5', 'IDEN_DOC', 'IDEN_DOC', 'IDDOC', 'A', '0000000', '10', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('6', 'REFUND', 'REFUND', 'PYMNT', 'A', '0000000', '10', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('7', 'OP_CBIL', 'OP_CBIL', 'OPC', 'A', '0000000', '10', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('8', 'OP_CRD', 'OP_CRD', 'OCR', 'A', '0000000', '10', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A');

-- inventory Numgen
INSERT INTO hims_f_inventory_numgen(hims_f_inventory_numgen_id, numgen_code, module_desc, prefix, intermediate_series, postfix, `length`, increment_by, numgen_seperator, postfix_start, postfix_end, current_num, pervious_num, preceding_zeros_req, intermediate_series_req, reset_slno_on_year_change, created_by, created_date, updated_by, updated_date, record_status)
VALUES('1', 'INV_NUM', 'INV_NUM', 'INV', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('2', 'INV_STK_DOC', 'INV_STK_DOC', 'IND', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('3', 'INV_REQ_NUM', 'INV_REQ_NUM', 'IRQ', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('4', 'INV_TRN_NUM', 'INV_TRN_NUM', 'ITR', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('5', 'INV_CONS_NUM', 'INV_CONS_NUM', 'CON', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('6', 'INV_STK_ADJ', 'INV_STK_ADJ', 'IAD', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A');

-- Pharmacy Numgen
INSERT INTO hims_f_pharmacy_numgen(hims_f_pharmacy_numgen_id, numgen_code, module_desc, prefix, intermediate_series, postfix, `length`, increment_by, numgen_seperator, postfix_start, postfix_end, current_num, pervious_num, preceding_zeros_req, intermediate_series_req, reset_slno_on_year_change, created_by, created_date, updated_by, updated_date, record_status)
VALUES('1', 'STK_DOC', 'STK_DOC', 'DOC', DATE_FORMAT(now(),'%y'), '2', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1',now(), 'A'),
('2', 'POS_NUM', 'POS_NUM', 'POS',  DATE_FORMAT(now(),'%y'), '0000000', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('3', 'REQ_NUM', 'REQ_NUM', 'REQ', DATE_FORMAT(now(),'%y'), '0000000', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('4', 'POS_RET_NUM', 'POS_RET_NUM', 'RET', DATE_FORMAT(now(),'%y'), '0000000', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1',now(), 'A'),
('5', 'TRAN_NUM', 'TRAN_NUM', 'TRN', DATE_FORMAT(now(),'%y'), '0000000', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('6', 'POS_CRD', 'POS_CRD', 'PCR',  DATE_FORMAT(now(),'%y'), '0000000', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1',now(), 'A'),
('7', 'PHR_CONS_NUM', 'PHR_CONS_NUM', 'PCN',DATE_FORMAT(now(),'%y'), '0000000', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1',now(), '1', now(), 'A'),
('8', 'STK_ADJ', 'STK_ADJ', 'ADJ', DATE_FORMAT(now(),'%y'), '0000000', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A');

-- Procurement Numgen
INSERT INTO hims_f_procurement_numgen (hims_f_procurement_numgen_id, numgen_code, module_desc, prefix, intermediate_series, postfix, `length`, increment_by, numgen_seperator, postfix_start, postfix_end, current_num, pervious_num, preceding_zeros_req, intermediate_series_req, reset_slno_on_year_change, created_by, created_date, updated_by, updated_date, record_status)
VALUES('1', 'PO_NUM', 'PO_NUM', 'PON', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('2', 'DN_NUM', 'DN_NUM', 'DNN', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('3', 'RE_NUM', 'RE_NUM', 'REE', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('4', 'PO_RETURN_NUM', 'PO_RETURN_NUM', 'POR', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('5', 'REQ_QUT_NUM', 'REQ_QUT_NUM', 'RQU', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('6', 'VEN_QUT_NUM', 'VEN_QUT_NUM', 'VQU', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1',now(), 'A');

-- Sales Numgen
INSERT INTO hims_f_sales_numgen (hims_f_sales_numgen_id, numgen_code, module_desc, prefix, intermediate_series, postfix, `length`, increment_by, numgen_seperator, postfix_start, postfix_end, current_num, pervious_num, preceding_zeros_req, intermediate_series_req, reset_slno_on_year_change, created_by, created_date, updated_by, updated_date, record_status)
VALUES('1', 'SALES_QUOTE', 'SALES_QUOTE', 'SAQ',  DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('2', 'SALES_ORDER', 'SALES_ORDER', 'SAO',  DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1',now(), 'A'),
('3', 'SALES_DISPATCH', 'SALES_DISPATCH', 'SAD', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1',now(), 'A'),
('4', 'SALES_INVOICE', 'SALES_INVOICE', 'SIN', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('5', 'SALES_RETURN', 'SALES_RETURN', 'SRE', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('6', 'CONTRACT_MANAGEMENT', 'CONTRACT_MANAGEMENT', 'CON', '20', '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1',now(), '1', now(), 'A');

-- HRPayroll Numgen
INSERT INTO hims_f_hrpayroll_numgen(hims_f_hrpayroll_numgen_id, numgen_code, module_desc, prefix, intermediate_series, postfix,`length`, increment_by, numgen_seperator, postfix_start, postfix_end, current_num, pervious_num, preceding_zeros_req, intermediate_series_req, reset_slno_on_year_change, created_by, created_date, updated_by, updated_date, record_status)
VALUES('1', 'EMPLOYEE_LEAVE', 'EMPLOYEE_LEAVE', 'LEAVE', 'A', '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('2','EMPLOYEE_LOAN','EMPLOYEE_LOAN','LOAN','A','0','13','1','-','0','9999999','0000000','0000000','Y','Y','Y','1',now(),'1',now(),'A'),
('3','EMPLOYEE_ADVANCE','EMPLOYEE_ADVANCE','ADV','A','0','13','1','-','0','9999999','0000000','0000000','Y','Y','Y','1',now(),'1',now(),'A'),
('4','ATTENDANCE_REGULARIZE','ATTENDANCE_REGULARIZE','ATREG','A','0','13','1','-','0','9999999','0000000','0000000','Y','Y','Y','1',now(),'1',now(),'A'),
('5','EMPLOYEE_PAYMENT','EMPLOYEE_PAYMENT','EPY','A','0','13','1','-','0','9999999','0000000','0000000','Y','Y','Y','1',now(),'1',now(),'A'),
('6','LEAVE_ENCASH','LEAVE_ENCASH','LEN','A','0','13','1','-','0','9999999','0000000','0000000','Y','Y','Y','1',now(),'1',now(),'A'),
('7','END_OF_SERVICE_NO','END_OF_SERVICE_NO','EOS','A','0','13','1','-','0','9999999','0000000','0000000','Y','Y','Y','1',now(),'1',now(),'A'),
('9','LEAVE_SALARY','LEAVE_SALARY','LES','A','0','13','1','-','0','9999999','0000000','0000000','Y','Y','Y','1',now(),'1',now(),'A'),
('10','LEAVE_ACCRUAL','LEAVE_ACCRUAL','LAU','A','0','13','1','-','0','9999999','0000000','0000000','Y','Y','Y','1',now(),'1',now(),'A');

-- Finance Numgen
INSERT INTO finance_numgen(finance_numgen_id, numgen_code, module_desc, prefix, intermediate_series, postfix, `length`, increment_by, numgen_seperator, postfix_start, postfix_end, current_num, pervious_num, preceding_zeros_req, intermediate_series_req, reset_slno_on_year_change, created_by, created_date, updated_by, updated_date, record_status)
VALUES ('1', 'JOURNAL', 'for finance journal voucher number', 'JOV', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1',now(), 'A'),
('2', 'SALES', 'for finance sales voucher number', 'SAL', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'N', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('3', 'RECEIPT', 'for finance receipt voucher number', 'REC', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('4', 'PAYMENT', 'for finance payment voucher number', 'PAY', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('5', 'PURCHASE', 'for finance purchase voucher number', 'PUR', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('6', 'CONTRA', 'for finance contra voucher number', 'CON', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('7', 'CREDIT_NOTE', 'for finance credit note voucher number', 'CNT', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A'),
('8', 'DEBIT_NOTE', 'for finance debit note voucher number', 'DNT', DATE_FORMAT(now(),'%y'), '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', now(), '1', now(), 'A');








 








