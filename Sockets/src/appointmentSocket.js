let count = 0;

const apsock = socket => {
  socket.on("appointment_created", patient => {
    console.log(patient);
    socket.broadcast.to("ftdsk").emit("refresh_appointment", patient);
    socket.broadcast
      .to(`${patient.provider_id}`)
      .emit("patient_added", patient);
  });
};

export default apsock;
