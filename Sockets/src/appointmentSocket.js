let count = 0;

const apsock = io => {
  const appIo = io.of("/ftdsk");

  appIo.on("connection", socket => {
    console.log("Appointment Socket opened");
    count++;
    console.log(count, "connected");
    socket.on("appointment_created", patient => {
      socket.broadcast.emit("refresh_appointment", patient);
    });
    socket.on("disconnect", () => {
      console.log(count, "disconneted");
      count--;
    });
  });
};

export default apsock;
