// import Enumerable from "linq";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import EmployeePaymentIOputs from "../../../../Models/EmployeePayment";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import swal from "sweetalert2";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const Paymenttexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let IOputs = EmployeePaymentIOputs.inputParam();

  IOputs.PreviousPayments = $this.state.PreviousPayments;
  $this.setState({
    ...IOputs,
    [name]: value
  });
};

const LoadData = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='loadData'",
    onSuccess: () => {
      AlgaehLoader({ show: true });
      let inputObj = {
        loan_authorized: "APR"
      };
      if ($this.state.select_employee_id !== null) {
        inputObj.employee_id = $this.state.select_employee_id;
      }

      if ($this.state.hospital_id !== null) {
        inputObj.hospital_id = $this.state.hospital_id;
      }

      if ($this.state.sel_payment_type === "AD") {
        if ($this.state.document_num !== null) {
          inputObj.advance_number = $this.state.document_num;
        }

        algaehApiCall({
          uri: "/employeepayments/getAdvanceTopayment",
          module: "hrManagement",
          data: inputObj,
          method: "GET",
          onSuccess: response => {
            $this.setState({
              requestPayment: response.data.result
            });
            AlgaehLoader({ show: false });
          },
          onFailure: error => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: error.response.data.message,
              type: "error"
            });
          }
        });
      } else if ($this.state.sel_payment_type === "LN") {
        if ($this.state.document_num !== null) {
          inputObj.loan_application_number = $this.state.document_num;
        }

        algaehApiCall({
          uri: "/employeepayments/getLoanTopayment",
          module: "hrManagement",
          data: inputObj,
          method: "GET",
          onSuccess: response => {
            AlgaehLoader({ show: false });
            $this.setState({
              requestPayment: response.data.result
            });
          },
          onFailure: error => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: error.response.data.message,
              type: "error"
            });
          }
        });
      } else if ($this.state.sel_payment_type === "EN") {
        if ($this.state.document_num !== null) {
          inputObj.encashment_number = $this.state.document_num;
        }

        algaehApiCall({
          uri: "/employeepayments/getEncashLeavesTopayment",
          module: "hrManagement",
          data: inputObj,
          method: "GET",
          onSuccess: response => {
            $this.setState({
              requestPayment: response.data.result
            });
            AlgaehLoader({ show: false });
          },
          onFailure: error => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: error.response.data.message,
              type: "error"
            });
          }
        });
      } else if ($this.state.sel_payment_type === "GR") {
        AlgaehLoader({ show: false });
        $this.setState({
          requestPayment: []
        });
      } else if ($this.state.sel_payment_type === "FS") {
        AlgaehLoader({ show: false });
        $this.setState({
          requestPayment: []
        });
      } else if ($this.state.sel_payment_type === "LS") {
        AlgaehLoader({ show: false });
        $this.setState({
          requestPayment: []
        });
      }
    }
  });
};

const RequestPaySearch = $this => {
  if ($this.state.sel_payment_type === "AD") {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.emp_payment_apply.advance_apply
      },
      searchName: "advance_apply",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        $this.setState({ document_num: row.advance_number });
      }
    });
  } else if ($this.state.sel_payment_type === "LN") {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.emp_payment_apply.loan_apply
      },
      searchName: "loan_apply",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        $this.setState({ document_num: row.loan_application_number });
      }
    });
  } else if ($this.state.sel_payment_type === "EN") {
  } else if ($this.state.sel_payment_type === "GR") {
  } else if ($this.state.sel_payment_type === "FS") {
  } else if ($this.state.sel_payment_type === "LS") {
  }
};

const getPaymentDetails = ($this, row) => {
  if (row.payment_type === "AD") {
    $this.setState({
      employee_id: row.employee_id,
      payment_type: row.payment_type,
      payment_amount: row.payment_amount,
      request_number: row.request_number,
      full_name: row.full_name,
      employee_advance_id: row.hims_f_employee_advance_id,
      deduction_month: row.deducting_month,
      year: row.deducting_year,
      payment_mode: null,
      processBtn: false
    });
  } else if ($this.state.sel_payment_type === "LN") {
    $this.setState({
      employee_id: row.employee_id,
      payment_type: row.payment_type,
      payment_amount: row.payment_amount,
      request_number: row.request_number,
      full_name: row.full_name,
      employee_loan_id: row.hims_f_loan_application_id,
      payment_mode: null,
      processBtn: false
    });
  } else if (row.payment_type === "EN") {
    $this.setState({
      employee_id: row.employee_id,
      payment_type: row.payment_type,
      payment_amount: row.payment_amount,
      request_number: row.request_number,
      full_name: row.full_name,
      employee_leave_encash_id: row.hims_f_leave_encash_header_id,
      payment_mode: null,
      processBtn: false
    });
  } else if (row.payment_type === "GR") {
    $this.setState({
      employee_id: row.employee_id,
      payment_type: row.payment_type,
      payment_amount: row.payment_amount,
      request_number: row.request_number,
      full_name: row.full_name,
      employee_end_of_service_id: row.hims_f_loan_application_id,
      payment_mode: null,
      processBtn: false
    });
  } else if (row.payment_type === "FS") {
    $this.setState({
      employee_id: row.employee_id,
      payment_type: row.payment_type,
      payment_amount: row.payment_amount,
      request_number: row.request_number,
      full_name: row.full_name,
      employee_final_settlement_id: row.hims_f_loan_application_id,
      payment_mode: null,
      processBtn: false
    });
  } else if (row.payment_type === "LS") {
    $this.setState({
      employee_id: row.employee_id,
      payment_type: row.payment_type,
      payment_amount: row.payment_amount,
      request_number: row.request_number,
      full_name: row.full_name,
      employee_leave_settlement_id: row.hims_f_loan_application_id,
      payment_mode: null,
      processBtn: false
    });
  }
};

const ProessEmpPayment = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='processData'",
    onSuccess: () => {
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/employeepayments/InsertEmployeePayment",
        module: "hrManagement",
        data: $this.state,
        method: "POST",
        onSuccess: response => {
          // if (response.data.success === "true") {
          $this.setState({
            processBtn: true,
            payment_application_code:
              response.data.result.payment_application_code
          });
          LoadData($this);
          getEmployeePayments($this);
          swalMessage({
            title: "Processed Succefully...",
            type: "success"
          });
          AlgaehLoader({ show: false });
          // }
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
      $this.state.hospital_id !== null
        ? "hospital_id = " + $this.state.hospital_id
        : "1=1",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      $this.setState({
        employee_name: row.full_name,
        select_employee_id: row.hims_d_employee_id
      });
    }
  });
};

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
    confirmButtonText: "Yes!",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      debugger;
      algaehApiCall({
        uri: "/employeepayments/CancelEmployeePayment",
        data: row,
        module: "hrManagement",
        method: "PUT",
        onSuccess: response => {
          getEmployeePayments($this);
          swalMessage({
            title: "Cancelled Successfully...",
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
    } else {
      swalMessage({
        title: "Cancel request cancelled",
        type: "error"
      });
    }
  });
};

export {
  texthandle,
  LoadData,
  RequestPaySearch,
  getPaymentDetails,
  Paymenttexthandle,
  ProessEmpPayment,
  employeeSearch,
  getEmployeePayments,
  CancelPayment
};
