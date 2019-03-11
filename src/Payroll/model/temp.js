{
  let inputValue = [input.branch_id, input.project_id];
  let strQuery = "";
  let employee = "";
  if (input.employee_id != null) {
    strQuery = " and TS.employee_id = ?";
    inputValue.push(input.employee_id);

    employee = " and employee_id=" + input.employee_id;
  }

  if (input.select_wise == "M") {
    const startOfMonth = moment(new Date(input.yearAndMonth))
      .startOf("month")
      .format("YYYY-MM-DD");

    const endOfMonth = moment(new Date(input.yearAndMonth))
      .endOf("month")
      .format("YYYY-MM-DD");
    strQuery += " and date(TS.attendance_date) between date (?) and date(?) ";
    inputValue.push(startOfMonth, endOfMonth);
  } else {
    strQuery += " and TS.attendance_date=? ";
    inputValue.push(input.attendance_date);
  }
  _mysql
    .executeQuery({
      query: ` select hims_f_daily_time_sheet_id,TS.employee_id,TS.attendance_date,in_time,out_time,worked_hours,\
          PR.hims_f_project_roster_id ,PR.project_id,E.employee_code,E.full_name,E.sub_department_id , E.date_of_joining    \ 
          from hims_f_daily_time_sheet TS  inner join  hims_f_project_roster PR  on TS.employee_id=PR.employee_id \
          and date(TS.attendance_date)=date(PR.attendance_date) and PR.project_id=1\
          inner join hims_d_employee E on PR.employee_id=E.hims_d_employee_id\
          where TS.hospital_id=1 and TS.attendance_date between date('2019-01-01') and date('2019-01-31') \
          and TS.employee_id=504 ${strQuery};
          
          select hims_f_leave_application_id,employee_id,leave_application_code,from_leave_session,from_date,to_leave_session,\
                    to_date from hims_f_leave_application\
                    where status='APR' and ((  date(${
                      input.from_date
                    })>=date(from_date) and date(${
        input.from_date
      })<=date(to_date)) or\
                    ( date(${input.to_date})>=date(from_date) and   date(${
        input.to_date
      })<=date(to_date))   or (date(from_date)>= date(${
        input.from_date
      }) and date(from_date)<=date(${input.to_date}) ) or \
                    (date(to_date)>=date(${
                      input.from_date
                    }) and date(to_date)<= date(${
        input.to_date
      }) )) ${employee};\
                    select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday,holiday_type,religion_id\
                from hims_d_holiday H where date(holiday_date) between date(${
                  input.from_date
                }) and date(${input.to_date});  `,
      values: inputValue,
      printQuery: true
    })
    .then(time_sheet => {
      let time_sheet = result[0];
      let allLeave = result[1];
      let allHolidays = result[2];
      if (time_sheet.length > 0) {
        _mysql.releaseConnection();
        req.records = { result: time_sheet, dataExist: true };
        next();
      } else {
        let _strDate = "";
        let intValues = [input.branch_id];
        let strQuery = "";
        if (input.attendance_date != null) {
          _strDate += "and PR/.attendance_date=?";
          intValues.push(input.attendance_date);
        }

        if (input.project_id != null) {
          _strDate += "and project_id=?";
          intValues.push(input.project_id);
        }

        if (input.employee_id != null) {
          _strDate += "and employee_id=? ";
          intValues.push(input.employee_id);
        }

        if (input.select_wise == "M") {
          const startOfMonth = moment(new Date(input.yearAndMonth))
            .startOf("month")
            .format("YYYY-MM-DD");

          const endOfMonth = moment(new Date(input.yearAndMonth))
            .endOf("month")
            .format("YYYY-MM-DD");
          _strDate +=
            " and date(PR.attendance_date) between date (?) and date(?) ";
          intValues.push(startOfMonth, endOfMonth);
        }

        strQuery = {
          query:
            "select PR.employee_id, E.employee_code,E.full_name,E.sub_department_id,PR.attendance_date from hims_f_project_roster PR , \
            hims_d_employee E where E.hims_d_employee_id=PR.employee_id and E.hospital_id=? " +
            _strDate,
          values: intValues,
          printQuery: true
        };

        _mysql
          .executeQuery(strQuery)
          .then(result => {
            _mysql.releaseConnection();
            req.records = { result, dataExist: false };
            next();
          })
          .catch(e => {
            next(e);
          });
      }
    })
    .catch(e => {
      next(e);
    });
}
