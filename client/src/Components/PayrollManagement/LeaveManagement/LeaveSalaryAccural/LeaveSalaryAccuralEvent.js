import Enumerable from "linq";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import moment from "moment";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const employeeSearch = $this => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Employee_details.employee
    },
    searchName: "employee",
    uri: "/gloabelSearch/get",

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

const LoadLeaveAccrual = $this => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='loadLeaveAccrual'",
    onSuccess: () => {
      AlgaehLoader({ show: true });

      let inputObj = {
        year: $this.state.year,
        month: $this.state.month
      };

      if ($this.state.employee_id !== null) {
        inputObj.employee_id = $this.state.employee_id;
      }

      algaehApiCall({
        uri: "/leavesalaryaccural/getLeaveSalaryAccural",
        module: "hrManagement",
        data: inputObj,
        method: "GET",
        onSuccess: response => {
          if (response.data.success) {
            let leave_salary = Enumerable.from(response.data.result).sum(s =>
              parseFloat(s.leave_salary)
            );

            let airfair_amount = Enumerable.from(response.data.result).sum(s =>
              parseFloat(s.airfare_amount)
            );

            $this.setState({
              leave_salary_accrual: response.data.result,
              leave_salary: leave_salary,
              airfair_amount: airfair_amount
            });
          }

          AlgaehLoader({ show: false });
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

const ClearData = $this => {
  $this.setState({
    year: moment().year(),
    month: moment(new Date()).format("M"),
    employee_id: null,
    employee_name: null,
    leave_salary_accrual: [],
    leave_salary: null,
    airfair_amount: null
  });
};
export { texthandle, LoadLeaveAccrual, employeeSearch, ClearData };
