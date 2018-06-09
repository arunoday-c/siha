import extend from "extend";
import moment from "moment";
import PatRegIOputs from "../utils/GlobalFunctions.js";

export default {
  inputParam: function(param) {
    var output;
    var CurrentDate = new Date();
    output = extend(
      {
        hims_d_patient_id: 0,
        patient_code: "",
        registration_date: moment(String(CurrentDate)).format("YYYY-MM-DD"),
        title_id: null,
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        religion_id: null,
        date_of_birth: null,
        hijiri_date: null,
        age: 0,
        marital_status: "",
        address1: "",
        address2: "",
        contact_number: 0,
        secondary_contact_number: 0,
        email: "",
        emergency_contact_name: "",
        emergency_contact_number: 0,
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
        created_by: 1,
        updated_by: 1,
        visit_type: null,
        visit_date: moment(String(CurrentDate)).format("YYYY-MM-DD"),
        department_id: null,
        sub_department_id: null,
        doctor_id: null,
        maternity_patient: "N",
        is_mlc: "N",
        mlc_accident_reg_no: "",
        mlc_police_station: "",
        mlc_wound_certified_date: "",
        visit_code: "",
        visitDetails: null
      },
      param
    );
    // debugger;
    return output;
  }
};
