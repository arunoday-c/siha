import moment from "moment";

export default {
  inputParam: function (param) {
    var output;

    output = {
      hims_f_overtime_header_id: null,
      employee_id: null,
      year: moment().year(),
      month: moment(new Date()).format("M"),
      overtime_type: null,
      total_ot_hours: null,
      ot_hours: null,
      weekof_ot_hours: null,
      holiday_ot_hours: null,
      status: "PE",
      overtime_payment_type: "N",
      leave_id: null,
      comp_off_leaves: null,

      ot_calc_value: null,
      weekoff_calc_value: null,
      holiday_calc_value: null,
      d_ot_hours: null,
      d_weekoff_ot_hours: null,
      d_holiday_ot_hours: null,
      monthlyOverTime: [],
      monthcalculateBtn: true,
      holidays: [],
      employee_name: null,
      overtime_date: null,
      from_time: null,
      to_time: null,
      saveBtn: true,
      hospital_id: null
    };
    return output;
  }
};
