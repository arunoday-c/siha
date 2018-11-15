import { LINQ } from "node-linq";

let algaehReportConfig = reportName => {
  let queries = {
    allQueries: [
      {
        reportName: "patientData",
        reportQuery:
          "select hims_f_patient_appointment_id, patient_id, patient_code, provider_id, sub_department_id, number_of_slot,\
          appointment_date, appointment_from_time, appointment_to_time, appointment_status_id, patient_name, arabic_name, \
          date_of_birth, age, contact_number, email, send_to_provider, gender, confirmed, confirmed_by, comfirmed_date, \
          cancelled, cancelled_by, cancelled_date, cancel_reason, appointment_remarks, visit_created, is_stand_by\
          from hims_f_patient_appointment where record_status='A' ",
        orderBy: "hims_f_patient_appointment_id desc"
      }
    ]
  };

  let row = new LINQ(queries.allQueries)
    .Where(
      w =>
        String(w.reportName).toUpperCase() === String(reportName).toUpperCase()
    )
    .FirstOrDefault();
  return row;
};

module.exports = {
  algaehReportConfig
};
