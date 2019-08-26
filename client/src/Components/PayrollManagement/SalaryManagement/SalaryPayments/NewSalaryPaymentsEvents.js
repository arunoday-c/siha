import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import moment from "moment";
import Enumerable from "linq";

const LoadSalaryPayment = ($this, inputs) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='loadSalary'",
    onSuccess: () => {
      AlgaehLoader({ show: true });
      $this.setState(
        prevState => {
          return { inputs: !inputs ? prevState.inputs : inputs };
        },
        () => {
          inputs = $this.state.inputs;
          let inputObj = {
            year: inputs.year,
            month: inputs.month
          };

          if (inputs.hims_d_employee_id !== null) {
            inputObj.employee_id = inputs.hims_d_employee_id;
          }

          if (inputs.sub_department_id !== null) {
            inputObj.sub_department_id = inputs.sub_department_id;
          }

          if (inputs.department_id !== null) {
            inputObj.department_id = inputs.department_id;
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
                $this.setState({
                  salary_payment: []
                });
                swalMessage({
                  title: `Salary Not Finalized for ${moment(
                    "1-" + inputs.month + "-" + inputs.year,
                    "DD-MM-YYYY"
                  ).format("MMMM")} ${inputs.year}`,
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
      );
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
    year: $this.state.inputs.year,
    month: $this.state.inputs.month,
    salary_payment: _salarypayment
  };
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/salary/SaveSalaryPayment",
    module: "hrManagement",
    data: inputObj,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        $this.setState({
          paysalaryBtn: true
        });
        AlgaehLoader({ show: false });
        swalMessage({
          title: "Salary Payment Done...",
          type: "success"
        });
        LoadSalaryPayment($this, null);
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

export { LoadSalaryPayment, ClearData, PaySalary, selectToPay };
