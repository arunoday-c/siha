import { algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert";
import { getCookie } from "../../../utils/algaehApiCall.js";
import { successfulMessage } from "../../../utils/GlobalFunctions";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const SubmitRequestUpdate = ($this, e) => {
  if ($this.state.submission_type !== null) {
    // row.updated_by = getCookie("UserID");
    let InputOutput = $this.state.services_details;
    for (let i = 0; i < InputOutput.length; i++) {
      if (InputOutput[i].checkselect === 1) {
        InputOutput[i].updated_by = getCookie("UserID");
        InputOutput[i].submission_type = $this.state.submission_type;
      }
    }
    algaehApiCall({
      uri: "/orderAndPreApproval/updatePreApproval",
      data: InputOutput,
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swal("Updated successfully . .", {
            icon: "success",
            buttons: false,
            timer: 2000
          });
          $this.props.onClose && $this.props.onClose(e);
        }
      },
      onFailure: error => {}
    });
  } else {
    successfulMessage({
      message: "Invalid Input. Please select Submission Type.",
      title: "Error",
      icon: "error"
    });
  }
};

export { texthandle, SubmitRequestUpdate };
