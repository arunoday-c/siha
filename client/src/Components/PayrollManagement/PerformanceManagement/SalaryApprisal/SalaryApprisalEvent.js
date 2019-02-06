import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";

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
          getEmpEarningComponents($this);
          getEmpDeductionComponents($this);
          getEmpContibuteComponents($this);
        }
      );
    }
  });
};

const getEmpEarningComponents = $this => {
  algaehApiCall({
    uri: "/employee/getEmpEarningComponents",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: $this.state.employee_id },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        for (let i = 0; i < data.length; i++) {
          data[i].py_amount = parseFloat(data[i].amount) * 12;
        }
        if (data.length > 0) {
          $this.setState({
            earningComponents: data
          });
        }
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

const getEmpDeductionComponents = $this => {
  algaehApiCall({
    uri: "/employee/getEmpDeductionComponents",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: $this.state.employee_id },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        for (let i = 0; i < data.length; i++) {
          data[i].py_amount = parseFloat(data[i].amount) * 12;
        }
        if (data.length > 0) {
          $this.setState({
            deductioncomponents: data
          });
        }
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
const getEmpContibuteComponents = $this => {
  algaehApiCall({
    uri: "/employee/getEmpContibuteComponents",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: $this.state.employee_id },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        for (let i = 0; i < data.length; i++) {
          data[i].py_amount = parseFloat(data[i].amount) * 12;
        }
        if (data.length > 0) {
          $this.setState({
            contributioncomponents: data
          });
        }
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

export {
  employeeSearch,
  getEmpEarningComponents,
  getEmpDeductionComponents,
  getEmpContibuteComponents
};
