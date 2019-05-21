import { swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";
import Options from "../../../../Options.json";
import AlgaehReport from "../../../Wrapper/printReports";

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
  dn_entry_detail.splice(row.rowIdx, 1);

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
  let saveBtn = false;
  if ($this.state.hims_f_procurement_dn_header_id !== null) {
    saveBtn = true;
  }

  if (row.dn_quantity === "" || row.dn_quantity === 0) {
    swalMessage({
      title: "Delivery Note Quantity cannot be Zero.",
      type: "warning"
    });
  } else {
    let dn_entry_detail = $this.state.dn_entry_detail;

    dn_entry_detail[row.rowIdx] = row;

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
        detail_discount: detail_discount,
        saveEnable: saveBtn
      });
    }
  }
};

const dateFormater = ($this, value) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const onchhangegriddiscount = ($this, row, e) => {
  debugger;
  let discount_percentage = row.discount_percentage;
  let discount_amount = 0;
  let extended_cost = 0;
  let extended_price = 0;
  let tax_amount = 0;

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  row.quantity_recieved_todate =
    row.quantity_recieved_todate === 0 ? 0 : row.quantity_recieved_todate;
  let quantity_recieved_todate =
    row.quantity_recieved_todate + parseFloat(value);
  if (value !== "") {
    if (quantity_recieved_todate > parseFloat(row.po_quantity)) {
      swalMessage({
        title: " Delivery Note Quantity cannot be greater than PO Quantity.",
        type: "warning"
      });
    } else if (parseFloat(value) < 0) {
      swalMessage({
        title: " Delivery Quantity cannot be less than Zero.",
        type: "warning"
      });
    } else {
      extended_price = parseFloat(row.unit_price) * parseFloat(value);
      discount_amount = (extended_price * discount_percentage) / 100;

      tax_amount = (extended_cost * parseFloat(row.tax_percentage)) / 100;
      extended_cost = extended_price - discount_amount;

      extended_price = parseFloat(
        getAmountFormart(extended_price, {
          appendSymbol: false
        })
      );
      discount_amount = getAmountFormart(discount_amount, {
        appendSymbol: false
      });
      tax_amount = getAmountFormart(tax_amount, { appendSymbol: false });

      row["quantity_outstanding"] =
        row.po_quantity - row.quantity_recieved_todate - parseFloat(value);
      row["extended_price"] = parseFloat(extended_price);
      row["extended_cost"] = parseFloat(extended_cost);
      row["unit_cost"] = parseFloat(extended_cost) / parseFloat(value);

      row["tax_amount"] = parseFloat(tax_amount);
      row["total_amount"] = parseFloat(tax_amount) + parseFloat(extended_cost);

      row["discount_amount"] = parseFloat(discount_amount);
      row["extended_cost"] = parseFloat(extended_cost);
      row["net_extended_cost"] = parseFloat(extended_cost);

      row[name] = value;
      row.update();
    }
  } else {
    row[name] = value;
    row.update();
  }
};

const GridAssignData = ($this, row, e) => {
  if (row.dn_quantity === "" || row.dn_quantity === 0) {
    e.preventDefault();
    row["dn_quantity"] = 0;
    swalMessage({
      title: "Delivery Note Quantity cannot be Zero.",
      type: "warning"
    });
    row.update();
    e.target.focus();
  }
};

const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if (parseFloat(value) > row.dn_quantity) {
    swalMessage({
      title: "Authorize Quantity cannot be greater than Ordered Quantity.",
      type: "warning"
    });
  } else {
    row[name] = value;
    row.update();
  }
};

const EditGrid = ($this, context, cancelRow) => {
  if (context !== null) {
    context.updateState({
      saveEnable: true
    });
  }
};

const CancelGrid = ($this, context, cancelRow) => {
  if (context !== null) {
    let saveBtn = false;
    if ($this.state.hims_f_procurement_dn_header_id !== null) {
      saveBtn = true;
    }

    let _dn_entry_detail = $this.state.dn_entry_detail;
    if (cancelRow !== undefined) {
      _dn_entry_detail[cancelRow.rowIdx] = cancelRow;
    }
    context.updateState({
      saveEnable: saveBtn,
      dn_entry_detail: _dn_entry_detail
    });
  }
};

const onchangegridcoldatehandle = ($this, row, ctrl, e) => {
  if (Date.parse(moment(ctrl)._d) < Date.parse(new Date())) {
    swalMessage({
      title: "Expiry date cannot be past Date.",
      type: "warning"
    });
  } else {
    row[e] = moment(ctrl)._d;
    $this.setState({ append: !$this.state.append });
  }
};

const changeDateFormat = date => {
  if (date != null) {
    return moment(date).format(Options.dateFormat);
  }
};

const printBarcode = ($this, row, e) => {
  AlgaehReport({
    report: {
      fileName: "sampleBarcode",
      barcode: {
        parameter: "bar_code",
        options: {
          format: "",
          lineColor: "#0aa",
          width: 4,
          height: 40
        }
      }
    },
    data: {
      bar_code: row.item_code + "-" + row.batchno
    }
  });
};

export {
  deleteDNDetail,
  updateDNDetail,
  dateFormater,
  onchangegridcol,
  assignDataandclear,
  onchhangegriddiscount,
  GridAssignData,
  EditGrid,
  CancelGrid,
  onchangegridcoldatehandle,
  changeDateFormat,
  printBarcode
};
