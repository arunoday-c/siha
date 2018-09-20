import moment from "moment";
import Options from "../../../Options.json";

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
    group_id: e.selected.group_id
  });
};

const AddItems = $this => {
  if ($this.state.location_id === null) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Please select Location."
    });
  } else if ($this.state.item_id === null) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Please select Item."
    });
  } else if ($this.state.batch_no === null) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Batch No. cannot be blank."
    });
  } else if ($this.state.expirt_date === null) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Please select Expiry Date."
    });
  } else if ($this.state.quantity === 0) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Quantity cannot be blank."
    });
  } else if ($this.state.unit_cost === 0) {
    $this.setState({
      SnackbarOpen: true,
      MandatoryMsg: "Invalid Input. Unit Cost cannot be blank."
    });
  } else {
    let ListItems = $this.state.ListItems;
    let itemObj = {
      location_id: $this.state.location_id,
      category_id: $this.state.category_id,
      group_id: $this.state.group_id,
      item_id: $this.state.item_id,
      batch_no: $this.state.batch_no,
      expirt_date: $this.state.expirt_date,
      quantity: $this.state.quantity,
      unit_cost: $this.state.unit_cost
    };
    ListItems.push(itemObj);
    $this.setState({
      ListItems: ListItems
    });
  }
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const dateFormater = ({ value }) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const getCtrlCode = ($this, docNumber) => {
  debugger;
};

export {
  changeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle,
  dateFormater,
  getCtrlCode
};
