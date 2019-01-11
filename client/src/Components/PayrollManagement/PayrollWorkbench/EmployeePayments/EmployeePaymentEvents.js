// import Enumerable from "linq";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import EmployeePaymentIOputs from "../../../../Models/EmployeePayment";

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
          },
          onFailure: error => {
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
      } else if ($this.state.sel_payment_type === "EN") {
        $this.setState({
          requestPayment: []
        });
      } else if ($this.state.sel_payment_type === "GR") {
        $this.setState({
          requestPayment: []
        });
      } else if ($this.state.sel_payment_type === "FS") {
        $this.setState({
          requestPayment: []
        });
      } else if ($this.state.sel_payment_type === "LS") {
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
      year: row.deducting_year
    });
  } else if ($this.state.sel_payment_type === "LN") {
    $this.setState({
      employee_id: row.employee_id,
      payment_type: row.payment_type,
      payment_amount: row.payment_amount,
      request_number: row.request_number,
      full_name: row.full_name,
      employee_loan_id: row.hims_f_loan_application_id
    });
  } else if (row.payment_type === "EN") {
    $this.setState({
      employee_id: row.employee_id,
      payment_type: row.payment_type,
      payment_amount: row.payment_amount,
      request_number: row.request_number,
      full_name: row.full_name,
      employee_leave_encash_id: row.hims_f_loan_application_id
    });
  } else if (row.payment_type === "GR") {
    $this.setState({
      employee_id: row.employee_id,
      payment_type: row.payment_type,
      payment_amount: row.payment_amount,
      request_number: row.request_number,
      full_name: row.full_name,
      employee_end_of_service_id: row.hims_f_loan_application_id
    });
  } else if (row.payment_type === "FS") {
    $this.setState({
      employee_id: row.employee_id,
      payment_type: row.payment_type,
      payment_amount: row.payment_amount,
      request_number: row.request_number,
      full_name: row.full_name,
      employee_final_settlement_id: row.hims_f_loan_application_id
    });
  } else if (row.payment_type === "LS") {
    $this.setState({
      employee_id: row.employee_id,
      payment_type: row.payment_type,
      payment_amount: row.payment_amount,
      request_number: row.request_number,
      full_name: row.full_name,
      employee_leave_settlement_id: row.hims_f_loan_application_id
    });
  }
};

const ProessEmpPayment = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='processData'",
    onSuccess: () => {
      
    }
  });
};

export {
  texthandle,
  LoadData,
  RequestPaySearch,
  getPaymentDetails,
  Paymenttexthandle,
  ProessEmpPayment
};
