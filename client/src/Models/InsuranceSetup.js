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
      arabic_provider_name: null,

      insurance_provider_id: 108, //105,
      insurance_sub_id: 51,
      insurance_provider_saved: false,
      insurance_sub_saved: false,
      insurance_plan_saved: false,

      sub_insurance: [],
      network_plan: [],

      MandatoryMsg: null,
      snackeropen: false
    };
    return output;
  }
};
