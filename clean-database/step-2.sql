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

-- Default UoM
INSERT INTO `hims_d_inventory_uom` (`hims_d_inventory_uom_id`, `uom_description`, `uom_status`, `created_date`, `created_by`, `updated_date`, `updated_by`, `record_status`) VALUES ('1', 'Piece', 'A', now(), '1', now(), '1', 'A');
INSERT INTO `hims_d_inventory_uom` (`hims_d_inventory_uom_id`, `uom_description`, `uom_status`, `created_date`, `created_by`, `updated_date`, `updated_by`, `record_status`) VALUES ('2', 'Container', 'A', now(), '1', now(), '1', 'A');
INSERT INTO `hims_d_inventory_uom` (`hims_d_inventory_uom_id`, `uom_description`, `uom_status`, `created_date`, `created_by`, `updated_date`, `updated_by`, `record_status`) VALUES ('3', 'Packet', 'A', now(), '1', now(), '1', 'A');
INSERT INTO `hims_d_inventory_uom` (`hims_d_inventory_uom_id`, `uom_description`, `uom_status`, `created_date`, `created_by`, `updated_date`, `updated_by`, `record_status`) VALUES ('4', 'Kit', 'A', now(), '1', now(), '1', 'A');
INSERT INTO `hims_d_inventory_uom` (`hims_d_inventory_uom_id`, `uom_description`, `uom_status`, `created_date`, `created_by`, `updated_date`, `updated_by`, `record_status`) VALUES ('5', 'Box','A', now(), '1', now(), '1', 'A');
INSERT INTO `hims_d_inventory_uom` (`hims_d_inventory_uom_id`, `uom_description`, `uom_status`, `created_date`, `created_by`, `updated_date`, `updated_by`, `record_status`) VALUES ('6', 'Bottle', 'A', now(), '1', now(), '1', 'A');
INSERT INTO `hims_d_inventory_uom` (`hims_d_inventory_uom_id`, `uom_description`, `uom_status`, `created_date`, `created_by`, `updated_date`, `updated_by`, `record_status`) VALUES ('7', 'Bag', 'A', now(), '1', now(), '1', 'A');
INSERT INTO `hims_d_inventory_uom` (`hims_d_inventory_uom_id`, `uom_description`, `uom_status`, `created_date`, `created_by`, `updated_date`, `updated_by`, `record_status`) VALUES ('8', 'Roll', 'A', now(), '1', now(), '1', 'A');

-- Default Service Type
INSERT INTO `hims_d_service_type` (`hims_d_service_type_id`, `service_type_code`, `service_type`, `arabic_service_type`, `effective_start_date`, `effective_end_date`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('1', 'SERTY00001', 'Consultation', 'تشاور', null,null, '1', now(),  '1', now(),  'A');
INSERT INTO `hims_d_service_type` (`hims_d_service_type_id`, `service_type_code`, `service_type`, `arabic_service_type`, `effective_start_date`, `effective_end_date`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('2', 'SERTY00002', 'Procedure', 'إجراء', null,null, '1', now(),  '1', now(),  'A');
INSERT INTO `hims_d_service_type` (`hims_d_service_type_id`, `service_type_code`, `service_type`, `arabic_service_type`, `effective_start_date`, `effective_end_date`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('3', 'SERTY00003', 'Provider', 'مزود', null,null, '1', now(),  '1', now(),  'A');
INSERT INTO `hims_d_service_type` (`hims_d_service_type_id`, `service_type_code`, `service_type`, `arabic_service_type`, `effective_start_date`, `effective_end_date`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('4', 'SERTY00004', 'Inventory Item', 'المخزون', null,null, '1', now(),  '1', now(),  'A');
INSERT INTO `hims_d_service_type` (`hims_d_service_type_id`, `service_type_code`, `service_type`, `arabic_service_type`, `effective_start_date`, `effective_end_date`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('5', 'SERTY00005', 'Lab', 'مختبر',null,null, '1', now(),  '1', now(),  'A');
INSERT INTO `hims_d_service_type` (`hims_d_service_type_id`, `service_type_code`, `service_type`, `arabic_service_type`, `effective_start_date`, `effective_end_date`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('6', 'SERTY00006', 'Nursing Care', 'الرعاية التمريضية', null,null, '1', now(),  '1', now(),  'A');
INSERT INTO `hims_d_service_type` (`hims_d_service_type_id`, `service_type_code`, `service_type`, `arabic_service_type`, `effective_start_date`, `effective_end_date`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('7', 'SERTY00007', 'Miscellaneous', 'متنوع',null,null, '1', now(),  '1', now(),  'A');
INSERT INTO `hims_d_service_type` (`hims_d_service_type_id`, `service_type_code`, `service_type`, `arabic_service_type`, `effective_start_date`, `effective_end_date`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('8', 'SERTY00008', 'Anesthesia', 'تخدير', null,null, '1', now(),  '1', now(),  'A');
INSERT INTO `hims_d_service_type` (`hims_d_service_type_id`, `service_type_code`, `service_type`, `arabic_service_type`, `effective_start_date`, `effective_end_date`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('9', 'SERTY00009', 'Bed', 'السرير', null,null, '1', now(),  '1', now(),  'A');
INSERT INTO `hims_d_service_type` (`hims_d_service_type_id`, `service_type_code`, `service_type`, `arabic_service_type`, `effective_start_date`, `effective_end_date`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('10', 'SERTY00010', 'OT', 'OT', null,null, '1', now(),  '1', now(),  'A');
INSERT INTO `hims_d_service_type` (`hims_d_service_type_id`, `service_type_code`, `service_type`, `arabic_service_type`, `effective_start_date`, `effective_end_date`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('11', 'SERTY00011', 'Radiology',null,null, '1', now(),  '1', now(),  'A');
INSERT INTO `hims_d_service_type` (`hims_d_service_type_id`, `service_type_code`, `service_type`, `arabic_service_type`, `effective_start_date`, `effective_end_date`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('12', 'SERTY00012', 'Pharmacy', 'مقابل', null,null, '1', now(),  '1', now(),  'A');
INSERT INTO `hims_d_service_type` (`hims_d_service_type_id`, `service_type_code`, `service_type`, `arabic_service_type`, `effective_start_date`, `effective_end_date`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('13', 'SERTY00013', 'Non Service', 'غير الخدمة',null,null, '1', now(),  '1', now(),  'A');
INSERT INTO `hims_d_service_type` (`hims_d_service_type_id`, `service_type_code`, `service_type`, `arabic_service_type`, `effective_start_date`, `effective_end_date`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('14', 'SERTY00014', 'Package', 'صفقة', null,null, '1', now(),  '1', now(),  'A');
INSERT INTO `hims_d_service_type` (`hims_d_service_type_id`, `service_type_code`, `service_type`, `arabic_service_type`, `effective_start_date`, `effective_end_date`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('15', 'SERTY00015', 'Medical Services', 'الخدمات الطبية',null,null, '1', now(),  '1', now(),  'A');

-- Default Currency
INSERT INTO `hims_d_currency` (`hims_d_currency_id`, `currency_code`, `currency_description`, `currency_symbol`, `decimal_places`, `symbol_position`, `thousand_separator`, `decimal_separator`, `negative_separator`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('1', 'BHD', 'Bahrain Dinar', 'BD', '3', 'BS', '.', '.', 'TR', '1', now(), '1', now(), 'A');
INSERT INTO `hims_d_currency` (`hims_d_currency_id`, `currency_code`, `currency_description`, `currency_symbol`, `decimal_places`, `symbol_position`, `thousand_separator`, `decimal_separator`, `negative_separator`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('2', 'SAR', 'Saudi Riyal', 'SR', '3', 'BS', '.', '.', 'TR', '1', now(), '1', now(), 'A');
INSERT INTO `hims_d_currency` (`hims_d_currency_id`, `currency_code`, `currency_description`, `currency_symbol`, `decimal_places`, `symbol_position`, `thousand_separator`, `decimal_separator`, `negative_separator`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('3', 'AED', 'UAE Dirham', 'Dhs', '3', 'BS', '.', '.', 'TR', '1', now(), '1', now(), 'A');
INSERT INTO `hims_d_currency` (`hims_d_currency_id`, `currency_code`, `currency_description`, `currency_symbol`, `decimal_places`, `symbol_position`, `thousand_separator`, `decimal_separator`, `negative_separator`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('4', 'QAR', 'Qatari Riyal', 'QR', '3', 'BS', '.', '.', 'TR', '1', now(), '1', now(), 'A');
INSERT INTO `hims_d_currency` (`hims_d_currency_id`, `currency_code`, `currency_description`, `currency_symbol`, `decimal_places`, `symbol_position`, `thousand_separator`, `decimal_separator`, `negative_separator`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('5', 'KWD', 'Kuwaiti Dinar', 'KD', '3', 'BS', '.', '.', 'TR', '1', now(), '1', now(), 'A');
INSERT INTO `hims_d_currency` (`hims_d_currency_id`, `currency_code`, `currency_description`, `currency_symbol`, `decimal_places`, `symbol_position`, `thousand_separator`, `decimal_separator`, `negative_separator`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('6', 'OMR', 'Omani rRial', 'R.O.', '3', 'BS', '.', '.', 'TR', '1', now(), '1', now(), 'A');
INSERT INTO `hims_d_currency` (`hims_d_currency_id`, `currency_code`, `currency_description`, `currency_symbol`, `decimal_places`, `symbol_position`, `thousand_separator`, `decimal_separator`, `negative_separator`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('7', 'INR', 'Indian Rupee', '₹', '2', 'BS', ',', ',', 'TR', '1', now(), '1', now(), 'A');

-- Default Nationality
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `arabic_nationality`, `record_status`) VALUES ('1', 'NAT10001', 'Afghan', 'الأفغاني', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `arabic_nationality`, `record_status`) VALUES ('2', 'NAT10002', 'Angolan', 'الأنغولي', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `arabic_nationality`, `record_status`) VALUES ('3', 'NAT10003', 'Albanian', 'الألبانية', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `arabic_nationality`, `record_status`) VALUES ('4', 'NAT10004', 'Andorran', 'أندورا', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `arabic_nationality`, `record_status`) VALUES ('5', 'NAT10005', 'Emirati', 'الإماراتي', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `arabic_nationality`, `record_status`) VALUES ('6', 'NAT10006', 'Argentinian', 'الأرجنتيني', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `arabic_nationality`, `record_status`) VALUES ('7', 'NAT10007', 'Armenian', 'الأرميني', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `arabic_nationality`, `record_status`) VALUES ('8', 'NAT10008', 'Australian', 'الأسترالي', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `arabic_nationality`, `record_status`) VALUES ('9', 'NAT10009', 'Austrian', 'النمساوي', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('10', 'NAT10010', 'Azerbaijani', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('11', 'NAT10011', 'Burundian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('12', 'NAT10012', 'Belgian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('13', 'NAT10013', 'Beninese', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('14', 'NAT10014', 'Bangladeshi', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('15', 'NAT10015', 'Bulgarian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('16', 'NAT10016', 'Bahraini', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('17', 'NAT10017', 'Bahamian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('18', 'NAT10018', 'Belarusian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('19', 'NAT10019', 'Belizean', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('20', 'NAT10020', 'Bermudian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('21', 'NAT10021', 'Bolivian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('22', 'NAT10022', 'Brazilian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('23', 'NAT10023', 'Barbadian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('24', 'NAT10024', 'Bhutanese', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('25', 'NAT10025', 'Botswanan', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('26', 'NAT10026', 'Canadian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('27', 'NAT10027', 'Swiss', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('28', 'NAT10028', 'Chilean', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('29', 'NAT10029', 'Chinese', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('30', 'NAT10030', 'Cameroonian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('31', 'NAT10031', 'Colombian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('32', 'NAT10032', 'Comoros', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('33', 'NAT10033', 'Costa Rican', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('34', 'NAT10034', 'Cuban', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('35', 'NAT10035', 'Cypriot', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('36', 'NAT10036', 'Czech', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('37', 'NAT10037', 'German', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('38', 'NAT10038', 'Djiboutian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('39', 'NAT10039', 'Dominican', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('40', 'NAT10040', 'Danish', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('41', 'NAT10041', 'Algerian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('42', 'NAT10042', 'Ecuadorean', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('43', 'NAT10043', 'Egyptian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('44', 'NAT10044', 'Eritrean', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('45', 'NAT10045', 'Spanish', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('46', 'NAT10046', 'Estonian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('47', 'NAT10047', 'Ethiopian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('48', 'NAT10048', 'Finnish', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('49', 'NAT10049', 'Fijian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('50', 'NAT10050', 'French', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('51', 'NAT10051', 'Gabonese', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('52', 'NAT10052', 'British', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('53', 'NAT10053', 'Georgian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('54', 'NAT10054', 'Ghanaian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('55', 'NAT10055', 'Guinean', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('56', 'NAT10056', 'Greek', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('57', 'NAT10057', 'Grenadian ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('58', 'NAT10058', 'Guatemalan', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('59', 'NAT10059', 'Guyanese', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('60', 'NAT10060', 'Honduran', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('61', 'NAT10061', 'Croat or Croatian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('62', 'NAT10062', 'Haitian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('63', 'NAT10063', 'Hungarian ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('64', 'NAT10064', 'Indonesian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('65', 'NAT10065', 'Indian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('66', 'NAT10066', 'Irish', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('67', 'NAT10067', 'Iranian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('68', 'NAT10068', 'Iraqi', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('69', 'NAT10069', 'Icelandic ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('70', 'NAT10070', 'Israeli', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('71', 'NAT10071', 'Italian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('72', 'NAT10072', 'Jamaican', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('73', 'NAT10073', 'Jordanian ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('74', 'NAT10074', 'Japanese', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('75', 'NAT10075', 'Kazakh', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('76', 'NAT10076', 'Kenyan', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('77', 'NAT10077', 'Cambodian ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('78', 'NAT10078', 'Korean', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('79', 'NAT10079', 'Kuwaiti', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('80', 'NAT10080', 'Lebanese', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('81', 'NAT10081', 'Liberian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('82', 'NAT10082', 'Libyan', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('83', 'NAT10083', 'Sri Lankan', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('84', 'NAT10084', 'Lithuanian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('85', 'NAT10085', 'Luxembourgish    ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('86', 'NAT10086', 'Latvian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('87', 'NAT10087', 'Moroccan', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('88', 'NAT10088', 'Monacan', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('89', 'NAT10089', 'Moldovan', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('90', 'NAT10090', 'Madagascan', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('91', 'NAT10091', 'Maldivian ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('92', 'NAT10092', 'Mexican', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('93', 'NAT10093', 'Macedonian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('94', 'NAT10094', 'Malian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('95', 'NAT10095', 'Maltese', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('96', 'NAT10096', 'Montenegrin', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('97', 'NAT10097', 'Mongolian ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('98', 'NAT10098', 'Mozambican', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('99', 'NAT10099', 'Mauritanian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('100', 'NAT10100', 'Mauritian ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('101', 'NAT10101', 'Malawian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('102', 'NAT10102', 'Malaysian ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('103', 'NAT10103', 'Namibian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('104', 'NAT10104', 'Nigerien', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('105', 'NAT10105', 'Nigerian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('106', 'NAT10106', 'Nicaraguan', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('107', 'NAT10107', 'Dutch', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('108', 'NAT10108', 'Norwegian ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('109', 'NAT10109', 'Nepalese', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('110', 'NAT10110', 'New Zealand', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('111', 'NAT10111', 'Omani', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('112', 'NAT10112', 'Pakistani ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('113', 'NAT10113', 'Panamanian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('114', 'NAT10114', 'Peruvian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('115', 'NAT10115', 'Filipino', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('116', 'NAT10116', 'Papua New Guinean', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('117', 'NAT10117', 'Polish', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('118', 'NAT10118', 'Puerto Rican     ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('119', 'NAT10119', 'Portuguese', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('120', 'NAT10120', 'Paraguayan', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('121', 'NAT10121', 'Palestinian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('122', 'NAT10122', 'Qatari', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('123', 'NAT10123', 'Romanian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('124', 'NAT10124', 'Russian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('125', 'NAT10125', 'Rwandan', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('126', 'NAT10126', 'Saudi Arabian    ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('127', 'NAT10127', 'Sudanese', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('128', 'NAT10128', 'Senegalese', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('129', 'NAT10129', 'Singaporean', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('130', 'NAT10130', 'Sierra Leonian   ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('131', 'NAT10131', 'Salvadorean', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('132', 'NAT10132', 'Somali', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('133', 'NAT10133', 'Serb or Serbian  ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('134', 'NAT10134', 'Slovak', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('135', 'NAT10135', 'Slovene or Slovenian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('136', 'NAT10136', 'Swedish', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('137', 'NAT10137', 'Swazi', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('138', 'NAT10138', 'Seychelles', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('139', 'NAT10139', 'Syrian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('140', 'NAT10140', 'Chadian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('141', 'NAT10141', 'Togolese', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('142', 'NAT10142', 'Thai ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('143', 'NAT10143', 'Tajik', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('144', 'NAT10144', 'Turkmen', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('145', 'NAT10145', 'Trinidadian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('146', 'NAT10146', 'Tunisian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('147', 'NAT10147', 'Turkish', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('148', 'NAT10148', 'Tuvaluan', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('149', 'NAT10149', 'Ugandan', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('150', 'NAT10150', 'Ukrainian ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('151', 'NAT10151', 'Uruguayan ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('152', 'NAT10152', 'American', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('153', 'NAT10153', 'Uzbek', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('154', 'NAT10154', 'Vanuatuan ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('155', 'NAT10155', 'Yemeni', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('156', 'NAT10156', 'South African    ', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('157', 'NAT10157', 'Zambian', 'A');
INSERT INTO `hims_d_nationality` (`hims_d_nationality_id`, `nationality_code`, `nationality`, `record_status`) VALUES ('158', 'NAT10158', 'Zimbabwean', 'A');

-- Default Religion
INSERT INTO `hims_d_religion` (`hims_d_religion_id`, `religion_code`, `religion_name`, `arabic_religion_name`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('1', 'REG001', 'Muslim', 'مسلم', '1', now(), '1', now(), 'A');
INSERT INTO `hims_d_religion` (`hims_d_religion_id`, `religion_code`, `religion_name`, `arabic_religion_name`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('2', 'REG002', 'Hindu', 'الهندوسي', '1', now(), '1', now(),'A');
INSERT INTO `hims_d_religion` (`hims_d_religion_id`, `religion_code`, `religion_name`, `arabic_religion_name`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('3', 'REG003', 'Christian', 'مسيحي', '1', now(), '1', now(), 'A');

-- Default Designations
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('1', 'DES001', 'ENT Specialist', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('2', 'DES002', 'G.P Doctor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('3', 'DES003', 'Gynecology Specialist', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('4', 'DES004', 'Ophthalmology Specialist', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('5', 'DES005', 'Pediatric Specialist', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('6', 'DES006', 'Pediatrics Specialist', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('7', 'DES007', 'Dental Doctor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('8', 'DES008', 'Internal Medicine Specialist', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('9', 'DES009', 'Administrative Assistant', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('10', 'DES010', 'Purchase Manager - Medications', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('11', 'DES011', 'Stoore Keeper - Data Entry', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('12', 'DES012', 'Pharmacist', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('13', 'DES013', 'Reception Supervisor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('14', 'DES014', 'Receptionist / Appointments', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('15', 'DES015', 'Laboratory Technician', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('16', 'DES016', 'Radiology Specialist ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('17', 'DES017', 'X-Ray Technician', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('18', 'DES018', 'Insurance Manager', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('19', 'DES019', 'Insurance Approvals & Claims Clerk', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('20', 'DES020', 'Laboratory Specialist', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('21', 'DES021', 'Billing & Claims Clerk', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('22', 'DES022', 'Insurance Approvals ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('23', 'DES023', 'Physiotherapist', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('24', 'DES024', 'Admin Assistant', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('25', 'DES025', 'Corporatesecretary And Administrator', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('26', 'DES026', 'Executive Secretary', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('27', 'DES027', 'Family Medicine', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('28', 'DES028', 'Clerk', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('29', 'DES029', 'Hr Supervisor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('30', 'DES030', 'Marketing', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('31', 'DES031', 'Medical Records', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('32', 'DES032', 'Nurse', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('33', 'DES033', 'PRC', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('34', 'DES034', 'Purchasing Clerk', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('35', 'DES035', 'Manager', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('36', 'DES036', 'Sales Administrative', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('37', 'DES037', 'Officer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('38', 'DES038', 'Supervisior', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('39', 'DES039', 'Accountant', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('40', 'DES040', 'Chief Accountant', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('41', 'DES041', 'Driver', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('42', 'DES042', 'Housekeeper', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('43', 'DES043', 'Helper', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('44', 'DES044', 'Sales Representative', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('45', 'DES045', 'Paramedic', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('46', 'DES046', 'Equipment Technician', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('47', 'DES047', 'CEO', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('48', 'DES048', 'Director', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('49', 'DES049', 'Orthopeadic', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('50', 'DES050', 'EMT-Nurse', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('51', 'DES051', 'Accounts Payable Asst.', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('52', 'DES052', 'Administration Manager ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('53', 'DES053', 'Asst. Camp Boss', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('54', 'DES054', 'Asst. Cook', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('55', 'DES055', 'Asst. Document Controller', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('56', 'DES056', 'Asst. HSE', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('57', 'DES057', 'Asst. Land Surveyor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('58', 'DES058', 'Asst. Mechanic', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('59', 'DES059', 'Asst. Storekeeper', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('60', 'DES060', 'asst. transport coordinator', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('61', 'DES061', 'Astt. Storekeeper ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('62', 'DES062', 'Bobcat Operator', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('63', 'DES063', 'Business Development Manager', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('64', 'DES064', 'C/H Carpenter ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('65', 'DES065', 'C/H Mason', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('66', 'DES066', 'C/H Scaffolding', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('67', 'DES067', 'C/H Steel', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('68', 'DES068', 'C/H Tile Mason', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('69', 'DES069', 'Carpenter', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('70', 'DES070', 'Chainboy', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('71', 'DES071', 'Civil Foreman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('72', 'DES072', 'Civil Structural Detailer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('73', 'DES073', 'Construction Manager ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('74', 'DES074', 'Contracts & Planning Manager', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('75', 'DES075', 'Cook  ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('76', 'DES076', 'Cook Asst.', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('77', 'DES077', 'Document Controller', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('78', 'DES078', 'Draughtsman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('79', 'DES079', 'Driver-LV', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('80', 'DES080', 'Electrician', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('81', 'DES081', 'Finance Manager', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('82', 'DES082', 'Foreman- Carpentry', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('83', 'DES083', 'Foreman Scaffolding ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('84', 'DES084', 'Foreman-Masonry', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('85', 'DES085', 'Foreman-Steel', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('86', 'DES086', 'General Manager ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('87', 'DES087', 'Helper', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('88', 'DES088', 'Housekeeping boy', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('89', 'DES089', 'HR Assistant', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('90', 'DES090', 'HR/Admin Officer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('91', 'DES091', 'HSE Asst.', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('92', 'DES092', 'HSE Officer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('93', 'DES093', 'Internal Auditor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('94', 'DES094', 'IT Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('95', 'DES095', 'IT Manager ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('96', 'DES096', 'Jr. Accountant', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('97', 'DES097', 'Jr. Carpenter Foreman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('98', 'DES098', 'Jr. Estimator', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('99', 'DES099', 'Jr. Foreman Civil', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('100', 'DES100', 'Jr. Foreman Earthwork', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('101', 'DES101', 'Jr. Foreman Mason', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('102', 'DES102', 'Jr. Foreman Steel', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('103', 'DES103', 'Jr. Land Surveyor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('104', 'DES104', 'Jr. Mason Foreman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('105', 'DES105', 'Jr. Plumbing Foreman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('106', 'DES106', 'Jr. Quantity Surveyor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('107', 'DES107', 'Jr. Scaffolder Foreman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('108', 'DES108', 'Jr. Site Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('109', 'DES109', 'Jr. Steel Foreman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('110', 'DES110', 'Kitchen Helper', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('111', 'DES111', 'Land Surveyor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('112', 'DES112', 'Loddal Operator', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('113', 'DES113', 'Mason', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('114', 'DES114', 'Mess Boy', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('115', 'DES115', 'Mess Officer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('116', 'DES116', 'Mobilization Foreman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('117', 'DES117', 'Office Assistant ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('118', 'DES118', 'Office Assistant ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('119', 'DES119', 'Office Boy', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('120', 'DES120', 'Painter', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('121', 'DES121', 'PE&T Manager', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('122', 'DES122', 'Plant Operator', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('123', 'DES123', 'Plumber', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('124', 'DES124', 'PRO', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('125', 'DES125', 'Procurement Assistant ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('126', 'DES126', 'Project Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('127', 'DES127', 'Project Manager ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('128', 'DES128', 'Projects Controls Manager', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('129', 'DES129', 'Projects Support Officer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('130', 'DES130', 'QA/QC Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('131', 'DES131', 'Quantity Surveyor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('132', 'DES132', 'Quantity Surveyor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('133', 'DES133', 'Rigger / Banksman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('134', 'DES134', 'Scaffolder', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('135', 'DES135', 'Scaffolding Inspector', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('136', 'DES136', 'Senior Estimator', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('137', 'DES137', 'Senior Planning Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('138', 'DES138', 'Senior Procurement Manager', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('139', 'DES139', 'Jr. Procurement Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('140', 'DES140', 'Site Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('141', 'DES141', 'Site Office Boy', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('142', 'DES142', 'Site office coordinator', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('143', 'DES143', 'Site Office Manager', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('144', 'DES144', 'Site Storekeeper', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('145', 'DES145', 'Sr. Draughtsman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('146', 'DES146', 'Sr. Mechanic', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('147', 'DES147', 'Sr. PRO', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('148', 'DES148', 'Sr. Procurement Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('149', 'DES149', 'Sr. Project Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('150', 'DES150', 'Sr. Quantity Surveyor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('151', 'DES151', 'Sr. Site Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('152', 'DES152', 'SteelFixer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('153', 'DES153', 'StoreKeeper ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('154', 'DES154', 'Technical Coordinator', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('155', 'DES155', 'Technical Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('156', 'DES156', 'Tile Mason', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('157', 'DES157', 'Timekeeper', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('158', 'DES158', 'Tower Crane Operator', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('159', 'DES159', 'Watchman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('160', 'DES160', 'Transport InCharge', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('161', 'DES161', 'Transport Coordinator', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('162', 'DES162', 'Admin Coordinator', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('163', 'DES163', 'Driver-HV', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('164', 'DES164', 'Camp Boss', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('165', 'DES165', 'Asst. QAQC', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('166', 'DES166', 'QAQC Officer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('167', 'DES167', 'QAQC Inspector', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('168', 'DES168', 'HVAC Technician', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('169', 'DES169', 'Asst. HVAC', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('170', 'DES170', 'Asst. Plumber', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('171', 'DES171', 'Asst. Electrician', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('172', 'DES172', 'Asst. Ductsman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('173', 'DES173', 'Ductsman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('174', 'DES174', 'Welder', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('175', 'DES175', 'Asst. Welder', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('176', 'DES176', 'Pipefitter', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('177', 'DES177', 'Asst Pipefitter', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('178', 'DES178', 'GHRM', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('179', 'DES179', 'GFC', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('180', 'DES180', 'CIA', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('181', 'DES181', 'Group Operations Manager', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('182', 'DES182', 'Projects Director', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('183', 'DES183', 'Managing Director', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('184', 'DES184', 'Electrical Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('185', 'DES185', 'Mechanical Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('186', 'DES186', 'Plumbing Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('187', 'DES187', 'Technical Manager', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('188', 'DES188', 'HSSE Manager', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('189', 'DES189', 'HSSE Supervisor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('190', 'DES190', 'HSSE TeamLeader', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('191', 'DES191', 'Plumbing Supervisor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('192', 'DES192', 'Electrical Supervisor ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('193', 'DES193', 'Mechanical Supervisor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('194', 'DES194', 'HVAC Supervisor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('195', 'DES195', 'HVAC Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('196', 'DES196', 'Plumbing & Firefighting Supervisor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('197', 'DES197', 'Plumbing Foreman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('198', 'DES198', 'Electrical Foreman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('199', 'DES199', 'Mechanical Foreman ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('200', 'DES200', 'Ducting Foreman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('201', 'DES201', 'Procurement Officer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('202', 'DES202', 'Procurement Engineer ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('203', 'DES203', 'MEP Coordination Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('204', 'DES204', 'Plumbing & Firefighting Foreman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('205', 'DES205', 'ELV Foreman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('206', 'DES206', 'Senior Electrical Supervisor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('207', 'DES207', 'Senior QS', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('208', 'DES208', 'Senior Mechanical Supervisor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('209', 'DES209', 'Senior HVAC Supervisor ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('210', 'DES210', 'Pre-Auditor ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('211', 'DES211', 'Senior Auditor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('212', 'DES212', 'C/H Electrical', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('213', 'DES213', 'C/H Plumbing', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('214', 'DES214', 'C/H HVAC tech', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('215', 'DES215', 'C/H Ducstman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('216', 'DES216', 'Field Assistant & Clerk', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('217', 'DES217', 'Regional Operations Manager', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('218', 'DES218', 'Receptionist', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('219', 'DES219', 'Accounts Manager', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('220', 'DES220', 'Senior Operations Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('221', 'DES221', 'Field Technician', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('222', 'DES222', 'Maintenance Supervisor', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('223', 'DES223', 'Chief Executive officer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('224', 'DES224', 'Sales Manager ', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('225', 'DES225', 'Jr.Plumbing Foreman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('226', 'DES226', 'Jr.AC Foreman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('227', 'DES227', 'Jr.Planning Engineer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('228', 'DES228', 'Senior Accountant', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('229', 'DES229', 'Development Director', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('230', 'DES230', 'Supply Chain Director', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('231', 'DES231', 'Document Controller Snr', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('232', 'DES232', 'Draughtsman Jnr', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('233', 'DES233', 'Draughtsman Electrical', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('234', 'DES234', 'Draughtsman Mechanical', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('235', 'DES235', 'Draughtsman HVAC', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('236', 'DES236', 'Draughtsman Structural Detailer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('237', 'DES237', 'Production Officer', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('238', 'DES238', 'Site HSE Manager', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('239', 'DES239', 'General Foreman', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('240', 'DES240', 'Workforce Manager', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('241', 'DES241', 'HR Officer Snr', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('242', 'DES242', 'Finance Coordinator', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('243', 'DES243', 'Procurement Officer Jnr', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('244', 'DES244', 'Procurement Officer Jnr', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('245', 'DES245', 'Mechanical Engineer Snr', now(), now(), 'A');
INSERT INTO `hims_d_designation` (`hims_d_designation_id`, `designation_code`, `designation`, `created_date`, `updated_date`, `record_status`) VALUES ('246', 'DES246', 'IT Helpdesk technician', now(), now(), 'A');

