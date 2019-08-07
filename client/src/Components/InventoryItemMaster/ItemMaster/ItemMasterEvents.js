import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { SetBulkState } from "../../../utils/GlobalFunctions";
import InventoryItem from "../../../Models/InventoryItem";
import {
  AlgaehValidation,
  AlgaehOpenContainer
} from "../../../utils/GlobalFunctions";
import _ from "lodash";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

const Validations = $this => {
  let isError = false;

  if ($this.state.detail_item_uom.length === 0) {
    isError = true;
    swalMessage({
      type: "warning",
      title: "Please enter Stocking UOM in the list."
    });

    if ($this.state.uom_id === null) {
      document.querySelector("[name='uom_id']").focus();
    } else if ($this.state.stocking_uom === null) {
      document.querySelector("[name='stocking_uom']").focus();
    } else if (
      $this.state.conversion_factor === 0 ||
      $this.state.conversion_factor === null
    ) {
      document.querySelector("[name='conversion_factor']").focus();
    }
  } else {
    AlgaehValidation({
      querySelector: "data-validate='InvItemMaster'", //if require section level
      fetchFromFile: true, //if required arabic error
      alertTypeIcon: "warning", // error icon
      onSuccess: () => {
        const item_code_exit = _.filter(
          $this.props.inventoryitemlist,
          f => f.item_code === $this.state.item_code
        );

        if (
          $this.state.hims_d_inventory_item_master_id === null &&
          item_code_exit.length > 0
        ) {
          isError = true;
          swalMessage({
            type: "warning",
            title: "Item Code Already Exist."
          });
        } else if (
          $this.state.standard_fee === null ||
          $this.state.standard_fee === "" ||
          parseFloat($this.state.standard_fee) === 0
        ) {
          isError = true;
          swalMessage({
            type: "warning",
            title: "Please Enter the Sales Price."
          });
          document.querySelector("[name='standard_fee']").focus();
        } else if (
          $this.state.purchase_cost === null ||
          $this.state.purchase_cost === "" ||
          parseFloat($this.state.purchase_cost) === 0
        ) {
          isError = true;
          swalMessage({
            type: "warning",
            title: "Please Enter Purchase Cost."
          });
          document.querySelector("[name='purchase_cost']").focus();
        } else if (
          $this.state.vat_applicable === "Y" &&
          ($this.state.vat_percent === null ||
            $this.state.vat_percent === "" ||
            parseFloat($this.state.vat_percent) === 0)
        ) {
          isError = true;
          swalMessage({
            type: "warning",
            title: "Enter the Vat Percentage."
          });
          document.querySelector("[name='vat_percent']").focus();
        } else if (
          $this.state.reorder_qty === null ||
          $this.state.reorder_qty === "" ||
          parseFloat($this.state.reorder_qty) === 0
        ) {
          isError = true;
          swalMessage({
            type: "warning",
            title: "Enter Reorder Quantity."
          });
          document.querySelector("[name='reorder_qty']").focus();
        }
      },
      onCatch: () => {
        isError = true;
      }
    });
  }
  return isError;
};

const InsertUpdateItems = $this => {
  SetBulkState({
    state: $this,
    callback: () => {
      const err = Validations($this);

      if (!err) {
        AlgaehLoader({ show: true });
        if ($this.state.hims_d_inventory_item_master_id === null) {
          $this.state.service_code = $this.state.item_code;
          $this.state.service_type_id = "4";
          $this.state.service_name = $this.state.item_description;
          $this.state.hospital_id = JSON.parse(
            AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
          ).hims_d_hospital_id;

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
              AlgaehLoader({ show: false });
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
              AlgaehLoader({ show: false });
            }
          });
        }
      }
    }
  });
};

export { InsertUpdateItems };
