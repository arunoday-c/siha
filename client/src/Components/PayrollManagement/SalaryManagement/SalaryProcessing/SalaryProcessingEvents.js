import Enumerable from "linq";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import moment from "moment";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const SalaryProcess = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='loadSalary'",
    onSuccess: () => {
      AlgaehLoader({ show: true });

      let inputObj = {
        year: $this.state.year,
        month: $this.state.month,
        hospital_id: $this.state.hospital_id
      };
      if ($this.state.employee_id !== null) {
        inputObj.employee_id = $this.state.employee_id;
      }

      if ($this.state.sub_department_id !== null) {
        inputObj.sub_department_id = $this.state.sub_department_id;
      }

      debugger;
      algaehApiCall({
        uri: "/salary/processSalary",
        module: "hrManagement",
        data: inputObj,
        method: "GET",
        onSuccess: response => {
          debugger;
          if (response.data.result.length > 0) {
            let data = response.data.result[0];
            let finalizeBtn = true;
            let strMessage = "Salary Already Processed...";
            let not_process = Enumerable.from(data.salaryprocess_header)
              .where(w => w.salary_processed === "N")
              .toArray();
            if (not_process.length > 0) {
              finalizeBtn = false;
              strMessage = "Salary Loaded Successfully...";
            }
            $this.setState({
              salaryprocess_header: data.salaryprocess_header,
              salaryprocess_detail: data.salaryprocess_detail,
              finalizeBtn: finalizeBtn
            });
            AlgaehLoader({ show: false });

            swalMessage({
              title: strMessage,
              type: "success"
            });
          } else {
            AlgaehLoader({ show: false });
            swalMessage({
              title: "Invalid. Please process attendence",
              type: "error"
            });
          }
        },
        onFailure: error => {
          AlgaehLoader({ show: false });
          swalMessage({
            title: error.message || error.response.data.message,
            type: "error"
          });
        }
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
    salary_type: null,
    salaryprocess_header: [],
    salaryprocess_Earning: [],
    salaryprocess_Deduction: [],
    salaryprocess_Contribute: [],
    finalizeBtn: true,
    employee_id: null,
    employee_name: null,
    hospital_id: null
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
    inputs:
      $this.state.sub_department_id !== null
        ? "sub_department_id = " + $this.state.sub_department_id
        : "1=1",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      $this.setState({
        employee_name: row.full_name,
        employee_id: row.hims_d_employee_id
      });
    }
  });
};

export {
  texthandle,
  SalaryProcess,
  getSalaryDetails,
  FinalizeSalary,
  ClearData,
  employeeSearch
};
