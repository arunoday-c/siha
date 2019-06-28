export default {
  inputParam: function(param) {
    var output;

    output = {
      hims_f_procurement_grn_header_id: null,
      grn_number: null,

      grn_date: new Date(),
      year: null,
      period: null,

      grn_for: null,
      pharmcy_location_id: null,
      inventory_location_id: null,
      location_type: null,
      vendor_id: null,
      po_id: null,
      dn_id: null,
      delivery_note_number: null,

      purchase_order_id: null,
      receipt_entry_detail: [],
      purchase_number: null,

      from_multiple_purchase_orders: "N",
      payment_terms: "",
      comment: null,
      description: null,
      sub_total: 0,
      detail_discount: 0,
      extended_total: 0,

      sheet_level_discount_percent: 0,
      sheet_level_discount_amount: 0,

      posted: "N",
      net_total: 0,
      total_tax: 0,
      net_payable: 0,
      additional_cost: 0,
      reciept_total: 0,
      inovice_number: null,
      invoice_date: new Date(),

      dataExitst: false,

      ReqData: true,
      ClearDisable: false,
      saveEnable: true,
      postEnable: true,
      poSelected: false,
      location_name: null,
      vendor_name: null
    };
    return output;
  }
};
