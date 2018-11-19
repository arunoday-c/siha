export default {
  inputParam: function(param) {
    var output;

    output = {
      hims_f_procurement_po_header_id: null,
      purchase_number: null,

      po_date: new Date(),
      po_type: null,
      po_from: null,
      pharmcy_location_id: null,
      inventory_location_id: null,
      location_type: null,
      expected_date: new Date(),

      on_hold: null,
      requisition_id: null,
      from_multiple_requisition: "N",
      payment_terms: "",
      comment: null,
      sub_total: 0,
      detail_discount: 0,
      extended_total: 0,

      sheet_level_discount_percent: 0,
      sheet_level_discount_amount: 0,
      description: null,

      net_total: 0,
      total_tax: 0,
      net_payable: 0,

      cancelled: "N",
      authorize1: "N"
    };
    return output;
  }
};
