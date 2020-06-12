export default {
  inputParam: function () {
    var output;

    output = {
      hims_f_patient_advance_id: null,
      hims_f_patient_id: null,
      transaction_type: null, //A, R
      advance_amount: 0,
      //created_by: null,
      //created_date: new Date(),
      // updated_by: null,
      update_date: 0,

      Cashchecked: true,
      Cardchecked: false,
      Checkchecked: false,
      lang_sets: "en_comp",
      shift_id: null,

      pay_cash: "CA",
      pay_card: "CD",
      pay_cheque: "CH",
      cash_amount: 0,
      card_number: null,
      card_date: null,
      card_amount: 0,
      cheque_number: null,
      cheque_date: null,
      cheque_amount: 0,
      selectedLang: "en",
      open: false,

      hims_f_receipt_header_id: null,
      receipt_number: null,
      receipt_date: new Date(),
      billing_header_id: null,
      total_amount: 0,
      counter_id: null,
      unbalanced_amount: 0,

      updated_date: null,
      pay_type: "R",
      receiptdetails: [],
      bank_card_id: null
    };
    return output;
  }
};
