import { swalMessage } from "../../../../utils/algaehApiCall";
import Enumerable from "linq";

let texthandlerInterval = null;


const numberchangeTexts = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (value < 0) {
    swalMessage({
      title: "Cannot be less than Zero",
      type: "warning"
    });
  } else {
    $this.setState({
      [name]: value,
    });
    if (context !== undefined) {
      context.updateState({
        [name]: value,
      });
    }
  }
};

const itemchangeText = ($this, context, e) => {

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if ($this.state.quotation_for === "PHR") {
    $this.setState({
      [name]: value,
      phar_item_category: e.selected.category_id,
      pharmacy_uom_id: e.selected.purchase_uom_id,
      phar_item_group: e.selected.group_id,
      addItemButton: false
    });

    if (context !== undefined) {
      context.updateState({
        [name]: value,
        phar_item_category: e.selected.category_id,
        pharmacy_uom_id: e.selected.purchase_uom_id,
        phar_item_group: e.selected.group_id,
        addItemButton: false,
        quantity: 0
      });
    }
  } else {
    $this.setState({
      [name]: value,
      inv_item_category_id: e.selected.category_id,
      inventory_uom_id: e.selected.purchase_uom_id,
      inv_item_group_id: e.selected.group_id,
      addItemButton: false
    });

    if (context !== undefined) {
      context.updateState({
        [name]: value,
        inv_item_category_id: e.selected.category_id,
        inventory_uom_id: e.selected.purchase_uom_id,
        inv_item_group_id: e.selected.group_id,
        addItemButton: false,
        quantity: 0
      });
    }
  }


};

const AddItems = ($this, context) => {
  if ($this.state.quantity === 0) {
    swalMessage({
      title: "Please enter Quantity Required .",
      type: "warning"
    });
  } else {
    let ItemInput = {
      phar_item_category: $this.state.phar_item_category,
      phar_item_group: $this.state.phar_item_group,
      phar_item_id: $this.state.phar_item_id,
      inv_item_category_id: $this.state.inv_item_category_id,
      inv_item_group_id: $this.state.inv_item_group_id,
      inv_item_id: $this.state.inv_item_id,
      pharmacy_uom_id: $this.state.pharmacy_uom_id,
      inventory_uom_id: $this.state.inventory_uom_id,
      quantity: $this.state.quantity
    };
    let quotation_detail = $this.state.quotation_detail;
    quotation_detail.push(ItemInput);
    if (context !== undefined) {
      context.updateState({
        quotation_detail: quotation_detail,
        saveEnable: false
      });
    }
    clearItemData($this, context)
  }
};

const deleteQuotationDetail = ($this, context, row) => {
  let quotation_detail = $this.state.quotation_detail;

  quotation_detail.splice(row.rowIdx, 1);
  if (context !== undefined) {
    context.updateState({
      quotation_detail: quotation_detail,
      saveEnable: quotation_detail.length > 0 ? false : true
    });
  }


};
const gridNumHandler = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (parseFloat(value) > parseFloat(row.total_quantity)) {
    swalMessage({
      title: "Authorize Quantity cannot be greater than Ordered Quantity.",
      type: "warning"
    });
  } else if (value < 0) {
    swalMessage({
      title: "Authorize Quantity cannot be less than Zero",
      type: "warning"
    });
  } else {
    let extended_price = 0;
    if (parseFloat(value) > 0 && parseFloat(row.unit_price) > 0) {
      extended_price = parseFloat(value) * parseFloat(row.unit_price);
    }
    let unit_cost = extended_price / parseFloat(value);
    let tax_amount = (extended_price * parseFloat(row.tax_percentage)) / 100;
    let total_amount = tax_amount + extended_price;
    $this.setState({
      [name]: value,
      extended_price: extended_price,
      extended_cost: extended_price,
      net_extended_cost: extended_price,
      unit_cost: unit_cost,
      tax_amount: tax_amount,
      total_amount: total_amount
    });
  }
};

const clearItemData = ($this, context) => {

  $this.setState({
    phar_item_id: null,
    inv_item_id: null,
    phar_item_category: null,
    inv_item_category_id: null,
    phar_item_group: null,
    inv_item_group_id: null,
    pharmacy_uom_id: null,
    inventory_uom_id: null,
    quantity: 0,
    addItemButton: true
  });
  if (context !== undefined) {
    context.updateState({
      phar_item_id: null,
      inv_item_id: null,
      phar_item_category: null,
      inv_item_category_id: null,
      phar_item_group: null,
      inv_item_group_id: null,
      pharmacy_uom_id: null,
      inventory_uom_id: null,
      quantity: 0,
      addItemButton: true
    });
  }
}


export {
  itemchangeText,
  numberchangeTexts,
  AddItems,
  deleteQuotationDetail,
  gridNumHandler
};
