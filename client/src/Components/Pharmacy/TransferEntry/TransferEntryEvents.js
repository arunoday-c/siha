import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
// import Enumerable from "linq";
import POSIOputs from "../../../Models/POS";
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
  $this.props.getPosEntry({
    uri: "/posEntry/getPosEntry",
    method: "GET",
    printInput: true,
    data: { pos_number: docNumber },
    redux: {
      type: "POS_ENTRY_GET_DATA",
      mappingName: "posentry"
    },
    afterSuccess: data => {
      debugger;
      data.saveEnable = true;
      data.patient_payable_h = data.patient_payable;
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
  let IOputs = POSIOputs.inputParam();
  IOputs.patient_payable_h = 0;
  IOputs.mode_of_pa = "";
  IOputs.pay_cash = "CA";
  IOputs.pay_card = "CD";
  IOputs.pay_cheque = "CH";
  IOputs.cash_amount = 0;
  IOputs.card_check_number = "";
  IOputs.card_date = null;
  IOputs.card_amount = 0;
  IOputs.cheque_number = "";
  IOputs.cheque_date = null;
  IOputs.cheque_amount = 0;
  IOputs.advance = 0;
  $this.setState(IOputs);
};

const SavePosEnrty = $this => {
  debugger;
  algaehApiCall({
    uri: "/posEntry/addPosEntry",
    data: $this.state,
    onSuccess: response => {
      debugger;
      if (response.data.success === true) {
        $this.setState({
          pos_number: response.data.records.pos_number,
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
        $this.setState(
          {
            material_requisition_number: row.material_requisition_number
          },
          () => {
            $this.props.getRequisitionEntry({
              uri: "/transferEntry/getrequisitionEntryTransfer",
              method: "GET",
              printInput: true,
              data: {
                material_requisition_number: row.material_requisition_number
              },
              redux: {
                type: "POS_ENTRY_GET_DATA",
                mappingName: "requisitionentry"
              },
              afterSuccess: data => {
                debugger;
                data.saveEnable = false;

                if (data.posted === "Y") {
                  data.postEnable = true;
                } else {
                  data.postEnable = false;
                }

                data.postEnable = true;

                data.dataExitst = true;

                for (let i = 0; i < data.pharmacy_stock_detail.length; i++) {
                  data.pharmacy_stock_detail[i].quantity_transfered =
                    data.pharmacy_stock_detail[i].quantity_required;
                  data.pharmacy_stock_detail[i].quantity_authorized =
                    data.pharmacy_stock_detail[i].quantity_required;
                }
                $this.setState(data);
                AlgaehLoader({ show: false });
              }
            });
          }
        );
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
  SavePosEnrty,
  PostPosEntry,
  RequisitionSearch,
  LocationchangeTexts
};
