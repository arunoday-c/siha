import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import Enumerable from "linq";
import _ from "lodash";

export default function AuthorizationSetupEvent() {
  return {
    texthandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      switch (name) {
        case "department_id":
          $this.setState(
            {
              [name]: value
            },
            () => {
              getAllSubDepartments($this, $this.state.department_id);
            }
          );

          break;
        case "sub_department_id":
          $this.setState(
            {
              [name]: value
            },
            () => {
              getDesignations($this, $this.state.sub_department_id);
            }
          );

          break;
        default:
          $this.setState({
            [name]: value
          });
          break;
      }
    },

    getDepartments: $this => {
      algaehApiCall({
        uri: "/department/get",
        method: "GET",
        module: "masterSettings",
        onSuccess: response => {
          if (response.data.success) {
            $this.setState({ allDepartments: response.data.records });
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    },

    getOptions: $this => {
      algaehApiCall({
        uri: "/payrollOptions/getHrmsOptions",
        method: "GET",
        module: "hrManagement",
        onSuccess: res => {
          if (res.data.success) {
            if (res.data.result.length > 0) {
              $this.setState({
                leave_level: parseInt(res.data.result[0].leave_level),
                loan_level: parseInt(res.data.result[0].loan_level)
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
    },
    loadEmployees: $this => {
      let inputObj = { department_id: $this.state.department_id };

      if ($this.state.sub_department_id !== null) {
        inputObj.sub_department_id = $this.state.sub_department_id;
      }
      if ($this.state.designation_id !== null) {
        inputObj.designation_id = $this.state.designation_id;
      }
      algaehApiCall({
        uri: "/hrsettings/getEmployeeAuthorizationSetup",
        method: "GET",
        module: "hrManagement",
        data: inputObj,
        onSuccess: res => {
          if (res.data.success) {
            if (res.data.records.length > 0) {
              $this.setState({
                employees_list: res.data.records,
                checkAll: false
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
    },
    selectAll: ($this, e) => {
      const isChecked = e.target.checked;

      let data = $this.state.employees_list;

      const newData = data.map((item, index) => {
        return {
          ...item,
          select_to_process:
            item.salary_paid === "Y" ? "N" : isChecked ? "Y" : "N"
        };
      });

      const listOfinclude = _.filter(newData, f => {
        return f.select_to_process === "Y";
      });
      let saveEnable = listOfinclude.length > 0 ? false : true;

      $this.setState({
        employees_list: newData,
        checkAll: isChecked,
        saveEnable: saveEnable
      });
    },
    selectToProcess: ($this, row, e) => {
      let employees_list = $this.state.employees_list;

      if (e.target.checked === true) {
        row["select_to_process"] = "Y";
      } else if (e.target.checked === false) {
        row["select_to_process"] = "N";
      }

      employees_list[row.rowIdx] = row;

      const listOfinclude = _.filter(employees_list, f => {
        return f.select_to_process === "Y";
      });

      let saveEnable = listOfinclude.length > 0 ? false : true;
      $this.setState({
        saveEnable: saveEnable,
        employees_list: employees_list
      });
    },
    getEmployeeDetails: $this => {
      $this.props.getProviderDetails({
        uri: "/employee/get",
        module: "hrManagement",
        method: "GET",
        redux: {
          type: "EMPLOYEE_GET_DATA",
          mappingName: "employee_data"
        }
      });
    },
    processLoanAuth: $this => {
      let employees_list = $this.state.employees_list;
      const employees_process = _.filter($this.state.employees_list, f => {
        return f.select_to_process === "Y";
      });

      if (employees_process.length <= 0) {
        swalMessage({
          title: "Please select atleast one employee to assign.",
          type: "warning"
        });
        return;
      }

      if ($this.state.loan_level_set === "AL1") {
        for (var i = 0; i < employees_list.length; i++) {
          if (employees_list[i].select_to_process === "Y") {
            employees_list[i].loan_level1 = $this.state.lo_employee_id;
          }
        }
      } else if ($this.state.loan_level_set === "AL2") {
        for (var i = 0; i < employees_list.length; i++) {
          if (employees_list[i].select_to_process === "Y") {
            employees_list[i].loan_level2 = $this.state.lo_employee_id;
          }
        }
      }
      $this.setState({ employees_list: employees_list });
    },
    processLeaveLevel: $this => {
      let employees_list = $this.state.employees_list;
      const employees_process = _.filter($this.state.employees_list, f => {
        return f.select_to_process === "Y";
      });

      if (employees_process.length <= 0) {
        swalMessage({
          title: "Please select atleast one employee to assign.",
          type: "warning"
        });
        return;
      }

      if ($this.state.leave_level_set === "AL1") {
        for (var i = 0; i < employees_list.length; i++) {
          if (employees_list[i].select_to_process === "Y") {
            employees_list[i].leave_level1 = $this.state.l_employee_id;
          }
        }
      } else if ($this.state.leave_level_set === "AL2") {
        for (var i = 0; i < employees_list.length; i++) {
          if (employees_list[i].select_to_process === "Y") {
            employees_list[i].leave_level2 = $this.state.l_employee_id;
          }
        }
      } else if ($this.state.leave_level_set === "AL3") {
        for (var i = 0; i < employees_list.length; i++) {
          if (employees_list[i].select_to_process === "Y") {
            employees_list[i].leave_level3 = $this.state.l_employee_id;
          }
        }
      }
      $this.setState({ employees_list: employees_list });
    },
    SaveAuthorizationSetup: $this => {
      algaehApiCall({
        uri: "/hrsettings/addEmployeeAuthorizationSetup",
        data: $this.state.employees_list,
        method: "POST",
        module: "hrManagement",
        onSuccess: res => {
          if (res.data.success) {
            $this.setState({
              subDepts: [],
              designations: [],
              employees_list: [],
              department_id: null,
              sub_department_id: null,
              designation_id: null,
              processLeaveBtn: true,
              processLoanBtn: true,
              checkAll: false,
              Employeedetails: [],
              lo_sub_department_id: null,
              lo_employee_id: null,
              lo_full_name: "",
              l_sub_department_id: null,
              l_employee_id: null,
              l_full_name: "",
              leave_level_set: "AL1",
              loan_level_set: "AL1"
            });
            swalMessage({
              title: "Record Added Successfully",
              type: "success"
            });
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    }
  };
}
function getAllSubDepartments($this, department_id) {
  algaehApiCall({
    uri: "/department/get/subdepartment",
    data: { department_id: department_id },
    method: "GET",
    module: "masterSettings",
    onSuccess: res => {
      if (res.data.success) {
        $this.setState({ subDepts: res.data.records });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
}
function getDesignations($this, sub_department_id) {
  algaehApiCall({
    uri: "/hrsettings/getDesignations",
    method: "GET",
    module: "hrManagement",
    data: {
      sub_department_id: sub_department_id
    },
    onSuccess: res => {
      if (res.data.success) {
        $this.setState({ designations: res.data.records });
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
