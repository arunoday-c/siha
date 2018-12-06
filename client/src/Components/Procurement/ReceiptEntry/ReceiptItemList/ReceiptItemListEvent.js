import { swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";

import Options from "../../../../Options.json";

const assignDataandclear = ($this, context, stock_detail, assignData) => {
  let sub_total = Enumerable.from(stock_detail).sum(s =>
    parseFloat(s.extended_price)
  );

  let net_total = Enumerable.from(stock_detail).sum(s =>
    parseFloat(s.net_extended_cost)
  );

  let net_payable = Enumerable.from(stock_detail).sum(s =>
    parseFloat(s.total_amount)
  );

  let total_tax = Enumerable.from(stock_detail).sum(s =>
    parseFloat(s.tax_amount)
  );

  let detail_discount = Enumerable.from(stock_detail).sum(s =>
    parseFloat(s.discount_amount)
  );

  $this.setState({
    [assignData]: stock_detail,
    completed: "N",
    addedItem: true,
    saveEnable: false,
    phar_item_category: null,
    phar_item_group: null,
    phar_item_id: null,
    inv_item_category_id: null,
    inv_item_group_id: null,
    inv_item_id: null,

    pharmacy_uom_id: null,
    inventory_uom_id: null,

    item_type: null,
    sub_total: sub_total,
    net_total: net_total,
    net_payable: net_payable,
    total_tax: total_tax,
    detail_discount: detail_discount,
    addItemButton: true
  });

  if (context !== undefined) {
    context.updateState({
      [assignData]: stock_detail,
      addedItem: true,
      saveEnable: false,
      completed: "N",
      phar_item_category: null,
      phar_item_group: null,
      phar_item_id: null,
      inv_item_category_id: null,
      inv_item_group_id: null,
      inv_item_id: null,

      pharmacy_uom_id: null,
      inventory_uom_id: null,

      item_type: null,
      sub_total: sub_total,
      net_total: net_total,
      net_payable: net_payable,
      total_tax: total_tax,
      detail_discount: detail_discount,
      addItemButton: true
    });
  }
};

const deleteReceiptDetail = ($this, context, row) => {
  let receipt_entry_detail = $this.state.receipt_entry_detail;

  for (var i = 0; i < receipt_entry_detail.length; i++) {
    if (receipt_entry_detail[i].phar_item_id === row["phar_item_id"]) {
      receipt_entry_detail.splice(i, 1);
    }
  }

  if (receipt_entry_detail.length === 0) {
    assignDataandclear(
      $this,
      context,
      receipt_entry_detail,
      "receipt_entry_detail"
    );
  } else {
    if (context !== undefined) {
      context.updateState({
        receipt_entry_detail: receipt_entry_detail
      });
    }
  }
};

const updateReceiptDetail = ($this, context, row) => {
  debugger;
  let receipt_entry_detail = $this.state.receipt_entry_detail;
  if ($this.state.grn_for === "PHR") {
    for (var i = 0; i < receipt_entry_detail.length; i++) {
      if (receipt_entry_detail[i].phar_item_id === row["phar_item_id"]) {
        receipt_entry_detail[i] = row;
      }
    }
  } else {
    for (var k = 0; k < receipt_entry_detail.length; k++) {
      if (receipt_entry_detail[k].inv_item_id === row["inv_item_id"]) {
        receipt_entry_detail[k] = row;
      }
    }
  }

  let sub_total = Enumerable.from(receipt_entry_detail).sum(s =>
    parseFloat(s.extended_price)
  );

  let net_total = Enumerable.from(receipt_entry_detail).sum(s =>
    parseFloat(s.net_extended_cost)
  );

  let net_payable = Enumerable.from(receipt_entry_detail).sum(s =>
    parseFloat(s.total_amount)
  );

  let total_tax = Enumerable.from(receipt_entry_detail).sum(s =>
    parseFloat(s.tax_amount)
  );

  let detail_discount = Enumerable.from(receipt_entry_detail).sum(s =>
    parseFloat(s.discount_amount)
  );

  let saveBtn = false;
  let postBtn = false;
  if ($this.state.hims_f_procurement_grn_header_id === null) {
    saveBtn = false;
    postBtn = true;
  } else if (
    $this.state.hims_f_procurement_grn_header_id !== null &&
    $this.state.posted === "N"
  ) {
    saveBtn = true;
    postBtn = false;
  } else if (
    $this.state.hims_f_procurement_grn_header_id !== null &&
    $this.state.posted === "Y"
  ) {
    saveBtn = true;
    postBtn = true;
  }

  $this.setState({
    receipt_entry_detail: receipt_entry_detail,
    sub_total: sub_total,
    net_total: net_total,
    net_payable: net_payable,
    total_tax: total_tax,
    detail_discount: detail_discount
  });

  if (context !== undefined) {
    context.updateState({
      saveEnable: saveBtn,
      postEnable: postBtn,
      receipt_entry_detail: receipt_entry_detail,
      sub_total: sub_total,
      net_total: net_total,
      net_payable: net_payable,
      total_tax: total_tax,
      detail_discount: detail_discount
    });
  }
};

const dateFormater = ($this, value) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const onchangegridcol = ($this, row, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if (parseFloat(value) > row.dn_quantity) {
    swalMessage({
      title:
        "Invalid Input. Authorize Quantity cannot be greater than Ordered Quantity.",
      type: "warning"
    });
  } else {
    row[name] = value;
    row["rejected_quantity"] = row.dn_quantity - parseFloat(value);
    row.update();
  }
};

const onchhangegriddiscount = ($this, row, ctrl, e) => {
  e = e || ctrl;

  if (e.target.value === "") {
    $this.setState({
      [e.target.name]: 0
    });
  } else {
    let discount_percentage = row.discount_percentage;
    let discount_amount = 0;
    let extended_cost = 0;
    let extended_price = 0;
    let tax_amount = 0;

    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    if (value > row.authorize_quantity) {
      swalMessage({
        title:
          "Invalid Input.  DN Quantity cannot be greater than PO Quantity.",
        type: "warning"
      });
    } else {
      extended_price = parseFloat(row.unit_price) * parseFloat(value);
      discount_amount = (extended_price * discount_percentage) / 100;

      extended_cost = extended_price - discount_amount;

      tax_amount = (extended_cost * parseFloat(row.tax_percentage)) / 100;

      row[name] = value;
      row["extended_price"] = extended_price;
      row["extended_cost"] = extended_cost;
      row["unit_cost"] = extended_cost / parseFloat(row.dn_quantity);

      row["tax_amount"] = tax_amount;
      row["total_amount"] = tax_amount + extended_cost;

      row["discount_amount"] = discount_amount;
      row["extended_cost"] = extended_cost;
      row["net_extended_cost"] = extended_cost;
      row.update();
    }
  }
};

const EditGrid = ($this, context, cancelRow) => {
  debugger;
  if (context != null) {
    let saveBtn = true;
    let postBtn = true;

    let _receipt_entry_detail = $this.state.receipt_entry_detail;
    if (cancelRow !== undefined) {
      _receipt_entry_detail[cancelRow.rowIdx] = cancelRow;
    }
    context.updateState({
      saveEnable: saveBtn,
      postEnable: postBtn,
      receipt_entry_detail: _receipt_entry_detail
    });
  }
};

const CancelGrid = ($this, context, cancelRow) => {
  debugger;
  if (context != null) {
    let saveBtn = false;
    let postBtn = false;
    if ($this.state.hims_f_procurement_grn_header_id === null) {
      saveBtn = false;
      postBtn = true;
    } else if (
      $this.state.hims_f_procurement_grn_header_id !== null &&
      $this.state.posted === "N"
    ) {
      saveBtn = true;
      postBtn = false;
    } else if (
      $this.state.hims_f_procurement_grn_header_id !== null &&
      $this.state.posted === "Y"
    ) {
      saveBtn = true;
      postBtn = true;
    }

    let _receipt_entry_detail = $this.state.receipt_entry_detail;
    if (cancelRow !== undefined) {
      _receipt_entry_detail[cancelRow.rowIdx] = cancelRow;
    }
    context.updateState({
      saveEnable: saveBtn,
      postEnable: postBtn,
      addItemButton: !$this.state.addItemButton,
      receipt_entry_detail: _receipt_entry_detail
    });
  }
};

const onchangegridcoldatehandle = ($this, row, ctrl, e) => {
  row[e] = moment(ctrl)._d;
  $this.setState({ append: !$this.state.append });
};

const changeDateFormat = date => {
  if (date != null) {
    return moment(date).format(Options.dateFormat);
  }
};

export {
  deleteReceiptDetail,
  updateReceiptDetail,
  dateFormater,
  onchangegridcol,
  assignDataandclear,
  onchhangegriddiscount,
  onchangegridcoldatehandle,
  EditGrid,
  CancelGrid,
  changeDateFormat
};
