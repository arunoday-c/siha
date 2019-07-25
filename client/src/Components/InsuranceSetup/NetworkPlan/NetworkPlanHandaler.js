import moment from "moment";
import { Validations } from "./NetworkPlanValidation";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

const texthandle = ($this, e) => {
  // e = e || ctrl;

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (name === "insurance_sub_id") {
    $this.setState({
      [name]: value,
      maxDate_end_date: e.selected.effective_end_date,
      effective_start_date: e.selected.effective_start_date,
      effective_end_date: e.selected.effective_end_date
    });
  } else {
    $this.setState({
      [name]: value
    });
  }
};

const numberhandle = ($this, ctrl, e) => {
  e = e || ctrl;

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (value < 0 || value > 100) {
    swalMessage({
      title: "Cannot be less than zero.",
      type: "warning"
    });
  } else {
    $this.setState({
      [name]: value
    });
  }
};

const prenumberhandle = ($this, ctrl, e) => {
  e = e || ctrl;

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (value < 0) {
    swalMessage({
      title: "Cannot be less than zero.",
      type: "warning"
    });
  } else {
    $this.setState({
      [name]: value
    });
  }
};

const saveNetworkPlan = ($this, context) => {
  const err = Validations($this);

  let newdata = [];
  if (!err) {
    AlgaehLoader({ show: true });
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

    // if ($this.state.buttonenable === true) {
    newdata.push(obj);

    algaehApiCall({
      uri: "/insurance/addPlanAndPolicy",
      module: "insurance",
      data: newdata,
      onSuccess: response => {
        if (response.data.success === true) {
          $this.props.getNetworkPlans({
            uri: "/insurance/getNetworkAndNetworkOfficRecords",
            module: "insurance",
            method: "GET",
            printInput: true,
            data: {
              insuranceProviderId: $this.state.insurance_provider_id
            },
            redux: {
              type: "NETWORK_PLAN_GET_DATA",
              mappingName: "networkandplans"
            },
            afterSuccess: data => {
              AlgaehLoader({ show: false });
              swalMessage({
                type: "success",
                title: "Added successfully . ."
              });
            }
          });

          $this.setState({
            insurance_plan_saved: true,
            network_plan: previous
          });
          if (context !== undefined) {
            context.updateState({
              network_plan: previous,
              insurance_provider_id: $this.state.insurance_provider_id,
              insurance_provider_name: $this.state.insurance_provider_name
            });
          }
          addNewNetwork($this);
        }
      }
    });
    // }
  }
};

const addNewNetwork = $this => {
  $this.setState(
    {
      hims_d_insurance_network_id: null,
      network_type: null,
      insurance_sub_id: null,

      effective_start_date: null,
      effective_end_date: null,

      hims_d_insurance_network_office_id: null,
      network_id: null,
      deductible: 0,
      copay_consultation: 0,
      max_value: 0,
      deductible_lab: 0,
      copay_percent: 0,
      lab_max: 0,
      deductible_rad: 0,
      copay_percent_rad: 0,
      rad_max: 0,
      deductible_trt: 0,
      copay_percent_trt: 0,
      trt_max: 0,
      deductible_dental: 0,
      copay_percent_dental: 0,
      dental_max: 0,
      deductible_medicine: 0,
      copay_medicine: 0,
      medicine_max: 0,

      price_from: null,
      employer: null,
      policy_number: null,
      preapp_limit: 0,
      hospital_id: null,
      saveupdate: false,
      btnupdate: true
    },
    () => {}
  );
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const UpdateNetworkPlan = ($this, context) => {
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
    if ($this.state.hims_d_insurance_network_id !== null) {
      algaehApiCall({
        uri: "/insurance/updateNetworkAndNetworkOffice",
        module: "insurance",
        data: updateobj,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success === true) {
            swalMessage({
              type: "success",
              title: "Updated successfully . ."
            });
          }
        }
      });
    }

    // addNewNetwork($this);
  }
};

const dateValidate = ($this, value, e) => {
  let inRange = false;
  if (e.target.name === "effective_start_date") {
    inRange = moment(value).isAfter(
      moment($this.state.effective_end_date).format("YYYY-MM-DD")
    );
    if (inRange) {
      swalMessage({
        title: "Active From cannot be grater than Valid Upto.",
        type: "warning"
      });
      e.target.focus();
      $this.setState({
        [e.target.name]: null
      });
    }
  } else if (e.target.name === "effective_end_date") {
    inRange = moment(value).isBefore(
      moment($this.state.effective_start_date).format("YYYY-MM-DD")
    );
    if (inRange) {
      swalMessage({
        title: "Valid Upto cannot be less than Active From.",
        type: "warning"
      });
      e.target.focus();
      $this.setState({
        [e.target.name]: null
      });
    }
  }
};
export {
  texthandle,
  saveNetworkPlan,
  datehandle,
  addNewNetwork,
  UpdateNetworkPlan,
  numberhandle,
  prenumberhandle,
  dateValidate
};
