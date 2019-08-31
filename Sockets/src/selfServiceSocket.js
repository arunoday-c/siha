function selfSocket(socket) {
  socket.on("leave_applied", payload => {
    const { full_name, reporting_to_id, leave_days, leave_type } = payload;
    socket
      .to(`${reporting_to_id}`)
      .emit(
        "leave_requested",
        `${full_name} is applied ${leave_type} for ${leave_days} days`
      );
  });

  socket.on("leave_authorized", (emp_id, leave_date, level) => {
    socket
      .to(`${emp_id}`)
      .emit(
        "leave_status",
        `Your request for leave on ${leave_date} has been authorized by Level ${level}`
      );
  });

  socket.on("leave_rejected", (emp_id, leave_date, level) => {
    socket
      .to(`${emp_id}`)
      .emit(
        "leave_status",
        `Your request for leave on ${leave_date} has been rejected by Level ${level}`
      );
  });
}

export default selfSocket;
