//created by irfan: to add Doctor To Existing Schedule
addDoctorToExistingScheduleBAckup_16_july_2019: (req, res, next) => {
  const _mysql = new algaehMysql();
  let input = req.body;
  //generating list of dates by date range ie.(from_time and  to_time)
  _mysql
    .executeQuery({
      query:
        "SELECT from_work_hr,to_work_hr,from_date, to_date, monday, tuesday, wednesday, thursday, friday, saturday, sunday\
        from hims_d_appointment_schedule_header where  record_status='A' and hims_d_appointment_schedule_header_id=?",
      values: [input.hims_d_appointment_schedule_header_id]
    })
    .then(result => {
      // _mysql.commitTransaction(() => {
      //   _mysql.releaseConnection();
      //   req.records = defStatusRsult;
      //   next();
      // });

      let working_days = [];

      let inputDays = [
        result[0].sunday,
        result[0].monday,
        result[0].tuesday,
        result[0].wednesday,
        result[0].thursday,
        result[0].friday,
        result[0].saturday
      ];

      for (let d = 0; d < 7; d++) {
        if (inputDays[d] == "Y") {
          working_days.push(d);
        }
      }

      let newDateList = getDaysArray(
        new Date(result[0].from_date),
        new Date(result[0].to_date),
        working_days
      );
      newDateList.map(v => v.toLocaleString());

      _mysql
        .executeQuery({
          query:
            "select hims_d_appointment_schedule_detail_id,appointment_schedule_header_id,schedule_date from hims_d_appointment_schedule_detail  where provider_id=? and record_status='A' and schedule_date>?;",
          values: [input.provider_id, new Date()],

          printQuery: true
        })
        .then(occupiedDoctorDates => {
          // _mysql.releaseConnection();
          // req.records = result;
          // next();

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
            let appointment_schedule_header_id = new LINQ(occupiedDoctorDates)
              .Where(w => w.schedule_date == clashingDate[0])
              .Select(s => s.appointment_schedule_header_id)
              .ToArray();
            //obtain existing schedule time

            _mysql
              .executeQuery({
                query:
                  "select * from hims_d_appointment_schedule_header where time(from_work_hr)<=?  and time(to_work_hr)> ?\
    and hims_d_appointment_schedule_header_id=?",
                values: [
                  result[0].from_work_hr,
                  result[0].from_work_hr,
                  appointment_schedule_header_id[0]
                ],

                printQuery: true
              })
              .then(timeChecking => {
                // _mysql.releaseConnection();
                // req.records = result;
                // next();

                if (timeChecking.length > 0) {
                  //reject adding to schedule

                  req.records = {
                    message: "schedule already exist",
                    schedule_exist: true
                  };
                  _mysql.releaseConnection();
                  next();
                } else {
                  //add to schedule

                  if (input.schedule_detail.length != 0) {
                    if (input.hims_d_appointment_schedule_header_id != null) {
                      for (
                        let doc = 0;
                        doc < input.schedule_detail.length;
                        doc++
                      ) {
                        let doctorSchedule = [];

                        for (let i = 0; i < newDateList.length; i++) {
                          doctorSchedule.push({
                            ...input.schedule_detail[doc],
                            ...{ schedule_date: newDateList[i] }
                          });
                        }

                        const insurtColumns = [
                          "provider_id",
                          "clinic_id",
                          "slot",
                          "schedule_date",
                          "created_by",
                          "updated_by"
                        ];

                        _mysql
                          .executeQueryWithTransaction({
                            query:
                              "INSERT INTO hims_d_appointment_schedule_detail(??) VALUES ?",
                            values: doctorSchedule,
                            includeValues: insurtColumns,
                            extraValues: {
                              appointment_schedule_header_id:
                                input.hims_d_appointment_schedule_header_id,

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
                    }
                  } else {
                    _mysql.releaseConnection();
                    req.records = { message: "please select doctors" };
                    next();
                  }
                }
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
              });
          } else {
            //else add doctor to schedule
            if (input.schedule_detail.length != 0) {
              if (input.hims_d_appointment_schedule_header_id != null) {
                for (let doc = 0; doc < input.schedule_detail.length; doc++) {
                  let doctorSchedule = [];

                  for (let i = 0; i < newDateList.length; i++) {
                    doctorSchedule.push({
                      ...input.schedule_detail[doc],
                      ...{ schedule_date: newDateList[i] }
                    });
                  }

                  const insurtColumns = [
                    "provider_id",
                    "clinic_id",
                    "slot",
                    "schedule_date",
                    "created_by",
                    "updated_by"
                  ];

                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "INSERT INTO hims_d_appointment_schedule_detail(??) VALUES ?",
                      values: doctorSchedule,
                      includeValues: insurtColumns,
                      extraValues: {
                        appointment_schedule_header_id:
                          input.hims_d_appointment_schedule_header_id,

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
              }
            }
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    })
    .catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
};
