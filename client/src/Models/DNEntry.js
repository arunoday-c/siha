export default {
  inputParam: function(param) {
    var output;

    output = {
      hims_f_procurement_dn_header_id: null,
      delivery_note_number: null,

      dn_date: new Date(),
      dn_type: null,
      dn_from: null,
      pharmcy_location_id: null,
      inventory_location_id: null,
      location_type: null,
      vendor_id: null,
      delivery_date: new Date(),
      purchase_order_id: null,
      dn_entry_detail: [],
      po_entry_detail: [],
      item_details: {},
      purchase_number: null,

      from_multiple_purchase_orders: "N",
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
      free_qty: 0,

      is_completed: "N",
      cancelled: "N",
      authorize1: "N",
      authorizeEnable: true,

      dataExitst: false,
      addItemButton: true,
      ReqData: true,
      ClearDisable: false,
      saveEnable: true,

      vendor_batchno: null,
      expiry_date: null,
      dn_quantity: null,
      fromPurList: false
    };
    return output;
  }
};
