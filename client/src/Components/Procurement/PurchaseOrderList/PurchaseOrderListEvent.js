import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
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
    $this.setState({ [e]: null }, () => {
      getPurchaseOrderList($this);
    });
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
  let inpObj = { po_from: $this.state.po_from, status: $this.state.status };

  if ($this.state.from_date !== null) {
    inpObj.from_date = $this.state.from_date;
  }
  if ($this.state.to_date !== null) {
    inpObj.to_date = $this.state.to_date;
  }
  if ($this.state.po_from === "PHR") {
    if ($this.state.pharmcy_location_id !== null) {
      inpObj.pharmcy_location_id = $this.state.pharmcy_location_id;
    }
  } else if ($this.state.po_from === "INV") {
    if ($this.state.inventory_location_id !== null) {
      inpObj.inventory_location_id = $this.state.inventory_location_id;
    }
  }

  // inpObj.authorize1 = "N";
  // inpObj.authorie2 = "N";

  algaehApiCall({
    uri: "/PurchaseOrderEntry/getAuthPurchaseList",
    module: "procurement",
    method: "GET",
    data: inpObj,

    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        for (let i = 0; i < data.length; i++) {
          if (data[i].authorize1 === "Y" && data[i].is_completed === "N") {
            data[i].delivery_pending = true;
          }
        }
        debugger;
        $this.setState({ purchase_list: data });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
  // $this.props.getPurchaseOrderList({
  //
  //   redux: {
  //     type: "REQ_LIST_GET_DATA",
  //     mappingName: "requisitionlist"
  //   },
  //   afterSuccess: data => {
  //     $this.setState({ requisition_list: data });
  //   }
  // });
};

const dateFormater = ($this, value) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const poforhandle = ($this, e) => {
  if (e.value === undefined) {
    $this.setState(
      {
        [e]: null,
        pharmcy_location_id: null,
        inventory_location_id: null,
        poSelected: true,
        purchase_list: []
      },
      () => {
        $this.props.getLocation({
          redux: {
            type: "LOCATIONS_GET_DATA",
            mappingName: "polocations",
            data: []
          }
        });
      }
    );
  } else {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    if ($this.state.po_from !== value) {
      $this.setState(
        {
          [name]: value,
          pharmcy_location_id: null,
          inventory_location_id: null,
          poSelected: false,
          status: "1"
        },
        () => {
          getData($this);
          getPurchaseOrderList($this);
        }
      );
    }
  }
};

const getData = $this => {
  if ($this.state.po_from === "PHR") {
    $this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "polocations"
      }
    });
  } else if ($this.state.po_from === "INV") {
    $this.props.getLocation({
      uri: "/inventory/getInventoryLocation",
      module: "inventory",
      method: "GET",
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "polocations"
      }
    });
  }
};

const datehandle = ($this, ctrl, e) => {
  let intFailure = false;
  if (e === "from_date") {
    if (Date.parse($this.state.to_date) < Date.parse(moment(ctrl)._d)) {
      intFailure = true;
      swalMessage({
        title: "From Date cannot be grater than To Date.",
        type: "warning"
      });
    }
  } else if (e === "to_date") {
    if (Date.parse(moment(ctrl)._d) < Date.parse($this.state.from_date)) {
      intFailure = true;
      swalMessage({
        title: "To Date cannot be less than From Date.",
        type: "warning"
      });
    }
  }

  if (intFailure === false) {
    $this.setState(
      {
        [e]: moment(ctrl)._d
      },
      () => {
        if ($this.state.po_from !== null) {
          getPurchaseOrderList($this);
        }
      }
    );
  }
};

const changeEventHandaler = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value }, () => {
    getPurchaseOrderList($this);
  });
};

export {
  LocationchangeTexts,
  dateFormater,
  texthandle,
  poforhandle,
  datehandle,
  changeEventHandaler
};
