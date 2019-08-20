import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
// import _ from "lodash";
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

      if (name === "hospital_id") {
        getDivisionProject($this, { division_id: value });
      }
    },

    getProjects: $this => {
      getDivisionProject($this, { division_id: $this.state.hospital_id });
    },

    getOptions: $this => {
      return new Promise((resolve, reject) => {
        algaehApiCall({
          uri: "/payrollOptions/getHrmsOptions",
          method: "GET",
          module: "hrManagement",
          onSuccess: res => {
            resolve(res);
            // if (res.data.success) {
            //
            //   resolve(res);
            //   // $this.setState({
            //   //   manual_timesheet_entry:
            //   //     res.data.result[0].manual_timesheet_entry
            //   // });
            // }
          },
          onFailure: err => {
            reject(err);
          }
        });
      });
    },
    getSubDepartment: $this => {
      algaehApiCall({
        uri: "/department/get/subdepartment",
        module: "masterSettings",
        data: {
          sub_department_status: "A"
        },
        method: "GET",
        onSuccess: res => {
          if (res.data.success) {
            $this.setState({
              subdepartment: res.data.records
            });
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

    LoadEmployee: $this => {
      if ($this.state.select_wise === "M" && $this.state.employee_id === null) {
        swalMessage({
          title: "Pease select the employee",
          type: "warning"
        });
      } else {
        let InputObj = {
          branch_id: $this.state.hospital_id,

          manual_timesheet_entry: $this.state.manual_timesheet_entry
        };
        if ($this.state.manual_timesheet_entry === "D") {
          InputObj.sub_department_id = $this.state.sub_department_id;
        } else {
          InputObj.project_id = $this.state.project_id;
        }

        if ($this.state.employee_id !== null) {
          InputObj.employee_id = $this.state.employee_id;
        }

        if ($this.state.select_wise === "M") {
          InputObj.yearAndMonth =
            $this.state.year + "-" + $this.state.month + "-01";

          InputObj.select_wise = $this.state.select_wise;
        } else {
          InputObj.attendance_date = moment($this.state.attendance_date).format(
            "YYYY-MM-DD"
          );
        }

        algaehApiCall({
          uri: "/attendance/getEmployeeToManualTimeSheet",
          module: "hrManagement",
          method: "GET",
          data: InputObj,
          onSuccess: res => {
            if (res.data.success) {
              $this.setState({
                employee_details: res.data.records.result,
                dataExist: res.data.records.dataExist,
                apply_all: false,
                process_attend: false
              });
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
    },

    datehandle: ($this, ctrl, e) => {
      $this.setState({
        [e]: moment(ctrl)._d
      });
    },

    timehandle: ($this, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;
      let diff_hour = null;
      let diff_munite = null;
      let worked_hours = null;
      if (name === "in_time") {
        if ($this.state.out_time !== null) {
          diff_hour = moment($this.state.out_time, "HH").diff(
            moment(value, "HH"),
            "hours"
          );
          diff_munite = moment
            .utc(
              moment($this.state.out_time, "HH:mm:ss").diff(
                moment(value, "HH:mm:ss")
              )
            )
            .format("mm");

          worked_hours = parseFloat(diff_hour) + "." + parseFloat(diff_munite);
        }
      } else if (name === "out_time") {
        if ($this.state.in_time === null) {
          swalMessage({
            title: "Please enter From Time",
            type: "warning"
          });
        } else {
          diff_hour = moment(value, "HH").diff(
            moment($this.state.in_time, "HH"),
            "hours"
          );
          diff_munite = moment
            .utc(
              moment(value, "HH:mm:ss").diff(
                moment($this.state.in_time, "HH:mm:ss")
              )
            )
            .format("mm");

          worked_hours = parseFloat(diff_hour) + "." + parseFloat(diff_munite);
        }
      }
      $this.setState({
        [name]: value,
        worked_hours: worked_hours,
        hours: diff_hour,
        minutes: diff_munite
      });
    },

    gdtimehandle: ($this, row, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;
      let diff_hour = null;
      let diff_munite = null;
      let employee_details = $this.state.employee_details;
      let worked_hours = null;

      if (name === "in_time") {
        if (row.out_time !== undefined && row.out_time !== null) {
          //   diff_time = row.in_time - row.out_time;

          let start = value.split(":");
          let end = row.out_time.split(":");
          var startDate = new Date(0, 0, 0, start[0], start[1], 0);
          var endDate = new Date(0, 0, 0, end[0], end[1], 0);
          var diff = (endDate.getTime() - startDate.getTime()) / 1000;

          diff = Number(diff);
          diff_hour = Math.floor(diff / 3600);
          diff_munite = Math.floor((diff % 3600) / 60);

          worked_hours = parseFloat(diff_hour) + "." + parseFloat(diff_munite);
        }
      } else if (name === "out_time") {
        if (row.in_time === undefined && row.in_time === null) {
          swalMessage({
            title: "Please enter From Time",
            type: "warning"
          });
        } else {
          debugger;
          let start = row.in_time.split(":");
          let end = value.split(":");
          var out_startDate = new Date(0, 0, 0, start[0], start[1], 0);
          var out_endDate = new Date(0, 0, 0, end[0], end[1], 0);
          var out_diff =
            (out_endDate.getTime() - out_startDate.getTime()) / 1000;

          out_diff = Number(out_diff);
          diff_hour = Math.floor(out_diff / 3600);
          diff_munite = Math.floor((out_diff % 3600) / 60);

          worked_hours = parseFloat(diff_hour) + "." + parseFloat(diff_munite);
        }
      }

      row[name] = value;
      row["worked_hours"] = worked_hours;
      row["hours"] = diff_hour;
      row["minutes"] = diff_munite;

      const _index = employee_details.indexOf(row);

      employee_details[_index] = row;
      $this.setState({
        employee_details: employee_details
      });
    },
    AddtoList: $this => {
      let employee_details = $this.state.employee_details.map((row, index) => {
        return {
          ...row,
          ...{
            in_time: $this.state.in_time,
            out_time: $this.state.out_time,
            worked_hours: $this.state.worked_hours,
            hours: $this.state.hours,
            minutes: $this.state.minutes,
            out_date: $this.state.attendance_date
          }
        };
      });

      $this.setState({
        employee_details: employee_details,
        process_attend: false
      });
    },
    ProcessAttendanceEvent: $this => {
      for (let i = 0; i < $this.state.employee_details.length; i++) {
        let strWorked_Hours = $this.state.employee_details[i].worked_hours;
        if (strWorked_Hours === null || strWorked_Hours === undefined) {
          swalMessage({
            title: "Please enter proper data...",
            type: "warning"
          });
          return;
        } else {
          strWorked_Hours = strWorked_Hours.split(".");
          $this.state.employee_details[i].hours = strWorked_Hours[0];
          $this.state.employee_details[i].minutes = strWorked_Hours[1];
        }
      }
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/attendance/addToDailyTimeSheet",
        module: "hrManagement",
        method: "POST",
        data: $this.state.employee_details,
        onSuccess: res => {
          if (res.data.success) {
            AlgaehLoader({ show: false });
            swalMessage({
              title: "Processed Succesfully...",
              type: "success"
            });
          }
        },
        onFailure: err => {
          AlgaehLoader({ show: false });
          swalMessage({
            title: err.message,
            type: "error"
          });
        }
      });
      // }
    },
    validateDateTime: dateTime => {
      if (dateTime === null) {
        return null;
      }
      if (moment(dateTime, "HH:mm").isValid()) {
        return moment(dateTime, "HH:mm").format("HH:mm:ss");
      }
      return null;
    },
    formulazone: (rowsLength, ws, callBack) => {
      ws["!cols"] = [];
      ws["!cols"][6] = { hidden: true };
      ws["!cols"][7] = { hidden: true };
      ws["!cols"][8] = { hidden: true };
      ws["!cols"][9] = { hidden: true };
      ws["!cols"][10] = { hidden: true };

      for (let i = 2; i <= rowsLength + 1; i++) {
        const _cells = "E" + i + "-D" + i;
        ws["F" + i] = { ...ws["F" + i], f: "TEXT(" + _cells + ',"HH.MM")' };
        //  ws["G" + i] = { ...ws["G" + i],  hidden: true  };
      }
      callBack();
    },

    employeeSearch: $this => {
      AlgaehSearch({
        searchGrid: {
          columns: spotlightSearch.Employee_details.employee
        },
        searchName: "employee",
        uri: "/gloabelSearch/get",
        inputs:
          $this.state.sub_department_id !== null
            ? "sub_department_id = " + $this.state.sub_department_id
            : "1=1",
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
    gridEventHandaler: ($this, row, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;
      let employee_details = $this.state.employee_details;

      let _index = employee_details.indexOf(row);
      row[name] = value;
      employee_details[_index] = row;
      $this.setState({
        employee_details: employee_details
      });
    }
  };
}

function getDivisionProject($this, inputObj) {
  algaehApiCall({
    uri: "/projectjobcosting/getDivisionProject",
    module: "hrManagement",
    method: "GET",
    data: inputObj,
    onSuccess: res => {
      if (res.data.success) {
        $this.setState({
          projects: res.data.records
        });
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
