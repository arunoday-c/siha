
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
