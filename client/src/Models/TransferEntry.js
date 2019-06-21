export default {
  inputParam: function(param) {
    var output;

    output = {
      hims_f_pharmacy_transfer_header_id: null,
      transfer_number: null,
      from_location_type: null,
      from_location_id: null,
      transfer_date: new Date(),
      year: null,
      period: null,
      material_requisition_number: null,
      material_requisition_header_id: null,
      to_location_id: null,
      to_location_type: null,

      description: null,
      //   comment: null,
      completed: "N",
      completed_date: null,
      completed_lines: 0,
      transfer_quantity: 0,
      requested_quantity: 0,
      outstanding_quantity: 0,
      total_quantity: 0,

      cancelled: "N",
      cancelled_by: null,
      cancelled_date: null,
      stock_detail: [],
      pharmacy_stock_detail: [],
      addedItem: false,

      saveEnable: true,
      dataExists: false,
      postEnable: true,

      addItemButton: true,
      item_id: null,
      uom_id: null,
      batchno: null,
      expiry_date: null,
      quantity_required: 0,
      unit_cost: 0,
      service_id: null,
      conversion_factor: 1,
      grn_no: null,
      item_group_id: null,
      item_category: null,
      dataExitst: false,
      batch_detail_view: false,
      item_details: null,
      quantity_transferred: 0,
      cannotEdit: false,
      direct_transfer: "N",
      selectBatch: false,

      sales_uom_id: null,
      quantity: 0,
      qtyhand: null,
      barcode: null,
      ItemUOM: [],
      Batch_Items: [],
      item_description: "",
      uom_description: null,
      fromReq: false,
      stock_enable:false
    };
    return output;
  }
};
