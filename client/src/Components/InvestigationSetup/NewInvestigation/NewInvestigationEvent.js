import { algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert";

const texthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const Validations = $this => {
  let isError = false;

  if ($this.state.description === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Test Name Cannot be blank."
    });
    document.querySelector("[name='description']").focus();
    return isError;
  }

  if ($this.state.services_id === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Service Cannot be blank."
    });
    return isError;
  }
};
const InsertLabTest = $this => {
  const err = Validations($this);
  debugger;
  if (!err) {
    if ($this.state.hims_d_investigation_test_id === null) {
      algaehApiCall({
        uri: "/investigation/addInvestigationTest",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success === true) {
            swal("Saved successfully . .", {
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
    } else {
      algaehApiCall({
        uri: "/investigation/updateInvestigationTest",
        data: $this.state,
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
    }
  }
};
export { texthandle, InsertLabTest };
