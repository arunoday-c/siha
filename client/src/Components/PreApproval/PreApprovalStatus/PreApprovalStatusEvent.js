import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const UpdatePreApproval = ($this, e) => {
  let inputObj = $this.state.services_details;
  for (let i = 0; i < inputObj.length; i++) {
    if (
      inputObj[i].apprv_status === "AP" ||
      inputObj[i].apprv_status === "RJ"
    ) {
      if (inputObj[i].approved_no === null || inputObj[i].approved_no === "") {
        swalMessage({
          title: "Please enter Authorized Number.",
          type: "warning"
        });
        return;
      }
    }
    if (
      parseFloat(inputObj[i].requested_quantity) <= 0 ||
      inputObj[i].requested_quantity === null
    ) {
      swalMessage({
        title: "Please enter the quantity properly.",
        type: "warning"
      });
      return;
    }
  }
  if ($this.props.openFrom === "S") {
    algaehApiCall({
      uri: "/orderAndPreApproval/updatePreApproval",
      data: inputObj,
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
      data: inputObj,
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

const texthandle = ($this, row, context, e) => {
  let services_details = $this.state.services_details;
  let _index = services_details.indexOf(row);

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  row[name] = value;
  services_details[_index] = row;
  $this.setState({
    services_details: services_details
  });
};

export { UpdatePreApproval, texthandle };
