export default {
  inputParam: function(param) {
    var output;

    output = {
      hims_f_pharamcy_material_header_id: null,
      material_header_number: null,
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
      pharmacy_stock_detail: [],
      addedItem: false,

      saveEnable: true,
      authorizeEnable: true
    };
    return output;
  }
};
