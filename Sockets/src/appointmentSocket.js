import { notifiModel } from "./model";
import { formatDate, formatTime } from "./utils";

const apsock = (socket) => {
  socket.on("appointment_created", (patient) => {
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
