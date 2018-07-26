import { getCookie } from "../utils/algaehApiCall.js";

export default {
  inputParam: function(param) {
    var output;

    output = {
      hims_d_insurance_provider_id: null,
      insurance_provider_code: null,
      insurance_provider_name: null,
      company_service_price_type: "G",
      insurance_type: null,
      package_claim: null,
      credit_period: null,
      insurance_limit: 0,
      payment_type: null,
      cpt_mandate: "N",
      preapp_valid_days: null,
      claim_submit_days: null,
      lab_result_check: "N",
      resubmit_all: "N",
      payer_id: null,
      effective_start_date: null,
      effective_end_date: null,
      selectedLang: "en",

      insurance_provider_id: 105,

      insurance_provider_saved: false,
      insurance_sub_saved: false,
      insurance_plan_saved: false,

      // insurance_sub_code: null,
      // insurance_sub_name: null,
      // insurance_provider_id: null,
      // transaction_number: null,
      // card_format: null,

      sub_insurance: [],
      network_plan: [],

      MandatoryMsg: null
    };
    return output;
  }
};
