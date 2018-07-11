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
    context.updateState({ [e.name]: e.value });
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
              incharge_or_provider: e.value
            },
            () => {
              let serviceInput = {
                hims_d_services_id: $this.state.hims_d_services_id,
                patient_id: $this.state.hims_d_patient_id
              };
              $this.props.generateBill({
                uri: "/billing/getBillDetails",
                method: "POST",
                data: serviceInput,
                redux: {
                  type: "BILL_GEN_GET_DATA",
                  mappingName: "genbill"
                }
              });
            }
          );
          if (context != null) {
            context.updateState({
              [e.name]: e.value,
              hims_d_services_id: e.selected.services_id,
              incharge_or_provider: e.value
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
        incharge_or_provider: e.value
      },
      () => {
        let serviceInput = {
          hims_d_services_id: $this.state.hims_d_services_id,
          patient_id: $this.state.hims_d_patient_id
        };
        $this.props.generateBill({
          uri: "/billing/getBillDetails",
          method: "POST",
          data: serviceInput,
          redux: {
            type: "BILL_GEN_GET_DATA",
            mappingName: "genbill"
          }
        });
      }
    );
    if (context != null) {
      context.updateState({
        [e.name]: e.value,
        hims_d_services_id: e.selected.services_id,
        incharge_or_provider: e.value
      });
    }
  }
};

export {
  DeptselectedHandeler,
  selectedHandeler,
  doctorselectedHandeler,
  unsuccessfulSignIn
};
