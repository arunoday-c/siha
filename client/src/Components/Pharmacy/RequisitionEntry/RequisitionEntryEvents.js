// import AlgaehSearch from "../../Wrapper/globalSearch";
// import FrontDesk from "../../../Search/FrontDesk.json";
// import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
// import Enumerable from "linq";
import RequisitionIOputs from "../../../Models/Requisition";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
// import { successfulMessage } from "../../../utils/GlobalFunctions";

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
    data: { material_requisition_number: docNumber },
    redux: {
      type: "POS_ENTRY_GET_DATA",
      mappingName: "requisitionentry"
    },
    afterSuccess: data => {
      debugger;
      if (
        $this.props.material_requisition_number !== undefined &&
        $this.props.material_requisition_number.length !== 0
      ) {
        data.authorizeEnable = false;
        data.ItemDisable = true;
        data.ClearDisable = true;

        for (let i = 0; i < data.pharmacy_stock_detail.length; i++) {
          data.pharmacy_stock_detail[i].quantity_authorized =
            data.pharmacy_stock_detail[i].quantity_required;

          data.pharmacy_stock_detail[i].operation = "+";
        }
      }
      data.saveEnable = true;

      if (data.posted === "Y") {
        data.postEnable = true;
      } else {
        data.postEnable = false;
      }
      if (data.visit_id !== null) {
        data.case_type = "OP";
      }

      data.addedItem = true;
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
          material_requisition_number:
            response.data.records.material_requisition_number,
          saveEnable: true
          // authorizeEnable: false
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

const AuthorizeRequisitionEntry = ($this, authorize) => {
  debugger;

  if (authorize === "authorize1") {
    $this.state.authorize1 = "Y";
  } else if (authorize === "authorize2") {
    $this.state.authorize = "Y";
  }

  debugger;
  algaehApiCall({
    uri: "/requisitionEntry/updaterequisitionEntry",
    data: $this.state,
    method: "PUT",
    onSuccess: response => {
      debugger;
      if (response.data.success === true) {
        $this.setState({
          postEnable: true
        });
        swal("Authorized successfully . .", {
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
  AuthorizeRequisitionEntry,
  LocationchangeTexts
};
