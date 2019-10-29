import moment from "moment";

export default {
  inputParam: function (param) {
    var output;

    output = {
      hims_f_leave_encash_header_id: null,
      encashment_number: null,
      employee_id: null,
      encashment_date: new Date(),
      year: moment().year(),
      authorized1: "PEN",
      authorized1_by: null,
      authorized1_date: null,
      authorized2: "PEN",
      authorized2_by: null,
      authorized2_date: null,
      authorized: "PEN",
      total_amount: null,
      payment_date: null,

      encash_type: null,
      sel_employee_id: null,
      employee_name: null,
      encashDetail: [],
      processBtn: true,
      processed_already: false
    };
    return output;
  }
};
