export default {
  inputParam: function (param) {
    var output;

    output = {
      hims_f_employee_payments_id: null,
      payment_application_code: null,
      employee_id: null,
      employee_advance_id: null,
      employee_loan_id: null,
      employee_leave_encash_id: null,
      employee_end_of_service_id: null,
      employee_final_settlement_id: null,
      employee_leave_settlement_id: null,
      payment_type: null,
      payment_date: new Date(),
      remarks: null,
      earnings_id: null,
      deduction_month: null,
      year: null,
      deducted: null,
      posted: "N",
      posted_date: null,
      posted_by: null,
      cancel: "N",
      cancel_by: null,
      cancel_date: null,
      payment_amount: null,
      round_off_amount: null,
      before_round_off_amount: null,
      leave_salary_amount: null,
      airfare_amount: null,
      net_salary_amount: null,
      payment_mode: null,
      cheque_number: null,

      //Extra
      department_id: null,
      select_employee_id: null,
      document_num: null,
      sel_payment_type: null,
      requestPayment: [],
      hospital_id: null,

      request_number: null,
      full_name: null,
      processBtn: true,
      PreviousPayments: [],
      employee_name: null,
      cash_finance_account: [],
      selected_account: null
    };
    return output;
  }
};
