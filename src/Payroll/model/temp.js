let saveF = (req, db, next, connection, input, msg) => {
  connection.beginTransaction(error => {
    if (error) {
      connection.rollback(() => {
        releaseDBConnection(db, connection);
        next(error);
      });
    }
    req, next, input, msg;
    debugLog("inside saveF:", msg);
    new Promise((resolve, reject) => {
      try {
        runningNumberGen({
          db: connection,
          module_desc: ["EMPLOYEE_LEAVE"],
          onFailure: error => {
            reject(error);
          },
          onSuccess: result => {
            resolve(result);
          }
        });
      } catch (e) {
        connection.rollback(() => {
          releaseDBConnection(db, connection);
          reject(e);
        });
      }
    }).then(numGenLeave => {
      connection.query(
        "INSERT INTO `hims_f_leave_application` (leave_application_code,employee_id,application_date,sub_department_id,leave_id,leave_type,\
    from_date,to_date,from_leave_session,to_leave_session,leave_applied_from,total_applied_days, created_date, created_by, updated_date, updated_by)\
    VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          numGenLeave[0]["completeNumber"],
          input.employee_id,
          new Date(),
          input.sub_department_id,
          input.leave_id,
          input.leave_type,
          input.from_date,
          input.to_date,
          input.from_leave_session,
          input.to_leave_session,
          input.leave_applied_from,
          input.total_applied_days,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, results) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }
          debugLog("inside leave application");
          if (results.affectedRows > 0) {
            debugLog("affectedRows");

            connection.commit(error => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }

              debugLog("commit");
              releaseDBConnection(db, connection);
              req.records = results;
              next();
            });
          } else {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }
        }
      );
    });
  });
};
