import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";
import Options from "../../../../Options.json";
// import AlgaehReport from "../../../Wrapper/printReports";
import _ from "lodash";
import extend from "extend";

const assignDataandclear = (
  $this,
  context,
  stock_detail,
  assignData,
  po_entry_detail,
  assignPo
) => {
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
    [assignPo]: po_entry_detail,
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
      [assignPo]: po_entry_detail,
      addedItem: true,
      // saveEnable: false,
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
      addItemButton: true,
      saveEnable: true
    });
  }
};

const deleteDNDetail = ($this, row, context) => {
  let dn_entry_detail = $this.state.dn_entry_detail;
  let po_entry_detail = $this.state.po_entry_detail;

  // for (var i = 0; i < dn_entry_detail.length; i++) {
  //   if (dn_entry_detail[i].phar_item_id === row["phar_item_id"]) {
  //     dn_entry_detail.splice(i, 1);
  //   }
  // }
  let _dn_index_data = dn_entry_detail.indexOf(row);
  dn_entry_detail.splice(_dn_index_data, 1);
  let getDeleteRowData = _.find(
    po_entry_detail,
    f => f.item_id === row.item_id
  );

  let _index = po_entry_detail.indexOf(getDeleteRowData);

  getDeleteRowData.dn_quantity =
    parseFloat(getDeleteRowData.dn_quantity) - parseFloat(row.dn_quantity);
  getDeleteRowData.quantity_outstanding =
    parseFloat(getDeleteRowData.quantity_outstanding) +
    parseFloat(row.dn_quantity);

  po_entry_detail[_index] = getDeleteRowData;
  let getDnDetailToDelete = _.find(
    po_entry_detail[_index].dn_entry_detail,
    f => f.dn_detail_index === row.dn_detail_index
  );

  let _dn_index = po_entry_detail[_index].dn_entry_detail.indexOf(
    getDnDetailToDelete
  );
  po_entry_detail[_index].dn_entry_detail.splice(_dn_index, 1);

  if (dn_entry_detail.length === 0) {
    assignDataandclear(
      $this,
      context,
      dn_entry_detail,
      "dn_entry_detail",
      po_entry_detail,
      "po_entry_detail"
    );
  } else {
    if (context !== undefined) {
      context.updateState({
        po_entry_detail: po_entry_detail,
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

const onchhangeNumber = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  row.update();
};

const onchhangegriddiscount = ($this, row, e) => {
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
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob"
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "ProcurementBarcode",
        reportParams: [
          {
            name: "hims_f_procurement_dn_batches_id",
            value: row.hims_f_procurement_dn_batches_id
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const url = URL.createObjectURL(res.data);
      let myWindow = window.open(
        "{{ product.metafields.google.custom_label_0 }}",
        "_blank"
      );

      myWindow.document.write(
        "<iframe src= '" + url + "' width='100%' height='100%' />"
      );
      myWindow.document.title = "Item Barcode";
    }
  });
};

const onChangeTextEventHandaler = ($this, context, e) => {
  let item_details = $this.state.item_details;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if (name === "sales_price" || name === "unit_price") {
    if (parseFloat(value) < 0) {
      swalMessage({
        title: "Cannot be lessthan zero.",
        type: "warning"
      });
      return;
    }
  }
  item_details[name] = value;
  $this.setState({
    [name]: value,
    item_details: item_details
  });
  context.updateState({
    [name]: value,
    item_details: item_details
  });
};

const onDateTextEventHandaler = ($this, context, ctrl, e) => {
  let item_details = $this.state.item_details;

  item_details[e] = moment(ctrl)._d;

  $this.setState({
    [e]: moment(ctrl)._d,
    append: !$this.state.append,
    item_details: item_details
  });
  context.updateState({
    [e]: moment(ctrl)._d,
    append: !$this.state.append,
    item_details: item_details
  });
};

const OnChangeDeliveryQty = ($this, context, e) => {
  let item_details = extend({}, $this.state.item_details);

  let discount_percentage = item_details.discount_percentage;
  let discount_amount = 0;
  let extended_cost = 0;
  let extended_price = 0;
  let tax_amount = 0;

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  let entered_dn_quantity =
    parseFloat(
      $this.state.po_entry_detail[$this.state.selected_row_index].dn_quantity
    ) +
    parseFloat(
      $this.state.po_entry_detail[$this.state.selected_row_index]
        .quantity_recieved_todate
    );

  item_details.quantity_recieved_todate =
    item_details.quantity_recieved_todate === 0
      ? 0
      : item_details.quantity_recieved_todate;
  let quantity_recieved_todate =
    parseFloat(entered_dn_quantity) + parseFloat(value);
  if (value !== "") {
    if (quantity_recieved_todate > parseFloat(item_details.po_quantity)) {
      swalMessage({
        title: " Delivery Note Quantity cannot be greater than PO Quantity.",
        type: "warning"
      });
    } else if (parseFloat(value) < 0) {
      swalMessage({
        title: "Delivery Quantity cannot be less than Zero.",
        type: "warning"
      });
    } else {
      extended_price = parseFloat(item_details.unit_price) * parseFloat(value);
      discount_amount = (extended_price * discount_percentage) / 100;
      extended_cost = extended_price - discount_amount;
      tax_amount =
        (extended_cost * parseFloat(item_details.tax_percentage)) / 100;

      extended_price = parseFloat(
        getAmountFormart(extended_price, {
          appendSymbol: false
        })
      );
      discount_amount = getAmountFormart(discount_amount, {
        appendSymbol: false
      });
      tax_amount = getAmountFormart(tax_amount, { appendSymbol: false });

      item_details["extended_price"] = parseFloat(extended_price);
      item_details["extended_cost"] = parseFloat(extended_cost);
      item_details["unit_cost"] = parseFloat(extended_cost) / parseFloat(value);

      item_details["tax_amount"] = parseFloat(tax_amount);
      item_details["total_amount"] =
        parseFloat(tax_amount) + parseFloat(extended_cost);

      item_details["discount_amount"] = parseFloat(discount_amount);
      item_details["extended_cost"] = parseFloat(extended_cost);
      item_details["net_extended_cost"] = parseFloat(extended_cost);
      item_details["expiry_date"] = item_details["expiry_date"];
      item_details[name] = value;
      $this.setState({
        [name]: value,
        item_details: item_details
      });
      context.updateState({
        [name]: value,
        item_details: item_details
      });
    }
  } else {
    $this.setState({
      [name]: value
    });
    context.updateState({
      [name]: value
    });
  }
};

const AddtoList = ($this, context) => {
  let dn_entry_detail = extend([], $this.state.dn_entry_detail);
  let _dn_entry_detail = extend([], $this.state.dn_entry_detail);

  let item_details = extend({}, $this.state.item_details);
  let _item_details = extend({}, $this.state.item_details);
  let dn_item_details = extend({}, $this.state.item_details);

  let _po_entry_detail = $this.state.po_entry_detail;

  if (
    (parseFloat($this.state.dn_quantity) === 0 ||
      $this.state.dn_quantity === "" ||
      $this.state.dn_quantity === null) &&
    (parseFloat($this.state.free_qty) === 0 ||
      $this.state.free_qty === "" ||
      $this.state.free_qty === null)
  ) {
    swalMessage({
      title: "Enter Delivery Quantity or Free Quantity.",
      type: "warning"
    });
  } else if (
    ($this.state.expiry_date === null ||
      $this.state.expiry_date === undefined) &&
    item_details.exp_date_required === "Y"
  ) {
    swalMessage({
      title: "Expiry Date is mandatory.",
      type: "warning"
    });
  } else if (
    item_details.sales_price === null ||
    parseFloat(item_details.sales_price) === 0
  ) {
    swalMessage({
      title: "Sales Price is mandatory.",
      type: "warning"
    });
  } else if (
    item_details.unit_price === null ||
    parseFloat(item_details.unit_price) === 0
  ) {
    swalMessage({
      title: "Purchase Cost is mandatory.",
      type: "warning"
    });
  } else {
    _dn_entry_detail.push(_item_details);
    let sub_total = Enumerable.from(_dn_entry_detail).sum(s =>
      parseFloat(s.extended_price)
    );

    let net_total = Enumerable.from(_dn_entry_detail).sum(s =>
      parseFloat(s.net_extended_cost)
    );

    let net_payable = Enumerable.from(_dn_entry_detail).sum(s =>
      parseFloat(s.total_amount)
    );

    let total_tax = Enumerable.from(_dn_entry_detail).sum(s =>
      parseFloat(s.tax_amount)
    );

    let detail_discount = Enumerable.from(_dn_entry_detail).sum(s =>
      parseFloat(s.discount_amount)
    );

    const latest_added = _.filter(_dn_entry_detail, f => {
      return f.item_id === _item_details.item_id;
    });
    // _.find(
    //   dn_entry_detail,
    //   f => f.item_id == _item_details.item_id
    // );
    let delivery_quantity = _.sumBy(latest_added, s =>
      parseFloat(s.dn_quantity)
    );

    _item_details["quantity_outstanding"] =
      parseFloat(_item_details.po_quantity) -
      parseFloat(_item_details.quantity_recieved_todate) -
      parseFloat(delivery_quantity);
    dn_entry_detail.push(_item_details);

    item_details["quantity_outstanding"] =
      parseFloat(item_details.po_quantity) -
      parseFloat(item_details.quantity_recieved_todate) -
      parseFloat(delivery_quantity);
    item_details.dn_quantity = delivery_quantity;

    _item_details.dn_index = dn_entry_detail.length > 0 ? dn_entry_detail.length : 0
    _po_entry_detail[$this.state.selected_row_index] = item_details;

    delete _item_details.dn_entry_detail;
    let dn_detail_length =
      _po_entry_detail[$this.state.selected_row_index].dn_entry_detail.length;
    _item_details.dn_detail_index = dn_detail_length;
    _po_entry_detail[$this.state.selected_row_index].dn_entry_detail.push(
      _item_details
    );

    dn_item_details.dn_quantity = 0;
    dn_item_details.extended_price = 0;
    dn_item_details.extended_cost = 0;

    dn_item_details.tax_amount = 0;
    dn_item_details.total_amount = 0;
    dn_item_details.net_extended_cost = 0;

    $this.setState({
      dn_entry_detail: dn_entry_detail,
      item_details: dn_item_details,
      vendor_batchno: null,
      expiry_date: null,
      dn_quantity: null,
      po_entry_detail: _po_entry_detail,
      sub_total: sub_total,
      net_total: net_total,
      net_payable: net_payable,
      total_tax: total_tax,
      detail_discount: detail_discount,
      free_qty: null
    });
    context.updateState({
      dn_entry_detail: dn_entry_detail,
      item_details: dn_item_details,
      vendor_batchno: null,
      expiry_date: null,
      dn_quantity: null,
      po_entry_detail: _po_entry_detail,
      sub_total: sub_total,
      net_total: net_total,
      net_payable: net_payable,
      total_tax: total_tax,
      detail_discount: detail_discount,
      free_qty: null,
      saveEnable: false
    });
  }
};

const numberEventHandaler = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value === "" ? null : e.value || e.target.value;
  let item_details = $this.state.item_details;
  if (parseFloat(value) < 0) {
    swalMessage({
      type: "warning",
      title: "Cannot be less than zero."
    });
    $this.setState({
      [name]: 0
    });
    context.updateState({
      [name]: 0
    });
  } else {
    item_details["free_qty"] = value;
    $this.setState({
      [name]: value,
      item_details: item_details
    });
    context.updateState({
      [name]: value,
      item_details: item_details
    });
  }
};

const dateValidate = ($this, context, value, event) => {
  let inRange = moment(value).isBefore(moment().format("YYYY-MM-DD"));
  if (inRange) {
    swalMessage({
      title: "Expiry date cannot be past Date.",
      type: "warning"
    });
    event.target.focus();
    $this.setState({
      [event.target.name]: null
    });

    context.updateState({
      [event.target.name]: null
    });
  }
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
  printBarcode,
  onchhangeNumber,
  onChangeTextEventHandaler,
  onDateTextEventHandaler,
  OnChangeDeliveryQty,
  AddtoList,
  numberEventHandaler,
  dateValidate
};
