import moment from "moment";
import Options from "../../../Options.json";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

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

const getBatchWiseData = ($this, row) => {
  let inputObj = {
    item_id: row.item_id,
    pharmacy_location_id: row.pharmacy_location_id
  };
  
  algaehApiCall({
    uri: "/pharmacyGlobal/getItemandLocationStock",
    module: "pharmacy",
    method: "GET",
    data: inputObj,
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          batch_wise_item: response.data.records,
          item_description: row.item_description,
          total_quantity: row.qtyhand,
          openBatchWise: !$this.state.openBatchWise
        });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

const getItemLocationStock = $this => {
  let inputObj = {};

  if ($this.state.location_id !== null) {
    inputObj.pharmacy_location_id = $this.state.location_id;
  }

  if ($this.state.item_id !== null) {
    inputObj.item_id = $this.state.item_id;
  }

  algaehApiCall({
    uri: "/pharmacyGlobal/getItemLocationStock",
    module: "pharmacy",
    method: "GET",
    data: inputObj,
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          ListItems: response.data.records
        });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

const updateStockDetils = $this => {};

const datehandle = ($this, row, ctrl, e) => {
  row[e] = moment(ctrl)._d;
  row.update();
};

const texthandle = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  row[name] = value;
  row.update();
};

const closeBatchWise = $this => {
  $this.setState({
    openBatchWise: !$this.state.openBatchWise
  });
};

export {
  changeTexts,
  dateFormater,
  getItemLocationStock,
  updateStockDetils,
  datehandle,
  texthandle,
  getBatchWiseData,
  closeBatchWise
};
