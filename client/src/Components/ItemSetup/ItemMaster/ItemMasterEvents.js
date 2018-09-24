import { algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert";

const Validations = $this => {
  let isError = false;

  if ($this.state.item_description === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Test Name Cannot be blank."
    });
    return isError;
  } else if ($this.state.generic_id === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Please Select Generic."
    });
    return isError;
  } else if ($this.state.category_id === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Please Select Category."
    });
    return isError;
  } else if ($this.state.group_id === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Please Select Group."
    });
    return isError;
  }
  //   else if ($this.state.form_id === null) {
  //     isError = true;
  //     $this.setState({
  //       open: true,
  //       MandatoryMsg: "Invalid Input. Please Select Form."
  //     });
  //     return isError;
  //   } else if ($this.state.storage_id === null) {
  //     isError = true;
  //     $this.setState({
  //       open: true,
  //       MandatoryMsg: "Invalid Input. Please Select Storage."
  //     });
  //     return isError;
  //   }
  else if ($this.state.stocking_uom_id === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Please Select Stocking UOM."
    });
    return isError;
  } else if ($this.state.purchase_uom_id === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Select Purchase UOM."
    });
    return isError;
  } else if ($this.state.sales_uom_id === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Select Sales UOM."
    });
    return isError;
  }
};

const InsertUpdateItems = $this => {
  const err = Validations($this);
  debugger;
  if (!err) {
    debugger;
    if ($this.state.hims_d_item_master_id === null) {
      algaehApiCall({
        uri: "/pharmacy/addItemMaster",
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
      $this.state.record_status = "A";
      algaehApiCall({
        uri: "/pharmacy/updateItemMasterAndUom",
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

export { InsertUpdateItems };
