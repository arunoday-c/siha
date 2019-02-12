//created by irfan:
let authorizeLoan = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    if (input.auth_level != "L1" && input.auth_level != "L2") {
      debugLog("L1 and L2 not defind");
      req.records = { invalid_input: true };
      next();
    } else if (input.auth_level == "L1") {
      db.getConnection((error, connection) => {
        connection.beginTransaction(error => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }
          connection.query(
            "UPDATE hims_f_loan_application SET authorized1_by=?,authorized1_date=?,\
          authorized1=?,approved_amount=?,start_year=?,start_month=?,installment_amount=?,\
          loan_tenure=?,pending_tenure=? updated_date=?, updated_by=?  WHERE hims_f_loan_application_id=?",

            [
              input.updated_by,
              new Date(),
              input.authorized,
              input.approved_amount,
              input.start_year,
              input.start_month,
              input.installment_amount,
              input.loan_tenure,
              input.loan_tenure,
              new Date(),
              input.updated_by,
              input.hims_f_loan_application_id
            ],
            (error, result) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
              debugLog("L1 result:", result);
              if (result.affectedRows > 0 && input.authorized == "R") {
                connection.query(
                  "update hims_f_loan_application set loan_authorized='REJ'\
                  where record_status='A' and loan_authorized='PEN' and hims_f_loan_application_id=?",
                  [input.hims_f_loan_application_id],
                  (error, rejResult) => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }

                    connection.commit(error => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      releaseDBConnection(db, connection);
                      req.records = rejResult;
                      debugLog("L1 rejResult:", rejResult);
                      next();
                    });
                  }
                );
              } else if (result.affectedRows > 0) {
                connection.commit(error => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }
                  releaseDBConnection(db, connection);
                  req.records = result;
                  next();
                });
              } else {
                req.records = { invalid_input: true };
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next();
                });
              }
            }
          );
        });
      });
    } else if (input.auth_level == "L2") {
      db.getConnection((error, connection) => {
        connection.beginTransaction(error => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }
          connection.query(
            "UPDATE hims_f_loan_application SET authorized2_by=?,authorized2_date=?,\
            authorized2=?,approved_amount=?,start_year=?,start_month=?,installment_amount=?,\
          loan_tenure=?,pending_tenure=?, updated_date=?, updated_by=?  WHERE hims_f_loan_application_id=?",

            [
              input.updated_by,
              new Date(),
              input.authorized,
              input.approved_amount,
              input.start_year,
              input.start_month,
              input.installment_amount,
              input.loan_tenure,
              input.loan_tenure,
              new Date(),
              input.updated_by,
              input.hims_f_loan_application_id
            ],
            (error, result) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
              debugLog("L2 result:", result);
              if (
                result.affectedRows > 0 &&
                (input.authorized == "R" || input.authorized == "A")
              ) {
                let qry = "";

                if (input.authorized == "R") {
                  qry = `update hims_f_loan_application set loan_authorized='REJ'\
                  where record_status='A' and loan_authorized='PEN' and hims_f_loan_application_id=${
                    input.hims_f_loan_application_id
                  }`;
                } else if (input.authorized == "A") {
                  qry = `update hims_f_loan_application set loan_authorized='APR',authorized_date='${moment().format(
                    "YYYY-MM-DD"
                  )}',\
                  authorized_by=${req.userIdentity.algaeh_d_app_user_id}\
                  where record_status='A' and loan_authorized='PEN' and hims_f_loan_application_id=${
                    input.hims_f_loan_application_id
                  }`;
                }
                connection.query(qry, (error, rejResult) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  connection.commit(error => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }
                    releaseDBConnection(db, connection);
                    req.records = rejResult;
                    next();
                  });
                });
              } else if (result.affectedRows > 0) {
                connection.commit(error => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }
                  releaseDBConnection(db, connection);
                  req.records = result;
                  next();
                });
              } else {
                req.records = { invalid_input: true };
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next();
                });
              }
            }
          );
        });
      });
    } else {
      debugLog("top else");
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};
