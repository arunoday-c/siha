import moment from "moment";
import Options from "../../../Options.json";
import { swalMessage } from "../../../utils/algaehApiCall";

const changeTexts = ($this, ctrl, e) => {
  debugger;
  e = ctrl || e;
  if (e.value === undefined) {
    $this.setState({ [e]: null }, () => {
      getItemLocationStock($this);
    });
  } else {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    // if (name === "item_id" && $this.state.location_id === null) {
    //   swalMessage({
    //     type: "warning",
    //     title: "Invalid. Please select the input."
    //   });
    // } else {

    // }
    $this.setState({ [name]: value, total_quantity: 0 }, () => {
      getItemLocationStock($this);
    });
  }
};

const dateFormater = value => {
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
    method: "GET",
    data: inputObj,
    redux: {
      type: "ITEMS_BATCH_GET_DATA",
      mappingName: "itemBatch"
    },
    afterSuccess: data => {
      debugger;
      if (data.length !== 0) {
        let total_quantity = 0;
        for (let i = 0; i < data.length; i++) {
          let qtyhand = data[i].qtyhand;
          total_quantity = total_quantity + qtyhand;
        }
        $this.setState({
          total_quantity: total_quantity
        });
      }
    }
  });
};

export { changeTexts, dateFormater, getItemLocationStock };
