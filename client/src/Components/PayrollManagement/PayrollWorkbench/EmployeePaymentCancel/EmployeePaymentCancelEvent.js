import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
import swal from "sweetalert2";

const getEmployeePayments = $this => {
  algaehApiCall({
    uri: "/employeepayments/getEmployeePayments",
    module: "hrManagement",
    method: "GET",
    onSuccess: response => {
      $this.setState({
        PreviousPayments: response.data.result
      });
    },
    onFailure: error => {
      swalMessage({
        title: error.message || error.response.data.message,
        type: "error"
      });
    }
  });
};

const CancelPayment = ($this, row) => {
  swal({
    title: "Are you sure you want to cancel this Payment?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      algaehApiCall({
        uri: "/employeepayments/CancelEmployeePayment",
        data: row,
        module: "hrManagement",
        method: "PUT",
        onSuccess: response => {
          getEmployeePayments($this);
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

export { getEmployeePayments, CancelPayment };
