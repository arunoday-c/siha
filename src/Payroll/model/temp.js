getDailyTimeSheet: (req, res, next) => {
  const _mysql = new algaehMysql();

  const utilities = new algaehUtilities();

  let options = [];
  let allHolidays = [];
  let AllLeaves = [];
  let AllEmployees = [];
  let biometric_ids = [];

  utilities.logger().log("yearAndMonth: ", "yearAndMonth");

  let input = req.query;
  try {
    if (
      input.from_date != null &&
      input.to_date != null &&
      input.hospital_id > 0
    ) {
      let attendcResult = [];
      let actual_hours = "";
      let biometricData = [];
      let singleEmployee = "N";

      let from_date = moment(input.from_date).format("YYYY-MM-DD");
      let to_date = moment(input.to_date).format("YYYY-MM-DD");

      let stringData = "";
      if (input.sub_department_id > 0) {
        stringData += " and sub_department_id=" + input.sub_department_id;
      }
      if (input.hims_d_employee_id > 0) {
        stringData += " and hims_d_employee_id=" + input.hims_d_employee_id;
      }

      _mysql
        .executeQuery({
          query:
            "SELECT * FROM hims_test_db.hims_d_hrms_options;\
              select hims_d_holiday_id, hospital_id, holiday_date, holiday_description,weekoff, holiday, holiday_type,\
              religion_id from hims_d_holiday where record_status='A' and date(holiday_date) between date(?) and date(?) and hospital_id=?;\
              select hims_f_leave_application_id,leave_application_code,employee_id,application_date,sub_department_id,\
                  leave_id,from_leave_session,from_date,to_date,to_leave_session,status,L.leave_type from hims_f_leave_application LA,hims_d_leave L \
                  where `status`='APR'  and LA.leave_id=L.hims_d_leave_id  AND ((from_date>= ? and from_date <= ?) or\
                  (to_date >= ? and to_date <= ?) or (from_date <= ? and to_date >= ?)); \
                  select hims_d_employee_id,biometric_id,date_of_joining,exit_date,sub_department_id,religion_id from hims_d_employee where record_status='A'\
                  and employee_status='A'and biometric_id is not null and hospital_id=? and hims_d_employee_id>491 and (( date(date_of_joining) <= date(?) and date(exit_date) >= date(?)) or\
                  (date(date_of_joining) <= date(?) and exit_date is null))" +
            stringData,
          values: [
            from_date,
            to_date,
            input.hospital_id,
            from_date,
            to_date,
            from_date,
            to_date,
            from_date,
            to_date,
            input.hospital_id,
            to_date,
            from_date,
            to_date
          ],
          printQuery: true
        })
        .then(result => {
          options = result[0];
          allHolidays = result[1];
          AllLeaves = result[2];
          AllEmployees = result[3];

          utilities.logger().log("options: ", options);
          utilities.logger().log("allHolidays: ", allHolidays);
          utilities.logger().log("AllLeaves: ", AllLeaves);
          utilities.logger().log("AllEmployees: ", AllEmployees);

          if (
            AllEmployees.length > 0 &&
            options.length > 0 &&
            options[0]["biometric_database"] == "SQL"
          ) {
            actual_hours = options[0]["standard_working_hours"];

            var sql = require("mssql");

            // config for your database
            var config = {
              user: options[0]["biometric_database_login"],
              password: options[0]["biometric_database_password"],
              server: options[0]["biometric_server_name"],
              database: options[0]["biometric_database_name"]
            };

            biometric_ids = new LINQ(AllEmployees)
              .Select(s => s.biometric_id)
              .ToArray();

            let employee_ids = new LINQ(AllEmployees)
              .Select(s => s.hims_d_employee_id)
              .ToArray();

            let returnQry = `  select hims_f_daily_time_sheet_id, employee_id,TS.biometric_id, attendance_date, \
              in_time, out_date, out_time, year, month, status,\
               posted, hours, minutes, actual_hours, actual_minutes, worked_hours,\
               expected_out_date, expected_out_time ,hims_d_employee_id,employee_code,full_name as employee_name\
               from  hims_f_daily_time_sheet TS \
              inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id\
              where attendance_date between ('${from_date}') and ('${to_date}') and employee_id in (${employee_ids})`;

            utilities.logger().log("biometric_ids : ", biometric_ids);
            //---------------------------------------------------
            // connect to your database
            sql.close();
            sql.connect(config, function(err) {
              if (err) {
                utilities.logger().log("connection eror: ", "connection eror");
                next(err);
              }
              // create Request object
              var request = new sql.Request();

              // let biometric_id =
              //   req.query.biometric_id > 0 ? req.query.biometric_id : [106];
              // let bio_ids = "";

              // if (req.query.biometric_id > 0) {
              //   bio_ids = ` and TS.biometric_id=${req.query.biometric_id} `;
              // }

              utilities.logger().log("from_date ", from_date);
              utilities.logger().log("to_date ", to_date);
              // query to the biometric database and get the records

              // select  TOP (100) UserID as biometric_id ,PDate as attendance_date,Punch1 as in_time,Punch2 as out_time,\
              // Punch2 as out_date   from Mx_DATDTrn  where UserID in (${biometric_id}) and PDate>='${from_date}'  and\
              // PDate<='${to_date}'

              request.query(
                `;WITH CTE AS(
                    SELECT
                        UserID,
                        DateTime,
                        AccessDate = CAST(DateTime AS DATE),
                        AccessTime = CAST(DateTime AS TIME),       
                        InOut,
                        In_RN = ROW_NUMBER() OVER(PARTITION BY UserID, CAST(DateTime AS DATE), InOut ORDER BY CAST(DateTime AS TIME) ASC),
                        Out_RN = ROW_NUMBER() OVER(PARTITION BY UserID, CAST(DateTime AS DATE), InOut ORDER BY CAST(DateTime AS TIME) DESC)
                    FROM [FTDP].[dbo].[Transaction] where cast(DateTime  as date)between 
                    '${from_date}' and '${to_date}' and UserId in (${biometric_ids})
                  )
                  SELECT
                    UserID,  
                    [Date] = CONVERT(VARCHAR(10), AccessDate, 101),
                    InTime= ISNULL(SUBSTRING(CONVERT(VARCHAR(20), MAX(CASE WHEN InOut = 0 AND In_RN = 1 THEN AccessTime END)), 1, 5), null),
                    OutTime = ISNULL(SUBSTRING(CONVERT(VARCHAR(20), MAX(CASE WHEN InOut = 1 AND OUT_RN = 1 THEN AccessTime END)), 1, 5), null),
                    Duration =  ISNULL(RIGHT('00' +             
                                CONVERT(VARCHAR(2), DATEDIFF(MINUTE, 
                                    MAX(CASE WHEN InOut = 0 AND In_RN = 1 THEN AccessTime END), 
                                    MAX(CASE WHEN InOut = 1 AND OUT_RN = 1 THEN AccessTime END)
                                )/60), 2) + '.' +
                                RIGHT('00' +CONVERT(VARCHAR(2), DATEDIFF(MINUTE, 
                                    MAX(CASE WHEN InOut = 0 AND In_RN = 1 THEN AccessTime END), 
                                    MAX(CASE WHEN InOut = 1 AND OUT_RN = 1 THEN AccessTime END)
                                )%60), 2)
                            ,0.0)
                  FROM CTE
                  GROUP BY UserID, AccessDate
                  ORDER BY  AccessDate `,

                function(err, attResult) {
                  if (err) {
                    utilities.logger().log("qry error ", err);
                    next(err);
                  }

                  utilities.logger().log("attResult", attResult["recordset"]);
                  attendcResult = attResult["recordset"];
                  sql.close();

                  if (attendcResult.length > 0 && from_date == to_date) {
                    for (let i = 0; i < AllEmployees.length; i++) {
                      biometricData.push(
                        new LINQ(attendcResult)
                          .Where(
                            w => w.UserID == AllEmployees[i]["biometric_id"]
                          )
                          .Select(s => {
                            return {
                              biometric_id: s.UserID,
                              attendance_date: moment(
                                s.Date,
                                "MM-DD-YYYY"
                              ).format("YYYY-MM-DD"),
                              out_date: moment(s.Date, "MM-DD-YYYY").format(
                                "YYYY-MM-DD"
                              ),
                              in_time: s.InTime,
                              out_time: s.OutTime,
                              worked_hours: s.Duration,
                              employee_id:
                                AllEmployees[i]["hims_d_employee_id"],
                              religion_id: AllEmployees[i]["religion_id"],
                              date_of_joining:
                                AllEmployees[i]["date_of_joining"],
                              exit_date: AllEmployees[i]["exit_date"],
                              actual_hours: actual_hours,
                              hours: s.Duration.split(".")[0],
                              minutes: s.Duration.split(".")[1]
                            };
                          })
                          .FirstOrDefault({
                            biometric_id: null,
                            attendance_date: from_date,
                            out_date: from_date,
                            in_time: null,
                            out_time: null,
                            worked_hours: 0,
                            employee_id: AllEmployees[i]["hims_d_employee_id"],
                            religion_id: AllEmployees[i]["religion_id"],
                            date_of_joining: AllEmployees[i]["date_of_joining"],
                            exit_date: AllEmployees[i]["exit_date"],
                            actual_hours: actual_hours,
                            hours: 0,
                            minutes: 0
                          })
                      );
                    }
                    utilities.logger().log("biometricData", biometricData);

                    insertTimeSheet(
                      returnQry,
                      biometricData,
                      AllLeaves,
                      allHolidays,
                      from_date,
                      to_date,
                      _mysql,
                      req,
                      res,
                      next,
                      singleEmployee
                    );
                  } else if (
                    input.hims_d_employee_id > 0 &&
                    attendcResult.length > 0 &&
                    from_date < to_date
                  ) {
                    singleEmployee = "Y";

                    utilities.logger().log("date_range:", "date_range");

                    let date_range = getDays(
                      new Date(from_date),
                      new Date(to_date)
                    );
                    utilities.logger().log("date_range:", date_range);

                    for (let i = 0; i < date_range.length; i++) {
                      utilities.logger().log("i ", date_range[i]);

                      biometricData.push(
                        new LINQ(attendcResult)
                          .Where(
                            w =>
                              moment(w.Date, "MM-DD-YYYY").format(
                                "YYYY-MM-DD"
                              ) == date_range[i]
                          )
                          .Select(s => {
                            return {
                              biometric_id: s.UserID,
                              attendance_date: date_range[i],
                              out_date: date_range[i],
                              in_time: s.InTime,
                              out_time: s.OutTime,
                              worked_hours: s.Duration,
                              employee_id:
                                AllEmployees[0]["hims_d_employee_id"],
                              religion_id: AllEmployees[0]["religion_id"],
                              date_of_joining:
                                AllEmployees[0]["date_of_joining"],
                              exit_date: AllEmployees[0]["exit_date"],
                              actual_hours: actual_hours,
                              hours: s.Duration.split(".")[0],
                              minutes: s.Duration.split(".")[1]
                            };
                          })
                          .FirstOrDefault({
                            biometric_id: null,
                            attendance_date: date_range[i],
                            out_date: null,
                            in_time: null,
                            out_time: null,
                            worked_hours: 0,
                            employee_id: AllEmployees[0]["hims_d_employee_id"],
                            religion_id: AllEmployees[0]["religion_id"],
                            date_of_joining: AllEmployees[0]["date_of_joining"],
                            exit_date: AllEmployees[0]["exit_date"],
                            actual_hours: actual_hours,
                            hours: 0,
                            minutes: 0
                          })
                      );
                    }
                    utilities
                      .logger()
                      .log("biometricData single emp", biometricData);
                    insertTimeSheet(
                      returnQry,
                      biometricData,
                      AllLeaves,
                      allHolidays,
                      from_date,
                      to_date,
                      _mysql,
                      req,
                      res,
                      next,
                      singleEmployee
                    );
                  } else {
                    req.records = {
                      invalid_data: true,
                      message: "no punches exist"
                    };
                    _mysql.releaseConnection();

                    next();
                  }
                }
              );
            });
            //---------------------------------------------------
          } else {
            //no matchimg data
            req.records = {
              invalid_data: true,
              message: "biometric database or Employees not found "
            };
            _mysql.releaseConnection();

            next();
          }
        })
        .catch(e => {
          utilities.logger().log("error: ", e);
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please select a branch and  date"
      };
      next();
    }
  } catch (e) {
    next(e);
  }
};
