import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
// import swal from "sweetalert2";
// import Enumerable from "linq";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";

export default function ProjectPayrollEvents() {
  return {
    texthandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value
      });
    },

    employeeSearch: $this => {
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
    },
    LoadProjectDetails: $this => {
      debugger;
      if ($this.state.project_id === null && $this.state.employee_id === null) {
        swalMessage({
          title: "Please select Project or Employee.",
          type: "warning"
        });
      } else {
        let lbl_total = "Total Project";
        let inputObj = {
          hospital_id: $this.state.hospital_id,
          year: $this.state.year,
          month: $this.state.month
        };
        if ($this.state.project_id !== null) {
          inputObj.project_id = $this.state.project_id;
          lbl_total = "Total Employees";
        }

        if ($this.state.employee_id !== null) {
          inputObj.employee_id = $this.state.employee_id;
        }

        algaehApiCall({
          uri: "/projectjobcosting/getProjectWiseJobCost",
          module: "hrManagement",
          data: inputObj,
          method: "GET",
          onSuccess: response => {
            debugger;
            if (response.data.records.project_wise_payroll.length > 0) {
              // let data = response.data.records.result;

              $this.setState({
                ...response.data.records,
                lbl_total: lbl_total
              });
            } else {
              AlgaehLoader({ show: false });
              swalMessage({
                title: "Invalid. Please process attendence",
                type: "error"
              });
            }
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
    }
  };
}
