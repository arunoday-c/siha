import Enumerable from "linq";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import moment from "moment";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import Options from "../../../../Options.json";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const getLeaveSalaryProcess = ($this, e) => {
  AlgaehLoader({ show: true });

  let inputObj = {
    employee_id: $this.state.employee_id
  };

  debugger;
  algaehApiCall({
    uri: "/leavesalaryprocess/getLeaveSalaryProcess",
    module: "hrManagement",
    data: inputObj,
    method: "GET",
    onSuccess: response => {
      debugger;
      AlgaehLoader({ show: false });
      let data = response.data.result;

      data.ProcessBtn = false;
      $this.setState(data);
    },
    onFailure: error => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message || error.response.data.message,
        type: "error"
      });
    }
  });
};

const ClearData = $this => {
  $this.setState({
    year: moment().year(),
    month: moment(new Date()).format("M"),
    sub_department_id: null,
    employee_id: null,
    employee_name: null,
    hospital_id: null,
    ProcessBtn: true,
    encash_type: null,
    PayBtn: true
  });
};

const employeeSearch = $this => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Employee_details.employee
    },
    searchName: "employee",
    uri: "/gloabelSearch/get",
    inputs: "leave_salary_process = 'Y'",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      $this.setState(
        {
          employee_name: row.full_name,
          employee_id: row.hims_d_employee_id
        },
        () => {
          getLeaveSalaryProcess($this);
        }
      );
    }
  });
};

const dateFormater = value => {
  if (value !== null) {
    return String(moment(value).format(Options.dateFormat));
  }
};

const LeaveSalProcess = $this => {
  // let year = moment($this.state.leave_end_date).year();
  // let month = moment($this.state.leave_end_date).format("M");
  // let yearMonth = year + "-" + month + "-01";

  let inputObj = {
    hims_d_employee_id: $this.state.employee_id,
    leave_start_date: $this.state.leave_start_date,
    leave_end_date: $this.state.leave_end_date
  };
  debugger;

  algaehApiCall({
    uri: "/leavesalaryprocess/processLeaveSalary",
    method: "GET",
    module: "hrManagement",
    data: inputObj,
    onSuccess: response => {
      debugger;
      if (response.data.success) {
      } else if (!response.data.success) {
        swalMessage({
          title: response.data.result.message,
          type: "error"
        });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

export { texthandle, ClearData, employeeSearch, dateFormater, LeaveSalProcess };
