import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const UpdatePreApproval = ($this, e) => {
  debugger;
  if ($this.props.openFrom === "S") {
    algaehApiCall({
      uri: "/orderAndPreApproval/updatePreApproval",
      data: $this.state.update_pre_approval_service,
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
  } else if ($this.props.openFrom === "M") {
    algaehApiCall({
      uri: "/orderAndPreApproval/updateMedicinePreApproval",
      data: $this.state.update_pre_approval_service,
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
  }
};

export { UpdatePreApproval };
