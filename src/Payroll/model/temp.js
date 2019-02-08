cancelAbsent: (req, res, next) => {
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();
  let input = req.body;

  if (input.hims_f_absent_id > 0) {
    _mysql
      .executeQuery({
        query:
          "UPDATE hims_f_absent SET cancel='Y',cancel_by=?,cancel_date=?,cancel_reason=?,\
         updated_date=?, updated_by=?  WHERE hims_f_absent_id = ?",
        values: [
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          input.cancel_reason,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.hims_f_absent_id
        ]
      })
      .then(result => {
        _mysql.releaseConnection();

        if (result.affectedRows > 0) {
          req.records = result;
          next();
        } else {
          req.records = {
            invalid_input: true,
            message: "please provide valid absent id"
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
