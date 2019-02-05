//created by irfan: how many leaves are left in each leave type
let getLeaveBalance = (req, res, next) => {
  // let selectWhere = {
  //   employee_id: "ALL"
  // };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    //let where = whereCondition(extend(selectWhere, req.query));
    const from_year = moment(input.from_date).format("YYYY");

    if (from_year == to_year) {
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id, total_eligible,\
        availed_till_date, close_balance,\
        L.hims_d_leave_id,L.leave_code,L.leave_description,L.leave_type from \
        hims_f_employee_monthly_leave ML inner join\
        hims_d_leave L on ML.leave_id=L.hims_d_leave_id and L.record_status='A'\
        where ML.employee_id=? and ML.leave_id=? and  ML.year in (?)",
          [input.employee_id, input.leave_id, from_year],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              releaseDBConnection(db, connection);
              next(error);
            }

            debugLog("result:", result);
            if (result.length > 0) {
              let m_total_eligible = result[0]["total_eligible"];
              let m_availed_till_date = result[0]["availed_till_date"];
              let m_close_balance = result[0]["close_balance"];

              debugLog("m_total_eligible:", m_total_eligible);
              debugLog("m_availed_till_date:", m_availed_till_date);
              debugLog("m_close_balance:", m_close_balance);

              if (m_close_balance >= input.total_applied_days) {
                //folow start here

                req.records = result;
                next();
              } else {
                req.records = {
                  leave_already_exist: true,
                  message: "leave application exceed total eligible leaves"
                };
                next();
                return;
              }
            } else {
              req.records = {
                leave_already_exist: true,
                message: "you cant apply for this leave type"
              };
              next();
              return;
            }
          }
        );
      });
    } else {
      req.records = {
        leave_already_exist: true,
        message: "cannot apply leave for next year "
      };
      next();
      return;
    }
  } catch (e) {
    next(e);
  }
};
