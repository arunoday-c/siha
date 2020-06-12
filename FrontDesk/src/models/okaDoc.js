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
    const dob = moment(date_of_birth).format("YYYY-MM-DD");

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
    const payLoad = {
      bookingID: bookingID.toString(),
      doctorID: doctorID, //"EMP0018", //doctorID,
      clinicID: clinicID, // "SUBDEP10038", //clinicID,
      serviceID: "1",
      time: from_time,
      end_time: to_time,
      status: status,
      patient: {
        gender: gender.toLowerCase(),
        firstname: firstName,
        lastname: lastName === "" ? " " : lastName,
        email: email,
        phone: contact_number.includes("+")
          ? contact_number
          : `+${contact_number}`,
        dateofbirth: dob,
      },
    };
    axios
      .post(`${okaDocURL}/sync`, payLoad, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${koaDocKeys.userName}:${koaDocKeys.password}`
          ).toString("base64")}`,
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
    ).format("YYYY-MM-DD HH:mm:ss");
    const toTime = moment(
      `${appointment_date} ${appointment_to_time}`,
      "YYYY-MM-DD HH:mm:ss"
    ).format("YYYY-MM-DD HH:mm:ss");

    const { hims_f_patient_appointment_id } = req.body;
    let payload = {};
    let url = "";
    if (appointment_status === "RS") {
      payload["reason"] = "Rescheduing from ALGAEH front desk";
      payload["time"] = fromTime;
      payload["end_time"] = toTime;
      url = `${okaDocURL}/reschedule/${hims_f_patient_appointment_id}`;
    } else if (appointment_status === "CAN") {
      payload["reason"] = cancel_reason;
      url = `${okaDocURL}/cancel/${hims_f_patient_appointment_id}`;
    } else if (appointment_status === "NS") {
      payload["status"] = "noshow";
      url = `${okaDocURL}/update/${hims_f_patient_appointment_id}`;
    }
    //  console.log("payload", payload);
    axios
      .post(url, payload, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${koaDocKeys.userName}:${koaDocKeys.password}`
          ).toString("base64")}`,
        },
      })
      .then((response) => {
        console.log("Successfully Update", response.data);
      })
      .catch((error) => {
        console.error(
          "Update has issue : " + JSON.stringify(error.response.data)
        );
      });
  }
}
