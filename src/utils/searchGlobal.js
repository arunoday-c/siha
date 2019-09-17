import { LINQ } from "node-linq";
let algaehSearchConfig = (searchName, req) => {
  const hospitalId = req.userIdentity.hospital_id;
  let queries = {
    algaehSeach: [
      {
        searchName: "patients",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS  hims_d_patient_id, patient_code,primary_id_no, full_name, arabic_name,  contact_number, employee_id, age, date_of_birth, gender, email, title_id  from hims_f_patient \
         where record_status='A' "
      },
      {
        searchName: "patientappoinment",
        searchQuery:
          "select PA.patient_id,PA.patient_code, PA.appointment_from_time, PA.patient_name,\
              PA.contact_number, P.employee_id, E.full_name as provider_name, SD.sub_department_name, \
              PA.provider_id, PA.sub_department_id, PA.arabic_name,PA.appointment_status_id, \
              PA.date_of_birth, PA.age,PA.email, PA.gender, PA.number_of_slot as no_of_slots, PA.title_id \
              from hims_f_patient_appointment PA left join hims_f_patient P on PA.patient_id = P.hims_d_patient_id \
              inner join hims_d_sub_department SD on PA.sub_department_id = SD.hims_d_sub_department_id \
              inner join hims_d_employee E on PA.provider_id = E.hims_d_employee_id \
              where date(appointment_date) = date(?)  and visit_created='N' and PA.hospital_id=" +
          hospitalId,
        inputSequence: ["appointment_date"]
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
          "select SQL_CALC_FOUND_ROWS Ins.hims_d_insurance_provider_id,Ins.insurance_provider_name, Ins.effective_end_date,Ins.effective_start_date,\
          sIns.hims_d_insurance_sub_id, sIns.insurance_sub_name,\
          net.hims_d_insurance_network_id,  net.network_type, net.effective_start_date as net_effective_start_date, net.effective_end_date as net_effective_end_date, \
          netoff.hims_d_insurance_network_office_id, netoff.policy_number from \
          (((hims_d_insurance_network_office netoff INNER JOIN  hims_d_insurance_network net \
          ON netoff.network_id=net.hims_d_insurance_network_id)INNER JOIN hims_d_insurance_sub sIns ON \
          net.insurance_sub_id=sIns.hims_d_insurance_sub_id )INNER JOIN hims_d_insurance_provider Ins ON \
          sIns.insurance_provider_id=Ins.hims_d_insurance_provider_id ) where netoff.record_status='A' \
          and sIns.record_status='A' and Ins.record_status='A'",
        orderBy: "netoff.hims_d_insurance_network_office_id desc",
        groupBy: " GROUP By netoff.hims_d_insurance_network_office_id"
      },
      {
        searchName: "visit",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS  full_name, patient_code, contact_number, nationality_id,pv.visit_code, pv.visit_date,\
          pv.patient_id, pv.hims_f_patient_visit_id, \
          pv.insured, pv.sec_insured,pv.episode_id FROM hims_f_patient,hims_f_patient_visit pv where  \
          pv.patient_id=hims_f_patient.hims_d_patient_id and pv.record_status='A' and\
          date(pv.visit_expiery_date) > date(now()) and pv.hospital_id=" +
          hospitalId,
        orderBy: "pv.hims_f_patient_visit_id desc"
      },

      {
        searchName: "DoctorCommission",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_f_doctor_comission_header where hospital_id=" +
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
          "select SQL_CALC_FOUND_ROWS PH.*, date(PH.pos_date) as pos_date, V.visit_code, P.patient_code,\
        CASE WHEN PH.pos_customer_type='OP' THEN P.full_name else PH.patient_name END as patient_name, \
        CASE WHEN PH.pos_customer_type='OP' THEN P.contact_number else PH.mobile_number END as mobile_number \
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
          "select SQL_CALC_FOUND_ROWS PH.*, date(PH.pos_date) as pos_date, V.visit_code, P.patient_code,\
          CASE WHEN PH.pos_customer_type='OP' THEN P.full_name else PH.patient_name END as patient_name, \
          CASE WHEN PH.pos_customer_type='OP' THEN P.contact_number else PH.mobile_number END as mobile_number \
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
          "select SQL_CALC_FOUND_ROWS RH.*,date(RH.requistion_date) as requistion_date, \
          FPL.location_description as from_location,\
          TPL.location_description as to_location from hims_f_pharamcy_material_header RH,\
          hims_d_pharmacy_location FPL, hims_d_pharmacy_location TPL \
          where FPL.hims_d_pharmacy_location_id = RH.from_location_id and \
          RH.to_location_id = TPL.hims_d_pharmacy_location_id and  RH.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_pharamcy_material_header_id desc"
      },
      {
        searchName: "REQTransEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS RH.*, date(RH.requistion_date) as requistion_date,\
          FPL.location_description as from_location, \
          TPL.location_description as to_location from hims_f_pharamcy_material_header RH, \
          hims_d_pharmacy_location FPL, hims_d_pharmacy_location TPL \
          where FPL.hims_d_pharmacy_location_id = RH.from_location_id and \
          RH.to_location_id = TPL.hims_d_pharmacy_location_id and RH.authorize1 = 'Y' and RH.authorie2 = 'Y' \
          and RH.is_completed = 'N' and RH.requistion_type='MR' and RH.cancelled='N' and  RH.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_pharamcy_material_header_id desc"
      },
      {
        searchName: "SalesReturn",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS *,date(sales_return_date) as sales_return_date from hims_f_pharmcy_sales_return_header where hospital_id=" +
          hospitalId,
        orderBy: "hims_f_pharmcy_sales_return_header_id desc"
      },
      {
        searchName: "TransferEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS PH.*, FPL.location_description as from_location, \
          TPL.location_description as to_location, date(PH.transfer_date) as transfer_date \
          from hims_f_pharmacy_transfer_header PH, hims_d_pharmacy_location FPL, hims_d_pharmacy_location TPL \
          where FPL.hims_d_pharmacy_location_id = PH.from_location_id and  \
          PH.to_location_id = TPL.hims_d_pharmacy_location_id ",
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
          "select SQL_CALC_FOUND_ROWS RH.*,date(RH.requistion_date) as requistion_date,\
          FPL.location_description as from_location, \
          TPL.location_description as to_location from hims_f_inventory_material_header RH,\
          hims_d_inventory_location FPL, hims_d_inventory_location TPL \
          where FPL.hims_d_inventory_location_id = RH.from_location_id and \
          RH.to_location_id = TPL.hims_d_inventory_location_id and  RH.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_inventory_material_header_id desc"
      },
      {
        searchName: "InvTransferEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS TH.*, FPL.location_description as from_location,   \
          TPL.location_description as to_location,date(TH.transfer_date) as transfer_date from hims_f_inventory_transfer_header TH, \
          hims_d_inventory_location FPL, hims_d_inventory_location TPL          \
          where FPL.hims_d_inventory_location_id = TH.from_location_id and           \
          TH.to_location_id = TPL.hims_d_inventory_location_id and  TH.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_inventory_transfer_header_id desc"
      },
      {
        searchName: "InvREQTransEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS RH.*, date(RH.requistion_date) as requistion_date, \
          FPL.location_description as from_location, \
          TPL.location_description as to_location from hims_f_inventory_material_header RH,\
          hims_d_inventory_location FPL, hims_d_inventory_location TPL \
          where FPL.hims_d_inventory_location_id = RH.from_location_id and \
          RH.to_location_id = TPL.hims_d_inventory_location_id and RH.authorize1 = 'Y' and RH.authorie2 = 'Y'\
          and RH.is_completed = 'N' and RH.requistion_type='MR' and RH.cancelled='N' and  RH.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_inventory_material_header_id desc"
      },
      {
        searchName: "InvPOEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS RH.*, date(RH.requistion_date) as requistion_date, \
        FPL.location_description as from_location, \
        TPL.location_description as to_location from hims_f_inventory_material_header RH,\
        hims_d_inventory_location FPL, hims_d_inventory_location TPL \
        where FPL.hims_d_inventory_location_id = RH.from_location_id and \
        RH.to_location_id = TPL.hims_d_inventory_location_id and RH.authorize1 = 'Y' and RH.authorie2 = 'Y'\
        and RH.is_completed = 'N' and RH.cancelled='N' and  RH.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_inventory_material_header_id desc"
      },
      {
        searchName: "PhrPOEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS RH.*, date(RH.requistion_date) as requistion_date,\
            FPL.location_description as from_location, \
            TPL.location_description as to_location from hims_f_pharamcy_material_header RH, \
            hims_d_pharmacy_location FPL, hims_d_pharmacy_location TPL \
            where FPL.hims_d_pharmacy_location_id = RH.from_location_id and \
            RH.to_location_id = TPL.hims_d_pharmacy_location_id and RH.authorize1 = 'Y' and RH.authorie2 = 'Y' \
            and RH.is_completed = 'N' and RH.cancelled='N' and  RH.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_pharamcy_material_header_id desc"
      },
      {
        searchName: "POEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS PO.*, PO.po_date as podate, CASE PO.po_from WHEN 'INV' then 'Inventory' \
          else 'Pharmacy' end as po_from , CASE PO.po_from WHEN 'INV' then IL.location_description \
          else PL.location_description end as loc_description,V.vendor_name \
          from hims_f_procurement_po_header PO \
          inner join hims_d_vendor V on PO.vendor_id = V.hims_d_vendor_id \
          left join hims_d_pharmacy_location PL on PO.pharmcy_location_id = PL.hims_d_pharmacy_location_id\
          left join hims_d_inventory_location IL on PO.inventory_location_id = IL.hims_d_inventory_location_id \
          where PO.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_procurement_po_header_id desc"
      },
      {
        searchName: "POEntryGetDN",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS PO.*, date(PO.po_date) as po_date, CASE PO.po_from WHEN 'INV' then 'Inventory' \
            else 'Pharmacy' end as po_from , CASE PO.po_from WHEN 'INV' then IL.location_description \
            else PL.location_description end as loc_description,V.vendor_name \
            from hims_f_procurement_po_header PO \
            inner join hims_d_vendor V on PO.vendor_id = V.hims_d_vendor_id \
            left join hims_d_pharmacy_location PL on PO.pharmcy_location_id = PL.hims_d_pharmacy_location_id\
            left join hims_d_inventory_location IL on PO.inventory_location_id = IL.hims_d_inventory_location_id \
            where cancelled='N' and is_completed='N' and authorize1='Y' and  PO.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_procurement_po_header_id desc"
      },
      {
        searchName: "POEntryGetReceipt",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS PO.*, date(PO.po_date) as po_date, CASE PO.po_from WHEN 'INV' then 'Inventory' \
            else 'Pharmacy' end as po_from , CASE PO.po_from WHEN 'INV' then IL.location_description \
            else PL.location_description end as loc_description,V.vendor_name \
            from hims_f_procurement_po_header PO \
            inner join hims_d_vendor V on PO.vendor_id = V.hims_d_vendor_id \
            left join hims_d_pharmacy_location PL on PO.pharmcy_location_id = PL.hims_d_pharmacy_location_id\
            left join hims_d_inventory_location IL on PO.inventory_location_id = IL.hims_d_inventory_location_id \
            where authorize1 = 'Y' and cancelled='N' and  PO.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_procurement_po_header_id desc"
      },
      {
        searchName: "DNEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS DN.*, date(DN.dn_date) as dn_date, CASE DN.dn_from WHEN 'INV' then \
          'Inventory' else 'Pharmacy' end as dn_from , CASE DN.dn_from WHEN 'INV' then IL.location_description \
          else PL.location_description end as loc_description,V.vendor_name \
          from hims_f_procurement_dn_header DN \
          inner join hims_d_vendor V on DN.vendor_id = V.hims_d_vendor_id \
          left join hims_d_pharmacy_location PL on DN.pharmcy_location_id = PL.hims_d_pharmacy_location_id\
          left join hims_d_inventory_location IL on DN.inventory_location_id = IL.hims_d_inventory_location_id \
          where DN.hospital_id=" +
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
          "select SQL_CALC_FOUND_ROWS GH.*, date(GH.grn_date) as grn_date, CASE GH.grn_for WHEN 'INV' then \
          'Inventory' else 'Pharmacy' end as grn_for , CASE GH.grn_for WHEN 'INV' then IL.location_description \
          else PL.location_description end as loc_description,V.vendor_name from hims_f_procurement_grn_header GH \
          inner join hims_d_vendor V on GH.vendor_id = V.hims_d_vendor_id \
          left join hims_d_pharmacy_location PL on GH.pharmcy_location_id = PL.hims_d_pharmacy_location_id\
          left join hims_d_inventory_location IL on GH.inventory_location_id = IL.hims_d_inventory_location_id \
          where GH.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_procurement_grn_header_id desc"
      },
      {
        searchName: "billsforCanel",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS hims_f_billing_header_id, bill_number, bill_date, PAT.patient_code, PAT.full_name, PAT.contact_number,\
          PATV.visit_code from hims_f_billing_header BH inner join hims_f_patient as PAT on  \
          BH.patient_id = PAT.hims_d_patient_id inner join hims_f_patient_visit as PATV on \
          BH.visit_id = PATV.hims_f_patient_visit_id where BH.record_status ='A' and \
          cancelled='N' and BH.invoice_generated='N' and BH.hospital_id=" +
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
          "select SQL_CALC_FOUND_ROWS E.*, SD.sub_department_name,D.hims_d_department_id,\
          D.department_name, DS.designation from  hims_d_employee E \
          left join   hims_d_sub_department SD on E.sub_department_id = SD.hims_d_sub_department_id\
          left join hims_d_department D on SD.department_id = D.hims_d_department_id\
          left join hims_d_designation DS  on  E.employee_designation_id = DS.hims_d_designation_id \
          WHERE E.record_status = 'A' and E.hospital_id=" +
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
                     where record_status='A' and employee_status in('R','T','E') and hospital_id=" +
          hospitalId,
        orderBy: "hims_d_employee_id desc"
      },
      {
        searchName: "new_employees",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS  hims_d_employee_id,employee_code,full_name,date_of_joining \
          from hims_d_employee E left join  algaeh_d_app_user U  on E.hims_d_employee_id=U.employee_id\
          where E.record_status='A' and U.employee_id is null and E.hospital_id=" +
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
          "select  hims_f_leave_salary_header_id,leave_salary_number,employee_id, \
          date(LH.leave_salary_date) as leave_salary_date, total_amount, emp.employee_code, \
          emp.full_name from hims_f_leave_salary_header LH, hims_d_employee emp \
          where LH.employee_id = emp.hims_d_employee_id and LH.hospital_id=" +
          hospitalId,

        orderBy: "hims_f_leave_salary_header_id desc"
      },
      {
        searchName: "users",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS algaeh_d_app_user_id,E.full_name as full_name ,employee_code,arabic_name,E.sub_department_id,\
          primary_contact_no,sex from algaeh_d_app_user U inner join hims_d_employee E on U.employee_id=E.hims_d_employee_id\
          inner join  hims_m_user_employee UM on U.algaeh_d_app_user_id=UM.user_id\
           where E.record_status='A' and UM.hospital_id=" +
          hospitalId,
        orderBy: "algaeh_d_app_user_id desc"
      },
      {
        searchName: "itemmaster",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS IM.hims_d_item_master_id, IM.item_description, IM.category_id, IM.sales_uom_id,\
          IM.service_id, IM.group_id, IM.stocking_uom_id, IC.category_desc, IE.generic_name, IG.group_description,\
          PU.uom_description,STOCK_UOM.uom_description as stocking_uom, SR.standard_fee,IL.sale_price,\
          IL.avgcost from hims_d_item_master IM,\
          hims_d_item_category IC, hims_d_item_generic IE, hims_d_item_group IG, hims_d_pharmacy_uom PU,\
          hims_d_pharmacy_uom STOCK_UOM, hims_d_services SR, hims_m_item_location IL where \
          IL.item_id = IM.hims_d_item_master_id and\
          IM.category_id = IC.hims_d_item_category_id and IM.group_id = IG.hims_d_item_group_id and \
          IM.generic_id = IE.hims_d_item_generic_id and IM.sales_uom_id=PU.hims_d_pharmacy_uom_id and \
          IM.stocking_uom_id=STOCK_UOM.hims_d_pharmacy_uom_id and IM.service_id= SR.hims_d_services_id  and \
          IM.item_status='A' and IM.record_status='A' and \
          IC.record_status='A' and IE.record_status='A' and IG.record_status='A' and IL.pharmacy_location_id=? ",
        orderBy: "IM.hims_d_item_master_id desc",
        groupBy: " GROUP By hims_d_item_master_id",
        inputSequence: ["pharmacy_location_id"]
      },
      {
        searchName: "pharopeningstock",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS IM.*, IC.category_desc, IE.generic_name, IG.group_description,\
            SPU.uom_description as stock_uom_desc, SAPU.uom_description sales_uom_desc \
            from hims_d_item_master IM,hims_d_item_category IC, hims_d_item_generic IE,\
            hims_d_item_group IG,hims_d_pharmacy_uom SPU,hims_d_pharmacy_uom SAPU \
            where IM.category_id = IC.hims_d_item_category_id and IM.group_id = IG.hims_d_item_group_id \
            and IM.generic_id = IE.hims_d_item_generic_id and IM.stocking_uom_id = SPU.hims_d_pharmacy_uom_id \
            and IM.sales_uom_id = SAPU.hims_d_pharmacy_uom_id and IM.item_status='A' ",
        orderBy: "hims_d_item_master_id desc"
      },
      {
        searchName: "invopeningstock",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS IM.*, IC.category_desc, IG.group_description,\
            SPU.uom_description as stock_uom_desc, SAPU.uom_description sales_uom_desc \
            from hims_d_inventory_item_master IM,hims_d_inventory_tem_category IC, hims_d_inventory_item_group IG,\
            hims_d_inventory_uom SPU,hims_d_inventory_uom SAPU \
            where IM.category_id = IC.hims_d_inventory_tem_category_id \
            and IM.group_id = IG.hims_d_inventory_item_group_id \
            and IM.stocking_uom_id = SPU.hims_d_inventory_uom_id \
            and IM.sales_uom_id = SAPU.hims_d_inventory_uom_id and IM.item_status='A' ",
        orderBy: "hims_d_inventory_item_master_id desc"
      },
      {
        searchName: "PharConsEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS H.*,date(H.consumption_date) as consumption_date, PL.location_description\
            from hims_f_pharmacy_consumption_header H, hims_d_pharmacy_location PL where \
            PL.hims_d_pharmacy_location_id = H.location_id and H.hospital_id=" +
          hospitalId,
        orderBy: "hims_f_pharmacy_consumption_header_id desc"
      },
      {
        searchName: "InvConsEntry",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS H.*,date(H.consumption_date) as consumption_date, IL.location_description,\
            EMP.full_name as doctor_name  from hims_f_inventory_consumption_header H \
            inner join hims_d_inventory_location IL on IL.hims_d_inventory_location_id = H.location_id  \
            inner join hims_d_employee EMP on EMP.hims_d_employee_id = H.provider_id  \
            where H.hospital_id=" +
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
          IG.group_description, PU.uom_description,SR.standard_fee from hims_d_inventory_item_master IM, hims_d_inventory_tem_category IC, hims_d_inventory_item_group IG, hims_d_inventory_uom PU, \
          hims_d_services SR where IM.category_id = IC.hims_d_inventory_tem_category_id and \
          IM.group_id = IG.hims_d_inventory_item_group_id and IM.sales_uom_id=PU.hims_d_inventory_uom_id and \
          IM.service_id= SR.hims_d_services_id  and item_type = 'OITM' and IM.item_status='A' and \
          IM.record_status='A' and IC.record_status='A' and IG.record_status='A' ",
        orderBy: "IM.hims_d_inventory_item_master_id desc"
      },
      {
        searchName: "tranitemmaster",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS IM.hims_d_inventory_item_master_id, IM.item_description, IM.category_id, IM.sales_uom_id, IM.service_id, IM.group_id, IC.category_desc, IG.group_description, PU.uom_description,\
          SR.standard_fee,IL.sale_price,IL.avgcost from hims_d_inventory_item_master IM, hims_d_inventory_tem_category IC,\
          hims_d_inventory_item_group IG, hims_d_inventory_uom PU, hims_d_services SR, \
          hims_m_inventory_item_location IL where IL.item_id = IM.hims_d_inventory_item_master_id and \
          IM.category_id = IC.hims_d_inventory_tem_category_id and IM.group_id = IG.hims_d_inventory_item_group_id\
          and IM.sales_uom_id=PU.hims_d_inventory_uom_id and IM.service_id= SR.hims_d_services_id and\
          IM.item_status='A' and IM.record_status='A' and \
          IC.record_status='A' and IG.record_status='A' and IL.inventory_location_id=? ",
        orderBy: "IM.hims_d_inventory_item_master_id desc",
        groupBy: " GROUP By hims_d_inventory_item_master_id",
        inputSequence: ["inventory_location_id"]
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
          and IL.item_id = IM.hims_d_inventory_item_master_id and IL.qtyhand > 0",
        orderBy: "IM.hims_d_inventory_item_master_id desc"
      },
      {
        searchName: "servicepackagemas",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS * from hims_d_services S, hims_d_service_type ST where \
          S.service_type_id = ST.hims_d_service_type_id and service_type_id in (1,2,4,5,11,12)",
        orderBy: "hims_d_services_id desc"
      },
      {
        searchName: "insservicemaster",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS service_name,service_type_id,hims_d_services_id,'N' as covered,'N' as pre_approval, IT.service_type\
            from hims_d_services as S,hims_d_service_type as IT where hims_d_services_id not in\
            (SELECT services_id FROM hims_d_services_insurance as I,hims_d_service_type as T where  \
            insurance_id=? and {mapper} and I.service_type_id = T.hims_d_service_type_id and \
            I.service_type_id in (2,5,11)) and {mapper} and S.service_type_id = IT.hims_d_service_type_id \
            and S.service_type_id in (2,5,11) \
            union all\
            SELECT service_name,service_type_id,services_id as hims_d_services_id, covered,pre_approval, \
            T.service_type\
            FROM hims_d_services_insurance as I,hims_d_service_type as T where  insurance_id=? and {mapper}  and I.service_type_id = T.hims_d_service_type_id and I.service_type_id in (2,5,11)",
        orderBy: "hims_d_services_id desc",
        inputSequence: ["insurance_id", "insurance_id"]
      },
      {
        searchName: "inspackagemaster",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS service_name,service_type_id,hims_d_services_id,'N' as covered,\
            'N' as pre_approval, IT.service_type, PH.package_visit_type,PH.package_type,PH.hims_d_package_header_id,\
            CASE WHEN PH.package_visit_type='S' THEN 'Single Visit' else 'Multi Visit' END as p_visit_type,\
            CASE WHEN PH.package_type='S' THEN 'Static' else 'Dynamic' END as p_type,\
            PH.expiry_days,PH.validated_date,PH.total_service_amount,PH.package_code \
            from hims_d_services as S,hims_d_service_type as IT, hims_d_package_header as PH \
            where hims_d_services_id not in\
            (SELECT services_id FROM hims_d_services_insurance as I,hims_d_service_type as T where  \
            insurance_id=? and {mapper} and I.service_type_id = T.hims_d_service_type_id and \
            I.service_type_id in (14)) and {mapper} and S.service_type_id = IT.hims_d_service_type_id \
            and PH.package_service_id = S.hims_d_services_id and PH.package_status = 'A' and PH.approved='Y' \
            and (PH.validated_date >= CURDATE() OR PH.validated_date is null) and S.service_type_id in (14) \
            union all\
            SELECT service_name,service_type_id,services_id as hims_d_services_id, covered,pre_approval, \
            T.service_type, PH.package_visit_type,PH.package_type,PH.hims_d_package_header_id,\
            CASE WHEN PH.package_visit_type='S' THEN 'Single Visit' else 'Multi Visit' END as p_visit_type,\
            CASE WHEN PH.package_type='S' THEN 'Static' else 'Dynamic' END as p_type,\
            PH.expiry_days,PH.validated_date,PH.total_service_amount,PH.package_code \
            FROM hims_d_services_insurance as I,hims_d_service_type as T, hims_d_package_header as PH where  insurance_id=? and {mapper}  and I.service_type_id = T.hims_d_service_type_id \
            and PH.package_service_id = I.services_id and PH.package_status = 'A' and PH.approved='Y'\
            and (PH.validated_date >= CURDATE() OR PH.validated_date is null) and I.service_type_id in (14)",
        orderBy: "hims_d_services_id desc",
        inputSequence: ["insurance_id", "insurance_id"]
      },
      {
        searchName: "insitemmaster",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS hims_d_inventory_item_master_id, item_description, \
            service_id as services_id,'N' as covered,'N' as pre_approval,IL.batchno,\
            IL.expirydt,IL.barcode,IL.qtyhand,IL.sales_uom,category_id,group_id,IL.grnno,IL.sale_price,\
            IL.inventory_location_id from hims_d_inventory_item_master I, hims_m_inventory_item_location IL \
            where service_id not in (SELECT services_id FROM hims_d_services_insurance where insurance_id=? \
            and {mapper}) and I.hims_d_inventory_item_master_id = IL.item_id and IL.inventory_location_id=? \
            and IL.qtyhand > 0 and {mapper} \
            union \
            SELECT IM.hims_d_inventory_item_master_id,service_name as item_description, services_id, covered,\
            pre_approval, ITL.batchno, ITL.expirydt,ITL.barcode, ITL.qtyhand,ITL.sales_uom, category_id, \
            group_id, ITL.grnno, ITL.sale_price,ITL.inventory_location_id FROM hims_d_services_insurance INS,  hims_d_inventory_item_master IM, hims_m_inventory_item_location ITL where \
            INS.services_id = IM.service_id and IM.hims_d_inventory_item_master_id = ITL.item_id and \
            insurance_id=? and ITL.inventory_location_id=?  and ITL.qtyhand > 0 and {mapper} and service_type_id=4",
        orderBy: "services_id desc",
        inputSequence: [
          "insurance_id",
          "inventory_location_id",
          "insurance_id",
          "inventory_location_id"
        ]
      },
      {
        searchName: "pharmacyUsers",
        searchQuery:
          " select algaeh_d_app_user_id,employee_id,E.full_name,E.employee_code,SD.sub_department_name\
          from algaeh_d_app_user U  inner join hims_d_employee E on U.employee_id=E.hims_d_employee_id\
          inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
          where E.record_status='A' and E.hospital_id=? and SD.department_type='PH'\
          and U.user_type in ('C','O')",
        orderBy: "algaeh_d_app_user_id desc",
        inputSequence: ["hospital_id"]
      },
      {
        searchName: "ItemGenericNames",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS hims_d_item_generic_id,generic_name,item_generic_status from hims_d_item_generic where record_status='A'",
        orderBy: "hims_d_item_generic_id desc"
      },
      {
        searchName: "ItemMasterOrderMedication",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS item_code,item_description,generic_id,category_id,group_id,form_id,sfda_code,S.storage_description,\
          item_uom_id,sales_price , \
	        IM.service_id, \
	        IM.sales_uom_id,IM.hims_d_item_master_id , G.generic_name ,concat(G.generic_name,' => ',item_description) as generic_name_item_description \
          from hims_d_item_master as IM  inner join hims_d_item_generic as G  \
          on G.hims_d_item_generic_id = IM.generic_id left join \
          hims_d_item_storage as S on IM.storage_id = S.hims_d_item_storage_id where IM.item_status ='A'",
        orderBy: "hims_d_item_master_id desc"
      },
      {
        searchName: "DepartmentAndDoctors",
        searchQuery:
          "select  SQL_CALC_FOUND_ROWS E.hims_d_employee_id, concat(T.title,'. ',E.full_name) as doctor_name,SD.sub_department_name,\
            E.sex,SD.hims_d_sub_department_id,case H.hosital_status when 'A' then 'Active' else 'Inactive' end as hosital_status,\
            H.hospital_name,concat(T.title,'. ',E.full_name,' => ',SD.sub_department_name) as doctor_department \
            from hims_d_employee E inner join hims_d_hospital as H \
            on H.hims_d_hospital_id = E.hospital_id inner join hims_d_sub_department SD \
            on E.sub_department_id=SD.hims_d_sub_department_id  and  E.isdoctor='Y' \
            inner join hims_d_department D on SD.department_id=D.hims_d_department_id  and  D.department_type='CLINICAL'\
            left join hims_d_title as T on T.his_d_title_id = E.title_id \
            where E.employee_status='A'  and SD.sub_department_status='A'\
            and SD.record_status='A' and E.record_status ='A' ",
        groupBy: "group by E.hims_d_employee_id"
      },

      {
        searchName: "procedureExistingItem",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS IM.hims_d_inventory_item_master_id,IM.item_description,IM.category_id, IM.sales_uom_id, IM.service_id, P.qty, IM.group_id,IC.category_desc,IG.group_description, \
          PU.uom_description, IL.inventory_location_id, IL.batchno, IL.expirydt, IL.barcode, IL.qtyhand, \
          IL.avgcost,IL.sales_uom,IL.grnno  from hims_d_procedure_detail P, hims_d_inventory_item_master IM, \
          hims_d_inventory_tem_category IC, hims_d_inventory_item_group IG, hims_d_inventory_uom PU, \
          hims_m_inventory_item_location IL where P.item_id = IM.hims_d_inventory_item_master_id and \
          IM.category_id = IC.hims_d_inventory_tem_category_id \
          and IM.group_id = IG.hims_d_inventory_item_group_id and IM.sales_uom_id=PU.hims_d_inventory_uom_id \
          and IL.item_id = IM.hims_d_inventory_item_master_id and IL.qtyhand > 0",
        orderBy: "IM.hims_d_inventory_item_master_id desc"
      },
      {
        searchName: "leave_auth",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS E.hims_d_employee_id,E.employee_code,E.full_name,SD.sub_department_name,D.department_name,\
          R.loan_authorize_privilege,R.leave_authorize_privilege from algaeh_m_role_user_mappings RUM \
          left join algaeh_d_app_user U on RUM.user_id=U.algaeh_d_app_user_id\
          left join algaeh_d_app_roles R on RUM.role_id=R.app_d_app_roles_id\
          left join hims_d_employee E on U.employee_id=E.hims_d_employee_id\
          left join hims_d_sub_department SD on  E.sub_department_id=SD.hims_d_sub_department_id\
          left join hims_d_department D on SD.department_id=D.hims_d_department_id\
          where E.record_status='A'  and leave_authorize_privilege=?",
        orderBy: " hims_d_employee_id ",
        inputSequence: ["leave_authorize_privilege"]
      },
      {
        searchName: "loan_auth",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS E.hims_d_employee_id,E.employee_code,E.full_name,SD.sub_department_name,D.department_name,\
          R.loan_authorize_privilege,R.leave_authorize_privilege from algaeh_m_role_user_mappings RUM \
          left join algaeh_d_app_user U on RUM.user_id=U.algaeh_d_app_user_id\
          left join algaeh_d_app_roles R on RUM.role_id=R.app_d_app_roles_id\
          left join hims_d_employee E on U.employee_id=E.hims_d_employee_id\
          left join hims_d_sub_department SD on  E.sub_department_id=SD.hims_d_sub_department_id\
          left join hims_d_department D on SD.department_id=D.hims_d_department_id\
          where E.record_status='A'  and loan_authorize_privilege=?",
        orderBy: " hims_d_employee_id ",
        inputSequence: ["loan_authorize_privilege"]
      },
<<<<<<< HEAD
      {
        searchName: "admin_employee_search",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS  hims_d_employee_id,employee_code,full_name,date_of_joining \
          from hims_d_employee E left join  algaeh_d_app_user U  on E.hims_d_employee_id=U.employee_id\
          where E.record_status='A' and U.employee_id is null and hospital_id=?",
        orderBy: "hims_d_employee_id desc",
        inputSequence: ["hospital_id"]
=======

      {
        searchName: "employee_project",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS E.*, SD.sub_department_name,D.hims_d_department_id,\
          D.department_name, DS.designation from  hims_d_employee E \
          left join   hims_d_sub_department SD on E.sub_department_id = SD.hims_d_sub_department_id\
          left join hims_d_department D on SD.department_id = D.hims_d_department_id\
          left join hims_d_designation DS  on  E.employee_designation_id = DS.hims_d_designation_id \
          WHERE E.record_status = 'A' ",
        orderBy: "hims_d_employee_id desc"
>>>>>>> 6707cde0dd70ff51c68682b173870aaa6483686a
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
