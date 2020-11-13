use algaeh_clean_db;
-- Query Start from  08/08/2020
ALTER TABLE `hims_d_sub_department` CHANGE COLUMN `department_type` `department_type` ENUM('D', 'E', 'O', 'N', 'PH', 'I', 'S') NULL DEFAULT 'N' COMMENT 'D=DENTAL\\\\\\\\nE=EMEMERGENCY\\\\\\\\nO=OPTHOMOLOGY\\\\\\\\nN=NONE\\\\nPH=PHARMACY\\\\n I=INVENTORY\\n S=Sales' ;
-- ==================
ALTER TABLE `hims_d_insurance_provider` ADD COLUMN `insurance_statement_count` INT NULL DEFAULT 0 AFTER `effective_end_date`;
-- ==================
ALTER TABLE `hims_f_sales_order` ADD COLUMN `is_posted` ENUM('N', 'Y') NULL DEFAULT 'N' AFTER `contract_id`;
-- ==================
ALTER TABLE `hims_d_lab_analytes_range` CHANGE COLUMN `normal_low` `normal_low` DECIMAL(20,3) NULL DEFAULT NULL , CHANGE COLUMN `normal_high` `normal_high` DECIMAL(20,3) NULL DEFAULT NULL ;
-- ==================
ALTER TABLE `hims_f_procurement_po_header` 
ADD COLUMN `po_mode` ENUM('I', 'S') NULL DEFAULT 'S' COMMENT 'I = Items \\n S = Services' AFTER `po_date`,
ADD COLUMN `project_id` INT NULL DEFAULT NULL AFTER `authorize2_date`,
ADD INDEX `hims_f_procurement_po_header_fk11_idx` (`project_id` ASC) VISIBLE;
	
ALTER TABLE `hims_f_procurement_po_header` 
ADD CONSTRAINT `hims_f_procurement_po_header_fk11`
  FOREIGN KEY (`project_id`)
  REFERENCES `hims_d_project` (`hims_d_project_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


ALTER TABLE `hims_f_procurement_po_header` 
ADD COLUMN `receipt_generated` ENUM('N', 'Y') NULL DEFAULT 'N' AFTER `completed_date`;

-- ==================
CREATE TABLE `hims_f_procurement_po_services` (
  `hims_f_procurement_po_services_id` INT NOT NULL AUTO_INCREMENT,
  `procurement_header_id` INT NULL DEFAULT NULL,
  `services_id` INT NULL DEFAULT NULL,
  `unit_cost` DECIMAL(10,3) NULL DEFAULT '0.000',
  `quantity` DECIMAL(10,2) NULL DEFAULT '0.00',
  `extended_cost` DECIMAL(10,3) NULL DEFAULT '0.000',
  `discount_percentage` DECIMAL(10,6) NULL DEFAULT '0.000000',
  `discount_amount` DECIMAL(10,3) NULL DEFAULT '0.000',
  `net_extended_cost` DECIMAL(10,3) NULL DEFAULT '0.000',
  `tax_percentage` DECIMAL(10,3) NULL DEFAULT '0.000',
  `tax_amount` DECIMAL(10,3) NULL DEFAULT '0.000',
  `total_amount` DECIMAL(10,3) NULL DEFAULT '0.000',
  PRIMARY KEY (`hims_f_procurement_po_services_id`),
  INDEX `hims_f_procurement_po_services_fk1_idx` (`procurement_header_id` ASC) VISIBLE,
  INDEX `hims_f_procurement_po_services_fk2_idx` (`services_id` ASC) VISIBLE,
  CONSTRAINT `hims_f_procurement_po_services_fk1`
    FOREIGN KEY (`procurement_header_id`)
    REFERENCES `hims_f_procurement_po_header` (`hims_f_procurement_po_header_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `hims_f_procurement_po_services_fk2`
    FOREIGN KEY (`services_id`)
    REFERENCES `hims_d_services` (`hims_d_services_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ==================
CREATE TABLE `hims_f_procurement_grn_service` (
  `hims_f_procurement_grn_service_id` INT NOT NULL AUTO_INCREMENT,
  `grn_header_id` INT NULL DEFAULT NULL,
  `services_id` INT NULL DEFAULT NULL,
  `unit_cost` DECIMAL(10,3) NULL DEFAULT '0.000',
  `quantity` DECIMAL(10,2) NULL DEFAULT '0.00',
  `extended_cost` DECIMAL(10,3) NULL DEFAULT '0.000',
  `discount_percentage` DECIMAL(10,6) NULL DEFAULT '0.000',
  `discount_amount` DECIMAL(10,3) NULL DEFAULT '0.000',
  `net_extended_cost` DECIMAL(10,3) NULL DEFAULT '0.000',
  `tax_percentage` DECIMAL(10,3) NULL DEFAULT '0.000',
  `tax_amount` DECIMAL(10,3) NULL DEFAULT '0.000',
  `total_amount` DECIMAL(10,3) NULL DEFAULT '0.000',
  INDEX `hims_f_procurement_grn_service_fk1_idx` (`grn_header_id` ASC) VISIBLE,
  INDEX `hims_f_procurement_grn_service_fk2_idx` (`services_id` ASC) VISIBLE,
  PRIMARY KEY (`hims_f_procurement_grn_service_id`),
  CONSTRAINT `hims_f_procurement_grn_service_fk1`
    FOREIGN KEY (`grn_header_id`)
    REFERENCES `hims_f_procurement_grn_header` (`hims_f_procurement_grn_header_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `hims_f_procurement_grn_service_fk2`
    FOREIGN KEY (`services_id`)
    REFERENCES `hims_d_services` (`hims_d_services_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ==================
CREATE TABLE `hims_f_procurement_grn_service` (
  `hims_f_procurement_grn_service_id` INT NOT NULL AUTO_INCREMENT,
  `grn_header_id` INT NULL DEFAULT NULL,
  `services_id` INT NULL DEFAULT NULL,
  `unit_cost` DECIMAL(10,3) NULL DEFAULT '0.000',
  `quantity` DECIMAL(10,2) NULL DEFAULT '0.00',
  `extended_cost` DECIMAL(10,3) NULL DEFAULT '0.000',
  `discount_percentage` DECIMAL(10,6) NULL DEFAULT '0.000',
  `discount_amount` DECIMAL(10,3) NULL DEFAULT '0.000',
  `net_extended_cost` DECIMAL(10,3) NULL DEFAULT '0.000',
  `tax_percentage` DECIMAL(10,3) NULL DEFAULT '0.000',
  `tax_amount` DECIMAL(10,3) NULL DEFAULT '0.000',
  `total_amount` DECIMAL(10,3) NULL DEFAULT '0.000',
  INDEX `hims_f_procurement_grn_service_fk1_idx` (`grn_header_id` ASC) VISIBLE,
  INDEX `hims_f_procurement_grn_service_fk2_idx` (`services_id` ASC) VISIBLE,
  PRIMARY KEY (`hims_f_procurement_grn_service_id`),
  CONSTRAINT `hims_f_procurement_grn_service_fk1`
    FOREIGN KEY (`grn_header_id`)
    REFERENCES `hims_f_procurement_grn_header` (`hims_f_procurement_grn_header_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `hims_f_procurement_grn_service_fk2`
    FOREIGN KEY (`services_id`)
    REFERENCES `hims_d_services` (`hims_d_services_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ==================

UPDATE `algaeh_d_reports` SET `report_query` = 'select P.patient_code,trim(E.full_name) as doctor_name,P.full_name as patient_name,SD.sub_department_name, gender, age_in_years,\nage_in_months,age_in_days, IP.insurance_provider_name, P.primary_id_no from hims_f_patient P \ninner join hims_f_patient_visit V on P.hims_d_patient_id = V.patient_id \ninner join hims_d_employee E on E.hims_d_employee_id = V.doctor_id \ninner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id \ninner join hims_m_patient_insurance_mapping IM on IM.patient_visit_id=V.hims_f_patient_visit_id \ninner join hims_d_insurance_provider IP on IM.primary_insurance_provider_id=IP.hims_d_insurance_provider_id \nwhere P.hims_d_patient_id=? and V.hims_f_patient_visit_id=?;\nselect MS.hims_d_lab_specimen_id, MS.`description` as investigation_name,LA.description as analyte_name, LO.ordered_date, \nLO.critical_status,LO.comments,OA.result,OA.result_unit,TRIM(TRAILING \'.\' FROM TRIM(TRAILING \'0\' from OA.normal_low)) as normal_low,TRIM(TRAILING \'.\' FROM TRIM(TRAILING \'0\' from OA.normal_high)) as normal_high, OA.critical_low,OA.critical_high,S.service_name, \nE.full_name as validated_by,OA.critical_type, TC.category_name from hims_f_lab_order LO\ninner join hims_f_lab_sample LS on LO.hims_f_lab_order_id = LS.order_id \ninner join hims_f_ord_analytes OA on LO.hims_f_lab_order_id = OA.order_id \ninner join hims_d_lab_specimen MS on LS.sample_id = MS.hims_d_lab_specimen_id \ninner join hims_d_lab_analytes LA on OA.analyte_id = LA.hims_d_lab_analytes_id  \ninner join hims_d_services S on S.hims_d_services_id= LO.service_id  \ninner join algaeh_d_app_user U on LO.validated_by=U.algaeh_d_app_user_id\ninner join hims_d_employee E on  U.employee_id=E.hims_d_employee_id  \ninner join hims_d_investigation_test IT on IT.services_id= LO.service_id\ninner join hims_d_test_category TC on TC.hims_d_test_category_id= IT.category_id\nwhere LO.visit_id = ? and LO.hims_f_lab_order_id=?;' WHERE (report_name = 'hematologyTestReport' and `report_id` >0);

-- ==================
Alter table finance_f_prepayment_request add column prepayment_remarks varchar(100) after request_status;
Alter table finance_f_prepayment_request add column prepayment_remarks varchar(100) after request_status;
Alter table finance_d_prepayment_type Add column employees_req varchar(1) after expense_child_id;

ALTER TABLE `finance_d_prepayment_type` 
CHANGE COLUMN `employees_req` `employees_req` ENUM('N', 'Y') NULL DEFAULT 'N' ;


-- ==================
INSERT INTO `algaeh_d_reports` (`report_id`, `report_name`, `report_name_for_header`, `report_query`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('149', 'userWiseBill', 'Income by Cashier', 'select U.user_display_name, U.employee_id, B.bill_number, B.bill_date, B.net_amount from hims_f_billing_header B inner join algaeh_d_app_user U on B.created_by=U.algaeh_d_app_user_id where date(bill_date) between date(?) and date(?) and U.algaeh_d_app_user_id = ? order by B.created_by;', '[\'from_date\',\'to_date\',\'cashier_id\' ]', 'reportHeader', 'A', '2019-06-11 17:33:35', '2019-06-11 17:33:35');

-- ==================
INSERT INTO `algaeh_d_reports` (`report_id`, `report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('150', 'depDocWiseReport', 'Income by Doctor', '[\"hospital_id\",\"from_date\",\"to_date\",\"sub_department_id\",\"provider_id\"]', 'reportHeader', 'A', '2019-07-25 18:21:38', '2019-07-25 18:21:38');
-- ==================
UPDATE `algaeh_d_reports` SET `report_name_for_header` = 'Income by Department' WHERE (`report_id` = '32');
UPDATE `algaeh_d_reports` SET `report_name_for_header` = 'Income by Receipt Type' WHERE (`report_id` = '36');
UPDATE `algaeh_d_reports` SET `report_name_for_header` = 'Income by Service Type' WHERE (`report_id` = '34');
UPDATE `algaeh_d_reports` SET `report_name_for_header` = 'Income by Services' WHERE (`report_id` = '50');
-- ==================
ALTER TABLE `hims_d_procurement_options` 
ADD COLUMN `po_services` ENUM('N', 'Y') NULL DEFAULT 'N' AFTER `po_auth_level`;
-- ==================
USE `twareat_live_db`;
DROP procedure IF EXISTS `algaeh_proc_item_location`;

DELIMITER $$
USE `twareat_live_db`$$
CREATE DEFINER=`algaeh_root`@`localhost` PROCEDURE `algaeh_proc_item_location`(xmlData TEXT)
BEGIN
 DECLARE exit handler for sqlexception
   BEGIN
   -- RESIGNAL SET MESSAGE_TEXT = 'An Error';
		RESIGNAL SET MYSQL_ERRNO = 5;
    -- ERROR
  ROLLBACK;
	   -- select 'Error in Item Location' as 'Error';
END;
DECLARE exit handler for sqlwarning
 BEGIN
  ROLLBACK;
  END;
 START TRANSACTION;
  set @nrows =0;
  set @rownum = 1;
  set @counter=0;
  set @nrows = extractvalue(xmlData, 'count(//hims_m_item_location)');
  set @uom =0;
  set @convertionFactor=0;
  set @qtyHand=0;
  set @avgcost=0;
  set @operation='';  
 while @rownum <= @nrows do
set @uom =0;
set @average_cost=ExtractValue(xmlData,'//child::*[$@rownum]/average_cost');  


 select count(*) into @counter from hims_m_item_location where item_id = 
ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
pharmacy_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/pharmacy_location_id')
and batchno=ExtractValue(xmlData,'//child::*[$@rownum]/batchno')
and  record_status='A';
 
-- Expiry date and Batch no exists
-- select @counter as counter;
 IF (@counter>0) THEN

-- Check HIMS_D_ITEM_MASTER -- Start
	select stocking_uom_id into @uom from hims_d_item_master where hims_d_item_master_id=ExtractValue(xmlData,'//child::*[$@rownum]/item_id');


	if(@uom <> ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom'))
	then
		select conversion_factor into @convertionFactor from hims_m_item_uom where item_master_id=ExtractValue(xmlData,'//child::*[$@rownum]/item_id') AND
		uom_id=ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom') and record_status='A';
		set @qtyHand =@convertionFactor*ExtractValue(xmlData,'//child::*[$@rownum]/qtyhand');
	else
	   set @qtyHand =ExtractValue(xmlData,'//child::*[$@rownum]/qtyhand');
	end if;
-- END Check HIMS_D_ITEM_MASTER -- END

--   Update Records
	IF ExtractValue(xmlData,'//child::*[$@rownum]/transaction_type') ='AD'
		then
        IF ExtractValue(xmlData,'//child::*[$@rownum]/operation') ='+'
		then
			UPDATE hims_m_item_location set qtyhand =qtyhand+@qtyHand, sale_price =sale_price+ExtractValue(xmlData,'//child::*[$@rownum]/sale_price')
			WHERE item_id = 
			ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
			pharmacy_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/pharmacy_location_id') and
			batchno=ExtractValue(xmlData,'//child::*[$@rownum]/batchno') and record_status='A';
		end if;
		if ExtractValue(xmlData,'//child::*[$@rownum]/operation') ='-'
		then			
            -- select @qtyHand as qtyHand;
            
			UPDATE hims_m_item_location set qtyhand =qtyhand-@qtyHand, sale_price =sale_price-ExtractValue(xmlData,'//child::*[$@rownum]/sale_price')
			WHERE item_id = 
			ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
			pharmacy_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/pharmacy_location_id') and
			batchno= ExtractValue(xmlData,'//child::*[$@rownum]/batchno') and record_status='A';
		-- End Expiry date and Batch no exists
			 
		END IF;
    ELSE
		IF ExtractValue(xmlData,'//child::*[$@rownum]/operation') ='+'
		then
			UPDATE hims_m_item_location set qtyhand =qtyhand+@qtyHand
			WHERE item_id = 
			ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
			pharmacy_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/pharmacy_location_id') and
			batchno=ExtractValue(xmlData,'//child::*[$@rownum]/batchno') and record_status='A';
		end if;
		if ExtractValue(xmlData,'//child::*[$@rownum]/operation') ='-'
		then			
            -- select @qtyHand as qtyHand;
            
			UPDATE hims_m_item_location set qtyhand =qtyhand-@qtyHand
			WHERE item_id = 
			ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
			pharmacy_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/pharmacy_location_id') and
			batchno= ExtractValue(xmlData,'//child::*[$@rownum]/batchno') and record_status='A';
		-- End Expiry date and Batch no exists
			 
		END IF;	
	END IF;	
    
    ELSE
		-- select @counter as counter;
		select stocking_uom_id into @uom from hims_d_item_master where hims_d_item_master_id=ExtractValue(xmlData,'//child::*[$@rownum]/item_id');


		if(@uom <> ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom'))
		then
			select conversion_factor into @convertionFactor from hims_m_item_uom where item_master_id=ExtractValue(xmlData,'//child::*[$@rownum]/item_id') AND
			uom_id=ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom') and record_status='A';
			set @qtyHand =@convertionFactor*ExtractValue(xmlData,'//child::*[$@rownum]/qtyhand');
            set @avgcost = ROUND(ExtractValue(xmlData,'//child::*[$@rownum]/avgcost')/@convertionFactor, 3);
		else
		   set @qtyHand =ExtractValue(xmlData,'//child::*[$@rownum]/qtyhand');
           set @avgcost =ExtractValue(xmlData,'//child::*[$@rownum]/avgcost');
		end if;
        set @average_cost = @avgcost;        
   
		set @expirydt= null;
		if(ExtractValue(xmlData,'//child::*[$@rownum]/expirydt')<>'~')
		then
			set @expirydt = ExtractValue(xmlData,'//child::*[$@rownum]/expirydt');
		end if;
        
        -- select @expirydt as expirydt;
		-- insert record
       
       
        
		insert into hims_m_item_location(`item_id`,`pharmacy_location_id`,`batchno`,`expirydt`,
		`barcode`,`qtyhand`,`qtypo`,`cost_uom`,`avgcost`,`last_purchase_cost`,
		`grn_id`,`grnno`,`sale_price`,`sales_uom`,`mrp_price`,`vendor_batchno`,`hospital_id`,`created_by`,`updated_by`)
        values(ExtractValue(xmlData,'//child::*[$@rownum]/item_id'),
		ExtractValue(xmlData,'//child::*[$@rownum]/pharmacy_location_id'),
        ExtractValue(xmlData,'//child::*[$@rownum]/batchno'),
		 @expirydt,
        ExtractValue(xmlData,'//child::*[$@rownum]/barcode'),
		@qtyHand,ExtractValue(xmlData,'//child::*[$@rownum]/qtypo'),
		ExtractValue(xmlData,'//child::*[$@rownum]/cost_uom'),@avgcost,
		ExtractValue(xmlData,'//child::*[$@rownum]/last_purchase_cost'),
        ExtractValue(xmlData,'//child::*[$@rownum]/grn_id'),
		ExtractValue(xmlData,'//child::*[$@rownum]/grnno'),ExtractValue(xmlData,'//child::*[$@rownum]/sale_price'),
		ExtractValue(xmlData,'//child::*[$@rownum]/sales_uom'),ExtractValue(xmlData,'//child::*[$@rownum]/mrp_price'),
         ExtractValue(xmlData,'//child::*[$@rownum]/vendor_batchno'),ExtractValue(xmlData,'//child::*[$@rownum]/hospital_id'), 
		ExtractValue(xmlData,'//child::*[$@rownum]/created_by'),ExtractValue(xmlData,'//child::*[$@rownum]/updated_by'));
		-- end insert records
        -- select 'Done';
END IF;
  -- select @counter as counter;
  
 set @toLocationId= null;
 
 if(ExtractValue(xmlData,'//child::*[$@rownum]/to_location_id')!='~')
 then
   set @toLocationId = ExtractValue(xmlData,'//child::*[$@rownum]/to_location_id');
 end if;
 set @to_location_type= null;
 if(ExtractValue(xmlData,'//child::*[$@rownum]/to_location_type')!='~')
 then
   set @to_location_type = ExtractValue(xmlData,'//child::*[$@rownum]/to_location_type');
 end if;
  set @expiry_date= null;
 if(ExtractValue(xmlData,'//child::*[$@rownum]/expiry_date')<>'~')
 then
   set @expiry_date = ExtractValue(xmlData,'//child::*[$@rownum]/expiry_date');
 end if;
 
 
  insert into hims_f_pharmacy_trans_history(transaction_type, transaction_id, transaction_date, from_location_id, 
 from_location_type, `year`, period, to_location_id, to_location_type, description, item_category_id, item_group_id, 
 item_code_id, barcode, required_batchno, batchno, expiry_date, transaction_qty, transaction_uom, transaction_cost, 
 transaction_total, discount_percentage, discount_amount, net_total, landing_cost, average_cost, operation, hospital_id,
 created_by, updated_by)
 values(ExtractValue(xmlData,'//child::*[$@rownum]/transaction_type'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_date'),
     ExtractValue(xmlData,'//child::*[$@rownum]/from_location_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/from_location_type'),
     ExtractValue(xmlData,'//child::*[$@rownum]/year'),
     ExtractValue(xmlData,'//child::*[$@rownum]/period'),
     @toLocationId,
     @to_location_type,
     ExtractValue(xmlData,'//child::*[$@rownum]/description'),
     ExtractValue(xmlData,'//child::*[$@rownum]/item_category_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/item_group_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/item_code_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/barcode'),
     ExtractValue(xmlData,'//child::*[$@rownum]/required_batchno'),
     ExtractValue(xmlData,'//child::*[$@rownum]/batchno'),
     @expiry_date,
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_qty'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_cost'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_total'),
     ExtractValue(xmlData,'//child::*[$@rownum]/discount_percentage'),
     ExtractValue(xmlData,'//child::*[$@rownum]/discount_amount'),
     ExtractValue(xmlData,'//child::*[$@rownum]/net_total'),
     ExtractValue(xmlData,'//child::*[$@rownum]/landing_cost'),
     @average_cost,
     ExtractValue(xmlData,'//child::*[$@rownum]/operation'),
     ExtractValue(xmlData,'//child::*[$@rownum]/hospital_id'),     
     ExtractValue(xmlData,'//child::*[$@rownum]/created_by'),
     ExtractValue(xmlData,'//child::*[$@rownum]/updated_by'));
     
 
  
     set @rownum = @rownum + 1;
  end while;


 COMMIT;
END$$

DELIMITER ;


-- ==================

CREATE DEFINER=`algaeh_root`@`localhost` PROCEDURE `algaeh_proc_inv_item_location`(xmlData TEXT)
BEGIN
 DECLARE exit handler for sqlexception
  BEGIN
   -- RESIGNAL SET MESSAGE_TEXT = 'An Error';
	RESIGNAL SET MYSQL_ERRNO = 5;
    -- ERROR
  ROLLBACK;
	-- select 'Error in Inventory Item Location' as 'Error';
END;
 START TRANSACTION;
  set @nrows =0;
  set @rownum = 1;
  set @counter=0;
  set @nrows = extractvalue(xmlData, 'count(//hims_m_inventory_item_location)');
  set @uom =0;
  set @convertionFactor=0;
  set @qtyHand=0;
  set @operation='';
  set @avgcost=0;  
 while @rownum <= @nrows do
set @uom =0;
set @average_cost=ExtractValue(xmlData,'//child::*[$@rownum]/average_cost');  

 select count(*) into @counter from hims_m_inventory_item_location where item_id = 
ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
inventory_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/inventory_location_id')
and batchno=ExtractValue(xmlData,'//child::*[$@rownum]/batchno')
and record_status='A';
 

 
-- Expiry date and Batch no exists
 IF (@counter>0) THEN

-- Check HIMS_D_ITEM_MASTER -- Start
	select stocking_uom_id into @uom from hims_d_inventory_item_master where hims_d_inventory_item_master_id=ExtractValue(xmlData,'//child::*[$@rownum]/item_id');
    
	if(@uom <> ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom'))
	then
		select conversion_factor into @convertionFactor from hims_m_inventory_item_uom where item_master_id=ExtractValue(xmlData,'//child::*[$@rownum]/item_id') AND
		uom_id=ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom') and record_status='A';
		set @qtyHand =@convertionFactor*ExtractValue(xmlData,'//child::*[$@rownum]/qtyhand');
	else
	   set @qtyHand =ExtractValue(xmlData,'//child::*[$@rownum]/qtyhand');
	end if;
-- END Check hims_d_inventory_item_master -- END

--   Update Records

	IF ExtractValue(xmlData,'//child::*[$@rownum]/transaction_type') ='AD'
		then
        IF ExtractValue(xmlData,'//child::*[$@rownum]/operation') ='+'
		then
            UPDATE hims_m_inventory_item_location set qtyhand =qtyhand+@qtyHand, sale_price =sale_price+ExtractValue(xmlData,'//child::*[$@rownum]/sale_price')
			WHERE item_id = 
			ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
			inventory_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/inventory_location_id')and
			batchno=ExtractValue(xmlData,'//child::*[$@rownum]/batchno')
			and record_status='A';
		end if;
		if ExtractValue(xmlData,'//child::*[$@rownum]/operation') ='-'
		then			                        
            UPDATE hims_m_inventory_item_location set qtyhand =qtyhand-@qtyHand, sale_price =sale_price-ExtractValue(xmlData,'//child::*[$@rownum]/sale_price')
			WHERE item_id = 
			ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
			inventory_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/inventory_location_id')
			and batchno=ExtractValue(xmlData,'//child::*[$@rownum]/batchno')
			and record_status='A';
		-- End Expiry date and Batch no exists
			 
		END IF;
    ELSE

		select @qtyHand as qtyHand;
        
		IF ExtractValue(xmlData,'//child::*[$@rownum]/operation') ='+'
		then
			UPDATE hims_m_inventory_item_location set qtyhand =qtyhand+@qtyHand
			WHERE item_id = 
			ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
			inventory_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/inventory_location_id')and
			batchno=ExtractValue(xmlData,'//child::*[$@rownum]/batchno')
			and record_status='A';
		end if;
		if ExtractValue(xmlData,'//child::*[$@rownum]/operation') ='-'
			then
			

			UPDATE hims_m_inventory_item_location set qtyhand =qtyhand-@qtyHand
			WHERE item_id = 
			ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
			inventory_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/inventory_location_id')
			and batchno=ExtractValue(xmlData,'//child::*[$@rownum]/batchno')
			and record_status='A';
		-- End Expiry date and Batch no exists
		END IF;
	END IF;
    
    ELSE
    
    select stocking_uom_id into @uom from hims_d_inventory_item_master where hims_d_inventory_item_master_id=ExtractValue(xmlData,'//child::*[$@rownum]/item_id');

	


	if(@uom <> ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom'))
	then
    select ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom') as uom;
    select ExtractValue(xmlData,'//child::*[$@rownum]/item_id') as item_id;
    
		select conversion_factor into @convertionFactor from hims_m_inventory_item_uom where item_master_id=ExtractValue(xmlData,'//child::*[$@rownum]/item_id') AND
		uom_id=ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom') and record_status='A';
        
        select @convertionFactor as convertionFactor;
        
		set @qtyHand =@convertionFactor*ExtractValue(xmlData,'//child::*[$@rownum]/qtyhand');
        set @avgcost = ROUND(ExtractValue(xmlData,'//child::*[$@rownum]/avgcost')/@convertionFactor, 3);        
	else
	   set @qtyHand =ExtractValue(xmlData,'//child::*[$@rownum]/qtyhand');
       set @avgcost =ExtractValue(xmlData,'//child::*[$@rownum]/avgcost');
	end if;
    set @average_cost = @avgcost;
    
     set @expirydt= null;
	 if(ExtractValue(xmlData,'//child::*[$@rownum]/expirydt')<>'~')
	 then
	   set @expirydt = ExtractValue(xmlData,'//child::*[$@rownum]/expirydt');
	 end if;

		-- insert record 
		insert into hims_m_inventory_item_location(item_id,inventory_location_id,batchno,expirydt,
		barcode,qtyhand,qtypo,cost_uom,avgcost,last_purchase_cost,
		grn_id,grnno,sale_price,sales_uom,mrp_price,vendor_batchno,hospital_id,created_by,updated_by) values(ExtractValue(xmlData,'//child::*[$@rownum]/item_id'),
		ExtractValue(xmlData,'//child::*[$@rownum]/inventory_location_id'),ExtractValue(xmlData,'//child::*[$@rownum]/batchno'),
		@expirydt,ExtractValue(xmlData,'//child::*[$@rownum]/barcode'),
		@qtyHand,ExtractValue(xmlData,'//child::*[$@rownum]/qtypo'),
		ExtractValue(xmlData,'//child::*[$@rownum]/cost_uom'),@avgcost,
		ExtractValue(xmlData,'//child::*[$@rownum]/last_purchase_cost'),ExtractValue(xmlData,'//child::*[$@rownum]/grn_id'),
		ExtractValue(xmlData,'//child::*[$@rownum]/grnno'),ExtractValue(xmlData,'//child::*[$@rownum]/sale_price'),
		ExtractValue(xmlData,'//child::*[$@rownum]/sales_uom'),ExtractValue(xmlData,'//child::*[$@rownum]/mrp_price'),
        ExtractValue(xmlData,'//child::*[$@rownum]/vendor_batchno'),ExtractValue(xmlData,'//child::*[$@rownum]/hospital_id'),
		ExtractValue(xmlData,'//child::*[$@rownum]/created_by'),ExtractValue(xmlData,'//child::*[$@rownum]/updated_by'));
		-- end insert recor
END IF;

-- IF ExtractValue(xmlData,'//child::*[$@rownum]/flag') ='1'
-- then
-- 	set @rownum = @rownum + 1;
    -- select @rownum as rownum;
-- ELSE
 set @toLocationId= null;
 if(ExtractValue(xmlData,'//child::*[$@rownum]/to_location_id')!='~')
 then
   set @toLocationId = ExtractValue(xmlData,'//child::*[$@rownum]/to_location_id');
 end if;
 set @to_location_type= null;
 if(ExtractValue(xmlData,'//child::*[$@rownum]/to_location_type')!='~')
 then
   set @to_location_type = ExtractValue(xmlData,'//child::*[$@rownum]/to_location_type');
 end if;
 
 set @expiry_date= null;
 if(ExtractValue(xmlData,'//child::*[$@rownum]/expiry_date')<>'~')
 then
   set @expiry_date = ExtractValue(xmlData,'//child::*[$@rownum]/expiry_date');
 end if;

 
  insert into hims_f_inventory_trans_history(transaction_type, transaction_id, transaction_date, from_location_id, 
 from_location_type, `year`, period, to_location_id, to_location_type, description, item_category_id, item_group_id, 
 item_code_id, barcode, required_batchno, batchno, expiry_date, transaction_qty, transaction_uom, transaction_cost, 
 transaction_total, discount_percentage, discount_amount, net_total, landing_cost, average_cost, operation, hospital_id,
 created_by, updated_by)
 values(ExtractValue(xmlData,'//child::*[$@rownum]/transaction_type'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_date'),
     ExtractValue(xmlData,'//child::*[$@rownum]/from_location_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/from_location_type'),
     ExtractValue(xmlData,'//child::*[$@rownum]/year'),
     ExtractValue(xmlData,'//child::*[$@rownum]/period'),
     @toLocationId,
     @to_location_type,
     ExtractValue(xmlData,'//child::*[$@rownum]/description'),
     ExtractValue(xmlData,'//child::*[$@rownum]/item_category_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/item_group_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/item_code_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/barcode'),
     ExtractValue(xmlData,'//child::*[$@rownum]/required_batchno'),
     ExtractValue(xmlData,'//child::*[$@rownum]/batchno'),
     @expiry_date,
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_qty'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_cost'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_total'),
     ExtractValue(xmlData,'//child::*[$@rownum]/discount_percentage'),
     ExtractValue(xmlData,'//child::*[$@rownum]/discount_amount'),
     ExtractValue(xmlData,'//child::*[$@rownum]/net_total'),
     ExtractValue(xmlData,'//child::*[$@rownum]/landing_cost'),
     @average_cost,
     ExtractValue(xmlData,'//child::*[$@rownum]/operation'),
     ExtractValue(xmlData,'//child::*[$@rownum]/hospital_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/created_by'),
     ExtractValue(xmlData,'//child::*[$@rownum]/updated_by'));
     
 
  
     set @rownum = @rownum + 1;
   -- END IF; 
  end while;


 COMMIT;
END$$

DELIMITER ;


-- ==================
ALTER TABLE `hims_f_lab_order` 
ADD COLUMN `test_id` INT NULL AFTER `service_id`,
ADD INDEX `hims_f_lab_order_fk16_idx` (`test_id` ASC) VISIBLE;

ALTER TABLE `hims_f_lab_order` 
ADD CONSTRAINT `hims_f_lab_order_fk16`
  FOREIGN KEY (`test_id`)
  REFERENCES `hims_d_investigation_test` (`hims_d_investigation_test_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

-- ==================
ALTER TABLE hims_f_insurance_statement  ADD COLUMN total_denial_amount DECIMAL(20,3) NULL DEFAULT NULL AFTER total_remittance_amount;

-- ==================
alter table hims_d_nationality add column identity_document_id int after arabic_nationality;

-- Query End  19/08/2020







-- Query on Aug-22-2020 
update algaeh_d_app_screens set page_to_redirect='PatientRegistration' where screen_code='FD0002';
-- Query End Aug-22-2020 

-- Query on Aug-22-2020 
UPDATE `algaeh_d_reports` SET `report_query` = 'select P.patient_code,trim(E.full_name) as doctor_name,P.full_name as patient_name,SD.sub_department_name, gender, age_in_years,\n age_in_months,age_in_days, IP.insurance_provider_name, P.primary_id_no from hims_f_patient P \n inner join hims_f_patient_visit V on P.hims_d_patient_id = V.patient_id \n inner join hims_d_employee E on E.hims_d_employee_id = V.doctor_id \n inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id \n left join hims_m_patient_insurance_mapping IM on IM.patient_visit_id=V.hims_f_patient_visit_id \n left join hims_d_insurance_provider IP on IM.primary_insurance_provider_id=IP.hims_d_insurance_provider_id \n where P.hims_d_patient_id=? and V.hims_f_patient_visit_id=?;\n select MS.hims_d_lab_specimen_id, MS.`description` as investigation_name,LA.description as analyte_name, LO.ordered_date, \n LO.critical_status,LO.comments,OA.result,OA.result_unit,TRIM(TRAILING \'.\' FROM TRIM(TRAILING \'0\' from OA.normal_low)) as normal_low,TRIM(TRAILING \'.\' FROM TRIM(TRAILING \'0\' from OA.normal_high)) as normal_high, OA.critical_low,OA.critical_high,S.service_name, \n E.full_name as validated_by,OA.critical_type, TC.category_name from hims_f_lab_order LO\n inner join hims_f_lab_sample LS on LO.hims_f_lab_order_id = LS.order_id \n inner join hims_f_ord_analytes OA on LO.hims_f_lab_order_id = OA.order_id \n inner join hims_d_lab_specimen MS on LS.sample_id = MS.hims_d_lab_specimen_id \n inner join hims_d_lab_analytes LA on OA.analyte_id = LA.hims_d_lab_analytes_id  \n inner join hims_d_services S on S.hims_d_services_id= LO.service_id  \n inner join algaeh_d_app_user U on LO.validated_by=U.algaeh_d_app_user_id\n inner join hims_d_employee E on  U.employee_id=E.hims_d_employee_id  \n inner join hims_d_investigation_test IT on IT.services_id= LO.service_id\n inner join hims_d_test_category TC on TC.hims_d_test_category_id= IT.category_id\n where LO.visit_id = ? and LO.hims_f_lab_order_id=?;' WHERE (`report_id` = '69');

-- Query End Aug-23-2020 

-- Query start Aug-24-2020 
ALTER TABLE `hims_f_invoice_header` 
ADD COLUMN `insurance_statement_id_2` INT NULL DEFAULT NULL AFTER `insurance_statement_id`,
ADD COLUMN `insurance_statement_id_3` INT NULL DEFAULT NULL AFTER `insurance_statement_id_2`,
ADD COLUMN `claim_status` ENUM('P', 'S1', 'S2', 'S3', 'R1', 'R2', 'R3', 'D1', 'D2', 'D3') NULL DEFAULT 'P' COMMENT 'P = PENDING \\\\nS1=SUBMIT 1 \\\\nS2=SUBMIT 2 \\\\nS3=SUBMIT 3 \\\\nR1= REMIT 1 \\\\nR2= REMIT 2 \\\\nR3= REMIT 3 \\\\nD1= DENIAL 1 \\\\nD1= DENIAL 2 \\\\nD1= DENIAL 3' AFTER `insurance_statement_id_3`;


INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_query`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('salesWiseIncome', 'Income by Sales', 'SELECT SI.invoice_number, date(SI.invoice_date) as invoice_date,SI.net_payable, SI.return_done,SI.is_posted, SO.sales_person_id,EM.full_name as sales_per_name, CO.customer_name from hims_f_sales_invoice_header SI inner join hims_d_customer as CO on SI.customer_id = CO.hims_d_customer_id inner join hims_f_sales_order as SO on SI.sales_order_id = SO.hims_f_sales_order_id inner join hims_d_employee as EM on SO.sales_person_id = EM.hims_d_employee_id where SI.hospital_id=? and date(SI.invoice_date) between date(?) and date(?) and SI.is_posted=\'Y\' and SI.return_done=\'N\';', '[\"hospital_id\",\"from_date\", \"to_date\"]', 'reportHeader', 'A', '2019-06-17 18:57:28', '2019-06-17 18:57:28');

INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_query`, `data_manupulation`, `report_input_series`, `report_header_file_name`, `status`) VALUES ('cashReceiptSmall', 'Cash Receipt', 'select BH.bill_number as invoice_number,P.patient_code, P.full_name as patient_full_name,  P.arabic_name as patient_arabaic_full_name, V.visit_date,E.full_name,E.arabic_name,SD.arabic_sub_department_name,	  SD.sub_department_name,N.nationality, BH.bill_date invoice_date, P.registration_date, V.age_in_years, P.gender,IP.insurance_provider_name,INET.network_type from hims_f_patient P inner join hims_f_patient_visit V on P.hims_d_patient_id = V.patient_id inner join hims_d_nationality as N on N.hims_d_nationality_id = P.nationality_id inner join hims_d_sub_department SD on V.sub_department_id =SD.hims_d_sub_department_id inner join hims_d_employee E on V.doctor_id =E.hims_d_employee_id inner join hims_f_billing_header BH on V.hims_f_patient_visit_id = BH.visit_id left join hims_m_patient_insurance_mapping IM on IM.patient_visit_id = V.hims_f_patient_visit_id left join hims_d_insurance_provider IP on IP.hims_d_insurance_provider_id = IM.primary_insurance_provider_id left join hims_d_insurance_network INET on INET.hims_d_insurance_network_id = IM.primary_network_id where BH.hims_f_billing_header_id=?;   select BH.hims_f_billing_header_id,BH.bill_number ,ST.service_type,	ST.arabic_service_type, S.service_name,	  S.arabic_service_name,    BD.quantity,	BD.unit_cost as price,	BD.gross_amount, BD.patient_resp as patient_share,	  BD.patient_payable,	coalesce(BD.discount_amout,	0)as discount_amount, coalesce(BD.net_amout,	0)as net_amount,	  BD.comapany_resp,	BD.company_tax,	BD.company_payble, BD.patient_tax,	coalesce(BD.company_tax,	0)+   coalesce(BD.comapany_resp,	0) as net_claim, BD.service_type_id,V.new_visit_patient from hims_f_billing_header BH       inner join hims_f_patient_visit V on BH.visit_id = V.hims_f_patient_visit_id    inner join hims_f_billing_details BD on BH.hims_f_billing_header_id=BD.hims_f_billing_header_id    inner join hims_d_services S on S.hims_d_services_id = BD.services_id    inner join hims_d_service_type ST on BD.service_type_id = ST.hims_d_service_type_id       where BH.hims_f_billing_header_id=?;', '{\"header\":${JSON.stringify({...result[0][0],...data[1][0]})},\"detail\":${JSON.stringify(result[1])}}', '', 'reportHeader_NoLogo', 'A');

ALTER TABLE `hims_d_customer` 
ADD COLUMN `company_bank_name` VARCHAR(100) NULL DEFAULT NULL AFTER `arabic_customer_name`,
ADD COLUMN `bank_account_no` VARCHAR(45) NULL DEFAULT NULL AFTER `company_bank_name`;


ALTER TABLE `twareat_live_db`.`hims_d_customer` 
DROP COLUMN `company_bank_name`;


UPDATE `algaeh_d_reports` SET `report_query` = 'select H.*, D.*,S.service_name,SO.sales_order_number,CASE WHEN D.service_frequency=\'M\' THEN \'Monthly\' WHEN D.service_frequency=\'W\'  THEN \'Weekly\' WHEN D.service_frequency=\'D\' THEN \'Daily\' WHEN D.service_frequency=\'H\' THEN \'Hourly\' END as service_frequency,  SO.customer_po_no, C.customer_name, C.bank_account_no, C.bank_name, C.address, C.arabic_customer_name, C.vat_number, ROUND(D.tax_percentage, 0) as tax_percentage, ROUND(D.quantity, 0) as quantity from hims_f_sales_invoice_header H  inner join hims_f_sales_invoice_services D on H.hims_f_sales_invoice_header_id = D.sales_invoice_header_id  inner join hims_d_services S on S.hims_d_services_id = D.services_id  inner join hims_d_customer C on C.hims_d_customer_id = H.customer_id  left join hims_f_sales_order SO on SO.hims_f_sales_order_id=H.sales_order_id where invoice_number=?;select organization_name from hims_d_organization;' WHERE (report_name='SalesInvoiceService' and `report_id` >0);

ALTER TABLE `hims_f_invoice_header` 
CHANGE COLUMN `submission_ammount` `submission_amount` DECIMAL(10,3) NULL DEFAULT '0.000' ,
CHANGE COLUMN `remittance_ammount` `remittance_amount` DECIMAL(10,3) NULL DEFAULT '0.000' ,
CHANGE COLUMN `denial_ammount` `denial_amount` DECIMAL(10,3) NULL DEFAULT '0.000' ;

ALTER TABLE `hims_f_invoice_details` 
ADD COLUMN `s1_amt` DECIMAL(10,3) NULL DEFAULT '0.000' AFTER `sec_company_payable`,
ADD COLUMN `s2_amt` DECIMAL(10,3) NULL DEFAULT '0.000' AFTER `s1_amt`,
ADD COLUMN `s3_amt` DECIMAL(10,3) NULL DEFAULT '0.000' AFTER `s2_amt`,
ADD COLUMN `r1_amt` DECIMAL(10,3) NULL DEFAULT '0.000' AFTER `s3_amt`,
ADD COLUMN `r2_amt` DECIMAL(10,3) NULL DEFAULT '0.000' AFTER `r1_amt`,
ADD COLUMN `r3_amt` DECIMAL(10,3) NULL DEFAULT '0.000' AFTER `r2_amt`,
ADD COLUMN `d1_amt` DECIMAL(10,3) NULL DEFAULT '0.000' AFTER `r3_amt`,
ADD COLUMN `d2_amt` DECIMAL(10,3) NULL DEFAULT '0.000' AFTER `d1_amt`,
ADD COLUMN `d1_reason_code` DECIMAL(10,3) NULL DEFAULT '0.000' AFTER `d2_amt`,
ADD COLUMN `d2_reason_code` DECIMAL(10,3) NULL DEFAULT '0.000' AFTER `d1_reason_code`,
ADD COLUMN `d3_reason_code` DECIMAL(10,3) NULL DEFAULT '0.000' AFTER `d2_reason_code`;

-- Query End Aug-24-2020 







-- Query on Aug-26-08-2020
 update algaeh_d_reports set report_type='Thermal' where report_name='cashReceipt';
 

 -- Query on Aug-26-08-2020 -- For invoice header detail and statement
 alter table hims_f_invoice_header add column submission_amount2 decimal(10,3) 
after submission_amount, add column submission_amount3 decimal(10,3) 
after submission_amount,add column remittance_amount2 decimal(10,3) 
after remittance_amount,add column remittance_amount3 decimal(10,3) 
after remittance_amount2,add column denial_amount2 decimal(10,3) 
after denial_amount,add column denial_amount3 decimal(10,3) 
after denial_amount2;
 -- Query End Aug-26-08-2020
-- Query on 04-sept-2020  for finance
 alter table finance_options add column report_dill_down_level int default 1
after allow_negative_balance;
-- query end 04-sept-2020  for finance
alter table finance_account_head add column is_cos_account enum ('Y','N')  default 'N' 
after group_code;

-- Query from 05-sept-2020 till 14-sept-2020 Start here;
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('JVReport', 'Journal Voucher Report', '[\"finance_voucher_header_id\"]', 'reportHeader', 'A', '2020-09-05 10:22:55', '2020-09-05 10:22:55');

INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_header_file_name`, `status`) VALUES ('stockReport', 'Inventory Stock Cost Report', 'reportHeader', 'A');

alter table finance_options add column report_dill_down_level int default 1
after allow_negative_balance;

alter table finance_account_head add column is_cos_account enum ('Y','N')  default 'N' 
after group_code;

UPDATE `algaeh_d_reports` SET `report_query` = 'select H.*, D.*,S.service_name, S.arabic_service_name, SO.sales_order_number,\nCASE WHEN D.service_frequency=\'M\' THEN \'Monthly\' WHEN D.service_frequency=\'W\'  THEN \'Weekly\' WHEN D.service_frequency=\'D\' THEN \'Daily\' \nWHEN D.service_frequency=\'H\' THEN \'Hourly\' END as service_frequency,  SO.customer_po_no, C.customer_name, C.bank_account_no, C.bank_name, \nC.address, C.arabic_customer_name, C.vat_number, ROUND(D.tax_percentage, 0) as tax_percentage, ROUND(D.quantity, 0) as quantity , HO.hospital_name\nfrom hims_f_sales_invoice_header H  \ninner join hims_f_sales_invoice_services D on H.hims_f_sales_invoice_header_id = D.sales_invoice_header_id  \ninner join hims_d_services S on S.hims_d_services_id = D.services_id  \ninner join hims_d_customer C on C.hims_d_customer_id = H.customer_id  \ninner join hims_d_hospital HO on HO.hims_d_hospital_id = H.hospital_id  \nleft join hims_f_sales_order SO on SO.hims_f_sales_order_id=H.sales_order_id where invoice_number=?;\nselect organization_name from hims_d_organization;' WHERE (report_name ='SalesInvoiceService' and `report_id` >0);


ALTER TABLE `hims_f_sales_invoice_header` 
ADD COLUMN `narration` VARCHAR(200) NULL DEFAULT NULL AFTER `return_done`;


INSERT INTO `algaeh_d_app_screens` (`screen_code`, `screen_name`, `page_to_redirect`, `module_id`, `other_language`, `created_date`, `updated_date`, `record_status`) VALUES ('INS0006', 'Bulk Invoice Generation', 'BulkClaimGeneration', '9', 'بيان التأمين', '2020-09-07 14:08:51', '2020-09-07 14:08:51', 'A');

ALTER TABLE `hims_d_inventory_options` 
CHANGE COLUMN `requisition_auth_level` `requisition_auth_level` ENUM('N', '1', '2') NULL DEFAULT 'N' COMMENT 'N-None, 1-Level 1, 2 - Level 2' ;


ALTER TABLE `hims_d_pharmacy_options` 
CHANGE COLUMN `requisition_auth_level` `requisition_auth_level` ENUM('N', '1', '2') NULL DEFAULT 'N' ,
CHANGE COLUMN `created_date` `created_date` DATETIME NULL DEFAULT NULL COMMENT 'N-None, 1-Level 1, 2 - Level 2' ;

ALTER TABLE `hims_d_sales_options` 
CHANGE COLUMN `sales_order_auth_level` `sales_order_auth_level` ENUM('N', '1', '2') NULL DEFAULT 'N' COMMENT 'N- None, 1-Level 1, 2 - Level 2' ;


ALTER TABLE `hims_d_procurement_options` 
CHANGE COLUMN `po_auth_level` `po_auth_level` ENUM('N', '1', '2') NULL DEFAULT 'N' COMMENT 'N-None, 1-Level 1, 2 - Level 2' ;


UPDATE `algaeh_d_reports` SET `report_query` = 'select  dn_from, hims_f_procurement_dn_header_id,delivery_note_number,date(dn_date)as dn_date,H.sub_total,H.detail_discount,H.net_total,  H.total_tax,H.net_payable ,L.location_description  ,V.vendor_name ,PO.purchase_number,date(PO.po_date) as po_date  from hims_f_procurement_dn_header H  inner join hims_f_procurement_po_header PO on  H.purchase_order_id=PO.hims_f_procurement_po_header_id  left join hims_d_inventory_location L  on H.inventory_location_id=L.hims_d_inventory_location_id  left join hims_d_vendor V on H.vendor_id=V.hims_d_vendor_id  where dn_from=\'INV\' and  delivery_note_number=?;   \n\nselect D.hims_f_procurement_dn_detail_id,D.hims_f_procurement_dn_header_id,  D.vendor_batchno,D.inv_item_id,IM.item_code,IM.item_description,  D.po_quantity,D.dn_quantity,D.unit_cost,D.extended_cost,D.discount_percentage,D.discount_amount,  D.net_extended_cost,D.quantity_recieved_todate,D.quantity_outstanding,  D.tax_amount,D.tax_percentage,D.total_amount,U.uom_description  from hims_f_procurement_dn_header H  inner join hims_f_procurement_dn_detail D  on H.hims_f_procurement_dn_header_id= D. hims_f_procurement_dn_header_id  left  join hims_d_inventory_item_master IM on D.inv_item_id=IM.hims_d_inventory_item_master_id  left join hims_d_inventory_uom U on D.inventory_uom_id=U.hims_d_inventory_uom_id  where H.dn_from=\'INV\' and delivery_note_number=?  order by IM.item_description asc;   \nselect B.hims_f_procurement_dn_batches_id,B.hims_f_procurement_dn_detail_id,B.vendor_batchno,B.barcode,B.po_quantity,B.dn_quantity,  B.unit_cost,B.extended_cost,B.discount_percentage,B.discount_amount,B.net_extended_cost,B.quantity_recieved_todate,  B.quantity_outstanding,B.tax_amount,B.total_amount,B.batchno,B.sales_price from hims_f_procurement_dn_header H  inner join hims_f_procurement_dn_detail D  on H.hims_f_procurement_dn_header_id= D. hims_f_procurement_dn_header_id  inner join hims_f_procurement_dn_batches B on D.hims_f_procurement_dn_detail_id=B.hims_f_procurement_dn_detail_id  where H.dn_from=\'INV\' and delivery_note_number=?;', `report_input_series` = '[\'delivery_note_number\', \'delivery_note_number\', \'delivery_note_number\' ]' WHERE (report_name='deliveryNoteInventoryProcurement' and `report_id` > 0);
UPDATE `algaeh_d_reports` SET `report_query` = 'select hims_f_inventory_transfer_header_id,transfer_number, date_format(H.transfer_date,\'%d-%m-%Y\') as transfer_date, FL.location_description as from_location ,TL.location_description as to_location, H.material_requisition_number,case direct_transfer when \'Y\' then \'Direct Transfer\' when \'N\' then \'Material Requested\' end as transfer_type,date_format(M.requistion_date,\'%d-%m-%Y\') as requistion_date from hims_f_inventory_transfer_header H inner join hims_d_inventory_location FL on H.from_location_id=FL.hims_d_inventory_location_id inner join hims_d_inventory_location TL on H.to_location_id=TL.hims_d_inventory_location_id left join hims_f_inventory_material_header M on H.hims_f_inventory_material_header_id=M.hims_f_inventory_material_header_id where transfer_number=?; \nselect hims_f_inventory_transfer_detail_id,transfer_header_id,from_qtyhand, to_qtyhand,item_id,item_category_id,IM.item_description,IM.item_code ,C.category_desc, RU.uom_description as requested_uom,TU.uom_description as transferred_uom, quantity_requested,quantity_authorized,quantity_transferred from hims_f_inventory_transfer_header H  inner join hims_f_inventory_transfer_detail D on H.hims_f_inventory_transfer_header_id=D.transfer_header_id inner join hims_d_inventory_item_master IM on D.item_id=IM.hims_d_inventory_item_master_id inner join hims_d_inventory_tem_category C on IM.category_id=C.hims_d_inventory_tem_category_id left join hims_d_inventory_uom RU on D.uom_requested_id=RU.hims_d_inventory_uom_id left join hims_d_inventory_uom TU on D.uom_transferred_id=TU.hims_d_inventory_uom_id where H. transfer_number=?; \nselect hims_f_inventory_transfer_batches_id ,transfer_detail_id, B.vendor_batchno,B.batchno,date_format(B.expiry_date,\'%d-%m-%Y\') as expiry_date,quantity_transfer,B.unit_cost from hims_f_inventory_transfer_header H  inner join hims_f_inventory_transfer_detail D on H.hims_f_inventory_transfer_header_id=D.transfer_header_id inner join  hims_f_inventory_transfer_batches B on D.hims_f_inventory_transfer_detail_id=B.transfer_detail_id where H. transfer_number=?;' WHERE (report_name='MaterialTransferInv' and `report_id` > 0);

INSERT INTO `algaeh_d_app_screens` (`screen_code`, `screen_name`, `page_to_redirect`, `redirect_url`, `module_id`, `other_language`, `created_date`, `updated_date`, `record_status`) VALUES ('RPT_CLN', 'Clinical Reports', 'Reports List', 'clinical', '25', 'التقارير السريرية', '2020-09-08 11:38:25', '2020-09-08 11:38:25', 'A');

INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('ageWisePatient', 'Patient- Age wise Report', '[\"hospital_id\"]', 'reportHeader', 'A', '2019-06-11 17:33:35', '2019-06-11 17:33:35');
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('cancelServiceByPatient', 'Cancelled Service by Patient', 'reportHeader', 'A', '2020-09-08 13:48:09', '2020-09-08 13:48:09');
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('discountServiceByPatient', 'Discounted Services by Patient', 'reportHeader', 'A', '2020-09-08 13:48:09', '2020-09-08 13:48:09');


UPDATE `algaeh_d_reports` SET `report_query` = 'select P.patient_code,trim(E.full_name) as doctor_name,P.full_name as patient_name,SD.sub_department_name, gender, age_in_years,   age_in_months,age_in_days, IP.insurance_provider_name, P.primary_id_no from hims_f_patient P    inner join hims_f_patient_visit V on P.hims_d_patient_id = V.patient_id    inner join hims_d_employee E on E.hims_d_employee_id = V.doctor_id    inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id   left join hims_m_patient_insurance_mapping IM on IM.patient_visit_id=V.hims_f_patient_visit_id  left join hims_d_insurance_provider IP on IM.primary_insurance_provider_id=IP.hims_d_insurance_provider_id    where P.hims_d_patient_id=? and V.hims_f_patient_visit_id=?;   select MS.hims_d_lab_specimen_id, MS.`description` as investigation_name,LA.description as analyte_name, LO.ordered_date,LO.entered_date,LO.validated_date,    LO.critical_status,LO.comments,OA.result,OA.result_unit,TRIM(TRAILING \'.\' FROM TRIM(TRAILING \'0\' from OA.normal_low)) as normal_low, TRIM(TRAILING \'.\' FROM TRIM(TRAILING \'0\' from OA.normal_high)) as normal_high, OA.critical_low,OA.critical_high,S.service_name,    E.full_name as validated_by,OA.critical_type, TC.category_name, OA.text_value, OA.analyte_type from hims_f_lab_order LO   inner join hims_f_lab_sample LS on LO.hims_f_lab_order_id = LS.order_id    inner join hims_f_ord_analytes OA on LO.hims_f_lab_order_id = OA.order_id    inner join hims_d_lab_specimen MS on LS.sample_id = MS.hims_d_lab_specimen_id    inner join hims_d_lab_analytes LA on OA.analyte_id = LA.hims_d_lab_analytes_id     inner join hims_d_services S on S.hims_d_services_id= LO.service_id     inner join algaeh_d_app_user U on LO.validated_by=U.algaeh_d_app_user_id   inner join hims_d_employee E on  U.employee_id=E.hims_d_employee_id     inner join hims_d_investigation_test IT on IT.services_id= LO.service_id   inner join hims_d_test_category TC on TC.hims_d_test_category_id= IT.category_id  where LO.visit_id = ? and LO.hims_f_lab_order_id=?;' WHERE (`report_id` = '4');



UPDATE `algaeh_d_reports` SET `report_query` = 'select P.patient_code,trim(E.full_name) as doctor_name,P.full_name as patient_name from hims_f_patient P    inner join hims_f_patient_visit V on P.hims_d_patient_id = V.patient_id    inner join hims_d_employee E on E.hims_d_employee_id = V.doctor_id   where P.hims_d_patient_id=? and V.hims_f_patient_visit_id=?;  select MS.hims_d_lab_specimen_id,MS.`description` as  specimen,S.service_name , A.antibiotic_name, case MR.susceptible when \'Y\' then \'YES\' else \'NO\' end as  susceptible, case MR.intermediate when \'Y\' then \'YES\' else \'NO\' end as  intermediate, case MR.resistant when \'Y\' then \'YES\' else \'NO\' end as  resistant, CASE WHEN LO.organism_type=\'F\' THEN \'Fascideous\' else \'Non-Fascideous\' END as organism_type, CASE WHEN LO.bacteria_type=\'G\' THEN \'Growth\' else \'No Growth\' END as bacteria_type,LO.bacteria_name, E.full_name as validated_by, LO.ordered_date,LO.entered_date,LO.validated_date,LO.comments from hims_f_lab_order LO, hims_f_lab_sample LS, hims_f_micro_result MR,  hims_d_lab_specimen MS,  hims_d_antibiotic A, algaeh_d_app_user U ,hims_d_employee E , hims_d_services S where  LO.hims_f_lab_order_id = LS.order_id and LO.service_id=S.hims_d_services_id and  LO.hims_f_lab_order_id = MR.order_id and   LS.sample_id = MS.hims_d_lab_specimen_id and  MR.antibiotic_id = A.hims_d_antibiotic_id and  LO.validated_by=U.algaeh_d_app_user_id  and U.employee_id=E.hims_d_employee_id  and LO.visit_id = ?;' WHERE (`report_id` = '82');


UPDATE `muju_db_20200908`.`algaeh_d_reports` SET `report_query` = 'select P.patient_code,trim(E.full_name) as doctor_name,P.full_name as patient_name,SD.sub_department_name, gender, age_in_years,   age_in_months,age_in_days, IP.insurance_provider_name, P.primary_id_no from hims_f_patient P    inner join hims_f_patient_visit V on P.hims_d_patient_id = V.patient_id    inner join hims_d_employee E on E.hims_d_employee_id = V.doctor_id    inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id   left join hims_m_patient_insurance_mapping IM on IM.patient_visit_id=V.hims_f_patient_visit_id  left join hims_d_insurance_provider IP on IM.primary_insurance_provider_id=IP.hims_d_insurance_provider_id    where P.hims_d_patient_id=? and V.hims_f_patient_visit_id=?;   select MS.hims_d_lab_specimen_id, MS.`description` as investigation_name,LA.description as analyte_name, LO.ordered_date,LO.entered_date,LO.validated_date, LO.critical_status,LO.comments,OA.result,OA.result_unit,TRIM(TRAILING \'.\' FROM TRIM(TRAILING \'0\' from OA.normal_low)) as normal_low, TRIM(TRAILING \'.\' FROM TRIM(TRAILING \'0\' from OA.normal_high)) as normal_high, OA.critical_low,OA.critical_high,S.service_name,    E.full_name as validated_by,OA.critical_type, TC.category_name, OA.text_value, OA.analyte_type from hims_f_lab_order LO   inner join hims_f_lab_sample LS on LO.hims_f_lab_order_id = LS.order_id    inner join hims_f_ord_analytes OA on LO.hims_f_lab_order_id = OA.order_id    inner join hims_d_lab_specimen MS on LS.sample_id = MS.hims_d_lab_specimen_id    inner join hims_d_lab_analytes LA on OA.analyte_id = LA.hims_d_lab_analytes_id     inner join hims_d_services S on S.hims_d_services_id= LO.service_id     inner join algaeh_d_app_user U on LO.validated_by=U.algaeh_d_app_user_id   inner join hims_d_employee E on  U.employee_id=E.hims_d_employee_id     inner join hims_d_investigation_test IT on IT.services_id= LO.service_id   inner join hims_d_test_category TC on TC.hims_d_test_category_id= IT.category_id  where LO.visit_id = ? and LO.hims_f_lab_order_id=?;' WHERE (`report_id` = '69');

ALTER TABLE `hims_d_inventory_options` 
ADD COLUMN `trans_ack_required` ENUM('N', 'Y') NULL DEFAULT 'N' AFTER `requisition_auth_level`;


UPDATE `algaeh_d_reports` SET `report_query` = 'select P.full_name as pat_name, V.visit_date, P.patient_code, V.age_in_years, P.gender, P.contact_number, trim(N.nationality)as nationality,  S.sub_department_name, G.generic_name, D.frequency, date_format(D.start_date ,\'%d-%m-%Y\')as from_date, D.dosage, D.no_of_days,  D.instructions, E.full_name as full_name, E.license_number, coalesce(IP.insurance_provider_name,\'--\')as insurance_provider_name,  coalesce(M.card_class,\'--\')as card_class , coalesce(M.primary_policy_num,\'--\')as primary_policy_num, I.sfda_code,CC.comment,ICD.daignosis_id, IC.icd_code from hims_f_prescription as H inner join hims_f_patient_visit as V on H.episode_id = V.episode_id  inner join hims_f_prescription_detail as D on prescription_id = H.hims_f_prescription_id  inner join hims_d_item_generic as G on G.hims_d_item_generic_id = D.generic_id  inner join hims_d_item_master as I on I.hims_d_item_master_id = D.item_id  inner join hims_f_patient as P on P.hims_d_patient_id = H.patient_id  inner join hims_d_nationality as N on N.hims_d_nationality_id = P.nationality_id  inner join hims_d_sub_department S on S.hims_d_sub_department_id = V.sub_department_id  inner join hims_d_employee E on E.hims_d_employee_id = H.provider_id inner join hims_f_episode_chief_complaint CC on H.episode_id = CC.episode_id left join hims_f_patient_diagnosis ICD on H.episode_id = ICD.episode_id left join hims_d_icd IC on ICD.daignosis_id = IC.hims_d_icd_id left join hims_m_patient_insurance_mapping as M on M.patient_visit_id = V.hims_f_patient_visit_id  left join hims_d_insurance_provider as IP on IP.hims_d_insurance_provider_id = M.primary_insurance_provider_id  where ICD.diagnosis_type="P" and V.patient_id=? and (V.hims_f_patient_visit_id =? or V.visit_code=?) ' WHERE (`report_id` = '14');


ALTER TABLE `hims_f_sales_dispatch_note_header` 
ADD COLUMN `cancelled_by` INT NULL DEFAULT NULL AFTER `updated_date`,
ADD COLUMN `cancelled_date` DATETIME NULL DEFAULT NULL AFTER `cancelled_by`;


ALTER TABLE `hims_f_sales_dispatch_note_header` 
ADD COLUMN `cancelled` ENUM('N', 'Y') NULL DEFAULT 'N' AFTER `updated_date`;


ALTER TABLE `hims_f_inventory_trans_history` 
CHANGE COLUMN `transaction_type` `transaction_type` ENUM('MR', 'MRA1', 'MRA2', 'MRA3', 'PO', 'POA1', 'POA2', 'POA3', 'DN', 'DNA', 'REC', 'INV', 'PR', 'CN', 'DBN', 'AD', 'ST', 'CS', 'POS', 'SRT', 'INT', 'OP', 'ACK', 'SDN', 'CDN') CHARACTER SET 'utf8' COLLATE 'utf8_latvian_ci' NULL DEFAULT NULL COMMENT 'MR\',=MATERIAL REQUISITION, ‘MRA1\',= MATERIAL REQUISITION AUTHORIZATION1,\n‘MRA2\',= MATERIAL REQUISITION AUTHORIZATION2, ‘MRA3\',= MATERIAL REQUISITION AUTHORIZATION3, ‘PO\',=PURCHASE ORDER, ‘POA1\',= PURCHASE ORDER AUTHORIZATION1,\n’POA2\',= PURCHASE ORDER AUTHORIZATION2, ‘POA3\',= PURCHASE ORDER AUTHORIZATION3, ’DN\',= DELIVERY NOTE, ‘DNA\',=DELIVERY NOTE AUTHORIZATION, ‘REC\',=RECIEPTS, ‘INV\',= INOVICES, ‘PR\',= PURCHASE RETURN, ‘CN\',= CREDIT NOTE, ‘DBN\',=DEBIT NOTE, ‘AD\',= ADJUSTMENT, ‘ST\',=STOCK TRANSFER, ‘CS\',=CONSUMPTION, ‘POS\'=POINT OF SALE, ‘SRT\',=SALES RETURN, ‘INT\',= INITIAL STOCK, ‘OP\' = OPBILL, ’ACK’,= TRANSFER ACKNOWLEDGE\' ,  ’SDN’ = SALES DISPATCH NOTE, ‘CND’=CANCEL DISPATCH NOTE' ;



CREATE TABLE `hims_f_sales_order_adj_services` (
  `hims_f_sales_order_adj_services_id` int NOT NULL AUTO_INCREMENT,
  `sales_order_id` int DEFAULT NULL,
  `services_id` int DEFAULT NULL,
  `unit_cost` decimal(10,3) DEFAULT '0.000',
  `quantity` decimal(10,2) DEFAULT '0.00',
  `extended_cost` decimal(10,3) DEFAULT '0.000',
  `discount_percentage` decimal(5,3) DEFAULT '0.000',
  `discount_amount` decimal(10,3) DEFAULT '0.000',
  `net_extended_cost` decimal(10,3) DEFAULT '0.000',
  `tax_percentage` decimal(10,3) DEFAULT '0.000',
  `tax_amount` decimal(10,3) DEFAULT '0.000',
  `total_amount` decimal(10,3) DEFAULT NULL,
  `service_frequency` enum('M','W','D','H','PT','PP') DEFAULT 'M' COMMENT 'M-Monthly,\\\\\\\\nW-Weekly,\\\\\\\\nD-Daily,\\\\\\\\nH-Hourly, PT- Per Trip, PP- Per Person',
  `comments` varchar(150) DEFAULT NULL,
  `arabic_comments` varchar(150) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  PRIMARY KEY (`hims_f_sales_order_adj_services_id`),
  KEY `hims_f_sales_order_adj_services_fk1_idx` (`sales_order_id`),
  KEY `hims_f_sales_order_adj_services_fk2_idx` (`services_id`),
  KEY `hims_f_sales_order_adj_services_fk3_idx` (`created_by`),
  CONSTRAINT `hims_f_sales_order_adj_services_fk1` FOREIGN KEY (`sales_order_id`) REFERENCES `hims_f_sales_order` (`hims_f_sales_order_id`),
  CONSTRAINT `hims_f_sales_order_adj_services_fk2` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_f_sales_order_adj_services_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `hims_f_sales_order_adj_item` (
  `hims_f_sales_order_adj_item_id` int NOT NULL AUTO_INCREMENT,
  `sales_order_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `unit_cost` decimal(10,3) DEFAULT '0.000',
  `quantity` decimal(10,2) DEFAULT '0.00',
  `extended_cost` decimal(10,3) DEFAULT '0.000',
  `discount_percentage` decimal(5,3) DEFAULT '0.000',
  `discount_amount` decimal(10,3) DEFAULT '0.000',
  `net_extended_cost` decimal(10,3) DEFAULT '0.000',
  `tax_percentage` decimal(10,3) DEFAULT '0.000',
  `tax_amount` decimal(10,3) DEFAULT '0.000',
  `total_amount` decimal(10,3) DEFAULT NULL,
  `quantity_outstanding` decimal(10,3) DEFAULT '0.000',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  PRIMARY KEY (`hims_f_sales_order_adj_item_id`),
  KEY `hims_f_sales_order_adj_item_fk1_idx` (`sales_order_id`),
  KEY `hims_f_sales_order_adj_item_fk2_idx` (`item_id`),
  KEY `hims_f_sales_order_adj_item_fk3_idx` (`uom_id`),
  KEY `hims_f_sales_order_adj_item_fk4_idx` (`created_by`),
  CONSTRAINT `hims_f_sales_order_adj_item_fk1` FOREIGN KEY (`sales_order_id`) REFERENCES `hims_f_sales_order` (`hims_f_sales_order_id`),
  CONSTRAINT `hims_f_sales_order_adj_item_fk2` FOREIGN KEY (`item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_f_sales_order_adj_item_fk3` FOREIGN KEY (`uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`),
  CONSTRAINT `hims_f_sales_order_adj_item_fk4` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


ALTER TABLE `hims_f_sales_order` 
ADD COLUMN `is_revert` ENUM('N', 'Y') NULL AFTER `is_posted`,
ADD COLUMN `reverted_by` INT NULL DEFAULT NULL AFTER `is_revert`,
ADD COLUMN `reverted_date` DATETIME NULL DEFAULT NULL AFTER `reverted_by`;

ALTER TABLE `hims_f_sales_order` 
CHANGE COLUMN `is_revert` `is_revert` ENUM('N', 'Y') NULL DEFAULT 'N' ;


ALTER TABLE `hims_f_sales_invoice_header` 
ADD COLUMN `is_revert` ENUM('N', 'Y') NULL DEFAULT 'N' AFTER `narration`,
ADD COLUMN `reverted_by` INT NULL DEFAULT NULL AFTER `is_revert`,
ADD COLUMN `reverted_date` DATETIME NULL DEFAULT NULL AFTER `reverted_by`;


ALTER TABLE `hims_d_sub_department` 
ADD COLUMN `sub_department_email` VARCHAR(300) NULL DEFAULT NULL AFTER `vitals_mandatory`,
ADD COLUMN `password` VARCHAR(250) NOT NULL COMMENT 'MD5 encrypted password' AFTER `sub_department_email` ;

INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('144', 'SALE_INV_POST', 'Sales Invoice Post', '2020-09-14 12:06:42', '2020-09-14 12:06:42', 'A');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('144', 'SALES_INV_RVT', 'Sales Invoice Revert', '2020-09-14 12:07:00', '2020-09-14 12:07:00', 'A');
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('144', 'SALES_INV_MAIN', 'Sales Maintanance', '2020-09-14 12:17:56', '2020-09-14 12:17:56', 'A');

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
  
  
  INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_input_series`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('billWiseVatReport', 'Bill Wise VAT Report', '[\'hospital_id\',\'from_date\',\'to_date\' ]', 'reportHeader', 'A', '2019-10-17 15:13:22', '2019-10-17 15:13:22');

-- ====== OP Ctrl In Mapping
INSERT INTO `finance_accounts_maping` (`finance_accounts_maping_id`, `account`, `description`) VALUES ('27', 'OP_CTRL', 'OP Control Account');

-- Query from 05-sept-2020 till 14-sept-2020 end here;


-- Query for Employee wise working hour on 17-sept-2020 Start
-- ====== Final Remittance
CREATE TABLE `hims_f_insurance_remitance` (
  `hims_f_insurance_remitance_id` int NOT NULL AUTO_INCREMENT,
  `claim_id` int DEFAULT NULL,
  `cliam_number` varchar(45) DEFAULT NULL,
  `head_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `amount` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_insurance_remitance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- ====== Insurance Write Off Account
INSERT INTO `finance_accounts_maping` (`finance_accounts_maping_id`, `account`, `description`) VALUES ('28', 'INS_WRITE_OFF', 'Insurance Write Off');
-- Query for Employee wise working hour on 17-sept-2020 End



-- Query for Employee wise working hour on 18-sept-2020 Start
alter table hims_d_employee add column standard_work_hours time default null
after service_dis_percentage, add column consider_overtime enum('Y','N') default  'N'
after standard_work_hours, add column ramzan_work_hours time default null 
after consider_overtime, add column week_day enum('SU','MO','TU','WE','TH','FR','SA') default null
after ramzan_work_hours;
-- Query for Employee wise working hour on 18-sept-2020 end



-- Query 18-sept-2020 Start
-- ====== Gratuity Min Year of service
ALTER TABLE `hims_d_end_of_service_options` ADD COLUMN `gratuity_min_year` INT NULL DEFAULT NULL AFTER `gratuity_provision`;

-- ====== Write off Amount in Statement
ALTER TABLE `hims_f_insurance_statement` 
ADD COLUMN `writeoff_amount` DECIMAL(20,3) NULL DEFAULT NULL AFTER `submission_step`;

-- ====== Final Remit Alert
ALTER TABLE `hims_f_insurance_remitance` 
DROP COLUMN `child_id`,
DROP COLUMN `head_id`,
ADD COLUMN `remit_amount` DECIMAL(10,3) NULL AFTER `company_payable`,
ADD COLUMN `denail_amount` DECIMAL(10,3) NULL AFTER `remit_amount`,
CHANGE COLUMN `amount` `company_payable` DECIMAL(10,3) NULL DEFAULT NULL ;

ALTER TABLE `hims_f_insurance_remitance` 
ADD COLUMN `writeoff_amount` DECIMAL(10,3) NULL AFTER `denail_amount`;

-- Query 18-sept-2020 End


-- Query 19-sept-2020 Start
-- ====== Package Related reports
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('cancelPackageByPatient', 'Cancelled Package by Patient', 'reportHeader', 'A', '2020-09-08 13:48:09', '2020-09-08 13:48:09');
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('orderdPackageByPatient', 'Ordered Package by Patient', 'reportHeader', 'A', '2020-09-08 13:48:09', '2020-09-08 13:48:09');
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('utlizePackageByPatient', 'Utilized Package by Patient', 'reportHeader', 'A', '2020-09-08 13:48:09', '2020-09-08 13:48:09');
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('typePackageByBranch', 'Type Package by Branch', 'reportHeader', 'A', '2020-09-08 13:48:09', '2020-09-08 13:48:09');
-- Query 19-sept-2020 End


-- Query 21-sept-2020 Start
-- ====== Package Report Updates
INSERT INTO `algaeh_d_reports` (`report_name`, `report_name_for_header`, `report_header_file_name`, `status`, `created_datetime`, `update_datetime`) VALUES ('outstandingPackageByPatient', 'Outstanding Package by Patient', 'reportHeader', 'A', '2020-09-08 13:48:09', '2020-09-08 13:48:09');
UPDATE `algaeh_d_reports` SET `report_name_for_header` = 'Ordered Package by Patient' WHERE (`report_name` = 'orderdPackageByPatient');
UPDATE `algaeh_d_reports` SET `report_name_for_header` = 'Utilized Package by Patient' WHERE (`report_name` = 'utlizePackageByPatient');


-- ====== Sales Invoice cancel option =======
ALTER TABLE `hims_f_sales_invoice_header` 
ADD COLUMN `is_cancelled` ENUM('N', 'Y') NULL DEFAULT 'N' AFTER `reverted_date`,
ADD COLUMN `cancelled_by` INT NULL AFTER `is_cancelled`,
ADD COLUMN `cancelled_date` DATETIME NULL AFTER `cancelled_by`;
ALTER TABLE `hims_f_sales_invoice_header` 
ADD COLUMN `cancel_reason` VARCHAR(200) NULL AFTER `is_cancelled`;
ALTER TABLE `hims_f_sales_order` 
ADD COLUMN `revert_reason` VARCHAR(200) NULL AFTER `is_revert`;

-- ====== HR Approval Email Setup Screen
INSERT INTO `algaeh_d_app_component` (`screen_id`, `component_code`, `component_name`, `created_date`, `updated_date`, `record_status`) VALUES ('86', 'PAY_ANN_EML_SET', 'Email Setup', '2020-09-21 14:42:30', '2020-09-21 14:42:30', 'A');
-- Query 21-sept-2020 End

-- 22nd Sept Query for Email Setup Start
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
-- 22nd Sept Query for Email Setup End