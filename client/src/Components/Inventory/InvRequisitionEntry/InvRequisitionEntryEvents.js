import AlgaehLoader from "../../Wrapper/fullPageLoader";
import RequisitionIOputs from "../../../Models/InventoryRequisition";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import Enumerable from "linq";
import { RawSecurityComponent } from "algaeh-react-components";

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
      uri: "/inventoryrequisitionEntry/getinventoryrequisitionEntry",
      module: "inventory",
      method: "GET",
      printInput: true,
      data: { material_requisition_number: docNumber },
      redux: {
        type: "INV_REQ_ENTRY_GET_DATA",
        mappingName: "inventoryrequisitionentry",
      },
      afterSuccess: (data) => {
        data.cannotDelete = true;
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
        $this.setState(data, () => { });
        AlgaehLoader({ show: false });
      },
    });
  });
};

const ClearData = ($this, e) => {
  let IOputs = RequisitionIOputs.inputParam();
  let bothExisits = true;
  RawSecurityComponent({ componentCode: "MET_REQ_INVENTORY" }).then(
    (result) => {
      if (result === "show") {
        bothExisits = false;
        IOputs.requistion_type = "MR";
      }
    }
  );

  RawSecurityComponent({ componentCode: "PUR_REQ_INVENTORY" }).then(
    (result) => {
      if (result === "show") {
        IOputs.requistion_type = "PR";
        IOputs.bothExisits = bothExisits === false ? false : true;
        $this.setState(IOputs);
      } else {
        $this.setState(IOputs);
      }
    }
  );
};

const SaveRequisitionEntry = ($this) => {
  AlgaehLoader({ show: true });
  let InputObj = $this.state;

  InputObj.authorize1 = $this.state.requisition_auth_level === "N" ? "Y" : "N";
  InputObj.authorie2 = $this.state.requisition_auth_level === "N" ? "Y" : "N";
  algaehApiCall({
    uri: "/inventoryrequisitionEntry/addinventoryrequisitionEntry",
    module: "inventory",
    data: InputObj,
    onSuccess: (response) => {
      if (response.data.success === true) {
        $this.setState({
          material_requisition_number:
            response.data.records.material_requisition_number,
          saveEnable: true,
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

const generateMaterialReqInv = (data, rpt_name, rpt_desc) => {
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
        reportName:
          data.requistion_type === "MR" ? "MaterialReqInv" : "PurchaseReqInv",

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
      const reportName = `${data.material_requisition_number}-Material Requisition - Inventory`;

      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename= ${reportName}`;
      window.open(origin);
      // window.document.title = "Material Requisition - Inventory";
    },
  });
};

const AuthorizeRequisitionEntry = ($this, authorize) => {
  let auth_qty = Enumerable.from($this.state.inventory_stock_detail).any(
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
      $this.state.authorie2 = "Y";
      $this.state.authorize1 = "Y";
      authorize1 = "Y";
      authorize2 = "Y";
    }
  }
  AlgaehLoader({ show: true });

  algaehApiCall({
    uri: "/inventoryrequisitionEntry/updateinventoryrequisitionEntry",
    module: "inventory",
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

  if (location === "From") {
    if ($this.state.to_location_id === value) {
      $this.setState({ [name]: null, from_location_type: null }, () => {
        swalMessage({
          title: "From Location and To Location Cannot be Same ",
          type: "error",
        });
      });
    } else {
      $this.setState({
        [name]: value,
        from_location_type: e.selected.location_type,
        // requistion_type: "MR",
        from_location_name: e.selected.location_description,

        item_category_id: null,
        item_group_id: null,
        item_id: null,
        quantity_required: 0,
        barcode: null,
        item_uom: null,
        transaction_qty: null,
        from_qtyhand: 0,
        to_qtyhand: 0,
      });
    }
  } else if (location === "To") {
    if ($this.state.from_location_id === value) {
      $this.setState({ [name]: null, to_location_type: null }, () => {
        swalMessage({
          title: "From Location and To Location Cannot be Same ",
          type: "error",
        });
      });
    } else {
      $this.setState({
        [name]: value,
        to_location_type: e.selected.location_type,
        to_location_name: e.selected.location_description,

        item_category_id: null,
        item_group_id: null,
        item_id: null,
        quantity_required: 0,
        barcode: null,
        item_uom: null,
        transaction_qty: null,
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
  requisitionEvent,
  generateMaterialReqInv,
};
