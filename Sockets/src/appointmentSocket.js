const apsock = io => {
  const appIo = io.of("/appointment");

  appIo.on("connection", socket => {
    console.log("Appointment Socket opened");
    socket.on("appointment_created", patient => {
      socket.broadcast.emit("refresh_appointment", patient);
    });
  });
};

export default apsock;
