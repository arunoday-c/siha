import { successfulMessage } from "../../../../utils/GlobalFunctions";
import moment from "moment";
import Enumerable from "linq";
import extend from "extend";
import Options from "../../../../Options.json";

let texthandlerInterval = null;

const UomchangeTexts = ($this, ctrl, e) => {
  debugger;
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

const numberchangeTexts = ($this, e) => {
  debugger;

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });

  // clearInterval(texthandlerInterval);
  // texthandlerInterval = setInterval(() => {
  //   if (context !== undefined) {
  //     context.updateState({
  //       [name]: value
  //     });
  //   }
  //   clearInterval(texthandlerInterval);
  // }, 1000);
};

const itemchangeText = ($this, e) => {
  debugger;
  let name = e.name || e.target.name;
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
        debugger;
        if (data.locationResult.length > 0) {
          $this.setState({
            [name]: value,
            item_category_id: e.selected.category_id,
            item_uom: e.selected.sales_uom_id,

            item_group_id: e.selected.group_id,
            quantity: 1,
            addItemButton: false,

            ItemUOM: data.uomResult
          });
        } else {
          successfulMessage({
            message: "Invalid Input. No Stock Avaiable for selected Item.",
            title: "Warning",
            icon: "warning"
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
        successfulMessage({
          message: "Invalid Input. Please select Location.",
          title: "Warning",
          icon: "warning"
        });
      }
    );
  }
};

const AddItems = ($this, context) => {
  if ($this.state.item_id === null) {
    successfulMessage({
      message: "Invalid Input. Select Item.",
      title: "Warning",
      icon: "warning"
    });
  } else if ($this.state.quantity_required === 0) {
    successfulMessage({
      message: "Invalid Input. Please enter Quantity Required .",
      title: "Warning",
      icon: "warning"
    });
  } else {
    debugger;
    let ItemInput = [
      {
        completed: "N",
        item_category_id: $this.state.item_category_id,
        item_group_id: $this.state.item_group_id,
        item_id: $this.state.item_id,
        quantity_required: $this.state.quantity_required,
        quantity_authorized: 0,
        item_uom: $this.state.item_uom
      }
    ];

    $this.setState({
      pharmacy_stock_detail: ItemInput,
      addedItem: true,
      item_category_id: null,
      item_group_id: null,
      item_id: null,
      quantity_required: 0,

      item_uom: null
    });

    if (context !== undefined) {
      context.updateState({
        pharmacy_stock_detail: ItemInput,
        addedItem: true,
        saveEnable: false
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

const updatePosDetail = ($this, e) => {
  debugger;
};

const onchangegridcol = ($this, context, row, e) => {
  debugger;
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;

  for (let x = 0; x < pharmacy_stock_detail.length; x++) {
    if (pharmacy_stock_detail[x].item_id === row.item_id) {
      pharmacy_stock_detail[x] = row;
    }
  }
  $this.setState({ pharmacy_stock_detail: pharmacy_stock_detail });

  if (context !== undefined) {
    context.updateState({
      pharmacy_stock_detail: pharmacy_stock_detail
    });
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
  onchangegridcol
};
