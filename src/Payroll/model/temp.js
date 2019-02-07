//created by irfan:
deleteLeaveEncash: (req, res, next) => {
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();

  if (req.query.hims_d_leave_encashment_id > 0) {
    _mysql
      .executeQuery({
        query:
          "DELETE from  hims_d_leave_encashment WHERE hims_d_leave_encashment_id=?",
        values: [req.query.hims_d_leave_encashment_id],

        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

        if (result.affectedRows > 0) {
          req.records = result;
          next();
        } else {
          req.records = {
            invalid_input: true,
            message: "please provide valid input"
          };
          next();
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
