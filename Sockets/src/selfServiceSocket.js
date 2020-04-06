import { createNotification } from "./utils";
/*
  This function handles events on employee's selfService
  the services are leave, loan, advance
  the events are written like rest endpoint to stop them from opening pandora's box :)
  each event starts with service name like 'loan', 'leave' etc.
  the second path is action which are

  applied - when user appiled for a service this event is emitted from client
  requested - it is the reply for applied event which emits notification to appropirate user
  authorized - this event is fired when a service request get authorzied 
  rejected - same as above except it is emitted when request get rejected
  status - emitted to notify the user whether his service request is either authorized or rejected 
*/

function selfSocket(socket) {
  // leave section
  socket.on("/leave/applied", (payload) => {
    const { full_name, reporting_to_id, leave_days, leave_type } = payload;
    const msg = `${full_name} is applied ${leave_type} for ${leave_days} days`;
    createNotification({
      message: msg,
      user_id: reporting_to_id,
      title: "HR Management",
    })
      .then((doc) => {
        socket.to(`${reporting_to_id}`).emit("/leave/requested", doc);
      })
      .catch(() => console.log(err));
  });

  socket.on("/leave/authorized", (emp_id, leave_date, level) => {
    const msg = `Your request for leave on ${leave_date} has been authorized by Level ${level}`;
    createNotification({
      user_id: emp_id,
      message: msg,
      title: "HR Management",
    }).then((doc) => {
      socket.to(`${emp_id}`).emit("/leave/status", doc);
    });
  });

  socket.on("/leave/rejected", (emp_id, leave_date, level) => {
    const msg = `Your request for leave on ${leave_date} has been rejected by Level ${level}`;
    createNotification({
      message: msg,
      user_id: emp_id,
      title: "HR Management",
    }).then((doc) => {
      socket.to(`${emp_id}`).emit("/leave/status", doc);
    });
  });

  //loan section
  socket.on("/loan/applied", (payload) => {
    const { full_name, reporting_to_id, loan_description } = payload;
    const msg = `${full_name} requested a ${loan_description}`;
    createNotification({
      message: msg,
      user_id: reporting_to_id,
      title: "HR Management",
    }).then((doc) => {
      socket.to(`${reporting_to_id}`).emit("/loan/requested", doc);
    });
  });

  socket.on("/loan/authorized", (emp_id, level) => {
    const msg = `Your loan request has been accepted by Level ${level}`;
    createNotification({
      message: msg,
      user_id: emp_id,
      title: "HR Management",
    }).then((doc) => {
      socket.to(`${emp_id}`).emit("/loan/status", doc);
    });
  });

  socket.on("/loan/rejected", (emp_id, level) => {
    const msg = `Your loan request has been rejected by Level ${level}`;
    createNotification({
      message: msg,
      user_id: emp_id,
      title: "HR Management",
    }).then((doc) => {
      socket.to(`${emp_id}`).emit("/loan/status", doc);
    });
  });

  socket.on("/advance/applied", (payload) => {
    const { full_name, reporting_to_id, advance_amount } = payload;
    const msg = `${full_name} requested ${advance_amount} as advance`;
    createNotification({
      message: msg,
      user_id: reporting_to_id,
      title: "HR Management",
    }).then((doc) => {
      socket.to(`${reporting_to_id}`).emit("/loan/requested", doc);
    });
  });

  socket.on("/advance/applied", (payload) => {
    const { full_name, reporting_to_id, leave_type, days } = payload;
    const msg = `${full_name} requested ${leave_type} encashment for ${days} days `;
    createNotification({
      message: msg,
      user_id: reporting_to_id,
      title: "HR Management",
    }).then((doc) => {
      socket.to(`${reporting_to_id}`).emit("/loan/requested", doc);
    });
  });
}

export default selfSocket;
