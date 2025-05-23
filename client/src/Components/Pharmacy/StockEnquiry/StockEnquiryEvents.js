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
    pharmacy_location_id: row.pharmacy_location_id,
  };

  algaehApiCall({
    uri: "/pharmacyGlobal/getItemandLocationStock",
    module: "pharmacy",
    method: "GET",
    data: inputObj,
    onSuccess: (response) => {
      if (response.data.success === true) {
        $this.setState({
          batch_wise_item: response.data.records,
          item_description: row.item_description,
          total_quantity: row.qtyhand,
          openBatchWise: !$this.state.openBatchWise,
        });
      }
    },
    onFailure: (error) => {
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });
};

const getItemLocationStock = ($this) => {
  if ($this.state.location_id !== null || $this.state.item_id !== null) {
    let inputObj = { reorder_qty: $this.state.reorder_qty };

    if ($this.state.location_id !== null) {
      inputObj.pharmacy_location_id = $this.state.location_id;
    }

    if ($this.state.item_id !== null) {
      inputObj.item_id = $this.state.item_id;
    }
    if ($this.state.zeroStock === "Y") {
      inputObj.zeroStock = $this.state.zeroStock;
    }
    algaehApiCall({
      uri: "/pharmacyGlobal/getItemLocationStock",
      module: "pharmacy",
      method: "GET",
      data: inputObj,
      onSuccess: (response) => {
        if (response.data.success === true) {
          $this.setState({
            ListItems: response.data.records,
          });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  } else {
    $this.setState({
      ListItems: [],
    });
  }
};

const downloadPharStock = ($this) => {
  algaehApiCall({
    uri: "/pharmacy/downloadPharStock",
    method: "GET",
    data: { pharmacy_location_id: $this.state.location_id },
    headers: {
      Accept: "blob",
    },
    module: "pharmacy",
    others: { responseType: "blob" },
    onSuccess: (res) => {
      let blob = new Blob([res.data], {
        type: "application/octet-stream",
      });
      const fileName = `Pharmacy Stock.xlsx`;
      var objectUrl = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.setAttribute("href", objectUrl);
      link.setAttribute("download", fileName);
      link.click();
    },
    onCatch: (error) => {
      swalMessage({
        type: "error",
        title: error.message,
      });
    },
  });
};

const downloadPharStockDetails = ($this) => {
  algaehApiCall({
    uri: "/pharmacy/downloadPharStockDetails",
    method: "GET",
    data: { pharmacy_location_id: $this.state.location_id },
    headers: {
      Accept: "blob",
    },
    module: "pharmacy",
    others: { responseType: "blob" },
    onSuccess: (res) => {
      let blob = new Blob([res.data], {
        type: "application/octet-stream",
      });
      const fileName = `Pharmacy Stock Details.xlsx`;
      var objectUrl = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.setAttribute("href", objectUrl);
      link.setAttribute("download", fileName);
      link.click();
    },
    onCatch: (error) => {
      swalMessage({
        type: "error",
        title: error.message,
      });
    },
  });
};

const updateStockDetils = ($this) => {};

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

const closeBatchWise = ($this) => {
  $this.setState({
    openBatchWise: !$this.state.openBatchWise,
  });
};

const printBarcode = ($this, row) => {
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob",
    },
    others: { responseType: "blob" },
    data: {
      report: {
        others: {
          width: "50mm",
          height: "20mm",
          showHeaderFooter: false,
        },
        reportName: "StockPharmacyBarcode",
        reportParams: [
          {
            name: "hims_m_item_location_id",
            value: row.hims_m_item_location_id,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      // const url = URL.createObjectURL(res.data);
      // let myWindow = window.open(
      //   "{{ product.metafields.google.custom_label_0 }}",
      //   "_blank"
      // );

      // myWindow.document.write(
      //   "<iframe src= '" + url + "' width='100%' height='100%' />"
      // );
      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Item Barcode`;
      window.open(origin);
      // window.document.title = "Item Barcode";
    },
  });
};

const itemchangeText = ($this, e, ctrl) => {
  debugger;
  let name = ctrl;
  let value = e.hims_d_item_master_id;

  $this.setState(
    {
      [name]: value,
      item_description: e.item_description,
    },
    () => {
      getItemLocationStock($this);
    }
  );
};

const checkBoxEvent = ($this, e) => {
  let name = e.target.name;
  const _value = e.target.checked ? "Y" : "N";
  $this.setState({ [name]: _value }, () => {
    getItemLocationStock($this);
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
  printBarcode,
  downloadPharStock,
  downloadPharStockDetails,
  itemchangeText,
  checkBoxEvent,
};
