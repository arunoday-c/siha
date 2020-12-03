
-- =================================  Start 14 Sept 2020 =======================================
-- ******** Added Email and Password Field in Sub Department
ALTER TABLE `hims_d_sub_department`
ADD COLUMN `sub_department_email` VARCHAR(300) NULL DEFAULT NULL AFTER `vitals_mandatory`;
ALTER TABLE `hims_d_sub_department`
ADD COLUMN `password` VARCHAR(250) NOT NULL COMMENT 'MD5 encrypted password' AFTER `sub_department_email` ;
ALTER TABLE `hims_d_sub_department`
ADD COLUMN `salt` VARCHAR(300) NULL DEFAULT NULL AFTER `vitals_mandatory`;

-- ******** Added Performance Management Query
CREATE TABLE `hrms_d_performance_appraisal_matrix_range` (
  `hrms_d_apprisal_range_id` int NOT NULL AUTO_INCREMENT,
  `from_range` decimal(5,2) DEFAULT NULL,
  `to_range` decimal(5,2) DEFAULT NULL,
  `result` varchar(20) DEFAULT NULL,
  `increment` decimal(5,2) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hrms_d_apprisal_range_id`),
  KEY `FK` (`created_by`,`updated_by`),
  KEY `hrms_d_performance_appraisal_matrix_range_FK2` (`updated_by`),
  CONSTRAINT `hrms_d_performance_appraisal_matrix_range_FK1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hrms_d_performance_appraisal_matrix_range_FK2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `hrms_d_questionnaire_group` (
  `hrms_d_questionnaire_group_id` INT,
  `group_name` VARCHAR(100),
  `created_date` DATETIME,
  `created_by` INT,
  `updated_date` DATETIME,
  `updated_by` INT,
  `record_status` ENUM('A', 'I'),
  PRIMARY KEY (`hrms_d_questionnaire_group_id`),
  KEY `FK` (`created_by`, `updated_by`),
  CONSTRAINT `hrms_d_questionnaire_group_FK1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hrms_d_questionnaire_group_FK2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
);


CREATE TABLE `hrms_d_perfrmance_questionnaire_master` (
  `hrms_d_perfrmance_questionnaire_master_id` INT,
  `hrms_d_questionnaire_group_id` INT,
  `questionaries` VARCHAR(250),
  `created_date` DATETIME,
  `created_by` INT,
  `updated_date` DATETIME,
  `updated_by` INT,
  `record_status` ENUM('A', 'I') DEFAULT 'A',
  PRIMARY KEY (`hrms_d_perfrmance_questionnaire_master_id`),
  KEY `FK` (`hrms_d_questionnaire_group_id`, `created_by`, `updated_by`),
  CONSTRAINT `hrms_d_perfrmance_questionnaire_master_FK1` FOREIGN KEY (`hrms_d_questionnaire_group_id`) REFERENCES `hrms_d_questionnaire_group` (`hrms_d_questionnaire_group_id`),
   CONSTRAINT `hrms_d_perfrmance_questionnaire_master_FK2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hrms_d_perfrmance_questionnaire_master_FK3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
);


CREATE TABLE `hrms_d_kpi_master` (
  `hrms_d_kpi_master_id` INT,
  `kpi_name` VARCHAR(100),
  `created_date` DATETIME,
  `created_by` INT,
  `updated_date` DATETIME,
  `updated_by` INT,
  `record_status` ENUM('A', 'I')
  );


-- ******** Sales Invoice Security
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('144', 'SALE_INV_POST', 'Sales Invoice Post', '2020-09-14 12:06:42', '2020-09-14 12:06:42', 'A');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('144', 'SALES_INV_RVT', 'Sales Invoice Revert', '2020-09-14 12:07:00', '2020-09-14 12:07:00', 'A');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('144', 'SALES_INV_MAIN', 'Sales Maintanance', '2020-09-14 12:17:56', '2020-09-14 12:17:56', 'A');

-- ******** Bill Wise Vat Report
  INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('billWiseVatReport', 'Bill Wise VAT Report', '[\'hospital_id\',\'from_date\',\'to_date\' ]', 'reportHeader', 'A', '2019-10-17 15:13:22', '2019-10-17 15:13:22');

-- ******** OP Ctrl In Mapping
INSERT INTO `finance_accounts_maping` (`finance_accounts_maping_id`, `account`, `description`) VALUES ('27', 'OP_CTRL', 'OP Control Account');


-- =================================  Start 17 Sept 2020 =======================================
-- ******** Final Remittance
CREATE TABLE `hims_f_insurance_remitance` (
  `hims_f_insurance_remitance_id` int NOT NULL AUTO_INCREMENT,
  `claim_id` int DEFAULT NULL,
  `cliam_number` varchar(45) DEFAULT NULL,
  `head_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `amount` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_insurance_remitance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ******** Insurance Write Off Account
INSERT INTO `finance_accounts_maping` (`finance_accounts_maping_id`, `account`, `description`) VALUES ('28', 'INS_WRITE_OFF', 'Insurance Write Off');


-- =================================  Start 18 Sept 2020 =======================================
-- ******** Gratuity Min Year of service
ALTER TABLE `hims_d_end_of_service_options` ADD COLUMN `gratuity_min_year` INT NULL DEFAULT NULL AFTER `gratuity_provision`;

-- ******** Write off Amount in Statement
ALTER TABLE `hims_f_insurance_statement`
ADD COLUMN `writeoff_amount` DECIMAL(20,3) NULL DEFAULT NULL AFTER `submission_step`;


-- ******** Final Remit Alert
ALTER TABLE `hims_f_insurance_remitance`
DROP COLUMN `child_id`,
DROP COLUMN `head_id`,
ADD COLUMN `remit_amount` DECIMAL(10,3) NULL AFTER `company_payable`,
ADD COLUMN `denail_amount` DECIMAL(10,3) NULL AFTER `remit_amount`,
CHANGE COLUMN `amount` `company_payable` DECIMAL(10,3) NULL DEFAULT NULL ;

ALTER TABLE `hims_f_insurance_remitance`
ADD COLUMN `writeoff_amount` DECIMAL(10,3) NULL AFTER `denail_amount`;


-- ********Query for Employee wise working hour
alter table hims_d_employee add column standard_work_hours time default null
after service_dis_percentage, add column consider_overtime enum('Y','N') default  'N'
after standard_work_hours, add column ramzan_work_hours time default null
after consider_overtime, add column week_day enum('SU','MO','TU','WE','TH','FR','SA') default null
after ramzan_work_hours;

-- =================================  Start 19 Sept 2020 =======================================
-- ******** Package Related reports
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('cancelPackageByPatient', 'Cancelled Package by Patient', 'reportHeader', 'A', '2020-09-08 13:48:09', '2020-09-08 13:48:09');
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('orderdPackageByPatient', 'Ordered Package by Patient', 'reportHeader', 'A', '2020-09-08 13:48:09', '2020-09-08 13:48:09');
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('utlizePackageByPatient', 'Utilized Package by Patient', 'reportHeader', 'A', '2020-09-08 13:48:09', '2020-09-08 13:48:09');
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('typePackageByBranch', 'Type Package by Branch', 'reportHeader', 'A', '2020-09-08 13:48:09', '2020-09-08 13:48:09');


-- =================================  Start 21 Sept 2020 =======================================
-- ******** Package Report Updates
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('outstandingPackageByPatient', 'Outstanding Package by Patient', 'reportHeader', 'A', '2020-09-08 13:48:09', '2020-09-08 13:48:09');
UPDATE `algaeh_d_reports` SET `report_name_for_header` = 'Ordered Package by Patient' WHERE (`report_name` = 'orderdPackageByPatient');
UPDATE `algaeh_d_reports` SET `report_name_for_header` = 'Utilized Package by Patient' WHERE (`report_name` = 'utlizePackageByPatient');

-- ********Sales Invoice cancel option
ALTER TABLE `hims_f_sales_invoice_header`
ADD COLUMN `is_cancelled` ENUM('N', 'Y') NULL DEFAULT 'N' AFTER `reverted_date`,
ADD COLUMN `cancelled_by` INT NULL AFTER `is_cancelled`,
ADD COLUMN `cancelled_date` DATETIME NULL AFTER `cancelled_by`;
ALTER TABLE `hims_f_sales_invoice_header`
ADD COLUMN `cancel_reason` VARCHAR(200) NULL AFTER `is_cancelled`;
ALTER TABLE `hims_f_sales_order`
ADD COLUMN `revert_reason` VARCHAR(200) NULL AFTER `is_revert`;

-- ******** HR Approval Email Setup Screen
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('86', 'PAY_ANN_EML_SET', 'Email Setup', '2020-09-21 14:42:30', '2020-09-21 14:42:30', 'A');


-- =================================  Start 22 Sept 2020 =======================================
-- ******** Email Setup - HRMS
CREATE TABLE `hims_f_email_setup` (
  `hims_f_email_setup_id` INT NOT NULL AUTO_INCREMENT,
  `email_type` ENUM('LV', 'LO', 'LE') NULL DEFAULT 'LO',
  `sub_department_email` VARCHAR(300) NULL DEFAULT NULL,
  `password` VARCHAR(250) NOT NULL COMMENT 'MD5 encrypted password',
  `salt` VARCHAR(300) NULL DEFAULT NULL,
  `sub_department_id` INT NOT NULL,
  `report_name` VARCHAR(300) NULL DEFAULT NULL,
  `report_attach` ENUM('Y', 'N') NULL DEFAULT 'N',
  PRIMARY KEY (`hims_f_email_setup_id`),
  INDEX `hims_f_email_setup_fk1_idx` (`sub_department_id` ASC) VISIBLE,
  CONSTRAINT `hims_f_email_setup_fk1`
    FOREIGN KEY (`sub_department_id`)
    REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ******** Identification Expiry Report
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_query`, `data_manupulation`, `report_input_series`, `report_header_file_name`, `report_footer_file_name`, `uniq_identity_to_report`, `status`, `created_datetime`, `update_datetime`) VALUES ('idExpiryEmployee', 'Identification Expiry Report', '', '', '[\"hospital_id\",\"from_date\",\"to_date\"]', 'reportHeader', '', '', 'A', '2019-06-17 19:46:54', '2019-06-17 19:46:54');


-- =================================  Start 25 Sept 2020 =======================================
-- ******** Income and Sales Return Report
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_query`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('patientWiseIncome', 'Income by Patients', '', '[\"hospital_id\",\"from_date\", \"to_date\"]', 'reportHeader', 'A', '2019-06-17 18:57:28', '2019-06-17 18:57:28');
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('posSalesReturn', 'Pharmacy Return', 'reportHeader', 'A', '2020-09-25 08:03:21', '2020-09-25 08:03:21');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('156', 'RPT_INC_PAT', 'Income by Patient', '2020-09-25 09:08:59', '2020-09-25 09:08:59', 'A');

-- ******** Card Master
ALTER TABLE `hims_d_bank_card`
ADD COLUMN `card_format` VARCHAR(45) NULL DEFAULT NULL AFTER `child_id`,
ADD COLUMN `vat_percentage` DECIMAL(10,3) NULL DEFAULT 0.00 AFTER `card_format`,
ADD COLUMN `service_charge` DECIMAL(20,3) NULL DEFAULT 0.00 AFTER `vat_percentage`;

-- ******** Inactive few Service Type
UPDATE `hims_d_service_type` SET `record_status` = 'I' WHERE (`hims_d_service_type_id` = '3');
UPDATE `hims_d_service_type` SET `record_status` = 'I' WHERE (`hims_d_service_type_id` = '8');
UPDATE `hims_d_service_type` SET `record_status` = 'I' WHERE (`hims_d_service_type_id` = '9');

-- ******** Cash Receipt Patient Primary ID in Report
UPDATE `algaeh_d_reports` SET `report_query` = 'select BH.bill_number as invoice_number,P.patient_code, P.full_name as patient_full_name,  P.arabic_name as patient_arabaic_full_name, P.primary_id_no, V.visit_date,E.full_name,E.arabic_name,SD.arabic_sub_department_name,	  SD.sub_department_name,N.nationality, BH.bill_date invoice_date, P.registration_date, V.age_in_years, P.gender,IP.insurance_provider_name,INET.network_type from hims_f_patient P inner join hims_f_patient_visit V on P.hims_d_patient_id = V.patient_id inner join hims_d_nationality as N on N.hims_d_nationality_id = P.nationality_id inner join hims_d_sub_department SD on V.sub_department_id =SD.hims_d_sub_department_id inner join hims_d_employee E on V.doctor_id =E.hims_d_employee_id inner join hims_f_billing_header BH on V.hims_f_patient_visit_id = BH.visit_id left join hims_m_patient_insurance_mapping IM on IM.patient_visit_id = V.hims_f_patient_visit_id left join hims_d_insurance_provider IP on IP.hims_d_insurance_provider_id = IM.primary_insurance_provider_id left join hims_d_insurance_network INET on INET.hims_d_insurance_network_id = IM.primary_network_id where BH.hims_f_billing_header_id=?;   select BH.hims_f_billing_header_id,BH.bill_number ,ST.service_type,	ST.arabic_service_type, S.service_name,	  S.arabic_service_name,    BD.quantity,	BD.unit_cost as price,	BD.gross_amount, BD.patient_resp as patient_share,	  BD.patient_payable,	coalesce(BD.discount_amout,	0)as discount_amount, coalesce(BD.net_amout,	0)as net_amount,	  BD.comapany_resp,	BD.company_tax,	BD.company_payble, BD.patient_tax,	coalesce(BD.company_tax,	0)+   coalesce(BD.comapany_resp,	0) as net_claim, BD.service_type_id,V.new_visit_patient from hims_f_billing_header BH       inner join hims_f_patient_visit V on BH.visit_id = V.hims_f_patient_visit_id    inner join hims_f_billing_details BD on BH.hims_f_billing_header_id=BD.hims_f_billing_header_id    inner join hims_d_services S on S.hims_d_services_id = BD.services_id    inner join hims_d_service_type ST on BD.service_type_id = ST.hims_d_service_type_id       where BH.hims_f_billing_header_id=?;' WHERE ( report_name ='cashReceipt' and `report_id` >0);

-- =================================  Start 26 Sept 2020 =======================================
-- ******** Purchase order - report is coming blank - Fixed
UPDATE `algaeh_d_reports` SET `report_input_series` = '[\'purchase_number\' ]' WHERE (`report_name` = 'poInventoryProcurement');
UPDATE `algaeh_d_reports` SET `report_input_series` = '[\'purchase_number\' ]' WHERE (`report_name` = 'poInventoryProcurementNoPrice');
UPDATE `algaeh_d_reports` SET `report_input_series` = '[\'purchase_return_number\' ]' WHERE (`report_name` = 'poInventoryProcurementReturn');
UPDATE `algaeh_d_reports` SET `report_input_series` = '[\'purchase_return_number\' ]' WHERE (`report_name` = 'poInventoryProcurementReturnNoPrice');

-- ******** Sales Order Report - coming blank - Fixed
UPDATE `algaeh_d_reports` SET `report_input_series` = '[\'sales_order_number\' ]' WHERE (`report_name` = 'SalesOrderReportService');
UPDATE `algaeh_d_reports` SET `report_input_series` = '[\'sales_order_number\' ]' WHERE (`report_name` = 'SalesOrderReportItem');

-- =================================  Start 27 Sept 2020 =======================================
-- ******** Purchase order - report is coming blank - Fixed
ALTER TABLE `hims_d_employee`
CHANGE COLUMN `standard_work_hours` `standard_work_hours` DECIMAL(4,2) NULL DEFAULT NULL ,
CHANGE COLUMN `ramzan_work_hours` `ramzan_work_hours` DECIMAL(4,2) NULL DEFAULT NULL ;

-- ******** Inventory Procedure
-- Take from Trello

-- =================================  Start 28 Sept 2020 =======================================
-- ******** Removed Email Feature from Sub Department Module
alter table hims_d_sub_department drop column sub_department_email,drop column password,drop salt;

-- =================================  Start 29 Sept 2020 =======================================
-- ******** Promotion Master Screen Enable
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('5', 'COMM_PROM_MSTR', 'Promotion Master', '2020-09-29 08:04:53', '2020-09-29 08:04:53', 'A');

-- ******** Promotion Master Table Creation
CREATE TABLE `hims_d_promotion` (
  `hims_d_promo_id` INT NOT NULL AUTO_INCREMENT,
  `promo_code` VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL,
  `promo_name` VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL,
  `offer_code` VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL,
  `valid_to_from` DATE NULL DEFAULT NULL,
  `valid_to_date` DATE NULL DEFAULT NULL,
  `avail_type` ENUM('M', 'O') NULL DEFAULT 'O' COMMENT 'M = Multiple Times \\n O = One Time',
  UNIQUE INDEX `promo_code_UNIQUE` (`promo_code` ASC) VISIBLE,
  UNIQUE INDEX `offer_code_UNIQUE` (`offer_code` ASC) VISIBLE,
  PRIMARY KEY (`hims_d_promo_id`));



ALTER TABLE `hims_d_promotion`
ADD COLUMN `record_status` ENUM('A', 'I') CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT 'A' AFTER `avail_type`;

-- ******** HR To Day End if getting Error as mysql Error Code: 1366. Incorrect string value: '\xD9\x90...."
ALTER TABLE `finance_day_end_header`
CHANGE COLUMN `voucher_type` `voucher_type` ENUM('journal', 'contra', 'receipt', 'payment', 'sales', 'purchase', 'credit_note', 'debit_note')
CHARACTER SET 'utf8mb4' NULL DEFAULT NULL COMMENT 'journal,contra,receipt,payment,sales,purchase,credit_note,debit_note' ,
CHANGE COLUMN `narration` `narration` MEDIUMTEXT CHARACTER SET 'utf8mb4' NULL DEFAULT NULL ;

-- ******** Added all MIS Report under Algaeh Security
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('176', 'RPT_MIS_CAN_PAT', 'Cancelled Service by Patient', '2020-09-29 16:04:22', '2020-09-29 16:04:22', 'A');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('176', 'RPT_MIS_DIS_SRV_PAT', 'Discounted Services by Patient', '2020-09-29 16:04:55', '2020-09-29 16:04:55', 'A');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('176', 'RPT_MIS_ORD_PCK_PAT', 'Ordred Package by Patient', '2020-09-29 16:05:50', '2020-09-29 16:05:50', 'A');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('176', 'RPT_MIS_UTL_PCK_PAT', 'Utlized Package by Patient', '2020-09-29 16:06:15', '2020-09-29 16:06:15', 'A');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('176', 'RPT_MIS_OUT_PCK_PAT', 'Outstanding Package by Patient', '2020-09-29 16:06:38', '2020-09-29 16:06:38', 'A');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('176', 'RPT_MIS_CAN_PCK_PAT', 'Cancelled Package by Patient', '2020-09-29 16:07:35', '2020-09-29 16:07:35', 'A');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('176', 'RPT_MIS_PCK_BNH', 'Type Package by Branch', '2020-09-29 16:08:11', '2020-09-29 16:08:11', 'A');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('176', 'RPT_MIS_CNT_SRV', 'Count by Services', '2020-09-29 16:08:30', '2020-09-29 16:08:30', 'A');


-- ******** Added Count by Service report under MIS
   INSERT INTO `algaeh_d_reports` ( `report_name`, `report_name_for_header`, `data_manupulation`, `report_input_series`, `report_header_file_name`, `report_footer_file_name`, `uniq_identity_to_report`, `status`, `created_datetime`, `update_datetime`) VALUES ('countByService', 'Count By Service', '', '[\"hospital_id\",\"from_date\",\"to_date\",\"service_type_id\"]', 'reportHeader', '', '', 'A', '2019-06-18 14:53:28', '2019-06-18 14:53:28');
-- ******** Create Promotion Detail Table
   CREATE TABLE `hims_d_promotion_detail` (
  `hims_d_promotion_detail_id` INT NOT NULL AUTO_INCREMENT,
  `service_type_id` INT NOT NULL,
  `avail_type` ENUM('P', 'A') NULL DEFAULT 'P' COMMENT 'A = Amount \\\\n P = Percentage',
  `offer_value` INT NOT NULL,
  `hims_d_promo_id` INT NULL,
  PRIMARY KEY (`hims_d_promotion_detail_id`),
  INDEX `hims_d_promotion_detail_fk1_idx` (`hims_d_promo_id` ASC) VISIBLE,
  CONSTRAINT `hims_d_promotion_detail_fk1`
    FOREIGN KEY (`hims_d_promo_id`)
    REFERENCES `hims_d_promotion` (`hims_d_promo_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ******** Dental and Optical Insurance Covered
ALTER TABLE hims_d_insurance_network_office ADD COLUMN covered_dental ENUM('Y','N') default 'N' after dental_max, ADD COLUMN coverd_optical ENUM('Y','N') default 'N' after optical_max;

-- ******** Promotion Details Service type relation
ALTER TABLE `hims_d_promotion_detail`
ADD INDEX `hims_d_promotion_detail_fk2_idx` (`service_type_id` ASC) VISIBLE;
;
ALTER TABLE `hims_d_promotion_detail`
ADD CONSTRAINT `hims_d_promotion_detail_fk2`
  FOREIGN KEY (`service_type_id`)
  REFERENCES `hims_d_service_type` (`hims_d_service_type_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


-- =================================  Start Oct 2 2020 =======================================
-- ******** Patient Reg. Country Code
ALTER TABLE `hims_d_country`
ADD COLUMN `tel_code` VARCHAR(10) NULL AFTER `arabic_country_name`;

ALTER TABLE `hims_f_patient`
ADD COLUMN `tel_code` VARCHAR(10) NULL AFTER `address2`;

-- ******** Dental Lab New Field Added
alter table hims_f_dental_form add column resend_mail_send enum('Y','N') default 'N';
alter table hims_f_dental_form add column approved_mail_send enum('Y','N') default 'N';
alter table hims_f_dental_form add column reject_mail_send enum('Y','N') default 'N';
alter table hims_f_dental_form add column arrival_mail_send enum('Y','N') default 'N';
alter table hims_f_dental_form add column location_id int;
alter table hims_f_dental_form add column quantity_available int;
alter table hims_f_dental_form add column quantity_utilised int;
alter table hims_f_dental_form MODIFY quantity_available varchar(20) ;
alter table hims_f_dental_form MODIFY quantity_utilised varchar(20) ;
alter table hims_f_dental_form add column box_code varchar(20);

-- ******** Cancel Reason - Sales Order
alter table hims_f_sales_order add column canceled_reason_sales varchar(150);


-- =================================  Start Oct 5 2020 =======================================
-- ******** Purchase Req - Inventory report added
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_query`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('PurchaseReqInv', 'Purchase Req - Inventory', 'select hims_f_inventory_material_header_id,material_requisition_number\n,date_format(H.requistion_date,\'%d-%m-%Y\') as requistion_date,\nFL.location_description as from_location,\nD.from_qtyhand,D.to_qtyhand,D.quantity_required,D.quantity_authorized,\nD.quantity_recieved,D.quantity_outstanding,IM.item_description,U.uom_description,C.category_desc\nfrom hims_f_inventory_material_header H\ninner join hims_d_inventory_location FL on H.from_location_id=FL.hims_d_inventory_location_id\ninner join hims_f_inventory_material_detail D on H.hims_f_inventory_material_header_id=D.inventory_header_id\ninner join hims_d_inventory_item_master IM on D.item_id=IM.hims_d_inventory_item_master_id\ninner join hims_d_inventory_tem_category C on IM.category_id=C.hims_d_inventory_tem_category_id\ninner join hims_d_inventory_uom U on D.item_uom=U.hims_d_inventory_uom_id\nwhere H.material_requisition_number=?', '[\'material_requisition_number\']', 'reportHeader', 'A', '2019-06-11 17:33:35', '2019-06-11 17:33:35');

-- ******** Sales Frequency New type
ALTER TABLE `hims_f_sales_invoice_services`
CHANGE COLUMN `service_frequency` `service_frequency` ENUM('M', 'W', 'D', 'H', 'PT', 'PP', 'S') NULL DEFAULT 'M' COMMENT 'M-Monthly,\\\\\\\\\\\\\\\\nW-Weekly,\\\\\\\\\\\\\\\\nD-Daily,\\\\\\\\\\\\\\\\nH-Hourly, PT- Per Trip, PP- Per Person, S-Shift' ;


ALTER TABLE `hims_f_sales_order_adj_services`
CHANGE COLUMN `service_frequency` `service_frequency` ENUM('M', 'W', 'D', 'H', 'PT', 'PP', 'S') NULL DEFAULT 'M' COMMENT 'M-Monthly,\\\\\\\\\\\\\\\\nW-Weekly,\\\\\\\\\\\\\\\\nD-Daily,\\\\\\\\\\\\\\\\nH-Hourly, PT- Per Trip, PP- Per Person, S-Shift' ;


ALTER TABLE `hims_f_sales_order_services`
CHANGE COLUMN `service_frequency` `service_frequency` ENUM('M', 'W', 'D', 'H', 'PT', 'PP', 'S') NULL DEFAULT 'M' COMMENT 'M-Monthly,\\\\\\\\nW-Weekly,\\\\\\\\nD-Daily,\\\\\\\\nH-Hourly, PT- Per Trip, PP- Per Person, S-Shift' ;

ALTER TABLE `hims_f_sales_quotation_services`
CHANGE COLUMN `service_frequency` `service_frequency` ENUM('M', 'W', 'D', 'H', 'PT', 'PP', 'S') NULL DEFAULT 'M' COMMENT 'M-Monthly,\\\\nW-Weekly,\\\\nD-Daily,\\\\nH-Hourly, PT- Per Trip, PP- Per Person, S-Shift' ;

-- ******** Sales New Screen
INSERT INTO `algaeh_d_app_screens` (`screen_code`, `screen_name`, `page_to_redirect`, `module_id`, `other_language`) VALUES ('SAL010', 'Sales Invoice List', 'SalesInvoiceList', '28', 'قائمة فاتورة المبيعات');

-- ******** Sales New security
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('147', 'SALES_ORD_REJECT', 'Sales Order Reject', '2020-10-05 22:51:57', '2020-10-05 22:51:57', 'A');

-- =================================  Start Oct 6 2020 =======================================
-- ******** Clinical Desk Nursing Notes
CREATE TABLE `hims_f_nurse_notes` (
  `hims_f_nurse_notes_id` INT NOT NULL AUTO_INCREMENT,
  `patient_id` INT NULL DEFAULT NULL,
  `visit_id` INT NULL DEFAULT NULL,
  `visit_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `episode_id` INT NULL DEFAULT NULL,
  `nursing_notes` VARCHAR(200) NULL DEFAULT NULL,
  `created_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT NULL DEFAULT NULL,
  `updated_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` INT NULL DEFAULT NULL,
  `record_status` ENUM('A', 'I') NULL DEFAULT 'A',
  PRIMARY KEY (`hims_f_nurse_notes_id`));


-- =================================  Start Oct 7 2020 =======================================
-- ******** Added Employee Master Tab Under User Security

INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ( '22', 'EMP_TAB_PER', 'Personal Details', '2020-10-07 17:08:58', '2020-10-07 17:08:58', 'A');
INSERT INTO `algaeh_d_app_component` ( `screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('22', 'EMP_TAB_OFF', 'Official Details', '2020-10-07 17:09:15', '2020-10-07 17:09:15', 'A');
INSERT INTO `algaeh_d_app_component` ( `screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ( '22', 'EMP_TAB_PAY', 'Payroll Details', '2020-10-07 17:09:25', '2020-10-07 17:09:25', 'A');
INSERT INTO `algaeh_d_app_component` ( `screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ( '22', 'EMP_TAB_FAM', 'Family and Identification', '2020-10-07 17:09:38', '2020-10-07 17:09:38', 'A');
INSERT INTO `algaeh_d_app_component` ( `screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('22', 'EMP_TAB_RUL', 'Rules Details', '2020-10-07 17:09:47', '2020-10-07 17:09:47', 'A');
INSERT INTO `algaeh_d_app_component` ( `screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ( '22', 'EMP_TAB_COMM', 'Commission Details', '2020-10-07 17:12:25', '2020-10-07 17:12:25', 'A');

-- =================================  Start Oct 9 2020 =======================================
-- ******** Lab Send Out
ALTER TABLE `hims_f_lab_order`
ADD COLUMN `send_out_test` ENUM('Y', 'N') NULL DEFAULT 'N' AFTER `critical_status`;

-- =================================  Start Oct 13 2020 =======================================

-- ******** Sales Invoice Service Report - Updated Status Section
INSERT INTO `algaeh_d_reports` ( `report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('leave_gratuity_reconcil_Report', 'Leave & Gratuity Reconciliation Report', '[\"hospital_id\",\"year\",\"month\",\"sub_department_id\",\"employee_id\",\"employee_group_id\"]', 'reportHeader', 'A', '2019-06-18 14:53:28', '2019-06-18 14:53:28');
UPDATE `algaeh_d_reports` SET `report_name_for_header` = 'Loan Reconciliation Report' WHERE (`report_name` = 'monthlyLoanReport');

-- ******** Dental Lab - Ordered Type
ALTER TABLE `hims_f_dental_form`
ADD COLUMN `ordered_type` ENUM('NEW', 'REF', 'REM') NULL DEFAULT 'NEW' COMMENT 'New=New //nREF=Refine //nREM=Remake //n' AFTER `box_code`;
ALTER TABLE `hims_f_dental_form`
CHANGE COLUMN `ordered_type` `ordered_type` ENUM('NEW', 'REF', 'REM', 'RIM') NULL DEFAULT 'NEW' COMMENT 'New=New //nREF=Refine //nREM=Remake //nRIM=Re-Impression//n' ;

alter table hims_f_dental_form add column odered_date datetime;


-- =================================  Start Oct 15 2020 =======================================
-- ******** For Detail level narration
alter table finance_voucher_details add column narration text default null
after payment_type;


-- ******** For Leave Accural Calc
ALTER TABLE `hims_d_leave`
ADD COLUMN `leave_accrual_calc` ENUM('P', 'F') NULL DEFAULT 'F' COMMENT 'P =Proportional\\nF= Fixed' AFTER `leave_accrual`;

ALTER TABLE `hims_d_leave`
CHANGE COLUMN `leave_accrual_calc` `leave_accrual_calc` ENUM('P', 'F') NULL DEFAULT NULL COMMENT 'P =Proportional\\\\nF= Fixed' ;


-- ******** For Email Setup
alter table hims_d_sub_department drop column sub_department_email,drop column password,drop salt;
ALTER TABLE `hims_f_email_setup`
ADD COLUMN `setup_name` VARCHAR(50) NULL DEFAULT NULL AFTER `report_attach`,
ADD COLUMN `created_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP AFTER `setup_name`,
ADD COLUMN `created_by` INT NULL DEFAULT NULL AFTER `created_date`,
ADD COLUMN `updated_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP AFTER `created_by`,
ADD COLUMN `updated_by` INT NULL DEFAULT NULL AFTER `updated_date`;

-- ******** Leave Salary Header - Decimal
ALTER TABLE `hims_f_employee_leave_salary_header`
CHANGE COLUMN `leave_salary_amount` `leave_salary_amount` DECIMAL(15,3) NULL DEFAULT '0.000' ,
CHANGE COLUMN `airticket_amount` `airticket_amount` DECIMAL(15,3) NULL DEFAULT '0.000' ,
CHANGE COLUMN `balance_leave_salary_amount` `balance_leave_salary_amount` DECIMAL(15,3) NULL DEFAULT '0.000' ,
CHANGE COLUMN `balance_airticket_amount` `balance_airticket_amount` DECIMAL(15,3) NULL DEFAULT '0.000' ,
CHANGE COLUMN `utilized_leave_salary_amount` `utilized_leave_salary_amount` DECIMAL(10,3) NULL DEFAULT '0.000' ,
CHANGE COLUMN `utilized_airticket_amount` `utilized_airticket_amount` DECIMAL(10,3) NULL DEFAULT '0.000' ;

-- ******** EXPENSE_VOUCHER Numgen
insert into finance_numgen(`finance_numgen_id`,`numgen_code`,`module_desc`,`prefix`,`intermediate_series`,`postfix`,
`length`,`increment_by`,`numgen_seperator`,`postfix_start`,`postfix_end`,`current_num`,`pervious_num`,
`preceding_zeros_req`,`intermediate_series_req`,`reset_slno_on_year_change`)
values(9,'EXPENSE_VOUCHER','for finance expense voucher number','EXP',20,'0',13,1,'-','0','9999999','0','0','Y','Y','Y');

-- ALTER TABLE finance_voucher_header` CHANGE COLUMN `voucher_type` `voucher_type` ENUM('journal', 'contra', 'receipt', 'payment', 'sales', 'purchase', 'credit_note', 'debit_note', 'expense_voucher') NULL DEFAULT NULL COMMENT 'journal,contra,receipt,payment,sales,purchase,credit_note,debit_note,expense_voucher' ;

-- =================================  Start Oct 16 2020 =======================================
-- ******** Journal Voucher Reports
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('JVReport_contra', 'Journal Voucher Contra', '[\"finance_voucher_header_id\"]', 'voucherHeader', 'A', '2020-09-05 10:22:55', '2020-09-05 10:22:55');
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('JVReport_receipt', 'Journal Voucher Receipt', '[\"finance_voucher_header_id\"]', 'voucherHeader', 'A', '2020-09-05 10:22:55', '2020-09-05 10:22:55');
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('JVReport_payment', 'Journal Voucher Payment', '[\"finance_voucher_header_id\"]', 'voucherHeader', 'A', '2020-09-05 10:22:55', '2020-09-05 10:22:55');
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('JVReport_sales', 'Journal Voucher Sales', '[\"finance_voucher_header_id\"]', 'voucherHeader', 'A', '2020-09-05 10:22:55', '2020-09-05 10:22:55');
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('JVReport_purchase', 'Journal Voucher Purchase', '[\"finance_voucher_header_id\"]', 'voucherHeader', 'A', '2020-09-05 10:22:55', '2020-09-05 10:22:55');
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('JVReport_creditNote', 'Journal Voucher Credit Note', '[\"finance_voucher_header_id\"]', 'voucherHeader', 'A', '2020-09-05 10:22:55', '2020-09-05 10:22:55');
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('JVReport_debitNote', 'Journal Voucher Debit Note', '[\"finance_voucher_header_id\"]', 'voucherHeader', 'A', '2020-09-05 10:22:55', '2020-09-05 10:22:55');


-- =================================  Start Oct 18 2020 =======================================
-- ******** Email Setup - Enable Email (Yes/No)
ALTER TABLE `hims_f_email_setup`
ADD COLUMN `enable_email` ENUM('Y', 'N') NULL DEFAULT 'N' AFTER `hims_f_email_setup_id`;


-- =================================  Start Oct 19 2020 =======================================
-- ******** Leave Request Slip
INSERT INTO `algaeh_d_reports` ( `report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ( 'LeaveRequestSlip', 'Leave Request Slip', '[\"hims_f_leave_application_id\"]', 'reportHeader', 'A', '2019-07-25 18:21:38', '2019-07-25 18:21:38');

-- ******** Employee Payroll Details Report
INSERT INTO `algaeh_d_reports` ( `report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('employeePayrollDetails', 'Employee Payroll Details', '[\"hospital_id\",\"employee_group_id\",\"month\",\"year\",\"year\",\"month\",\"year\",\"month\"]', 'voucherHeader', 'A', '2020-09-05 10:22:55', '2020-09-05 10:22:55');


-- =================================  Start Oct 20 2020 =======================================
-- ******** Finance Voucher Sub Header (Voucher Type)
alter table finance_voucher_sub_header add column voucher_type enum('journal','contra','receipt','payment','sales','purchase','credit_note','debit_note','expense_voucher');


-- =================================  Start Oct 22 2020 =======================================
-- ******** Lab Report Section Added under Algaeh Screen
INSERT INTO `algaeh_d_app_screens` (`screen_code`, `screen_name`, `page_to_redirect`, `redirect_url`, `child_pages`, `module_id`, `other_language`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('RPT_LAB', 'Laboratory Reports', 'Reports List', 'laboratory', '/ReportsList/:name', '25', 'تقرير المختبر', '1', '2020-02-05 13:02:44', '1', '2020-02-12 14:51:28', 'A');

-- ******** Lab Reports Newly Added
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_query`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('labReportSend', 'Lab Send Out Report', null, '[]', 'reportHeader', 'A', '2019-06-17 18:57:28', '2019-06-17 18:57:28');
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_query`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('labReportTAT', 'Lab TAT Report', null, '[]', 'reportHeader', 'A', '2019-06-17 18:57:28', '2019-06-17 18:57:28');


-- =================================  Start Oct 23 2020 =======================================
-- ******** Order Consumable
ALTER TABLE `hims_f_ordered_inventory` 
ADD COLUMN `instructions` VARCHAR(150) NULL AFTER `trans_package_detail_id`;

-- ******** Sick Leave Report Bug - Fix
UPDATE `algaeh_d_reports` SET `report_query` = 'select P.patient_code,P.full_name as patient_full_name,P.arabic_name as patient_arabaic_full_name,\nP.registration_date,SL.from_date,SL.to_date,SL.no_of_days,SL.remarks, PV.visit_date,EC.comment, ID.icd_description,\nSDEP.sub_department_name,SDEP.arabic_sub_department_name, EMP.full_name, EMP.arabic_name from hims_f_patient_sick_leave as SL inner join hims_f_patient P on P.hims_d_patient_id = SL.patient_id\ninner join hims_f_patient_visit PV on PV.hims_f_patient_visit_id = SL.visit_id left join hims_f_episode_chief_complaint EC\non EC.episode_id = SL.episode_id left join hims_f_patient_diagnosis PD on  PD.episode_id = SL.episode_id left join \nhims_d_icd ID on ID.hims_d_icd_id = PD.daignosis_id inner join hims_d_employee EMP on PV.doctor_id = EMP.hims_d_employee_id\ninner join hims_d_sub_department SDEP on PV.sub_department_id = SDEP.hims_d_sub_department_id\nwhere SL.patient_id=? and SL.visit_id=? and SL.episode_id = ?;' WHERE (`report_id` = '17');

-- ******** Sick Leave New Format Changes
UPDATE `algaeh_d_reports` SET `report_name_for_header` = 'Medical Certificate' WHERE (`report_id` = '17');
ALTER TABLE `hims_f_patient_sick_leave` ADD COLUMN (reported_sick enum('Y','N'), accompanying_patient enum('Y','N'), patient_unfit enum('Y','N'), advice_light_duty enum('Y','N'), pat_need_emp_care enum('Y','N')) ;
ALTER TABLE `hims_f_patient_sick_leave` 
CHANGE COLUMN `reported_sick` `reported_sick` ENUM('Y', 'N') NULL DEFAULT 'N' ,
CHANGE COLUMN `accompanying_patient` `accompanying_patient` ENUM('Y', 'N') NULL DEFAULT 'N' ,
CHANGE COLUMN `patient_unfit` `patient_unfit` ENUM('Y', 'N') NULL DEFAULT 'N' ,
CHANGE COLUMN `advice_light_duty` `advice_light_duty` ENUM('Y', 'N') NULL DEFAULT 'N' ,
CHANGE COLUMN `pat_need_emp_care` `pat_need_emp_care` ENUM('Y', 'N') NULL DEFAULT 'N' ;
update algaeh_d_reports set report_query = null where report_name = 'sickLeave';

-- =================================  Start Oct 24 2020 =======================================
-- ******** Security Added for Nursing Section
INSERT INTO`algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('31', 'NUR_PAT_VIT', 'Capture Patient Vitals', '2020-10-24 12:17:22', '2020-10-24 12:17:22', 'A');
INSERT INTO`algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('31', 'NUR_PAT_ALRGY', 'Capture Patient Allergy', '2020-10-24 12:17:52', '2020-10-24 12:17:52', 'A');
INSERT INTO`algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('31', 'NUR_PAT_CHF_COM', 'Capture Chief Complaints', '2020-10-24 12:18:11', '2020-10-24 12:18:11', 'A');
INSERT INTO`algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('31', 'NUR_PAT_NOTE', 'Capture Nursing Notes', '2020-10-24 12:18:36', '2020-10-24 12:18:36', 'A');
INSERT INTO`algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('31', 'NUR_ORD_SERV', 'Order Services or Consumables', '2020-10-24 12:19:16', '2020-10-24 12:19:16', 'A');

-- ******** New Field added for Sick Leave Report
ALTER TABLE `hims_f_patient_sick_leave` 
ADD COLUMN `patient_fit` ENUM('Y', 'N') NULL DEFAULT 'N' AFTER `accompanying_patient`,
ADD COLUMN `created_by` INT NULL DEFAULT NULL AFTER `pat_need_emp_care`,
ADD COLUMN `created_date` DATETIME NULL DEFAULT NULL AFTER `created_by`,
ADD COLUMN `updated_by` INT NULL DEFAULT NULL AFTER `created_date`,
ADD COLUMN `updated_date` DATETIME NULL DEFAULT NULL AFTER `updated_by`;

-- ******** Vat Applicable in branch Level
ALTER TABLE `hims_d_hospital` 
ADD COLUMN `vat_applicable` ENUM('N', 'Y') NULL DEFAULT 'N' AFTER `mrn_num_sep_cop_client`;

-- ******** Past Medication
CREATE TABLE `hims_f_past_medication` (
  `hims_f_past_medication_id` INT NOT NULL AUTO_INCREMENT,
  `patient_id` INT NULL DEFAULT NULL,
  `item_id` INT NULL DEFAULT NULL,
  `dosage` VARCHAR(10) NULL DEFAULT NULL,
  `frequency` ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18') CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT '0' COMMENT '0 = 1-0-1\\\\\\\\n1 = 1-0-0\\\\\\\\n2 = 0-0-1\\\\\\\\n3 = 0-1-0\\\\\\\\n4 = 1-1-0\\\\\\\\n5 = 0-1-1\\\\\\\\n6 = 1-1-1\\\\\\\\n7 = Once only\\\\\\\\n8 = Once daily (q24h)\\\\\\\\n9 = Twice daily (Bid)\\\\\\\\n10 = Three times daily (tid)\\\\\\\\n11 = Five times daily\\\\\\\\n12 = Every two hours (q2h)\\\\\\\\n13 = Every three hours (q3h) \\\\\\\\n14 = Every four hours (q4h)\\\\\\\\n15 = Every six hours (q6h)\\\\\\\\n16 = Every eight hours (q8h)\\\\\\\\n17 = Every twelve hours (q12h\\\\\\\\n18 = Four times daily (qid)\\\\\\\\n19 = Other (According To Physician)',
  `no_of_days` INT NULL DEFAULT NULL,
  `dispense` DECIMAL(5,3) NULL DEFAULT NULL,
  `frequency_type` ENUM('PD', 'PH', 'PW', 'PM', 'AD', '2W', '2M', '3M', '4M', '6M') CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT 'PD' COMMENT 'PD = PER DAY\\\\\\\\nPH = PER HOUR\\\\\\\\nPW = PER WEEK\\\\\\\\nPM = PER MONTH\\\\\\\\nAD = ALTERNATE DAY\\\\\\\\n2W = EVERY 2 WEEKS\\\\\\\\n2M = EVERY 2 MONTH\\\\\\\\n3M = EVERY 3 MONTH\\\\\\\\n4M = EVERY 4 MONTH\\\\\\\\n6M = EVERY 6 MONTH\\\\\\\\n',
  `frequency_time` ENUM('BM', 'AM', 'WF', 'EM', 'BB', 'AB') CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT 'BM' COMMENT 'BM = BEFORE MEAL\\\\\\\\nAM = AFTER MEAL\\\\\\\\nWF = WITH FOOD\\\\\\\\nEM = EARLY MORNING\\\\\\\\nBB =BEFORE BED TIME\\\\\\\\nAB =AT BED TIME',
  `frequency_route` ENUM('BL', 'EL', 'IL', 'IF', 'IM', 'IT', 'IR', 'NL', 'OP', 'OR', 'OE', 'RL', 'ST', 'SL', 'TL', 'TD') CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT 'OR' COMMENT 'BL = Buccal\\\\\\\\\\\\\\\\nEL = Enteral\\\\\\\\\\\\\\\\nIL = Inhalation\\\\\\\\\\\\\\\\nIF = Infusion\\\\\\\\\\\\\\\\nIM = Intramuscular Inj\\\\\\\\\\\\\\\\nIT = Intrathecal Inj\\\\\\\\\\\\\\\\nR = Intravenous Inj\\\\\\\\\\\\\\\\nNL = Nasal\\\\\\\\\\\\\\\\nOP = Ophthalmic\\\\\\\\\\\\\\\\nOR = Oral\\\\\\\\\\\\\\\\nOE = Otic (ear)\\\\\\\\\\\\\\\\nRL = Rectal\\\\\\\\\\\\\\\\nST = Subcutaneous\\\\\\\\\\\\\\\\nSL = Sublingual\\\\\\\\\\\\\\\\nTL = Topical\\\\\\\\\\\\\\\\nTD = Transdermal',
  `med_units` VARCHAR(10) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL,
  `start_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `instructions` VARCHAR(250) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL,
  PRIMARY KEY (`hims_f_past_medication_id`));
  
-- ********  Added None on consumption
ALTER TABLE `hims_f_prescription_detail` 
CHANGE COLUMN `frequency_time` `frequency_time` ENUM('BM', 'AM', 'WF', 'EM', 'BB', 'AB', 'NN') CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT 'BM' COMMENT 'BM = BEFORE MEAL\\\\nAM = AFTER MEAL\\\\nWF = WITH FOOD\\\\nEM = EARLY MORNING\\\\nBB =BEFORE BED TIME\\\\nAB =AT BED TIME\\\\nNN =None' ;

-- ********  Bill Cancellation If consultant too cancel
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('64', 'OP_CAL_MAIN', 'Maintenance', '2020-10-23 16:38:47', '2020-10-23 16:38:47', 'A');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('64', 'OP_CAL_CON', 'Cancel If Consultant', '2020-10-23 16:39:06', '2020-10-23 16:39:06', 'A');

-- =================================  Start Oct 26 2020 =======================================
-- ******** Consumption Patient Id Added
ALTER TABLE `hims_f_inventory_consumption_header` 
ADD COLUMN `patient_id` INT NULL AFTER `provider_id`,
ADD COLUMN `cancelled` ENUM('N', 'Y') NULL DEFAULT 'N' AFTER `patient_id`;

-- ******** Appointment Number Change
alter table hims_f_patient_appointment add column tel_code varchar(10) after contact_number;



-- =================================  Start Oct 27 2020 =======================================
-- ******** Consumption changes
ALTER TABLE `hims_f_inventory_consumption_detail` ADD COLUMN `ordered_inventory_id` INT NULL AFTER `item_group_id`;
ALTER TABLE `hims_f_inventory_consumption_detail` ADD COLUMN `cancelled` ENUM('N', 'Y') NULL AFTER `extended_cost`;
ALTER TABLE `hims_f_inventory_trans_history` CHANGE COLUMN `transaction_type` `transaction_type` ENUM('MR', 'CSN' ,'PO', 'DN', 'DNA', 'REC', 'INV', 'PR', 'CN', 'DBN', 'AD', 'ST', 'CS', 'POS', 'SRT', 'INT', 'OP', 'ACK', 'SDN') CHARACTER SET 'utf8' COLLATE 'utf8_latvian_ci' NULL DEFAULT NULL COMMENT 'MR\',=MATERIAL REQUISITION\\n\'MRA1\',= MATERIAL REQUISITION AUTHORIZATION1\\n\'MRA2\',= MATERIAL REQUISITION AUTHORIZATION2\\n\'MRA3\',= MATERIAL REQUISITION AUTHORIZATION3\\n\'PO\',=PURCHASE ORDER\\n\'POA1\',= PURCHASE ORDER AUTHORIZATION1\\n\'POA2\',= PURCHASE ORDER AUTHORIZATION2\\n\'POA3\',= PURCHASE ORDER AUTHORIZATION3\\n\'DN\',= DELIVERY NOTE \\n\'DNA\',=DELIVERY NOTE AUTHORIZATION\\n\'REC\',=RECIEPTS\\n\'INV\',= INOVICES\\n\'PR\',= PURCHASE RETURN\\n\'CN\',= CREDIT NOTE\\n\'DBN\',=DEBIT NOTE\\n\'AD\',= ADJUSTMENT\\n\'ST\',=STOCK TRANSFER\\n\'CS\',=CONSUMPTION\\n\'POS\'=POINT OF SALE\\n\'SRT\',=SALES RETURN\\n\'INT\',= INITIAL STOCK\\n\'OP\' = OPBILL\\n’ACK’,= TRANSFER ACKNOWLEDGE\' \\n ’SDN’ = SALES DISPATCH NOTE \\n \'CSN\' = Consumption Cancel \n' ;


-- Insurance StateMent
alter table hims_f_insurance_statement add column from_date date after sub_insurance_id, add column to_date date after from_date;


-- =================================  Start Oct 30 2020 =======================================
-- ******** Added Item Route
ALTER TABLE `hims_d_item_master` 
ADD COLUMN `item_route` ENUM('BL', 'EL', 'IL', 'IF', 'IM', 'IT', 'IR', 'NL', 'OP', 'OR', 'OE', 'RL', 'ST', 'SL', 'TL', 'TD') CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT 'OR' COMMENT 'BL = Buccal\\\\\\\\nEL = Enteral\\\\\\\\nIL = Inhalation\\\\\\\\nIF = Infusion\\\\\\\\nIM = Intramuscular Inj\\\\\\\\nIT = Intrathecal Inj\\\\\\\\nR = Intravenous Inj\\\\\\\\nNL = Nasal\\\\\\\\nOP = Ophthalmic\\\\\\\\nOR = Oral\\\\\\\\nOE = Otic (ear)\\\\\\\\nRL = Rectal\\\\\\\\nST = Subcutaneous\\\\\\\\nSL = Sublingual\\\\\\\\nTL = Topical\\\\\\\\nTD = Transdermal' AFTER `addl_information`;

ALTER TABLE `hims_d_item_master` 
CHANGE COLUMN `item_route` `item_route` ENUM('BL', 'EL', 'IL', 'IF', 'IM', 'IT', 'IV', 'NL', 'OP', 'OR', 'OE', 'RL', 'ST', 'SL', 'TL', 'TD', 'VL', 'IN', 'VR', 'IP', 'ID', 'INV', 'EP') CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT 'OR' COMMENT 'BL = Buccal\\\\nEL = Enteral\\\\nIL = Inhalation\\\\nIF = Infusion\\\\nIM = Intramuscular Inj\\\\nIT = Intrathecal Inj\\\\nIV = Intravenous Inj\\\\nNL = Nasal\\\\nOP = Ophthalmic\\\\nOR = Oral\\\\nOE = Otic (ear)\\\\nRL = Rectal\\\\nST = Subcutaneous\\\\nSL = Sublingual\\\\nTL = Topical\\\\nTD = Transdermal\\\\nVL = Vaginal\\\\nIN = Intravitreal\\\\nVR = Various\\\\nIP= Intraperitoneal\\\\nID= Intradermal\\\\nINV=Intravesical \\\\nEP=Epilesional\n' ;

-- ******** Inventory Consumption Cancel
INSERT INTO `hims_f_inventory_numgen` (`numgen_code`, `module_desc`, `prefix`, `intermediate_series`, `postfix`, `length`, `increment_by`, `numgen_seperator`, `postfix_start`, `postfix_end`, `current_num`, `pervious_num`, `preceding_zeros_req`, `intermediate_series_req`, `reset_slno_on_year_change`, `created_by`, `updated_by`, `record_status`) VALUES ('INV_CON_CAN_NUM', 'INV_CON_CAN_NUM', 'COA', '20', '0', '13', '1', '-', '0', '9999999', '0000000', '0000000', 'Y', 'Y', 'Y', '1', '1', 'A');


-- =================================  Start Oct 31 2020 =======================================

-- ******** Consumption Cancel
CREATE TABLE `hims_f_inventory_can_consumption_header` (
  `hims_f_inventory_can_consumption_header_id` int NOT NULL AUTO_INCREMENT,
  `consumption_header_id` int DEFAULT NULL,
  `can_consumption_number` varchar(20) DEFAULT NULL,
  `location_type` enum('WH','MS','SS') DEFAULT 'SS',
  `location_id` int DEFAULT NULL,
  `can_consumption_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `year` varchar(4) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `period` enum('1','2','3','4','5','6','7','8','9','10','11','12') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT '''1''=JAN\\\\n''2''=FEB\\\\n''3''=MAR\\\\n''4'',=APR\\\\n''5'',=MAY\\\\n''6'',=JUN\\\\n''7'',=JUL\\\\n''8'',=AUG\\\\n''9'',=SEP\\\\n''10'',=OCT\\\\n''11'',=NOV\\\\n''12''=DEC',
  `provider_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `cancelled` enum('N','Y') DEFAULT 'N',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_inventory_can_consumption_header_id`),
  KEY `hims_f_inventory_can_consumption_header_fk1_idx` (`consumption_header_id`),
  KEY `hims_f_inventory_can_consumption_header_fk2_idx` (`location_id`),
  KEY `hims_f_inventory_can_consumption_header_fk4_idx` (`created_by`),
  KEY `hims_f_inventory_can_consumption_header_fk5_idx` (`updated_by`),
  KEY `hims_f_inventory_can_consumption_header_fk6_idx` (`hospital_id`),
  CONSTRAINT `hims_f_inventory_can_consumption_header_fk1` FOREIGN KEY (`consumption_header_id`) REFERENCES `hims_f_inventory_consumption_header` (`hims_f_inventory_consumption_header_id`),
  CONSTRAINT `hims_f_inventory_can_consumption_header_fk2` FOREIGN KEY (`location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`),
  CONSTRAINT `hims_f_inventory_can_consumption_header_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_inventory_can_consumption_header_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_inventory_can_consumption_header_fk5` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `hims_f_inventory_can_consumption_detail` (
  `hims_f_inventory_can_consumption_detail_id` int NOT NULL AUTO_INCREMENT,
  `inventory_can_consumption_header_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `batchno` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `qtyhand` decimal(10,3) DEFAULT NULL,
  `quantity` decimal(5,2) DEFAULT NULL,
  `unit_cost` decimal(10,6) DEFAULT NULL,
  `extended_cost` decimal(20,6) DEFAULT NULL,
  PRIMARY KEY (`hims_f_inventory_can_consumption_detail_id`),
  KEY `hims_f_inventory_can_consumption_detail_fk1_idx` (`inventory_can_consumption_header_id`),
  KEY `hims_f_inventory_can_consumption_detail_fk2_idx` (`item_id`),
  CONSTRAINT `hims_f_inventory_can_consumption_detail_fk1` FOREIGN KEY (`inventory_can_consumption_header_id`) REFERENCES `hims_f_inventory_can_consumption_header` (`hims_f_inventory_can_consumption_header_id`),
  CONSTRAINT `hims_f_inventory_can_consumption_detail_fk2` FOREIGN KEY (`item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


ALTER TABLE `hims_f_inventory_can_consumption_detail` 
ADD COLUMN `cancelled` ENUM('Y', 'N') NULL DEFAULT 'N' AFTER `extended_cost`;


-- ******** Cancel consumption Num gen
INSERT INTO `hims_f_inventory_numgen` (`hims_f_inventory_numgen_id`, `numgen_code`, `module_desc`, `prefix`, `intermediate_series`, `postfix`, `length`, `increment_by`, `numgen_seperator`, `postfix_start`, `postfix_end`, `current_num`, `pervious_num`, `preceding_zeros_req`, `intermediate_series_req`, `reset_slno_on_year_change`, `created_by`, `created_date`, `updated_by`, `updated_date`, `record_status`) VALUES ('8', 'INV_CON_CAN_NUM', 'INV_CON_CAN_NUM', 'COA', '20', '8', '13', '1', '-', '0', '9999999', '0000000', 'COA-20-000008', 'Y', 'Y', 'Y', '1', '2020-10-30 18:46:03', '1', '2020-10-31 10:38:24', 'A');


-- =================================  Start Nov 02 2020 =======================================

-- ******** Employee Joined Flag - Yes/No
ALTER TABLE `hims_f_leave_application` 
ADD COLUMN `employee_joined` ENUM('N', 'Y') NULL DEFAULT 'N' AFTER `actual_to_date`;

-- ******** Early Rejoin Component Flags
ALTER TABLE `hims_d_earning_deduction` 
ADD COLUMN `early_join_comp` ENUM('N', 'Y') NULL DEFAULT 'N' AFTER `round_off_amount`;

-- ******** Loan EMI Slip
INSERT INTO `algaeh_d_reports` (`report_id`, `report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('152', 'loanEmiSlip', 'Loan Request Slip', '[\"hims_f_loan_application_id\"]', 'reportHeader', 'A', '2020-09-05 10:22:55', '2020-09-05 10:22:55');

-- ******** Added Leave Category in Leave Application
ALTER TABLE `hims_f_leave_application` 
ADD COLUMN `leave_category` ENUM('O', 'A', 'M') NULL DEFAULT 'O' COMMENT 'O =OTHER\\\\\\\\\\\\\\\\nA = ANNUAL\\\\\\\\\\\\\\\\nM = MATERNITY\\\\\\\\n' AFTER `leave_id`;

-- ******** Employee Rejoin Report
INSERT INTO `algaeh_d_reports` (`report_id`, `report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('153', 'rejoinReport', 'Employee Rejoin Report', '[\"hospital_id\"]', 'reportHeader', 'A', '2020-09-05 10:22:55', '2020-09-05 10:22:55');

-- =================================  Start Nov 04 2020 =======================================

-- ******** For Chronic conditions
 CREATE TABLE `hims_f_chronic` (
  `hims_f_chronic_id` int NOT NULL AUTO_INCREMENT,
  `icd_code_id` int DEFAULT NULL,
  `chronic_inactive` enum('Y','N') DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `added_provider_id` int DEFAULT NULL,
  `updated_provider_id` int DEFAULT NULL,
  `inactive_on_visit_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`hims_f_chronic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ******** For vitals 
alter table hims_d_vitals_header add column box_type enum ('TEXT','NUMBER') default 'NUMBER'
after mandatory;

ALTER TABLE hims_f_patient_vitals
CHANGE COLUMN `vital_value` `vital_value` VARCHAR(15) NULL DEFAULT NULL ;

-- ******** Lab Specimen Collection Container id
ALTER TABLE `hims_f_lab_sample` 
ADD COLUMN `container_id` INT NULL AFTER `sample_id`,
ADD INDEX `hims_f_lab_sample_fk6_idx` (`container_id` ASC) VISIBLE;
ALTER TABLE `hims_f_lab_sample` 
ADD CONSTRAINT `hims_f_lab_sample_fk6`
  FOREIGN KEY (`container_id`)
  REFERENCES `hims_d_lab_container` (`hims_d_lab_container_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


ALTER TABLE `hims_m_lab_specimen` 
ADD UNIQUE INDEX `hims_m_lab_specimen_uq1` (`test_id` ASC, `specimen_id` ASC) VISIBLE;
;

-- ******** Loan Reconciliation Report
INSERT INTO `algaeh_d_reports` (`report_id`, `report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('154', 'loanReconcileReport', 'Loan Reconciliation Report', '[\"hospital_id\",\"year\",\"month\",\"sub_department_id\",\"employee_id\",\"employee_group_id\"]', 'reportHeader', 'A', '2019-06-18 14:53:28', '2019-06-18 14:53:28');


-- =================================  Start Nov 05 2020 =======================================

-- ******** Sample rejection History
CREATE TABLE `hims_f_sample_can_history` (
  `hims_f_sample_can_history_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `lab_sample_id` int DEFAULT NULL,
  `sample_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `remarks` varchar(100) DEFAULT NULL,
  `rejected_by` int DEFAULT NULL,
  `rejected_date` datetime DEFAULT NULL,
  PRIMARY KEY (`hims_f_sample_can_history_id`),
  KEY `hims_f_sample_can_history_fk1_idx` (`order_id`),
  KEY `hims_f_sample_can_history_fk2_idx` (`lab_sample_id`),
  KEY `hims_f_sample_can_history_fk3_idx` (`sample_id`),
  KEY `hims_f_sample_can_history_fk4_idx` (`patient_id`),
  KEY `hims_f_sample_can_history_fk5_idx` (`visit_id`),
  CONSTRAINT `hims_f_sample_can_history_fk1` FOREIGN KEY (`order_id`) REFERENCES `hims_f_lab_order` (`hims_f_lab_order_id`),
  CONSTRAINT `hims_f_sample_can_history_fk2` FOREIGN KEY (`lab_sample_id`) REFERENCES `hims_f_lab_sample` (`hims_d_lab_sample_id`),
  CONSTRAINT `hims_f_sample_can_history_fk3` FOREIGN KEY (`sample_id`) REFERENCES `hims_d_lab_specimen` (`hims_d_lab_specimen_id`),
  CONSTRAINT `hims_f_sample_can_history_fk4` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_sample_can_history_fk5` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- =================================  Start Nov 06 2020 =======================================
-- ******** Radiology Uniq
ALTER TABLE `hims_f_rad_order` 
ADD UNIQUE INDEX `ordered_services_id_UNIQUE` (`ordered_services_id` ASC) VISIBLE;
;
-- ******** Preapproval service name
ALTER TABLE `hims_f_service_approval` 
CHANGE COLUMN `insurance_service_name` `insurance_service_name` VARCHAR(200) NULL DEFAULT NULL ;


-- =================================  Start Nov 07 2020 =======================================
-- ******** Enum for Analyte Report Group
ALTER TABLE `hims_m_lab_analyte` 
ADD COLUMN `analyte_report_group` ENUM('P', 'M', 'N') NULL DEFAULT 'N' COMMENT 'P=Physical Appearance,M=Microscopic,N=None' AFTER `result_unit`;


-- ******** Lab Report Collected Date Corrected
UPDATE `algaeh_d_reports` SET `report_query` = 'select P.patient_code,trim(E.full_name) as doctor_name,P.full_name as patient_name,SD.sub_department_name, gender, age_in_years,   age_in_months,age_in_days, IP.insurance_provider_name, P.primary_id_no from hims_f_patient P    inner join hims_f_patient_visit V on P.hims_d_patient_id = V.patient_id    inner join hims_d_employee E on E.hims_d_employee_id = V.doctor_id    inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id   left join hims_m_patient_insurance_mapping IM on IM.patient_visit_id=V.hims_f_patient_visit_id  left join hims_d_insurance_provider IP on IM.primary_insurance_provider_id=IP.hims_d_insurance_provider_id    where P.hims_d_patient_id=? and V.hims_f_patient_visit_id=?;   select MS.hims_d_lab_specimen_id, MS.`description` as investigation_name,LA.description as analyte_name, LS.collected_date, LO.ordered_date,LO.entered_date,LO.validated_date, LO.critical_status,LO.comments,OA.result,OA.result_unit,TRIM(TRAILING \'.\' FROM TRIM(TRAILING \'0\' from OA.normal_low)) as normal_low, TRIM(TRAILING \'.\' FROM TRIM(TRAILING \'0\' from OA.normal_high)) as normal_high, OA.critical_low,OA.critical_high,S.service_name,    E.full_name as validated_by,OA.critical_type, TC.category_name, OA.text_value, OA.analyte_type from hims_f_lab_order LO   inner join hims_f_lab_sample LS on LO.hims_f_lab_order_id = LS.order_id    inner join hims_f_ord_analytes OA on LO.hims_f_lab_order_id = OA.order_id    inner join hims_d_lab_specimen MS on LS.sample_id = MS.hims_d_lab_specimen_id    inner join hims_d_lab_analytes LA on OA.analyte_id = LA.hims_d_lab_analytes_id     inner join hims_d_services S on S.hims_d_services_id= LO.service_id     inner join algaeh_d_app_user U on LO.validated_by=U.algaeh_d_app_user_id   inner join hims_d_employee E on  U.employee_id=E.hims_d_employee_id     inner join hims_d_investigation_test IT on IT.services_id= LO.service_id   inner join hims_d_test_category TC on TC.hims_d_test_category_id= IT.category_id  where LO.visit_id = ? and LO.hims_f_lab_order_id=?;' WHERE (`report_id` = '4');
UPDATE `algaeh_d_reports` SET `report_query` = 'select P.patient_code,trim(E.full_name) as doctor_name,P.full_name as patient_name,SD.sub_department_name, gender, age_in_years,   age_in_months,age_in_days, IP.insurance_provider_name, P.primary_id_no from hims_f_patient P    inner join hims_f_patient_visit V on P.hims_d_patient_id = V.patient_id    inner join hims_d_employee E on E.hims_d_employee_id = V.doctor_id    inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id   left join hims_m_patient_insurance_mapping IM on IM.patient_visit_id=V.hims_f_patient_visit_id  left join hims_d_insurance_provider IP on IM.primary_insurance_provider_id=IP.hims_d_insurance_provider_id    where P.hims_d_patient_id=? and V.hims_f_patient_visit_id=?; select MS.hims_d_lab_specimen_id, MS.`description` as investigation_name,LA.description as analyte_name,LS.collected_date, LO.ordered_date,LO.entered_date,LO.validated_date, LO.critical_status,LO.comments,OA.result,OA.result_unit,TRIM(TRAILING \'.\' FROM TRIM(TRAILING \'0\' from OA.normal_low)) as normal_low, TRIM(TRAILING \'.\' FROM TRIM(TRAILING \'0\' from OA.normal_high)) as normal_high, OA.critical_low,OA.critical_high,S.service_name,    E.full_name as validated_by,OA.critical_type, TC.category_name, OA.text_value, OA.analyte_type from hims_f_lab_order LO   inner join hims_f_lab_sample LS on LO.hims_f_lab_order_id = LS.order_id    inner join hims_f_ord_analytes OA on LO.hims_f_lab_order_id = OA.order_id    inner join hims_d_lab_specimen MS on LS.sample_id = MS.hims_d_lab_specimen_id    inner join hims_d_lab_analytes LA on OA.analyte_id = LA.hims_d_lab_analytes_id     inner join hims_d_services S on S.hims_d_services_id= LO.service_id     inner join algaeh_d_app_user U on LO.validated_by=U.algaeh_d_app_user_id   inner join hims_d_employee E on  U.employee_id=E.hims_d_employee_id     inner join hims_d_investigation_test IT on IT.services_id= LO.service_id   inner join hims_d_test_category TC on TC.hims_d_test_category_id= IT.category_id  where LO.visit_id = ? and LO.hims_f_lab_order_id=?;' WHERE (`report_id` = '69');


-- =================================  Start Nov 09 2020 =======================================
-- ******** Added Sick Leave Diagnosis Data
ALTER TABLE `hims_f_patient_sick_leave` ADD COLUMN `diagnosis_data` VARCHAR(250) NULL DEFAULT NULL AFTER `no_of_days`;


-- ******** Vitals Changes
alter table `hims_d_vitals_header` add column box_type enum ('TEXT','NUMBER') default 'NUMBER' after mandatory;
ALTER TABLE `hims_f_patient_vitals` CHANGE COLUMN `vital_value` `vital_value` VARCHAR(15) NULL DEFAULT NULL ;
ALTER TABLE `hims_d_vitals_header` CHANGE COLUMN `vital_short_name` `vital_short_name` VARCHAR(15) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT NULL COMMENT 'Short Name' ;

-- ******** Added one more column in report table for define report from which screen/module
ALTER TABLE `algaeh_d_reports` 
ADD COLUMN `report_module` VARCHAR(45) NULL DEFAULT NULL AFTER `report_id`;

-- =================================  Start Nov 10 2020 =======================================

-- ******** Added one more column in report table for define report from which screen/module
ALTER TABLE `hims_f_final_settlement_header` 
CHANGE COLUMN `employee_status` `employee_status` ENUM('R', 'T', 'E', 'I') NULL DEFAULT NULL COMMENT 'R=RESIGNED\\\\nT= TERMINATED\\\\nE= RETIRED\\nI=Inactive' ;


-- =================================  Start Nov 11 2020 =======================================
-- ******** Cronic Mecication Query
ALTER TABLE `hims_f_chronic` ADD COLUMN `chronic_category` ENUM('D', 'M') NULL DEFAULT 'D' COMMENT 'D=Diagnosisn/M=Medication' AFTER `hims_f_chronic_id`,
ADD COLUMN `item_id` INT NULL DEFAULT NULL AFTER `icd_code_id`;
ALTER TABLE `hims_f_chronic` ADD COLUMN `medication_category` ENUM('I', 'E') NULL DEFAULT NULL COMMENT 'I=Internal/E=External' AFTER `item_id`;


-- ******** Package and ordering and normal billing of lab and radiology cancellation issue sloved
ALTER TABLE `hims_f_lab_order` 
ADD COLUMN `ordered_package_id` INT NULL AFTER `ordered_services_id`;

ALTER TABLE `hims_f_lab_order` 
ADD COLUMN `billing_header_id` INT NULL AFTER `ordered_package_id`;

ALTER TABLE `hims_f_rad_order` 
ADD COLUMN `ordered_package_id` INT NULL AFTER `ordered_services_id`,
ADD COLUMN `billing_header_id` INT NULL AFTER `ordered_package_id`;

ALTER TABLE `hims_f_billing_details` 
DROP FOREIGN KEY `hims_f_billng_details_fk7`,
DROP FOREIGN KEY `hims_f_billng_details_fk6`;
ALTER TABLE `hims_f_billing_details` 
DROP INDEX `hims_f_billng_details_fk7_idx` ,
DROP INDEX `hims_f_billng_details_fk6_idx` ;
;

-- ******** Added New Result Dispatch Screen
INSERT INTO `algaeh_d_app_screens` (`algaeh_app_screens_id`, `screen_code`, `screen_name`, `page_to_redirect`, `module_id`, `other_language`, `created_date`, `updated_date`, `record_status`) VALUES ('181', 'LB0004', 'Result Dispatch', 'ResultDispatch', '6', 'نتيجة الإرسال', '2020-11-11 14:42:06', '2020-11-11 14:42:06', 'A');


-- =================================  Start Nov 12 2020 =======================================
-- ******** Added Blood Group Field
ALTER TABLE `hims_f_patient` 
ADD COLUMN `blood_group` VARCHAR(15) NULL DEFAULT NULL AFTER `age`;

-- =================================  Start Nov 13 2020 =======================================
-- ******** Pat reg, address 100 characters increase to 300
ALTER TABLE `hims_f_patient` 
CHANGE COLUMN `address1` `address1` MEDIUMTEXT NULL DEFAULT NULL ;

-- ******** Added Load Smart Card Under Security
INSERT INTO `algaeh_d_app_component` (`algaeh_d_app_component_id`, `screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('213', '18', 'PAT_SMT_CRD', 'Load from Smart Card', '2020-11-13 15:20:02', '2020-11-13 15:20:02', 'I');

-- ******** Medication Route Enum Updated
ALTER TABLE `hims_f_prescription_detail` 
CHANGE COLUMN `frequency_route` `frequency_route` ENUM('BL', 'EL', 'IL', 'IF', 'IM', 'IT', 'IV', 'NL', 'OP', 'OR', 'OE', 'RL', 'ST', 'SL', 'TL', 'TD') CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NULL DEFAULT 'OR' COMMENT 'BL = Buccal\\\\\\\\nEL = Enteral\\\\\\\\nIL = Inhalation\\\\\\\\nIF = Infusion\\\\\\\\nIM = Intramuscular Inj\\\\\\\\nIT = Intrathecal Inj\\\\\\\\nIV = Intravenous Inj\\\\\\\\nNL = Nasal\\\\\\\\nOP = Ophthalmic\\\\\\\\nOR = Oral\\\\\\\\nOE = Otic (ear)\\\\\\\\nRL = Rectal\\\\\\\\nST = Subcutaneous\\\\\\\\nSL = Sublingual\\\\\\\\nTL = Topical\\\\\\\\nTD = Transdermal' ;


-- =================================  Start Nov 14 2020 =======================================
-- ******** Bill Amendment
INSERT INTO `algaeh_d_app_screens` (`screen_code`, `screen_name`, `page_to_redirect`, `module_id`, `other_language`) VALUES ('BL0007', 'OP Bill Adjustment', 'OPBillAdjustment', '5', 'تعديل فاتورة OP');

ALTER TABLE `hims_f_billing_header` 
ADD COLUMN `from_bill_id` INT NULL AFTER `bill_comments`,
ADD COLUMN `adjusted` ENUM('N', 'Y') NULL DEFAULT 'N' AFTER `from_bill_id`,
ADD COLUMN `adjusted_by` INT NULL AFTER `adjusted`,
ADD COLUMN `adjusted_date` DATETIME NULL AFTER `adjusted_by`;

ALTER TABLE `hims_f_patient_visit` 
ADD COLUMN `shift_id` INT NULL AFTER `approval_limit_yesno`;

ALTER TABLE `hims_f_billing_header` 
ADD COLUMN `shift_id` INT NULL AFTER `adjusted_date`;

UPDATE `algaeh_d_reports` SET `report_query` = 'select BH.hims_f_billing_header_id,BH.bill_date,BD.hims_f_billing_details_id,BD.service_type_id, ST.service_type_code,ST.service_type, sum(BD.net_amout)as total_amount from hims_f_billing_header BH inner join hims_f_billing_details BD on BH.hims_f_billing_header_id=BD.hims_f_billing_header_id inner join hims_d_service_type ST on BD.service_type_id=ST.hims_d_service_type_id and ST.record_status=\'A\' where BH.hospital_id=? and  BH.record_status=\'A\' and BD.cancel_yes_no=\'N\' and adjusted=\'N\' and BD.record_status=\'A\' and date(BH.bill_date) between date(?) and date(?)  group by BD.service_type_id ' WHERE (report_name='opBillSummary' and `report_id` >0);


-- =================================  Start Nov 16 2020 =======================================
-- ******** Haematology Report

UPDATE `algaeh_d_reports` SET `report_query` = 'select P.patient_code,trim(E.full_name) as doctor_name,P.full_name as patient_name,SD.sub_department_name, gender, age_in_years,   age_in_months,age_in_days, IP.insurance_provider_name, P.primary_id_no from hims_f_patient P    inner join hims_f_patient_visit V on P.hims_d_patient_id = V.patient_id    inner join hims_d_employee E on E.hims_d_employee_id = V.doctor_id    inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id   left join hims_m_patient_insurance_mapping IM on IM.patient_visit_id=V.hims_f_patient_visit_id  left join hims_d_insurance_provider IP on IM.primary_insurance_provider_id=IP.hims_d_insurance_provider_id    where P.hims_d_patient_id=? and V.hims_f_patient_visit_id=?;   select MS.hims_d_lab_specimen_id, MS.`description` as investigation_name,LA.description as analyte_name, LO.ordered_date,LO.entered_date,LO.validated_date, LO.critical_status,LO.comments,OA.result,OA.result_unit,TRIM(TRAILING \'.\' FROM TRIM(TRAILING \'0\' from OA.normal_low)) as normal_low, TRIM(TRAILING \'.\' FROM TRIM(TRAILING \'0\' from OA.normal_high)) as normal_high, OA.critical_low,OA.critical_high,S.service_name,    E.full_name as validated_by,OA.critical_type, TC.category_name, OA.text_value, OA.analyte_type from hims_f_lab_order LO   inner join hims_f_lab_sample LS on LO.hims_f_lab_order_id = LS.order_id    inner join hims_f_ord_analytes OA on LO.hims_f_lab_order_id = OA.order_id    inner join hims_d_lab_specimen MS on LS.sample_id = MS.hims_d_lab_specimen_id    inner join hims_d_lab_analytes LA on OA.analyte_id = LA.hims_d_lab_analytes_id     inner join hims_d_services S on S.hims_d_services_id= LO.service_id     inner join algaeh_d_app_user U on LO.validated_by=U.algaeh_d_app_user_id   inner join hims_d_employee E on  U.employee_id=E.hims_d_employee_id     inner join hims_d_investigation_test IT on IT.services_id= LO.service_id   inner join hims_d_test_category TC on TC.hims_d_test_category_id= IT.category_id  where LO.visit_id = ? and LO.hims_f_lab_order_id=? order by hims_f_ord_analytes_id;' WHERE (report_name = 'hematologyTestReport' and `report_id` >0);


-- =================================  Start Nov 17 2020 =======================================
-- ******** Leave and Gratuity Report Seperted

INSERT INTO `algaeh_d_reports` (`report_id`, `report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('155', 'gratuity_reconcil_Report', 'Gratuity Reconciliation Report', '[\"hospital_id\",\"year\",\"month\",\"sub_department_id\",\"employee_id\",\"employee_group_id\"]', 'reportHeader', 'A', '2019-06-18 14:53:28', '2019-06-18 14:53:28');
UPDATE `algaeh_d_reports` SET `report_name_for_header` = 'Leave & Airfare Reconciliation Report' WHERE (`report_id` = '148');

-- =================================  Start Nov 18 2020 =======================================
-- ******** Insurance Template Field Added
ALTER TABLE `hims_d_insurance_sub` 
ADD COLUMN `ins_template_name` VARCHAR(100) NULL DEFAULT NULL AFTER `child_id`;

-- ******** Medicine and ICD Favorite Table
CREATE TABLE `hims_f_favourite_icd_med` (
  `hims_f_favourite_icd_med_id` int NOT NULL AUTO_INCREMENT,
  `fav_category` ENUM('M', 'I') NOT NULL DEFAULT 'M',
  `icd_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `added_provider_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_provider_id` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`hims_f_favourite_icd_med_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ******** Clinical Desk Dental Functionality changes
ALTER TABLE `hims_f_ordered_services` 
CHANGE COLUMN `teeth_number` `teeth_number` VARCHAR(100) NULL DEFAULT NULL ;
Alter table hims_f_dental_treatment drop column teeth_number;
alter table hims_f_dental_treatment Add column teeth_number varchar(100);
-- ============
ALTER TABLE `hims_f_billing_details` 
CHANGE COLUMN `teeth_number` `teeth_number` VARCHAR(100) NULL DEFAULT NULL ;



-- =================================  Start Nov 22 2020 =======================================

-- ******** Advance Salary Slip
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('advanceSlip', 'Advance Request Slip', '[\"hims_f_employee_advance_id\"]', 'reportHeader', 'A', '2020-09-05 10:22:55', '2020-09-05 10:22:55');


-- =================================  Start Nov 23 2020 =======================================

-- ******** PO Revert Option
ALTER TABLE `hims_f_procurement_po_header` 
ADD COLUMN `is_revert` ENUM('N', 'Y') NULL DEFAULT 'N' AFTER `authorize2_date`,
ADD COLUMN `revert_reason` VARCHAR(200) NULL AFTER `is_revert`,
ADD COLUMN `reverted_by` INT NULL AFTER `revert_reason`,
ADD COLUMN `reverted_date` DATETIME NULL AFTER `reverted_by`;


ALTER TABLE `hims_f_procurement_grn_header` 
ADD COLUMN `is_revert` ENUM('N', 'Y') NULL DEFAULT 'N' AFTER `invoice_posted`,
ADD COLUMN `reverted_by` INT NULL DEFAULT NULL AFTER `is_revert`,
ADD COLUMN `reverted_date` DATETIME NULL DEFAULT NULL AFTER `reverted_by`;



-- =================================  Start Nov 24 2020 =======================================

-- ******** Sales Invoice - Service Decimal Value Issue
UPDATE `algaeh_d_reports` SET `report_query` = 'select H.*, D.*,S.service_name, S.arabic_service_name, SO.sales_order_number, CASE WHEN D.service_frequency=\'M\' THEN \'Monthly\' WHEN D.service_frequency=\'W\'  THEN \'Weekly\' WHEN D.service_frequency=\'D\' THEN \'Daily\'  WHEN D.service_frequency=\'H\' THEN \'Hourly\' END as service_frequency,  SO.customer_po_no, C.customer_name, C.bank_account_no, C.bank_name,  C.address, C.arabic_customer_name, C.vat_number, ROUND(D.tax_percentage, 0) as tax_percentage, D.quantity , HO.hospital_name, CASE WHEN H.is_posted=\'N\' THEN \'Invoice Not Finalized\' ELSE \'\' END as invoice_status from hims_f_sales_invoice_header H   inner join hims_f_sales_invoice_services D on H.hims_f_sales_invoice_header_id = D.sales_invoice_header_id   inner join hims_d_services S on S.hims_d_services_id = D.services_id   inner join hims_d_customer C on C.hims_d_customer_id = H.customer_id   inner join hims_d_hospital HO on HO.hims_d_hospital_id = H.hospital_id   left join hims_f_sales_order SO on SO.hims_f_sales_order_id=H.sales_order_id where invoice_number=?; select organization_name from hims_d_organization;' WHERE (`report_id` = '134');


-- ******** Lab Merge Report Query
insert into algaeh_d_reports(report_name,report_name_for_header,report_header_file_name) values('labMerge','Visit wise lab report','labMergeHead');

-- ******** Revert From Dayend
CREATE TABLE `finance_revert_day_end_header` (
  `finance_revert_day_end_header_id` int NOT NULL AUTO_INCREMENT,
  `day_end_header_id` int DEFAULT NULL,
  `transaction_date` date NOT NULL,
  `amount` decimal(15,4) DEFAULT NULL,
  `voucher_type` enum('journal','contra','receipt','payment','sales','purchase','credit_note','debit_note') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'journal,contra,receipt,payment,sales,purchase,credit_note,debit_note',
  `document_number` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `document_id` int DEFAULT NULL,
  `invoice_no` varchar(45) DEFAULT NULL,
  `from_screen` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `narration` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `entered_by` int DEFAULT NULL,
  `entered_date` datetime DEFAULT NULL,
  PRIMARY KEY (`finance_revert_day_end_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `finance_revert_day_end_sub_detail` (
  `finance_revert_day_end_sub_detail_id` int NOT NULL AUTO_INCREMENT,
  `revert_day_end_header_id` int NOT NULL,
  `month` tinyint unsigned DEFAULT NULL,
  `year` smallint unsigned DEFAULT NULL,
  `payment_date` date NOT NULL,
  `head_id` int NOT NULL,
  `child_id` int unsigned NOT NULL,
  `debit_amount` decimal(15,4) DEFAULT NULL,
  `payment_type` enum('DR','CR') NOT NULL COMMENT 'DR=DEBIT,CR=CREDIT',
  `credit_amount` decimal(15,4) DEFAULT NULL,
  `hospital_id` int unsigned DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `sub_department_id` int DEFAULT NULL,
  PRIMARY KEY (`finance_revert_day_end_sub_detail_id`),
  KEY `finance_revert_day_end_sub_detail_fk1_idx` (`revert_day_end_header_id`),
  CONSTRAINT `finance_revert_day_end_sub_detail_fk1` FOREIGN KEY (`revert_day_end_header_id`) REFERENCES `finance_revert_day_end_header` (`finance_revert_day_end_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ******** Lab Analyte reference_range_required
ALTER TABLE `hims_d_lab_analytes` Add column reference_range_required enum('Y','N') Default 'Y';

ALTER TABLE `hims_m_lab_analyte` 
CHANGE COLUMN `analyte_report_group` `analyte_report_group` ENUM('P', 'M', 'D', 'C', 'N') NULL DEFAULT 'N' COMMENT 'P=Physical Appearance,M=Microscopic Examination,D=Differential leukocyte Count,C=Chemical Examination,N=None' ;



-- =================================  Start Nov 25 2020 =======================================

-- ******** Receipt Entry List New Screen
INSERT INTO `algaeh_d_app_screens` (`algaeh_app_screens_id`, `screen_code`, `screen_name`, `page_to_redirect`, `module_id`, `other_language`, `created_date`, `updated_date`, `record_status`) VALUES ('183', 'PR0011', 'Receipt Entry List', 'ReceiptEntryList', '15', 'قائمة إدخال الإيصال', '2020-11-25 09:17:22', '2020-11-25 09:17:22', 'A');



-- =================================  Start Nov 27 2020 =======================================

-- ******** Added View Price List Under Security (by default inactive for all client)
INSERT INTO `algaeh_d_app_component` (`algaeh_d_app_component_id`, `screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('214', '18', 'VEW_PRS_LST', 'View Price List', '2020-11-27 15:05:23', '2020-11-27 15:05:23', 'I');
INSERT INTO `algaeh_d_app_component` (`algaeh_d_app_component_id`, `screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('216', '24', 'OP_VEW_PRS_LST', 'View Price List', '2020-11-27 15:05:51', '2020-11-27 15:05:51', 'I');

-- ******** Leave Approval Closing Balance Issue
ALTER TABLE `hims_f_employee_monthly_leave` 
CHANGE COLUMN `close_balance` `close_balance` DECIMAL(10,2) NULL DEFAULT '0.00' ;

-- ******** Adjustment Finace
CREATE TABLE `finance_adjust_voucher_details` (
  `finance_adjust_voucher_details_id` int NOT NULL AUTO_INCREMENT,
  `finance_voucher_id` int DEFAULT NULL,
  `payment_date` date NOT NULL,
  `month` tinyint unsigned DEFAULT NULL,
  `year` smallint unsigned DEFAULT NULL,
  `head_id` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `child_id` int unsigned NOT NULL,
  `debit_amount` decimal(15,4) NOT NULL,
  `payment_type` enum('DR','CR') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'DR=DEBIT,CR=CREDIT',
  `narration` text,
  `credit_amount` decimal(15,4) NOT NULL,
  `hospital_id` int unsigned DEFAULT NULL,
  `pl_entry` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `is_opening_bal` enum('Y','N') CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'N',
  `is_new_entry` enum('Y','N') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'N',
  `project_id` int DEFAULT NULL,
  `sub_department_id` int DEFAULT NULL,
  `doctor_id` int unsigned DEFAULT NULL,
  `is_deleted` enum('Y','N') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'N',
  `entered_by` int DEFAULT NULL,
  `entered_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `auth1` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `auth1_by` int DEFAULT NULL,
  `auth1_date` datetime DEFAULT NULL,
  `auth2` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `auth2_by` int DEFAULT NULL,
  `auth2_date` datetime DEFAULT NULL,
  `auth_status` enum('A','P','R') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'P' COMMENT 'A=AUTHORIZED,\\nP=PENDING,\\nR=REJECTED',
  `rejected_by` int DEFAULT NULL,
  `rejected_date` datetime DEFAULT NULL,
  `rejected_reason` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`finance_adjust_voucher_details_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =================================  Start Nov 30 2020 =======================================

-- ******** Algaeh Master Screen Added in Security
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('63', 'ALG_RPT_MST', 'Report Master', '2020-11-30 11:53:46', '2020-11-30 11:53:46', 'I');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('63', 'ALG_MODLES', 'Modules', '2020-11-30 12:01:03', '2020-11-30 12:01:03', 'I');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('63', 'ALG_SCREEN', 'Screens', '2020-11-30 12:01:16', '2020-11-30 12:01:16', 'I');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('63', 'ALG_COMPO', 'Components', '2020-11-30 12:01:31', '2020-11-30 12:01:31', 'I');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('63', 'ALG_SCR_ELE', 'Screen Elements', '2020-11-30 12:01:46', '2020-11-30 12:01:46', 'I');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('63', 'ALG_FORM', 'Formula Master', '2020-11-30 12:03:32', '2020-11-30 12:03:32', 'I');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('63', 'ALG_LAB_CONF', 'Lab Configuration', '2020-11-30 12:59:03', '2020-11-30 12:59:03', 'I');

-- =================================  Start Dec 02 2020 =======================================
-- ******** Algaeh Master Screen Added in Security
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_header_file_name`, `status`, `created_datetime`, `created_by`, `updated_by`, `update_datetime`) VALUES ('patSummaryReport', 'Patient Summary Report', 'reportHeader', 'A', '2019-05-24 23:46:22', '3', '3', '2019-05-24 23:46:22');


