import Enumerable from "linq";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
// import AlgaehSearch from "../../../Wrapper/globalSearch";
// import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
// import EmployeePaymentIOputs from "../../../../Models/EmployeePayment";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const SalaryProcess = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='loadSalary'",
    onSuccess: () => {
      let inputObj = {
        hospital_id: $this.state.hospital_id,
        year: $this.state.year,
        month: $this.state.month
      };
      debugger;
      algaehApiCall({
        uri: "/salary/processSalary",
        module: "hrManagement",
        data: inputObj,
        method: "GET",
        onSuccess: response => {
          debugger;
          if (response.data.result.length > 0) {
            $this.setState({
              requestPayment: response.data.result
            });
          } else {
            swalMessage({
              title: "Invalid. Please process attendence",
              type: "error"
            });
          }
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

export { texthandle, SalaryProcess };
