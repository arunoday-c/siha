
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
CHARACTER SET utf8mb4 NULL,
    MODIFY COLUMN voucher_type ENUM('journal', 'contra', 'receipt', 'payment', 'sales', 'purchase', 'credit_note', 'debit_note')  CHARACTER SET utf8mb4 NULL COMMENT 'journal,contra,receipt,payment,sales,purchase,credit_note,debit_note',
    MODIFY COLUMN document_number VARCHAR(45) CHARACTER SET utf8mb4 NULL,

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


-- =================================  Start Oct 18 2020 =======================================
-- ******** Leave Request Slip
INSERT INTO `algaeh_d_reports` ( `report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ( 'LeaveRequestSlip', 'Leave Request Slip', '[\"hims_f_leave_application_id\"]', 'reportHeader', 'A', '2019-07-25 18:21:38', '2019-07-25 18:21:38');

-- ******** Employee Payroll Details Report
INSERT INTO `algaeh_d_reports` ( `report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('employeePayrollDetails', 'Employee Payroll Details', '[\"hospital_id\",\"employee_group_id\",\"month\",\"year\",\"year\",\"month\",\"year\",\"month\"]', 'voucherHeader', 'A', '2020-09-05 10:22:55', '2020-09-05 10:22:55');
