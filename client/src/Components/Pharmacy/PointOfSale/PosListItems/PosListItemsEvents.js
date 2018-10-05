import { successfulMessage } from "../../../../utils/GlobalFunctions";
import moment from "moment";

const discounthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  let sheet_discount_percentage = 0;
  let sheet_discount_amount = 0;

  if ([e.target.name] == "sheet_discount_percentage") {
    sheet_discount_percentage = parseFloat(e.target.value.replace(" %", ""));
    sheet_discount_amount = 0;
  } else {
    sheet_discount_amount = parseFloat(e.target.value);
    sheet_discount_percentage = 0;
  }
  if (sheet_discount_percentage > 100) {
    successfulMessage({
      message: "Invalid Input. Discount % cannot be greater than 100.",
      title: "Warning",
      icon: "warning"
    });
  } else {
    $this.setState(
      {
        sheet_discount_percentage: sheet_discount_percentage,
        sheet_discount_amount: sheet_discount_amount
      },
      () => {
        // billheaderCalculation($this, context);
      }
    );

    if (context != null) {
      context.updateState({
        sheet_discount_percentage: sheet_discount_percentage,
        sheet_discount_amount: sheet_discount_amount
      });
    }
  }
};

const changeTexts = ($this, ctrl, e) => {
  debugger;
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const numberchangeTexts = ($this, ctrl, e) => {
  debugger;

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const itemchangeText = ($this, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({
    [name]: value,
    category_id: e.selected.category_id,
    group_id: e.selected.group_id,
    quantity: 1,
    unit_cost: "200.00"
  });
};

const AddItems = $this => {
  let ListItems = $this.state.ListItems;
  let itemObj = {
    location_id: $this.state.location_id,
    category_id: $this.state.category_id,
    group_id: $this.state.group_id,
    item_id: $this.state.item_id,
    batch_no: $this.state.batch_no,
    expirt_date: $this.state.expirt_date,
    quantity: $this.state.quantity,
    unit_cost: $this.state.unit_cost,
    quantity: $this.state.quantity
  };
  ListItems.push(itemObj);
  $this.setState({
    ListItems: ListItems
  });
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

export {
  discounthandle,
  changeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle
};
