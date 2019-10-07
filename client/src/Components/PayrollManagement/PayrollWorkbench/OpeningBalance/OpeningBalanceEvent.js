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
import _ from "lodash";

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
      PreviewDataFull($this);
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
            selected_type: "LE",
            leave_balance: []
          });
          break;
        case "LO":
          getLoanMasterData($this);
          $this.setState({
            selected_type: "LO",
            leave_balance: []
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
            leave_dynamic_date: leave_dynamic_date,
            leave_balance: []
          });
          break;
        case "LS":
          leave_dynamic_date = [
            {
              fieldName: "employee_code",
              label: <AlgaehLabel label={{ forceLabel: "Emp. Code" }} />,
              disabled: true,
              editorTemplate: row => {
                return row.employee_code;
              },
              others: {
                maxWidth: 105,
                fixed: "left"
              }
            },
            {
              fieldName: "full_name",
              label: <AlgaehLabel label={{ forceLabel: "Employee Name" }} />,
              editorTemplate: row => {
                return row.full_name;
              },
              disabled: true,
              others: {
                minWidth: 200,
                fixed: "left"
              }
            },
            {
              fieldName: "leave_days",
              label: <AlgaehLabel label={{ forceLabel: "Leave Days" }} />,
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    textBox={{
                      number: {
                        allowNegative: false,
                        thousandSeparator: ","
                      },
                      dontAllowKeys: ["-", "e", "."],
                      className: "txt-fld",
                      name: "leave_days",
                      value: row.leave_days,
                      events: {
                        onChange: changeGridEditors.bind($this, $this, row)
                      }
                    }}
                  />
                );
              },
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
              },
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    textBox={{
                      number: {
                        allowNegative: false,
                        thousandSeparator: ","
                      },
                      dontAllowKeys: ["-", "e", "."],
                      className: "txt-fld",
                      name: "leave_salary_amount",
                      value: row.leave_salary_amount,
                      events: {
                        onChange: changeGridEditors.bind($this, $this, row)
                      }
                    }}
                  />
                );
              }
            },

            {
              fieldName: "airticket_amount",
              label: <AlgaehLabel label={{ forceLabel: "Airticket Amount" }} />,
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    textBox={{
                      number: {
                        allowNegative: false,
                        thousandSeparator: ","
                      },
                      dontAllowKeys: ["-", "e", "."],
                      className: "txt-fld",
                      name: "airticket_amount",
                      value: row.airticket_amount,
                      events: {
                        onChange: changeGridEditors.bind($this, $this, row)
                      }
                    }}
                  />
                );
              },
              others: {
                filterable: false
              }
            },
            {
              fieldName: "balance_leave_days",
              label: (
                <AlgaehLabel label={{ forceLabel: "Balance Leave Days" }} />
              ),
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    textBox={{
                      number: {
                        allowNegative: false,
                        thousandSeparator: ","
                      },
                      dontAllowKeys: ["-", "e", "."],
                      className: "txt-fld",
                      name: "balance_leave_days",
                      value: row.balance_leave_days,
                      events: {
                        onChange: changeGridEditors.bind($this, $this, row)
                      }
                    }}
                  />
                );
              },
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
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    textBox={{
                      number: {
                        allowNegative: false,
                        thousandSeparator: ","
                      },
                      dontAllowKeys: ["-", "e", "."],
                      className: "txt-fld",
                      name: "balance_leave_salary_amount",
                      value: row.balance_leave_salary_amount,
                      events: {
                        onChange: changeGridEditors.bind($this, $this, row)
                      }
                    }}
                  />
                );
              },
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
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    textBox={{
                      number: {
                        allowNegative: false,
                        thousandSeparator: ","
                      },
                      dontAllowKeys: ["-", "e", "."],
                      className: "txt-fld",
                      name: "balance_airticket_amount",
                      value: row.balance_airticket_amount,
                      events: {
                        onChange: changeGridEditors.bind($this, $this, row)
                      }
                    }}
                  />
                );
              },
              others: {
                filterable: false
              }
            },
            {
              fieldName: "airfare_months",
              label: <AlgaehLabel label={{ forceLabel: "Airfare Months" }} />,
              editorTemplate: row => {
                return (
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    textBox={{
                      number: {
                        allowNegative: false,
                        thousandSeparator: ","
                      },
                      dontAllowKeys: ["-", "e", "."],
                      className: "txt-fld",
                      name: "airfare_months",
                      value: row.airfare_months,
                      events: {
                        onChange: changeGridEditors.bind($this, $this, row)
                      }
                    }}
                  />
                );
              },
              others: {
                filterable: false
              }
            }
          ];
          $this.setState({
            selected_type: "LS",
            leave_dynamic_date: leave_dynamic_date,
            leave_balance: []
          });
          break;
        default:
          break;
      }
    },
    updateEmployeeOpeningBalance: ($this, row) => {
      debugger;

      let selected_uri = "";
      let employee_Leave_Update = [];
      let inputData = "";
      if ($this.state.selected_type === "LE") {
        var result = Object.keys(row).map(function(key) {
          if (row[key] !== "N" && isNaN(Number(key)) === false) {
            return {
              leave_id: Number(key),
              close_balance: row[key],
              employee_id: row.hims_d_employee_id,
              year: $this.state.year
            };
          }
        });
        inputData = _.filter(result, f => {
          return f !== undefined;
        });

        selected_uri = "/leave/updateEmployeeLeave";

        // inputData
      } else if ($this.state.selected_type === "LS") {
        if (
          row.hims_f_employee_leave_salary_header_id === undefined ||
          row.hims_f_employee_leave_salary_header_id === null
        ) {
          return;
        } else {
          selected_uri = "/employeepayments/updateEmployeeLeaveSalary";
        }
        inputData = row;
      }

      algaehApiCall({
        uri: selected_uri,
        module: "hrManagement",
        data: inputData,
        method: "PUT",
        onSuccess: response => {
          PreviewDataFull($this);
          swalMessage({
            title: "Updated Succesfully..",
            type: "success"
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
  };
}

function changeGridEditors($this, row, e) {
  debugger;
  let leave_balance = $this.state.leave_balance;

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  let _index = leave_balance.indexOf(row);
  row[name] = value;
  leave_balance[_index] = row;

  $this.setState({
    leave_balance: leave_balance
  });
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
              disabled: true,
              editorTemplate: row => {
                return row.employee_code;
              },
              others: {
                maxWidth: 105,
                fixed: "left"
              }
            },
            {
              fieldName: "full_name",
              label: <AlgaehLabel label={{ forceLabel: "Employee Name" }} />,
              editorTemplate: row => {
                return row.full_name;
              },
              disabled: true,
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
              displayTemplate: row => {
                return row[item.hims_d_leave_id] === "N"
                  ? "Not Applicable"
                  : row[item.hims_d_leave_id];
              },
              editorTemplate: row => {
                debugger;
                return row[item.hims_d_leave_id] === "N" ? (
                  "Not Applicable"
                ) : (
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    textBox={{
                      number: {
                        allowNegative: false,
                        thousandSeparator: ","
                      },
                      dontAllowKeys: ["-", "e", "."],
                      className: "txt-fld",
                      name: item.hims_d_leave_id,
                      value: row[item.hims_d_leave_id],
                      events: {
                        onChange: changeGridEditors.bind($this, $this, row)
                      }
                    }}
                  />
                );
              },
              others: {
                filterable: false
              }
            };
          });

          leave_dynamic_date = employee_data.concat(leave_dynamic_date);
          $this.setState({
            leave_dynamic_date: leave_dynamic_date,
            leaves_data: res.data.records
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

function PreviewDataFull($this) {
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

  let selected_uri = "";
  if ($this.state.selected_type === "LE") {
    selected_uri = "/leave/getLeaveBalances";
  } else if ($this.state.selected_type === "LO") {
    selected_uri = "/loan/getEmployeeLoanOpenBal";
  } else if ($this.state.selected_type === "GR") {
    selected_uri = "/gratuity/getEmployeeLeaveSalary";
  } else if ($this.state.selected_type === "LS") {
    selected_uri = "/employeepayments/getEmployeeLeaveSalary";
  }

  algaehApiCall({
    uri: selected_uri,
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
}
