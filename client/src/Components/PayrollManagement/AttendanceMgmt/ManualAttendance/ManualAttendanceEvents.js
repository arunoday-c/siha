import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import _ from "lodash";
export default function ManualAttendanceEvents() {
  return {
    texthandle: ($this, e) => {
      debugger;
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

    LoadEmployee: $this => {
      debugger;
      algaehApiCall({
        uri: "/attendance/getEmployeeToManualTimeSheet",
        module: "hrManagement",
        method: "GET",
        data: {
          branch_id: $this.state.hospital_id,
          project_id: $this.state.project_id,
          attendance_date: moment($this.state.attendance_date).format(
            "YYYY-MM-DD"
          )
        },
        onSuccess: res => {
          if (res.data.success) {
            $this.setState({
              employee_details: res.data.records,
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
    },

    datehandle: ($this, ctrl, e) => {
      debugger;
      $this.setState({
        [e]: moment(ctrl)._d
      });
    },

    timehandle: ($this, e) => {
      debugger;
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
      debugger;
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;
      let diff_hour = null;
      let diff_munite = null;
      let employee_details = $this.state.employee_details;
      let worked_hours = null;

      if (name === "in_time") {
        if (row.out_time !== undefined) {
          //   diff_time = row.in_time - row.out_time;
          diff_hour = moment(row.out_time, "HH").diff(
            moment(value, "HH"),
            "hours"
          );
          diff_munite = moment
            .utc(
              moment(row.out_time, "HH:mm:ss").diff(moment(value, "HH:mm:ss"))
            )
            .format("mm");

          worked_hours = parseFloat(diff_hour) + "." + parseFloat(diff_munite);
        }
      } else if (name === "out_time") {
        if (row.in_time === undefined) {
          swalMessage({
            title: "Please enter From Time",
            type: "warning"
          });
        } else {
          diff_hour = moment(value, "HH").diff(
            moment(row.in_time, "HH"),
            "hours"
          );
          diff_munite = moment
            .utc(
              moment(value, "HH:mm:ss").diff(moment(row.in_time, "HH:mm:ss"))
            )
            .format("mm");

          worked_hours = parseFloat(diff_hour) + "." + parseFloat(diff_munite);
        }
      }

      row[name] = value;
      row["worked_hours"] = worked_hours;
      row["hours"] = diff_hour;
      row["minutes"] = diff_munite;

      employee_details[row.rowIdx] = row;
      $this.setState({
        employee_details: employee_details
      });
    },
    AddtoList: $this => {
      debugger;

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
      algaehApiCall({
        uri: "/attendance/addToDailyTimeSheet",
        module: "hrManagement",
        method: "POST",
        data: $this.state.employee_details,
        onSuccess: res => {
          if (res.data.success) {
            swalMessage({
              title: "Processed Succesfully...",
              type: "success"
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
    validateDateTime: dateTime => {
      if (new Date(dateTime).toString() !== "Invalid Date") {
        return moment(dateTime).format("HH:mm:ss");
      } else {
        return dateTime;
      }
    },
    formulazone: (rowsLength, ws, callBack) => {
      debugger;
      ws["!cols"] = [];
      ws["!cols"][6] = { hidden: true };

      for (let i = 2; i <= rowsLength + 1; i++) {
        const _cells = "E" + i + "-D" + i;
        ws["F" + i] = { ...ws["F" + i], f: "TEXT(" + _cells + ',"HH.MM")' };
        //  ws["G" + i] = { ...ws["G" + i],  hidden: true  };
      }
      callBack();
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
