import keys from "algaeh-keys";
import axios from "axios";
import moment from "moment";
export function sendPatientAppointment(req) {
  const koaDocKeys = keys.default.okaDoc;
  const enabled = koaDocKeys.enabled;
  if (enabled === true) {
    const okaDocURL = koaDocKeys.url;
    const {
      appointment_date,
      appointment_from_time,
      appointment_to_time,
      patient_name,
      date_of_birth,
      contact_number,
      email,
      gender,
      send_to_provider,
      confirmed,
      cancelled,
    } = req.body;
    const bookingID = req.records.insertId;
    const doctorID = req.employee_code;
    const clinicID = req.sub_department_code;
    const from_time = moment(
      `${appointment_date} ${appointment_from_time}`,
      "YYYY-MM-DD HH:mm:ss"
    ).format("YYYY-MM-DDTHH:mm:ssZ");
    const to_time = moment(
      `${appointment_date} ${appointment_to_time}`,
      "YYYY-MM-DD HH:mm:ss"
    ).format("YYYY-MM-DDTHH:mm:ssZ");
    const status =
      send_to_provider === "Y"
        ? "attended"
        : cancelled === "Y"
        ? "cancelled"
        : "upcoming";
    const name = patient_name.split(" ");
    const firstName = name[0];
    let lastName = "";
    for (let i = 1; i < name.length; i++) {
      lastName += `${name[i]} `;
    }

    axios
      .post(`${okaDocURL}/sync`, {
        bookingID: bookingID,
        doctorID: doctorID,
        clinicID: clinicID,
        serviceID: 1,
        time: from_time,
        end_time: to_time,
        "Status of Appointment": status,
        patient: {
          gender: gender.toLowerCase(),
          firstname: firstName,
          lastname: lastName === "" ? " " : lastName,
          email: email,
          phone: contact_number,
          dateofbirth: date_of_birth,
        },
      })
      .then((result) => {
        console.log("Successfully sended to OKADOC :", result.data);
      })
      .catch((error) => {
        console.error(
          "Sending Apoointment to OKADOC has issue :",
          error.response.data
        );
      });
  }
}
export function updatePatientAppointment(req) {
  const koaDocKeys = keys.default.okaDoc;
  const enabled = koaDocKeys.enabled;
  if (enabled === true) {
    const okaDocURL = koaDocKeys.url;
    const {
      appointment_date,
      appointment_from_time,
      appointment_to_time,
      cancel_reason,
    } = req.body;
    const bookingID = req.records.insertId;
    const doctorID = req.employee_code;
    const clinicID = req.sub_department_code;
    const appointment_status = req.appointment_status;
    const fromTime = moment(
      `${appointment_date} ${appointment_from_time}`,
      "YYYY-MM-DD HH:mm:ss"
    ).format("YYYY-MM-DD HH-mm-ss");
    const toTime = moment(
      `${appointment_date} ${appointment_to_time}`,
      "YYYY-MM-DD HH:mm:ss"
    ).format("YYYY-MM-DD HH-mm-ss");

    axios
      .post(`${okaDocURL}/update`, {
        time: fromTime,
        end_time: toTime,
        newBookingID: bookingID,
        cancel_reason: cancel_reason,
        status: appointment_status,
      })
      .then((response) => {
        console.log("Successfully Update", response.data);
      })
      .catch((error) => {
        console.error("Update has issue : " + error.response.data);
      });
  }
}
