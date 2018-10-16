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

      cancelled: "N",
      cancelled_by: null,
      cancelled_date: null,
      pharmacy_stock_detail: [],
      addedItem: false,

      saveEnable: true,
      authorizeEnable: true,

      addItemButton: true,
      item_id: null,
      uom_id: null,
      batchno: null,
      expiry_date: null,
      quantity_required: 0,
      unit_cost: 0,
      Batch_Items: [],
      service_id: null,
      conversion_factor: 1,
      grn_no: null,
      item_group_id: null,
      item_category: null
    };
    return output;
  }
};
