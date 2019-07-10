export default {
  inputParam: function(param) {
    var output;
    const CurrentDate = new Date();
    output = {
      hims_d_patient_id: null,
      patient_code: "",
      registration_date: CurrentDate,
      title_id: null,
      first_name: "",
      middle_name: "",
      last_name: "",
      full_name: "",
      arabic_name: "",
      gender: null,
      religion_id: null,
      date_of_birth: null,
      hijiri_date: null,
      age: null,
      marital_status: null,
      address1: "",
      address2: "",
      contact_number: null,
      secondary_contact_number: null,
      email: "",
      emergency_contact_name: "",
      emergency_contact_number: null,
      relationship_with_patient: "",
      visa_type_id: null,
      nationality_id: null,
      postal_code: "",
      country_id: null,
      state_id: null,
      city_id: null,
      primary_identity_id: null,
      primary_id_no: "",
      secondary_identity_id: null,
      secondary_id_no: "",
      photo_file: "",
      primary_id_file: "",
      secondary_id_file: "",

      forceRefresh: undefined,
      Rerender: false,
      saveEnable: true,
      selectedLang: "en"
    };
    return output;
  }
};
