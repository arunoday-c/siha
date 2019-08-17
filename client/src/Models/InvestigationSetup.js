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
      container_id: null,
      container_code: null,
      category_id: null,
      analyte_id: null,
      analyte_type: null,
      result_unit: null,
      selectedLang: "en",
      analytes: [],
      insert_analytes: [],
      update_analytes: [],
      insert_rad_temp: [],
      update_rad_temp: [],
      services_id: null,
      RadTemplate: [],
      template_name: null,
      template_html: null,
      normal_low: 0,
      normal_high: 0,
      critical_low: 0,
      critical_high: 0,

      film_category: "NA",
      screening_test: "N",
      film_used: "N",
      clear: false,
      analytes_required: true
    };
    return output;
  }
};
