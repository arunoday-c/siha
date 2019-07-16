addDoctorsSchedule: (req, res, next) => {
  const _mysql = new algaehMysql();
  let input = req.body;

  let from_month = moment(input.from_date).format("M");
  let to_month = moment(input.to_date).format("M");

  if (
    moment(input.from_date).format("YYYYMMDD") < moment().format("YYYYMMDD")
  ) {
    req.records = {
      schedule_exist: true,
      message: "Cant create Schedule for the Past dates"
    };
    next();
    return;
  } else if (input.from_work_hr > input.to_work_hr) {
    req.records = {
      schedule_exist: true,
      message: "Schedule Time Cant be PM to AM "
    };
    next();
    return;
  } else if (input.from_work_hr == "00:00" && input.to_work_hr == "00:00") {
    req.records = {
      schedule_exist: true,
      message: "To Time Can't be Greater Than 11:59 PM"
    };
    next();
    return;
  } else {
    //creating schedule
    _mysql
      .executeQueryWithTransaction({
        query:
          "INSERT INTO `hims_d_appointment_schedule_header` (sub_dept_id,schedule_description,`month`,`year`,from_date,to_date,\
        from_work_hr,to_work_hr,work_break1,from_break_hr1,to_break_hr1,work_break2,from_break_hr2,to_break_hr2,monday,tuesday,wednesday,\
        thursday,friday,saturday,sunday,created_by,created_date,updated_by,updated_date,hospital_id)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        values: [
          input.sub_dept_id,
          input.schedule_description,
          from_month,
          input.year,
          input.from_date,
          input.to_date,
          input.from_work_hr,
          input.to_work_hr,
          input.work_break1,
          input.from_break_hr1,
          input.to_break_hr1,
          input.work_break2,
          input.from_break_hr2,
          input.to_break_hr2,
          input.monday,
          input.tuesday,
          input.wednesday,
          input.thursday,
          input.friday,
          input.saturday,
          input.sunday,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.hospital_id
        ],
        printQuery: true
      })
      .then(result => {
        let working_days = [];

        let inputDays = [
          req.body.sunday,
          req.body.monday,
          req.body.tuesday,
          req.body.wednesday,
          req.body.thursday,
          req.body.friday,
          req.body.saturday
        ];
        for (let d = 0; d < 7; d++) {
          if (inputDays[d] == "Y") {
            working_days.push(d);
          }
        }
        // let nightShift = "";

        // if (input.from_work_hr > input.to_work_hr) {
        //   nightShift = 1;
        // }

        let newDateList = getDaysArray(
          new Date(input.from_date),
          new Date(input.to_date),
          working_days
        );
        newDateList.map(v => v.toLocaleString());
        // adding doctors to created schedule
        if (input.schedule_detail.length != 0) {
          if (result.insertId != null) {
            //foreach doctor perfom below functionality
            for (let doc = 0; doc < input.schedule_detail.length; doc++) {
              let doctorSchedule = [];

              for (let i = 0; i < newDateList.length; i++) {
                doctorSchedule.push({
                  ...input.schedule_detail[doc],
                  ...{ schedule_date: newDateList[i] }
                });
              }
              //get list of dates which are already scheduled for this doctor

              _mysql
                .executeQuery({
                  query:
                    "select hims_d_appointment_schedule_detail_id,appointment_schedule_header_id,schedule_date from hims_d_appointment_schedule_detail  where provider_id=? and record_status='A' and schedule_date>?;",
                  values: [input.schedule_detail[doc].provider_id, new Date()]
                })
                .then(occupiedDoctorDates => {
                  let OccupiedDoctorDatesList = new LINQ(occupiedDoctorDates)
                    .Select(s => s.schedule_date)
                    .ToArray();

                  let clashingDate = [];
                  new LINQ(newDateList).Select(s => {
                    const index = OccupiedDoctorDatesList.indexOf(
                      moment(s).format("YYYY-MM-DD")
                    );
                    if (index > -1) {
                      clashingDate.push(OccupiedDoctorDatesList[index]);
                    }
                  });

                  //if date clashes check for time else add
                  if (clashingDate.length > 0) {
                    let appointment_schedule_header_idS = new LINQ(
                      occupiedDoctorDates
                    )
                      .Where(w => w.schedule_date == clashingDate[0])
                      .Select(s => s.appointment_schedule_header_id)
                      .ToArray();
                    //obtain existing schedule time

                    for (
                      let j = 0;
                      j < appointment_schedule_header_idS.length;
                      j++
                    ) {
                      _mysql
                        .executeQuery({
                          query:
                            "SELECT  hims_d_appointment_schedule_header_id,from_work_hr,to_work_hr from hims_d_appointment_schedule_header where\
                                  ((time(from_work_hr)<=?   AND time(to_work_hr)>?) or (time(from_work_hr)<=?   AND time(to_work_hr)>?))  and hims_d_appointment_schedule_header_id=?;\
                                  SELECT  hims_d_appointment_schedule_header_id,from_work_hr,to_work_hr from hims_d_appointment_schedule_header\
                                  where ((time(from_work_hr) >=? AND   time(from_work_hr) <?) or \
                                  (time(to_work_hr) >=? AND   time(to_work_hr) <?))\
                                  and hims_d_appointment_schedule_header_id=?;",
                          values: [
                            input.from_work_hr,
                            input.from_work_hr,
                            input.to_work_hr,
                            input.to_work_hr,
                            appointment_schedule_header_idS[j],
                            input.from_work_hr,
                            input.to_work_hr,
                            input.from_work_hr,
                            input.to_work_hr,
                            appointment_schedule_header_idS[j]
                          ]
                        })
                        .then(timeChecking => {
                          //
                          if (
                            timeChecking[0].length > 0 ||
                            timeChecking[1].length > 0
                          ) {
                            //reject adding to schedule
                            if (timeChecking[0].length > 0) {
                              _mysql.rollBackTransaction(() => {
                                req.records = {
                                  message: `schedule already exist on ${
                                    clashingDate[0]
                                  } for doctor_id:${
                                    input.schedule_detail[doc].full_name
                                  } from ${timeChecking[0][0].from_work_hr} to 
                                      ${timeChecking[0][0].to_work_hr}`,
                                  schedule_exist: true
                                };
                                next();
                              });
                              // req.records = {
                              //   message: `schedule already exist on ${
                              //     clashingDate[0]
                              //   } for doctor_id:${
                              //     input.schedule_detail[doc].provider_id
                              //   } from ${timeChecking[0][0].from_work_hr} to
                              //        ${timeChecking[0][0].to_work_hr}`,
                              //   schedule_exist: true
                              // };
                              // next();
                            } else {
                              if (timeChecking[1].length > 0) {
                                _mysql.rollBackTransaction(() => {
                                  req.records = {
                                    message: `schedule already exist on ${
                                      clashingDate[0]
                                    } for doctor_id:${
                                      input.schedule_detail[doc].full_name
                                    } from ${
                                      timeChecking[1][0].from_work_hr
                                    } to 
                                        ${timeChecking[1][0].to_work_hr}`,
                                    schedule_exist: true
                                  };
                                  next();
                                });
                                // req.records = {
                                //   message: `schedule already exist on ${
                                //     clashingDate[0]
                                //   } for doctor_id:${
                                //     input.schedule_detail[doc].provider_id
                                //   } from ${timeChecking[1][0].from_work_hr} to
                                //        ${timeChecking[1][0].to_work_hr}`,
                                //   schedule_exist: true
                                // };
                                // next();
                              }
                            }
                          } else {
                            //adding records for single doctor at one time

                            const insurtColumns = [
                              "provider_id",
                              "clinic_id",
                              "slot",
                              "schedule_date"
                            ];

                            _mysql
                              .executeQuery({
                                query:
                                  "INSERT INTO hims_d_appointment_schedule_detail(??) VALUES ?",
                                values: doctorSchedule,
                                includeValues: insurtColumns,
                                extraValues: {
                                  appointment_schedule_header_id:
                                    result.insertId,

                                  created_date: new Date(),
                                  created_by:
                                    req.userIdentity.algaeh_d_app_user_id,
                                  updated_date: new Date(),
                                  updated_by:
                                    req.userIdentity.algaeh_d_app_user_id
                                },
                                bulkInsertOrUpdate: true
                              })
                              .then(schedule_detailResult => {
                                if (doc == input.schedule_detail.length - 1) {
                                  _mysql.commitTransaction(() => {
                                    _mysql.releaseConnection();
                                    req.records = schedule_detailResult;
                                    next();
                                  });
                                }
                              })
                              .catch(e => {
                                _mysql.rollBackTransaction(() => {
                                  next(e);
                                });
                              });
                          }
                        })
                        .catch(e => {
                          _mysql.releaseConnection();
                          next(e);
                        });
                    }
                  } //if no clashing dates
                  else {
                    //adding records for single doctor at one time

                    const insurtColumns = [
                      "provider_id",
                      "clinic_id",
                      "slot",
                      "schedule_date"
                    ];

                    _mysql
                      .executeQuery({
                        query:
                          "INSERT INTO hims_d_appointment_schedule_detail(??) VALUES ?",
                        values: doctorSchedule,
                        includeValues: insurtColumns,
                        extraValues: {
                          appointment_schedule_header_id: result.insertId,

                          created_date: new Date(),
                          created_by: req.userIdentity.algaeh_d_app_user_id,
                          updated_date: new Date(),
                          updated_by: req.userIdentity.algaeh_d_app_user_id
                        },
                        bulkInsertOrUpdate: true
                      })
                      .then(schedule_detailResult => {
                        if (doc == input.schedule_detail.length - 1) {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            req.records = schedule_detailResult;
                            next();
                          });
                        }
                      })
                      .catch(e => {
                        _mysql.rollBackTransaction(() => {
                          next(e);
                        });
                      });
                  }
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            }
          }
        } else {
          req.records = { message: "please select doctors" };
          _mysql.rollBackTransaction(() => {});
          next();
        }
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  }
};
