export default {
  inputParam: function() {
    var output;
    var CurrentDate = new Date();
    output = {
      hims_f_patient_advance_id: null,
      hims_f_patient_id: null,
      transaction_type: null, //A, R
      advance_amount: 0,
      //created_by: null,
      //created_date: new Date(),
     // updated_by: null,
      update_date: 0,

      pay_cash: "CA",
      pay_card: "CD",
      pay_cheque: "CH",
      cash_amount: 0,
      card_number: "",
      card_date: null,
      card_amount: 0,
      cheque_number: "",
      cheque_date: null,
      cheque_amount: 0,
      selectedLang: "en",
      open: false,
      MandatoryMsg: "",

      hims_f_receipt_header_id: null,
      receipt_number: null,
      receipt_date: new Date(),
      billing_header_id: null,
      total_amount: 0,
      counter_id: null,
      shift_id: null,
      unbalanced_amount: 0,
     // created_by: null,
     // created_date: new Date(),
     // updated_by: null,
      updated_date: null,
      pay_type: "R",
      receiptdetails: []
    };
    return output;
  }
};
