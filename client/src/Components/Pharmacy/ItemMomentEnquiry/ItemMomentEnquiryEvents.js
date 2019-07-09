import moment from "moment";
import Options from "../../../Options.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const changeTexts = ($this, ctrl, e) => {
  debugger;
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const dateFormater = value => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};
const ProcessItemMoment = $this => {
  if ($this.state.from_date === null) {
    swalMessage({
      title: "Please Enter From Date",
      type: "warning"
    });
    return;
  } else if ($this.state.to_date === null) {
    swalMessage({
      title: "Please Enter To Date",
      type: "warning"
    });
    return;
  }
  AlgaehLoader({ show: true });
  let inputObj = {};
  if ($this.state.location_id !== null) {
    inputObj.from_location_id = $this.state.location_id;
  }
  if ($this.state.item_code_id !== null) {
    inputObj.item_code_id = $this.state.item_code_id;
  }
  if ($this.state.barcode !== null && $this.state.barcode !== "") {
    inputObj.barcode = $this.state.barcode;
  }
  if ($this.state.transaction_type !== null) {
    inputObj.transaction_type = $this.state.transaction_type;
  }
  if ($this.state.from_date !== null) {
    inputObj.from_date = moment($this.state.from_date).format(
      Options.dateFormatYear
    );
  }
  if ($this.state.to_date !== null) {
    inputObj.to_date = moment($this.state.to_date).format(
      Options.dateFormatYear
    );
  }
  debugger;

  algaehApiCall({
    uri: "/pharmacyGlobal/getItemMoment",
    module: "pharmacy",
    method: "GET",
    printInput: true,
    data: inputObj,
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;

        $this.setState(
          {
            itemmoment: data
          },
          () => {
            AlgaehLoader({ show: false });
          }
        );
      }
    },
    onFailure: error => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

const dateValidate = ($this, value, e) => {
  let inRange = false;
  if (e.target.name === "from_date") {
    inRange = moment(value).isAfter(
      moment($this.state.to_date).format("YYYY-MM-DD")
    );
    if (inRange) {
      swalMessage({
        title: "From Date cannot be grater than To Date.",
        type: "warning"
      });
      e.target.focus();
      $this.setState({
        [e.target.name]: null
      });
    }

    inRange = moment(value).isAfter(moment().format("YYYY-MM-DD"));
    if (inRange) {
      swalMessage({
        title: "From Date cannot be Future Date.",
        type: "warning"
      });
      e.target.focus();
      $this.setState({
        [e.target.name]: null
      });
    }
  } else if (e.target.name === "to_date") {
    inRange = moment(value).isBefore(
      moment($this.state.from_date).format("YYYY-MM-DD")
    );
    if (inRange) {
      swalMessage({
        title: "To Date cannot be less than From Date.",
        type: "warning"
      });
      e.target.focus();
      $this.setState({
        [e.target.name]: null
      });
    }
    inRange = moment(value).isAfter(moment().format("YYYY-MM-DD"));
    if (inRange) {
      swalMessage({
        title: "To Date cannot be Future Date.",
        type: "warning"
      });
      e.target.focus();
      $this.setState({
        [e.target.name]: null
      });
    }
  }
};

export {
  changeTexts,
  dateFormater,
  datehandle,
  ProcessItemMoment,
  dateValidate
};
