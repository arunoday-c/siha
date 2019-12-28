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
          if (inputs.group_id !== null) {
            inputObj.group_id = inputs.group_id;
          }

          algaehApiCall({
            uri: "/salary/getSalaryProcessToPay",
            module: "hrManagement",
            data: inputObj,
            method: "GET",
            onSuccess: response => {
              if (response.data.result.length > 0) {
                $this.setState({
                  salary_payment: response.data.result,
                  checkAll: false,
                  checkAllPayslip: false
                  // paysalaryBtn: false
                });
              } else {
                $this.setState({
                  salary_payment: [],
                  checkAll: false,
                  checkAllPayslip: false
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
    paysalaryBtn: true,
    generatePayslip: true,
    checkAll: false,
    checkAllPayslip: false
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
  const settings = { header: undefined, footer: undefined };
  algaehApiCall({
    uri: "/salary/SaveSalaryPayment",
    module: "hrManagement",
    skipParse: true,
    data: Buffer.from(JSON.stringify(inputObj), "utf8"),
    method: "PUT",
    header: {
      "content-type": "application/octet-stream",
      ...settings
    },
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

const selectAll = ($this, e) => {
  const isChecked = e.target.checked;

  let data = $this.state.salary_payment;

  const newData = data.map((item, index) => {
    return {
      ...item,
      select_to_pay: item.salary_paid === "Y" ? "N" : isChecked ? "Y" : "N"
    };
  });

  let listOfinclude = Enumerable.from(newData)
    .where(w => w.select_to_pay === "Y")
    .toArray();
  let paysalaryBtn = listOfinclude.length > 0 ? false : true;

  $this.setState({
    salary_payment: newData,
    checkAll: isChecked,
    paysalaryBtn: paysalaryBtn
  });
};

const selectAllPaySlip = ($this, e) => {
  const isChecked = e.target.checked;

  let data = $this.state.salary_payment;

  const newData = data.map((item, index) => {
    return {
      ...item,
      generate_pay_slip: isChecked ? "Y" : "N"
    };
  });

  let listOfinclude = Enumerable.from(newData)
    .where(w => w.generate_pay_slip === "Y")
    .toArray();
  let generatePayslip = listOfinclude.length > 0 ? false : true;

  $this.setState({
    salary_payment: newData,
    checkAllPayslip: isChecked,
    generatePayslip: generatePayslip
  });
};

const generatePaySlip = ($this, inputs) => {
  let salary_payment = $this.state.salary_payment;

  let input_array = [];

  for (let k = 0; k < salary_payment.length; k++) {
    if (salary_payment[k].generate_pay_slip === "Y") {
      input_array.push(salary_payment[k].employee_id);
    }
  }

  if (input_array.length <= 0) {
    swalMessage({
      title: "Select atleast one employee for pay slip",
      type: "warning"
    });
  }
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob"
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "salarySlip",
        reportParams: {
          employees: input_array,
          year: $this.state.inputs.year,
          month: $this.state.inputs.month
        },
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const url = URL.createObjectURL(res.data);
      let myWindow = window.open(
        "{{ product.metafields.google.custom_label_0 }}",
        "_blank"
      );

      myWindow.document.write(
        "<iframe src= '" + url + "' width='100%' height='100%' />"
      );
      myWindow.document.title = "Salary Slip";
    }
  });
};

const selectToGeneratePaySlip = ($this, row, e) => {
  let _salarypayment = Enumerable.from($this.state.salary_payment)
    .where(w => w.salary_paid === "Y")
    .toArray();
  // let _salarypayment = $this.state.salary_payment;
  let _index = _salarypayment.indexOf(row);
  let generatePayslip = true;
  if (e.target.checked === true) {
    row["generate_pay_slip"] = "Y";
  } else if (e.target.checked === false) {
    row["generate_pay_slip"] = "N";
  }

  _salarypayment[_index] = row;

  let listOfinclude = Enumerable.from(_salarypayment)
    .where(w => w.generate_pay_slip === "Y")
    .toArray();
  if (listOfinclude.length > 0) {
    generatePayslip = false;
  }
  $this.setState({
    generatePayslip: generatePayslip,
    salary_payment: _salarypayment
  });
};

export {
  LoadSalaryPayment,
  ClearData,
  PaySalary,
  selectToPay,
  selectAll,
  generatePaySlip,
  selectToGeneratePaySlip,
  selectAllPaySlip
};
