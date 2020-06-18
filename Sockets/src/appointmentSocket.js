import { notifiModel } from "./model";
import { formatDate, formatTime } from "./utils";

const apsock = (socket) => {
  socket.on("appointment_created", (patient) => {
    // frontdesk users
    const frontMsg = `Patient ${patient.patient_name} added to ${formatTime(
      patient.appointment_from_time
    )} slot ${formatDate(patient.appointment_date)}`;

    console.log(frontMsg, "mes");

    const frontDeskNot = new notifiModel({
      module: "ftdsk",
      message: frontMsg,
      title: "FrontDesk",
    });
    frontDeskNot.save().then((doc) => {
      console.log("saved");
      socket.broadcast.to("ftdsk").emit("refresh_appointment", doc);
    });

    // doctor
    const time = formatTime(patient.appointment_from_time);
    const date = formatDate(patient.appointment_date);
    const docMsg = `${patient.patient_name} booked an appointment on ${time}
    ${date}`;
    const docNoti = new notifiModel({
      user_id: patient.provider_id,
      message: docMsg,
      title: "FrontDesk",
    });
    docNoti.save().then((doc) => {
      console.log("saved");
      socket.broadcast.to(`${patient.provider_id}`).emit("patient_added", doc);
    });
  });
  socket.on("patient_checked", (patient) => {
    const docMsg = `${patient.full_name} checked in for consultaion on ${patient.visit_date}`;
    const docNoti = new notifiModel({
      user_id: patient.provider_id,
      message: docMsg,
      title: "FrontDesk",
    });
    docNoti.save().then((doc) => {
      console.log("saved");
      socket.broadcast.to(`${patient.provider_id}`).emit("patient_added", doc);
    });
  });
};

export default apsock;
