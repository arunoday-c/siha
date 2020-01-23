// import Enumerable from "linq";
import { swalMessage, algaehApiCall, getCookie } from "../../../../utils/algaehApiCall.js";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import {
  AlgaehValidation,
  AlgaehOpenContainer
} from "../../../../utils/GlobalFunctions";
import EmployeePaymentIOputs from "../../../../Models/EmployeePayment";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
// import swal from "sweetalert2";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const branchHandelEvent = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let IOputs = EmployeePaymentIOputs.inputParam();

  $this.setState({
    ...IOputs,
    [name]: value
  });
};
const Paymenttexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let IOputs = EmployeePaymentIOputs.inputParam();
  IOputs.hospital_id = $this.state.hospital_id;
  $this.setState({
    ...IOputs,
    [name]: value
  });
};

const PaymentOnClear = ($this, e) => {
  let IOputs = EmployeePaymentIOputs.inputParam();
  IOputs.hospital_id = $this.state.hospital_id;
  $this.setState({
    ...IOputs,
    [e]: null
  });
};

const LoadData = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='loadData'",
    onSuccess: () => {
      AlgaehLoader({ show: true });
      getEmployeePayments($this);
      let inputObj = {};
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
        if ($this.state.document_num !== null) {
          inputObj.end_of_service_number = $this.state.document_num;
        }

        algaehApiCall({
          uri: "/employeepayments/getGratuityTopayment",
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
      } else if ($this.state.sel_payment_type === "FS") {
        if ($this.state.document_num !== null) {
          inputObj.final_settlement_number = $this.state.document_num;
        }

        algaehApiCall({
          uri: "/employeepayments/getFinalSettleTopayment",
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
      } else if ($this.state.sel_payment_type === "LS") {
        if ($this.state.document_num !== null) {
          inputObj.leave_salary_number = $this.state.document_num;
        }

        algaehApiCall({
          uri: "/employeepayments/getLeaveSettleTopayment",
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
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.emp_payment_apply.encash_leave
      },
      searchName: "encash_leave",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        $this.setState({ document_num: row.loan_application_number });
      }
    });
  } else if ($this.state.sel_payment_type === "GR") {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.emp_payment_apply.end_of_service
      },
      searchName: "end_of_service",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        $this.setState({ document_num: row.loan_application_number });
      }
    });
  } else if ($this.state.sel_payment_type === "FS") {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.emp_payment_apply.final_settlement
      },
      searchName: "final_settlement",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        $this.setState({ document_num: row.loan_application_number });
      }
    });
  } else if ($this.state.sel_payment_type === "LS") {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.emp_payment_apply.leave_settlement
      },
      searchName: "leave_settlement",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        $this.setState({ document_num: row.loan_application_number });
      }
    });
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
      processBtn: false,
      dis_leave_amount: 0,
      airfare_months: 0,
      dis_salary_amount: 0,
      dis_total_amount: 0
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
      processBtn: false,
      dis_leave_amount: 0,
      airfare_months: 0,
      dis_salary_amount: 0,
      dis_total_amount: 0
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
      processBtn: false,
      dis_leave_amount: 0,
      airfare_months: 0,
      dis_salary_amount: 0,
      dis_total_amount: 0
    });
  } else if (row.payment_type === "GR") {
    $this.setState({
      employee_id: row.employee_id,
      payment_type: row.payment_type,
      payment_amount: row.payment_amount,
      request_number: row.request_number,
      full_name: row.full_name,
      employee_end_of_service_id: row.hims_f_end_of_service_id,
      payment_mode: null,
      processBtn: false,
      dis_leave_amount: 0,
      airfare_months: 0,
      dis_salary_amount: 0,
      dis_total_amount: 0
    });
  } else if (row.payment_type === "FS") {
    $this.setState({
      employee_id: row.employee_id,
      payment_type: row.payment_type,
      payment_amount: row.payment_amount,
      request_number: row.request_number,
      full_name: row.full_name,
      employee_final_settlement_id: row.hims_f_final_settlement_header_id,
      payment_mode: null,
      processBtn: false,

      dis_leave_amount: 0,
      airfare_months: 0,
      dis_salary_amount: 0,
      dis_total_amount: 0
    });
  } else if (row.payment_type === "LS") {
    $this.setState({
      employee_id: row.employee_id,
      payment_type: row.payment_type,
      payment_amount: row.payment_amount,
      request_number: row.request_number,
      full_name: row.full_name,
      employee_leave_settlement_id: row.hims_f_leave_salary_header_id,
      payment_mode: null,
      processBtn: false,

      dis_leave_amount: row.leave_amount,
      airfare_months: row.airfare_amount,
      dis_salary_amount: row.salary_amount,
      dis_total_amount: row.payment_amount
    });
  }
};

const ProessEmpPayment = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='processData'",
    onSuccess: () => {
      AlgaehLoader({ show: true });
      $this.state.ScreenCode = getCookie("ScreenCode")
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
      $this.setState(
        {
          employee_name: row.full_name,
          select_employee_id: row.hims_d_employee_id
        },
        () => {
          getEmployeePayments($this);
        }
      );
    }
  });
};

const getEmployeePayments = $this => {
  let inputObj = {
    payment_type: $this.state.sel_payment_type,
    hospital_id: $this.state.hospital_id
  };

  if ($this.state.select_employee_id !== null) {
    inputObj.employee_id = $this.state.select_employee_id;
  }
  algaehApiCall({
    uri: "/employeepayments/getEmployeePayments",
    module: "hrManagement",
    method: "GET",
    data: inputObj,
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

const ClearData = $this => {
  let IOputs = EmployeePaymentIOputs.inputParam();
  IOputs.hospital_id = JSON.parse(
    AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
  ).hims_d_hospital_id;
  $this.setState(IOputs);
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
  ClearData,
  PaymentOnClear,
  branchHandelEvent
};
