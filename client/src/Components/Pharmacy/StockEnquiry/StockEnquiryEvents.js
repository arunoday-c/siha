import moment from "moment";
import Options from "../../../Options.json";

const changeTexts = ($this, ctrl, e) => {
  debugger;
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value }, () => {
    getItemLocationStock($this);
  });
};

const dateFormater = value => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const getItemLocationStock = $this => {
  if ($this.state.location_id !== null && $this.state.item_id !== null) {
    $this.props.getItemLocationStock({
      uri: "/pharmacyGlobal/getItemLocationStock",
      method: "GET",
      data: {
        location_id: $this.state.location_id,
        item_id: $this.state.item_id
      },
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
  }
};

export { changeTexts, dateFormater, getItemLocationStock };
