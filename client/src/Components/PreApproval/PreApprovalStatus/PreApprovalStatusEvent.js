import { algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert";

const UpdatePreApproval = ($this, e) => {
  debugger;
  algaehApiCall({
    uri: "/orderAndPreApproval/updatePreApproval",
    data: $this.state.services_details,
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
};

export { UpdatePreApproval };
