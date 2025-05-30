// import AlgaehSearch from "../../Wrapper/globalSearch";
// import FrontDesk from "../../../Search/FrontDesk.json";
// import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import Enumerable from "linq";
import RequisitionIOputs from "../../../Models/Requisition";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const requisitionEvent = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    to_location_id: null,
    to_location_type: null,
    from_location_id: null,
    from_location_type: null
  });
};

const getCtrlCode = ($this, docNumber) => {
  AlgaehLoader({ show: true });

  let IOputs = RequisitionIOputs.inputParam();
  $this.setState(IOputs, () => {
    $this.props.getRequisitionEntry({
      uri: "/requisitionEntry/getrequisitionEntry",
      module: "pharmacy",
      method: "GET",
      printInput: true,
      data: { material_requisition_number: docNumber },
      redux: {
        type: "POS_ENTRY_GET_DATA",
        mappingName: "requisitionentry",
      },
      afterSuccess: (data) => {
        data.cannotDelete = true;
        if (
          $this.props.material_requisition_number !== undefined &&
          $this.props.material_requisition_number.length !== 0
        ) {
          data.authorizeEnable = false;
          data.ClearDisable = true;

          for (let i = 0; i < data.pharmacy_stock_detail.length; i++) {
            data.pharmacy_stock_detail[i].quantity_authorized =
              data.authorize1 === "N"
                ? data.pharmacy_stock_detail[i].quantity_required
                : data.pharmacy_stock_detail[i].quantity_authorized;
            data.pharmacy_stock_detail[i].quantity_outstanding =
              data.authorize1 === "N"
                ? data.pharmacy_stock_detail[i].quantity_required
                : data.pharmacy_stock_detail[i].quantity_outstanding;

            data.pharmacy_stock_detail[i].operation = "+";
          }
        }
        data.saveEnable = true;

        if (data.posted === "Y") {
          data.postEnable = true;
        } else {
          data.postEnable = false;
        }
        // if (data.visit_id !== null) {
        //   data.case_type = "OP";
        // }

        data.addedItem = true;
        data.ItemDisable = true;
        $this.setState(data, () => { });
        AlgaehLoader({ show: false });
      },
    });
  });
};

const ClearData = ($this, e) => {
  let IOputs = RequisitionIOputs.inputParam();
  $this.setState(IOputs);
};

const SaveRequisitionEntry = ($this) => {
  AlgaehLoader({ show: true });

  let InputObj = $this.state

  InputObj.authorize1 = $this.state.requisition_auth_level === "N" ? "Y" : "N"
  InputObj.authorie2 = $this.state.requisition_auth_level === "N" ? "Y" : "N"
  algaehApiCall({
    uri: "/requisitionEntry/addrequisitionEntry",
    module: "pharmacy",
    data: InputObj,
    onSuccess: (response) => {
      if (response.data.success === true) {
        $this.setState({
          material_requisition_number:
            response.data.records.material_requisition_number,
          saveEnable: true,
          addItemButton: true,
          ItemDisable: true,
          cannotDelete: true,
          // authorizeEnable: false
        });

        swalMessage({
          title: "Saved successfully . .",
          type: "success",
        });
      }
      AlgaehLoader({ show: false });
    },
    onFailure: (error) => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });
};

const generateMaterialReqPhar = (data, rpt_name, rpt_desc) => {
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
        reportName: "MaterialReqPhar",
        reportParams: [
          {
            name: "material_requisition_number",
            value: data.material_requisition_number,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);
      const reportName = `${data.material_requisition_number}-Material Requisition - Pharmacy`;
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= ${reportName}`;
      window.open(origin);
      // window.document.title = "Material Requisition - Pharmacy";
    },
  });
};

const AuthorizeRequisitionEntry = ($this, authorize) => {
  let auth_qty = Enumerable.from($this.state.pharmacy_stock_detail).any(
    (w) =>
      parseFloat(w.quantity_authorized) === 0 || w.quantity_authorized === null
  );

  if (auth_qty === true) {
    swalMessage({
      title: "Please enter Authorize Quantity.",
      type: "warning",
    });
    return;
  }

  let authorize1 = "";
  let authorize2 = "";
  if ($this.state.requisition_auth_level === "1") {
    $this.state.authorize1 = "Y";
    $this.state.authorie2 = "Y";
    authorize1 = "Y";
    authorize2 = "Y";
  } else {
    if (authorize === "authorize1") {
      $this.state.authorize1 = "Y";
      authorize1 = "Y";
      authorize2 = "N";
    } else if (authorize === "authorize2") {
      $this.state.authorize1 = "Y";
      $this.state.authorie2 = "Y";
      authorize1 = "Y";
      authorize2 = "Y";
    }
  }
  AlgaehLoader({ show: true });

  algaehApiCall({
    uri: "/requisitionEntry/updaterequisitionEntry",
    module: "pharmacy",
    data: $this.state,
    method: "PUT",
    onSuccess: (response) => {
      if (response.data.success === true) {
        $this.setState({
          postEnable: true,
          authorize1: authorize1,
          authorie2: authorize2,
        });
        swalMessage({
          title: "Authorized successfully . .",
          type: "success",
        });
      }
      AlgaehLoader({ show: false });
    },
    onFailure: (error) => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
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
      $this.setState({ [name]: null, [type]: null }, () => {
        swalMessage({
          title: "From Location and To Location Cannot be Same ",
          type: "error",
        });
      });
    } else {
      $this.setState({
        [name]: value,
        [type]: e.selected.location_type,
        // requistion_type: "MR",

        addItemButton: true,
        item_category_id: null,
        item_group_id: null,
        item_id: null,
        quantity_required: 0,
        transaction_qty: null,

        item_uom: null,
        from_qtyhand: 0,
        to_qtyhand: 0,
      });
    }
  } else if (location === "To") {
    type = "to_location_type";
    if ($this.state.from_location_id === value) {
      $this.setState({ [name]: null, [type]: null }, () => {
        swalMessage({
          title: "From Location and To Location Cannot be Same ",
          type: "error",
        });
      });
    } else {
      $this.setState({
        [name]: value,
        [type]: e.selected.location_type,

        addItemButton: true,
        item_category_id: null,
        item_group_id: null,
        item_id: null,
        quantity_required: 0,
        transaction_qty: null,
        item_uom: null,
        from_qtyhand: 0,
        to_qtyhand: 0,
      });
    }
  }
};

export {
  getCtrlCode,
  ClearData,
  SaveRequisitionEntry,
  AuthorizeRequisitionEntry,
  LocationchangeTexts,
  generateMaterialReqPhar,
  requisitionEvent
};
