import { createNotification } from "./utils";
import algaehMysql from "algaeh-mysql";
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

async function getAuthLeaveEmps(level) {
  const _mysql = new algaehMysql();

  const res = await _mysql.executeQuery({
    query: `select  UM.user_id, UM.role_id,U.employee_id,E.employee_code,E.full_name
from algaeh_m_role_user_mappings UM inner join algaeh_d_app_roles R on
UM.role_id=R.app_d_app_roles_id and R.leave_authorize_privilege ='${level}'
inner join algaeh_d_app_user U on UM.user_id=U.algaeh_d_app_user_id 
inner join hims_d_employee E on U.employee_id=E.hims_d_employee_id;`,
  });
  const empIds = res.map((item) => item.employee_id);
  const secondMsg = `New Leave Request waiting for level ${level} authorization`;

  const save = await Promise.all(
    empIds.map((id) =>
      createNotification({
        user_id: id,
        message: secondMsg,
        title: "HR Management",
      })
    )
  );
  empIds.forEach((id, index) => {
    socket.to(`${id}`).emit("notification", save[index]);
  });
}

async function getAuthLoanEmps(level) {
  const _mysql = new algaehMysql();

  const res = await _mysql.executeQuery({
    query: `select  UM.user_id, UM.role_id,U.employee_id,E.employee_code,E.full_name
    from algaeh_m_role_user_mappings UM inner join algaeh_d_app_roles R on
    UM.role_id=R.app_d_app_roles_id and R.loan_authorize_privilege ='${level}'
    inner join algaeh_d_app_user U on UM.user_id=U.algaeh_d_app_user_id 
    inner join hims_d_employee E on U.employee_id=E.hims_d_employee_id;`,
  });
  const empIds = res.map((item) => item.employee_id);
  const secondMsg = `New Loan Request waiting for level ${level} authorization`;

  const save = await Promise.all(
    empIds.map((id) =>
      createNotification({
        user_id: id,
        message: secondMsg,
        title: "HR Management",
      })
    )
  );
  empIds.forEach((id, index) => {
    socket.to(`${id}`).emit("notification", save[index]);
  });
}

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
        socket.to(`${reporting_to_id}`).emit("notification", doc);
      })
      .catch(() => console.log(err));
  });

  socket.on("/leave/authorized", async (emp_id, leave_date, level) => {
    try {
      const msg = `Your request for leave on ${leave_date} has been authorized by Level ${level}`;
      const doc = await createNotification({
        user_id: emp_id,
        message: msg,
        title: "HR Management",
      });
      socket.to(`${emp_id}`).emit("notification", doc);
      if (level < 3) {
        await getAuthLeaveEmps(level + 1);
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("/leave/rejected", (emp_id, leave_date, level) => {
    const msg = `Your request for leave on ${leave_date} has been rejected by Level ${level}`;
    createNotification({
      message: msg,
      user_id: emp_id,
      title: "HR Management",
    }).then((doc) => {
      socket.to(`${emp_id}`).emit("notification", doc);
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
      socket.to(`${reporting_to_id}`).emit("notification", doc);
    });
  });

  socket.on("/loan/authorized", async (emp_id, level) => {
    try {
      const msg = `Your loan request has been accepted by Level ${level}`;
      const doc = await createNotification({
        message: msg,
        user_id: emp_id,
        title: "HR Management",
      });
      socket.to(`${emp_id}`).emit("notification", doc);
      if (level < 3) {
        await getAuthLoanEmps(level + 1);
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("/loan/rejected", (emp_id, level) => {
    const msg = `Your loan request has been rejected by Level ${level}`;
    createNotification({
      message: msg,
      user_id: emp_id,
      title: "HR Management",
    }).then((doc) => {
      socket.to(`${emp_id}`).emit("notification", doc);
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
      socket.to(`${reporting_to_id}`).emit("notification", doc);
    });
  });

  socket.on("/encash/applied", (payload) => {
    const { full_name, reporting_to_id, leave_type, leave_days } = payload;
    const msg = `${full_name} requested ${leave_type} encashment for ${leave_days} days `;
    createNotification({
      message: msg,
      user_id: reporting_to_id,
      title: "HR Management",
    }).then((doc) => {
      socket.to(`${reporting_to_id}`).emit("notification", doc);
    });
  });
}

export default selfSocket;
