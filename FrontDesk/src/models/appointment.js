import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";
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
          "INSERT INTO `hims_d_appointment_room` (description, created_date, created_by, updated_date, updated_by)\
        VALUE(?,?,?,?,?)",
        values: [
          input.description,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id
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
          "INSERT INTO `hims_d_appointment_clinic` (description, sub_department_id, provider_id, room_id, created_date, created_by, updated_date, updated_by)\
        VALUE(?,?,?,?,?,?,?,?)",
        values: [
          input.description,
          input.sub_department_id,
          input.provider_id,
          input.room_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id
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
          "select hims_d_appointment_status_id, color_code, description, default_status,steps,authorized FROM hims_d_appointment_status where record_status='A'  order by steps "
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
        query: `select hims_d_appointment_room_id, description, room_active FROM hims_d_appointment_room where record_status='A' ${appointment_room_id} order by hims_d_appointment_room_id desc `
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
        query: `select hims_d_appointment_clinic_id,description, sub_department_id, provider_id, room_id FROM hims_d_appointment_clinic where record_status='A' ${appointment_clinic_id}
        order by hims_d_appointment_clinic_id desc`
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
  addDoctorsSchedule: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;
    //creating schedule
    _mysql
      .executeQueryWithTransaction({
        query:
          "INSERT INTO `hims_d_appointment_schedule_header` (sub_dept_id,schedule_description,`month`,`year`,from_date,to_date,\
        from_work_hr,to_work_hr,work_break1,from_break_hr1,to_break_hr1,work_break2,from_break_hr2,to_break_hr2,monday,tuesday,wednesday,\
        thursday,friday,saturday,sunday,created_by,created_date,updated_by,updated_date)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        values: [
          input.sub_dept_id,
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
          req.userIdentity.algaeh_d_app_user_id,
          new Date()
        ]
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
        let nightShift = "";

        if (input.from_work_hr > input.to_work_hr) {
          nightShift = 1;
        }

        let newDateList = getDaysArray(
          new Date(input.from_date),
          new Date(input.to_date),
          working_days,
          nightShift
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
                    "select hims_d_appointment_schedule_detail_id,appointment_schedule_header_id,schedule_date from hims_d_appointment_schedule_detail  where provider_id=? and schedule_date>?;",
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
                                next(e);
                              });
                              req.records = {
                                message: `schedule already exist on ${
                                  clashingDate[0]
                                } for doctor_id:${
                                  input.schedule_detail[doc].provider_id
                                } from ${timeChecking[0][0].from_work_hr} to 
                                     ${timeChecking[0][0].to_work_hr}`,
                                schedule_exist: true
                              };
                              next();
                            } else {
                              if (timeChecking[1].length > 0) {
                                _mysql.rollBackTransaction(() => {
                                  next(e);
                                });
                                req.records = {
                                  message: `schedule already exist on ${
                                    clashingDate[0]
                                  } for doctor_id:${
                                    input.schedule_detail[doc].provider_id
                                  } from ${timeChecking[1][0].from_work_hr} to 
                                       ${timeChecking[1][0].to_work_hr}`,
                                  schedule_exist: true
                                };
                                next();
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
  },

  //created by irfan: to add appointment leave
  addLeaveOrModifySchedule: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_d_appointment_schedule_leave` ( provider_id, sub_dept_id, clinic_id, to_date,\
            from_time, to_time, modified, created_date, created_by, updated_date, updated_by)\
           VALUE(?,?,?,?,?,?,?,?,?,?,?)",
        values: [
          input.provider_id,
          input.sub_dept_id,
          input.clinic_id,
          input.to_date,
          input.from_time,
          input.to_time,
          input.modified,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id
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

  //created by irfan: to get doctors Schedule list
  getDoctorsScheduledList: (req, res, next) => {
    const _mysql = new algaehMysql();

    let outputArray = [];
    let selectDoctor = "";
    if (req.query.provider_id != "null" && req.query.provider_id != null) {
      selectDoctor = `and ASD.provider_id=${req.query.provider_id}`;
    }
    delete req.query.provider_id;

    _mysql
      .executeQuery({
        query:
          "select hims_d_appointment_schedule_header_id, sub_dept_id, schedule_status, schedule_description, month, year,from_date,to_date, from_work_hr, to_work_hr, work_break1, from_break_hr1, to_break_hr1, work_break2, from_break_hr2,\
        to_break_hr2, monday, tuesday, wednesday, thursday, friday, saturday, sunday from hims_d_appointment_schedule_header where record_status='A' AND sub_dept_id=? and year=? and month=?  ",
        values: [req.query.sub_dept_id, req.query.year, req.query.month]
      })
      .then(result => {
        // _mysql.releaseConnection();
        // req.records = result;
        // next();

        let schedule_header_id_all = new LINQ(result)
          .Where(w => w.hims_d_appointment_schedule_header_id != null)
          .Select(s => s.hims_d_appointment_schedule_header_id)
          .ToArray();

        if (result.length != 0) {
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
                  schedule_header_id_all +
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
  }
};
//[0,1,2,3,4,5,6]
function getDaysArray(start, end, days, nightShift) {
  for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
    const dat = new Date(dt);
    const day = new Date(dat).getDay();
    if (nightShift == 1) {
      if (days.indexOf(day) > -1) {
        arr.push(dat);

        dat.setDate(dat.getDate() + 1);
        arr.push(dat);
      }
    } else {
      if (days.indexOf(day) > -1) {
        arr.push(dat);
      }
    }
  }

  return arr;
}
