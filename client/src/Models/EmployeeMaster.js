export default {
  inputParam: function(param) {
    var output;

    output = {
      hims_d_employee_id: null,
      employee_code: null,
      services_id: null,
      title_id: null,
      first_name: null,
      middle_name: null,
      last_name: null,
      full_name: null,
      arabic_name: null,
      employee_designation_id: null,
      license_number: null,
      sex: null,
      date_of_birth: null,
      date_of_joining: null,
      date_of_leaving: null,
      category_id: null,
      speciality_id: null,
      employee_id: null,
      address: null,
      address2: null,
      pincode: null,
      city_id: null,
      state_id: null,
      country_id: null,
      Applicable: false,
      same_address: false,
      primary_contact_no: null,
      secondary_contact_number: null,
      email: null,
      emergancy_contact_person: null,
      emergancy_contact_no: 0,
      blood_group: null,
      isdoctor: "N",
      employee_status: "A",

      servTypeCommission: [],
      serviceComm: [],
      dependentDetails: [],

      updateservTypeCommission: [],
      insertservTypeCommission: [],

      dependentDetails: [],

      updateserviceComm: [],
      insertserviceComm: [],

      deptDetails: [],
      updatedeptDetails: [],
      insertdeptDetails: [],

      idDetails: [],
      insertIdDetails: [],
      updateIdDetails: [],

      dependentDetails: [],
      insertDependentDetails: [],
      updateDependentDetails: [],

      selectedLang: "en"
    };
    return output;
  }
};
