import { swalMessage } from "../../../../utils/algaehApiCall";

export function onchhangeNumber(row, e) {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let quotation_detail = this.context.state.quotation_detail;
  let _index = quotation_detail.indexOf(row);

  row[name] = value;
  if (name === "unit_price") {
    row.extended_price =
      value === "" || value === undefined
        ? 0
        : (parseFloat(row.quantity) * parseFloat(value)).toFixed(
            this.context.state.decimal_places
          );
    row.discount_amount =
      row.discount_percentage === "" || row.discount_percentage === undefined
        ? 0
        : (
            (parseFloat(row.extended_price) *
              parseFloat(row.discount_percentage)) /
            100
          ).toFixed(this.context.state.decimal_places);
  } else {
    if (row.unit_price === 0 || row.unit_price === null) {
      swalMessage({
        title: "Please enter Unit Price",
        type: "warning",
      });
      return;
    }
  }
  if (name === "discount_percentage") {
    if (parseFloat(value) > 100) {
      swalMessage({
        title: "Discount % cannot be greater than 100.",
        type: "warning",
      });
      return;
    }
    row.discount_amount =
      value === "" || value === undefined
        ? 0
        : (
            (parseFloat(row.extended_price) *
              parseFloat(row.discount_percentage)) /
            100
          ).toFixed(this.context.state.decimal_places);
  }

  if (name === "discount_amount") {
    if (parseFloat(value) > parseFloat(row.extended_price)) {
      swalMessage({
        title: "Discount Amount cannot be greater than Extend Cost.",
        type: "warning",
      });
      return;
    }
    row.discount_percentage =
      value === "" || value === undefined
        ? 0
        : (
            (parseFloat(row.discount_amount) / parseFloat(row.extended_price)) *
            100
          ).toFixed(this.context.state.decimal_places);
  }

  row.net_extended_cost =
    row.discount_amount === undefined
      ? parseFloat(row.extended_price).toFixed(
          this.context.state.decimal_places
        )
      : (
          parseFloat(row.extended_price) - parseFloat(row.discount_amount)
        ).toFixed(this.context.state.decimal_places);
  if (name === "tax_percentage") {
    if (parseFloat(value) > 100) {
      swalMessage({
        title: "Tax % cannot be greater than 100.",
        type: "warning",
      });
      return;
    }
    row.tax_amount =
      value === "" || value === undefined
        ? 0
        : (
            (parseFloat(row.net_extended_cost) * parseFloat(value)) /
            100
          ).toFixed(this.context.state.decimal_places);
  } else {
    row.tax_amount =
      row.tax_percentage === "" || row.tax_percentage === undefined
        ? 0
        : (
            (parseFloat(row.net_extended_cost) *
              parseFloat(row.tax_percentage)) /
            100
          ).toFixed(this.context.state.decimal_places);
  }

  row.total_amount =
    parseFloat(row.net_extended_cost) + parseFloat(row.tax_amount);

  quotation_detail[_index] = row;
  this.context.updateState({
    quotation_detail: quotation_detail,
  });
}

export function totalAmountChange(row, e) {
  let quotation_detail = this.context.state.quotation_detail;
  let _index = quotation_detail.indexOf(row);
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  row[name] = value;
  row.unit_price =
    parseFloat(value) /
    parseFloat(row.quantity).toFixed(this.context.state.decimal_place);

  row.extended_price = (
    parseFloat(row.quantity) * parseFloat(row.unit_price)
  ).toFixed(this.context.state.decimal_places);

  row.net_extended_cost =
    row.discount_amount === undefined
      ? parseFloat(row.extended_price).toFixed(
          this.context.state.decimal_places
        )
      : (
          parseFloat(row.extended_price) - parseFloat(row.discount_amount)
        ).toFixed(this.context.state.decimal_places);

  quotation_detail[_index] = row;
  this.context.updateState({
    quotation_detail: quotation_detail,
  });
}
