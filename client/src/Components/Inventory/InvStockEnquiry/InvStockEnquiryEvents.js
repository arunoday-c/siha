import moment from "moment";
import Options from "../../../Options.json";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({ [name]: value }, () => {
    getItemLocationStock($this);
  });
};

const dateFormater = ($this, value) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const getBatchWiseData = ($this, row) => {
  let inputObj = {
    item_id: row.item_id,
    inventory_location_id: row.inventory_location_id
  };

  algaehApiCall({
    uri: "/inventoryGlobal/getItemandLocationStock",
    module: "inventory",
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
  if ($this.state.location_id !== null || $this.state.item_id !== null) {
    let inputObj = {};

    if ($this.state.location_id !== null) {
      inputObj.inventory_location_id = $this.state.location_id;
    }

    if ($this.state.item_id !== null) {
      inputObj.item_id = $this.state.item_id;
    }

    algaehApiCall({
      uri: "/inventoryGlobal/getItemLocationStock",
      module: "inventory",
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
  } else {
    $this.setState({
      ListItems: []
    });
  }
};

const updateStockDetils = $this => { };

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

const printBarcode = ($this, row) => {
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob"
    },
    others: { responseType: "blob" },
    data: {
      report: {
        others: {
          width: "50mm",
          height: "20mm",
          showHeaderFooter: false
        },
        reportName: "StockInventoryBarcode",
        reportParams: [
          {
            name: "hims_m_inventory_item_location_id",
            value: row.hims_m_inventory_item_location_id
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const url = URL.createObjectURL(res.data);
      let myWindow = window.open(
        "{{ product.metafields.google.custom_label_0 }}",
        "_blank"
      );

      myWindow.document.write(
        "<iframe src= '" + url + "' width='100%' height='100%' />"
      );
      myWindow.document.title = "Item Barcode";
    }
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
  closeBatchWise,
  printBarcode
};
