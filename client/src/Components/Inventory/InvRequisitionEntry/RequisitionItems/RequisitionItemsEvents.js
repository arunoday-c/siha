import moment from "moment";
import { swalMessage } from "../../../../utils/algaehApiCall.js";
import _ from "lodash";

const UomchangeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let unit_cost = e.selected.conversion_factor * $this.state.unit_cost;
  $this.setState({
    [name]: value,
    conversion_factor: e.selected.conversion_factor,
    unit_cost: unit_cost,
    uom_description: e.selected.uom_description
  });
};

const numberchangeTexts = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value === "" ? 0 : e.target.value;
  if (value < 0) {
    swalMessage({
      title: "Cannot be less than zero.",
      type: "warning"
    });
  } else {
    $this.setState({ [name]: value });
    if (context !== undefined) {
      context.updateState({
        [name]: value
      });
    }
  }
};

const itemchangeText = ($this, context, e) => {
  let name = e.name || e.target.name;
  if (
    $this.state.from_location_id === null ||
    $this.state.to_location_id === null
  ) {
    swalMessage({
      title: "Please select From and To Location.",
      type: "warning"
    });
    return;
  }
  if ($this.state.requistion_type === "PR") {
    let value = e.value || e.target.value;

    $this.props.getSelectedItemDetais({
      uri: "/inventory/getItemMasterAndItemUom",
      module: "inventory",
      method: "GET",
      data: {
        // location_id: $this.state.to_location_id,
        hims_d_inventory_item_master_id: value
      },
      redux: {
        type: "ITEMS_UOM_DETAILS_GET_DATA",
        mappingName: "inventoryitemdetaillist"
      },
      afterSuccess: data => {
        if (data.length > 0) {
          getItemLocationStock($this, context, {
            location_id: $this.state.from_location_id,
            item_id: value,
            set: "From"
          });

          $this.setState({
            [name]: value,
            item_description: e.selected.item_description,
            item_code: e.selected.item_code,
            item_category_id: e.selected.category_id,
            item_uom: e.selected.sales_uom_id,

            item_group_id: e.selected.group_id,
            quantity: 1,
            barcode: e.selected.barcode,
            addItemButton: false,

            ItemUOM: data,
            uom_description: data[0].uom_description
          });

          if (context !== undefined) {
            context.updateState({
              [name]: value,
              item_description: e.selected.item_description,
              item_code: e.selected.item_code,
              item_category_id: e.selected.category_id,
              item_uom: e.selected.sales_uom_id,

              item_group_id: e.selected.group_id,
              barcode: e.selected.barcode,
              quantity: 1,
              addItemButton: false,

              ItemUOM: data
            });
          }
        } else {
          swalMessage({
            title: "No Stock Avaiable for selected Item.",
            type: "warning"
          });
        }
      }
    });
  } else {
    let value = e.value || e.target.value;

    $this.props.getSelectedItemDetais({
      uri: "/inventory/getItemMasterAndItemUom",
      module: "inventory",
      method: "GET",
      data: {
        // location_id: $this.state.to_location_id,
        hims_d_inventory_item_master_id: value
      },
      redux: {
        type: "ITEMS_UOM_DETAILS_GET_DATA",
        mappingName: "inventoryitemdetaillist"
      },
      afterSuccess: data => {
        if (data.length > 0) {
          getItemLocationStock($this, context, {
            location_id: $this.state.to_location_id,
            item_id: value,
            set: "To"
          });

          getItemLocationStock($this, context, {
            location_id: $this.state.from_location_id,
            item_id: value,
            set: "From"
          });

          $this.setState({
            [name]: value,
            item_description: e.selected.item_description,
            item_code: e.selected.item_code,
            item_category_id: e.selected.category_id,
            item_uom: e.selected.sales_uom_id,

            item_group_id: e.selected.group_id,
            quantity: 1,
            barcode: e.selected.barcode,
            addItemButton: false,

            ItemUOM: data,
            uom_description: data[0].uom_description
          });

          if (context !== undefined) {
            context.updateState({
              [name]: value,
              item_description: e.selected.item_description,
              item_code: e.selected.item_code,
              item_category_id: e.selected.category_id,
              item_uom: e.selected.sales_uom_id,

              item_group_id: e.selected.group_id,
              barcode: e.selected.barcode,
              quantity: 1,
              addItemButton: false,

              ItemUOM: data
            });
          }
        } else {
          swalMessage({
            title: "No Stock Avaiable for selected Item.",
            type: "warning"
          });
        }
      }
    });
  }
};

const AddItems = ($this, context) => {
  if (
    $this.state.from_location_id === null ||
    $this.state.to_location_id === null
  ) {
    swalMessage({
      title: "Please select From and To Location.",
      type: "warning"
    });
    return;
  }

  if ($this.state.item_id === null) {
    swalMessage({
      title: "Select Item.",
      type: "warning"
    });
  } else if ($this.state.quantity_required === 0) {
    swalMessage({
      title: "Please enter Quantity Required .",
      type: "warning"
    });
  } else {
    let inventory_stock_detail = $this.state.inventory_stock_detail;

    let ItemInput = {
      completed: "N",
      item_category_id: $this.state.item_category_id,
      item_group_id: $this.state.item_group_id,
      item_id: $this.state.item_id,
      quantity_required: $this.state.quantity_required,
      quantity_authorized: 0,
      item_uom: $this.state.item_uom,
      from_qtyhand: $this.state.from_qtyhand,
      to_qtyhand: $this.state.to_qtyhand,
      item_description: $this.state.item_description,
      item_code: $this.state.item_code,
      uom_description: $this.state.uom_description,
      barcode: $this.state.barcode,
      quantity_outstanding: 0
    };
    inventory_stock_detail.push(ItemInput);
    $this.setState({
      inventory_stock_detail: inventory_stock_detail,

      addItemButton: true,
      item_category_id: null,
      item_group_id: null,
      item_id: null,
      quantity_required: 0,
      barcode: null,
      item_uom: null,
      from_qtyhand: 0,
      to_qtyhand: 0
    });

    if (context !== undefined) {
      context.updateState({
        inventory_stock_detail: inventory_stock_detail,

        addItemButton: true,
        saveEnable: false,
        item_category_id: null,
        item_group_id: null,
        item_id: null,
        quantity_required: 0,
        barcode: null,
        item_uom: null,
        from_qtyhand: 0,
        to_qtyhand: 0
      });
    }
  }
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const deleteRequisitionDetail = ($this, context, row) => {
  let inventory_stock_detail = $this.state.inventory_stock_detail;

  for (let i = 0; i < inventory_stock_detail.length; i++) {
    if (inventory_stock_detail[i].item_id === row.item_id) {
      inventory_stock_detail.splice(i, 1);
    }
  }
  let saveEnable =
    $this.props.requisition_auth === true
      ? true
      : inventory_stock_detail.length > 0
      ? false
      : true;
  let authBtnEnable = inventory_stock_detail.length > 0 ? false : true;

  $this.setState({ inventory_stock_detail: inventory_stock_detail });

  if (context !== undefined) {
    context.updateState({
      inventory_stock_detail: inventory_stock_detail,
      saveEnable: saveEnable,
      authBtnEnable: authBtnEnable
    });
  }
};

const updatePosDetail = ($this, context, row) => {
  let inventory_stock_detail = $this.state.inventory_stock_detail;
  for (let k = 0; k < inventory_stock_detail.length; k++) {
    if (inventory_stock_detail[k].item_id === row.item_id) {
      inventory_stock_detail[k] = row;
    }
  }
  $this.setState({ inventory_stock_detail: inventory_stock_detail });

  if (context !== undefined) {
    context.updateState({
      inventory_stock_detail: inventory_stock_detail,
      authBtnEnable: !$this.state.authBtnEnable
    });
  }
};

const onchangegridcol = ($this, context, row, e) => {
  let inventory_stock_detail = $this.state.inventory_stock_detail;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if (value > parseFloat(row.quantity_required)) {
    swalMessage({
      title: "Cannot be greater than Requested Quantity.",
      type: "warning"
    });
    row[name] = $this.state.quantity_transferred;
  } else if (parseFloat(value) < 0) {
    swalMessage({
      title: "Cannot be less than Zero.",
      type: "warning"
    });
  } else {
    row[name] = value;
    row["quantity_outstanding"] = value === "" ? 0 : value;

    inventory_stock_detail[row.rowIdx] = row;
    $this.setState({ inventory_stock_detail: inventory_stock_detail });

    if (context !== undefined) {
      context.updateState({
        inventory_stock_detail: inventory_stock_detail
      });
    }
  }
};

const getItemLocationStock = ($this, context, value) => {
  $this.props.getItemLocationStock({
    uri: "/inventoryGlobal/getItemLocationStock",
    module: "inventory",
    method: "GET",
    data: {
      inventory_location_id: value.location_id,
      item_id: value.item_id
    },
    redux: {
      type: "ITEMS_BATCH_GET_DATA",
      mappingName: "inventoryitemBatch"
    },
    afterSuccess: data => {
      if (data.length !== 0) {
        let total_quantity = 0;
        for (let i = 0; i < data.length; i++) {
          let qtyhand = data[i].qtyhand;
          total_quantity = parseFloat(total_quantity) + parseFloat(qtyhand);
        }
        if (value.set === "To") {
          $this.setState({
            to_qtyhand: total_quantity
          });

          context.updateState({
            to_qtyhand: total_quantity
          });
        } else if (value.set === "From") {
          $this.setState({
            from_qtyhand: total_quantity
          });

          context.updateState({
            from_qtyhand: total_quantity
          });
        }
      } else {
        context.updateState({
          to_qtyhand: null,
          from_qtyhand: null
        });
      }
    }
  });
};

const EditGrid = ($this, context, cancelRow) => {
  if ($this.state.hims_f_inventory_material_header_id !== null) {
    if (context !== null) {
      let _inventory_stock_detail = $this.state.inventory_stock_detail;
      if (cancelRow !== undefined) {
        _inventory_stock_detail[cancelRow.rowIdx] = cancelRow;
      }
      context.updateState({
        authBtnEnable: !$this.state.authBtnEnable,
        inventory_stock_detail: _inventory_stock_detail
      });
    }
  }
};

export {
  UomchangeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle,
  deleteRequisitionDetail,
  updatePosDetail,
  onchangegridcol,
  EditGrid
};
