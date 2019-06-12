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
        data.ItemDisable = true;
        data.ClearDisable = true;

        for (let i = 0; i < data.inventory_stock_detail.length; i++) {
          data.inventory_stock_detail[i].quantity_authorized =
            data.inventory_stock_detail[i].quantity_required;

          data.inventory_stock_detail[i].quantity_outstanding =
            data.inventory_stock_detail[i].quantity_required;

          data.inventory_stock_detail[i].operation = "+";
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
    }
  });
};

const AuthorizeRequisitionEntry = ($this, authorize) => {
  
  // const auth_qty = _.filter(
  //   $this.state.inventory_stock_detail,
  //   f => {
  //     return (
  //       f.quantity_authorized === 0 ||
  //       f.quantity_authorized === null
  //     );
  //   }
  // );

  // if(auth_qty.length > 0){
  //   swalMessage({
  //     title: "Please enter Quantity Authorized ..",
  //     type: "warning"
  //   });
  //   return
  // }

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
      // let requistion_type = "";

      // if (e.selected.location_type === "MS") {
      //   requistion_type = "MR";
      // } else if (e.selected.location_type === "SS") {
      //   requistion_type = "MR";
      // }
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
  requisitionEvent
};
