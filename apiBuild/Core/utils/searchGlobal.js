"use strict";

var _nodeLinq = require("node-linq");

var algaehSearchConfig = function algaehSearchConfig(searchName) {
  var queries = {
    algaehSeach: [{
      searchName: "patients",
      searchQuery: "select SQL_CALC_FOUND_ROWS hims_d_patient_id, patient_code, registration_date, title_id,\
         first_name, middle_name, last_name, full_name, arabic_name, gender, religion_id, \
         date_of_birth, age, marital_status, address1, address2, contact_number, secondary_contact_number, \
         email, emergency_contact_name, emergency_contact_number, relationship_with_patient, visa_type_id, city_id, \
         state_id, country_id, nationality_id, postal_code, primary_identity_id, primary_id_no, secondary_identity_id, \
         secondary_id_no, photo_file, primary_id_file, secondary_id_file, advance_amount from hims_f_patient \
         where record_status ='A'",
      orderBy: "hims_d_patient_id desc"
    }, {
      searchName: "bills",
      searchQuery: "select SQL_CALC_FOUND_ROWS hims_f_billing_header_id, BH.patient_id, visit_id, bill_number,\
          incharge_or_provider, bill_date, BH.advance_amount, advance_adjust, discount_amount, sub_total_amount, total_tax, \
          net_total, billing_status, copay_amount, deductable_amount, sec_copay_amount, sec_deductable_amount, gross_total, \
          sheet_discount_amount, sheet_discount_percentage, net_amount, patient_res, company_res, sec_company_res, \
          patient_payable, company_payable, sec_company_payable, patient_tax, company_tax, sec_company_tax, net_tax, \
          credit_amount, receiveable_amount, BH.created_by, BH.created_date, BH.updated_by, BH.updated_date, BH.record_status, \
          cancel_remarks,cancel_by, bill_comments, PAT.patient_code, PATV.visit_code from hims_f_billing_header BH inner join hims_f_patient as PAT on  \
          BH.patient_id = PAT.hims_d_patient_id inner join hims_f_patient_visit as PATV on BH.visit_id = PATV.hims_f_patient_visit_id where BH.record_status ='A'",
      orderBy: "hims_f_billing_header_id desc"
    }, {
      searchName: "insurance",
      searchQuery: "select SQL_CALC_FOUND_ROWS Ins.hims_d_insurance_provider_id,Ins.insurance_provider_name, Ins.effective_end_date,\
          sIns.hims_d_insurance_sub_id, sIns.insurance_sub_name,\
          net.hims_d_insurance_network_id,  net.network_type, net.effective_start_date as net_effective_start_date, net.effective_end_date as net_effective_end_date, \
          netoff.hims_d_insurance_network_office_id, netoff.policy_number from \
          (((hims_d_insurance_network_office netoff INNER JOIN  hims_d_insurance_network net \
          ON netoff.network_id=net.hims_d_insurance_network_id)INNER JOIN hims_d_insurance_sub sIns ON \
          net.insurance_sub_id=sIns.hims_d_insurance_sub_id)INNER JOIN hims_d_insurance_provider Ins ON \
          sIns.insurance_provider_id=Ins.hims_d_insurance_provider_id) where netoff.record_status='A' ",
      orderBy: "netoff.hims_d_insurance_network_office_id desc",
      groupBy: " GROUP By netoff.hims_d_insurance_network_office_id"
    }, {
      searchName: "visit",
      searchQuery: "SELECT full_name, patient_code, pv.visit_code, pv.visit_date, pv.patient_id, pv.hims_f_patient_visit_id, \
          pv.insured, pv.sec_insured,pv.episode_id FROM hims_f_patient,hims_f_patient_visit pv where  \
          pv.patient_id=hims_f_patient.hims_d_patient_id and pv.record_status='A'",
      orderBy: "pv.hims_f_patient_visit_id desc"
    }, {
      searchName: "DoctorCommission",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_doctor_comission_header",
      orderBy: "hims_f_doctor_comission_header_id desc"
    }, {
      searchName: "initialstock",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_pharmacy_stock_header\
          where record_status ='A'",
      orderBy: "hims_f_pharmacy_stock_header_id desc"
    }, {
      searchName: "POSEntry",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_pharmacy_pos_header\
          where record_status ='A'",
      orderBy: "hims_f_pharmacy_pos_header_id desc"
    }, {
      searchName: "POSNOReturn",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_pharmacy_pos_header\
          where record_status ='A' and posted='Y'",
      orderBy: "hims_f_pharmacy_pos_header_id desc"
    }, {
      searchName: "REQEntry",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_pharamcy_material_header",
      orderBy: "hims_f_pharamcy_material_header_id desc"
    }, {
      searchName: "REQTransEntry",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_pharamcy_material_header where authorize1 = 'Y' and authorie2 = 'Y'\
          and is_completed = 'N' and requistion_type='MR'",
      orderBy: "hims_f_pharamcy_material_header_id desc"
    }, {
      searchName: "SalesReturn",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_pharmcy_sales_return_header",
      orderBy: "hims_f_pharmcy_sales_return_header_id desc"
    }, {
      searchName: "TransferEntry",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_pharmacy_transfer_header",
      orderBy: "hims_f_pharmacy_transfer_header_id desc"
    }, {
      searchName: "IcdCodes",
      searchQuery: "select SQL_CALC_FOUND_ROWS hims_d_icd_id, icd_code, icd_description from hims_d_icd where record_status='A'",
      orderBy: "hims_d_icd_id desc"
    }, {
      searchName: "CptCodes",
      searchQuery: "select SQL_CALC_FOUND_ROWS hims_d_cpt_code_id, cpt_code, cpt_desc from hims_d_cpt_code where record_status='A'",
      orderBy: "hims_d_cpt_code_id desc"
    }, {
      searchName: "InvoiceGen",
      searchQuery: "select hims_f_invoice_header_id, invoice_number, invoice_date, pat.patient_code, pat.full_name,\
          pv.visit_code from hims_f_invoice_header , hims_f_patient pat,  hims_f_patient_visit pv where \
          hims_f_invoice_header.patient_id = pat.hims_d_patient_id and pv.hims_f_patient_visit_id = hims_f_invoice_header.visit_id \
          and pv.patient_id= pat.hims_d_patient_id",
      orderBy: "hims_f_invoice_header_id desc"
    }, {
      searchName: "invinitialstock",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_inventory_stock_header where record_status ='A'",
      orderBy: "hims_f_inventory_stock_header_id desc"
    }, {
      searchName: "InvREQEntry",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_inventory_material_header",
      orderBy: "hims_f_inventory_material_header_id desc"
    }, {
      searchName: "InvTransferEntry",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_inventory_transfer_header",
      orderBy: "hims_f_inventory_transfer_header_id desc"
    }, {
      searchName: "InvREQTransEntry",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_inventory_material_header where authorize1 = 'Y' and authorie2 = 'Y'\
          and is_completed = 'N' and requistion_type='MR'",
      orderBy: "hims_f_inventory_material_header_id desc"
    }, {
      searchName: "InvPOEntry",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_inventory_material_header where authorize1 = 'Y' and authorie2 = 'Y'\
          and is_completed = 'N' and requistion_type='PR'",
      orderBy: "hims_f_inventory_material_header_id desc"
    }, {
      searchName: "PhrPOEntry",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_pharamcy_material_header where authorize1 = 'Y' and authorie2 = 'Y'\
          and is_completed = 'N' and requistion_type='PR'",
      orderBy: "hims_f_pharamcy_material_header_id desc"
    }, {
      searchName: "POEntry",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_procurement_po_header",
      orderBy: "hims_f_procurement_po_header_id desc"
    }, {
      searchName: "POEntryGetDN",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_procurement_po_header where authorize1 = 'Y' and cancelled='N' and is_completed='N'",
      orderBy: "hims_f_procurement_po_header_id desc"
    }, {
      searchName: "DNEntry",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_procurement_dn_header",
      orderBy: "hims_f_procurement_dn_header_id desc"
    }, {
      searchName: "DNEntryInReceipt",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_procurement_dn_header where cancelled='N'  and is_completed='N'",
      orderBy: "hims_f_procurement_dn_header_id desc"
    }, {
      searchName: "ReceiptEntry",
      searchQuery: "select SQL_CALC_FOUND_ROWS * from hims_f_procurement_grn_header",
      orderBy: "hims_f_procurement_grn_header_id desc"
    }, {
      searchName: "billsforCanel",
      searchQuery: "select SQL_CALC_FOUND_ROWS hims_f_billing_header_id, bill_number, bill_date, PAT.patient_code, PATV.visit_code \
          from hims_f_billing_header BH inner join hims_f_patient as PAT on  \
          BH.patient_id = PAT.hims_d_patient_id inner join hims_f_patient_visit as PATV on BH.visit_id = PATV.hims_f_patient_visit_id\
          where BH.record_status ='A' and cancelled='N'",
      orderBy: "hims_f_billing_header_id desc"
    }, {
      searchName: "cancelbills",
      searchQuery: "select SQL_CALC_FOUND_ROWS hims_f_bill_cancel_header_id, bill_cancel_number, bill_cancel_date, \
          PAT.patient_code, PATV.visit_code,BILLING.bill_number, BILLING.bill_date \
           from hims_f_bill_cancel_header BH inner join hims_f_patient as PAT on  BH.patient_id = PAT.hims_d_patient_id \
           inner join hims_f_patient_visit as PATV on BH.visit_id = PATV.hims_f_patient_visit_id\
          inner join hims_f_billing_header as BILLING on BH.from_bill_id = BILLING.hims_f_billing_header_id \
          where BH.record_status ='A'",
      orderBy: "hims_f_bill_cancel_header_id desc"
    }, {
      searchName: "opCreidt",
      searchQuery: "select SQL_CALC_FOUND_ROWS hims_f_credit_header_id, credit_number, credit_date, \
          PAT.patient_code from hims_f_credit_header BH inner join hims_f_patient as PAT on  \
          BH.patient_id = PAT.hims_d_patient_id",
      orderBy: "hims_f_credit_header_id desc"
    }, {
      searchName: "POSCreidt",
      searchQuery: "select SQL_CALC_FOUND_ROWS hims_f_pos_credit_header_id, pos_credit_number, pos_credit_date, \
          PAT.patient_code from hims_f_pos_credit_header BH inner join hims_f_patient as PAT on  \
          BH.patient_id = PAT.hims_d_patient_id",
      orderBy: "hims_f_pos_credit_header_id desc"

      // visit
    }]
  };

  var row = new _nodeLinq.LINQ(queries.algaehSeach).Where(function (w) {
    return String(w.searchName).toUpperCase() === String(searchName).toUpperCase();
  }).FirstOrDefault();
  return row;
};

module.exports = {
  algaehSearchConfig: algaehSearchConfig
};
//# sourceMappingURL=searchGlobal.js.map