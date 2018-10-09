import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { getCookie } from "../../../utils/algaehApiCall.js";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const SubmitRequestUpdate = ($this, e) => {
  if ($this.state.submission_type !== null) {
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
          swalMessage({
            title: "Record updated successfully . .",
            type: "success"
          });
          $this.props.onClose && $this.props.onClose(e);
        }
      }
    });
  } else {
    swalMessage({
      title: "Invalid Input. Please select Submission Type.",
      type: "error"
    });
  }
};

export { texthandle, SubmitRequestUpdate };
