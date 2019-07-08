import _ from "lodash";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import RequisitionIOputs from "../../../Models/InventoryRequisition";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const requisitionEvent = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({ [name]: value });
};

const getCtrlCode = ($this, docNumber) => {
  AlgaehLoader({ show: true });

  $this.props.getRequisitionEntry({
    uri: "/inventoryrequisitionEntry/getinventoryrequisitionEntry",
    module: "inventory",
    method: "GET",
    printInput: true,
    data: { material_requisition_number: docNumber },
    redux: {
      type: "INV_REQ_ENTRY_GET_DATA",
      mappingName: "inventoryrequisitionentry"
    },
    afterSuccess: data => {
      if (
        $this.props.material_requisition_number !== undefined &&
        $this.props.material_requisition_number.length !== 0
      ) {
        data.authorizeEnable = false;
        data.ClearDisable = true;

        for (let i = 0; i < data.inventory_stock_detail.length; i++) {
          data.inventory_stock_detail[i].quantity_authorized =
            data.authorize1 === "N"
              ? data.inventory_stock_detail[i].quantity_required
              : data.inventory_stock_detail[i].quantity_authorized;

          data.inventory_stock_detail[i].quantity_outstanding =
            data.authorize1 === "N"
              ? data.inventory_stock_detail[i].quantity_required
              : data.inventory_stock_detail[i].quantity_outstanding;

          data.inventory_stock_detail[i].operation = "+";
        }
      }
      data.saveEnable = true;

      if (data.posted === "Y") {
        data.postEnable = true;
      } else {
        data.postEnable = false;
      }
      data.ItemDisable = true;
      data.addedItem = true;
      $this.setState(data, () => {});
      AlgaehLoader({ show: false });
    }
  });
};

const ClearData = ($this, e) => {
  let IOputs = RequisitionIOputs.inputParam();
  $this.setState(IOputs);
};

const SaveRequisitionEntry = $this => {
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/inventoryrequisitionEntry/addinventoryrequisitionEntry",
    module: "inventory",
    data: $this.state,
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          material_requisition_number:
            response.data.records.material_requisition_number,
          saveEnable: true
          // authorizeEnable: false
        });

        swalMessage({
          title: "Saved successfully . .",
          type: "success"
        });
      }
      AlgaehLoader({ show: false });
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

const generateMaterialReqInv = (
  material_requisition_number,
  rpt_name,
  rpt_desc
) => {
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
        reportName: "MaterialReqInv",
        reportParams: [
          {
            name: "material_requisition_number",
            value: material_requisition_number
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
      myWindow.document.title = "Material Requisition - Inventory";
    }
  });
};

const AuthorizeRequisitionEntry = ($this, authorize) => {
  let authorize1 = "";
  let authorize2 = "";
  if (authorize === "authorize1") {
    $this.state.authorize1 = "Y";
    authorize1 = "Y";
    authorize2 = "N";
  } else if (authorize === "authorize2") {
    $this.state.authorie2 = "Y";
    authorize1 = "Y";
    authorize2 = "Y";
  }
  AlgaehLoader({ show: true });

  algaehApiCall({
    uri: "/inventoryrequisitionEntry/updateinventoryrequisitionEntry",
    module: "inventory",
    data: $this.state,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success === true) {
        $this.setState({
          postEnable: true,
          authorize1: authorize1,
          authorie2: authorize2
        });
        swalMessage({
          title: "Authorized successfully . .",
          type: "success"
        });
      }
      AlgaehLoader({ show: false });
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

  if (location === "From") {
    if ($this.state.to_location_id === value) {
      swalMessage({
        title: "From Location and To Location Cannot be Same ",
        type: "error"
      });
      $this.setState({ [name]: null });
    } else {
      $this.setState({
        [name]: value,
        from_location_type: e.selected.location_type,
        requistion_type: "MR",
        to_location_id: null,
        to_location_type: null,
        from_location_name: e.selected.location_description
      });
    }
  } else if (location === "To") {
    if ($this.state.from_location_id === value) {
      swalMessage({
        title: "From Location and To Location Cannot be Same ",
        type: "error"
      });
      $this.setState({ [name]: null });
    } else {
      $this.setState({
        [name]: value,
        to_location_type: e.selected.location_type,
        to_location_name: e.selected.location_description
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
  requisitionEvent,
  generateMaterialReqInv
};
