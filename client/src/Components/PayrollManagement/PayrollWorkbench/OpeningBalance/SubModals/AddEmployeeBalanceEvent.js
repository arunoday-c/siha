import React from "react";
import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";
import moment from "moment";
import AlgaehSearch from "../../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../../Search/spotlightSearch.json";

export default function AllEvents() {
  return {
    texthandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value
      });
    },
    getEmployeeLeaveType: ($this, row) => {
      debugger;
      algaehApiCall({
        uri: "/employee/getEmployeeLeaveType",
        module: "hrManagement",
        method: "GET",
        onSuccess: response => {
          if (response.data.records.length > 0) {
            $this.setState({
              employee_leave: response.data.records
            });
          } else {
            $this.setState({
              employee_leave: []
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
    },
    employeeSearch: $this => {
      AlgaehSearch({
        searchGrid: {
          columns: spotlightSearch.Employee_details.employee
        },
        searchName: "employee",
        uri: "/gloabelSearch/get",
        inputs: "leave_salary_process = 'Y'",
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
    },
    SaveData: $this => {
      let selected_uri = "";
      let inputObj = {};
      debugger;
      if ($this.props.selected_type === "LS") {
        selected_uri = "/employee/InsertOpeningBalanceLeaveSalary";
        inputObj = {
          employee_id: $this.state.hims_d_employee_id,
          year: $this.props.year,
          leave_days: $this.state.leave_days,
          leave_salary_amount: $this.state.leave_salary_amount,
          airticket_amount: $this.state.airticket_amount,
          airfare_months: $this.state.airfare_months,
          hospital_id: $this.props.hospital_id
        };
      }
      algaehApiCall({
        uri: selected_uri,
        module: "hrManagement",
        data: inputObj,
        method: "POST",
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({ title: "Added Successfully...", type: "success" });
            $this.setState(
              {
                employee_leave: [],
                employee_name: null,
                hims_d_employee_id: null,
                close_balance: null,
                leave_days: null,
                airticket_amount: null,
                leave_salary_amount: null,
                airfare_months: null
              },
              () => {
                $this.props.onClose && $this.props.onClose(true);
              }
            );
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
  };
}
