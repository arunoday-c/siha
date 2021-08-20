import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";
import Options from "../../../../Options.json";

let texthandlerInterval = null;

const texthandle = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
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

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if ($this.state.order_quantity <= 0) {
    $this.setState({
      [name]: 0,
    });
    swalMessage({
      title: "Please Enter Quantity",
      type: "warning",
    });
  } else {
    let sub_discount_percentage = 0;
    let sub_discount_amount = 0;
    let extended_cost = 0;
    let unit_cost = 0;
    let tax_amount = 0;
    let total_amount = 0;
    if (name === "sub_discount_percentage") {
      sub_discount_percentage = value === "" ? "" : parseFloat(value);
      sub_discount_amount =
        value === ""
          ? 0
          : (parseFloat($this.state.extended_price) * sub_discount_percentage) /
            100;
    } else {
      sub_discount_amount = value === "" ? "" : parseFloat(value);
      sub_discount_percentage =
        value === ""
          ? 0
          : (sub_discount_amount / parseFloat($this.state.extended_price)) *
            100;

      sub_discount_percentage = sub_discount_percentage.toFixed(3);
    }
    if (sub_discount_percentage > 100) {
      swalMessage({
        title: "Discount % cannot be greater than 100.",
        type: "warning",
      });
      $this.setState({
        sub_discount_percentage: $this.state.sub_discount_percentage,
      });
    } else {
      extended_cost =
        parseFloat($this.state.extended_price) - sub_discount_amount;
      unit_cost = extended_cost / parseFloat($this.state.order_quantity);

      tax_amount =
        (extended_cost * parseFloat($this.state.tax_percentage)) / 100;
      total_amount = tax_amount + extended_cost;

      sub_discount_amount = GetAmountFormart(sub_discount_amount, {
        appendSymbol: false,
      });
      extended_cost = GetAmountFormart(extended_cost, { appendSymbol: false });
      unit_cost = GetAmountFormart(unit_cost, { appendSymbol: false });
      tax_amount = GetAmountFormart(tax_amount, { appendSymbol: false });
      total_amount = GetAmountFormart(total_amount, { appendSymbol: false });

      $this.setState({
        sub_discount_percentage: sub_discount_percentage,
        sub_discount_amount: sub_discount_amount,
        extended_cost: extended_cost,
        net_extended_cost: extended_cost,
        unit_cost: unit_cost,
        tax_amount: tax_amount,
        total_amount: total_amount,
      });

      if (context !== null) {
        context.updateState({
          sub_discount_percentage: sub_discount_percentage,
          sub_discount_amount: sub_discount_amount,
          extended_cost: extended_cost,
          net_extended_cost: extended_cost,
          unit_cost: unit_cost,
          tax_amount: tax_amount,
          total_amount: total_amount,
        });
      }
    }
  }
};

const numberchangeTexts = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if (name === "quantity") {
    if (parseFloat(value) < 0) {
      swalMessage({
        title: "Quantity cannot be less than or equal to Zero",
        type: "warning",
      });
    } else if (parseFloat(value) > parseFloat($this.state.qtyhand)) {
      swalMessage({
        title: "Quantity cannot be greater than Quantity in hand",
        type: "warning",
      });
    } else {
      $this.setState({ [name]: value });

      if (context !== undefined) {
        context.updateState({
          [name]: value,
        });
      }
    }
  } else {
    $this.setState({ [name]: value });
    if (context !== undefined) {
      context.updateState({
        [name]: value,
      });
    }
  }
};

const unitpricenumberchangeTexts = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (value < 0) {
    swalMessage({
      title: "Cannot be less than Zero",
      type: "warning",
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
      total_amount: total_amount,
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
          total_amount: total_amount,
        });
      }
      clearInterval(texthandlerInterval);
    }, 500);
  }
};

const itemchangeText = ($this, context, e, ctrl) => {
  debugger;
  let name = ctrl;

  if (
    $this.state.pharmcy_location_id !== null ||
    $this.state.inventory_location_id !== null
  ) {
    // if ($this.state.return_items !== "D" || $this.state.vendor_id !== null) {
    let value =
      $this.state.po_return_from === "PHR"
        ? e.hims_d_item_master_id
        : e.hims_d_inventory_item_master_id;

    if ($this.state.po_return_from === "PHR") {
      algaehApiCall({
        uri: "/pharmacyGlobal/getUomLocationStock",
        module: "pharmacy",
        method: "GET",
        data: {
          location_id: $this.state.pharmcy_location_id,
          item_id: value,
          return_items: $this.state.return_items,
        },
        onSuccess: (response) => {
          if (response.data.success) {
            let data = response.data.records;
            if (data.locationResult.length > 0) {
              const qtyhand = parseFloat(data.locationResult[0].qtyhand);

              $this.setState({
                [name]: value,
                item_category: e.category_id,
                uom_id: e.stocking_uom_id,
                service_id: e.service_id,
                item_group_id: e.group_id,
                quantity: 0,
                expiry_date: data.locationResult[0].expirydt,
                batchno: data.locationResult[0].batchno,
                vendor_batchno: data.locationResult[0].vendor_batchno,
                qtyhand: qtyhand,
                barcode: data.locationResult[0].barcode,
                ItemUOM: data.uomResult,
                Batch_Items: data.locationResult,
                addItemButton: false,
                item_description: e.item_description,
                sales_uom_id: e.sales_uom_id,
                uom_description: e.stk_uom_description,
                stocking_uom: e.stocking_uom,
                sales_price: e.sale_price,
                unit_cost: data.locationResult[0].avgcost,
              });

              if (context !== undefined) {
                context.updateState({
                  [name]: value,
                  item_category: e.category_id,
                  uom_id: e.stocking_uom_id,
                  service_id: e.service_id,
                  item_group_id: e.group_id,
                  quantity: 0,

                  expiry_date: data.locationResult[0].expirydt,
                  batchno: data.locationResult[0].batchno,
                  vendor_batchno: data.locationResult[0].vendor_batchno,
                  qtyhand: qtyhand,
                  barcode: data.locationResult[0].barcode,
                  ItemUOM: data.uomResult,
                  Batch_Items: data.locationResult,
                  addItemButton: false,
                  item_description: e.item_description,
                  sales_uom_id: e.sales_uom_id,
                  uom_description: e.stk_uom_description,
                  stocking_uom: e.stocking_uom,
                  sales_price: e.sale_price,
                  unit_cost: data.locationResult[0].avgcost,
                  dataAdded: true,
                });
              }
            } else {
              swalMessage({
                title: "No stock available for selected Item.",
                type: "warning",
              });
              $this.setState({
                item_description: $this.state.item_description,
                item_id: $this.state.item_id,
              });
              if (context !== undefined) {
                context.updateState({
                  item_description: $this.state.item_description,
                  item_id: $this.state.item_id,
                });
              }
            }
          } else {
            swalMessage({
              title: response.data.message,
              type: "error",
            });
          }
        },
        onFailure: (error) => {
          swalMessage({
            title: error.message,
            type: "error",
          });
        },
      });
    } else {
      algaehApiCall({
        uri: "/inventoryGlobal/getUomLocationStock",
        module: "inventory",
        method: "GET",
        data: {
          location_id: $this.state.inventory_location_id,
          item_id: value,
          return_items: $this.state.return_items,
        },
        onSuccess: (response) => {
          if (response.data.success) {
            let data = response.data.records;
            if (data.locationResult.length > 0) {
              const qtyhand = parseFloat(data.locationResult[0].qtyhand);

              $this.setState({
                [name]: value,
                item_category: e.category_id,
                uom_id: e.sales_uom_id,
                service_id: e.service_id,
                item_group_id: e.group_id,
                quantity: 0,
                expiry_date: data.locationResult[0].expirydt,
                batchno: data.locationResult[0].batchno,
                grn_no: data.locationResult[0].grnno,
                vendor_batchno: data.locationResult[0].vendor_batchno,
                qtyhand: qtyhand,
                barcode: data.locationResult[0].barcode,
                ItemUOM: data.uomResult,
                Batch_Items: data.locationResult,
                addItemButton: false,
                item_description: e.item_description,
                sales_uom_id: e.sales_uom_id,
                uom_description: e.uom_description,
                stocking_uom: e.stocking_uom,
                sales_price: e.sale_price,
                unit_cost: data.locationResult[0].avgcost,
              });

              if (context !== undefined) {
                context.updateState({
                  [name]: value,
                  item_category: e.category_id,
                  uom_id: e.sales_uom_id,
                  service_id: e.service_id,
                  item_group_id: e.group_id,
                  quantity: 0,
                  expiry_date: data.locationResult[0].expirydt,
                  batchno: data.locationResult[0].batchno,
                  grn_no: data.locationResult[0].grnno,
                  qtyhand: qtyhand,
                  barcode: data.locationResult[0].barcode,
                  ItemUOM: data.uomResult,
                  Batch_Items: data.locationResult,
                  addItemButton: false,
                  item_description: e.item_description,
                  sales_uom_id: e.sales_uom_id,
                  uom_description: e.uom_description,
                  stocking_uom: e.stocking_uom,
                  sales_price: e.sale_price,
                  unit_cost: data.locationResult[0].avgcost,
                  dataAdded: true,
                });
              }
            } else {
              swalMessage({
                title: "No stock available for selected Item.",
                type: "warning",
              });
              $this.setState({
                item_description: $this.state.item_description,
                item_id: $this.state.item_id,
              });
              if (context !== undefined) {
                context.updateState({
                  item_description: $this.state.item_description,
                  item_id: $this.state.item_id,
                });
              }
            }
          } else {
            swalMessage({
              title: response.data.message,
              type: "error",
            });
          }
        },
        onFailure: (error) => {
          swalMessage({
            title: error.message,
            type: "error",
          });
        },
      });
    }
    // } else {
    //   $this.setState(
    //     {
    //       [name]: null,
    //     },
    //     () => {
    //       swalMessage({
    //         title: "Please select Vendor.",
    //         type: "warning",
    //       });
    //     }
    //   );
    // }
  } else {
    $this.setState(
      {
        [name]: null,
      },
      () => {
        swalMessage({
          title: "Please select Location.",
          type: "warning",
        });
      }
    );
  }
};

const AddItems = ($this, context) => {
  if (parseFloat($this.state.quantity) <= 0) {
    swalMessage({
      title: "Enter the Quantity",
      type: "warning",
    });
    return;
  }

  debugger;
  let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
  let inventory_stock_detail = $this.state.inventory_stock_detail;

  let sub_total = 0;
  let net_total = 0;
  let discount_amount = 0;
  let return_total = 0,
    tax_amount = 0;

  let BatchExists = [];
  let ItemBatchInput = {};
  if ($this.state.po_return_from === "PHR") {
    BatchExists = pharmacy_stock_detail.filter(
      (f) => f.batchno === $this.state.batchno
    );

    if (BatchExists.length > 0) {
      swalMessage({
        title: "Selected Batch Already Exists",
        type: "warning",
      });
      return;
    }
    const extended_cost =
      parseFloat($this.state.quantity) * parseFloat($this.state.unit_cost);

    ItemBatchInput = {
      phar_item_id: $this.state.phar_item_id,
      phar_item_category: $this.state.item_category,
      phar_item_group: $this.state.item_group_id,
      batchno: $this.state.batchno,
      vendor_batchno: $this.state.vendor_batchno,
      grnno: $this.state.grn_no,
      expiry_date: $this.state.expiry_date,
      barcode: $this.state.barcode,
      sales_uom: $this.state.sales_uom_id,
      uom_description: $this.state.uom_description,
      unit_cost: $this.state.unit_cost,
      pharmacy_uom_id: $this.state.uom_id,
      item_description: $this.state.item_description,
      qtyhand: $this.state.qtyhand,
      return_qty: $this.state.quantity,
      dn_quantity: 0,
      extended_cost: extended_cost,
      discount_percentage: 0,
      discount_amount: 0,
      net_extended_cost: extended_cost,
      tax_percentage: 0,
      tax_amount: 0,
      total_amount: extended_cost,
    };
    pharmacy_stock_detail.push(ItemBatchInput);
    if (pharmacy_stock_detail.length > 0) {
      sub_total = Enumerable.from(pharmacy_stock_detail).sum((s) =>
        parseFloat(s.extended_cost)
      );

      discount_amount = Enumerable.from(pharmacy_stock_detail).sum((s) =>
        parseFloat(s.discount_amount)
      );

      net_total = Enumerable.from(pharmacy_stock_detail).sum((s) =>
        parseFloat(s.net_extended_cost)
      );

      tax_amount = Enumerable.from(pharmacy_stock_detail).sum((s) =>
        parseFloat(s.tax_amount)
      );

      return_total = Enumerable.from(pharmacy_stock_detail).sum((s) =>
        parseFloat(s.total_amount)
      );
    } else {
      sub_total = 0;
      discount_amount = 0;
      net_total = 0;
      tax_amount = 0;
      return_total = 0;
    }
  } else {
    BatchExists = inventory_stock_detail.filter(
      (f) => f.batchno === $this.state.batchno
    );

    if (BatchExists.length > 0) {
      swalMessage({
        title: "Selected Batch Already Exists",
        type: "warning",
      });
      return;
    }

    const extended_cost =
      parseFloat($this.state.quantity) * parseFloat($this.state.unit_cost);

    ItemBatchInput = {
      inv_item_id: $this.state.inv_item_id,
      inv_item_category_id: $this.state.item_category,
      inv_item_group_id: $this.state.item_group_id,
      batchno: $this.state.batchno,
      vendor_batchno: $this.state.vendor_batchno,
      grnno: $this.state.grn_no,
      expiry_date: $this.state.expiry_date,
      barcode: $this.state.barcode,
      sales_uom: $this.state.sales_uom_id,
      uom_description: $this.state.uom_description,
      unit_cost: $this.state.unit_cost,
      inventory_uom_id: $this.state.uom_id,
      item_description: $this.state.item_description,
      qtyhand: $this.state.qtyhand,
      return_qty: $this.state.quantity,
      dn_quantity: 0,
      extended_cost: extended_cost,
      discount_percentage: 0,
      discount_amount: 0,
      net_extended_cost: extended_cost,
      tax_percentage: 0,
      tax_amount: 0,
      total_amount: extended_cost,
    };
    inventory_stock_detail.push(ItemBatchInput);
    if (inventory_stock_detail.length > 0) {
      sub_total = Enumerable.from(inventory_stock_detail).sum((s) =>
        parseFloat(s.extended_cost)
      );

      discount_amount = Enumerable.from(inventory_stock_detail).sum((s) =>
        parseFloat(s.discount_amount)
      );

      net_total = Enumerable.from(inventory_stock_detail).sum((s) =>
        parseFloat(s.net_extended_cost)
      );

      tax_amount = Enumerable.from(inventory_stock_detail).sum((s) =>
        parseFloat(s.tax_amount)
      );

      return_total = Enumerable.from(inventory_stock_detail).sum((s) =>
        parseFloat(s.total_amount)
      );
    } else {
      sub_total = 0;
      discount_amount = 0;
      net_total = 0;
      tax_amount = 0;
      return_total = 0;
    }
  }

  $this.setState({
    pharmacy_stock_detail: pharmacy_stock_detail,
    item_id: null,
    item_category: null,
    uom_id: null,
    item_group_id: null,
    quantity: 0,

    expiry_date: null,
    batchno: null,
    grn_no: null,
    qtyhand: null,
    barcode: null,
    ItemUOM: [],
    Batch_Items: [],
    addItemButton: true,
    item_description: "",
    saveEnable: false,
    uom_description: null,

    sub_total: sub_total,
    discount_amount: discount_amount,
    net_total: net_total,
    tax_amount: tax_amount,
    return_total: return_total,
  });

  if (context !== undefined) {
    context.updateState({
      pharmacy_stock_detail: pharmacy_stock_detail,
      item_id: null,
      item_category: null,
      uom_id: null,
      item_group_id: null,
      quantity: 0,

      expiry_date: null,
      batchno: null,
      grn_no: null,
      qtyhand: null,
      barcode: null,
      ItemUOM: [],
      Batch_Items: [],
      addItemButton: true,
      item_description: "",
      saveEnable: false,
      uom_description: null,

      sub_total: sub_total,
      discount_amount: discount_amount,
      net_total: net_total,
      tax_amount: tax_amount,
      return_total: return_total,
    });
  }
};

const assignDataandclear = ($this, context, stock_detail, assignData) => {
  let sub_total = Enumerable.from(stock_detail).sum((s) =>
    parseFloat(s.extended_price)
  );

  let net_total = Enumerable.from(stock_detail).sum((s) =>
    parseFloat(s.net_extended_cost)
  );

  let net_payable = Enumerable.from(stock_detail).sum((s) =>
    parseFloat(s.total_amount)
  );

  let total_tax = Enumerable.from(stock_detail).sum((s) =>
    parseFloat(s.tax_amount)
  );

  let detail_discount = Enumerable.from(stock_detail).sum((s) =>
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
    addItemButton: true,
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
      addItemButton: true,
    });
  }
};

const deletePOReturnDetail = ($this, context, row) => {
  let sub_total = 0;
  let net_total = 0;
  let discount_amount = 0;
  let return_total = 0,
    tax_amount = 0;

  if ($this.state.po_return_from === "PHR") {
    let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;

    pharmacy_stock_detail.splice(row.rowIdx, 1);

    if (pharmacy_stock_detail.length > 0) {
      sub_total = Enumerable.from(pharmacy_stock_detail).sum((s) =>
        parseFloat(s.extended_cost)
      );

      discount_amount = Enumerable.from(pharmacy_stock_detail).sum((s) =>
        parseFloat(s.discount_amount)
      );

      net_total = Enumerable.from(pharmacy_stock_detail).sum((s) =>
        parseFloat(s.net_extended_cost)
      );

      tax_amount = Enumerable.from(pharmacy_stock_detail).sum((s) =>
        parseFloat(s.tax_amount)
      );

      return_total = Enumerable.from(pharmacy_stock_detail).sum((s) =>
        parseFloat(s.total_amount)
      );
    } else {
      sub_total = 0;
      discount_amount = 0;
      net_total = 0;
      tax_amount = 0;
      return_total = 0;
    }

    $this.setState({
      pharmacy_stock_detail: pharmacy_stock_detail,
      sub_total: sub_total,
      discount_amount: discount_amount,
      net_total: net_total,
      tax_amount: tax_amount,
      return_total: return_total,
    });

    if (context !== undefined) {
      context.updateState({
        pharmacy_stock_detail: pharmacy_stock_detail,
        sub_total: sub_total,
        discount_amount: discount_amount,
        net_total: net_total,
        tax_amount: tax_amount,
        return_total: return_total,
        saveEnable: pharmacy_stock_detail.length > 0 ? false : true,
      });
    }
  } else {
    let inventory_stock_detail = $this.state.inventory_stock_detail;

    inventory_stock_detail.splice(row.rowIdx, 1);

    if (inventory_stock_detail.length > 0) {
      sub_total = Enumerable.from(inventory_stock_detail).sum((s) =>
        parseFloat(s.extended_cost)
      );

      discount_amount = Enumerable.from(inventory_stock_detail).sum((s) =>
        parseFloat(s.discount_amount)
      );

      net_total = Enumerable.from(inventory_stock_detail).sum((s) =>
        parseFloat(s.net_extended_cost)
      );

      tax_amount = Enumerable.from(inventory_stock_detail).sum((s) =>
        parseFloat(s.tax_amount)
      );

      return_total = Enumerable.from(inventory_stock_detail).sum((s) =>
        parseFloat(s.total_amount)
      );
    } else {
      sub_total = 0;
      discount_amount = 0;
      net_total = 0;
      tax_amount = 0;
      return_total = 0;
    }

    if (context !== undefined) {
      context.updateState({
        inventory_stock_detail: inventory_stock_detail,
        sub_total: sub_total,
        discount_amount: discount_amount,
        net_total: net_total,
        tax_amount: tax_amount,
        return_total: return_total,
        saveEnable: inventory_stock_detail.length > 0 ? false : true,
      });
    }
  }
};

const dateFormater = ($this, value) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const onchangegridcol = ($this, context, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let _stock_detail =
    $this.state.po_return_from === "PHR"
      ? $this.state.pharmacy_stock_detail
      : $this.state.inventory_stock_detail;
  let _index = _stock_detail.indexOf(row);

  // IU.conversion_factor
  if (name === "return_qty") {
    if (parseFloat(value) > parseFloat(row.qtyhand)) {
      swalMessage({
        title:
          "Return Quantity cannot be Greater than Qty In Hand / Deliverd Quantity.",
        type: "warning",
      });
      return;
    } else if (parseFloat(value) < 0) {
      swalMessage({
        title: "Return Quantity cannot be less than Zero.",
        type: "warning",
      });
      return;
    }
  }
  row[name] = value;
  _stock_detail[_index] = row;
  if ($this.state.po_return_from === "PHR") {
    $this.setState({
      pharmacy_stock_detail: _stock_detail,
    });
    if (context !== undefined) {
      context.updateState({
        pharmacy_stock_detail: _stock_detail,
      });
    }
    onchhangegriddiscount($this, context, row, e);
  } else {
    $this.setState({
      inventory_stock_detail: _stock_detail,
    });
    if (context !== undefined) {
      context.updateState({
        inventory_stock_detail: _stock_detail,
      });
    }
    onchhangegriddiscount($this, context, row, e);
  }
};

const onchhangegriddiscount = ($this, context, row, e) => {
  let extended_cost = 0;

  let _stock_detail =
    $this.state.po_return_from === "PHR"
      ? $this.state.pharmacy_stock_detail
      : $this.state.inventory_stock_detail;
  let _index = _stock_detail.indexOf(row);

  extended_cost = (
    parseFloat(row.return_qty) * parseFloat(row.unit_cost)
  ).toFixed($this.state.decimal_places);
  debugger;
  row["extended_cost"] = parseFloat(extended_cost);
  row["discount_amount"] = (
    (parseFloat(extended_cost) * parseFloat(row.discount_percentage)) /
    100
  ).toFixed($this.state.decimal_places);

  row["net_extended_cost"] =
    parseFloat(extended_cost) - parseFloat(row["discount_amount"]);

  row["tax_amount"] = (
    (parseFloat(row["net_extended_cost"]) * parseFloat(row.tax_percentage)) /
    100
  ).toFixed($this.state.decimal_places);
  row["total_amount"] =
    parseFloat(row["tax_amount"]) + parseFloat(row["net_extended_cost"]);

  _stock_detail[_index] = row;

  if ($this.state.po_return_from === "PHR") {
    $this.setState({
      pharmacy_stock_detail: _stock_detail,
    });
    if (context !== undefined) {
      context.updateState({
        pharmacy_stock_detail: _stock_detail,
      });
    }
    calculateHeadervalues($this, context, row);
  } else {
    $this.setState({
      inventory_stock_detail: _stock_detail,
    });
    if (context !== undefined) {
      context.updateState({
        inventory_stock_detail: _stock_detail,
      });
    }
    calculateHeadervalues($this, context, row);
  }
};

const calculateHeadervalues = ($this, context, row) => {
  if ($this.state.po_return_from === "PHR") {
    let pharmacy_stock_detail = $this.state.pharmacy_stock_detail;
    let _index = pharmacy_stock_detail.indexOf(row);

    pharmacy_stock_detail[_index] = row;

    let sub_total = Enumerable.from(pharmacy_stock_detail).sum((s) =>
      parseFloat(s.extended_cost)
    );

    let discount_amount = Enumerable.from(pharmacy_stock_detail).sum((s) =>
      parseFloat(s.discount_amount)
    );

    let net_total = Enumerable.from(pharmacy_stock_detail).sum((s) =>
      parseFloat(s.net_extended_cost)
    );

    let tax_amount = Enumerable.from(pharmacy_stock_detail).sum((s) =>
      parseFloat(s.tax_amount)
    );

    let return_total = Enumerable.from(pharmacy_stock_detail).sum((s) =>
      parseFloat(s.total_amount)
    );

    $this.setState({
      pharmacy_stock_detail: pharmacy_stock_detail,
      sub_total: sub_total,
      discount_amount: discount_amount,
      net_total: net_total,
      tax_amount: tax_amount,
      return_total: return_total,
    });

    if (context !== undefined) {
      context.updateState({
        pharmacy_stock_detail: pharmacy_stock_detail,
        sub_total: sub_total,
        discount_amount: discount_amount,
        net_total: net_total,
        tax_amount: tax_amount,
        return_total: return_total,
      });
    }
  } else {
    let inventory_stock_detail = $this.state.inventory_stock_detail;
    let _index = inventory_stock_detail.indexOf(row);
    inventory_stock_detail[_index] = row;

    let sub_total = Enumerable.from(inventory_stock_detail).sum((s) =>
      parseFloat(s.extended_cost)
    );

    let discount_amount = Enumerable.from(inventory_stock_detail).sum((s) =>
      parseFloat(s.discount_amount)
    );

    let net_total = Enumerable.from(inventory_stock_detail).sum((s) =>
      parseFloat(s.net_extended_cost)
    );

    let tax_amount = Enumerable.from(inventory_stock_detail).sum((s) =>
      parseFloat(s.tax_amount)
    );

    let return_total = Enumerable.from(inventory_stock_detail).sum((s) =>
      parseFloat(s.total_amount)
    );

    $this.setState({
      inventory_stock_detail: inventory_stock_detail,
      sub_total: sub_total,
      discount_amount: discount_amount,
      net_total: net_total,
      tax_amount: tax_amount,
      return_total: return_total,
    });

    if (context !== undefined) {
      context.updateState({
        inventory_stock_detail: inventory_stock_detail,
        sub_total: sub_total,
        discount_amount: discount_amount,
        net_total: net_total,
        tax_amount: tax_amount,
        return_total: return_total,
      });
    }
  }
};

const AssignData = ($this) => {
  if ($this.state.sub_discount_percentage === "") {
    $this.setState({
      sub_discount_percentage: 0,
    });
  } else if ($this.state.sub_discount_amount === "") {
    $this.setState({
      sub_discount_amount: 0,
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

const gridNumHandler = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (parseFloat(value) > parseFloat(row.total_quantity)) {
    swalMessage({
      title: "Authorize Quantity cannot be greater than Ordered Quantity.",
      type: "warning",
    });
  } else if (value < 0) {
    swalMessage({
      title: "Authorize Quantity cannot be less than Zero",
      type: "warning",
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
      total_amount: total_amount,
    });
  }
};

const ShowItemBatch = ($this, e) => {
  $this.setState({
    ...$this.state,
    selectBatch: !$this.state.selectBatch,
  });
};

const CloseItemBatch = ($this, context, e) => {
  let batchno =
    e !== undefined
      ? e.selected === true
        ? e.batchno
        : $this.state.batchno
      : $this.state.batchno;
  let expiry_date =
    e !== undefined
      ? e.selected === true
        ? moment(e.expirydt)._d
        : $this.state.expiry_date
      : $this.state.expiry_date;

  let grn_no =
    e !== undefined
      ? e.selected === true
        ? e.grnno
        : $this.state.grn_no
      : $this.state.grn_no;
  let qtyhand =
    e !== undefined
      ? e.selected === true
        ? e.qtyhand
        : $this.state.qtyhand
      : $this.state.qtyhand;

  let sale_price =
    e !== undefined
      ? e.selected === true
        ? e.sale_price
        : $this.state.unit_cost
      : $this.state.unit_cost;
  let uom_description =
    e !== undefined
      ? e.selected === true
        ? e.uom_description
        : $this.state.uom_description
      : $this.state.uom_description;

  let uom_id =
    e !== undefined
      ? e.selected === true
        ? e.sales_uom
        : $this.state.uom_id
      : $this.state.uom_id;

  let average_cost =
    e !== undefined
      ? e.selected === true
        ? e.avgcost
        : $this.state.average_cost
      : $this.state.average_cost;

  let quantity =
    e !== undefined
      ? e.selected === true
        ? 0
        : $this.state.quantity
      : $this.state.quantity;

  $this.setState({
    ...$this.state,
    selectBatch: !$this.state.selectBatch,
    batchno: batchno,
    expiry_date: expiry_date,
    grn_no: grn_no,
    qtyhand: qtyhand,
    uom_id: uom_id,
    unit_cost: sale_price,
    uom_description: uom_description,
    average_cost: average_cost,
    quantity: quantity,
  });

  if (context !== null) {
    context.updateState({
      batchno: batchno,
      expiry_date: expiry_date,
      grn_no: grn_no,
      qtyhand: qtyhand,
      uom_id: uom_id,
      unit_cost: sale_price,
      uom_description: uom_description,
      average_cost: average_cost,
      quantity: quantity,
    });
  }
};

export {
  texthandle,
  discounthandle,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  deletePOReturnDetail,
  dateFormater,
  onchangegridcol,
  unitpricenumberchangeTexts,
  assignDataandclear,
  onchhangegriddiscount,
  AssignData,
  GridAssignData,
  gridNumHandler,
  ShowItemBatch,
  CloseItemBatch,
};
