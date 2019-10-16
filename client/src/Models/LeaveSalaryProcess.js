import moment from "moment";

export default {
  inputParam: function(param) {
    var output;

    output = {
      hims_f_leave_salary_header_id: null,
      leave_salary_number: null,
      leave_salary_date: new Date(),
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
      status: undefined, //"PEN",
      leave_application_id: null,

      employee_name: null,
      leave_salary_detail: [],
      ProcessBtn: true,
      encash_type: null,
      SaveBtn: true,

      dis_salary_amount: null,
      dis_leave_amount: null,
      dis_airfare_amount: null,
      dis_total_amount: null
    };
    return output;
  }
};
