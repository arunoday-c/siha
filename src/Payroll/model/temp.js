//created by irfan:
let getEmployeeLeaveData = (req, res, next) => {
  // let selectWhere = {
  //   employee_id: "ALL"
  // };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    // let year = "";

    // let selfservice = "";
    // if (req.query.selfservice == "Y") {
    //   selfservice = ` and  (LD.employee_type='${
    //     req.query.employee_type
    //   }' and  (LD.gender='${req.query.gender}' or LD.gender='BOTH' ))`;
    // }

    if (req.query.year > 0 && req.query.employee_id > 0) {
      // select hims_f_employee_monthly_leave_id, employee_id, year, leave_id, L.leave_code,\
      // L.leave_description,total_eligible, availed_till_date, close_balance,\
      // E.employee_code ,E.full_name as employee_name\
      // from hims_f_employee_monthly_leave  ML inner join hims_d_leave L on ML.leave_id=L.hims_d_leave_id \
      // inner join hims_d_employee E on ML.employee_id=E.hims_d_employee_id and E.record_status='A'\
      // and L.record_status='A' where ML.year=? and ML.employee_id=? \
      //  order by hims_f_employee_monthly_leave_id desc;
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id, L.leave_code,\
          L.leave_description,total_eligible, availed_till_date, close_balance,\
          E.employee_code ,E.full_name as employee_name,\
          LD.hims_d_leave_detail_id,LD.employee_type, LD.eligible_days\
          from hims_f_employee_monthly_leave  ML inner join hims_d_leave L on ML.leave_id=L.hims_d_leave_id       \
          inner join hims_d_leave_detail LD on L.hims_d_leave_id=LD.leave_header_id\
          inner join hims_d_employee E on ML.employee_id=E.hims_d_employee_id and E.record_status='A'\
          and L.record_status='A' where ML.year=? and ML.employee_id=?  and  LD.employee_type=E.employee_type and  (LD.gender=E.sex or LD.gender='BOTH' )\
            order by hims_f_employee_monthly_leave_id desc;",
          [req.query.year, req.query.employee_id],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }
            req.records = result;
            next();
          }
        );
      });
    } else {
      req.records = {
        invalid_input: true,
        message:
          "Please Provide  Valid (year,employee_id,gender,employee_type) "
      };

      next();
      return;
    }
  } catch (e) {
    next(e);
  }
};
