import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import moment from "moment";

const texthandler = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const LoadEncashment = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='loadEncash'",
    onSuccess: () => {
      let inputObj = {
        employee_id: $this.state.sel_employee_id,
        year: $this.state.year
      };
      debugger;
      algaehApiCall({
        uri: "/encashmentprocess/getEncashmentToProcess",
        module: "hrManagement",
        data: inputObj,
        method: "GET",
        onSuccess: response => {
          debugger;
          $this.setState({ encashDetail: response.data.result });
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

const ClearData = ($this, e) => {
  $this.setState({
    year: moment().year(),
    encash_type: null,
    sel_employee_id: null,
    encashDetail: []
  });
};

const ProcessEncash = ($this, e) => {
  $this.setState({
    year: moment().year(),
    encash_type: null,
    sel_employee_id: null,
    encashDetail: []
  });
};

export { texthandler, LoadEncashment, ClearData, ProcessEncash };
