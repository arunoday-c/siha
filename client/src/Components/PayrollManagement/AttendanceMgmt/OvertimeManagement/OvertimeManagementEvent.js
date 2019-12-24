import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { AlgaehOpenContainer } from "../../../../utils/GlobalFunctions";
import moment from "moment";
import Enumerable from "linq";
import Options from "../../../../Options.json";
import OTManagement from "../../../../Models/OTManagement";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const timetexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let diff_hour = null;
  let diff_munite = null;

  if (name === "from_time") {
    if ($this.state.to_time !== null) {
      //   diff_time = $this.state.from_time - $this.state.to_time;
      diff_hour = moment($this.state.to_time, "HH").diff(
        moment(value, "HH"),
        "hours"
      );
      diff_munite = moment
        .utc(
          moment($this.state.to_time, "HH:mm:ss").diff(
            moment(value, "HH:mm:ss")
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
      diff_hour = moment(value, "HH").diff(
        moment($this.state.from_time, "HH"),
        "hours"
      );
      diff_munite = moment
        .utc(
          moment(value, "HH:mm:ss").diff(
            moment($this.state.from_time, "HH:mm:ss")
          )
        )
        .format("mm");
    }
  }

  let d_ot_hours = null;
  let d_weekoff_ot_hours = null;
  let d_holiday_ot_hours = null;
  let overtime_hours = null;
  if ($this.state.type === "N") {
    d_ot_hours = parseFloat(diff_hour) + "." + parseFloat(diff_munite);
    overtime_hours = d_ot_hours;
  } else if ($this.state.type === "W") {
    d_weekoff_ot_hours = parseFloat(diff_hour) + "." + parseFloat(diff_munite);
    overtime_hours = d_weekoff_ot_hours;
  } else if ($this.state.type === "H") {
    d_holiday_ot_hours = parseFloat(diff_hour) + "." + parseFloat(diff_munite);
    overtime_hours = d_holiday_ot_hours;
  }

  $this.setState({
    [name]: value,
    d_ot_hours: d_ot_hours,
    d_weekoff_ot_hours: d_weekoff_ot_hours,
    d_holiday_ot_hours: d_holiday_ot_hours,
    overtime_hours: overtime_hours
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
          employee_id: row.hims_d_employee_id,
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
    uri: "/hrsettings/getOvertimeGroups",
    module: "hrManagement",
    data: {
      hims_d_overtime_group_id: $this.state.overtime_group_id
    },
    method: "GET",
    onSuccess: res => {
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
  if (
    $this.state.d_ot_hours === null &&
    $this.state.d_weekoff_ot_hours === null &&
    $this.state.d_holiday_ot_hours === null
  ) {
    swalMessage({
      title: "Atlest one OT is required..",
      type: "warning"
    });
  } else {
    if (
      $this.state.overtime_type === "D" &&
      $this.state.overtime_date === null
    ) {
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
        overtime_date:
          $this.state.overtime_date === null
            ? null
            : moment($this.state.overtime_date).format("YYYY-MM-DD"),
        from_time: $this.state.from_time,
        to_time: $this.state.to_time,
        overtime_hours: $this.state.overtime_hours,

        ot_hours:
          $this.state.d_ot_hours === null
            ? 0
            : parseFloat($this.state.d_ot_hours) * $this.state.ot_calc_value,
        weekoff_ot_hours:
          $this.state.d_weekoff_ot_hours === null
            ? 0
            : parseFloat($this.state.d_weekoff_ot_hours) *
              $this.state.weekoff_calc_value,
        holiday_ot_hours:
          $this.state.d_holiday_ot_hours === null
            ? 0
            : parseFloat($this.state.d_holiday_ot_hours) *
              $this.state.holiday_calc_value
      });

      let d_ot_hours = Enumerable.from(monthlyOverTime).sum(w =>
        parseFloat(w.ot_hours)
      );
      let d_weekoff_ot_hours = Enumerable.from(monthlyOverTime).sum(w =>
        parseFloat(w.weekoff_ot_hours)
      );
      let d_holiday_ot_hours = Enumerable.from(monthlyOverTime).sum(w =>
        parseFloat(w.holiday_ot_hours)
      );

      let total_ot_hours =
        parseFloat(d_ot_hours) +
        parseFloat(d_weekoff_ot_hours) +
        parseFloat(d_holiday_ot_hours);

      $this.setState({
        monthlyOverTime: monthlyOverTime,
        d_ot_hours: null,
        d_weekoff_ot_hours: null,
        d_holiday_ot_hours: null,
        ot_hours: d_ot_hours,
        holiday_ot_hours: d_holiday_ot_hours,
        weekof_ot_hours: d_weekoff_ot_hours,
        total_ot_hours: total_ot_hours,
        overtime_date: null,
        from_time: null,
        to_time: null,
        saveBtn: false
      });
    }
  }
};

const clearOtValues = $this => {
  $this.setState({
    d_ot_hours: null,
    d_weekoff_ot_hours: null,
    d_holiday_ot_hours: null,
    overtime_date: null,
    from_time: null,
    to_time: null
  });
};

const MianClear = $this => {
  let IOputs = OTManagement.inputParam();
  IOputs.overtime_type = $this.state.overtime_type;
  $this.setState(IOputs);
};

const getHolidayMaster = $this => {
  algaehApiCall({
    uri: "/payrollsettings/getAllHolidays",
    module: "hrManagement",
    method: "GET",

    data: {
      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id
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
  let overtime_date = moment(ctrl).format("YYYY-MM-DD");
  let type = null;
  let holiday_data = Enumerable.from($this.state.holidays)
    .where(w => w.holiday_date === overtime_date)
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

const DisplayDateFormat = ($this, date) => {
  if (date != null) {
    return moment(date).format(Options.dateFormat);
  }
};

const InsertOTManagement = ($this, e) => {
  // AlgaehValidation({
  //   alertTypeIcon: "warning",
  //   querySelector: "data-validate='processData'",
  //   onSuccess: () => {
  AlgaehLoader({ show: true });

  let inputObj = $this.state;
  delete inputObj.holidays;
  algaehApiCall({
    uri: "/OTManagement/InsertOTManagement",
    module: "hrManagement",
    data: inputObj,
    method: "POST",
    onSuccess: response => {
      if (response.data.success) {
        $this.setState({
          saveBtn: true
        });

        swalMessage({
          title: "Processed Succefully...",
          type: "success"
        });
        AlgaehLoader({ show: false });
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
  //   }
  // });
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
  timetexthandle,
  DisplayDateFormat,
  InsertOTManagement
};
