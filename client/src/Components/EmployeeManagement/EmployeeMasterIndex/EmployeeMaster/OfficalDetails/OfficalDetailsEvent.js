import moment from "moment";
import Options from "../../../../../Options.json";
import { swalMessage } from "../../../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let _notice = {};

  if (name === "notice_period") {
    if (
      $this.state.date_of_resignation === null ||
      $this.state.date_of_resignation === ""
    ) {
      swalMessage({
        type: "error",
        title: $this.state.date_of_releaving_label + " can not blank"
      });
      return;
    }
    _notice = {
      reliving_date: moment($this.state.date_of_resignation).add(value, "days")
        ._d
    };
  }

  $this.setState({
    [name]: value,
    ..._notice
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    [name]: value,
    ..._notice
  });
};

const accomodationProvided = ($this, e) => {
  $this.setState({
    [e.target.name]: e.target.checked ? "Y" : "N"
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    [e.target.name]: e.target.checked ? "Y" : "N"
  });
};

const datehandle = ($this, ctrl, e) => {
  let _notice = {};
  if (e === "date_of_resignation") {
    if ($this.state.notice_period !== null) {
      _notice = {
        reliving_date: moment(ctrl).add(
          parseFloat($this.state.notice_period),
          "days"
        )._d
      };
    }
  }
  $this.setState({
    [e]: ctrl,
    ..._notice
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    [e]: ctrl,
    ..._notice
  });
};
const employeeStatusHandler = ($this, e) => {
  debugger;
  let _enable_active_status = "";
  let _date_of_releaving = "";
  let _other = {};
  if (e.value === "A") {
    _enable_active_status = "A";
    _date_of_releaving = "Date of leaving";
  } else if (e.value === "I") {
    _enable_active_status = "I";
    _date_of_releaving = "Date of leaving";
    _other = { inactive_date: new Date() };
  } else if (e.value === "R") {
    _enable_active_status = "R";
    _date_of_releaving = "Date of Reliving";
  } else if (e.value === "T") {
    _enable_active_status = "T";
    _date_of_releaving = "Date of Terminating";
  } else if (e.value === "E") {
    _enable_active_status = "E";
    _date_of_releaving = "Date of Retirement";
  }
  $this.setState({
    enable_active_status: e.value,
    date_of_releaving_label: _date_of_releaving,
    employee_status: e.value,
    ..._other
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    employee_status: e.value,
    ..._other
  });
};

const dateFormater = ($this, value) => {
  if (value !== null) {
    return String(moment(value).format(Options.dateFormat));
  }
};

export {
  texthandle,
  datehandle,
  accomodationProvided,
  employeeStatusHandler,
  dateFormater
};
