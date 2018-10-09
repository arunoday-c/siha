export default {
  inputParam: function(param) {
    var output;

    output = {
      hims_f_pharmacy_pos_header_id: null,
      pos_number: null,
      patient_id: null,
      patient_code: null,
      full_name: "",
      visit_id: null,
      ip_id: null,
      pos_date: null,
      recieve_amount: 0,
      year: null,
      period: null,
      location_id: null,
      location_type: null,
      sub_total: 0,
      discount_percentage: 0,
      discount_amount: 0,
      net_total: 0,
      patient_responsibility: 0,

      patient_tax: 0,
      patient_payable: 0,
      company_responsibility: 0,
      company_tax: 0,
      company_payable: 0,
      sec_company_responsibility: 0,
      sec_company_tax: 0,
      sec_company_payable: 0,
      sec_copay_amount: 0,
      net_tax: 0,
      gross_total: 0,
      sheet_discount_amount: 0,
      sheet_discount_percentage: 0,
      net_amount: 0,
      credit_amount: 0,
      receiveable_amount: 0,
      posDetail: [],
      //   selectedLang: "en",
      PrescriptionItemList: [],
      ItemUOM: []
    };
    return output;
  }
};
