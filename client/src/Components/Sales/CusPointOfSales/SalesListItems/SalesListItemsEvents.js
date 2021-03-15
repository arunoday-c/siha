import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";
import Options from "../../../../Options.json";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import _ from "lodash";

const UomchangeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if ($this.state.uom_id !== value) {
    let unit_cost = 0;

    if ($this.state.sales_uom_id === $this.state.stocking_uom_id) {
      if (
        parseFloat($this.state.sales_conversion_factor) ===
        parseFloat(e.selected.conversion_factor)
      ) {
        unit_cost = $this.state.Real_unit_cost;
      } else if (
        parseFloat($this.state.sales_conversion_factor) >
        parseFloat(e.selected.conversion_factor)
      ) {
        unit_cost =
          parseFloat($this.state.Real_unit_cost) /
          parseFloat($this.state.sales_conversion_factor);
      } else {
        unit_cost =
          parseFloat(e.selected.conversion_factor) *
          parseFloat($this.state.Real_unit_cost);
      }
    } else {
      if (
        parseFloat($this.state.sales_conversion_factor) ===
        parseFloat(e.selected.conversion_factor)
      ) {
        unit_cost = $this.state.Real_unit_cost;
      } else if (
        parseFloat($this.state.sales_conversion_factor) >
        parseFloat(e.selected.conversion_factor)
      ) {
        unit_cost =
          parseFloat($this.state.Real_unit_cost) /
          parseFloat($this.state.sales_conversion_factor);
      } else {
        unit_cost =
          parseFloat(e.selected.conversion_factor) *
          parseFloat($this.state.Real_unit_cost);
      }
    }

    $this.setState({
      [name]: value,
      conversion_factor: e.selected.conversion_factor,
      unit_cost: unit_cost,
      uom_description: e.selected.text,
    });
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
    }
  } else if (name === "discount_percentage") {
    if (parseFloat(value) < 0) {
      swalMessage({
        title: "Discount % cannot be less than Zero",
        type: "warning",
      });
      $this.setState({ [name]: $this.state.discount_percentage });
      return;
    } else if (parseFloat(value) > 100) {
      swalMessage({
        title: "Discount % cannot be greater than 100.",
        type: "warning",
      });
      $this.setState({ [name]: $this.state.discount_percentage });
      return;
    } else {
      $this.setState({ [name]: value });
    }
  } else if (name === "unit_cost") {
    $this.setState({ [name]: value === undefined ? null : value });
  } else {
    $this.setState({ [name]: value });
  }
};

const itemchangeText = ($this, e, ctrl) => {
  let name = ctrl;
  if ($this.state.location_id !== null) {
    if (e.service_id !== null) {
      let value = e.hims_d_inventory_item_master_id;

      algaehApiCall({
        uri: "/inventoryGlobal/getUomLocationStock",
        module: "inventory",
        method: "GET",
        data: {
          location_id: $this.state.location_id,
          item_id: value,
        },
        onSuccess: (response) => {
          if (response.data.success) {
            let data = response.data.records;
            if (data.locationResult.length > 0) {
              debugger;
              // getUnitCost($this, context, e.service_id);
              $this.setState({
                [name]: value,
                item_category_id: e.category_id,
                uom_id: e.sales_uom_id,
                sales_uom: e.sales_uom_id,
                service_id: e.service_id,
                item_group_id: e.group_id,
                quantity: 1,
                expiry_date: data.locationResult[0].expirydt,
                batchno: data.locationResult[0].batchno,
                grn_no: data.locationResult[0].grnno,
                qtyhand: data.locationResult[0].qtyhand,
                barcode: data.locationResult[0].barcode,
                ItemUOM: data.uomResult,
                Batch_Items: data.locationResult,
                addItemButton: false,
                item_description: e.item_description,
                uom_description: e.uom_description,
                tax_percent: e.vat_percent,
                unit_cost: e.standard_fee,
                sales_price: e.standard_fee,
                average_cost: data.locationResult[0].avgcost,
              });

              // if (context !== undefined) {
              //   context.updateState({
              //     [name]: value,
              //     item_category: e.category_id,
              //     uom_id: e.sales_uom_id,
              //     service_id: e.service_id,
              //     item_group_id: e.group_id,
              //     quantity: 1,

              //     expiry_date: data.locationResult[0].expirydt,
              //     batchno: data.locationResult[0].batchno,
              //     grn_no: data.locationResult[0].grnno,
              //     qtyhand: data.locationResult[0].qtyhand,
              //     barcode: data.locationResult[0].barcode,
              //     ItemUOM: data.uomResult,
              //     Batch_Items: data.locationResult,
              //     addItemButton: false,
              //     item_description: e.item_description
              //   });
              // }
            } else {
              swalMessage({
                title: "No stock available for selected Item.",
                type: "warning",
              });
              $this.setState({
                item_description: $this.state.item_description,
                item_id: $this.state.item_id,
              });
              // if (context !== undefined) {
              //   context.updateState({
              //     item_description: $this.state.item_description,
              //     item_id: $this.state.item_id
              //   });
              // }
            }
          } else {
            swalMessage({
              title: response.data.message,
              type: "error",
            });
          }
          AlgaehLoader({ show: false });
        },
        onFailure: (error) => {
          AlgaehLoader({ show: false });
          swalMessage({
            title: error.message,
            type: "error",
          });
        },
      });
    } else {
      $this.setState(
        {
          [name]: null,
        },
        () => {
          swalMessage({
            title: "Hospital service not linked to this item, contact Admin.",
            type: "warning",
          });
        }
      );
    }
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

// const itemchangeText = ($this, e, ctrl) => {
//   AlgaehLoader({ show: true });
//   let name = ctrl;

//   let value = e.hims_d_inventory_item_master_id;

//   algaehApiCall({
//     uri: "/inventoryGlobal/getListUomSelectedItem",
//     module: "inventory",
//     method: "GET",
//     data: {
//       item_id: value,
//     },
//     onSuccess: (response) => {
//       if (response.data.success) {
//         let data = response.data.records;
//         if (data.length > 0) {
//           const sales_conversion_factor = _.find(
//             data,
//             (f) => f.uom_id === e.sales_uom_id
//           );

//           $this.setState({
//             [name]: value,
//             uom_id: e.sales_uom_id,
//             quantity: 1,
//             addItemButton: false,
//             item_description: e.item_description,
//             unit_cost: e.standard_fee,
//             Real_unit_cost: e.standard_fee,
//             uom_description: e.uom_description,
//             tax_percent: e.vat_percent,
//             ItemUOM: data,
//             sales_conversion_factor: sales_conversion_factor,
//             tax_percentage: e.vat_percent,
//           });
//         }
//       } else {
//         swalMessage({
//           title: response.data.message,
//           type: "error",
//         });
//       }
//       AlgaehLoader({ show: false });
//     },
//     onFailure: (error) => {
//       AlgaehLoader({ show: false });
//       swalMessage({
//         title: error.message,
//         type: "error",
//       });
//     },
//   });
// };

const AddItems = ($this, context) => {
  let itemData = Enumerable.from($this.state.inventory_stock_detail)
    .where(
      (w) =>
        w.item_id === $this.state.item_id && w.batchno === $this.state.batchno
    )
    .toArray();
  if ($this.state.item_id === null) {
    swalMessage({
      title: "Please Select Item.",
      type: "warning",
    });
    return;
  } else if (
    parseFloat($this.state.quantity) === 0 ||
    $this.state.quantity === ""
  ) {
    swalMessage({
      title: "Enter the Quantity.",
      type: "warning",
    });
    return;
  } else if ($this.state.uom_id === null) {
    swalMessage({
      title: "Enter the UOM.",
      type: "warning",
    });
    return;
  } else if (
    $this.state.unit_cost === null ||
    parseFloat($this.state.unit_cost) === 0
  ) {
    swalMessage({
      title: "Enter the Unit Cost.",
      type: "warning",
    });
    return;
  }
  if (itemData.length > 0) {
    swalMessage({
      title: "Selected Item already added in the list.",
      type: "warning",
    });
  } else {
    let inventory_stock_detail = $this.state.inventory_stock_detail;

    debugger;
    const extended_cost = (
      parseFloat($this.state.unit_cost) * parseFloat($this.state.quantity)
    ).toFixed($this.state.decimal_place);
    const discount_amount = (
      (parseFloat(extended_cost) *
        parseFloat($this.state.discount_percentage)) /
      100
    ).toFixed($this.state.decimal_place);
    const net_extended_cost = extended_cost - discount_amount;
    const tax_amount = (
      (parseFloat(net_extended_cost) * parseFloat($this.state.tax_percentage)) /
      100
    ).toFixed($this.state.decimal_place);

    const total_amount = parseFloat(net_extended_cost) + parseFloat(tax_amount);

    const ItemInput = {
      item_description: $this.state.item_description,
      item_group_id: $this.state.item_group_id,
      item_category_id: $this.state.item_category_id,
      item_id: $this.state.item_id,
      quantity: $this.state.quantity,
      ordered_quantity: $this.state.quantity,
      dispatch_quantity: $this.state.quantity,
      uom_id: $this.state.uom_id,
      sales_uom: $this.state.sales_uom,
      uom_description: $this.state.uom_description,
      batchno: $this.state.batchno,
      barcode: $this.state.barcode,
      expiry_date:
        $this.state.expiry_date === null
          ? null
          : moment($this.state.expiry_date).format("YYYY-MM-DD"),
      discount_percentage: $this.state.discount_percentage,
      unit_cost: $this.state.unit_cost,
      extended_cost: extended_cost,
      net_extended_cost: net_extended_cost,
      discount_amount: discount_amount,
      tax_percentage: $this.state.tax_percentage,
      tax_amount: tax_amount,
      total_amount: total_amount,
      quantity_outstanding: $this.state.quantity, //0
      sales_price: $this.state.unit_cost,
      average_cost: $this.state.average_cost,
      location_id: $this.state.location_id,
      location_type: $this.state.location_type,
      operation: "-",
    };
    inventory_stock_detail.push(ItemInput);

    const sub_total = _.sumBy(inventory_stock_detail, (s) =>
      parseFloat(s.extended_cost)
    );
    const h_discount_amount = _.sumBy(inventory_stock_detail, (s) =>
      parseFloat(s.discount_amount)
    );
    const net_total = _.sumBy(inventory_stock_detail, (s) =>
      parseFloat(s.net_extended_cost)
    );

    const total_tax = _.sumBy(inventory_stock_detail, (s) =>
      parseFloat(s.tax_amount)
    );

    const net_payable = _.sumBy(inventory_stock_detail, (s) =>
      parseFloat(s.total_amount)
    );

    $this.setState({
      inventory_stock_detail: inventory_stock_detail,

      addItemButton: true,
      item_description: "",
      addedItem: true,

      item_id: null,
      quantity: 0,
      uom_id: null,
      uom_description: null,
      discount_percentage: 0,
      unit_cost: 0,
      tax_percent: 0,
      batchno: null,
      expiry_date: null,
      qtyhand: 0,
    });

    if (context !== undefined) {
      context.updateState({
        inventory_stock_detail: inventory_stock_detail,
        saveEnable: false,
        sub_total: sub_total,
        discount_amount: h_discount_amount,
        net_total: net_total,
        total_tax: total_tax,
        net_payable: net_payable,
      });
    }
  }
};

const deleteSalesDetail = ($this, context, row) => {
  let inventory_stock_detail = $this.state.inventory_stock_detail;
  const _index = inventory_stock_detail.indexOf(row);
  inventory_stock_detail.splice(_index, 1);
  // let delete_inventory_stock_detail = $this.state.delete_inventory_stock_detail;

  // if (row.hims_f_inventory_stock_detail_id !== null) {
  //   delete_inventory_stock_detail.push(row.hims_f_inventory_stock_detail_id);
  // }

  if (inventory_stock_detail.length === 0) {
    if (context !== undefined) {
      context.updateState({
        inventory_stock_detail: inventory_stock_detail,
        // delete_inventory_stock_detail: delete_inventory_stock_detail,
        discount_amount: 0,
        sub_total: 0,
        total_tax: 0,
        net_total: 0,
        net_payable: 0,
        saveEnable: true,
        authBtnEnable: true,
      });
    }
  } else {
    const sub_total = _.sumBy(inventory_stock_detail, (s) =>
      parseFloat(s.extended_cost)
    );
    const discount_amount = _.sumBy(inventory_stock_detail, (s) =>
      parseFloat(s.discount_amount)
    );

    const net_total = _.sumBy(inventory_stock_detail, (s) =>
      parseFloat(s.net_extended_cost)
    );

    const total_tax = _.sumBy(inventory_stock_detail, (s) =>
      parseFloat(s.tax_amount)
    );

    const net_payable = _.sumBy(inventory_stock_detail, (s) =>
      parseFloat(s.total_amount)
    );

    if (context !== undefined) {
      context.updateState({
        inventory_stock_detail: inventory_stock_detail,
        // delete_inventory_stock_detail: delete_inventory_stock_detail,
        sub_total: sub_total,
        discount_amount: discount_amount,
        net_total: net_total,
        total_tax: total_tax,
        net_payable: net_payable,
      });
    }
  }
};

//Calculate Row Detail
const calculateAmount = ($this, context, row, _index) => {
  let inventory_stock_detail = $this.state.inventory_stock_detail;
  let quantity = row.quantity === "" ? 0 : parseFloat(row.quantity);
  let discount_percentage =
    row.discount_percentage === undefined
      ? 0
      : parseFloat(row.discount_percentage);

  row.extended_cost = (parseFloat(row.unit_cost) * quantity).toFixed(
    $this.state.decimal_place
  );
  row.discount_amount = (
    (parseFloat(row.extended_cost) * discount_percentage) /
    100
  ).toFixed($this.state.decimal_place);
  row.net_extended_cost = (
    parseFloat(row.extended_cost) - parseFloat(row.discount_amount)
  ).toFixed($this.state.decimal_place);

  row.tax_amount = (
    (parseFloat(row.net_extended_cost) * parseFloat(row.tax_percentage)) /
    100
  ).toFixed($this.state.decimal_place);

  row.total_amount = (
    parseFloat(row.net_extended_cost) + parseFloat(row.tax_amount)
  ).toFixed($this.state.decimal_place);

  inventory_stock_detail[_index] = row;

  const sub_total = _.sumBy(inventory_stock_detail, (s) =>
    parseFloat(s.extended_cost)
  );
  const discount_amount = _.sumBy(inventory_stock_detail, (s) =>
    parseFloat(s.discount_amount)
  );

  const net_total = _.sumBy(inventory_stock_detail, (s) =>
    parseFloat(s.net_extended_cost)
  );

  const total_tax = _.sumBy(inventory_stock_detail, (s) =>
    parseFloat(s.tax_amount)
  );

  const net_payable = _.sumBy(inventory_stock_detail, (s) =>
    parseFloat(s.total_amount)
  );

  if (context !== undefined) {
    context.updateState({
      inventory_stock_detail: inventory_stock_detail,
      sub_total: sub_total,
      discount_amount: discount_amount,
      net_total: net_total,
      total_tax: total_tax,
      net_payable: net_payable,
    });
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
  let inventory_stock_detail = $this.state.inventory_stock_detail;
  let _index = $this.state.inventory_stock_detail.indexOf(row);

  if (name === "discount_percentage") {
    if (parseFloat(value) > 100) {
      row[name] = 0;
      row["discount_amount"] = 0;
      inventory_stock_detail[_index] = row;
      $this.setState({
        inventory_stock_detail: inventory_stock_detail,
      });
      swalMessage({
        title: "Discount % cannot be greater than 100.",
        type: "warning",
      });

      // return;
    } else if (parseFloat(value) < 0) {
      row[name] = 0;
      row["discount_amount"] = 0;
      inventory_stock_detail[_index] = row;
      $this.setState({
        inventory_stock_detail: inventory_stock_detail,
      });
      swalMessage({
        title: "Discount % cannot be less than Zero",
        type: "warning",
      });
      // return;
    } else {
      row[name] = value;
    }
  } else if (name === "discount_amount") {
    if (parseFloat(value) < 0) {
      row[name] = 0;
      row["discount_percentage"] = 0;
      inventory_stock_detail[_index] = row;
      $this.setState({
        inventory_stock_detail: inventory_stock_detail,
      });
      swalMessage({
        title: "Discount Amount cannot be less than Zero",
        type: "warning",
      });
      // return;
    } else if (parseFloat(row.extended_cost) < parseFloat(value)) {
      row[name] = 0;
      row["discount_percentage"] = 0;
      inventory_stock_detail[_index] = row;
      $this.setState({
        inventory_stock_detail: inventory_stock_detail,
      });
      swalMessage({
        title: "Discount Amount cannot be greater than Gross Amount.",
        type: "warning",
      });
      // return;
    } else {
      row[name] = value;
    }
  } else if (name === "tax_percentage") {
    if (parseFloat(value) > 100) {
      row[name] = 0;
      row["discount_amount"] = 0;
      inventory_stock_detail[_index] = row;
      $this.setState({
        inventory_stock_detail: inventory_stock_detail,
      });
      swalMessage({
        title: "Tax % cannot be greater than 100.",
        type: "warning",
      });

      // return;
    } else {
      row[name] = value;
    }
  }
  calculateAmount($this, context, row, _index);
};

const qtyonchangegridcol = ($this, context, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let _index = $this.state.inventory_stock_detail.indexOf(row);

  if (value < 0) {
    swalMessage({
      title: "Quantity cannot be less than or equal to Zero",
      type: "warning",
    });
  } else if (parseFloat(value) > row.qtyhand) {
    swalMessage({
      title: "Quantity cannot be greater than Quantity in hand",
      type: "warning",
    });
  } else {
    row["quantity_outstanding"] = value;
    row[name] = value;
    calculateAmount($this, context, row, _index);
  }
};

const ShowItemBatch = ($this, e) => {
  $this.setState({
    ...$this.state,
    selectBatch: !$this.state.selectBatch,
  });
};

const CloseItemBatch = ($this, e) => {
  debugger;
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

  // let grn_no =
  //   e !== undefined
  //     ? e.selected === true
  //       ? e.grnno
  //       : $this.state.grn_no
  //     : $this.state.grn_no;
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

  $this.setState({
    ...$this.state,
    selectBatch: !$this.state.selectBatch,
    batchno: batchno,
    expiry_date: expiry_date,
    // grn_no: grn_no,
    qtyhand: qtyhand,
    unit_cost: sale_price,
  });

  // if (context !== null) {
  //   context.updateState({
  //     batchno: batchno,
  //     expiry_date: expiry_date,
  //     grn_no: grn_no,
  //     qtyhand: qtyhand,
  //     unit_cost: sale_price,
  //   });
  // }
};

export {
  UomchangeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  deleteSalesDetail,
  calculateAmount,
  dateFormater,
  onchangegridcol,
  qtyonchangegridcol,
  ShowItemBatch,
  CloseItemBatch,
};
