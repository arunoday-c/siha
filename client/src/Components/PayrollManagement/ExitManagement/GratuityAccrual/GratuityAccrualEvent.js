import Enumerable from "linq";
import {
  swalMessage,
  algaehApiCall
} from "../../../../utils/algaehApiCall.js";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import moment from "moment";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const employeeSearch = $this => {

  if ($this.state.hospital_id === null || $this.state.hospital_id === undefined) {
    swalMessage({
      title: "Please Select Branch",
      type: "warning"
    });
    document.querySelector("[name='hospital_id']").focus();
    return
  }

  let input_data = " hospital_id=" + $this.state.hospital_id;
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Employee_details.employee
    },
    searchName: "employee",
    inputs: input_data,
    uri: "/gloabelSearch/get",

    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      $this.setState({
        employee_name: row.full_name,
        hims_d_employee_id: row.hims_d_employee_id
      });
    }
  });
};

const LoadGratuityAccrual = $this => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='loadGratuityAccrual'",
    onSuccess: () => {
      AlgaehLoader({ show: true });

      let inputObj = {
        year: $this.state.year,
        month: $this.state.month,
        hospital_id: $this.state.hospital_id
      };

      if ($this.state.hims_d_employee_id !== null) {
        inputObj.hims_d_employee_id = $this.state.hims_d_employee_id;
      }

      algaehApiCall({
        uri: "/employee/getEmployeeGratuity",
        module: "hrManagement",
        data: inputObj,
        method: "GET",
        onSuccess: response => {
          if (response.data.success) {
            let total_gratuity_amount = Enumerable.from(
              response.data.records
            ).sum(s => parseFloat(s.gratuity_amount));

            $this.setState({
              gratuity_details: response.data.records,
              total_gratuity_amount: total_gratuity_amount
            });
          }

          AlgaehLoader({ show: false });
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

const ClearData = $this => {
  $this.setState({
    year: moment().year(),
    month: moment(new Date()).format("M"),
    hims_d_employee_id: null,
    employee_name: null,
    gratuity_details: [],
    total_gratuity_amount: null
  });
};
export { texthandle, LoadGratuityAccrual, employeeSearch, ClearData };
