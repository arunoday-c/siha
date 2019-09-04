function socketListeners(that) {
  that.socket.on("refresh_appointment", patient => {
    that.addToNotiList(
      `Patient ${patient.patient_name} added to ${that.formatTime(
        patient.appointment_from_time
      )} slot ${that.formatDate(patient.appointment_date)}`
    );
  });
  that.socket.on("patient_added", patient => {
    const time = that.formatTime(patient.appointment_from_time);
    const date = that.formatDate(patient.appointment_date);
    that.addToNotiList(
      `${patient.patient_name} booked an appointment on ${time}
      ${date}`
    );
  });
  that.socket.on("service_added", (department, services) => {
    let serStr = "";
    if (services.length === 1) {
      serStr = `${services[0]} is`;
    } else {
      services.forEach(service => {
        serStr = serStr + service;
      });
      serStr = `${serStr} are`;
    }
    that.addToNotiList(`${serStr} added to ${department}  `);
  });
}

export default socketListeners;
