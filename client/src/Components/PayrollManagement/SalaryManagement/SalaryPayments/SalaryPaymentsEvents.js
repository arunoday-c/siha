import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import moment from "moment";
import Enumerable from "linq";

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
      AlgaehLoader({ show: true });
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

      algaehApiCall({
        uri: "/salary/getSalaryProcessToPay",
        module: "hrManagement",
        data: inputObj,
        method: "GET",
        onSuccess: response => {
          if (response.data.result.length > 0) {
            $this.setState({
              salary_payment: response.data.result
              // paysalaryBtn: false
            });
          } else {
            swalMessage({
              title:
                "Salary Not Finalized for " +
                moment(
                  "1-" + $this.state.month + "-" + $this.state.year,
                  "DD-MM-YYYY"
                ).format("MMMM") +
                " " +
                $this.state.year,
              type: "warning"
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

const ClearData = $this => {
  $this.setState({
    year: moment().year(),
    month: moment(new Date()).format("M"),
    sub_department_id: null,
    salary_type: null,
    employee_name: null,
    employee_id: null,
    salary_payment: [],
    paysalaryBtn: true
  });
};

const PaySalary = $this => {
  let _salarypayment = Enumerable.from($this.state.salary_payment)
    .where(w => w.select_to_pay === "Y")
    .toArray();

  let inputObj = {
    year: $this.state.year,
    month: $this.state.month,
    salary_payment: _salarypayment
  };
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/salary/SaveSalaryPayment",
    module: "hrManagement",
    data: inputObj,
    method: "PUT",
    onSuccess: response => {
      $this.setState({
        paysalaryBtn: true
      });
      AlgaehLoader({ show: false });
      swalMessage({
        title: "Salary Payment Done...",
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

const selectToPay = ($this, row, e) => {
  let _salarypayment = $this.state.salary_payment;
  let paysalaryBtn = true;
  if (e.target.checked === true) {
    row["select_to_pay"] = "Y";
  } else if (e.target.checked === false) {
    row["select_to_pay"] = "N";
  }
  // row.update();
  _salarypayment[row.rowIdx] = row;
  // for (let k = 0; k < _criedtdetails.length; k++) {
  //   if (_criedtdetails[k].bill_header_id === row.bill_header_id) {
  //     _criedtdetails[k] = row;
  //   }
  // }

  let listOfinclude = Enumerable.from(_salarypayment)
    .where(w => w.select_to_pay === "Y")
    .toArray();
  if (listOfinclude.length > 0) {
    paysalaryBtn = false;
  }
  $this.setState({
    paysalaryBtn: paysalaryBtn,
    salary_payment: _salarypayment
  });
};

const selectAll = ($this, e) => {
  debugger;
};

export {
  texthandle,
  LoadSalaryPayment,
  employeeSearch,
  ClearData,
  PaySalary,
  selectToPay,
  selectAll
};
