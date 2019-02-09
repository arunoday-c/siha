//created by Adnan
let adjustLoanApplication = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    if (
      input.hims_f_loan_application_id != "null" &&
      input.hims_f_loan_application_id != undefined &&
      input.loan_skip_months != "null" &&
      input.loan_skip_months != undefined
    ) {
      db.getConnection((error, connection) => {
        connection.query(
          "UPDATE hims_f_loan_application SET loan_skip_months = ?,\
            updated_date=?, updated_by=?  WHERE record_status='A' and  hims_f_loan_application_id = ?",
          [
            input.loan_skip_months,
            new Date(),
            input.updated_by,
            input.hims_f_loan_application_id
          ],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }

            if (result.affectedRows > 0) {
              req.records = result;
              next();
            } else {
              req.records = { invalid_input: true };
              next();
            }
          }
        );
      });
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};
