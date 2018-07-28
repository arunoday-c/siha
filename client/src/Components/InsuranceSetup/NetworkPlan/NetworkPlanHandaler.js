import { algaehApiCall } from "../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name;
  let value;
  if (e.name != null) {
    name = e.name;
    value = e.value;
  } else {
    name = e.target.name;
    value = e.target.value;
  }

  $this.setState({
    [name]: value
  });
};

const saveNetworkPlan = $this => {
  let obj = {
    // hims_d_insurance_network_id: null,
    network_type: $this.state.network_type,
    insurance_provider_id: $this.state.insurance_provider_id,
    insurance_sub_id: $this.state.insurance_sub_id,

    effective_start_date: $this.state.effective_start_date,
    effective_end_date: $this.state.effective_end_date,

    // hims_d_insurance_network_office_id: null,
    // network_id: $this.state.,
    deductible: $this.state.deductible,
    copay_consultation: $this.state.copay_consultation,
    max_value: $this.state.max_value,
    deductible_lab: $this.state.deductible_lab,
    copay_percent: $this.state.copay_percent,
    lab_max: $this.state.lab_max,
    deductible_rad: $this.state.deductible_rad,
    copay_percent_rad: $this.state.copay_percent_rad,
    rad_max: $this.state.rad_max,
    deductible_trt: $this.state.deductible_trt,
    copay_percent_trt: $this.state.copay_percent_trt,
    trt_max: $this.state.trt_max,
    deductible_dental: $this.state.deductible_dental,
    copay_percent_dental: $this.state.copay_percent_dental,
    dental_max: $this.state.dental_max,
    deductible_medicine: $this.state.deductible_medicine,
    copay_medicine: $this.state.copay_medicine,
    medicine_max: $this.state.medicine_max,

    price_from: $this.state.price_from,
    employer: $this.state.employer,
    policy_number: $this.state.policy_number,
    preapp_limit: $this.state.preapp_limit
  };
  algaehApiCall({
    uri: "/insurance/addNetwork",
    data: $this.state,
    onSuccess: response => {
      if (response.data.success === true) {
        algaehApiCall({
          uri: "/insurance/NetworkOfficeMaster",
          data: $this.state,
          onSuccess: response => {
            if (response.data.success === true) {
              let previous = $this.state.sub_insurance
                ? $this.state.sub_insurance
                : [];
              previous.push = obj;
              $this.setState({
                insurance_plan_saved: true,
                network_plan: previous
              });
            }
          },
          onFailure: error => {
            console.log(error);
          }
        });
      }
    },
    onFailure: error => {
      console.log(error);
    }
  });
};

export { texthandle, saveNetworkPlan };
