import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import {
  SetBulkState,
  AlgaehOpenContainer
} from "../../../utils/GlobalFunctions";
import ItemSetup from "../../../Models/ItemSetup";

const Validations = $this => {
  let isError = false;
  debugger;

  if (!$this.state.item_code) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Item Code Cannot be blank."
    });
    return isError;
  } else if (!$this.state.item_description) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Item Name Cannot be blank."
    });
    return isError;
  } else if ($this.state.generic_id === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Please Select Generic."
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
      title: "Please Select Purchase UOM."
    });
    return isError;
  } else if ($this.state.sales_uom_id === null) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Please Select Sales UOM."
    });
    return isError;
  } else if (
    $this.state.standard_fee === null ||
    $this.state.standard_fee === "" ||
    parseFloat($this.state.standard_fee) === 0
  ) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Please Enter the Sales Price."
    });
    return isError;
  } else if (
    $this.state.purchase_cost === null ||
    $this.state.purchase_cost === "" ||
    parseFloat($this.state.purchase_cost) === 0
  ) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Please Enter Purchase Cost."
    });
    return isError;
  } else if (
    $this.state.vat_applicable === "Y" &&
    ($this.state.vat_percent === null ||
      $this.state.vat_percent === "" ||
      parseFloat($this.state.vat_percent) === 0)
  ) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Enter the Vat Percentage."
    });
    return isError;
  } else if (
    $this.state.reorder_qty === null ||
    $this.state.reorder_qty === "" ||
    parseFloat($this.state.reorder_qty) === 0
  ) {
    isError = true;
    swalMessage({
      type: "error",
      title: "Enter Reorder Quantity."
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
        if ($this.state.hims_d_item_master_id === null) {
          $this.state.service_code = $this.state.item_code;
          $this.state.service_type_id = "12";
          $this.state.service_name = $this.state.item_description;
          $this.state.service_status = "A";
          $this.state.standard_fee = parseFloat($this.state.standard_fee);
          $this.state.hospital_id = JSON.parse(
            AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
          ).hims_d_hospital_id;
          algaehApiCall({
            uri: "/pharmacy/addItemMaster",
            module: "pharmacy",
            data: $this.state,
            onSuccess: response => {
              if (response.data.success === true) {
                let IOputs = ItemSetup.inputParam();
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
            uri: "/pharmacy/updateItemMasterAndUom",
            module: "pharmacy",
            data: $this.state,
            method: "PUT",
            onSuccess: response => {
              if (response.data.success === true) {
                let IOputs = ItemSetup.inputParam();
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
