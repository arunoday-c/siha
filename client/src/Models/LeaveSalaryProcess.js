import moment from "moment";

export default {
  inputParam: function(param) {
    var output;

    output = {
      hims_f_leave_salary_header_id: null,
      leave_salary_number: null,
      employee_id: null,
      year: moment().year(),
      month: moment(new Date()).format("M"),

      leave_start_date: null,
      leave_end_date: null,
      salary_amount: null,
      leave_amount: null,
      airfare_amount: null,
      total_amount: null,
      leave_period: null,
      status: "PEN",

      employee_name: null,
      leave_salary_detail: [],
      ProcessBtn: true,
      encash_type: null,
      SaveBtn: true
    };
    return output;
  }
};
