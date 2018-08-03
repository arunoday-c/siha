import moment from "moment";
import { Validations } from "./NetworkPlanValidation";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert";

const texthandle = ($this, ctrl, e) => {
  debugger;
  e = e || ctrl;

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const saveNetworkPlan = ($this, context) => {
  debugger;
  const err = Validations($this);
  let updatedata = [];
  if (!err) {
    let obj = {
      hims_d_insurance_network_id: null,
      network_type: $this.state.network_type,
      insurance_provider_id: $this.state.insurance_provider_id,
      insurance_sub_id: $this.state.insurance_sub_id,

      effective_start_date: $this.state.effective_start_date,
      effective_end_date: $this.state.effective_end_date,

      hims_d_insurance_network_office_id: null,
      network_id: null,
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
      preapp_limit: $this.state.preapp_limit,
      hospital_id: $this.state.hospital_id,
      invoice_max_deduct: $this.state.invoice_max_deduct,
      preapp_limit_from: $this.state.preapp_limit_from
    };
    let previous = $this.state.network_plan ? $this.state.network_plan : [];
    previous.push(obj);

    if (
      $this.state.buttonenable === true &&
      $this.state.hims_d_insurance_network_id === null
    ) {
      updatedata.push(obj);
    }

    $this.setState({
      insurance_plan_saved: true,
      network_plan: previous
    });
    if (context !== undefined) {
      context.updateState({
        network_plan: previous,
        update_network_plan_insurance: updatedata
      });
    }
    addNewNetwork($this);
  }
};

const addNewNetwork = $this => {
  $this.setState({
    hims_d_insurance_network_id: null,
    network_type: null,
    insurance_sub_id: null,

    effective_start_date: null,
    effective_end_date: null,

    hims_d_insurance_network_office_id: null,
    network_id: null,
    deductible: null,
    copay_consultation: null,
    max_value: null,
    deductible_lab: null,
    copay_percent: null,
    lab_max: null,
    deductible_rad: null,
    copay_percent_rad: null,
    rad_max: null,
    deductible_trt: null,
    copay_percent_trt: null,
    trt_max: null,
    deductible_dental: null,
    copay_percent_dental: null,
    dental_max: null,
    deductible_medicine: null,
    copay_medicine: null,
    medicine_max: null,

    price_from: null,
    employer: null,
    policy_number: null,
    preapp_limit: null,
    hospital_id: null
  });
};

const datehandle = ($this, ctrl, e) => {
  debugger;
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const UpdateNetworkPlan = ($this, context) => {
  debugger;
  const err = Validations($this);
  if (!err) {
    let updateobj = {
      hims_d_insurance_network_id: $this.state.hims_d_insurance_network_id,
      network_type: $this.state.network_type,
      insurance_provider_id: $this.state.insurance_provider_id,
      insurance_sub_id: $this.state.insurance_sub_id,

      effective_start_date: $this.state.effective_start_date,
      effective_end_date: $this.state.effective_end_date,

      hims_d_insurance_network_office_id:
        $this.state.hims_d_insurance_network_office_id,
      network_id: $this.state.hims_d_insurance_network_id,
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
      preapp_limit: $this.state.preapp_limit,
      hospital_id: $this.state.hospital_id,
      invoice_max_deduct: $this.state.invoice_max_deduct,
      preapp_limit_from: $this.state.preapp_limit_from
    };

    algaehApiCall({
      uri: "/insurance/updateNetworkAndNetworkOffice",
      data: updateobj,
      method: "PUT",
      onSuccess: response => {
        if (response.data.success === true) {
          swal("Updated successfully . .", {
            icon: "success",
            buttons: false,
            timer: 2000
          });
        }
      },
      onFailure: error => {
        console.log(error);
      }
    });
    addNewNetwork($this);
  }
};

export {
  texthandle,
  saveNetworkPlan,
  datehandle,
  addNewNetwork,
  UpdateNetworkPlan
};
