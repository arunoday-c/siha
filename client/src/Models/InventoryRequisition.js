export default {
  inputParam: function(param) {
    var output;

    output = {
      hims_f_pharamcy_material_header_id: null,
      material_requisition_number: null,
      from_location_type: null,
      from_location_id: null,
      requistion_date: new Date(),
      expiration_date: null,
      required_date: null,
      requested_by: null,
      on_hold: null,
      to_location_id: null,
      to_location_type: null,

      description: null,
      comment: null,
      is_completed: "N",
      completed_date: null,
      completed_lines: 0,
      requested_lines: 0,
      purchase_created_lines: 0,

      status: "PEN",
      requistion_type: "MR",
      no_of_transfers: 0,
      no_of_po: 0,
      authorize1: "N",
      authorize1_date: null,
      authorize1_by: null,
      authorie2: "N",
      authorize2_date: null,
      authorize2_by: null,
      cancelled: "N",
      cancelled_by: null,
      cancelled_date: null,
      inventory_stock_detail: [],
      addedItem: false,
      transaction_type: "MR",
      saveEnable: true,
      authorizeEnable: true,
      ItemDisable: false,
      ClearDisable: false,

      item_category_id: null,
      item_group_id: null,
      item_id: null,
      quantity_required: 0,

      item_uom: null,

      completed: null,
      to_qtyhand: 0,
      from_qtyhand: 0,
      quantity_authorized: 0,

      quantity_recieved: 0,
      quantity_outstanding: 0,
      po_created_date: null,
      po_created: null,
      po_created_quantity: null,
      po_outstanding_quantity: null,
      po_completed: null,
      addItemButton: true,
      dummyField: false,
      from_location_name: null,
      to_location_name: null,
      requistion_type_name: null,
      requistion_from: null,
      barcode: null
    };
    return output;
  }
};
