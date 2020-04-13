import { swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";
import Options from "../../../../Options.json";

const deleteSalesReturnDetail = ($this, context, row) => {
  let sub_total = 0;
  let net_total = 0
  let discount_amount = 0;
  let return_total = 0, tax_amount = 0;

  let sales_return_detail = $this.state.sales_return_detail;
  let _index = sales_return_detail.indexOf(row);

  sales_return_detail.splice(_index, 1);

  if (sales_return_detail.length > 0) {
    sub_total = Enumerable.from(sales_return_detail).sum(s =>
      parseFloat(s.extended_cost)
    );

    discount_amount = Enumerable.from(sales_return_detail).sum(s =>
      parseFloat(s.discount_amount)
    );

    net_total = Enumerable.from(sales_return_detail).sum(s =>
      parseFloat(s.net_extended_cost)
    );

    tax_amount = Enumerable.from(sales_return_detail).sum(s =>
      parseFloat(s.tax_amount)
    );


    return_total = Enumerable.from(sales_return_detail).sum(s =>
      parseFloat(s.total_amount)
    );
  } else {
    sub_total = 0
    discount_amount = 0
    net_total = 0
    tax_amount = 0
    return_total = 0
  }

  if (context !== undefined) {
    context.updateState({
      sales_return_detail: sales_return_detail,
      sub_total: sub_total,
      discount_amount: discount_amount,
      net_total: net_total,
      tax_amount: tax_amount,
      return_total: return_total,
      saveEnable: sales_return_detail.length > 0 ? false : true
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
  let sales_return_detail = $this.state.sales_return_detail
  let _index = sales_return_detail.indexOf(row);

  // IU.conversion_factor
  if (parseFloat(value) > parseFloat(row.dispatch_quantity)) {
    swalMessage({
      title: "Return Quantity cannot be Greater than Deliverd Quantity.",
      type: "warning"
    });
    return;
  } else if (parseFloat(value) < 0) {
    swalMessage({
      title: "Return Quantity cannot be less than Zero.",
      type: "warning"
    });
    return;
  }
  row[name] = value;
  // sales_return_detail[_index] = row;
  // $this.setState({
  //   sales_return_detail: sales_return_detail
  // });
  // if (context !== undefined) {
  //   context.updateState({
  //     sales_return_detail: sales_return_detail
  //   });
  // }
  onchhangegriddiscount($this, context, row, e);

};

const onchhangegriddiscount = ($this, context, row, e) => {
  let extended_cost = 0;

  let tax_amount = 0;
  let sales_return_detail = $this.state.sales_return_detail
  let _index = sales_return_detail.indexOf(row);

  extended_cost =
    parseFloat(row.return_qty) * parseFloat(row.unit_cost);


  tax_amount = ((extended_cost * parseFloat(row.tax_percentage)) / 100).toFixed($this.state.decimal_places);


  row["extended_cost"] = extended_cost.toFixed($this.state.decimal_places)
  row["tax_amount"] = ((extended_cost * parseFloat(row.tax_percentage)) / 100).toFixed($this.state.decimal_places);
  row["total_amount"] = (parseFloat(tax_amount) + parseFloat(extended_cost)).toFixed($this.state.decimal_places);


  row["net_extended_cost"] = extended_cost.toFixed($this.state.decimal_places)

  sales_return_detail[_index] = row;

  $this.setState({
    sales_return_detail: sales_return_detail
  }, () => {
    calculateHeadervalues($this, context);
  });
  if (context !== undefined) {
    context.updateState({
      sales_return_detail: sales_return_detail
    });
  }


};

const calculateHeadervalues = ($this, context) => {

  let sales_return_detail = $this.state.sales_return_detail;
  // let _index = sales_return_detail.indexOf(row);
  // sales_return_detail[_index] = row;

  let sub_total = Enumerable.from(sales_return_detail).sum(s =>
    parseFloat(s.extended_cost)
  );

  let discount_amount = Enumerable.from(sales_return_detail).sum(s =>
    parseFloat(s.discount_amount)
  );

  let net_total = Enumerable.from(sales_return_detail).sum(s =>
    parseFloat(s.net_extended_cost)
  );

  let tax_amount = Enumerable.from(sales_return_detail).sum(s =>
    parseFloat(s.tax_amount)
  );


  let return_total = Enumerable.from(sales_return_detail).sum(s =>
    parseFloat(s.total_amount)
  );

  $this.setState({
    // sales_return_detail: sales_return_detail,
    sub_total: sub_total,
    discount_amount: discount_amount,
    net_total: net_total,
    tax_amount: tax_amount,
    return_total: return_total
  });

  if (context !== undefined) {
    context.updateState({
      // sales_return_detail: sales_return_detail,
      sub_total: sub_total,
      discount_amount: discount_amount,
      net_total: net_total,
      tax_amount: tax_amount,
      return_total: return_total
    });
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
  deleteSalesReturnDetail,
  dateFormater,
  onchangegridcol,
  onchhangegriddiscount,
  AssignData,
  GridAssignData,
  gridNumHandler
};
