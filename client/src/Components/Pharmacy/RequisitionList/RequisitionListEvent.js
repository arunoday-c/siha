import { swalMessage } from "../../../utils/algaehApiCall";
import moment from "moment";
import Options from "../../../Options.json";

const LocationchangeTexts = ($this, location, ctrl, e) => {
  debugger;
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
  debugger;
  let inpObj = {};
  if ($this.state.from_location_id !== null) {
    inpObj.from_location_id = $this.state.from_location_id;
  }
  if ($this.state.to_location_id !== null) {
    inpObj.to_location_id = $this.state.to_location_id;
  }

  // inpObj.authorize1 = "N";
  // inpObj.authorie2 = "N";
  $this.props.getRequisitionList({
    uri: "/requisitionEntry/getAuthrequisitionList",
    method: "GET",
    printInput: true,
    data: inpObj,
    redux: {
      type: "REQ_LIST_GET_DATA",
      mappingName: "requisitionlist"
    },
    afterSuccess: data => {
      debugger;

      $this.setState({ requisition_list: data });
    }
  });
};

const dateFormater = ({ $this, value }) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

export { LocationchangeTexts, dateFormater };
