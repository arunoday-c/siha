//created by irfan:
deleteLeaveApplication: (req, res, next) => {
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();
  let input = req.body;
  if (input.hims_f_leave_application_id > 0) {
    _mysql
      .executeQuery({
        query:
          "select hims_f_leave_application_id,employee_id,authorized1,authorized2,\
          authorized3,`status`from hims_f_leave_application where authorized1='N' \
          and authorized2='N' and authorized3='N' and `status`='PEN' and employee_id=?\
          and hims_f_leave_application_id=?",
        values: [req.body.employee_id, req.body.hims_f_leave_application_id],

        printQuery: true
      })
      .then(result => {
        //  _mysql.releaseConnection();
        // if (result.affectedRows > 0) {
        //   req.records = result;
        //   next();
        // } else {
        //   req.records = {
        //     invalid_input: true,
        //     message: "please provide valid id"
        //   };
        //   next();
        // }
        if (result.length > 0) {
          _mysql
            .executeQuery({
              query:
                "delete from hims_f_leave_application where hims_f_leave_application_id=?",
              values: [req.body.hims_f_leave_application_id],

              printQuery: true
            })
            .then(delResult => {
              _mysql.releaseConnection();

              if (delResult.affectedRows > 0) {
                req.records = delResult;
                next();
              } else {
                req.records = {
                  invalid_input: true,
                  message: `invalid input`
                };
                next();
              }
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: `can't delete, Application is under proccess`
          };
          next();
          return;
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  } else {
    req.records = {
      invalid_input: true,
      message: "please provide valid input"
    };

    next();
    return;
  }
};
