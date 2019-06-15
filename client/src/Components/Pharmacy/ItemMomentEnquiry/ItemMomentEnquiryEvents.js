import moment from "moment";
import Options from "../../../Options.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value === "" ? null : e.value || e.target.value;
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
  let inputObj = {};
  if ($this.state.location_id !== null) {
    inputObj.from_location_id = $this.state.location_id;
  }
  if ($this.state.item_code_id !== null) {
    inputObj.item_code_id = $this.state.item_code_id;
  }
  if ($this.state.barcode !== null) {
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

  AlgaehLoader({ show: true });
  $this.props.getItemMoment({
    uri: "/pharmacyGlobal/getItemMoment",
    module: "pharmacy",
    method: "GET",
    printInput: true,
    data: inputObj,
    redux: {
      type: "ITEM_MOMENT_DATA",
      mappingName: "itemmoment"
    },
    afterSuccess: data => {
      AlgaehLoader({ show: false });
    }
  });
};

export { changeTexts, dateFormater, datehandle, ProcessItemMoment };
