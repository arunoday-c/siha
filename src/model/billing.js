import httpStatus from "../utils/httpStatus";
import extend from "extend";
let billingHeaderModel = {
  hims_f_billing_header_id: null,
  patient_id: null,
  billing_type_id: null,
  visit_id: null,
  bill_number: null,
  incharge_or_provider: null,
  bill_date: null,
  advance_amount: null,
  discount_amount: null,
  discount_percentage: null,
  total_amount: null,
  total_tax: null,
  total_payable: null,
  billing_status: null,
  sheet_discount_amount: null,
  sheet_discount_percentage: null,
  net_amount: null,
  patient_resp: null,
  company_res: null,
  sec_company_res: null,
  patient_payable: null,
  company_payable: null,
  sec_company_payable: null,
  patient_tax: null,
  company_tax: null,
  sec_company_tax: null,
  net_tax: null,
  credit_amount: null,
  receiveable_amount: null,
  created_by: null,
  created_date: null,
  updated_by: null,
  updated_date: null,
  copay_amount: null,
  deductable_amount: null,
  cancel_remarks: null,
  cancel_by: null
};
let billingDetailModel = {
  hims_f_billing_details_id: null,
  hims_f_billing_header_id: null,
  service_type_id: null,
  services_id: null,
  quantity: null,
  unit_cost: null,
  gross_amount: null,
  discount_amout: null,
  discount_percentage: null,
  net_amout: null,
  copay_percentage: null,
  copay_amount: null,
  deductable_amount: null,
  deductable_percentage: null,
  tax_inclusive: null,
  patient_tax: null,
  company_tax: null,
  total_tax: null,
  patient_resp: null,
  patient_payable: null,
  comapany_resp: null,
  company_payble: null,
  sec_company: null,
  sec_deductable_percentage: null,
  sec_deductable_amount: null,
  sec_company_res: null,
  sec_company_tax: null,
  sec_company_paybale: null,
  sec_copay_percntage: null,
  sec_copay_amount: null,
  created_by: null,
  created_date: null,
  updated_by: null,
  updated_date: null
};

let addBilling = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    let db = req.db;
    let inputParam = extend(billingHeaderModel, req.body);
    db.getConnection((error, connection) => {});
  } catch (e) {
    next(e);
  }
};
