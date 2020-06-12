export default {
  inputParam: function (param) {
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
      service_id: null,
      exp_date_required: "N",
      item_code: null,
      cpt_code: null,
      cpt_code_data: null,
      vat_percent: 0,
      Applicable: false,
      standard_fee: 0,
      decimals: null,
      purchase_cost: 0,
      markup_percent: 0,
      sales_price: 0,
      addl_information: null,
      conversion_factor: 0,
      convertEnable: false,
      sfda_code: null,
      reorder_qty: 0,
      vat_applicable: "N"
    };
    return output;
  }
};
