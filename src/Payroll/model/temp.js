notifyException: (req, res, next) => {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;

    let employee_id = "";

    if (input.hims_d_employee_id != null) {
      employee_id = " and employee_id=" + input.hims_d_employee_id;
    }

    _mysql
      .executeQuery({
        query: `select employee_id,attendance_date,attendance_date as login_date,\
          out_date as logout_date,in_time as punch_in_time,\
          out_time as punch_out_time,status from hims_f_daily_time_sheet where  \
           date(attendance_date)>=date(?) and date(out_date) <=date(?') \
           and status='EX' or status='AB' ${employee_id};`,
        values: [input.from_date, input.to_date],
        printQuery: true
      })
      .then(result => {
        if (result.length > 0) {
          let excptionArray = new LINQ(result)
            .Where(w => w.status == "EX")
            .Select(s => {
              return {
                employee_id: s.employee_id,
                attendance_date: s.attendance_date,
                regularize_status: "NFD",
                login_date: s.login_date,
                logout_date: s.logout_date,
                punch_in_time: s.punch_in_time,
                punch_out_time: s.punch_out_time,
                created_by: req.userIdentity.algaeh_d_app_user_id,
                created_date: new Date(),
                updated_by: req.userIdentity.algaeh_d_app_user_id,
                updated_date: new Date()
              };
            })
            .ToArray();

          let absentArray = new LINQ(result)
            .Where(w => w.status == "AB")
            .Select(s => {
              return {
                employee_id: s.employee_id,
                absent_date: s.attendance_date,
                from_session: "FD",
                to_session: "FD",
                status: "NFD",
                absent_duration: 1,
                created_by: req.userIdentity.algaeh_d_app_user_id,
                created_date: new Date(),
                updated_by: req.userIdentity.algaeh_d_app_user_id,
                updated_date: new Date()
              };
            })
            .ToArray();

          new Promise((resolve, reject) => {
            try {
              if (excptionArray.length > 0) {
                const insurtColumns = [
                  "employee_id",
                  "attendance_date",
                  "regularize_status",
                  "login_date",
                  "logout_date",
                  "punch_in_time",
                  "punch_out_time",
                  "created_by",
                  "created_date",
                  "updated_by",
                  "updated_date"
                ];
                _mysql
                  .executeQueryWithTransaction({
                    query:
                      "insert into hims_f_attendance_regularize(??) values?\
                    ON DUPLICATE KEY UPDATE punch_in_time=values(punch_in_time),punch_out_time=values(punch_out_time)\
                    ,login_date=values(login_date),logout_date=values(logout_date)\
                    ,updated_by=values(updated_by),updated_date=values(updated_date);",

                    values: excptionArray,
                    includeValues: insurtColumns,
                    bulkInsertOrUpdate: true
                  })
                  .then(exptionResult => {
                    //
                    resolve(exptionResult);
                  })
                  .catch(e => {
                    mysql.rollBackTransaction(() => {
                      next(e);
                    });
                  });
              } else {
                resolve({});
              }
            } catch (e) {
              reject(e);
            }
          }).then(result => {
            if (absentArray.length > 0) {
              const insertColumns = [
                "employee_id",
                "absent_date",
                "from_session",
                "to_session",
                "absent_duration",
                "status",
                "created_by",
                "created_date",
                "updated_by",
                "updated_date"
              ];
              _mysql
                .executeQueryWithTransaction({
                  query:
                    "insert into hims_f_absent(??) values?\
                    ON DUPLICATE KEY UPDATE from_session=values(from_session),to_session=values(to_session)\
                    ,absent_duration=values(absent_duration),status=values(status)\
                    ,updated_by=values(updated_by),updated_date=values(updated_date);",

                  values: absentArray,
                  includeValues: insertColumns,
                  bulkInsertOrUpdate: true
                })
                .then(result => {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = result;
                    next();
                  });
                })
                .catch(e => {
                  mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            } else {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = exptionResult;
                next();
              });
            }
          });
        } else {
          _mysql.releaseConnection();
          req.records =
            "No exception records found for the date range '" +
            input.from_date +
            " - '" +
            input.to_date +
            "'";
          next();
          return;
        }
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
