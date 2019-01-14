import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import moment from "moment";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import Enumerable from "linq";

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
        employee_id: $this.state.employee_id,
        year: $this.state.year
      };

      algaehApiCall({
        uri: "/encashmentprocess/getEncashmentToProcess",
        module: "hrManagement",
        data: inputObj,
        method: "GET",
        onSuccess: response => {
          debugger;
          let total_amount = Enumerable.from(response.data.result).sum(w =>
            parseFloat(w.total_amount)
          );

          $this.setState({
            encashDetail: response.data.result,
            total_amount: total_amount
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

const ClearData = ($this, e) => {
  $this.setState({
    year: moment().year(),
    encash_type: null,
    employee_id: null,
    encashDetail: []
  });
};

const ProcessEncash = ($this, e) => {
  debugger;
  algaehApiCall({
    uri: "/encashmentprocess/InsertLeaveEncashment",
    module: "hrManagement",
    data: $this.state,
    method: "POST",
    onSuccess: response => {
      debugger;
      $this.setState({
        encashment_number: response.data.result
      });
      swalMessage({
        title: "",
        type: "error"
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

const employeeSearch = $this => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Employee_details.employee
    },
    searchName: "employee",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      $this.setState({
        employee_name: row.full_name,
        employee_id: row.hims_d_employee_id
      });
    }
  });
};

export {
  texthandler,
  LoadEncashment,
  ClearData,
  ProcessEncash,
  employeeSearch
};
