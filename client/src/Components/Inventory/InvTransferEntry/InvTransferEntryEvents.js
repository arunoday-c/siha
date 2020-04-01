import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
// import Enumerable from "linq";
import TransferIOputs from "../../../Models/InventoryTransferEntry";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../../utils/algaehApiCall";
import _ from "lodash";
import moment from "moment";

const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const getCtrlCode = ($this, docNumber, row, from) => {
  AlgaehLoader({ show: true });

  let IOputs = TransferIOputs.inputParam();
  $this.setState(IOputs, () => {
    algaehApiCall({
      uri: "/inventorytransferEntry/gettransferEntry",
      module: "inventory",
      method: "GET",
      data: {
        transfer_number: docNumber,
        from_location_id: row.from_location_id,
        to_location_id: row.to_location_id
      },
      onSuccess: response => {
        if (response.data.success === true) {
          let inventory_stock_detail = [];
          let data = response.data.records[0];
          for (let i = 0; i < data.stock_detail.length; i++) {
            if (inventory_stock_detail.length === 0) {
              inventory_stock_detail =
                data.stock_detail[i].inventory_stock_detail;
            } else {
              inventory_stock_detail = inventory_stock_detail.concat(
                data.stock_detail[i].inventory_stock_detail
              );
            }

            // data.inventory_stock_detail = inventory_stock_detail.concat(
            //   data.stock_detail[i].inventory_stock_detail
            // );
          }
          data.inventory_stock_detail = inventory_stock_detail;

          for (let j = 0; j < data.inventory_stock_detail.length; j++) {
            data.inventory_stock_detail[j].quantity_transferred =
              data.inventory_stock_detail[j].quantity_transfer;
            if (from === "Auth") {
              data.inventory_stock_detail[j].ack_quantity =
                data.inventory_stock_detail[j].quantity_transfer;
            }
          }

          data.saveEnable = true;
          data.dataExists = true;

          if (data.completed === "Y") {
            data.postEnable = true;
          } else {
            data.postEnable = false;
          }

          if (data.ack_done === "Y") {
            data.ackTran = true;
          } else {
            data.ackTran = false;
          }

          data.cannotEdit = true;

          data.dataExitst = true;

          data.quantity_transferred = 0;
          data.item_details = null;
          data.batch_detail_view = false;

          if (
            $this.props.transfer_number !== undefined &&
            $this.props.transfer_number.length !== 0
          ) {
            data.ack_tran = true;
            data.fromReq = true;
          }

          $this.setState(data);
          AlgaehLoader({ show: false });

          AlgaehLoader({ show: false });
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
  });
};

const ClearData = ($this, e) => {
  let IOputs = TransferIOputs.inputParam();
  $this.setState(IOputs);
};

const generateMaterialTransInv = data => {
  console.log("data:", data);
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
        reportName: "MaterialTransferInv",
        reportParams: [
          {
            name: "transfer_number",
            value: data.transfer_number
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const urlBlob = URL.createObjectURL(res.data);
      const reportName = `${data.transfer_number}-Material Transfer Receipt`

      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= ${reportName}`;
      window.open(origin);
      // window.document.title = "Material Transfer Receipt";
    }
  });
};

const SaveTransferEntry = $this => {
  let gitLoaction_Exists = {};

  if ($this.props.git_locations.length === 0) {
    swalMessage({
      title: "Please Enter GIT Loaction to transfer item",
      type: "warning"
    });
    return;
  } else {
    gitLoaction_Exists = $this.props.git_locations[0];
  }
  let InputObj = $this.state;
  AlgaehLoader({ show: true });
  InputObj.operation = "+";
  InputObj.completed = "Y";
  InputObj.transaction_type = "ST";
  InputObj.transaction_id = InputObj.hims_f_inventory_transfer_header_id;
  InputObj.transaction_date = moment(
    InputObj.transfer_date,
    "YYYY-MM-DD"
  ).format("YYYY-MM-DD");
  InputObj.git_location_type = gitLoaction_Exists.location_type;
  InputObj.git_location_id = gitLoaction_Exists.hims_d_inventory_location_id;
  for (let i = 0; i < InputObj.inventory_stock_detail.length; i++) {
    InputObj.inventory_stock_detail[i].location_id = InputObj.from_location_id;
    InputObj.inventory_stock_detail[i].location_type =
      InputObj.from_location_type;
    InputObj.inventory_stock_detail[i].operation = "-";

    InputObj.inventory_stock_detail[i].uom_id =
      InputObj.inventory_stock_detail[i].uom_transferred_id;

    InputObj.inventory_stock_detail[i].quantity =
      InputObj.inventory_stock_detail[i].quantity_transfer;

    InputObj.inventory_stock_detail[i].grn_number =
      InputObj.inventory_stock_detail[i].grnno;

    InputObj.inventory_stock_detail[i].net_total = (
      parseFloat(InputObj.inventory_stock_detail[i].unit_cost) *
      parseFloat(InputObj.inventory_stock_detail[i].quantity_transfer)
    ).toFixed(InputObj.decimal_places);

    InputObj.inventory_stock_detail[i].extended_cost = (
      parseFloat(InputObj.inventory_stock_detail[i].unit_cost) *
      parseFloat(InputObj.inventory_stock_detail[i].quantity_transfer)
    ).toFixed(InputObj.decimal_places);

    InputObj.inventory_stock_detail[i].expiry_date =
      InputObj.inventory_stock_detail[i].expiry_date === null
        ? null
        : moment(
            InputObj.inventory_stock_detail[i].expiry_date,
            "YYYY-MM-DD"
          ).format("YYYY-MM-DD");
  }

  delete InputObj.item_details;

  for (let j = 0; j < InputObj.stock_detail.length; j++) {
    if (InputObj.stock_detail[j].inventory_stock_detail === undefined) {
      InputObj.stock_detail[j].removed = "Y";
    } else {
      delete InputObj.stock_detail[j].batches;
    }
  }

  let stock_detail = _.filter(InputObj.stock_detail, f => {
    return f.removed === "N";
  });

  InputObj.stock_detail = stock_detail;

  const settings = { header: undefined, footer: undefined };
  algaehApiCall({
    uri: "/inventorytransferEntry/addtransferEntry",
    module: "inventory",
    skipParse: true,
    data: Buffer.from(JSON.stringify(InputObj), "utf8"),
    method: "POST",
    header: {
      "content-type": "application/octet-stream",
      ...settings
    },
    // uri: "/inventorytransferEntry/addtransferEntry",
    // module: "inventory",
    // data: InputObj,
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          transfer_number: response.data.records.transfer_number,
          hims_f_inventory_transfer_header_id:
            response.data.records.hims_f_inventory_transfer_header_id,
          year: response.data.records.year,
          period: response.data.records.period,
          saveEnable: true,
          dataExists: true,
          postEnable: false,
          cannotEdit: true
        });
        swalMessage({
          title: "Saved successfully . .",
          type: "success"
        });
        AlgaehLoader({ show: false });
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

const PostTransferEntry = $this => {
  $this.state.completed = "Y";
  $this.state.transaction_type = "ST";
  $this.state.transaction_id = $this.state.hims_f_inventory_transfer_header_id;
  $this.state.transaction_date = $this.state.transfer_date;
  for (let i = 0; i < $this.state.inventory_stock_detail.length; i++) {
    $this.state.inventory_stock_detail[i].location_id =
      $this.state.from_location_id;
    $this.state.inventory_stock_detail[i].location_type =
      $this.state.from_location_type;
    $this.state.inventory_stock_detail[i].operation = "-";

    $this.state.inventory_stock_detail[i].uom_id =
      $this.state.inventory_stock_detail[i].uom_transferred_id;

    $this.state.inventory_stock_detail[i].quantity =
      $this.state.inventory_stock_detail[i].quantity_transferred;

    $this.state.inventory_stock_detail[i].grn_number =
      $this.state.inventory_stock_detail[i].grnno;

    $this.state.inventory_stock_detail[i].net_total =
      $this.state.inventory_stock_detail[i].unit_cost *
      $this.state.inventory_stock_detail[i].quantity_transferred;

    $this.state.inventory_stock_detail[i].extended_cost =
      $this.state.inventory_stock_detail[i].unit_cost *
      $this.state.inventory_stock_detail[i].quantity_transferred;
  }

  algaehApiCall({
    uri: "/inventorytransferEntry/updatetransferEntry",
    module: "inventory",
    data: $this.state,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          postEnable: true
        });
        swalMessage({
          title: "Posted successfully . .",
          type: "success"
        });
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

const RequisitionSearch = ($this, e) => {
  if ($this.state.from_location_id !== null) {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.RequisitionEntry.ReqEntry
      },
      searchName: "InvREQTransEntry",
      uri: "/gloabelSearch/get",
      inputs: "to_location_id = " + $this.state.from_location_id,
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        if ($this.state.from_location_id !== null) {
          getRequisitionDetails(
            $this,
            row.hims_f_inventory_material_header_id,
            $this.state.from_location_id
          );
        } else {
          swalMessage({
            title: "Please select From Location.",
            type: "warning"
          });
        }
      }
    });
  } else {
    swalMessage({
      title: "Please select From Location.",
      type: "warning"
    });
  }
};

const getRequisitionDetails = (
  $this,
  hims_f_inventory_material_header_id,
  from_location_id
) => {
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/inventorytransferEntry/getrequisitionEntryTransfer",
    module: "inventory",
    method: "GET",
    data: {
      hims_f_inventory_material_header_id: hims_f_inventory_material_header_id,
      from_location_id: from_location_id
    },

    onSuccess: response => {
      if (response.data.success === true) {
        let data = response.data.records;
        AlgaehLoader({ show: true });
        let from_location_id = data.from_location_id;
        let from_location_type = data.from_location_type;
        // data.saveEnable = false;

        data.from_location_id = data.to_location_id;
        data.to_location_id = from_location_id;
        data.from_location_type = data.to_location_type;
        data.to_location_type = from_location_type;

        data.dataExitst = true;

        for (let i = 0; i < data.stock_detail.length; i++) {
          data.stock_detail[i].material_requisition_header_id =
            data.hims_f_inventory_material_header_id;

          data.stock_detail[i].material_requisition_detail_id =
            data.stock_detail[i].hims_f_inventory_material_detail_id;

          data.stock_detail[i].quantity_transferred = 0;

          data.stock_detail[i].transfer_to_date =
            data.stock_detail[i].quantity_authorized -
            data.stock_detail[i].quantity_outstanding;
          data.stock_detail[i].quantity_outstanding = 0;

          data.stock_detail[i].quantity_requested =
            data.stock_detail[i].quantity_required;

          data.stock_detail[i].uom_requested_id = data.stock_detail[i].item_uom;
          data.stock_detail[i].uom_transferred_id =
            data.stock_detail[i].item_uom;

          data.stock_detail[i].removed = "N";
          data.stock_detail[i].ack_quantity = 0;
        }
        data.quantity_transferred = 0;
        data.item_details = null;
        data.batch_detail_view = false;
        if (
          $this.props.hims_f_inventory_material_header_id !== undefined &&
          $this.props.hims_f_inventory_material_header_id.length !== 0
        ) {
          data.fromReq = true;
        }
        $this.setState(data);
        AlgaehLoader({ show: false });
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

const LocationchangeTexts = ($this, location, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let type = "";
  if (location === "From") {
    type = "from_location_type";
    if ($this.state.to_location_id === value) {
      swalMessage({
        title: "From Location and To Location Cannot be Same ",
        type: "error"
      });
      $this.setState({ [name]: null });
    } else {
      $this.setState({
        [name]: value,
        [type]: e.selected.location_type,

        item_id: null,
        item_category: null,
        uom_id: null,
        item_group_id: null,
        quantity: 0,

        expiry_date: null,
        batchno: null,
        grn_no: null,
        qtyhand: null,
        barcode: null,
        ItemUOM: [],
        Batch_Items: [],
        addItemButton: true,
        item_description: "",
        uom_description: null
      });
    }
  } else if (location === "To") {
    type = "to_location_type";
    if ($this.state.from_location_id === value) {
      swalMessage({
        title: "From Location and To Location Cannot be Same ",
        type: "error"
      });
      $this.setState({ [name]: null });
    } else {
      $this.setState({
        [name]: value,
        [type]: e.selected.location_type,

        item_id: null,
        item_category: null,
        uom_id: null,
        item_group_id: null,
        quantity: 0,

        expiry_date: null,
        batchno: null,
        grn_no: null,
        qtyhand: null,
        barcode: null,
        ItemUOM: [],
        Batch_Items: [],
        addItemButton: true,
        item_description: "",
        uom_description: null
      });
    }
  }
};

const checkBoxEvent = ($this, e) => {
  let IOputs = TransferIOputs.inputParam();
  IOputs.direct_transfer = $this.state.direct_transfer === "Y" ? "N" : "Y";
  $this.setState(IOputs);
};

const AcknowledgeTransferEntry = $this => {
  AlgaehLoader({ show: true });
  const Quantity_zero = _.filter(
    $this.state.inventory_stock_detail,
    f => f.ack_quantity === 0 || f.ack_quantity === ""
  );

  if (Quantity_zero.length > 0) {
    swalMessage({
      type: "warning",
      title: "Please Enter the Acknowledge Qty for each item in the list."
    });
    return;
  }

  let gitLoaction_Exists = {};

  if ($this.props.git_locations.length === 0) {
    swalMessage({
      title: "Please Enter GIT Loaction to transfer item",
      type: "warning"
    });
    return;
  } else {
    gitLoaction_Exists = $this.props.git_locations[0];
  }

  let InputObj = $this.state;
  InputObj.operation = "-";
  InputObj.ack_done = "Y";
  InputObj.transaction_type = "ACK";
  InputObj.transaction_id = InputObj.hims_f_inventory_transfer_header_id;
  InputObj.transaction_date = InputObj.transfer_date;
  InputObj.git_location_type = gitLoaction_Exists.location_type;
  InputObj.git_location_id = gitLoaction_Exists.hims_d_inventory_location_id;

  for (let i = 0; i < InputObj.inventory_stock_detail.length; i++) {
    InputObj.inventory_stock_detail[i].location_id = InputObj.to_location_id;
    InputObj.inventory_stock_detail[i].location_type =
      InputObj.to_location_type;
    InputObj.inventory_stock_detail[i].operation = "+";

    InputObj.inventory_stock_detail[i].uom_id =
      InputObj.inventory_stock_detail[i].uom_transferred_id;

    InputObj.inventory_stock_detail[i].quantity =
      InputObj.inventory_stock_detail[i].ack_quantity;

    InputObj.inventory_stock_detail[i].grn_number =
      InputObj.inventory_stock_detail[i].grnno;

    InputObj.inventory_stock_detail[i].net_total = (
      parseFloat(InputObj.inventory_stock_detail[i].unit_cost) *
      parseFloat(InputObj.inventory_stock_detail[i].ack_quantity)
    ).toFixed(InputObj.decimal_places);

    InputObj.inventory_stock_detail[i].extended_cost = (
      parseFloat(InputObj.inventory_stock_detail[i].unit_cost) *
      parseFloat(InputObj.inventory_stock_detail[i].ack_quantity)
    ).toFixed(InputObj.decimal_places);

    InputObj.inventory_stock_detail[i].git_qty =
      InputObj.inventory_stock_detail[i].ack_quantity;
  }

  InputObj.ScreenCode = getCookie("ScreenCode");

  algaehApiCall({
    uri: "/inventorytransferEntry/updatetransferEntry",
    module: "inventory",
    data: InputObj,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          ackTran: true
        });
        swalMessage({
          title: "Acknowledge successfully . .",
          type: "success"
        });
        AlgaehLoader({ show: false });
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

const ReturnCheckboxEvent = ($this, e) => {
  $this.setState({
    [e.target.name]: e.target.checked === true ? "Y" : "N"
  });
};

export {
  changeTexts,
  getCtrlCode,
  ClearData,
  SaveTransferEntry,
  PostTransferEntry,
  RequisitionSearch,
  LocationchangeTexts,
  checkBoxEvent,
  getRequisitionDetails,
  generateMaterialTransInv,
  AcknowledgeTransferEntry,
  ReturnCheckboxEvent
};
