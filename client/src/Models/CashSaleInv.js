export default {
  inputParam: function (param) {
    var output;

    output = {
      hims_f_sales_invoice_header_id: null,
      invoice_number: null,
      sales_invoice_mode: "I",
      location_id: null,
      invoice_date: new Date(),
      delivery_date: new Date(),
      dataExitst: false,
      customer_name: null,
      hospital_id: null,
      project_id: null,
      payment_terms: 0,
      inventory_stock_detail: [],
      saveEnable: true,
      postEnable: true,
      docChanged: false,
      sub_total: null,
      discount_amount: null,
      net_total: null,
      total_tax: null,
      net_payable: null,
      narration: null,
      retention_amt: 0,
      dataRevert: true,
      cancelEnable: true,
      cancel_reason: null,
      cancel_visible: false,
      revert_reason: null,
      revert_visible: false,
      cust_good_rec_date: new Date(),
      is_revert: "N",
      organizations: [],
      decimal_place: 0,
      itemAdd: false,
    };
    return output;
  },
};
