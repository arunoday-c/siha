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
          title: "Invalid Input.From Location and To Location Cannot be Same ",
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
          title: "Invalid Input.From Location and To Location Cannot be Same ",
          type: "error"
        });
        $this.setState({ [name]: null });
      } else if ($this.state.from_location_id === null) {
        swalMessage({
          title: "Invalid Input.From Location cannot be blank. ",
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
  let inpObj = {};
  if ($this.state.from_location_id !== null) {
    inpObj.from_location_id = $this.state.from_location_id;
  }
  if ($this.state.to_location_id !== null) {
    inpObj.to_location_id = $this.state.to_location_id;
  }

  if ($this.state.authorize1 === "Y") {
    inpObj.authorize1 = "N";
  }
  if ($this.state.authorie2 === "Y") {
    inpObj.authorize1 = "Y";
    inpObj.authorie2 = "N";
  }

  // inpObj.authorize1 = "N";
  // inpObj.authorie2 = "N";
  $this.props.getRequisitionList({
    uri: "/requisitionEntry/getAuthrequisitionList",
    module: "pharmacy",
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

export { LocationchangeTexts, dateFormater, radioChange };
