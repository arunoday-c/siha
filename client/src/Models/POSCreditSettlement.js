export default {
  inputParam: function(param) {
    var output;

    output = {
      hims_f_pos_credit_header_id: null,
      patient_code: null,
      full_name: null,
      pos_credit_number: null,
      pos_credit_date: new Date(),
      patient_id: null,
      reciept_amount: 0,
      write_off_amount: 0,
      recievable_amount: 0,
      remarks: null,
      reciept_header_id: null,
      transaction_type: null,
      write_off_account: null,
      posted: null,
      posted_date: null,
      posted_by: null,
      criedtdetails: [],
      include: "N",

      hims_f_receipt_header_id: null,
      receipt_number: null,
      receipt_date: new Date(),
      billing_header_id: null,
      total_amount: 0,
      counter_id: null,
      shift_id: null,
      unbalanced_amount: 0,
      receiptdetails: [],
      saveEnable: true,
      postEnable: true,
      episode_id: null,

      pay_type: "R",
      Cashchecked: true,
      Cardchecked: false,
      Checkchecked: false,
      cash_amount: 0,
      card_amount: 0,
      cheque_amount: 0,
      card_date: null,
      card_check_number: null,
      cheque_number: null,
      cheque_date: null,
      Billexists: false
    };
    return output;
  }
};
