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
  AlgaehLoader({ show: true });
  let name = ctrl;

  let value = e.hims_d_inventory_item_master_id;

  algaehApiCall({
    uri: "/inventoryGlobal/getListUomSelectedItem",
    module: "inventory",
    method: "GET",
    data: {
      item_id: value,
    },
    onSuccess: (response) => {
      if (response.data.success) {
        let data = response.data.records;
        if (data.length > 0) {
          const sales_conversion_factor = _.find(
            data,
            (f) => f.uom_id === e.sales_uom_id
          );

          $this.setState({
            [name]: value,
            uom_id: e.sales_uom_id,
            quantity: 1,
            addItemButton: false,
            item_description: e.item_description,
            unit_cost: e.standard_fee,
            Real_unit_cost: e.standard_fee,
            uom_description: e.uom_description,
            tax_percent: e.vat_percent,
            ItemUOM: data,
            sales_conversion_factor: sales_conversion_factor,
            tax_percentage: e.vat_percent,
          });
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
};

const AddItems = ($this, context) => {
  if ($this.state.customer_id === null) {
    swalMessage({
      title: "Please select a Customer.",
      type: "warning",
    });
    return;
  }
  let itemData = Enumerable.from($this.state.sales_order_items)
    .where((w) => w.item_id === $this.state.item_id)
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
    let sales_order_items = $this.state.sales_order_items;

    const extended_cost = (parseFloat($this.state.unit_cost) * parseFloat($this.state.quantity))
      .toFixed($this.state.decimal_place);
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
      item_id: $this.state.item_id,
      quantity: $this.state.quantity,
      uom_id: $this.state.uom_id,
      uom_description: $this.state.uom_description,
      discount_percentage: $this.state.discount_percentage,
      unit_cost: $this.state.unit_cost,
      extended_cost: extended_cost,
      net_extended_cost: net_extended_cost,
      discount_amount: discount_amount,
      tax_percentage: $this.state.tax_percentage,
      tax_amount: tax_amount,
      total_amount: total_amount,
      quantity_outstanding: $this.state.quantity, //0
    };
    sales_order_items.push(ItemInput);

    const sub_total = _.sumBy(sales_order_items, (s) =>
      parseFloat(s.extended_cost)
    );
    const h_discount_amount = _.sumBy(sales_order_items, (s) =>
      parseFloat(s.discount_amount)
    );
    const net_total = _.sumBy(sales_order_items, (s) =>
      parseFloat(s.net_extended_cost)
    );

    const total_tax = _.sumBy(sales_order_items, (s) =>
      parseFloat(s.tax_amount)
    );

    const net_payable = _.sumBy(sales_order_items, (s) =>
      parseFloat(s.total_amount)
    );

    $this.setState({
      sales_order_items: sales_order_items,

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
    });

    if (context !== undefined) {
      context.updateState({
        sales_order_items: sales_order_items,
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
  let sales_order_items = $this.state.sales_order_items;
  const _index = sales_order_items.indexOf(row);
  sales_order_items.splice(_index, 1);
  let delete_sales_order_items = $this.state.delete_sales_order_items

  if (row.hims_f_sales_order_items_id !== null) {
    delete_sales_order_items.push(row.hims_f_sales_order_items_id);
  }

  if (sales_order_items.length === 0) {
    if (context !== undefined) {
      context.updateState({
        sales_order_items: sales_order_items,
        delete_sales_order_items: delete_sales_order_items,
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
    const sub_total = _.sumBy(sales_order_items, (s) =>
      parseFloat(s.extended_cost)
    );
    const discount_amount = _.sumBy(sales_order_items, (s) =>
      parseFloat(s.discount_amount)
    );

    const net_total = _.sumBy(sales_order_items, (s) =>
      parseFloat(s.net_extended_cost)
    );

    const total_tax = _.sumBy(sales_order_items, (s) =>
      parseFloat(s.tax_amount)
    );

    const net_payable = _.sumBy(sales_order_items, (s) =>
      parseFloat(s.total_amount)
    );

    if (context !== undefined) {
      context.updateState({
        sales_order_items: sales_order_items,
        delete_sales_order_items: delete_sales_order_items,
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
  let sales_order_items = $this.state.sales_order_items;
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

  sales_order_items[_index] = row;

  const sub_total = _.sumBy(sales_order_items, (s) =>
    parseFloat(s.extended_cost)
  );
  const discount_amount = _.sumBy(sales_order_items, (s) =>
    parseFloat(s.discount_amount)
  );

  const net_total = _.sumBy(sales_order_items, (s) =>
    parseFloat(s.net_extended_cost)
  );

  const total_tax = _.sumBy(sales_order_items, (s) => parseFloat(s.tax_amount));

  const net_payable = _.sumBy(sales_order_items, (s) =>
    parseFloat(s.total_amount)
  );

  if (context !== undefined) {
    context.updateState({
      sales_order_items: sales_order_items,
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
  let sales_order_items = $this.state.sales_order_items;
  let _index = $this.state.sales_order_items.indexOf(row);

  if (name === "discount_percentage") {
    if (parseFloat(value) > 100) {
      row[name] = 0;
      row["discount_amount"] = 0;
      sales_order_items[_index] = row;
      $this.setState({
        sales_order_items: sales_order_items,
      });
      swalMessage({
        title: "Discount % cannot be greater than 100.",
        type: "warning",
      });

      // return;
    } else if (parseFloat(value) < 0) {
      row[name] = 0;
      row["discount_amount"] = 0;
      sales_order_items[_index] = row;
      $this.setState({
        sales_order_items: sales_order_items,
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
      sales_order_items[_index] = row;
      $this.setState({
        sales_order_items: sales_order_items,
      });
      swalMessage({
        title: "Discount Amount cannot be less than Zero",
        type: "warning",
      });
      // return;
    } else if (parseFloat(row.extended_cost) < parseFloat(value)) {
      row[name] = 0;
      row["discount_percentage"] = 0;
      sales_order_items[_index] = row;
      $this.setState({
        sales_order_items: sales_order_items,
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
      sales_order_items[_index] = row;
      $this.setState({
        sales_order_items: sales_order_items,
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
  let _index = $this.state.sales_order_items.indexOf(row);

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
    // if (
    //   $this.props.sales_order_number !== undefined &&
    //   $this.props.sales_order_number.length !== 0
    // ) {
    //   row["quantity_outstanding"] = value;
    // }
    row["quantity_outstanding"] = value;
    row[name] = value;
    calculateAmount($this, context, row, _index);
  }
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
};
