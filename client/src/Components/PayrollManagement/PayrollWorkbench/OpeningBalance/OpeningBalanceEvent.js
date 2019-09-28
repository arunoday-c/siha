import React from "react";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
// import _ from "lodash";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";

import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";

export default function ManualAttendanceEvents() {
  return {
    texthandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value
      });
    },

    getLeaveMaster: $this => {
      getLeaveMasterData($this);
    },
    PreviewData: $this => {
      if ($this.state.hospital_id === null) {
        swalMessage({
          title: "Please select the branch.",
          type: "warning"
        });
        document.querySelector("[name='hospital_id']").focus();
        return;
      }
      if ($this.state.year === null) {
        swalMessage({
          title: "Please select the year.",
          type: "warning"
        });
        document.querySelector("[name='year']").focus();
        return;
      }
      debugger;
      let inputObj = {
        year: $this.state.year,
        hospital_id: $this.state.hospital_id
      };

      if ($this.state.hims_d_employee_id !== null) {
        inputObj.hims_d_employee_id = $this.state.hims_d_employee_id;
      }

      if ($this.state.employee_group_id !== null) {
        inputObj.employee_group_id = $this.state.employee_group_id;
      }

      debugger;

      algaehApiCall({
        uri: "/leave/getLeaveBalances",
        module: "hrManagement",
        data: inputObj,
        method: "GET",
        onSuccess: response => {
          if (response.data.records.length > 0) {
            $this.setState({
              leave_balance: response.data.records
            });
          } else {
            $this.setState({
              leave_balance: []
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
        inputs:
          $this.state.employee_group_id !== null
            ? "employee_group_id = " + $this.state.employee_group_id
            : "1=1",
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
    changeChecks: ($this, e) => {
      debugger;
      let leave_dynamic_date = [];
      switch (e.target.value) {
        case "LE":
          getLeaveMasterData($this);
          $this.setState({
            selected_type: "LE"
          });
          break;
        case "LO":
          getLoanMasterData($this);
          $this.setState({
            selected_type: "LO"
          });
          break;
        case "GR":
          debugger;
          leave_dynamic_date = [
            {
              fieldName: "employee_code",
              label: <AlgaehLabel label={{ forceLabel: "Emp. Code" }} />,
              others: {
                maxWidth: 105,
                fixed: "left"
              }
            },
            {
              fieldName: "full_name",
              label: <AlgaehLabel label={{ forceLabel: "Employee Name" }} />,
              others: {
                minWidth: 200,
                fixed: "left"
              }
            },
            {
              fieldName: "year",
              label: <AlgaehLabel label={{ forceLabel: "Year" }} />,
              others: {
                filterable: false
              }
            },
            {
              fieldName: "month",
              label: <AlgaehLabel label={{ forceLabel: "Month" }} />,
              others: {
                filterable: false
              }
            },
            {
              fieldName: "gratuity_amount",
              label: <AlgaehLabel label={{ forceLabel: "Gratuity Amount" }} />,
              others: {
                filterable: false
              }
            }
          ];

          $this.setState({
            selected_type: "GR",
            leave_dynamic_date: leave_dynamic_date
          });
          break;
        case "LS":
          leave_dynamic_date = [
            {
              fieldName: "employee_code",
              label: <AlgaehLabel label={{ forceLabel: "Emp. Code" }} />,
              others: {
                maxWidth: 105,
                fixed: "left"
              }
            },
            {
              fieldName: "full_name",
              label: <AlgaehLabel label={{ forceLabel: "Employee Name" }} />,
              others: {
                minWidth: 200,
                fixed: "left"
              }
            },
            {
              fieldName: "year",
              label: <AlgaehLabel label={{ forceLabel: "Year" }} />,
              others: {
                filterable: false
              }
            },
            {
              fieldName: "leave_days",
              label: <AlgaehLabel label={{ forceLabel: "Leave Days" }} />,
              others: {
                minWidth: 200,
                fixed: "center"
              }
            },
            {
              fieldName: "leave_salary_amount",
              label: (
                <AlgaehLabel label={{ forceLabel: "Leave Salary Amount" }} />
              ),
              others: {
                filterable: false
              }
            },

            {
              fieldName: "airticket_amount",
              label: <AlgaehLabel label={{ forceLabel: "Airticket Amount" }} />,
              others: {
                filterable: false
              }
            },
            {
              fieldName: "balance_leave_days",
              label: (
                <AlgaehLabel label={{ forceLabel: "Balance Leave Days" }} />
              ),
              others: {
                minWidth: 200,
                fixed: "center"
              }
            },
            {
              fieldName: "balance_leave_salary_amount",
              label: (
                <AlgaehLabel
                  label={{ forceLabel: "Balance Leave Salary Amount" }}
                />
              ),
              others: {
                filterable: false
              }
            },
            {
              fieldName: "balance_airticket_amount",
              label: (
                <AlgaehLabel
                  label={{ forceLabel: "Balance Airticket Amount" }}
                />
              ),
              others: {
                filterable: false
              }
            },
            {
              fieldName: "airfare_months",
              label: <AlgaehLabel label={{ forceLabel: "Airfare Months" }} />,
              others: {
                filterable: false
              }
            }
          ];
          $this.setState({
            selected_type: "LS",
            leave_dynamic_date: leave_dynamic_date
          });
          break;
        default:
          break;
      }
    }
  };
}

function getLeaveMasterData($this) {
  algaehApiCall({
    uri: "/selfService/getLeaveMaster",
    module: "hrManagement",
    method: "GET",
    onSuccess: res => {
      if (res.data.success) {
        debugger;
        if (res.data.records.length > 0) {
          let employee_data = [
            {
              fieldName: "employee_code",
              label: <AlgaehLabel label={{ forceLabel: "Emp. Code" }} />,
              others: {
                maxWidth: 105,
                fixed: "left"
              }
            },
            {
              fieldName: "full_name",
              label: <AlgaehLabel label={{ forceLabel: "Employee Name" }} />,
              others: {
                minWidth: 200,
                fixed: "left"
              }
            }
          ];
          let leave_dynamic_date = res.data.records.map((item, index) => {
            return {
              fieldName: item.hims_d_leave_id + "",
              label: (
                <AlgaehLabel label={{ forceLabel: item.leave_description }} />
              ),
              others: {
                filterable: false
              }
            };
          });

          leave_dynamic_date = employee_data.concat(leave_dynamic_date);
          $this.setState({
            leave_dynamic_date: leave_dynamic_date
          });
        }
      }
    },
    onFailure: err => {
      swalMessage({
        title: err.message,
        type: "error"
      });
    }
  });
}

function getLoanMasterData($this) {
  algaehApiCall({
    uri: "/payrollsettings/getLoanMaster",
    module: "hrManagement",
    method: "GET",
    onSuccess: res => {
      if (res.data.success) {
        debugger;
        if (res.data.records.length > 0) {
          let employee_data = [
            {
              fieldName: "employee_code",
              label: <AlgaehLabel label={{ forceLabel: "Emp. Code" }} />,
              others: {
                maxWidth: 105,
                fixed: "left"
              }
            },
            {
              fieldName: "full_name",
              label: <AlgaehLabel label={{ forceLabel: "Employee Name" }} />,
              others: {
                minWidth: 200,
                fixed: "left"
              }
            }
          ];
          let leave_dynamic_date = res.data.records.map((item, index) => {
            return {
              fieldName: "close_balance",
              label: (
                <AlgaehLabel label={{ forceLabel: item.loan_description }} />
              ),
              others: {
                filterable: false
              }
            };
          });

          leave_dynamic_date = employee_data.concat(leave_dynamic_date);
          $this.setState({
            leave_dynamic_date: leave_dynamic_date
          });
        }
      }
    },
    onFailure: err => {
      swalMessage({
        title: err.message,
        type: "error"
      });
    }
  });
}

function setGratuityData($this) {
  let leave_dynamic_date = [
    {
      fieldName: "employee_code",
      label: <AlgaehLabel label={{ forceLabel: "Emp. Code" }} />,
      others: {
        maxWidth: 105,
        fixed: "left"
      }
    },
    {
      fieldName: "full_name",
      label: <AlgaehLabel label={{ forceLabel: "Employee Name" }} />,
      others: {
        minWidth: 200,
        fixed: "left"
      }
    },
    {
      fieldName: "year",
      label: <AlgaehLabel label={{ forceLabel: "Year" }} />,
      others: {
        filterable: false
      }
    },
    {
      fieldName: "month",
      label: <AlgaehLabel label={{ forceLabel: "Month" }} />,
      others: {
        filterable: false
      }
    },
    {
      fieldName: "gratuity_amount",
      label: <AlgaehLabel label={{ forceLabel: "Gratuity Amount" }} />,
      others: {
        filterable: false
      }
    }
  ];
  $this.setState({
    leave_dynamic_date: leave_dynamic_date
  });
}
