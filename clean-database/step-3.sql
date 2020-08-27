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