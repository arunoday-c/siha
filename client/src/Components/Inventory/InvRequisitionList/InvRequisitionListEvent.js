import { swalMessage } from "../../../utils/algaehApiCall";
import moment from "moment";
import Options from "../../../Options.json";

const LocationchangeTexts = ($this, location, ctrl, e) => {
  e = ctrl || e;

  if (e.value === undefined) {
    $this.setState({ [e]: null });
  } else {
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
        $this.setState({ [name]: value }, () => {
          getRequisitionList($this);
        });
      }
    } else if (location === "To") {
      if ($this.state.from_location_id === value) {
        swalMessage({
          title: "From Location and To Location Cannot be Same ",
          type: "error"
        });
        $this.setState({ [name]: null });
      } else if ($this.state.from_location_id === null) {
        swalMessage({
          title: "From Location cannot be blank. ",
          type: "error"
        });
        $this.setState({ [name]: null });
      } else {
        $this.setState({ [name]: value }, () => {
          getRequisitionList($this);
        });
      }
    }
  }
};

const getRequisitionList = $this => {
  
  let inpObj = { status: $this.state.status };

  if ($this.state.from_date !== null) {
    inpObj.from_date = $this.state.from_date;
  }
  if ($this.state.to_date !== null) {
    inpObj.to_date = $this.state.to_date;
  }

  if ($this.state.from_location_id !== null) {
    inpObj.from_location_id = $this.state.from_location_id;
  }
  if ($this.state.to_location_id !== null) {
    inpObj.to_location_id = $this.state.to_location_id;
  }

  // if ($this.state.authorize1 === "Y") {
  //   inpObj.authorize1 = "N";
  // }
  // if ($this.state.authorie2 === "Y") {
  //   inpObj.authorize1 = "Y";
  //   inpObj.authorie2 = "N";
  // }

  // inpObj.authorize1 = "N";
  // inpObj.authorie2 = "N";
  $this.props.getRequisitionList({
    uri: "/inventoryrequisitionEntry/getinventoryAuthrequisitionList",
    module: "inventory",
    method: "GET",
    data: inpObj,
    redux: {
      type: "INV_REQ_LIST_GET_DATA",
      mappingName: "inventoryrequisitionlist"
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

const radioChange = ($this, e) => {
  let value = e.target.value;
  let radioNo, radioYes;
  let authorize1 = "N";
  let authorie2 = "N";
  if (value === "1") {
    radioNo = false;
    radioYes = true;
    authorize1 = "Y";
    authorie2 = "N";
  } else {
    radioNo = true;
    radioYes = false;
    authorize1 = "N";
    authorie2 = "Y";
  }

  $this.setState(
    {
      radioYes: radioYes,
      radioNo: radioNo,
      authorize1: authorize1,
      authorie2: authorie2
    },
    () => {
      if ($this.state.from_location_id !== null) {
        getRequisitionList($this);
      }
    }
  );
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
        getRequisitionList($this);
      }
    );
  }
};

const changeEventHandaler = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value }, () => {
    getRequisitionList($this);
  });
};

export {
  LocationchangeTexts,
  dateFormater,
  radioChange,
  getRequisitionList,
  datehandle,
  changeEventHandaler
};
