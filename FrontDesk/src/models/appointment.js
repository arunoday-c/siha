import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
//import mysql from "mysql";
import moment from "moment";
import { LINQ } from "node-linq";
module.exports = {
  //created by irfan: to add Appointment Status
  addAppointmentStatus: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQueryWithTransaction({
        query:
          "INSERT INTO `hims_d_appointment_status` (color_code, description, default_status,steps, created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?,?)",
        values: [
          input.color_code,
          input.description,
          input.default_status,
          input.steps,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id
        ]
      })
      .then(result => {
        if (input.default_status == "Y") {
          _mysql
            .executeQuery({
              query:
                "UPDATE `hims_d_appointment_status` SET  default_status='N'   WHERE default_status='Y' and record_status='A' and  hims_d_appointment_status_id <> ?;\
              ",
              values: [result.insertId]
            })
            .then(defStatusRsult => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = defStatusRsult;
                next();
              });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        } else if (input.default_status == "C") {
          _mysql
            .executeQuery({
              query:
                "update hims_d_appointment_status set default_status='N' where default_status='C' and record_status='A' and hims_d_appointment_status_id <>? ",
              values: [result.insertId]
            })
            .then(crtRsult => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = crtRsult;
                next();
              });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        } else {
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          });
        }
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },
  //created by irfan: to add appointment_room
  addAppointmentRoom: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_d_appointment_room` (description,\
             created_date, created_by, updated_date, updated_by,hospital_id)\
        VALUE(?,?,?,?,?,?)",
        values: [
          input.description,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.hospital_id
        ]
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to add appointment_clinic
  addAppointmentClinic: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_d_appointment_clinic` (description, sub_department_id,\
             provider_id, room_id, created_date, created_by, updated_date, updated_by,hospital_id)\
        VALUE(?,?,?,?,?,?,?,?,?)",
        values: [
          input.description,
          input.sub_department_id,
          input.provider_id,
          input.room_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.hospital_id
        ]
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to get Appointment Status
  getAppointmentStatus: (req, res, next) => {
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "select hims_d_appointment_status_id, color_code,description as statusDesc, default_status,steps,authorized FROM\
           hims_d_appointment_status where record_status='A'  order by steps "
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to get Appointment room
  getAppointmentRoom: (req, res, next) => {
    const _mysql = new algaehMysql();

    let appointment_room_id = "";
    if (req.query.hims_d_appointment_room_id > 0) {
      appointment_room_id = ` and hims_d_appointment_room_id=${
        req.query.hims_d_appointment_room_id
      }`;
    }
    _mysql
      .executeQuery({
        query: `select hims_d_appointment_room_id, description as roomDesc, room_active FROM hims_d_appointment_room where record_status='A'
         and hospital_id=? ${appointment_room_id} order by hims_d_appointment_room_id desc `,
        values: [req.userIdentity.hospital_id]
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to getAppointmentClinic
  getAppointmentClinic: (req, res, next) => {
    const _mysql = new algaehMysql();

    let appointment_clinic_id = "";
    if (req.query.hims_d_appointment_clinic_id > 0) {
      appointment_clinic_id = ` and hims_d_appointment_clinic_id=${
        req.query.hims_d_appointment_clinic_id
      }`;
    }
    _mysql
      .executeQuery({
        query: `select hims_d_appointment_clinic_id,description , sub_department_id, provider_id, room_id\
         FROM hims_d_appointment_clinic where record_status='A'  and hospital_id=? ${appointment_clinic_id}
        order by hims_d_appointment_clinic_id desc`,
        values: [req.userIdentity.hospital_id]
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan: to updateAppointmentStatus
  updateAppointmentStatus: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQueryWithTransaction({
        query:
          "UPDATE `hims_d_appointment_status` SET color_code=?, description=?, default_status=?,steps=?,\
        updated_date=?, updated_by=? ,`record_status`=? WHERE  `record_status`='A' and `hims_d_appointment_status_id`=?;",
        values: [
          input.color_code,
          input.description,
          input.default_status,
          input.steps,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.record_status,
          input.hims_d_appointment_status_id
        ]
      })
      .then(result => {
        if (input.default_status == "Y" && input.record_status == "A") {
          _mysql
            .executeQuery({
              query:
                "UPDATE `hims_d_appointment_status` SET  default_status='N'\
              WHERE  record_status='A' and default_status!='C' and  hims_d_appointment_status_id <> ?; \
              update hims_d_appointment_status  set steps=null where hims_d_appointment_status_id>0;\
              update hims_d_appointment_status  set steps=1 where hims_d_appointment_status_id=? and record_status='A';",
              values: [
                input.hims_d_appointment_status_id,
                input.hims_d_appointment_status_id
              ]
            })
            .then(defStatusRsult => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = defStatusRsult;
                next();
              });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        } else if (input.default_status == "C" && input.record_status == "A") {
          _mysql
            .executeQuery({
              query:
                "update hims_d_appointment_status set default_status='N' where default_status='C' and record_status='A' and hims_d_appointment_status_id <>? ",
              values: [input.hims_d_appointment_status_id]
            })
            .then(crtRsult => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = crtRsult;
                next();
              });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        } else if (input.record_status == "I") {
          _mysql
            .executeQuery({
              query:
                "update hims_d_appointment_status  set steps=null where hims_d_appointment_status_id=?; ",
              values: [input.hims_d_appointment_status_id]
            })
            .then(deleteRsult => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = deleteRsult;
                next();
              });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        } else {
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          });
        }
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },
  //created by irfan: to appointment Status Authorized
  appointmentStatusAuthorized: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "update hims_d_appointment_status  set authorized='Y',updated_date=?, updated_by=? where record_status='A' and hims_d_appointment_status_id>0 ;",
        values: [new Date(), req.userIdentity.algaeh_d_app_user_id]
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to appointment Status Authorized
  updateAppointmentRoom: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "UPDATE `hims_d_appointment_room` SET  description=?,room_active=?,\
        updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_d_appointment_room_id`=?;",
        values: [
          input.description,
          input.room_active,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.hims_d_appointment_room_id
        ]
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to deleteAppointmentRoom
  deleteAppointmentRoom: (req, res, next) => {
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_d_appointment_room SET  record_status='I' WHERE hims_d_appointment_room_id=?",
        values: [req.body.hims_d_appointment_room_id]
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to updateAppointmentClinic
  updateAppointmentClinic: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "UPDATE `hims_d_appointment_clinic` SET  description=?,sub_department_id=?, provider_id=?, room_id=?,\
             updated_date=?, updated_by=? ,`record_status`=? WHERE  `record_status`='A' and `hims_d_appointment_clinic_id`=?;",
        values: [
          input.description,
          input.sub_department_id,
          input.provider_id,
          input.room_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.record_status,
          input.hims_d_appointment_clinic_id
        ]
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to create new schedule and add doctors in this schedule
  addDoctorsScheduleBCKP_16_july_2019: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    let from_month = moment(input.from_date).format("M");
    let to_month = moment(input.to_date).format("M");

    // if (from_month != input.month && to_month != input.month) {
    //   req.records = {
    //     schedule_exist: true,
    //     message: " selected month and dates are not matching"
    //   };
    //   next();
    //   return;
    // } else
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
  },
  //created by irfan: to create new schedule and add doctors in this schedule
  addDoctorsSchedule: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    let input = req.body;

    let from_month = moment(input.from_date).format("M");
    //let to_month = moment(input.to_date).format("M");

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
      const working_days = [];

      const inputDays = [
        input.sunday,
        input.monday,
        input.tuesday,
        input.wednesday,
        input.thursday,
        input.friday,
        input.saturday
      ];
      for (let d = 0; d < 7; d++) {
        if (inputDays[d] == "Y") {
          working_days.push(d);
        }
      }

      const newDateList = getDaysArray(
        new Date(input.from_date),
        new Date(input.to_date),
        working_days
      );

      if (newDateList.length > 365) {
        req.records = {
          schedule_exist: true,
          message: "You cant have a Schedule More than 365 days "
        };
        next();
        return;
      } else {
        // utilities.logger().log("newDateList: ", newDateList);
        if (input.schedule_detail.length > 0) {
          const providers = input.schedule_detail.map(data => {
            return data.provider_id;
          });

          _mysql
            .executeQuery({
              query: `SELECT H.hims_d_appointment_schedule_header_id, D.hims_d_appointment_schedule_detail_id,\
                H.schedule_description, TIME_FORMAT(H.from_work_hr, "%H:%i") as  from_work_hr,TIME_FORMAT(H.to_work_hr, "%H:%i") as  to_work_hr,\
                D.provider_id,D.schedule_date,E.full_name FROM hims_d_appointment_schedule_header H \
                INNER JOIN hims_d_appointment_schedule_detail D ON\
                H.hims_d_appointment_schedule_header_id = D.appointment_schedule_header_id \
                left join hims_d_employee E on D.provider_id=E.hims_d_employee_id\
                WHERE H.record_status = 'A' AND D.record_status = 'A' and D.provider_id in (?) \
                and schedule_date between date(?) and date(?); `,
              values: [providers, input.from_date, input.to_date],
              printQuery: false
            })
            .then(ExistingDates => {
              //  utilities.logger().log("ExistingDates: ", ExistingDates);

              const clashing_dates = [];

              newDateList.forEach(n_date => {
                const schedule = ExistingDates.filter(data => {
                  if (
                    data.schedule_date == moment(n_date).format("YYYY-MM-DD")
                  ) {
                    return data;
                  }
                });

                clashing_dates.push(...schedule);
              });

              //utilities.logger().log("clashing_dates: ", clashing_dates);

              let time_clash = {};

              if (clashing_dates.length > 0) {
                time_clash = clashing_dates.find(element => {
                  if (
                    (element.from_work_hr <= input.from_work_hr &&
                      element.to_work_hr > input.from_work_hr) ||
                    (element.from_work_hr < input.to_work_hr &&
                      element.to_work_hr > input.from_work_hr) ||
                    (input.from_work_hr <= element.from_work_hr &&
                      input.to_work_hr > element.from_work_hr)
                  ) {
                    return element;
                  }
                });
              }

              // console.log("time clash33:", time_clash);
              if (
                time_clash != undefined &&
                Object.keys(time_clash).length > 0
              ) {
                req.records = {
                  message: `${time_clash["full_name"]} has schedule on ${
                    time_clash["schedule_date"]
                  }`,
                  schedule_exist: true
                };
                next();
                return;
              } else {
                const doctorSchedule = [];

                input.schedule_detail.forEach(doctor => {
                  newDateList.forEach(n_date => {
                    doctorSchedule.push({
                      provider_id: doctor["provider_id"],
                      clinic_id: doctor["clinic_id"],
                      slot: doctor["slot"],
                      schedule_date: n_date
                    });
                  });
                });

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
                    printQuery: false
                  })
                  .then(result => {
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
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = schedule_detailResult;
                          next();
                        });
                      })
                      .catch(e => {
                        _mysql.rollBackTransaction(() => {
                          next(e);
                        });
                      });
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
        } else {
          req.records = {
            schedule_exist: true,
            message: "Please select doctors"
          };
          next();
          return;
        }
      }
    }
  },

  //created by irfan: to get doctors Schedule list
  getDoctorsScheduledList: (req, res, next) => {
    const _mysql = new algaehMysql();

    let outputArray = [];
    let selectDoctor = "";
    let str = "";
    if (req.query.provider_id > 0) {
      selectDoctor += ` and ASD.provider_id=${req.query.provider_id}`;
    }
    if (req.query.month > 0) {
      str += ` and month=${req.query.month}`;
    }

    _mysql
      .executeQuery({
        query:
          "select hims_d_appointment_schedule_header_id, sub_dept_id, schedule_status, schedule_description,\
          month, year,from_date,to_date, from_work_hr,\
           to_work_hr, work_break1, from_break_hr1, to_break_hr1, work_break2, from_break_hr2,\
        to_break_hr2, monday, tuesday, wednesday, thursday, friday, saturday, sunday\
         from hims_d_appointment_schedule_header where record_status='A' AND sub_dept_id=?\
          and year=? and hospital_id=? " +
          str,
        values: [
          req.query.sub_dept_id,
          req.query.year,
          req.userIdentity.hospital_id
        ],
        printQuery: true
      })
      .then(result => {
        // _mysql.releaseConnection();
        // req.records = result;
        // next();

        // let schedule_header_id_all = new LINQ(result)
        //   .Where(w => w.hims_d_appointment_schedule_header_id != null)
        //   .Select(s => s.hims_d_appointment_schedule_header_id)
        //   .ToArray();

        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            _mysql
              .executeQuery({
                query:
                  "SELECT hims_d_appointment_schedule_detail_id,appointment_schedule_header_id,SH.schedule_description ,\
                  SH.schedule_status deprt_schedule_status,ASD.provider_id,E.full_name,\
                  clinic_id,AC.description as clinic_description,slot,schedule_date,from_work_hr,\
                   to_work_hr,work_break1,work_break2,\
                   from_break_hr1,to_break_hr1,from_break_hr2,to_break_hr2  ,ASD.schedule_status doctor_schedule_status\
                   from hims_d_appointment_schedule_detail ASD ,hims_d_employee E, hims_d_appointment_clinic AC,hims_d_appointment_schedule_header SH\
                    where ASD.record_status='A' and E.record_status='A' and AC.record_status='A'and SH.record_status='A' and ASD.provider_id=E.hims_d_employee_id\
                    and ASD.clinic_id=AC.hims_d_appointment_clinic_id and ASD.appointment_schedule_header_id=SH.hims_d_appointment_schedule_header_id and\
                    appointment_schedule_header_id in (" +
                  result[i]["hims_d_appointment_schedule_header_id"] +
                  ")" +
                  selectDoctor +
                  " group by  provider_id;"
              })
              .then(results => {
                result[i]["doctorsList"] = results;
                outputArray.push(result[i]);
                if (i == result.length - 1) {
                  req.records = outputArray;
                  _mysql.releaseConnection();
                  next();
                }
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
              });
          }
        } else {
          _mysql.releaseConnection();
          req.records = result;
          next();
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan:to get Doctor Schedule Date Wise
  getDoctorScheduleDateWise: (req, res, next) => {
    //const _mysql = new algaehMysql();

    let input = req.query;
    let qry = "";
    if (input.sub_dept_id > 0) {
      const _mysql = new algaehMysql();
      qry += ` and sub_dept_id=${input.sub_dept_id}`;

      if (input.schedule_date != null && input.schedule_date != undefined) {
        qry += ` and schedule_date=date('${input.schedule_date}')`;
      }

      let selectDoctor = "";

      if (input.provider_id != "null" && input.provider_id != null) {
        selectDoctor = ` and ASD.provider_id=${input.provider_id}  `;
        //provider_id = req.query.provider_id;
      }

      _mysql
        .executeQuery({
          query: `select hims_d_appointment_schedule_header_id, sub_dept_id,SD.sub_department_name, SH.schedule_status as schedule_status, schedule_description, month, year,\
        from_date,to_date,from_work_hr, to_work_hr, work_break1, from_break_hr1, to_break_hr1, work_break2, from_break_hr2,\
        to_break_hr2, monday, tuesday, wednesday, thursday, friday, saturday, sunday,\
         hims_d_appointment_schedule_detail_id, ASD.provider_id,E.full_name as doctor_name,clinic_id,C.description as clinic_name,R.description as  room_name,\
         ASD.schedule_status as todays_schedule_status, slot,schedule_date, modified \
         from hims_d_appointment_schedule_header SH, hims_d_appointment_schedule_detail ASD,hims_d_employee E ,\
         hims_d_appointment_clinic C,hims_d_appointment_room R,hims_d_sub_department SD where \
         SH.record_status='A' and E.record_status='A' and C.record_status='A' and  SD.record_status='A'\
     and ASD.record_status='A' and R.record_status='A' and ASD.provider_id=E.hims_d_employee_id and \
         SH.hims_d_appointment_schedule_header_id=ASD.appointment_schedule_header_id \
         and ASD.clinic_id=C.hims_d_appointment_clinic_id and C.room_id=R.hims_d_appointment_room_id \
          and sub_dept_id= SD.hims_d_sub_department_id  and SH.hospital_id=?  ${selectDoctor} ${qry} `,
          values: [req.userIdentity.hospital_id]
        })
        .then(result => {
          if (result.length > 0) {
            new Promise((resolve, reject) => {
              try {
                for (let j = 0; j < result.length; j++) {
                  if (result[j]["modified"] == "M") {
                    _mysql
                      .executeQuery({
                        query:
                          "select hims_d_appointment_schedule_modify_id, appointment_schedule_detail_id, ASM.to_date as schedule_date, ASM.slot, ASM.from_work_hr,\
                              ASM.to_work_hr, ASM.work_break1, ASM.from_break_hr1,ASM.to_break_hr1, ASM.work_break2, ASM.from_break_hr2, ASM.to_break_hr2  \
                              hims_d_appointment_schedule_header_id, sub_dept_id,SD.sub_department_name, SH.schedule_status, schedule_description, month, year,  \
                             monday, tuesday, wednesday, thursday, friday, saturday, sunday, ASD.provider_id,E.full_name as doctor_name,clinic_id,C.description as clinic_name,R.description as  room_name,\
                              ASD.schedule_status as todays_schedule_status, modified\
                             from hims_d_appointment_schedule_header SH,hims_d_appointment_schedule_modify ASM , hims_d_appointment_schedule_detail ASD,hims_d_employee E, hims_d_appointment_clinic C,hims_d_appointment_room R,\
                             hims_d_sub_department SD  where SH.record_status='A' and E.record_status='A' \
                             and ASD.record_status='A' and C.record_status='A' and SD.record_status='A' and R.record_status='A'and ASD.provider_id=E.hims_d_employee_id and  SH.hims_d_appointment_schedule_header_id=ASD.appointment_schedule_header_id  \
                             and ASM.appointment_schedule_detail_id=ASD.hims_d_appointment_schedule_detail_id and ASM.record_status='A'\
                             and ASD.clinic_id=C.hims_d_appointment_clinic_id and C.room_id=R.hims_d_appointment_room_id and C.sub_department_id=SD.hims_d_sub_department_id and appointment_schedule_detail_id=?",
                        values: [
                          result[j]["hims_d_appointment_schedule_detail_id"]
                        ],

                        printQuery: true
                      })
                      .then(modifyResult => {
                        result[j] = modifyResult[0];
                      })
                      .catch(e => {
                        _mysql.releaseConnection();
                        next(e);
                      });
                  }
                  if (j == result.length - 1) {
                    resolve({});
                  }
                }
              } catch (e) {
                reject(e);
              }
            }).then(modifyRes => {
              let outputArray = [];
              if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                  _mysql
                    .executeQuery({
                      query:
                        "select hims_f_patient_appointment_id, patient_id, title_id, patient_code, provider_id, sub_department_id,number_of_slot, appointment_date, appointment_from_time,\
                          appointment_to_time, appointment_status_id, patient_name, arabic_name, date_of_birth, age, contact_number, email, send_to_provider,\
                          gender, confirmed, confirmed_by,comfirmed_date, cancelled, cancelled_by, cancelled_date, cancel_reason,\
                          appointment_remarks, visit_created,is_stand_by  from hims_f_patient_appointment where record_status='A' and   cancelled<>'Y' and sub_department_id=?\
                          and appointment_date=? and provider_id=? ",
                      values: [
                        result[i].sub_dept_id,
                        result[i].schedule_date,
                        result[i].provider_id
                      ]
                    })
                    .then(appResult => {
                      const obj = {
                        ...result[i],
                        ...{ patientList: appResult }
                      };

                      outputArray.push(obj);

                      if (i == result.length - 1) {
                        req.records = outputArray;
                        _mysql.releaseConnection();
                        next();
                      }
                    })
                    .catch(e => {
                      _mysql.releaseConnection();
                      next(e);
                    });
                }
              } else {
                _mysql.releaseConnection();
                req.records = result;
                next();
              }
            });
          } else {
            _mysql.releaseConnection();
            req.records = result;
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
        message: "Please select department"
      };

      next();
    }
  },

  //created by irfan: to get Doctor Schedule to Modify
  getDoctorScheduleToModify: (req, res, next) => {
    const _mysql = new algaehMysql();

    let selectQry = "";
    if (req.query.appointment_schedule_header_id > 0) {
      selectQry += ` and appointment_schedule_header_id=${
        req.query.appointment_schedule_header_id
      } `;
    }
    if (req.query.provider_id > 0) {
      selectQry += ` and provider_id=${req.query.provider_id} `;
    }

    _mysql
      .executeQuery({
        query: `select hims_d_appointment_schedule_header_id, sub_dept_id, SH.schedule_status as deprt_schedule_status, schedule_description, month, year,\
        from_date,to_date,from_work_hr, to_work_hr, work_break1, from_break_hr1, to_break_hr1, work_break2, from_break_hr2, \
        to_break_hr2, monday, tuesday, wednesday, thursday, friday, saturday, sunday,\
        hims_d_appointment_schedule_detail_id, provider_id,clinic_id, ASD.schedule_status as doctor_schedule_status, slot,schedule_date, modified  \
       from hims_d_appointment_schedule_header SH, hims_d_appointment_schedule_detail ASD \
       where SH.record_status='A' and ASD.record_status='A' and  SH.hims_d_appointment_schedule_header_id=ASD.appointment_schedule_header_id\
         and SH.hospital_id=? ${selectQry}`,
        values: [req.userIdentity.hospital_id]
      })
      .then(result => {
        // _mysql.releaseConnection();
        // req.records = result;
        // next();

        let activeSchedule = new LINQ(result)
          .Where(w => w.modified != "M")
          .Select(s => s)
          .ToArray();

        let ids = new LINQ(result)
          .Where(w => w.modified == "M")
          .Select(s => s.hims_d_appointment_schedule_detail_id)
          .ToArray();

        if (ids.length > 0) {
          _mysql
            .executeQuery({
              query:
                "SELECT hims_d_appointment_schedule_modify_id, SD.provider_id, SD.clinic_id, SD.schedule_status,appointment_schedule_detail_id, to_date as schedule_date, SM.slot,\
            from_work_hr, to_work_hr,work_break1, from_break_hr1, to_break_hr1, work_break2, from_break_hr2, to_break_hr2 \
            from hims_d_appointment_schedule_modify SM, hims_d_appointment_schedule_detail SD where SM.record_status='A' and SM.record_status='A' and SM.appointment_schedule_detail_id=SD.hims_d_appointment_schedule_detail_id and\
            appointment_schedule_detail_id in (" +
                ids +
                ")"
            })
            .then(modResult => {
              _mysql.releaseConnection();
              // req.records = result;
              // next();

              if (modResult.length > 0) {
                let mergeResult = [...activeSchedule, ...modResult];

                let finResult = new LINQ(mergeResult)
                  .OrderBy(w => w.schedule_date)
                  .ToArray();

                req.records = finResult;

                next();
              } else {
                req.records = result;
                next();
              }
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = result;
          next();
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan: to update Doctor Schedule DateWise
  updateDoctorScheduleDateWise: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQueryWithTransaction({
        query:
          "UPDATE `hims_d_appointment_schedule_detail` SET `modified`=?,\
        `updated_by`=?, `updated_date`=? WHERE `record_status`='A' and \
   `hims_d_appointment_schedule_detail_id`=?;",
        values: [
          input.modified,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          input.hims_d_appointment_schedule_detail_id
        ]
      })
      .then(result => {
        if (
          input.hims_d_appointment_schedule_modify_id != null &&
          input.modified == "M"
        ) {
          _mysql
            .executeQuery({
              query:
                "UPDATE `hims_d_appointment_schedule_modify` SET appointment_schedule_detail_id=?,to_date=?,slot=?,\
              from_work_hr=?,to_work_hr=?,work_break1=?,from_break_hr1=?,to_break_hr1=?,work_break2=?,from_break_hr2=?,to_break_hr2=?,\
                  `updated_by`=?, `updated_date`=? WHERE `record_status`='A' and \
              `hims_d_appointment_schedule_modify_id`=?;",
              values: [
                input.hims_d_appointment_schedule_detail_id,
                input.to_date,
                input.slot,
                input.from_work_hr,
                input.to_work_hr,
                input.work_break1,
                input.from_break_hr1,
                input.to_break_hr1,
                input.work_break2,
                input.from_break_hr2,
                input.to_break_hr2,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                input.hims_d_appointment_schedule_modify_id
              ]
            })
            .then(updateModResult => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = updateModResult;
                next();
              });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        } else if (result.length != 0 && input.modified == "M") {
          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_d_appointment_schedule_modify` ( appointment_schedule_detail_id, to_date, slot, from_work_hr, to_work_hr, work_break1, from_break_hr1,\
                to_break_hr1, work_break2, from_break_hr2, to_break_hr2,created_date, created_by, updated_date, updated_by,hospital_id)\
                VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                input.hims_d_appointment_schedule_detail_id,
                input.to_date,
                input.slot,
                input.from_work_hr,
                input.to_work_hr,
                input.work_break1,
                input.from_break_hr1,
                input.to_break_hr1,
                input.work_break2,
                input.from_break_hr2,
                input.to_break_hr2,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                req.userIdentity.hospital_id
              ]
            })
            .then(results => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = results;
                next();
              });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        } else {
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          });
        }
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },

  //created by irfan: to delete Doctor From Schedule
  deleteDoctorFromSchedule: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;
    _mysql
      .executeQuery({
        query:
          "select hims_f_patient_appointment_id,appointment_date\
          from hims_f_patient_appointment    where date(appointment_date) between date(?) and  date(?)\
          and sub_department_id=? and hospital_id=? and provider_id=?",
        values: [
          input.from_date,
          input.to_date,
          input.sub_department_id,
          req.userIdentity.hospital_id,
          input.provider_id
        ],
        printQuery: false
      })
      .then(result => {
        // _mysql.releaseConnection();
        // req.records = result;
        // next();

        if (result.length > 0) {
          _mysql.releaseConnection();
          req.records = {
            invalid_opertaion: true,
            message: `Cant delete ,doctor has appointments from ${
              result[0]["appointment_date"]
            } to ${result[result.length - 1]["appointment_date"]}`
          };
          next();
        } else {
          _mysql
            .executeQueryWithTransaction({
              query:
                "delete M from hims_d_appointment_schedule_detail D inner join\
                hims_d_appointment_schedule_modify M on D.hims_d_appointment_schedule_detail_id=M.appointment_schedule_detail_id\
                where D.appointment_schedule_header_id=? and D.provider_id=?;\
                delete from hims_d_appointment_schedule_detail\
                where appointment_schedule_header_id=? and provider_id=?;\
                delete H from hims_d_appointment_schedule_header H left join hims_d_appointment_schedule_detail D\
                on H.hims_d_appointment_schedule_header_id=D.appointment_schedule_header_id where  hims_d_appointment_schedule_header_id=?\
                and  D.appointment_schedule_header_id  is null ",
              values: [
                input.appointment_schedule_header_id,
                input.provider_id,
                input.appointment_schedule_header_id,
                input.provider_id,
                input.appointment_schedule_header_id
              ]
            })
            .then(delDesult => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = delDesult;
                next();
              });
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
  },

  //created by irfan: to update Schedule
  updateSchedule: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.body;
    _mysql
      .executeQuery({
        query:
          "UPDATE `hims_d_appointment_schedule_header` SET `sub_dept_id`=?, `schedule_status`=?,\
        `schedule_description`=?, `month`=?, `year`=?, `from_date`=?, `to_date`=?, \
        `from_work_hr`=?, `to_work_hr`=?, `work_break1`=?, `from_break_hr1`=?, \
        `to_break_hr1`=?, `work_break2`=?, `from_break_hr2`=?, `to_break_hr2`=?,\
               `monday`=?, `tuesday`=?, `wednesday`=?, `thursday`=?, `friday`=?, `saturday`=?,\
         `sunday`=?, `updated_by`=?, `updated_date`=?, `record_status`=? \
         WHERE record_status='A' and `hims_d_appointment_schedule_header_id`=? ;",

        values: [
          input.sub_dept_id,
          input.schedule_status,
          input.schedule_description,
          input.month,
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
          input.record_status,
          input.hims_d_appointment_schedule_header_id
        ]
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },

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
  },

  //created by irfan: to create new schedule and add doctors in this schedule
  addDoctorToExistingSchedule: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    let input = req.body;

    if (!input.hims_d_appointment_schedule_header_id > 0) {
      req.records = {
        schedule_exist: true,
        message: "Please select proper Schedule"
      };
      next();
      return;
    } else {
      _mysql
        .executeQuery({
          query:
            "SELECT from_work_hr,to_work_hr,from_date, to_date, monday, tuesday, wednesday, thursday, friday, saturday, sunday\
          from hims_d_appointment_schedule_header where  record_status='A' and hims_d_appointment_schedule_header_id=?",
          values: [input.hims_d_appointment_schedule_header_id]
        })
        .then(result => {
          const cur_schedule = result[0];
          const working_days = [];

          const inputDays = [
            cur_schedule.sunday,
            cur_schedule.monday,
            cur_schedule.tuesday,
            cur_schedule.wednesday,
            cur_schedule.thursday,
            cur_schedule.friday,
            cur_schedule.saturday
          ];
          for (let d = 0; d < 7; d++) {
            if (inputDays[d] == "Y") {
              working_days.push(d);
            }
          }

          const newDateList = getDaysArray(
            new Date(cur_schedule.from_date),
            new Date(cur_schedule.to_date),
            working_days
          );

          if (newDateList.length > 365) {
            req.records = {
              schedule_exist: true,
              message: "You cant have a Schedule More than 365 days "
            };
            next();
            return;
          } else {
            if (input.schedule_detail.length > 0) {
              const providers = input.schedule_detail.map(data => {
                return data.provider_id;
              });

              _mysql
                .executeQuery({
                  query: `SELECT H.hims_d_appointment_schedule_header_id, D.hims_d_appointment_schedule_detail_id,\
                H.schedule_description, TIME_FORMAT(H.from_work_hr, "%H:%i") as  from_work_hr,TIME_FORMAT(H.to_work_hr, "%H:%i") as  to_work_hr,\
                D.provider_id,D.schedule_date,E.full_name FROM hims_d_appointment_schedule_header H \
                INNER JOIN hims_d_appointment_schedule_detail D ON\
                H.hims_d_appointment_schedule_header_id = D.appointment_schedule_header_id \
                left join hims_d_employee E on D.provider_id=E.hims_d_employee_id\
                WHERE H.record_status = 'A' AND D.record_status = 'A' and D.provider_id in (?) \
                and schedule_date between date(?) and date(?); `,
                  values: [
                    providers,
                    cur_schedule.from_date,
                    cur_schedule.to_date
                  ],
                  printQuery: false
                })
                .then(ExistingDates => {
                  //  utilities.logger().log("ExistingDates: ", ExistingDates);

                  const clashing_dates = [];

                  newDateList.forEach(n_date => {
                    const schedule = ExistingDates.filter(data => {
                      if (
                        data.schedule_date ==
                        moment(n_date).format("YYYY-MM-DD")
                      ) {
                        return data;
                      }
                    });

                    clashing_dates.push(...schedule);
                  });

                  let time_clash = {};

                  if (clashing_dates.length > 0) {
                    time_clash = clashing_dates.find(element => {
                      if (
                        (element.from_work_hr <= cur_schedule.from_work_hr &&
                          element.to_work_hr > cur_schedule.from_work_hr) ||
                        (element.from_work_hr < cur_schedule.to_work_hr &&
                          element.to_work_hr > cur_schedule.from_work_hr) ||
                        (cur_schedule.from_work_hr <= element.from_work_hr &&
                          cur_schedule.to_work_hr > element.from_work_hr)
                      ) {
                        return element;
                      }
                    });
                  }

                  // console.log("time clash33:", time_clash);
                  if (
                    time_clash != undefined &&
                    Object.keys(time_clash).length > 0
                  ) {
                    req.records = {
                      message: `${time_clash["full_name"]} has schedule on ${
                        time_clash["schedule_date"]
                      }`,
                      schedule_exist: true
                    };
                    next();
                    return;
                  } else {
                    const doctorSchedule = [];

                    input.schedule_detail.forEach(doctor => {
                      newDateList.forEach(n_date => {
                        doctorSchedule.push({
                          provider_id: doctor["provider_id"],
                          clinic_id: doctor["clinic_id"],
                          slot: doctor["slot"],
                          schedule_date: n_date
                        });
                      });
                    });

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
                            input.hims_d_appointment_schedule_header_id,
                          created_date: new Date(),
                          created_by: req.userIdentity.algaeh_d_app_user_id,
                          updated_date: new Date(),
                          updated_by: req.userIdentity.algaeh_d_app_user_id
                        },
                        bulkInsertOrUpdate: true
                      })
                      .then(schedule_detailResult => {
                        _mysql.releaseConnection();
                        req.records = schedule_detailResult;
                        next();
                      })
                      .catch(e => {
                        _mysql.releaseConnection();
                        next(e);
                      });
                  }
                })
                .catch(e => {
                  _mysql.releaseConnection();
                  next(e);
                });
            } else {
              req.records = {
                schedule_exist: true,
                message: "Please select doctors"
              };
              next();
              return;
            }
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    }
  },
  //created by irfan: to add patient appointment
  addPatientAppointment: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.body;
    let strQry = "";
    if (
      req.userIdentity.unique_id_for_appointmt == "PID" &&
      input.patient_id > 0
    ) {
      strQry = `and  patient_id=${input.patient_id} `;
    } else if (req.userIdentity.unique_id_for_appointmt == "MOB") {
      strQry = `and contact_number='${input.contact_number}' `;
    }

    _mysql
      .executeQuery({
        query:
          "select hims_f_patient_appointment_id,provider_id,title_id,patient_name,appointment_date,appointment_from_time,\
        appointment_to_time from hims_f_patient_appointment where record_status='A' and hospital_id=?\
        and date(appointment_date)=date(?) and provider_id=? and cancelled='N' and is_stand_by='N' and sub_department_id=? and\
        ((?>=appointment_from_time and ?<appointment_to_time)\
        or(?>appointment_from_time and ?<=appointment_to_time));\
        SELECT hims_f_patient_appointment_id,patient_id,sub_department_id,patient_name FROM hims_f_patient_appointment\
        where record_status='A' and hospital_id=? and cancelled='N' and is_stand_by='N' \
        and sub_department_id=? and provider_id=? and appointment_date=? " +
          strQry,
        values: [
          req.userIdentity.hospital_id,
          input.appointment_date,
          input.provider_id,
          input.sub_department_id,
          input.appointment_from_time,
          input.appointment_from_time,
          input.appointment_to_time,
          input.appointment_to_time,
          req.userIdentity.hospital_id,

          input.sub_department_id,
          input.provider_id,
          input.appointment_date
        ],
        printQuery: true
      })
      .then(slotResult => {
        // _mysql.releaseConnection();
        // req.records = result;
        // next();

        if (slotResult[0].length > 0 && input.is_stand_by != "Y") {
          _mysql.releaseConnection();
          req.records = { invalid_input: true, message: "slot already taken" };
          next();
        } else if (slotResult[1].length >= 2 && input.is_stand_by != "Y") {
          _mysql.releaseConnection();
          let msg = "Booked twice  for this patient";

          if (req.userIdentity.unique_id_for_appointmt == "MOB")
            msg = "Booked twice  for this Mobile number";

          req.records = { invalid_input: true, message: msg };
          next();
        } else {
          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_patient_appointment` (patient_id,title_id,patient_code,provider_id,sub_department_id,number_of_slot,appointment_date,appointment_from_time,appointment_to_time,\
              appointment_status_id,patient_name,arabic_name,date_of_birth,age,contact_number,email,send_to_provider,gender,appointment_remarks,is_stand_by,\
              created_date, created_by, updated_date, updated_by,hospital_id)\
              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                input.patient_id,
                input.title_id,
                input.patient_code,
                input.provider_id,
                input.sub_department_id,
                input.number_of_slot,
                input.appointment_date,
                input.appointment_from_time,
                input.appointment_to_time,
                input.appointment_status_id,
                input.patient_name,
                input.arabic_name,
                input.date_of_birth,
                input.age,
                input.contact_number,
                input.email,
                input.send_to_provider,
                input.gender,
                input.appointment_remarks,
                input.is_stand_by,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                req.userIdentity.hospital_id
              ],
              printQuery: true
            })
            .then(result => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to update Patient Appointment
  updatePatientAppointment: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.body;
    _mysql
      .executeQuery({
        query:
          "select hims_f_patient_appointment_id,provider_id,title_id,patient_name,appointment_date,appointment_from_time,\
        appointment_to_time from hims_f_patient_appointment where record_status='A'\
        and date(appointment_date)=date(?) and provider_id=? and cancelled='N' and is_stand_by='N' and sub_department_id=? and\
        ((?>=appointment_from_time and ?<appointment_to_time)\
        or(?>appointment_from_time and ?<=appointment_to_time)) and hims_f_patient_appointment_id!=?;",
        values: [
          input.appointment_date,
          input.provider_id,
          input.sub_department_id,
          input.appointment_from_time,
          input.appointment_from_time,
          input.appointment_to_time,
          input.appointment_to_time,
          input.hims_f_patient_appointment_id
        ]
      })
      .then(slotResult => {
        // _mysql.releaseConnection();
        // req.records = result;
        // next();

        if (slotResult.length > 0 && input.is_stand_by != "Y") {
          _mysql.releaseConnection();
          req.records = { slotExist: true };
          next();
        } else {
          _mysql
            .executeQuery({
              query:
                "UPDATE `hims_f_patient_appointment` SET patient_id=?, title_id=? ,provider_id=?,sub_department_id=?,number_of_slot=?,appointment_date=?,appointment_from_time=?,appointment_to_time=?,\
              appointment_status_id=?,patient_name=?,arabic_name=?,date_of_birth=?,age=?,contact_number=?,email=?,\
              send_to_provider=?,gender=?,confirmed=?,confirmed_by=?,comfirmed_date=?,cancelled=?,cancelled_by=?,\
              cancelled_date=?,cancel_reason=?,appointment_remarks=?,is_stand_by=?,\
              updated_date=?, updated_by=? ,`record_status`=? WHERE  `record_status`='A' and  cancelled<>'Y' and `hims_f_patient_appointment_id`=?;",
              values: [
                input.patient_id,
                input.title_id,
                input.provider_id,
                input.sub_department_id,
                input.number_of_slot,
                input.appointment_date,
                input.appointment_from_time,
                input.appointment_to_time,
                input.appointment_status_id,
                input.patient_name,
                input.arabic_name,
                input.date_of_birth,
                input.age,
                input.contact_number,
                input.email,
                input.send_to_provider,
                input.gender,
                input.confirmed,
                input.confirmed_by,
                input.comfirmed_date,
                input.cancelled,
                input.cancelled_by,
                input.cancelled_date,
                input.cancel_reason,
                input.appointment_remarks,
                input.is_stand_by,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                input.record_status,
                input.hims_f_patient_appointment_id
              ]
            })
            .then(results => {
              _mysql.releaseConnection();
              req.records = results;
              next();
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to get Patient Appointment
  getPatientAppointment: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.query;
    let selectQry = "";
    if (input.sub_department_id > 0) {
      selectQry += ` and sub_department_id=${input.sub_department_id}`;
    }
    if (input.provider_id > 0) {
      selectQry += ` and provider_id=${input.provider_id}`;
    }
    if (
      input.appointment_to_time != null &&
      input.appointment_to_time != undefined
    ) {
      selectQry += ` and appointment_to_time=${input.appointment_to_time}`;
    }

    _mysql
      .executeQuery({
        query: `select hims_f_patient_appointment_id,patient_id,title_id,patient_code,provider_id,sub_department_id,number_of_slot,appointment_date,\
        appointment_from_time,appointment_to_time,appointment_status_id,patient_name,arabic_name,date_of_birth,age,\
    contact_number,email,send_to_provider,gender,confirmed,visit_created,\
    confirmed_by,comfirmed_date,cancelled,cancelled_by,cancelled_date,appointment_remarks,cancel_reason,is_stand_by\
    from hims_f_patient_appointment where record_status='A'  and hospital_id=? ${selectQry}`,
        values: [req.userIdentity.hospital_id]
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to getEmployeeServiceID
  getEmployeeServiceID: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.query;
    let selectQry = "";
    if (input.sub_department_id > 0) {
      selectQry += ` and sub_department_id=${input.sub_department_id}`;
    }
    if (input.employee_id > 0) {
      selectQry += ` and hims_d_employee_id = ${input.employee_id}`;
    }

    _mysql
      .executeQuery({
        query: `select hims_d_employee_id as employee_id, services_id, sub_department_id from hims_d_employee \
         where record_status='A' and hospital_id=?  ${selectQry}`,
        values: [req.userIdentity.hospital_id]
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: to cancel patient appointment
  cancelPatientAppointment: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "update hims_f_patient_appointment set appointment_status_id=(select hims_d_appointment_status_id from hims_d_appointment_status\
            where default_status='CAN'),\
        cancelled='Y',cancelled_by=?,cancelled_date=?,cancel_reason=?,\
        updated_by=?,updated_date=? where record_status='A' and hims_f_patient_appointment_id=?;",
        values: [
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          input.cancel_reason,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          input.hims_f_patient_appointment_id
        ]
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan: to deleteSchedule
  deleteSchedule: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;
    _mysql
      .executeQuery({
        query:
          "select hims_f_patient_appointment_id ,full_name, appointment_date from hims_f_patient_appointment A\
          inner join  hims_d_employee E on A.provider_id=E.hims_d_employee_id\
          where date(appointment_date) between date(?) and  date(?)\
          and A.sub_department_id=? and A.hospital_id=? and A.provider_id in (?)\
          group by A.provider_id ;",
        values: [
          input.from_date,
          input.to_date,
          input.sub_department_id,
          req.userIdentity.hospital_id,
          input.providers
        ],
        printQuery: false
      })
      .then(result => {
        // _mysql.releaseConnection();
        // req.records = result;
        // next();

        if (result.length > 0) {
          _mysql.releaseConnection();
          req.records = {
            invalid_opertaion: true,
            message: `Cant delete ,${
              result[0]["full_name"]
            } has appointments on  ${result[0]["appointment_date"]} `
          };
          next();
        } else {
          _mysql
            .executeQueryWithTransaction({
              query:
                "delete M from hims_d_appointment_schedule_detail D inner join\
                hims_d_appointment_schedule_modify M on D.hims_d_appointment_schedule_detail_id=M.appointment_schedule_detail_id\
                where D.appointment_schedule_header_id=? and D.provider_id in (?);\
                delete from hims_d_appointment_schedule_detail\
                where appointment_schedule_header_id=? and provider_id in (?);\
                delete H from hims_d_appointment_schedule_header H left join hims_d_appointment_schedule_detail D\
                on H.hims_d_appointment_schedule_header_id=D.appointment_schedule_header_id where  hims_d_appointment_schedule_header_id=?\
                and  D.appointment_schedule_header_id  is null ",
              values: [
                input.appointment_schedule_header_id,
                input.providers,
                input.appointment_schedule_header_id,
                input.providers,
                input.appointment_schedule_header_id
              ]
            })
            .then(delDesult => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = delDesult;
                next();
              });
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
  },

  //created by irfan: to get Appointment slip
  getAppointmentSlip: (req, res, next) => {
    if (req.query.hims_f_patient_appointment_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query: `select A.patient_name,A.appointment_date,A.appointment_from_time,SD.sub_department_name,
          E.full_name as doctor_name from hims_f_patient_appointment A inner join hims_d_sub_department SD on
           A.sub_department_id=SD.hims_d_sub_department_id
           inner join hims_d_employee E on A.provider_id=E.hims_d_employee_id
           where hims_f_patient_appointment_id=? and A.hospital_id=?`,
          values: [
            req.query.hims_f_patient_appointment_id,
            req.userIdentity.hospital_id
          ]
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "please provide valid appointment id"
      };

      next();
    }
  }
};
//[0,1,2,3,4,5,6]
function getDaysArray(start, end, days) {
  for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
    const dat = new Date(dt);
    const day = new Date(dat).getDay();
    if (days.indexOf(day) > -1) {
      arr.push(dat);
    }

    //moment(dat).format("YYYY-MM-DD")
    // if (nightShift == 1) {
    //   if (days.indexOf(day) > -1) {
    //     arr.push(dat);

    //     dat.setDate(dat.getDate() + 1);
    //     arr.push(dat);
    //   }
    // } else {
    //   if (days.indexOf(day) > -1) {
    //     arr.push(dat);
    //   }
    // }
  }

  return arr;
}
