import AlgaehSearch from "../../Wrapper/globalSearch";
import FrontDesk from "../../../Search/FrontDesk.json";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
// import Enumerable from "linq";
import RequisitionIOputs from "../../../Models/Requisition";
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
  $this.props.getRequisitionEntry({
    uri: "/requisitionEntry/getrequisitionEntry",
    method: "GET",
    printInput: true,
    data: { material_header_number: docNumber },
    redux: {
      type: "POS_ENTRY_GET_DATA",
      mappingName: "requisitionentry"
    },
    afterSuccess: data => {
      debugger;
      data.saveEnable = true;

      if (data.posted === "Y") {
        data.postEnable = true;
      } else {
        data.postEnable = false;
      }
      if (data.visit_id !== null) {
        data.case_type = "OP";
      }
      data.dataExitst = true;
      $this.setState(data);
      AlgaehLoader({ show: false });
    }
  });
};

const ClearData = ($this, e) => {
  let IOputs = RequisitionIOputs.inputParam();
  $this.setState(IOputs);
};

const SaveRequisitionEntry = $this => {
  debugger;
  algaehApiCall({
    uri: "/requisitionEntry/addrequisitionEntry",
    data: $this.state,
    onSuccess: response => {
      debugger;
      if (response.data.success === true) {
        $this.setState({
          material_header_number: response.data.records.material_header_number,
          saveEnable: true,
          authorizeEnable: false
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

const PostPosEntry = $this => {
  debugger;
  $this.state.posted = "Y";
  $this.state.transaction_type = "POS";
  $this.state.transaction_id = $this.state.hims_f_pharmacy_pos_header_id;
  $this.state.transaction_date = $this.state.pos_date;
  for (let i = 0; i < $this.state.pharmacy_stock_detail.length; i++) {
    $this.state.pharmacy_stock_detail[i].location_id = $this.state.location_id;
    $this.state.pharmacy_stock_detail[i].location_type =
      $this.state.location_type;
    $this.state.pharmacy_stock_detail[i].operation = "-";
    $this.state.pharmacy_stock_detail[i].sales_uom =
      $this.state.pharmacy_stock_detail[i].uom_id;
    $this.state.pharmacy_stock_detail[i].item_code_id = $this.state.item_id;
    $this.state.pharmacy_stock_detail[i].grn_number =
      $this.state.pharmacy_stock_detail[i].grn_no;
    $this.state.pharmacy_stock_detail[i].item_category_id =
      $this.state.pharmacy_stock_detail[i].item_category;
  }
  debugger;
  algaehApiCall({
    uri: "/posEntry/updatePosEntry",
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
  SaveRequisitionEntry,
  PostPosEntry,
  LocationchangeTexts
};
