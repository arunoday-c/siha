// import Enumerable from "linq";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const LoadData = ($this, e) => {
  debugger;
  AlgaehValidation({
    alertTypeIcon: "warning",
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
        $this.setState({
          requestPayment: []
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
  } else if ($this.state.sel_payment_type === "LN") {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.hr_loan_apply.loan_apply
      },
      searchName: "loan_apply",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        debugger;
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
  $this.setState({
    employee_id: row.employee_id,
    payment_type: row.payment_type,
    payment_amount: row.payment_amount
  });
};
export { texthandle, LoadData, RequestPaySearch, getPaymentDetails };
