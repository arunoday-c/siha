// import Enumerable from "linq";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const LoadData = ($this, e) => {
  debugger;
  let inputObj = {
    start_month: $this.state.month,
    start_year: $this.state.year,
    loan_authorized: "APR"
  };
  if ($this.state.select_employee_id !== null) {
    inputObj.employee_id = $this.state.select_employee_id;
  }

  if ($this.state.payment_type === "AD") {
  } else if ($this.state.payment_type === "LN") {
    if ($this.state.document_num !== null) {
      inputObj.loan_application_number = $this.state.document_num;
    }

    algaehApiCall({
      uri: "/employeepayments/getLoanTopayment",
      module: "hrManagement",
      data: inputObj,
      method: "GET",
      onSuccess: response => {
        $this.setState({
          requestPayment: response.data.result
        });
      },
      onFailure: error => {
        swalMessage({
          title: error.response.data.message,
          type: "error"
        });
      }
    });
  } else if ($this.state.payment_type === "EN") {
  } else if ($this.state.payment_type === "GR") {
  } else if ($this.state.payment_type === "FS") {
  } else if ($this.state.payment_type === "LS") {
  }
};
export { texthandle, LoadData };
