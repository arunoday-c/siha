import { LINQ } from "node-linq";
let algaehSearchConfig = (searchName, req) => {
  const hospitalId = req.userIdentity.hospital_id;
  let queries = {
    algaehSeach: [
      {
        searchName: "patients",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS  hims_d_patient_id, patient_code, registration_date, title_id,\
         first_name, middle_name, last_name, full_name, arabic_name, gender, religion_id, \
         date_of_birth, age, marital_status, address1, address2, contact_number, secondary_contact_number, \
         email, emergency_contact_name, emergency_contact_number, relationship_with_patient, visa_type_id, city_id, \
         state_id, country_id, nationality_id, postal_code, primary_identity_id, primary_id_no, secondary_identity_id, \
         secondary_id_no, photo_file, primary_id_file, secondary_id_file, advance_amount,employee_id from hims_f_patient \
         where record_status ='A' and hospital_id=" +
          hospitalId,
        orderBy: "hims_d_patient_id desc"
      },
      {
        searchName: "bills",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS hims_f_billing_header_id, BH.patient_id, visit_id, bill_number,\
          incharge_or_provider, bill_date, BH.advance_amount, advance_adjust, discount_amount, sub_total_amount, total_tax, \
          net_total, billing_status, copay_amount, deductable_amount, sec_copay_amount, sec_deductable_amount, gross_total, \
          sheet_discount_amount, sheet_discount_percentage, net_amount, patient_res, company_res, sec_company_res, \
          patient_payable, company_payable, sec_company_payable, patient_tax, company_tax, sec_company_tax, net_tax, \
          credit_amount, receiveable_amount, BH.created_by, BH.created_date, BH.updated_by, BH.updated_date, BH.record_status, \
          cancel_remarks,cancel_by, bill_comments, PAT.patient_code, PAT.full_name, PAT.contact_number,PATV.visit_code from hims_f_billing_header BH inner join hims_f_patient as PAT on  \
          BH.patient_id = PAT.hims_d_patient_id inner join hims_f_patient_visit as PATV on BH.visit_id = PATV.hims_f_patient_visit_id where BH.record_status ='A' and BH.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_billing_header_id desc"
      },
      {
        searchName: "insurance",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS Ins.hims_d_insurance_provider_id,Ins.insurance_provider_name, Ins.effective_end_date,\
          sIns.hims_d_insurance_sub_id, sIns.insurance_sub_name,\
          net.hims_d_insurance_network_id,  net.network_type, net.effective_start_date as net_effective_start_date, net.effective_end_date as net_effective_end_date, \
          netoff.hims_d_insurance_network_office_id, netoff.policy_number from \
          (((hims_d_insurance_network_office netoff INNER JOIN  hims_d_insurance_network net \
          ON netoff.network_id=net.hims_d_insurance_network_id)INNER JOIN hims_d_insurance_sub sIns ON \
          net.insurance_sub_id=sIns.hims_d_insurance_sub_id)INNER JOIN hims_d_insurance_provider Ins ON \
          sIns.insurance_provider_id=Ins.hims_d_insurance_provider_id) where netoff.record_status='A' ",
        orderBy: "netoff.hims_d_insurance_network_office_id desc",
        groupBy: " GROUP By netoff.hims_d_insurance_network_office_id"
      },
      {
        searchName: "visit",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS  full_name, patient_code, pv.visit_code, pv.visit_date, pv.patient_id,\
           pv.hims_f_patient_visit_id, \
          pv.insured, pv.sec_insured,pv.episode_id FROM hims_f_patient,hims_f_patient_visit pv where  \
          pv.patient_id=hims_f_patient.hims_d_patient_id and pv.record_status='A' and pv.hospital_id=" +
          hospitalId,
        orderBy: "pv.hims_f_patient_visit_id desc"
      },

      {
        searchName: "DoctorCommission",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_f_doctor_comission_header hospital_id=" +
          hospitalId,
        orderBy: "hims_f_doctor_comission_header_id desc"
      },
      {
        searchName: "initialstock",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_f_pharmacy_stock_header\
          where record_status ='A' and  hospital_id=" +
          hospitalId,
        orderBy: "hims_f_pharmacy_stock_header_id desc"
      },
      {
        searchName: "POSEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS PH.*, date(PH.pos_date) as posdate, V.visit_code, P.patient_code, P.full_name \
          from hims_f_pharmacy_pos_header PH \
          left join hims_f_patient P on PH.patient_id = P.hims_d_patient_id \
          left join hims_f_patient_visit V on PH.visit_id = V.hims_f_patient_visit_id \
          where PH.record_status ='A' and PH.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_pharmacy_pos_header_id desc"
      },
      {
        searchName: "POSNOReturn",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS PH.*,date(PH.pos_date) as posdate, V.visit_code, P.patient_code, P.full_name \
          from hims_f_pharmacy_pos_header PH \
          left join hims_f_patient P on PH.patient_id = P.hims_d_patient_id \
          left join hims_f_patient_visit V on PH.visit_id = V.hims_f_patient_visit_id \
          where PH.record_status ='A' and PH.posted='Y' and PH.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_pharmacy_pos_header_id desc"
      },
      {
        searchName: "REQEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_f_pharamcy_material_header and hospital_id=" +
          hospitalId,
        orderBy: "hims_f_pharamcy_material_header_id desc"
      },
      {
        searchName: "REQTransEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_f_pharamcy_material_header where authorize1 = 'Y' and authorie2 = 'Y'\
          and is_completed = 'N' and requistion_type='MR' and hospital_id=" +
          hospitalId,
        orderBy: "hims_f_pharamcy_material_header_id desc"
      },
      {
        searchName: "SalesReturn",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS *,date(sales_return_date) as return_date from hims_f_pharmcy_sales_return_header",
        orderBy: "hims_f_pharmcy_sales_return_header_id desc"
      },
      {
        searchName: "TransferEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS TH.*, FPL.location_description as from_location, \
          TPL.location_description as to_location \
          from hims_f_pharmacy_transfer_header TH, hims_d_pharmacy_location FPL, hims_d_pharmacy_location TPL \
          where FPL.hims_d_pharmacy_location_id = TH.from_location_id and  \
          TH.to_location_id = TPL.hims_d_pharmacy_location_id ",
        orderBy: "hims_f_pharmacy_transfer_header_id desc"
      },
      {
        searchName: "IcdCodes",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS hims_d_icd_id, icd_code, icd_description from hims_d_icd where record_status='A'",
        orderBy: "hims_d_icd_id desc"
      },
      {
        searchName: "CptCodes",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS hims_d_cpt_code_id, cpt_code, cpt_desc from hims_d_cpt_code where record_status='A'",
        orderBy: "hims_d_cpt_code_id desc"
      },
      {
        searchName: "InvoiceGen",
        searchQuery:
          "select hims_f_invoice_header_id, invoice_number, invoice_date, pat.patient_code, pat.full_name,\
          pv.visit_code from hims_f_invoice_header , hims_f_patient pat,  hims_f_patient_visit pv where \
          hims_f_invoice_header.patient_id = pat.hims_d_patient_id and pv.hims_f_patient_visit_id = hims_f_invoice_header.visit_id \
          and pv.patient_id= pat.hims_d_patient_id and hims_f_invoice_header.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_invoice_header_id desc"
      },
      {
        searchName: "invinitialstock",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_f_inventory_stock_header where record_status ='A'and hospital_id=" +
          hospitalId,
        orderBy: "hims_f_inventory_stock_header_id desc"
      },
      {
        searchName: "InvREQEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_f_inventory_material_header where hospital_id=" +
          hospitalId,
        orderBy: "hims_f_inventory_material_header_id desc"
      },
      {
        searchName: "InvTransferEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS TH.*, FPL.location_description as from_location,   \
          TPL.location_description as to_location from hims_f_inventory_transfer_header TH, \
          hims_d_inventory_location FPL, hims_d_inventory_location TPL          \
          where FPL.hims_d_inventory_location_id = TH.from_location_id and           \
          TH.to_location_id = TPL.hims_d_inventory_location_id and  TH.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_inventory_transfer_header_id desc"
      },
      {
        searchName: "InvREQTransEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_f_inventory_material_header where authorize1 = 'Y' and authorie2 = 'Y'\
          and is_completed = 'N' and requistion_type='MR' and  hospital_id=" +
          hospitalId,
        orderBy: "hims_f_inventory_material_header_id desc"
      },
      {
        searchName: "InvPOEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_f_inventory_material_header where authorize1 = 'Y' and authorie2 = 'Y'\
          and is_completed = 'N' and requistion_type='PR' and hospital_id=" +
          hospitalId,
        orderBy: "hims_f_inventory_material_header_id desc"
      },
      {
        searchName: "PhrPOEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_f_pharamcy_material_header where authorize1 = 'Y' and authorie2 = 'Y'\
          and is_completed = 'N' and requistion_type='PR' and hospital_id=" +
          hospitalId,
        orderBy: "hims_f_pharamcy_material_header_id desc"
      },
      {
        searchName: "POEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_f_procurement_po_header where hospital_id=" +
          hospitalId,
        orderBy: "hims_f_procurement_po_header_id desc"
      },
      {
        searchName: "POEntryGetDN",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_f_procurement_po_header where authorize1 = 'Y'\
           and cancelled='N' and is_completed='N' and  hospital_id=" +
          hospitalId,
        orderBy: "hims_f_procurement_po_header_id desc"
      },
      {
        searchName: "DNEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_f_procurement_dn_header where hospital_id=" +
          hospitalId,
        orderBy: "hims_f_procurement_dn_header_id desc"
      },
      {
        searchName: "DNEntryInReceipt",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_f_procurement_dn_header where cancelled='N'  and is_completed='N' and  hospital_id=" +
          hospitalId,
        orderBy: "hims_f_procurement_dn_header_id desc"
      },
      {
        searchName: "ReceiptEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_f_procurement_grn_header where hospital_id=" +
          hospitalId,
        orderBy: "hims_f_procurement_grn_header_id desc"
      },
      {
        searchName: "billsforCanel",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS hims_f_billing_header_id, bill_number, bill_date, PAT.patient_code, PAT.full_name, PAT.contact_number,\
          PATV.visit_code from hims_f_billing_header BH inner join hims_f_patient as PAT on  \
          BH.patient_id = PAT.hims_d_patient_id inner join hims_f_patient_visit as PATV on BH.visit_id = PATV.hims_f_patient_visit_id\
          where BH.record_status ='A' and cancelled='N' and BH.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_billing_header_id desc"
      },
      {
        searchName: "cancelbills",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS hims_f_bill_cancel_header_id, bill_cancel_number, bill_cancel_date, \
          PAT.patient_code, PAT.full_name, PAT.contact_number, PATV.visit_code,BILLING.bill_number, BILLING.bill_date \
           from hims_f_bill_cancel_header BH inner join hims_f_patient as PAT on  BH.patient_id = PAT.hims_d_patient_id \
           inner join hims_f_patient_visit as PATV on BH.visit_id = PATV.hims_f_patient_visit_id\
          inner join hims_f_billing_header as BILLING on BH.from_bill_id = BILLING.hims_f_billing_header_id \
          where BH.record_status ='A' and BH.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_bill_cancel_header_id desc"
      },
      {
        searchName: "opCreidt",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS hims_f_credit_header_id, credit_number, credit_date, \
          PAT.patient_code from hims_f_credit_header BH inner join hims_f_patient as PAT on  \
          BH.patient_id = PAT.hims_d_patient_id and BH.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_credit_header_id desc"
      },
      {
        searchName: "POSCreidt",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS hims_f_pos_credit_header_id, pos_credit_number, pos_credit_date, \
          PAT.patient_code from hims_f_pos_credit_header BH inner join hims_f_patient as PAT on  \
          BH.patient_id = PAT.hims_d_patient_id and BH.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_pos_credit_header_id desc"
      },
      {
        searchName: "employee",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS hims_d_employee_id, employee_code,biometric_id, title_id, full_name, arabic_name, employee_designation_id,\
           sex, religion_id, marital_status, date_of_birth, date_of_joining, date_of_resignation, reliving_date,\
            notice_period, exit_date, employe_exit_type, appointment_type, employee_type, present_address, present_address2,\
             present_pincode, present_city_id, present_state_id, present_country_id, permanent_address, permanent_address2,\
              permanent_pincode, permanent_city_id, permanent_state_id, permanent_country_id, primary_contact_no, secondary_contact_no,\
               email, nationality, emergency_contact_person, emergency_contact_no, blood_group, isdoctor, license_number, employee_status,\
                inactive_date, exclude_machine_data, company_bank_id, employee_bank_name, employee_bank_ifsc_code, employee_account_number,\
                 mode_of_payment, accomodation_provided, late_coming_rule, leave_salary_process, pf_applicable,\
                  airfare_process, entitled_daily_ot, suspend_salary, last_salary_process_date, gratuity_applicable,\
                   contract_type, employee_group_id, weekoff_from, overtime_group_id, reporting_to_id, sub_department_id,\
                    hospital_id, gross_salary, yearly_gross_salary, total_earnings, total_deductions, total_contributions,\
                     net_salary, cost_to_company, effective_start_date, effective_end_date, created_date, created_by, updated_date, updated_by from hims_d_employee\
                     where record_status='A'  and hospital_id=" +
          hospitalId,
        orderBy: "hims_d_employee_id desc"
      },
      {
        searchName: "exit_employees",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS hims_d_employee_id, employee_code, biometric_id, title_id, full_name, arabic_name, employee_designation_id,\
           sex, religion_id, marital_status, date_of_birth, date_of_joining, date_of_resignation, reliving_date,\
            notice_period, exit_date, employe_exit_type, appointment_type, employee_type, present_address, present_address2,\
             present_pincode, present_city_id, present_state_id, present_country_id, permanent_address, permanent_address2,\
              permanent_pincode, permanent_city_id, permanent_state_id, permanent_country_id, primary_contact_no, secondary_contact_no,\
               email, nationality, emergency_contact_person, emergency_contact_no, blood_group, isdoctor, license_number, employee_status,\
                inactive_date, exclude_machine_data, company_bank_id, employee_bank_name, employee_bank_ifsc_code, employee_account_number,\
                 mode_of_payment, accomodation_provided, late_coming_rule, leave_salary_process, pf_applicable,\
                  airfare_process, entitled_daily_ot, suspend_salary, last_salary_process_date, gratuity_applicable,\
                   contract_type, employee_group_id, weekoff_from, overtime_group_id, reporting_to_id, sub_department_id,\
                    hospital_id, gross_salary, yearly_gross_salary, total_earnings, total_deductions, total_contributions,\
                     net_salary, cost_to_company, effective_start_date, effective_end_date, created_date, created_by, updated_date, updated_by from hims_d_employee\
                     where record_status='A' and employee_status in('R','T','E') and BH.hospital_id=" +
          hospitalId,
        orderBy: "hims_d_employee_id desc"
      },
      {
        searchName: "new_employees",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS  hims_d_employee_id,employee_code,full_name,date_of_joining \
          from hims_d_employee E left join hims_m_user_employee UM on E.hims_d_employee_id=UM.employee_id\
          where E.record_status='A' and UM.employee_id is null and E.hospital_id=" +
          hospitalId,
        orderBy: "hims_d_employee_id desc"
      },

      {
        searchName: "loan_apply",
        searchQuery:
          "select  hims_f_loan_application_id,loan_application_number,employee_id, loan_application_date,approved_amount, \
          start_month, start_year, emp.employee_code, emp.full_name from hims_f_loan_application, hims_d_employee emp \
          where hims_f_loan_application.employee_id = emp.hims_d_employee_id and hims_f_loan_application.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_loan_application_id desc"
      },
      {
        searchName: "advance_apply",
        searchQuery:
          "select  hims_f_employee_advance_id,advance_number,employee_id,advance_amount, \
          emp.employee_code, emp.full_name from hims_f_employee_advance, hims_d_employee emp \
          where hims_f_employee_advance.employee_id = emp.hims_d_employee_id and hims_f_employee_advance.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_employee_advance_id desc"
      },
      {
        searchName: "encash_leave",
        searchQuery:
          "select  hims_f_leave_encash_header_id,encashment_number,employee_id, encashment_date,total_amount, \
          emp.employee_code, emp.full_name from hims_f_leave_encash_header, hims_d_employee emp \
          where hims_f_leave_encash_header.employee_id = emp.hims_d_employee_id and  hims_f_leave_encash_header.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_leave_encash_header_id desc"
      },
      {
        searchName: "end_of_service",
        searchQuery:
          "select  hims_f_end_of_service_id,end_of_service_number,employee_id, transaction_date,payable_amount, \
          emp.employee_code, emp.full_name from hims_f_end_of_service, hims_d_employee emp \
          where hims_f_end_of_service.employee_id = emp.hims_d_employee_id and  hims_f_end_of_service.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_end_of_service_id desc"
      },
      {
        searchName: "final_settlement",
        searchQuery:
          "select  hims_f_final_settlement_header_id,final_settlement_number,employee_id, settled_date,total_amount, \
          emp.employee_code, emp.full_name from hims_f_final_settlement_header, hims_d_employee emp \
          where hims_f_final_settlement_header.employee_id = emp.hims_d_employee_id and  hims_f_final_settlement_header.hospital_id=" +
          hospitalId,

        orderBy: "hims_f_final_settlement_header_id desc"
      },
      {
        searchName: "leave_settlement",
        searchQuery:
          "select  hims_f_leave_salary_header_id,leave_salary_number,employee_id, hims_f_leave_salary_header.created_date,\
          total_amount, emp.employee_code, emp.full_name from hims_f_leave_salary_header, hims_d_employee emp \
          where hims_f_leave_salary_header.employee_id = emp.hims_d_employee_id and hims_f_leave_salary_header.hospital_id=" +
          hospitalId,

        orderBy: "hims_f_leave_salary_header_id desc"
      },
      {
        searchName: "users",
        searchQuery:
          "select algaeh_d_app_user_id,E.full_name as full_name ,employee_code,arabic_name,E.sub_department_id,primary_contact_no,sex\
          from algaeh_d_app_user U inner join  hims_m_user_employee UM on U.algaeh_d_app_user_id=UM.user_id\
          inner join hims_d_employee E on UM.employee_id=E.hims_d_employee_id and UM.hospital_id=" +
          hospitalId,
        orderBy: "algaeh_d_app_user_id desc"
      },
      {
        searchName: "itemmaster",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS IM.hims_d_item_master_id, IM.item_description, IM.category_id, IM.sales_uom_id,\
          IM.service_id, IM.group_id, IC.category_desc, IE.generic_name,\
          IG.group_description, PU.uom_description,SR.standard_fee from hims_d_item_master IM, hims_d_item_category IC, \
          hims_d_item_generic IE, hims_d_item_group IG, hims_d_pharmacy_uom PU, hims_d_services SR where \
          IM.category_id = IC.hims_d_item_category_id and IM.group_id = IG.hims_d_item_group_id and \
          IM.generic_id = IE.hims_d_item_generic_id and IM.sales_uom_id=PU.hims_d_pharmacy_uom_id and \
          IM.service_id= SR.hims_d_services_id  and IM.item_status='A' and IM.record_status='A' and \
          IC.record_status='A' and IE.record_status='A' and IG.record_status='A' ",
        orderBy: "IM.hims_d_item_master_id desc"
      },
      {
        searchName: "PharConsEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_f_pharmacy_consumption_header where hospital_id=" +
          hospitalId,
        orderBy: "hims_f_pharmacy_consumption_header_id desc"
      },
      {
        searchName: "InvConsEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_f_inventory_consumption_header where hospital_id=" +
          hospitalId,
        orderBy: "hims_f_inventory_consumption_header_id desc"
      },
      {
        searchName: "servicemaster",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_d_services S left outer join hims_d_service_type ST on \
          S.service_type_id=ST.hims_d_service_type_id where S.service_status='A' ",
        orderBy: "hims_d_services_id desc"
      },
      {
        searchName: "saleitemmaster",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS IM.hims_d_inventory_item_master_id, IM.item_description, IM.category_id, IM.sales_uom_id,IM.service_id, IM.group_id, IC.category_desc,\
          IG.group_description, PU.uom_description,SR.standard_fee from hims_d_inventory_item_master IM, hims_d_item_category IC, hims_d_item_group IG, hims_d_inventory_uom PU, \
          hims_d_services SR where IM.category_id = IC.hims_d_item_category_id and \
          IM.group_id = IG.hims_d_item_group_id and IM.sales_uom_id=PU.hims_d_inventory_uom_id and \
          IM.service_id= SR.hims_d_services_id  and item_type = 'OITM' and IM.item_status='A' and \
          IM.record_status='A' and IC.record_status='A' and IG.record_status='A' ",
        orderBy: "IM.hims_d_inventory_item_master_id desc"
      },
      {
        searchName: "invitemmaster",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS IM.hims_d_inventory_item_master_id,IM.item_description,IM.category_id, IM.sales_uom_id,IM.service_id, \
          IM.group_id,IC.category_desc,IG.group_description, PU.uom_description, IL.inventory_location_id, \
          IL.batchno,IL.expirydt,IL.barcode,IL.qtyhand,IL.avgcost,IL.sales_uom,IL.grnno  from hims_d_inventory_item_master IM, \
          hims_d_inventory_tem_category IC, hims_d_inventory_item_group IG, hims_d_inventory_uom PU, \
          hims_m_inventory_item_location IL where IM.category_id = IC.hims_d_inventory_tem_category_id \
          and IM.group_id = IG.hims_d_inventory_item_group_id and IM.sales_uom_id=PU.hims_d_inventory_uom_id \
          and IL.item_id = IM.hims_d_inventory_item_master_id",
        orderBy: "IM.hims_d_inventory_item_master_id desc"
      }
    ]
  };

  let row = new LINQ(queries.algaehSeach)
    .Where(
      w =>
        String(w.searchName).toUpperCase() === String(searchName).toUpperCase()
    )
    .FirstOrDefault();
  return row;
};

module.exports = {
  algaehSearchConfig
};
