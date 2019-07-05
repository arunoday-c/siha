import { swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";
import Options from "../../../../Options.json";
import math from "mathjs";

let texthandlerInterval = null;

const texthandle = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({ [name]: value });
    }
    clearInterval(texthandlerInterval);
  }, 500);
};

const discounthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  if ($this.state.order_quantity <= 0) {
    $this.setState({
      [e.name]: 0
    });
    swalMessage({
      title: "Please Enter Quantity",
      type: "warning"
    });
  } else {
    let sub_discount_percentage = 0;
    let sub_discount_amount = 0;
    let extended_cost = 0;
    let unit_cost = 0;
    let tax_amount = 0;
    let total_amount = 0;
    if (e.name === "sub_discount_percentage") {
      sub_discount_percentage = e.value === "" ? "" : parseFloat(e.value);
      sub_discount_amount =
        e.value === ""
          ? 0
          : (parseFloat($this.state.extended_price) * sub_discount_percentage) /
            100;
    } else {
      sub_discount_amount = e.value === "" ? "" : parseFloat(e.value);
      sub_discount_percentage =
        e.value === ""
          ? 0
          : (sub_discount_amount / parseFloat($this.state.extended_price)) *
            100;

      sub_discount_percentage = math.round(sub_discount_percentage, 3);
    }
    if (sub_discount_percentage > 100) {
      swalMessage({
        title: "Discount % cannot be greater than 100.",
        type: "warning"
      });
      $this.setState({
        sub_discount_percentage: $this.state.sub_discount_percentage
      });
    } else {
      extended_cost =
        parseFloat($this.state.extended_price) - sub_discount_amount;
      unit_cost = extended_cost / parseFloat($this.state.order_quantity);

      tax_amount =
        (extended_cost * parseFloat($this.state.tax_percentage)) / 100;
      total_amount = tax_amount + extended_cost;

      sub_discount_amount = getAmountFormart(sub_discount_amount, {
        appendSymbol: false
      });
      extended_cost = getAmountFormart(extended_cost, { appendSymbol: false });
      unit_cost = getAmountFormart(unit_cost, { appendSymbol: false });
      tax_amount = getAmountFormart(tax_amount, { appendSymbol: false });
      total_amount = getAmountFormart(total_amount, { appendSymbol: false });

      $this.setState({
        sub_discount_percentage: sub_discount_percentage,
        sub_discount_amount: sub_discount_amount,
        extended_cost: extended_cost,
        net_extended_cost: extended_cost,
        unit_cost: unit_cost,
        tax_amount: tax_amount,
        total_amount: total_amount
      });

      if (context !== null) {
        context.updateState({
          sub_discount_percentage: sub_discount_percentage,
          sub_discount_amount: sub_discount_amount,
          extended_cost: extended_cost,
          net_extended_cost: extended_cost,
          unit_cost: unit_cost,
          tax_amount: tax_amount,
          total_amount: total_amount
        });
      }
    }
  }
};

const numberchangeTexts = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (value < 0) {
    swalMessage({
      title: "Cannot be less than Zero",
      type: "warning"
    });
  } else {
    let extended_price = 0;
    if (parseFloat(value) > 0 && parseFloat($this.state.unit_price) > 0) {
      extended_price = parseFloat(value) * parseFloat($this.state.unit_price);
    }
    let unit_cost = extended_price / parseFloat(value);
    let tax_amount =
      (extended_price * parseFloat($this.state.tax_percentage)) / 100;
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
    clearInterval(texthandlerInterval);
    texthandlerInterval = setInterval(() => {
      if (context !== undefined) {
        context.updateState({
          [name]: value,
          extended_price: extended_price,
          extended_cost: extended_price,
          net_extended_cost: extended_price,
          unit_cost: unit_cost,
          tax_amount: tax_amount,
          total_amount: total_amount
        });
      }
      clearInterval(texthandlerInterval);
    }, 500);
  }
};

const unitpricenumberchangeTexts = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (value < 0) {
    swalMessage({
      title: "Cannot be less than Zero",
      type: "warning"
    });
  } else {
    let extended_price = 0;
    if (parseFloat($this.state.order_quantity) > 0 && parseFloat(value) > 0) {
      extended_price =
        parseFloat($this.state.order_quantity) * parseFloat(value);
    }

    let unit_cost = extended_price / parseFloat($this.state.order_quantity);
    let tax_amount =
      (extended_price * parseFloat($this.state.tax_percentage)) / 100;
    let total_amount = tax_amount + extended_price;

    $this.setState({
      [name]: parseFloat(value).toFixed(6),
      extended_price: extended_price,
      extended_cost: extended_price,
      net_extended_cost: extended_price,
      unit_cost: unit_cost,
      tax_amount: tax_amount,
      total_amount: total_amount
    });
    clearInterval(texthandlerInterval);
    texthandlerInterval = setInterval(() => {
      if (context !== undefined) {
        context.updateState({
          [name]: parseFloat(value).toFixed(6),
          extended_price: extended_price,
          extended_cost: extended_price,
          net_extended_cost: extended_price,
          unit_cost: unit_cost,
          tax_amount: tax_amount,
          total_amount: total_amount
        });
      }
      clearInterval(texthandlerInterval);
    }, 500);
  }
};

const itemchangeText = ($this, context, e) => {
  let name = e.name || e.target.name;
  if (
    $this.state.pharmcy_location_id !== null ||
    $this.state.inventory_location_id !== null
  ) {
    if ($this.state.vendor_id !== null) {
      let value = e.value || e.target.value;

      if ($this.state.po_from === "PHR") {
        $this.setState({
          [name]: value,
          phar_item_category: e.selected.category_id,
          pharmacy_uom_id: e.selected.purchase_uom_id,
          phar_item_group: e.selected.group_id,
          unit_price:
            e.selected.purchase_cost === null
              ? 0
              : parseFloat(e.selected.purchase_cost).toFixed(6),

          addItemButton: false
        });

        if (context !== undefined) {
          context.updateState({
            [name]: value,
            phar_item_category: e.selected.category_id,
            pharmacy_uom_id: e.selected.purchase_uom_id,
            phar_item_group: e.selected.group_id,
            unit_price:
              e.selected.purchase_cost === null
                ? 0
                : parseFloat(e.selected.purchase_cost).toFixed(6),

            addItemButton: false,
            order_quantity: 0,
            extended_price: 0,
            sub_discount_percentage: 0,
            sub_discount_amount: 0,
            extended_cost: 0
          });
        }
      } else {
        $this.setState({
          [name]: value,
          inv_item_category_id: e.selected.category_id,
          inventory_uom_id: e.selected.purchase_uom_id,
          inv_item_group_id: e.selected.group_id,
          unit_price:
            e.selected.purchase_cost === null
              ? 0
              : parseFloat(e.selected.purchase_cost).toFixed(6),

          addItemButton: false
        });

        if (context !== undefined) {
          context.updateState({
            [name]: value,
            inv_item_category_id: e.selected.category_id,
            inventory_uom_id: e.selected.purchase_uom_id,
            inv_item_group_id: e.selected.group_id,
            unit_price:
              e.selected.purchase_cost === null
                ? 0
                : parseFloat(e.selected.purchase_cost).toFixed(6),

            addItemButton: false,
            order_quantity: 0,
            extended_price: 0,
            sub_discount_percentage: 0,
            sub_discount_amount: 0,
            extended_cost: 0
          });
        }
      }
    } else {
      $this.setState(
        {
          [name]: null
        },
        () => {
          swalMessage({
            title: "Please select Vendor.",
            type: "warning"
          });
        }
      );
    }
  } else {
    $this.setState(
      {
        [name]: null
      },
      () => {
        swalMessage({
          title: "Please select Location.",
          type: "warning"
        });
      }
    );
  }
};

const AddItems = ($this, context) => {
  if ($this.state.order_quantity === 0) {
    swalMessage({
      title: "Please enter Quantity Required .",
      type: "warning"
    });
  } else if ($this.state.unit_price === 0) {
    swalMessage({
      title: "Please enter Unit Price .",
      type: "warning"
    });
  } else {
    let ItemInput = {
      completed: "N",
      phar_item_category: $this.state.phar_item_category,
      phar_item_group: $this.state.phar_item_group,
      phar_item_id: $this.state.phar_item_id,
      inv_item_category_id: $this.state.inv_item_category_id,
      inv_item_group_id: $this.state.inv_item_group_id,
      inv_item_id: $this.state.inv_item_id,

      pharmacy_uom_id: $this.state.pharmacy_uom_id,
      inventory_uom_id: $this.state.inventory_uom_id,

      order_quantity: $this.state.order_quantity,
      total_quantity: $this.state.order_quantity,
      unit_price: $this.state.unit_price,
      extended_price: $this.state.extended_price,
      sub_discount_percentage: $this.state.sub_discount_percentage,
      sub_discount_amount: $this.state.sub_discount_amount,
      extended_cost: $this.state.extended_cost,
      discount_percentage: $this.state.discount_percentage,
      discount_amount: $this.state.discount_amount,
      net_extended_cost: $this.state.net_extended_cost,
      unit_cost: $this.state.unit_cost,
      expected_arrival_date: $this.state.expected_date,
      authorize_quantity: $this.state.authorize_quantity,
      quantity_outstanding: 0,
      rejected_quantity: $this.state.rejected_quantity,
      pharmacy_requisition_id: $this.state.pharmacy_requisition_id,
      inventory_requisition_id: $this.state.inventory_requisition_id,
      tax_percentage: $this.state.tax_percentage,
      tax_amount: $this.state.tax_amount,
      total_amount: $this.state.total_amount,
      item_type: $this.state.item_type
    };

    if ($this.state.po_from === "PHR") {
      let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
      pharmacy_stock_detail.push(ItemInput);
      assignDataandclear(
        $this,
        context,
        pharmacy_stock_detail,
        "pharmacy_stock_detail"
      );
    } else {
      let inventory_stock_detail = $this.state.inventory_stock_detail;
      inventory_stock_detail.push(ItemInput);
      assignDataandclear(
        $this,
        context,
        inventory_stock_detail,
        "inventory_stock_detail"
      );
    }
  }
};

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
    saveEnable: stock_detail.length > 0 ? false : true,
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
      saveEnable: stock_detail.length > 0 ? false : true,
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

const deletePODetail = ($this, context, row) => {
  if ($this.state.po_from === "PHR") {
    let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;

    pharmacy_stock_detail.splice(row.rowIdx, 1);
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

      inventory_stock_detail.splice(row.rowIdx, 1);

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

const updatePODetail = ($this, context, row) => {
  let saveEnable = false;
  if ($this.state.hims_f_procurement_po_header_id !== null) {
    saveEnable = true;
  }

  if ($this.state.po_from === "PHR") {
    let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;

    pharmacy_stock_detail[row.rowIdx] = row;

    let sub_total = Enumerable.from(pharmacy_stock_detail).sum(s =>
      parseFloat(s.extended_price)
    );

    let net_total = Enumerable.from(pharmacy_stock_detail).sum(s =>
      parseFloat(s.net_extended_cost)
    );

    let net_payable = Enumerable.from(pharmacy_stock_detail).sum(s =>
      parseFloat(s.total_amount)
    );

    let total_tax = Enumerable.from(pharmacy_stock_detail).sum(s =>
      parseFloat(s.tax_amount)
    );

    let detail_discount = Enumerable.from(pharmacy_stock_detail).sum(s =>
      parseFloat(s.sub_discount_amount)
    );

    $this.setState({
      pharmacy_stock_detail: pharmacy_stock_detail,
      sub_total: sub_total,
      net_total: net_total,
      net_payable: net_payable,
      total_tax: total_tax,
      detail_discount: detail_discount
    });

    if (context !== undefined) {
      context.updateState({
        pharmacy_stock_detail: pharmacy_stock_detail,
        sub_total: sub_total,
        net_total: net_total,
        net_payable: net_payable,
        total_tax: total_tax,
        detail_discount: detail_discount,
        saveEnable: saveEnable,
        authorizeBtn: false
      });
    }
  } else {
    let inventory_stock_detail = $this.state.inventory_stock_detail;

    inventory_stock_detail[row.rowIdx] = row;

    let sub_total = Enumerable.from(inventory_stock_detail).sum(s =>
      parseFloat(s.extended_price)
    );

    let net_total = Enumerable.from(inventory_stock_detail).sum(s =>
      parseFloat(s.net_extended_cost)
    );

    let net_payable = Enumerable.from(inventory_stock_detail).sum(s =>
      parseFloat(s.total_amount)
    );

    let total_tax = Enumerable.from(inventory_stock_detail).sum(s =>
      parseFloat(s.tax_amount)
    );

    let detail_discount = Enumerable.from(inventory_stock_detail).sum(s =>
      parseFloat(s.sub_discount_amount)
    );

    $this.setState({
      inventory_stock_detail: inventory_stock_detail,
      sub_total: sub_total,
      net_total: net_total,
      net_payable: net_payable,
      total_tax: total_tax,
      detail_discount: detail_discount
    });

    if (context !== undefined) {
      context.updateState({
        inventory_stock_detail: inventory_stock_detail,
        sub_total: sub_total,
        net_total: net_total,
        net_payable: net_payable,
        total_tax: total_tax,
        detail_discount: detail_discount,
        saveEnable: saveEnable,
        authorizeBtn: false
      });
    }
  }
};

const dateFormater = ($this, value) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const onchangegridcol = ($this, row, e) => {
  //

  let name = e.name || e.target.name;
  let value =
    e.value === ""
      ? null
      : e.value || e.target.value === ""
      ? null
      : e.target.value;
  if (parseFloat(value) > parseFloat(row.total_quantity)) {
    swalMessage({
      title: "Authorize Quantity cannot be greater than Ordered Quantity.",
      type: "warning"
    });
  } else if (parseFloat(value) < 0) {
    swalMessage({
      title: "Authorize Quantity cannot be less than Zero.",
      type: "warning"
    });
  } else {
    if (value !== null) {
      row[name] = value;
      row["quantity_outstanding"] = value;
      row["rejected_quantity"] = row.total_quantity - value;
      row.update();
      onchhangegriddiscount($this, row, e);
    } else {
      row[name] = value;
      row["quantity_outstanding"] = value;
      row["rejected_quantity"] = value;
      row.update();
    }
  }
};

const onchhangegriddiscount = ($this, row, e) => {
  //

  let sub_discount_percentage = 0;
  let sub_discount_amount = 0;
  let extended_cost = 0;

  let tax_amount = 0;

  let extended_price = row.extended_price;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let discount_amount = 0;
  if (name === "sub_discount_percentage") {
    sub_discount_percentage = value === "" ? "" : parseFloat(value);

    sub_discount_amount =
      value === ""
        ? 0
        : (parseFloat(extended_price) * sub_discount_percentage) / 100;
    discount_amount = sub_discount_amount;
  } else if (name === "sub_discount_amount") {
    sub_discount_amount = value === "" ? "" : parseFloat(value);
    discount_amount = value === "" ? 0 : parseFloat(value);
    sub_discount_percentage =
      value === ""
        ? 0
        : (sub_discount_amount / parseFloat(extended_price)) * 100;
    sub_discount_percentage = math.round(sub_discount_percentage, 3);
  } else {
    extended_price =
      parseFloat(row.authorize_quantity) * parseFloat(row.unit_price);
    sub_discount_percentage = row.sub_discount_percentage;

    sub_discount_amount =
      (parseFloat(extended_price) * parseFloat(sub_discount_percentage)) / 100;
  }
  if (sub_discount_percentage > 100) {
    swalMessage({
      title: "Discount % cannot be greater than 100.",
      type: "warning"
    });
  } else if (sub_discount_percentage < 0) {
    swalMessage({
      title: "Cannot be less than 0.",
      type: "warning"
    });
  } else {
    //

    extended_cost = parseFloat(extended_price) - parseFloat(discount_amount);
    row["unit_cost"] =
      $this.state.hims_f_procurement_po_header_id !== null
        ? extended_cost / parseFloat(row.authorize_quantity)
        : extended_cost / parseFloat(row.total_quantity);

    tax_amount = (extended_cost * parseFloat(row.tax_percentage)) / 100;
    tax_amount = getAmountFormart(tax_amount, { appendSymbol: false });
    // extended_cost = getAmountFormart(extended_cost, { appendSymbol: false });

    row["extended_cost"] = getAmountFormart(extended_cost, {
      appendSymbol: false
    });
    row["tax_amount"] = (extended_cost * parseFloat(row.tax_percentage)) / 100;
    row["total_amount"] = parseFloat(tax_amount) + parseFloat(extended_cost);

    row["sub_discount_percentage"] = sub_discount_percentage;
    row["sub_discount_amount"] = sub_discount_amount;
    // row["extended_cost"] = extended_cost;
    row["net_extended_cost"] = getAmountFormart(extended_cost, {
      appendSymbol: false
    });
    row.update();
  }
};

const AssignData = $this => {
  if ($this.state.sub_discount_percentage === "") {
    $this.setState({
      sub_discount_percentage: 0
    });
  } else if ($this.state.sub_discount_amount === "") {
    $this.setState({
      sub_discount_amount: 0
    });
  }
};

const GridAssignData = ($this, row) => {
  if (row.sub_discount_percentage === "") {
    row["sub_discount_percentage"] = 0;
  } else if (row.sub_discount_amount === "") {
    row["sub_discount_amount"] = 0;
  }
  row.update();
};

const EditGrid = ($this, context, cancelRow) => {
  if (context !== null) {
    context.updateState({
      saveEnable: true,
      authorizeBtn: true
    });
  }
};

const CancelGrid = ($this, context, cancelRow) => {
  let saveEnable = false;
  let authorizeBtn = true;

  let _pharmacy_stock_detail =
    $this.state.po_from === "PHR"
      ? $this.state.pharmacy_stock_detail
      : $this.state.inventory_stock_detail;

  let _inventory_stock_detail =
    $this.state.po_from === "PHR"
      ? $this.state.pharmacy_stock_detail
      : $this.state.inventory_stock_detail;
  if (cancelRow !== undefined) {
    if ($this.state.po_from === "PHR") {
      _pharmacy_stock_detail[cancelRow.rowIdx] = cancelRow;
    } else {
      _inventory_stock_detail[cancelRow.rowIdx] = cancelRow;
    }
  }

  if ($this.state.hims_f_procurement_po_header_id !== null) {
    saveEnable = true;
    authorizeBtn = false;
  }

  if (context !== null) {
    context.updateState({
      saveEnable: saveEnable,
      addItemButton: !$this.state.addItemButton,
      pharmacy_stock_detail: _pharmacy_stock_detail,
      inventory_stock_detail: _inventory_stock_detail,
      authorizeBtn: authorizeBtn
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

export {
  texthandle,
  discounthandle,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  deletePODetail,
  updatePODetail,
  dateFormater,
  onchangegridcol,
  unitpricenumberchangeTexts,
  assignDataandclear,
  onchhangegriddiscount,
  AssignData,
  GridAssignData,
  EditGrid,
  CancelGrid,
  gridNumHandler
};
