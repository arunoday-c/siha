export default {
  inputParam: function(param) {
    var output;

    output = {
      hims_d_investigation_test_id: null,
      short_description: null,
      description: null,
      investigation_type: "L",
      lab_section_id: null,
      send_out_test: "N",
      available_in_house: "N",
      restrict_order: "N",
      restrict_by: null,
      external_facility_required: "N",
      facility_description: null,
      priority: null,
      cpt_id: null,
      category_id: null,
      analyte_id: null,
      selectedLang: "en",
      analytes: [],
      insertanalytes: [],
      updateanalytes: [],
      services_id: null,

      film_category: "NA",
      screening_test: "N",
      film_used: "N"
    };
    return output;
  }
};
