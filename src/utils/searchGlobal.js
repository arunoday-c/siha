import { LINQ } from "node-linq";
let algaehSearchConfig = searchName => {
  let queries = {
    algaehSeach: [
      {
        searchName: "patients",
        searchQuery:
          "select SQL_CALC_FOUND_ROWS hims_d_patient_id, patient_code, registration_date, title_id,\
         first_name, middle_name, last_name, full_name, arabic_name, gender, religion_id, \
         date_of_birth, age, marital_status, address1, address2, contact_number, secondary_contact_number, \
         email, emergency_contact_name, emergency_contact_number, relationship_with_patient, visa_type_id, city_id, \
         state_id, country_id, nationality_id, postal_code, primary_identity_id, primary_id_no, secondary_identity_id, \
         secondary_id_no, photo_file, primary_id_file, secondary_id_file, advance_amount from hims_f_patient \
         where record_status ='A'",
        orderBy: "hims_d_patient_id desc"
      }
    ]
  };

  let row = new LINQ(queries.algaehSeach)
    .Where(
      w =>
        String(w.searchName).toUpperCase() === String(searchName).toUpperCase()
    )
    .FirstOrDefault();
  return row;
};

module.exports = {
  algaehSearchConfig
};
