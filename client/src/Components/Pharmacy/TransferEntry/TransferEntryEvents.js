import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
// import Enumerable from "linq";
import TransferIOputs from "../../../Models/TransferEntry";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import { successfulMessage } from "../../../utils/GlobalFunctions";

const changeTexts = ($this, ctrl, e) => {
  debugger;
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const getCtrlCode = ($this, docNumber) => {
  debugger;
  AlgaehLoader({ show: true });
  $this.props.getTransferEntry({
    uri: "/transferEntry/gettransferEntry",
    method: "GET",
    printInput: true,
    data: { transfer_number: docNumber },
    redux: {
      type: "TRNS_ENTRY_GET_DATA",
      mappingName: "tranferEntry"
    },
    afterSuccess: data => {
      debugger;
      data.saveEnable = true;

      if (data.posted === "Y") {
        data.postEnable = true;
      } else {
        data.postEnable = false;
      }

      data.dataExitst = true;
      $this.setState(data);
      AlgaehLoader({ show: false });
    }
  });
};

const ClearData = ($this, e) => {
  let IOputs = TransferIOputs.inputParam();
  $this.setState(IOputs);
};

const SaveTransferEntry = $this => {
  debugger;
  algaehApiCall({
    uri: "/transferEntry/addtransferEntry",
    data: $this.state,
    onSuccess: response => {
      debugger;
      if (response.data.success === true) {
        $this.setState({
          transfer_number: response.data.records.transfer_number,
          saveEnable: true,
          postEnable: false
        });
        swal("Saved successfully . .", {
          icon: "success",
          buttons: false,
          timer: 2000
        });
      }
    }
  });
};

const PostTransferEntry = $this => {
  debugger;
  $this.state.completed = "Y";
  $this.state.transaction_type = "ST";
  $this.state.transaction_id = $this.state.hims_f_pharmacy_transfer_header_id;
  $this.state.transaction_date = $this.state.pos_date;
  for (let i = 0; i < $this.state.pharmacy_stock_detail.length; i++) {
    $this.state.pharmacy_stock_detail[i].location_id =
      $this.state.from_location_id;
    $this.state.pharmacy_stock_detail[i].location_type =
      $this.state.from_location_type;
    $this.state.pharmacy_stock_detail[i].operation = "-";
  }
  debugger;
  algaehApiCall({
    uri: "/transferEntry/updatetransferEntry",
    data: $this.state,
    method: "PUT",
    onSuccess: response => {
      debugger;
      if (response.data.success === true) {
        $this.setState({
          postEnable: true
        });
        swal("Posted successfully . .", {
          icon: "success",
          buttons: false,
          timer: 2000
        });
      }
    }
  });
};

const RequisitionSearch = ($this, e) => {
  if ($this.state.from_location_id !== null) {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.RequisitionEntry.ReqEntry
      },
      searchName: "REQEntry",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        debugger;
        $this.props.getRequisitionEntry({
          uri: "/transferEntry/getrequisitionEntryTransfer",
          method: "GET",
          printInput: true,
          data: {
            material_requisition_number: row.material_requisition_number,
            from_location_id: $this.state.from_location_id
          },
          redux: {
            type: "POS_ENTRY_GET_DATA",
            mappingName: "requisitionentry"
          },
          afterSuccess: data => {
            debugger;
            AlgaehLoader({ show: true });
            data.saveEnable = false;

            if (data.posted === "Y") {
              data.postEnable = true;
            } else {
              data.postEnable = false;
            }

            data.postEnable = true;

            data.dataExitst = true;

            for (let i = 0; i < data.pharmacy_stock_detail.length; i++) {
              data.pharmacy_stock_detail[i].material_requisition_header_id =
                data.hims_f_pharamcy_material_header_id;

              data.pharmacy_stock_detail[i].material_requisition_detail_id =
                data.pharmacy_stock_detail[
                  i
                ].hims_f_pharmacy_material_detail_id;

              data.pharmacy_stock_detail[i].quantity_transferred =
                data.pharmacy_stock_detail[i].quantity_required;

              data.pharmacy_stock_detail[i].expiry_date =
                data.pharmacy_stock_detail[i].expirydt;

              data.pharmacy_stock_detail[i].quantity_requested =
                data.pharmacy_stock_detail[i].quantity_required;
              data.pharmacy_stock_detail[i].quantity_authorized =
                data.pharmacy_stock_detail[i].quantity_required;

              data.pharmacy_stock_detail[i].uom_requested_id =
                data.pharmacy_stock_detail[i].item_uom;
              data.pharmacy_stock_detail[i].uom_transferred_id =
                data.pharmacy_stock_detail[i].item_uom;
            }
            $this.setState(data);
            AlgaehLoader({ show: false });
          }
        });
      }
    });
  } else {
    successfulMessage({
      message: "Invalid Input. Please select From Location.",
      title: "Warning",
      icon: "warning"
    });
  }
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
        title: "Invalid Input.From Location and To Location Cannot be Same ",
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
        title: "Invalid Input.From Location and To Location Cannot be Same ",
        type: "error"
      });
      $this.setState({ [name]: null });
    } else {
      $this.setState({ [name]: value, [type]: e.selected.location_type });
    }
  }
};

export {
  changeTexts,
  getCtrlCode,
  ClearData,
  SaveTransferEntry,
  PostTransferEntry,
  RequisitionSearch,
  LocationchangeTexts
};
