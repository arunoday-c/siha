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

const getSalaryDetails = ($this, row) => {
  debugger;
  const salaryprocess_Earning = Enumerable.from(
    $this.state.salaryprocess_detail[0]
  )
    .where(w => w.salary_header_id === row.hims_f_salary_id)
    .toArray();

  const salaryprocess_Deduction = Enumerable.from(
    $this.state.salaryprocess_detail[1]
  )
    .where(w => w.salary_header_id === row.hims_f_salary_id)
    .toArray();

  const salaryprocess_Contribute = Enumerable.from(
    $this.state.salaryprocess_detail[2]
  )
    .where(w => w.salary_header_id === row.hims_f_salary_id)
    .toArray();

  $this.setState({
    salaryprocess_Earning: salaryprocess_Earning,
    salaryprocess_Deduction: salaryprocess_Deduction,
    salaryprocess_Contribute: salaryprocess_Contribute
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

const FinalizeSalary = $this => {
  debugger;
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/salary/finalizedSalaryProcess",
    module: "hrManagement",
    data: $this.state.salaryprocess_header,
    method: "PUT",
    onSuccess: response => {
      debugger;
      $this.setState({
        finalizeBtn: true
      });
      AlgaehLoader({ show: false });
      swalMessage({
        title: "Finalized Successfully...",
        type: "success"
      });
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

export {
  texthandle,
  getSalaryDetails,
  FinalizeSalary,
  ClearData,
  employeeSearch,
  dateFormater
};
