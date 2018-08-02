import swal from "sweetalert";
import { algaehApiCall } from "../../../../utils/algaehApiCall";

const DeptselectedHandeler = ($this, context, e) => {
  $this.setState({
    [e.name]: e.value,
    department_id: e.selected.department_id
  });
  if (context != null) {
    context.updateState({
      [e.name]: e.value,
      department_id: e.selected.department_id
    });
  }
};

const selectedHandeler = ($this, context, e) => {
  $this.setState({
    [e.name]: e.value,
    visittypeselect: false
  });
  if (context != null) {
    context.updateState({
      [e.name]: e.value,
      consultation: e.selected.consultation
    });
  }
};

const unsuccessfulSignIn = (message, title) => {
  swal({
    title: title,
    text: message,
    icon: "error",
    button: false,
    timer: 2500
  });
};

const doctorselectedHandeler = ($this, context, e) => {
  if ($this.state.hims_d_patient_id != null) {
    algaehApiCall({
      uri: "/visit/checkVisitExists",
      data: $this.state,
      onSuccess: response => {
        if (response.data.success == true) {
          $this.setState(
            {
              [e.name]: e.value,
              visittypeselect: false,
              hims_d_services_id: e.selected.services_id,
              incharge_or_provider: e.value,
              provider_id: e.value
            },
            () => {
              generateBillDetails($this, context);
            }
          );
          if (context != null) {
            context.updateState({
              [e.name]: e.value,
              hims_d_services_id: e.selected.services_id,
              incharge_or_provider: e.value,
              provider_id: e.value
            });
          }
        } else {
          $this.setState(
            {
              [e.name]: null
            },
            () => {
              unsuccessfulSignIn(response.data.message, "Warning");
            }
          );
        }
      }
    });
  } else {
    $this.setState(
      {
        [e.name]: e.value,
        visittypeselect: false,
        hims_d_services_id: e.selected.services_id,
        incharge_or_provider: e.value,
        provider_id: e.value
      },
      () => {
        generateBillDetails($this, context);
      }
    );
    if (context != null) {
      context.updateState({
        [e.name]: e.value,
        hims_d_services_id: e.selected.services_id,
        incharge_or_provider: e.value,
        provider_id: e.value
      });
    }
  }
};

const generateBillDetails = ($this, context) => {
  debugger;
  let serviceInput = {
    insured: $this.state.insured,
    hims_d_services_id: $this.state.hims_d_services_id,
    primary_insurance_provider_id: $this.state.primary_insurance_provider_id,
    primary_network_office_id: $this.state.primary_network_office_id,
    primary_network_id: $this.state.primary_network_id,
    sec_insured: $this.state.sec_insured,
    secondary_insurance_provider_id:
      $this.state.secondary_insurance_provider_id,
    secondary_network_id: $this.state.secondary_network_id,
    secondary_network_office_id: $this.state.secondary_network_office_id
  };
  $this.props.generateBill({
    uri: "/billing/getBillDetails",
    method: "POST",
    data: serviceInput,
    redux: {
      type: "BILL_GEN_GET_DATA",
      mappingName: "xxx"
    },
    afterSuccess: data => {
      if (context != null) {
        context.updateState({ ...data });
      }

      $this.props.billingCalculations({
        uri: "/billing/billingCalculations",
        method: "POST",
        data: data,
        redux: {
          type: "BILL_HEADER_GEN_GET_DATA",
          mappingName: "genbill"
        }
      });
    }
  });
};

export {
  DeptselectedHandeler,
  selectedHandeler,
  doctorselectedHandeler,
  unsuccessfulSignIn
};
