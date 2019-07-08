import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
// import Enumerable from "linq";
import TransferIOputs from "../../../Models/TransferEntry";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import _ from "lodash";

const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const getCtrlCode = ($this, docNumber, row) => {
  AlgaehLoader({ show: true });

  algaehApiCall({
    uri: "/transferEntry/gettransferEntry",
    module: "pharmacy",
    method: "GET",
    data: {
      transfer_number: docNumber,
      from_location_id: row.from_location_id,
      to_location_id: row.to_location_id
    },
    onSuccess: response => {
      if (response.data.success === true) {
        let pharmacy_stock_detail = [];
        let data = response.data.records[0];
        for (let i = 0; i < data.stock_detail.length; i++) {
          if (pharmacy_stock_detail.length === 0) {
            pharmacy_stock_detail = data.stock_detail[i].pharmacy_stock_detail;
          } else {
            pharmacy_stock_detail = pharmacy_stock_detail.concat(
              data.stock_detail[i].pharmacy_stock_detail
            );
          }

          // data.pharmacy_stock_detail = pharmacy_stock_detail.concat(
          //   data.stock_detail[i].pharmacy_stock_detail
          // );
        }
        data.pharmacy_stock_detail = pharmacy_stock_detail;

        for (let j = 0; j < data.pharmacy_stock_detail.length; j++) {
          data.pharmacy_stock_detail[j].quantity_transferred =
            data.pharmacy_stock_detail[j].quantity_transfer;
        }

        data.saveEnable = true;
        data.dataExists = true;

        if (data.completed === "Y") {
          data.postEnable = true;
        } else {
          data.postEnable = false;
        }

        data.cannotEdit = true;

        data.dataExitst = true;

        data.quantity_transferred = 0;
        data.item_details = null;
        data.batch_detail_view = false;

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
};

const ClearData = ($this, e) => {
  let IOputs = TransferIOputs.inputParam();
  $this.setState(IOputs);
};

const generateMaterialTransPhar = data => {
  // console.log("data:", data);
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
        reportName:
          data.direct_transfer === "Y"
            ? "MaterialTransferPharDirect"
            : "MaterialTransferPhar",
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
      const url = URL.createObjectURL(res.data);
      let myWindow = window.open(
        "{{ product.metafields.google.custom_label_0 }}",
        "_blank"
      );
      myWindow.document.write(
        "<iframe src= '" + url + "' width='100%' height='100%' />"
      );
      myWindow.document.title = "Material Transfer Receipt";
    }
  });
};

const SaveTransferEntry = $this => {
  AlgaehLoader({ show: true });
  $this.state.completed = "Y";
  $this.state.transaction_type = "ST";
  $this.state.transaction_id = $this.state.hims_f_pharmacy_transfer_header_id;
  $this.state.transaction_date = $this.state.transfer_date;
  for (let i = 0; i < $this.state.pharmacy_stock_detail.length; i++) {
    $this.state.pharmacy_stock_detail[i].location_id =
      $this.state.from_location_id;
    $this.state.pharmacy_stock_detail[i].location_type =
      $this.state.from_location_type;
    $this.state.pharmacy_stock_detail[i].operation = "-";

    $this.state.pharmacy_stock_detail[i].uom_id =
      $this.state.pharmacy_stock_detail[i].uom_transferred_id;

    $this.state.pharmacy_stock_detail[i].quantity =
      $this.state.pharmacy_stock_detail[i].quantity_transfer;

    $this.state.pharmacy_stock_detail[i].grn_number =
      $this.state.pharmacy_stock_detail[i].grnno;

    $this.state.pharmacy_stock_detail[i].net_total =
      parseFloat($this.state.pharmacy_stock_detail[i].unit_cost) *
      parseFloat($this.state.pharmacy_stock_detail[i].quantity_transfer);

    $this.state.pharmacy_stock_detail[i].extended_cost =
      parseFloat($this.state.pharmacy_stock_detail[i].unit_cost) *
      parseFloat($this.state.pharmacy_stock_detail[i].quantity_transfer);
  }

  delete $this.state.item_details;

  for (let j = 0; j < $this.state.stock_detail.length; j++) {
    if ($this.state.stock_detail[j].pharmacy_stock_detail === undefined) {
      $this.state.stock_detail[j].removed = "Y";
    } else {
      delete $this.state.stock_detail[j].batches;
    }
  }

  let stock_detail = _.filter($this.state.stock_detail, f => {
    return f.removed === "N";
  });

  $this.state.stock_detail = stock_detail;

  algaehApiCall({
    uri: "/transferEntry/addtransferEntry",
    module: "pharmacy",
    data: $this.state,
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          transfer_number: response.data.records.transfer_number,
          hims_f_pharmacy_transfer_header_id:
            response.data.records.hims_f_pharmacy_transfer_header_id,
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
  AlgaehLoader({ show: true });
  $this.state.completed = "Y";
  $this.state.transaction_type = "ST";
  $this.state.transaction_id = $this.state.hims_f_pharmacy_transfer_header_id;
  $this.state.transaction_date = $this.state.transfer_date;
  for (let i = 0; i < $this.state.pharmacy_stock_detail.length; i++) {
    $this.state.pharmacy_stock_detail[i].location_id =
      $this.state.from_location_id;
    $this.state.pharmacy_stock_detail[i].location_type =
      $this.state.from_location_type;
    $this.state.pharmacy_stock_detail[i].operation = "-";

    $this.state.pharmacy_stock_detail[i].uom_id =
      $this.state.pharmacy_stock_detail[i].uom_transferred_id;

    $this.state.pharmacy_stock_detail[i].quantity =
      $this.state.pharmacy_stock_detail[i].quantity_transfer;

    $this.state.pharmacy_stock_detail[i].grn_number =
      $this.state.pharmacy_stock_detail[i].grnno;

    $this.state.pharmacy_stock_detail[i].net_total =
      parseFloat($this.state.pharmacy_stock_detail[i].unit_cost) *
      parseFloat($this.state.pharmacy_stock_detail[i].quantity_transfer);

    $this.state.pharmacy_stock_detail[i].extended_cost =
      parseFloat($this.state.pharmacy_stock_detail[i].unit_cost) *
      parseFloat($this.state.pharmacy_stock_detail[i].quantity_transfer);
  }

  algaehApiCall({
    uri: "/transferEntry/updatetransferEntry",
    module: "pharmacy",
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

const RequisitionSearch = ($this, e) => {
  if ($this.state.from_location_id !== null) {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.RequisitionEntry.ReqEntry
      },
      searchName: "REQTransEntry",
      uri: "/gloabelSearch/get",
      inputs: "to_location_id = " + $this.state.from_location_id,
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        if ($this.state.from_location_id !== null) {
          getRequisitionDetails(
            $this,
            row.hims_f_pharamcy_material_header_id,
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
  hims_f_pharamcy_material_header_id,
  from_location_id
) => {
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/transferEntry/getrequisitionEntryTransfer",
    module: "pharmacy",
    method: "GET",
    data: {
      hims_f_pharamcy_material_header_id: hims_f_pharamcy_material_header_id,
      from_location_id: from_location_id
    },

    onSuccess: response => {
      if (response.data.success === true) {
        let data = response.data.records;

        let from_location_id = data.from_location_id;
        let from_location_type = data.from_location_type;
        // data.saveEnable = false;

        data.from_location_id = data.to_location_id;
        data.to_location_id = from_location_id;
        data.from_location_type = data.to_location_type;
        data.to_location_type = from_location_type;

        for (let i = 0; i < data.stock_detail.length; i++) {
          data.stock_detail[i].material_requisition_header_id =
            data.hims_f_pharamcy_material_header_id;

          data.stock_detail[i].material_requisition_detail_id =
            data.stock_detail[i].hims_f_pharmacy_material_detail_id;

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
        }
        data.quantity_transferred = 0;
        data.item_details = null;
        data.batch_detail_view = false;
        if (
          $this.props.hims_f_pharamcy_material_header_id !== undefined &&
          $this.props.hims_f_pharamcy_material_header_id.length !== 0
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
      $this.setState({ [name]: value, [type]: e.selected.location_type });
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
      $this.setState({ [name]: value, [type]: e.selected.location_type });
    }
  }
};

const checkBoxEvent = ($this, e) => {
  let IOputs = TransferIOputs.inputParam();
  IOputs.direct_transfer = $this.state.direct_transfer === "Y" ? "N" : "Y";
  $this.setState(IOputs);
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
  generateMaterialTransPhar
};
