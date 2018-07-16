import { LINQ } from "node-linq";
let algaehSearchConfig = searchName => {
  let queries = {
    algaehSeach: [
      {
        searchName: "patients",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS hims_d_patient_id, patient_code, registration_date, title_id,\
         first_name, middle_name, last_name, full_name, arabic_name, gender, religion_id, \
         date_of_birth, age, marital_status, address1, address2, contact_number, secondary_contact_number, \
         email, emergency_contact_name, emergency_contact_number, relationship_with_patient, visa_type_id, city_id, \
         state_id, country_id, nationality_id, postal_code, primary_identity_id, primary_id_no, secondary_identity_id, \
         secondary_id_no, photo_file, primary_id_file, secondary_id_file, advance_amount from hims_f_patient \
         where record_status ='A'",
        orderBy: "hims_d_patient_id desc"
      },
      {
        searchName: "bills",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS hims_f_billing_header_id, patient_id, billing_type_id, visit_id, bill_number,\
          incharge_or_provider, bill_date, advance_amount, advance_adjust, discount_amount, sub_total_amount, total_tax, \
          net_total, billing_status, copay_amount, deductable_amount, sec_copay_amount, sec_deductable_amount, gross_total, \
          sheet_discount_amount, sheet_discount_percentage, net_amount, patient_res, company_res, sec_company_res, \
          patient_payable, company_payable, sec_company_payable, patient_tax, company_tax, sec_company_tax, net_tax, \
          credit_amount, receiveable_amount, created_by, created_date, updated_by, updated_date, record_status, cancel_remarks,\
           cancel_by, bill_comments from hims_f_billing_header \
         where record_status ='A'",
        orderBy: "hims_f_billing_header_id desc"
      },
      {
        searchName: "insurance",
        searchQuery:
          "select Ins.hims_d_insurance_provider_id,Ins.insurance_provider_name,sIns.hims_d_insurance_sub_id, \
          sIns.insurance_sub_name,net.hims_d_insurance_network_id,  net.network_type, netoff.hims_d_insurance_network_office_id, \
          netoff.policy_number from (((hims_d_insurance_network_office netoff INNER JOIN  hims_d_insurance_network net \
          ON netoff.network_id=net.hims_d_insurance_network_id)INNER JOIN hims_d_insurance_sub sIns ON \
          net.insurance_sub_id=sIns.hims_d_insurance_sub_id)INNER JOIN hims_d_insurance_provider Ins ON \
          sIns.insurance_provider_id=Ins.hims_d_insurance_provider_id) where netoff.record_status='A'",
        orderBy: "Ins.hims_d_insurance_provider_id desc"
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
