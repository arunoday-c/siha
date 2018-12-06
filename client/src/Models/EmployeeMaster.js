export default {
  inputParam: function(param) {
    var output;

    output = {
      hims_d_employee_id: null,
      employee_code: "",
      services_id: null,
      title_id: null,
      first_name: "",
      middle_name: "",
      last_name: "",
      full_name: "",
      arabic_name: "",
      employee_designation_id: null,
      license_number: "",
      sex: null,
      date_of_birth: null,
      date_of_joining: null,
      date_of_leaving: null,
      category_id: null,
      speciality_id: null,

      address: "",
      address2: "",
      pincode: "",
      city_id: null,
      state_id: null,
      country_id: null,
      Applicable: false,

      primary_contact_no: 0,
      secondary_contact_number: 0,
      email: "",
      emergancy_contact_person: "",
      emergancy_contact_no: 0,
      blood_group: null,
      isdoctor: "N",
      employee_status: "A",

      servTypeCommission: [],
      serviceComm: [],

      updateservTypeCommission: [],
      insertservTypeCommission: [],

      updateserviceComm: [],
      insertserviceComm: [],

      deptDetails: [],
      updatedeptDetails: [],
      insertdeptDetails: [],

      selectedLang: "en"
    };
    return output;
  }
};
