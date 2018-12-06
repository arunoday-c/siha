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

const deleteDNDetail = ($this, context, row) => {
  let dn_entry_detail = $this.state.dn_entry_detail;

  for (var i = 0; i < dn_entry_detail.length; i++) {
    if (dn_entry_detail[i].phar_item_id === row["phar_item_id"]) {
      dn_entry_detail.splice(i, 1);
    }
  }

  if (dn_entry_detail.length === 0) {
    assignDataandclear($this, context, dn_entry_detail, "dn_entry_detail");
  } else {
    if (context !== undefined) {
      context.updateState({
        dn_entry_detail: dn_entry_detail
      });
    }
  }
};

const updateDNDetail = ($this, context, row) => {
  //debugger;
  let dn_entry_detail = $this.state.dn_entry_detail;
  if ($this.state.dn_from === "PHR") {
    for (var i = 0; i < dn_entry_detail.length; i++) {
      if (dn_entry_detail[i].phar_item_id === row["phar_item_id"]) {
        dn_entry_detail[i] = row;
      }
    }
  } else {
    for (var k = 0; k < dn_entry_detail.length; k++) {
      if (dn_entry_detail[k].inv_item_id === row["inv_item_id"]) {
        dn_entry_detail[k] = row;
      }
    }
  }

  let sub_total = Enumerable.from(dn_entry_detail).sum(s =>
    parseFloat(s.extended_price)
  );

  let net_total = Enumerable.from(dn_entry_detail).sum(s =>
    parseFloat(s.net_extended_cost)
  );

  let net_payable = Enumerable.from(dn_entry_detail).sum(s =>
    parseFloat(s.total_amount)
  );

  let total_tax = Enumerable.from(dn_entry_detail).sum(s =>
    parseFloat(s.tax_amount)
  );

  let detail_discount = Enumerable.from(dn_entry_detail).sum(s =>
    parseFloat(s.discount_amount)
  );

  $this.setState({
    dn_entry_detail: dn_entry_detail,
    sub_total: sub_total,
    net_total: net_total,
    net_payable: net_payable,
    total_tax: total_tax,
    detail_discount: detail_discount
  });

  if (context !== undefined) {
    context.updateState({
      dn_entry_detail: dn_entry_detail,
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
  //debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if (value > row.total_quantity) {
    swalMessage({
      title:
        "Invalid Input. Authorize Quantity cannot be greater than Ordered Quantity.",
      type: "warning"
    });
  } else {
    row[name] = value;
    row["rejected_quantity"] = row.total_quantity - value;
    row.update();
  }
};

const onchhangegriddiscount = ($this, row, ctrl, e) => {
  debugger;

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

    if (parseFloat(value) > row.po_quantity) {
      swalMessage({
        title:
          "Invalid Input.  DN Quantity cannot be greater than PO Quantity.",
        type: "warning"
      });
      row[name] = row[name];
      row.update();
    } else {
      //debugger;
      extended_price = (parseFloat(row.unit_price) * parseFloat(value)).toFixed(
        2
      );
      discount_amount = ((extended_price * discount_percentage) / 100).toFixed(
        2
      );

      extended_cost = extended_price - discount_amount;

      tax_amount = (extended_cost * parseFloat(row.tax_percentage)) / 100;

      row[name] = value;
      row["extended_price"] = extended_price;
      row["extended_cost"] = extended_cost.toFixed(2);
      row["unit_cost"] = (extended_cost / parseFloat(row.dn_quantity)).toFixed(
        2
      );

      row["tax_amount"] = tax_amount.toFixed(2);
      row["total_amount"] = (tax_amount + extended_cost).toFixed(2);

      row["discount_amount"] = discount_amount;
      row["extended_cost"] = extended_cost.toFixed(2);
      row["net_extended_cost"] = extended_cost.toFixed(2);
      row.update();
    }
  }
};

export {
  deleteDNDetail,
  updateDNDetail,
  dateFormater,
  onchangegridcol,
  assignDataandclear,
  onchhangegriddiscount
};
