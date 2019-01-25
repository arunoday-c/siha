import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";
import { sendDataToProcessId } from "pm2";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const timetexthandle = ($this, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let diff_hour = null;
  let diff_munite = null;

  if (name === "from_time") {
    if ($this.state.from_time !== null) {
      //   diff_time = $this.state.from_time - $this.state.to_time;
      diff_hour = $this.state.to_time.diff($this.state.from_time, "hours");
      diff_munite = moment
        .utc(
          moment($this.state.to_time, "HH:mm:ss").diff(
            moment($this.state.from_time, "HH:mm:ss")
          )
        )
        .format("mm");
    }
  } else if (name === "to_time") {
    if ($this.state.from_time === null) {
      swalMessage({
        title: "Please enter From Time",
        type: "warning"
      });
    } else {
      diff_hour = $this.state.to_time.diff($this.state.from_time, "hours");
      diff_munite = moment
        .utc(
          moment($this.state.to_time, "HH:mm:ss").diff(
            moment($this.state.from_time, "HH:mm:ss")
          )
        )
        .format("mm");
    }
  }
  $this.setState({
    [name]: value
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
      $this.setState(
        {
          employee_name: row.full_name,
          hims_d_employee_id: row.hims_d_employee_id,
          overtime_group_id: row.overtime_group_id,
          religion_id: row.religion_id,
          monthcalculateBtn: false
        },
        () => {
          getOvertimeGroups($this);
        }
      );
    }
  });
};

const getOvertimeGroups = $this => {
  algaehApiCall({
    uri: "/employeesetups/getOvertimeGroups",
    data: {
      hims_d_overtime_group_id: $this.state.overtime_group_id
    },
    method: "GET",
    onSuccess: res => {
      debugger;
      if (res.data.success) {
        $this.setState({
          ot_calc_value: res.data.records[0].working_day_hour,
          weekoff_calc_value: res.data.records[0].weekoff_day_hour,
          holiday_calc_value: res.data.records[0].holiday_hour
        });
        //Take Data and do stff here
      }
    },
    onFailure: err => {
      swalMessage({
        title: err.message,
        type: "error"
      });
    }
  });
};

const getOptions = $this => {
  algaehApiCall({
    uri: "/payrollOptions/getHrmsOptions",
    method: "GET",
    module: "hrManagement",
    onSuccess: res => {
      if (res.data.success) {
        debugger;
        $this.setState({ overtime_type: res.data.result[0].overtime_type });
      }
    },
    onFailure: err => {
      swalMessage({
        title: err.message,
        type: "error"
      });
    }
  });
};

const CalculateAdd = $this => {
  debugger;

  if (
    $this.state.ot_value === null &&
    $this.state.weekoff_value === null &&
    $this.state.holiday_value === null
  ) {
    swalMessage({
      title: "Atlest one OT is required..",
      type: "warning"
    });
  } else {
    if ($this.state.overtime_type === "D" && $this.state.select_date === null) {
      swalMessage({
        title: "Select the Date..",
        type: "warning"
      });
    } else if (
      $this.state.overtime_type === "D" &&
      $this.state.from_time === null
    ) {
      swalMessage({
        title: "Select the Date..",
        type: "warning"
      });
    } else if (
      $this.state.overtime_type === "D" &&
      $this.state.to_time === null
    ) {
      swalMessage({
        title: "Select the Date..",
        type: "warning"
      });
    } else {
      let monthlyOverTime = $this.state.monthlyOverTime;

      monthlyOverTime.push({
        ot_value: $this.state.ot_value * $this.state.ot_calc_value,
        weekoff_value:
          $this.state.weekoff_value * $this.state.weekoff_calc_value,
        holiday_value:
          $this.state.holiday_value * $this.state.holiday_calc_value
      });

      let ot_value = Enumerable.from(monthlyOverTime).sum(w =>
        parseFloat(w.ot_value)
      );
      let weekoff_value = Enumerable.from(monthlyOverTime).sum(w =>
        parseFloat(w.weekoff_value)
      );
      let holiday_value = Enumerable.from(monthlyOverTime).sum(w =>
        parseFloat(w.holiday_value)
      );

      // let total_hours =
      //   parseFloat(ot_value) +
      //   parseFloat(weekoff_value) +
      //   parseFloat(holiday_value);

      $this.setState({
        monthlyOverTime: monthlyOverTime,
        ot_value: null,
        weekoff_value: null,
        holiday_value: null,
        total_hours: ot_value,
        total_holoday: holiday_value,
        total_weeloff: weekoff_value
      });
    }
  }
};

const clearOtValues = $this => {
  $this.setState({
    ot_value: null,
    weekoff_value: null,
    holiday_value: null
  });
};

const MianClear = $this => {
  $this.setState({
    year: moment().year(),
    month: moment(new Date()).format("M"),
    overtime_type: null,
    ot_calc_value: null,
    weekoff_calc_value: null,
    holiday_calc_value: null,

    ot_value: null,
    weekoff_value: null,
    holiday_value: null,
    monthlyOverTime: [],
    monthcalculateBtn: true
  });
};

const getHolidayMaster = $this => {
  algaehApiCall({
    uri: "/holiday/getAllHolidays",
    method: "GET",

    data: {
      hospital_id: JSON.parse(sessionStorage.getItem("CurrencyDetail"))
        .hims_d_hospital_id
    },
    onSuccess: res => {
      if (res.data.success) {
        $this.setState({
          holidays: res.data.records
        });
      }
    },
    onFailure: err => {}
  });
};

const datehandle = ($this, ctrl, e) => {
  debugger;
  let select_date = moment(ctrl).format("YYYY-MM-DD");
  let type = null;
  let holiday_data = Enumerable.from($this.state.holidays)
    .where(w => w.holiday_date === select_date)
    .toArray();

  if (holiday_data.length > 0) {
    if (holiday_data[0].weekoff === "Y") {
      type = "W";
    } else if (
      holiday_data[0].holiday === "Y" &&
      holiday_data[0].religion_id === $this.state.religion_id
    ) {
      type = "H";
    } else {
      type = "N";
    }
  } else {
    type = "N";
  }

  $this.setState({
    [e]: moment(ctrl)._d,
    type: type
  });
};

export {
  texthandle,
  employeeSearch,
  getOptions,
  CalculateAdd,
  clearOtValues,
  MianClear,
  getOvertimeGroups,
  getHolidayMaster,
  datehandle,
  timetexthandle
};
