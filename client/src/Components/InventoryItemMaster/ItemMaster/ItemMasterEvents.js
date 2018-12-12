import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { SetBulkState } from "../../../utils/GlobalFunctions";

const Validations = $this => {
  let isError = false;

  if ($this.state.item_description === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Invalid Input. Test Name Cannot be blank."
    });
    return isError;
  } else if ($this.state.category_id === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Invalid Input. Please Select Category."
    });
    return isError;
  } else if ($this.state.group_id === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Invalid Input. Please Select Group."
    });
    return isError;
  } else if ($this.state.stocking_uom_id === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Invalid Input. Please Select Stocking UOM."
    });
    return isError;
  } else if ($this.state.purchase_uom_id === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Invalid Input. Select Purchase UOM."
    });
    return isError;
  } else if ($this.state.sales_uom_id === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Invalid Input. Select Sales UOM."
    });
    return isError;
  } else if (
    $this.state.hims_d_inventory_item_master_id === null &&
    $this.state.standard_fee === 0
  ) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Invalid Input. Enter the Price."
    });
    return isError;
  }
};

const InsertUpdateItems = $this => {
  SetBulkState({
    state: $this,
    callback: () => {
      const err = Validations($this);

      if (!err) {
        if ($this.state.hims_d_inventory_item_master_id === null) {
          $this.state.service_code = $this.state.item_code;
          $this.state.service_type_id = "4";
          $this.state.service_name = $this.state.item_description;

          algaehApiCall({
            uri: "/inventory/addItemMaster",
            data: $this.state,
            onSuccess: response => {
              if (response.data.success === true) {
                swalMessage({
                  type: "success",
                  title: "Saved successfully . ."
                });
                $this.props.onClose && $this.props.onClose(true);
              }
            }
          });
        } else {
          $this.state.record_status = "A";
          algaehApiCall({
            uri: "/inventory/updateItemMasterAndUom",
            data: $this.state,
            method: "PUT",
            onSuccess: response => {
              if (response.data.success === true) {
                swalMessage({
                  type: "success",
                  title: "Updated successfully . ."
                });
                $this.props.onClose && $this.props.onClose(true);
              }
            }
          });
        }
      }
    }
  });
};

export { InsertUpdateItems };
