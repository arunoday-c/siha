import moment from "moment";
import Options from "../../../../../Options.json";
import { swalMessage } from "../../../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let _notice = {};
  switch (name) {
    case "notice_period":
      if (
        $this.state.date_of_resignation === null ||
        $this.state.date_of_resignation === ""
      ) {
        swalMessage({
          type: "error",
          title: $this.state.date_of_releaving_label + " cannot blank",
        });
        return;
      }
      const res_date = moment($this.state.date_of_resignation).add(
          value,
          "days"
        )._d,
        _notice = {
          reliving_date: res_date,
          exit_date: res_date,

          [name]: value,
        };
      $this.setState(_notice);
      break;
    case "sub_department_id":
      $this.setState({
        [name]: value,
        department_name: e.selected.department_name,
        ..._notice,
      });
      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        [name]: value,
        department_name: e.selected.department_name,
        ..._notice,
      });
      break;
    case "employee_group_id":
      $this.setState({
        [name]: value,
        monthly_accrual_days: e.selected.monthly_accrual_days,
        ..._notice,
      });
      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        [name]: value,
        monthly_accrual_days: e.selected.monthly_accrual_days,
        ..._notice,
      });
      break;

    case "appointment_type":
      $this.setState({
        [name]: value,
        agency_id: null,
      });
      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        [name]: value,
        agency_id: null,
      });
      break;

    default:
      $this.setState({
        [name]: value,
        ..._notice,
      });
      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        [name]: value,
        ..._notice,
      });
      break;
  }
};

const accomodationProvided = ($this, e) => {
  $this.setState({
    [e.target.name]: e.target.checked ? "Y" : "N",
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    [e.target.name]: e.target.checked ? "Y" : "N",
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
        )._d,
        exit_date: moment(ctrl).add(
          parseFloat($this.state.notice_period),
          "days"
        )._d,
      };
    }
  }
  let selected_date = moment(ctrl, "YYYY-MM-DD", true).isValid();
  $this.setState({
    [e]: selected_date === true ? ctrl : null,
    ..._notice,
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    [e]: selected_date === true ? ctrl : null,
    ..._notice,
  });
};
const employeeStatusHandler = ($this, e) => {
  let _date_of_releaving = "";
  let _other = {};
  if (e.value === "A") {
    _date_of_releaving = "Date of leaving";
  } else if (e.value === "I") {
    _date_of_releaving = "Date of leaving";
    _other = { inactive_date: new Date() };
  } else if (e.value === "R") {
    _date_of_releaving = "Date of Reliving";
  } else if (e.value === "T") {
    _date_of_releaving = "Date of Terminating";
  } else if (e.value === "E") {
    _date_of_releaving = "Date of Retirement";
  }
  $this.setState({
    enable_active_status: e.value,
    date_of_releaving_label: _date_of_releaving,
    employee_status: e.value,
    exit_date: null,
    date_of_resignation: null,
    reliving_date: null,
    ..._other,
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    employee_status: e.value,
    exit_date: null,
    date_of_resignation: null,
    reliving_date: null,
    ..._other,
  });
};

const dateFormater = ($this, value) => {
  if (value !== null) {
    return String(moment(value).format(Options.dateFormat));
  }
};

const bankEventhandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({
    [name]: value,
    employee_bank_ifsc_code: e.selected.bank_code,
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    [name]: value,
    employee_bank_ifsc_code: e.selected.bank_code,
  });
};

const otEntitleHandaler = ($this, e) => {
  $this.setState({
    [e.target.name]: e.target.checked ? "Y" : "N",
    overtime_group_id: null,
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    [e.target.name]: e.target.checked ? "Y" : "N",
    overtime_group_id: null,
  });
};

const ondiscountChange = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  if (parseFloat(value) > 100) {
    swalMessage({
      title: "Discount % cannot be greater than 100.",
      type: "warning",
    });
    value = 0;
  }
  $this.setState({
    [name]: value,
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    [name]: value,
  });
};

export {
  texthandle,
  datehandle,
  accomodationProvided,
  employeeStatusHandler,
  dateFormater,
  bankEventhandle,
  otEntitleHandaler,
  ondiscountChange,
};
