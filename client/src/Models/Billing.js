import moment from "moment";
import { getCookie } from "../utils/algaehApiCall.js";

export default {
  inputParam: function() {
    var output;
    var CurrentDate = new Date();
    output = {
      hims_f_billing_header_id: null,
      patient_id: null,
      billing_type_id: null,
      visit_id: null,
      hims_f_patient_visit_id: null,
      bill_number: null,
      incharge_or_provider: null,
      bill_date: CurrentDate,
      advance_amount: 0,
      discount_amount: 0,
      sub_total_amount: 0,
      total_tax: 0,
      net_total: 0,
      advance_adjust: 0,
      billing_status: null,
      copay_amount: 0,
      sec_copay_amount: 0,
      deductable_amount: 0,
      sec_deductable_amount: 0,
      gross_total: 0,
      sheet_discount_amount: 0,
      sheet_discount_percentage: 0,
      net_amount: 0,
      patient_res: 0,
      company_res: 0,
      sec_company_res: 0,
      patient_payable: 0,
      company_payble: 0,
      sec_company_payable: 0,
      patient_tax: 0,
      company_tax: 0,
      sec_company_tax: 0,
      net_tax: 0,
      credit_amount: 0,
      receiveable_amount: 0,
      created_by: getCookie("UserID"),
      created_date: CurrentDate,
      updated_by: null,
      updated_date: null,
      cancel_remarks: null,
      cancel_by: null,
      bill_comments: null,

      billdetails: [],
      hims_f_receipt_header_id: null,
      receipt_number: null,
      receipt_date: CurrentDate,
      billing_header_id: null,
      total_amount: 0,
      counter_id: null,
      shift_id: null,
      unbalanced_amount: 0,
      created_by: getCookie("UserID"),
      created_date: CurrentDate,
      updated_by: null,
      updated_date: null,
      receiptdetails: []
    };
    return output;
  }
};
