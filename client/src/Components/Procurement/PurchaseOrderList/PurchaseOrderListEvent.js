import { swalMessage } from "../../../utils/algaehApiCall";
import moment from "moment";
import Options from "../../../Options.json";

const texthandle = ($this, e) => {
  if (e.value === undefined) {
    $this.setState({ [e]: null });
  } else {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    $this.setState({
      [name]: value
    });
  }
};

const LocationchangeTexts = ($this, ctrl, e) => {
  e = ctrl || e;

  if (e.value === undefined) {
    $this.setState({ [e]: null });
  } else {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    $this.setState({ [name]: value }, () => {
      getPurchaseOrderList($this);
    });
  }
};

const getPurchaseOrderList = $this => {
  debugger;
  let inpObj = {};

  if ($this.state.po_from === "PHR") {
    inpObj.pharmcy_location_id = $this.state.pharmcy_location_id;
  } else {
    inpObj.inventory_location_id = $this.state.inventory_location_id;
  }

  // inpObj.authorize1 = "N";
  // inpObj.authorie2 = "N";
  $this.props.getPurchaseOrderList({
    uri: "/PurchaseOrderEntry/getAuthPurchaseList",
    method: "GET",
    data: inpObj,
    redux: {
      type: "REQ_LIST_GET_DATA",
      mappingName: "requisitionlist"
    },
    afterSuccess: data => {
      $this.setState({ requisition_list: data });
    }
  });
};

const dateFormater = ($this, value) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const poforhandle = ($this, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value
    },
    () => {
      getData($this);
    }
  );
};

const getData = $this => {
  if ($this.state.po_from === "PHR") {
    $this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      method: "GET",
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "polocations"
      }
    });
  } else if ($this.state.po_from === "INV") {
    $this.props.getLocation({
      uri: "/inventory/getInventoryLocation",
      method: "GET",
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "polocations"
      }
    });
  }
};

export { LocationchangeTexts, dateFormater, texthandle, poforhandle };
