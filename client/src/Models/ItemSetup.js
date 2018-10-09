export default {
  inputParam: function(param) {
    var output;

    output = {
      hims_d_item_master_id: null,
      item_description: null,
      generic_id: null,
      category_id: null,
      group_id: null,
      form_id: null,
      storage_id: null,
      item_uom_id: null,
      purchase_uom_id: null,
      sales_uom_id: null,
      stocking_uom_id: null,
      item_status: "A",
      radioActive: true,
      radioInactive: false,
      detail_item_uom: [],
      uom_description: null,
      ItemList: [],
      updateUomMapResult: [],
      insertItemUomMap: [],
      service_id: null
    };
    return output;
  }
};
