import swal from "sweetalert";
import { algaehApiCall } from "../../../../utils/algaehApiCall";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import Enumerable from "linq";

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
  debugger;
  let employee_list = Enumerable.from($this.props.providers)
    .where(w => w.hims_d_employee_id == e.value)
    .toArray();
  let doctor_name = "";
  if (employee_list !== null && employee_list.length > 0) {
    doctor_name = employee_list[0].full_name;
  }
  if ($this.state.hims_d_patient_id != null) {
    algaehApiCall({
      uri: "/visit/checkVisitExists",
      data: $this.state,
      onSuccess: response => {
        if (response.data.success == true) {
          debugger;

          $this.setState(
            {
              [e.name]: e.value,
              visittypeselect: false,
              hims_d_services_id: e.selected.services_id,
              incharge_or_provider: e.value,
              provider_id: e.value,
              doctor_name: doctor_name
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
              provider_id: e.value,
              doctor_name: doctor_name
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
        provider_id: e.value,
        doctor_name: doctor_name
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
        provider_id: e.value,
        doctor_name: doctor_name
      });
    }
  }
};

const generateBillDetails = ($this, context) => {
  let serviceInput = [
    {
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
    }
  ];
  AlgaehLoader({ show: true });
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
        },
        afterSuccess: data => {
          AlgaehLoader({ show: false });
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
