export default {
  inputParam: function (param) {
    var output;

    output = {
      hims_f_procurement_po_header_id: null,
      purchase_number: null,

      po_date: new Date(),
      po_type: null,
      po_return_from: null,
      pharmcy_location_id: null,
      inventory_location_id: null,
      location_type: null,
      vendor_id: null,
      expected_date: new Date(),
      material_requisition_number: null,
      on_hold: null,
      phar_requisition_id: null,
      inv_requisition_id: null,
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
      authorize1: "N",
      authorizeEnable: true,

      phar_item_category: null,
      inv_item_category_id: null,
      phar_item_group: null,
      inv_item_group_id: null,
      phar_item_id: null,
      inv_item_id: null,
      pharmacy_uom_id: null,
      inventory_uom_id: null,
      pharmacy_stock_detail: [],
      inventory_stock_detail: [],

      tax_percentage: 0,
      order_quantity: 0,
      foc_quantity: 0,
      total_quantity: 0,
      unit_price: Math.round(0).toFixed(6),
      extended_price: 0,
      sub_discount_percentage: 0,
      sub_discount_amount: 0,
      extended_cost: 0,
      discount_percentage: 0,
      discount_amount: 0,
      net_extended_cost: 0,
      unit_cost: 0,
      expected_arrival_date: null,
      authorize_quantity: 0,
      rejected_quantity: 0,
      pharmacy_requisition_id: null,
      inventory_requisition_id: null,

      dataExitst: false,
      addItemButton: true,
      ReqData: true,
      ClearDisable: false,
      saveEnable: true,
      InvoiceEnable: false,
      OTItemAddDis: false,
      authorizeBtn: false,
      grn_number: null
    };
    return output;
  }
};
