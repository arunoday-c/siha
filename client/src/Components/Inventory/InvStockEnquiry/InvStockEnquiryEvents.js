import moment from "moment";
import Options from "../../../Options.json";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import swal from "sweetalert2";

const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value,
      location_type: e.selected.location_type,
      location_description: e.selected.location_description,
    },
    () => {
      getItemLocationStock($this);
    }
  );
};

const changeEvent = ($this, ctrl, e) => {
  e = ctrl || e;

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  switch (name) {
    case "to_location_id":
      $this.setState({
        [name]: value,
        to_location_type: e.selected.location_type,
      });
      break;
    case "trans_type":
      $this.setState({
        [name]: value,
        to_location_id: null,
      });
      break;
    case "quantity":
      if (
        parseFloat(value) > parseFloat($this.state.item_details.qtyhand) &&
        $this.state.trans_type !== "PR"
      ) {
        swalMessage({
          title: "Selected QTY cannot be greated than QTY in hand",
          type: "warning",
        });

        $this.setState({
          [name]: $this.state.quantity,
        });
      } else {
        $this.setState({
          [name]: value,
        });
      }
      break;

    default:
      $this.setState({ [name]: value });
      break;
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
    inventory_location_id: row.inventory_location_id,
  };

  algaehApiCall({
    uri: "/inventoryGlobal/getItemandLocationStock",
    module: "inventory",
    method: "GET",
    data: inputObj,
    onSuccess: (response) => {
      if (response.data.success === true) {
        $this.setState({
          batch_wise_item: response.data.records,
          item_description: row.item_description,
          total_quantity: row.qtyhand,
          openBatchWise: !$this.state.openBatchWise,
          currentRow: row,
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
        reportName: "StockInventoryBarcode",
        reportParams: [
          {
            name: "hims_m_inventory_item_location_id",
            value: row.hims_m_inventory_item_location_id,
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

const downloadInvStock = ($this) => {
  algaehApiCall({
    uri: "/inventory/downloadInvStock",
    method: "GET",
    data: { inventory_location_id: $this.state.location_id },
    headers: {
      Accept: "blob",
    },
    module: "inventory",
    others: { responseType: "blob" },
    onSuccess: (res) => {
      let blob = new Blob([res.data], {
        type: "application/octet-stream",
      });
      const fileName = `Inventory Stock.xlsx`;
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

const downloadInvStockDetails = ($this) => {
  algaehApiCall({
    uri: "/inventory/downloadInvStockDetails",
    method: "GET",
    data: { inventory_location_id: $this.state.location_id },
    headers: {
      Accept: "blob",
    },
    module: "inventory",
    others: { responseType: "blob" },
    onSuccess: (res) => {
      let blob = new Blob([res.data], {
        type: "application/octet-stream",
      });
      const fileName = `Inventory Stock Details.xlsx`;
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

const itemchangeText = ($this, e, ctrl) => {
  let name = ctrl;
  let value = e.hims_d_inventory_item_master_id;

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

const openExchangePopup = ($this, row) => {
  $this.setState({
    open_exchange: true,
    item_details: row,
  });
};

const onClickProcess = ($this) => {
  let inputOb = $this.state;
  if (inputOb.trans_type === "C") {
    swal({
      title: "Are you sure you want to Consume ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willProceed) => {
      if (willProceed.value) {
        inputOb.item_details.quantity = inputOb.quantity;
        inputOb.item_details.location_id = $this.props.location_id;
        inputOb.item_details.location_type = $this.props.location_type;
        inputOb.item_details.expiry_date = inputOb.item_details.expirydt;
        inputOb.item_details.uom_id = inputOb.item_details.stocking_uom_id;
        inputOb.item_details.unit_cost = inputOb.item_details.waited_avg_cost;
        inputOb.item_details.extended_cost =
          inputOb.item_details.waited_avg_cost;
        inputOb.item_details.sales_price = inputOb.item_details.sale_price;
        inputOb.item_details.operation = "-";

        inputOb.transaction_type = "CS";
        inputOb.location_id = $this.props.location_id;
        inputOb.location_type = $this.props.location_type;
        inputOb.inventory_stock_detail = [inputOb.item_details];
        inputOb.transaction_date = new Date();
        inputOb.ScreenCode = "INV0007";
        AlgaehLoader({ show: true });
        algaehApiCall({
          uri: "/inventoryconsumption/addInventoryConsumption",
          module: "inventory",
          data: inputOb,
          onSuccess: (response) => {
            AlgaehLoader({ show: false });
            if (response.data.success === true) {
              swalMessage({
                title: "Consumed successfully . .",
                type: "success",
              });
              $this.setState({
                open_exchange: false,
                trans_type: null,
                quantity: 0,
                to_location_id: null,
              });
            }
          },
          onFailure: (err) => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: err.message,
              type: "error",
            });
          },
        });
      }
    });
  } else if (inputOb.trans_type === "T") {
    swal({
      title: "Are you sure you want to Tranfer ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willTransfer) => {
      if (willTransfer.value) {
        let gitLoaction_Exists = {};
        const settings = { header: undefined, footer: undefined };

        if ($this.props.trans_ack_required === "Y") {
          if ($this.props.git_locations.length === 0) {
            swalMessage({
              title: "Please Enter GIT Loaction to transfer item",
              type: "warning",
            });
            return;
          } else {
            gitLoaction_Exists = $this.props.git_locations[0];
          }
          inputOb.ack_done = "N";
        } else {
          gitLoaction_Exists = {
            hims_d_inventory_location_id: inputOb.to_location_id,
            location_type: inputOb.to_location_type,
          };
          inputOb.ack_done = "Y";
        }

        inputOb.item_details.quantity = inputOb.quantity;
        inputOb.item_details.quantity_transfer = inputOb.quantity;
        inputOb.item_details.location_id = $this.props.location_id;
        inputOb.item_details.location_type = $this.props.location_type;
        inputOb.item_details.expiry_date = inputOb.item_details.expirydt;
        inputOb.item_details.uom_id = inputOb.item_details.stocking_uom_id;
        inputOb.item_details.uom_transferred_id =
          inputOb.item_details.stocking_uom_id;
        inputOb.item_details.unit_cost = inputOb.item_details.waited_avg_cost;
        inputOb.item_details.extended_cost =
          inputOb.item_details.waited_avg_cost;
        inputOb.item_details.sales_price = inputOb.item_details.sale_price;
        inputOb.item_details.operation = "-";

        inputOb.operation = "+";
        inputOb.transaction_type = "ST";
        inputOb.from_location_id = $this.props.location_id;
        inputOb.from_location_type = $this.props.location_type;
        inputOb.direct_transfer = "Y";
        inputOb.stock_detail = [
          {
            item_id: inputOb.item_details.item_id,
            item_category_id: inputOb.item_details.item_category_id,
            item_group_id: inputOb.item_details.item_group_id,
            quantity_transferred: inputOb.item_details.quantity_transferred,
            uom_transferred_id: inputOb.item_details.stocking_uom_id,
            inventory_stock_detail: [inputOb.item_details],
          },
        ];
        inputOb.inventory_stock_detail = [inputOb.item_details];

        inputOb.git_location_type = gitLoaction_Exists.location_type;
        inputOb.git_location_id =
          gitLoaction_Exists.hims_d_inventory_location_id;

        inputOb.transaction_date = moment(new Date(), "YYYY-MM-DD").format(
          "YYYY-MM-DD"
        );
        inputOb.ScreenCode = "INV0006";
        AlgaehLoader({ show: true });
        algaehApiCall({
          uri: "/inventorytransferEntry/addtransferEntry",
          module: "inventory",
          skipParse: true,
          data: Buffer.from(JSON.stringify(inputOb), "utf8"),
          method: "POST",
          header: {
            "content-type": "application/octet-stream",
            ...settings,
          },
          onSuccess: (response) => {
            AlgaehLoader({ show: false });
            if (response.data.success === true) {
              swalMessage({
                title: "Transferred Successfully . .",
                type: "success",
              });
              $this.setState({
                open_exchange: false,
                trans_type: null,
                quantity: 0,
                to_location_id: null,
              });
            }
          },
          onFailure: (err) => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: err.message,
              type: "error",
            });
          },
        });
      }
    });
  } else if (inputOb.trans_type === "PR") {
    debugger;
    swal({
      title: "Are you sure?",
      text: "You want to Raise Purchase Request ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willTransfer) => {
      if (willTransfer.value) {
        inputOb.authorize1 =
          $this.props.requisition_auth_level === "N" ? "Y" : "N";
        inputOb.authorie2 =
          $this.props.requisition_auth_level === "N" ? "Y" : "N";

        inputOb.item_details.quantity_required = inputOb.quantity;
        inputOb.item_details.quantity_outstanding =
          $this.props.requisition_auth_level === "N" ? inputOb.quantity : 0;
        inputOb.item_details.quantity_authorized =
          $this.props.requisition_auth_level === "N" ? inputOb.quantity : 0;

        inputOb.item_details.from_qtyhand = inputOb.item_details.qtyhand;
        inputOb.item_details.item_uom = inputOb.item_details.stocking_uom_id;

        inputOb.from_location_id = $this.state.to_location_id;
        inputOb.from_location_type = $this.props.to_location_type;
        inputOb.is_completed = "N";
        inputOb.cancelled = "N";
        inputOb.requistion_type = "PR";
        inputOb.status = "PEN";
        inputOb.no_of_transfers = 0;
        inputOb.no_of_po = 0;

        inputOb.inventory_stock_detail = [inputOb.item_details];

        AlgaehLoader({ show: true });
        algaehApiCall({
          uri: "/inventoryrequisitionEntry/addinventoryrequisitionEntry",
          module: "inventory",
          data: inputOb,
          onSuccess: (response) => {
            AlgaehLoader({ show: false });
            if (response.data.success === true) {
              swalMessage({
                title: "Requested Successfully . .",
                type: "success",
              });
              $this.setState({
                open_exchange: false,
                trans_type: null,
                quantity: 0,
                to_location_id: null,
              });
            }
          },
          onFailure: (err) => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: err.message,
              type: "error",
            });
          },
        });
      }
    });
  }
};

const getInventoryOptions = ($this) => {
  algaehApiCall({
    uri: "/inventory/getInventoryOptions",
    method: "GET",
    module: "inventory",
    onSuccess: (res) => {
      if (res.data.success) {
        $this.setState({
          trans_ack_required: res.data.records[0].trans_ack_required,
          requisition_auth_level: res.data.records[0].requisition_auth_level,
        });
      }
    },
    onFailure: (err) => {
      swalMessage({
        title: err.message,
        type: "error",
      });
    },
  });
};

export {
  changeEvent,
  changeTexts,
  dateFormater,
  getItemLocationStock,
  updateStockDetils,
  datehandle,
  texthandle,
  getBatchWiseData,
  closeBatchWise,
  printBarcode,
  downloadInvStock,
  downloadInvStockDetails,
  itemchangeText,
  checkBoxEvent,
  openExchangePopup,
  onClickProcess,
  getInventoryOptions,
};
