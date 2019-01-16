import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const LoadSalaryPayment = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='loadSalary'",
    onSuccess: () => {
      debugger;
      let inputObj = {
        year: $this.state.year,
        month: $this.state.month
      };

      if ($this.state.employee_id !== null) {
        inputObj.employee_id = $this.state.employee_id;
      }

      if ($this.state.sub_department_id !== null) {
        inputObj.sub_department_id = $this.state.sub_department_id;
      }
      debugger;
      algaehApiCall({
        uri: "/salary/getSalaryProcessToPay",
        module: "hrManagement",
        data: inputObj,
        method: "GET",
        onSuccess: response => {
          debugger;
          if (response.data.result.length > 0) {
            $this.setState({
              salary_payment: response.data.result
            });
          } else {
            swalMessage({
              title: "No Salary Processed for selected month and year.",
              type: "warning"
            });
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message || error.response.data.message,
            type: "error"
          });
        }
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

export { texthandle, LoadSalaryPayment, employeeSearch };
