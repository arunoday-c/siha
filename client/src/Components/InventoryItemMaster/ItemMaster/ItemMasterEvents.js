import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { SetBulkState } from "../../../utils/GlobalFunctions";
import InventoryItem from "../../../Models/InventoryItem";
// import { parse } from "querystring";

const Validations = $this => {
  let isError = false;

  debugger;

  if ($this.state.item_description === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Test Name Cannot be blank."
    });
    return isError;
  } else if ($this.state.category_id === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Please Select Category."
    });
    return isError;
  } else if ($this.state.group_id === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Please Select Group."
    });
    return isError;
  } else if ($this.state.stocking_uom_id === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Please Select Stocking UOM."
    });
    return isError;
  } else if ($this.state.purchase_uom_id === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Select Purchase UOM."
    });
    return isError;
  } else if ($this.state.sales_uom_id === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Select Sales UOM."
    });
    return isError;
  } else if (
    $this.state.hims_d_inventory_item_master_id === null &&
    parseFloat($this.state.standard_fee) === 0
  ) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Enter the Price."
    });
    return isError;
  } else if (
    $this.state.purchase_cost === null ||
    $this.state.purchase_cost === 0
  ) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Please Enter Purchase Cost."
    });
    return isError;
  } else if (
    $this.state.hims_d_inventory_item_master_id === null &&
    $this.state.vat_applicable === "Y" &&
    parseFloat($this.state.vat_percent) === 0
  ) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Enter the Vat Percentage."
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
          $this.state.standard_fee = parseFloat($this.state.standard_fee);

          algaehApiCall({
            uri: "/inventory/addItemMaster",
            module: "inventory",
            data: $this.state,
            onSuccess: response => {
              if (response.data.success === true) {
                let IOputs = InventoryItem.inputParam();
                $this.setState({ ...$this.state, ...IOputs }, () => {
                  $this.props.onClose && $this.props.onClose(true);
                });
                swalMessage({
                  type: "success",
                  title: "Saved successfully . ."
                });
              }
            }
          });
        } else {
          $this.state.record_status = "A";
          algaehApiCall({
            uri: "/inventory/updateItemMasterAndUom",
            module: "inventory",
            data: $this.state,
            method: "PUT",
            onSuccess: response => {
              if (response.data.success === true) {
                let IOputs = InventoryItem.inputParam();
                $this.setState({ ...$this.state, ...IOputs }, () => {
                  $this.props.onClose && $this.props.onClose(true);
                });

                swalMessage({
                  type: "success",
                  title: "Updated successfully . ."
                });
              }
            }
          });
        }
      }
    }
  });
};

export { InsertUpdateItems };
