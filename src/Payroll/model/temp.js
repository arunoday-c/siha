//created by irfan:
addAttendanceRegularization: (req, res, next) => {
  const _mysql = new algaehMysql();
  let input = req.body;
  _mysql
    .generateRunningNumber({
      modules: ["ATTENDANCE_REGULARIZE"]
    })
    .then(numGenReg => {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_f_attendance_regularize` (regularization_code,employee_id,attendance_date,\
        login_date,logout_date,\
         punch_in_time,punch_out_time,regularize_in_time,regularize_out_time,regularization_reason,\
         created_by,created_date,updated_by,updated_date)\
         VALUE(?,?,date(?),date(?),date(?),?,?,?,?,?,?,?,?,?)",
          values: [
            numGenReg[0],
            input.employee_id,
            input.attendance_date,
            input.login_date,
            input.logout_date,
            input.punch_in_time,
            input.punch_out_time,
            input.regularize_in_time,
            input.regularize_out_time,
            input.regularization_reason,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date()
          ]
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    })
    .catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
};
