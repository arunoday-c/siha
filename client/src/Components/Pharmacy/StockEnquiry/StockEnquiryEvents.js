import moment from "moment";
import Options from "../../../Options.json";

const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  if (e.value === undefined) {
    $this.setState({ [e]: null }, () => {
      getItemLocationStock($this);
    });
  } else {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    $this.setState({ [name]: value }, () => {
      getItemLocationStock($this);
    });
  }
};

const dateFormater = ($this, value) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const getItemLocationStock = $this => {
  let inputObj = {};

  if ($this.state.location_id !== null) {
    inputObj.pharmacy_location_id = $this.state.location_id;
  }

  if ($this.state.item_id !== null) {
    inputObj.item_id = $this.state.item_id;
  }

  $this.props.getItemLocationStock({
    uri: "/pharmacyGlobal/getItemandLocationStock",
    module: "pharmacy",
    method: "GET",
    data: inputObj,
    redux: {
      type: "ITEMS_BATCH_GET_DATA",
      mappingName: "itemBatch"
    }
  });
};

export { changeTexts, dateFormater, getItemLocationStock };
