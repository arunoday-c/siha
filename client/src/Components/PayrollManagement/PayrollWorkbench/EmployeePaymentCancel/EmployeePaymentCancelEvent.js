import { swalMessage, algaehApiCall, getCookie } from "../../../../utils/algaehApiCall.js";
import swal from "sweetalert2";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
const getEmployeePayments = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='paymentcancel'",
    onSuccess: () => {
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/employeepayments/getEmployeePayments",
        data: {
          payment_type: $this.state.sel_payment_type,
          hospital_id: $this.state.hospital_id
        },
        module: "hrManagement",
        method: "GET",
        onSuccess: response => {
          AlgaehLoader({ show: false });
          $this.setState({
            PreviousPayments: response.data.result
          });
        },
        onCatch: error => {
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
const branchHandelEvent = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  // let IOputs = EmployeePaymentIOputs.inputParam();

  $this.setState({
    // ...IOputs,
    [name]: value
  });
};
const CancelPayment = ($this, row) => {
  swal({
    title: "Are you sure?",
    text: "You want to cancel this Payment.",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      row.ScreenCode = getCookie("ScreenCode")
      algaehApiCall({
        uri: "/employeepayments/CancelEmployeePayment",
        data: row,
        module: "hrManagement",
        method: "PUT",
        onSuccess: response => {
          getEmployeePayments($this, null);
          swalMessage({
            title: "Cancelled Successfully.",
            type: "success"
          });
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

const Paymenttexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  //let IOputs = EmployeePaymentIOputs.inputParam();
  // IOputs.hospital_id = $this.state.hospital_id;
  $this.setState({
    // ...IOputs,
    [name]: value
  });
};

const PaymentOnClear = ($this, e) => {
  //let IOputs = EmployeePaymentIOputs.inputParam();
  // IOputs.hospital_id = $this.state.hospital_id;
  $this.setState({
    //  ...IOputs,
    [e]: null
  });
};
export {
  getEmployeePayments,
  CancelPayment,
  branchHandelEvent,
  Paymenttexthandle,
  PaymentOnClear
};
