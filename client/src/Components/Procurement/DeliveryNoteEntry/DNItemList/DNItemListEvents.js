import { swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";
import extend from "extend";
import Options from "../../../../Options.json";

let texthandlerInterval = null;

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
    parseFloat(s.sub_discount_amount)
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

    order_quantity: 0,
    total_quantity: 0,
    unit_price: 0,
    extended_price: 0,
    sub_discount_percentage: 0,
    sub_discount_amount: 0,
    extended_cost: 0,
    discount_percentage: 0,
    discount_amount: 0,
    net_extended_cost: 0,
    unit_cost: 0,
    expected_arrival_date: null,
    authorize_quantity: 0,
    rejected_quantity: 0,
    pharmacy_requisition_id: null,
    inventory_requisition_id: null,
    tax_amount: 0,
    total_amount: 0,
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

      order_quantity: 0,
      total_quantity: 0,
      unit_price: 0,
      extended_price: 0,
      sub_discount_percentage: 0,
      sub_discount_amount: 0,
      extended_cost: 0,
      discount_percentage: 0,
      discount_amount: 0,
      net_extended_cost: 0,
      unit_cost: 0,
      expected_arrival_date: null,
      authorize_quantity: 0,
      rejected_quantity: 0,
      pharmacy_requisition_id: null,
      inventory_requisition_id: null,
      tax_amount: 0,
      total_amount: 0,
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
  if ($this.state.dn_from === "PHR") {
    let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;

    for (var i = 0; i < pharmacy_stock_detail.length; i++) {
      if (pharmacy_stock_detail[i].phar_item_id === row["phar_item_id"]) {
        pharmacy_stock_detail.splice(i, 1);
      }
    }

    if (pharmacy_stock_detail.length === 0) {
      assignDataandclear(
        $this,
        context,
        pharmacy_stock_detail,
        "pharmacy_stock_detail"
      );
    } else {
      if (context !== undefined) {
        context.updateState({
          pharmacy_stock_detail: pharmacy_stock_detail
        });
      }
    }
  } else {
    {
      let inventory_stock_detail = $this.state.inventory_stock_detail;

      for (var i = 0; i < inventory_stock_detail.length; i++) {
        if (inventory_stock_detail[i].inv_item_id === row["inv_item_id"]) {
          inventory_stock_detail.splice(i, 1);
        }
      }

      if (inventory_stock_detail.length === 0) {
        assignDataandclear(
          $this,
          context,
          inventory_stock_detail,
          "inventory_stock_detail"
        );
      } else {
        if (context !== undefined) {
          context.updateState({
            inventory_stock_detail: inventory_stock_detail
          });
        }
      }
    }
  }
};

const updateDNDetail = ($this, context, row) => {
  debugger;
  let po_entry_detail = $this.state.po_entry_detail;
  if ($this.state.dn_from === "PHR") {
    for (var i = 0; i < po_entry_detail.length; i++) {
      if (po_entry_detail[i].phar_item_id === row["phar_item_id"]) {
        po_entry_detail[i] = row;
      }
    }
  } else {
    for (var i = 0; i < po_entry_detail.length; i++) {
      if (po_entry_detail[i].inv_item_id === row["inv_item_id"]) {
        po_entry_detail[i] = row;
      }
    }
  }

  let sub_total = Enumerable.from(po_entry_detail).sum(s =>
    parseFloat(s.extended_price)
  );

  let net_total = Enumerable.from(po_entry_detail).sum(s =>
    parseFloat(s.net_extended_cost)
  );

  let net_payable = Enumerable.from(po_entry_detail).sum(s =>
    parseFloat(s.total_amount)
  );

  let total_tax = Enumerable.from(po_entry_detail).sum(s =>
    parseFloat(s.tax_amount)
  );

  let detail_discount = Enumerable.from(po_entry_detail).sum(s =>
    parseFloat(s.sub_discount_amount)
  );

  $this.setState({
    po_entry_detail: po_entry_detail,
    sub_total: sub_total,
    net_total: net_total,
    net_payable: net_payable,
    total_tax: total_tax,
    detail_discount: detail_discount
  });

  if (context !== undefined) {
    context.updateState({
      po_entry_detail: po_entry_detail,
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
    let sub_discount_percentage = row.sub_discount_percentage;
    let sub_discount_amount = 0;
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
      debugger;
      extended_price = (parseFloat(row.unit_price) * parseFloat(value)).toFixed(
        2
      );
      sub_discount_amount = (
        (extended_price * sub_discount_percentage) /
        100
      ).toFixed(2);

      extended_cost = extended_price - sub_discount_amount;

      tax_amount = (extended_cost * parseFloat(row.tax_percentage)) / 100;

      row[name] = value;
      row["extended_price"] = extended_price;
      row["extended_cost"] = extended_cost.toFixed(2);
      row["unit_cost"] = (extended_cost / parseFloat(row.dn_quantity)).toFixed(
        2
      );

      row["tax_amount"] = tax_amount.toFixed(2);
      row["total_amount"] = (tax_amount + extended_cost).toFixed(2);

      row["sub_discount_amount"] = sub_discount_amount;
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
