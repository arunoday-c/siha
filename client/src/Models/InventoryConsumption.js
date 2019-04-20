export default {
  inputParam: function(param) {
    var output;

    output = {
      hims_f_inventory_consumption_header_id: null,
      consumption_number: null,
      location_id: null,
      location_type: null,
      consumption_date: new Date(),
      transaction_date: new Date(),
      transaction_type: "CS",

      addedItem: false,
      item_category_id: null,
      item_group_id: null,
      item_id: null,
      quantity: 0,
      ItemDisable: false,
      unit_cost: 0,
      extended_cost: 0,
      addItemButton: true,

      uom_id: null,
      sales_uom: null,
      qtyhand: 0,
      expiry_date: null,
      batchno: null,
      grn_no: null,
      saveEnable: true,
      inventory_stock_detail: []
    };
    return output;
  }
};
