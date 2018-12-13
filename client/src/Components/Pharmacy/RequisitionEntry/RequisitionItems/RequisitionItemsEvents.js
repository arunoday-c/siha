import moment from "moment";
import { swalMessage } from "../../../../utils/algaehApiCall.js";

const UomchangeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let unit_cost = e.selected.conversion_factor * $this.state.unit_cost;
  $this.setState({
    [name]: value,
    conversion_factor: e.selected.conversion_factor,
    unit_cost: unit_cost
  });
};

const numberchangeTexts = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if (value < 0) {
    swalMessage({
      title: "Invalid Input. cannot be less than zero.",
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
  if ($this.state.requistion_type === "PR") {
    if ($this.state.from_location_id !== null) {
      let value = e.value || e.target.value;

      $this.props.getSelectedItemDetais({
        uri: "/pharmacyGlobal/getUomLocationStock",
        method: "GET",
        data: {
          location_id: $this.state.from_location_id,
          item_id: value
        },
        redux: {
          type: "ITEMS_UOM_DETAILS_GET_DATA",
          mappingName: "itemdetaillist"
        },
        afterSuccess: data => {
          getItemLocationStock($this, context, {
            location_id: $this.state.from_location_id,
            item_id: value,
            set: "From"
          });
          $this.setState({
            [name]: value,
            item_category_id: e.selected.category_id,
            item_uom: e.selected.sales_uom_id,

            item_group_id: e.selected.group_id,
            quantity: 1,
            addItemButton: false,

            ItemUOM: data.uomResult
          });

          if (context !== undefined) {
            context.updateState({
              [name]: value,
              item_category_id: e.selected.category_id,
              item_uom: e.selected.sales_uom_id,

              item_group_id: e.selected.group_id,
              quantity: 1,
              addItemButton: false,

              ItemUOM: data.uomResult
            });
          }
        }
      });
    }
  } else {
    if ($this.state.to_location_id !== null) {
      let value = e.value || e.target.value;

      $this.props.getSelectedItemDetais({
        uri: "/pharmacyGlobal/getUomLocationStock",
        method: "GET",
        data: {
          location_id: $this.state.to_location_id,
          item_id: value
        },
        redux: {
          type: "ITEMS_UOM_DETAILS_GET_DATA",
          mappingName: "itemdetaillist"
        },
        afterSuccess: data => {
          if (data.locationResult.length > 0) {
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
              item_category_id: e.selected.category_id,
              item_uom: e.selected.sales_uom_id,

              item_group_id: e.selected.group_id,
              quantity: 1,
              addItemButton: false,

              ItemUOM: data.uomResult
            });

            if (context !== undefined) {
              context.updateState({
                [name]: value,
                item_category_id: e.selected.category_id,
                item_uom: e.selected.sales_uom_id,

                item_group_id: e.selected.group_id,
                quantity: 1,
                addItemButton: false,

                ItemUOM: data.uomResult
              });
            }
          } else {
            swalMessage({
              title: "Invalid Input. No Stock Avaiable for selected Item.",
              type: "warning"
            });
          }
        }
      });
    } else {
      $this.setState(
        {
          [name]: null
        },
        () => {
          swalMessage({
            title: "Invalid Input. Please select Location.",
            type: "warning"
          });
        }
      );
    }
  }
};

const AddItems = ($this, context) => {
  if ($this.state.item_id === null) {
    swalMessage({
      title: "Invalid Input. Select Item.",
      type: "warning"
    });
  } else if ($this.state.quantity_required === 0) {
    swalMessage({
      title: "Invalid Input. Please enter Quantity Required .",
      type: "warning"
    });
  } else {
    let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;

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
      quantity_outstanding: 0
    };
    pharmacy_stock_detail.push(ItemInput);
    $this.setState({
      pharmacy_stock_detail: pharmacy_stock_detail,
      addedItem: true,
      item_category_id: null,
      item_group_id: null,
      item_id: null,
      quantity_required: 0,

      item_uom: null,
      from_qtyhand: 0,
      to_qtyhand: 0
    });

    if (context !== undefined) {
      context.updateState({
        pharmacy_stock_detail: pharmacy_stock_detail,
        addedItem: true,
        saveEnable: false,
        item_category_id: null,
        item_group_id: null,
        item_id: null,
        quantity_required: 0,
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
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;

  for (let i = 0; i < pharmacy_stock_detail.length; i++) {
    if (pharmacy_stock_detail[i].item_id === row.item_id) {
      pharmacy_stock_detail.splice(i, 1);
    }
  }
  $this.setState({ pharmacy_stock_detail: pharmacy_stock_detail });

  if (context !== undefined) {
    context.updateState({
      pharmacy_stock_detail: pharmacy_stock_detail
    });
  }
};

const updatePosDetail = ($this, context, row) => {
  let authBtnEnable = true;
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
  for (let k = 0; k < pharmacy_stock_detail.length; k++) {
    if (pharmacy_stock_detail[k].item_id === row.item_id) {
      pharmacy_stock_detail[k] = row;
    }
  }
  $this.setState({ pharmacy_stock_detail: pharmacy_stock_detail });
  //debugger;
  if ($this.state.hims_f_pharamcy_material_header_id !== null) {
    authBtnEnable = !$this.state.authBtnEnable;
  }

  if (context !== undefined) {
    context.updateState({
      authBtnEnable: authBtnEnable,
      pharmacy_stock_detail: pharmacy_stock_detail
    });
  }
};

const onchangegridcol = ($this, context, row, e) => {
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if (value > row.quantity_required) {
    swalMessage({
      title: "Invalid Input. Cannot be greater than Requested Quantity.",
      type: "warning"
    });
    row[name] = $this.state.quantity_transferred;
  } else {
    row[name] = value;
    row["quantity_outstanding"] = value;

    pharmacy_stock_detail[row.rowIdx] = row;
    // for (let x = 0; x < pharmacy_stock_detail.length; x++) {
    //   if (pharmacy_stock_detail[x].item_id === row.item_id) {
    //     pharmacy_stock_detail[x] = row;
    //   }
    // }
    $this.setState({ pharmacy_stock_detail: pharmacy_stock_detail });

    if (context !== undefined) {
      context.updateState({
        pharmacy_stock_detail: pharmacy_stock_detail
      });
    }
  }
};

const getItemLocationStock = ($this, context, value) => {
  $this.props.getItemLocationStock({
    uri: "/pharmacyGlobal/getItemLocationStock",
    method: "GET",
    data: {
      location_id: value.location_id,
      item_id: value.item_id
    },
    redux: {
      type: "ITEMS_BATCH_GET_DATA",
      mappingName: "itemBatch"
    },
    afterSuccess: data => {
      if (data.length !== 0) {
        let total_quantity = 0;
        for (let i = 0; i < data.length; i++) {
          let qtyhand = data[i].qtyhand;
          total_quantity = total_quantity + qtyhand;
        }
        if (value.set === "To") {
          $this.setState({
            to_qtyhand: total_quantity
          });

          if (context !== undefined) {
            context.updateState({
              to_qtyhand: total_quantity
            });
          }
        } else if (value.set === "From") {
          $this.setState({
            from_qtyhand: total_quantity
          });
          if (context !== undefined) {
            context.updateState({
              from_qtyhand: total_quantity
            });
          }
        }
      }
    }
  });
};

const EditGrid = ($this, context, cancelRow) => {
  //debugger;
  if ($this.state.hims_f_pharamcy_material_header_id !== null) {
    if (context !== null) {
      let _pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
      if (cancelRow !== undefined) {
        _pharmacy_stock_detail[cancelRow.rowIdx] = cancelRow;
      }
      context.updateState({
        authBtnEnable: !$this.state.authBtnEnable,
        pharmacy_stock_detail: _pharmacy_stock_detail
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
