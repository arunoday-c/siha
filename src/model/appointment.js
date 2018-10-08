"use strict";
import extend from "extend";
import {
  selectStatement,
  paging,
  whereCondition,
  deleteRecord,
  bulkInputArrayObject,
  releaseDBConnection,
  jsonArrayToObject
} from "../utils";
import moment from "moment";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import { logger, debugFunction, debugLog } from "../utils/logging";

//created by irfan: to add appointment_status
let addAppointmentStatus = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO `hims_d_appointment_status` (color_code, description, default_status, created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?)",
        [
          input.color_code,
          input.description,
          input.default_status,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add appointment_room
let addAppointmentRoom = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO `hims_d_appointment_room` (description, created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?)",
        [
          input.description,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add appointment_clinic
let addAppointmentClinic = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO `hims_d_appointment_clinic` (description, sub_department_id, provider_id, room_id, created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?,?)",
        [
          input.description,
          input.sub_department_id,
          input.provider_id,
          input.room_id,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get Appointment Status
let getAppointmentStatus = (req, res, next) => {
  let selectWhere = {
    hims_d_appointment_status_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_appointment_status_id, color_code, description, default_status FROM hims_d_appointment_status where record_status='A' AND" +
          where.condition,
        where.values,
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get Appointment Room
let getAppointmentRoom = (req, res, next) => {
  let selectWhere = {
    hims_d_appointment_room_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select * FROM hims_d_appointment_room where record_status='A' AND" +
          where.condition,
        where.values,
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get Appointment Clinic
let getAppointmentClinic = (req, res, next) => {
  let selectWhere = {
    hims_d_appointment_clinic_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_appointment_clinic_id,description, sub_department_id, provider_id, room_id FROM hims_d_appointment_clinic where record_status='A' AND" +
          where.condition,
        where.values,
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to update Appointment Status
let updateAppointmentStatus = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.query(
        "UPDATE `hims_d_appointment_status` SET color_code=?, description=?, default_status=?,\
           updated_date=?, updated_by=? ,`record_status`=? WHERE  `record_status`='A' and `hims_d_appointment_status_id`=?;",
        [
          input.color_code,
          input.description,
          input.default_status,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_d_appointment_status_id
        ],
        (error, result) => {
          connection.release();
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to update Appointment Room
let updateAppointmentRoom = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.query(
        "UPDATE `hims_d_appointment_room` SET  description=?,room_active=?,\
           updated_date=?, updated_by=? ,`record_status`=? WHERE  `record_status`='A' and `hims_d_appointment_room_id`=?;",
        [
          input.description,
          input.room_active,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_d_appointment_room_id
        ],
        (error, result) => {
          connection.release();
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to  update Appointment Clinic
let updateAppointmentClinic = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.query(
        "UPDATE `hims_d_appointment_clinic` SET  description=?,sub_department_id=?, provider_id=?, room_id=?,\
           updated_date=?, updated_by=? ,`record_status`=? WHERE  `record_status`='A' and `hims_d_appointment_clinic_id`=?;",
        [
          input.description,
          input.sub_department_id,
          input.provider_id,
          input.room_id,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_d_appointment_clinic_id
        ],
        (error, result) => {
          connection.release();
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to create new schedule and add doctors in this schedule
let BACKUPaddDoctorsSchedule = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    debugLog("input:", input);
    debugLog("from_Date:", new Date(input.from_date));
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }
        //creating schedule
        connection.query(
          "INSERT INTO `hims_d_appointment_schedule_header` (sub_dept_id,schedule_description,`month`,`year`,from_date,to_date,\
          from_work_hr,to_work_hr,work_break1,from_break_hr1,to_break_hr1,work_break2,from_break_hr2,to_break_hr2,monday,tuesday,wednesday,\
          thursday,friday,saturday,sunday,created_by,created_date,updated_by,updated_date)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
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
            req.body.created_by,
            new Date(),
            req.body.updated_by,
            new Date()
          ],
          (error, result) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }

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

            let daylist = getDaysArray(
              new Date(input.from_date),
              new Date(input.to_date),
              working_days
            );
            daylist.map(v => v.toLocaleString());
            //.slice(0, 10)).join("");

            debugLog("daylist:", daylist.length);
            if (input.schedule_detail.length != 0) {
              if (result.insertId != null) {
                for (let doc = 0; doc < input.schedule_detail.length; doc++) {
                  let doctorSchedule = [];

                  for (let i = 0; i < daylist.length; i++) {
                    doctorSchedule.push({
                      ...input.schedule_detail[doc],
                      ...{ schedule_date: daylist[i] }
                    });
                  }
                  // adding doctors to created schedule
                  const insurtColumns = [
                    "provider_id",
                    "clinic_id",
                    "slot",
                    "schedule_date",
                    "created_by",
                    "updated_by"
                  ];

                  connection.query(
                    "INSERT INTO hims_d_appointment_schedule_detail(" +
                      insurtColumns.join(",") +
                      ",`appointment_schedule_header_id`,created_date,updated_date) VALUES ?",
                    [
                      jsonArrayToObject({
                        sampleInputObject: insurtColumns,
                        arrayObj: doctorSchedule,
                        newFieldToInsert: [
                          result.insertId,
                          new Date(),
                          new Date()
                        ],
                        req: req
                      })
                    ],
                    (error, schedule_detailResult) => {
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
                        req.records = schedule_detailResult;
                        next();
                      });
                    }
                  );
                }
              }
            } else {
              req.records = { message: "please select doctors" };
              next();
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};
//created by irfan: to create new schedule and add doctors in this schedule
let addDoctorsSchedule = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    debugLog("input:", input);
    debugLog("from_Date:", new Date(input.from_date));
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }
        //creating schedule
        connection.query(
          "INSERT INTO `hims_d_appointment_schedule_header` (sub_dept_id,schedule_description,`month`,`year`,from_date,to_date,\
          from_work_hr,to_work_hr,work_break1,from_break_hr1,to_break_hr1,work_break2,from_break_hr2,to_break_hr2,monday,tuesday,wednesday,\
          thursday,friday,saturday,sunday,created_by,created_date,updated_by,updated_date)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
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
            req.body.created_by,
            new Date(),
            req.body.updated_by,
            new Date()
          ],
          (error, result) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }

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

            let newDateList = getDaysArray(
              new Date(input.from_date),
              new Date(input.to_date),
              working_days
            );
            newDateList.map(v => v.toLocaleString());
            //.slice(0, 10)).join("");

            debugLog("newDateList:", newDateList.length);

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
                  //--------------eisting schedule date

                  //get list of dates which are already scheduled for this doctor
                  connection.query(
                    "select hims_d_appointment_schedule_detail_id,appointment_schedule_header_id,schedule_date from hims_d_appointment_schedule_detail  where provider_id=? and schedule_date>?;",
                    [input.schedule_detail[doc].provider_id, new Date()],
                    (error, occupiedDoctorDates) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }

                      let OccupiedDoctorDatesList = new LINQ(
                        occupiedDoctorDates
                      )
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

                      debugLog("clashingDate: ", clashingDate);

                      //if date clashes check for time else add
                      if (clashingDate.length > 0) {
                        debugLog("functionality after clash");
                        let appointment_schedule_header_idS= new LINQ(
                          occupiedDoctorDates
                        )
                          .Where(w => w.schedule_date == clashingDate[0])
                          .Select(s => s.appointment_schedule_header_id)
                          .ToArray();
                        //obtain existing schedule time

                        debugLog(
                          "appointment_schedule_header_idS: ",
                          appointment_schedule_header_idS
                        );
//checking time in all schedules of clashed date 
// "select * from hims_d_appointment_schedule_header where time(from_work_hr)<=?  and time(to_work_hr)> ?\
// and hims_d_appointment_schedule_header_id=?"
                        for(let j=0;j<appointment_schedule_header_idS.length;j++ ){
                        connection.query(
                          "SELECT  * from hims_d_appointment_schedule_header where (? BETWEEN time(from_work_hr) AND time(to_work_hr))\
                           or  (? BETWEEN time(from_work_hr) AND time(to_work_hr))\
                          and hims_d_appointment_schedule_header_id=?",
                          [
                            input.from_work_hr,
                            input.to_work_hr,
                            appointment_schedule_header_idS[j]
                          ],
                          (error, timeChecking) => {
                            if (error) {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }
                            debugLog("timeChecking", timeChecking);

                            if (timeChecking.length > 0) {
                              //reject adding to schedule
                              debugLog("timeChecking", timeChecking);
                              req.records = {
                                message: `schedule already exist at ${
                                  clashingDate[0]
                                } for doctor_id: ${
                                  input.schedule_detail[doc].provider_id
                                }`,
                                schedule_exist: true
                              };
                              next(error);
                            } else {
                              //adding records for single doctor at one time
                              const insurtColumns = [
                                "provider_id",
                                "clinic_id",
                                "slot",
                                "schedule_date",
                                "created_by",
                                "updated_by"
                              ];

                              connection.query(
                                "INSERT INTO hims_d_appointment_schedule_detail(" +
                                  insurtColumns.join(",") +
                                  ",`appointment_schedule_header_id`,created_date,updated_date) VALUES ?",
                                [
                                  jsonArrayToObject({
                                    sampleInputObject: insurtColumns,
                                    arrayObj: doctorSchedule,
                                    newFieldToInsert: [
                                      result.insertId,
                                      new Date(),
                                      new Date()
                                    ],
                                    req: req
                                  })
                                ],
                                (error, schedule_detailResult) => {
                                  if (error) {
                                    connection.rollback(() => {
                                      releaseDBConnection(db, connection);
                                      next(error);
                                    });
                                  }
                                  if (doc == input.schedule_detail.length - 1) {
                                    connection.commit(error => {
                                      if (error) {
                                        connection.rollback(() => {
                                          releaseDBConnection(db, connection);
                                          next(error);
                                        });
                                      }
                                      req.records = schedule_detailResult;
                                      next();
                                    });
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                      }

                      //if no clashing dates
                      else {
                        //adding records for single doctor at one time
                        const insurtColumns = [
                          "provider_id",
                          "clinic_id",
                          "slot",
                          "schedule_date",
                          "created_by",
                          "updated_by"
                        ];

                        connection.query(
                          "INSERT INTO hims_d_appointment_schedule_detail(" +
                            insurtColumns.join(",") +
                            ",`appointment_schedule_header_id`,created_date,updated_date) VALUES ?",
                          [
                            jsonArrayToObject({
                              sampleInputObject: insurtColumns,
                              arrayObj: doctorSchedule,
                              newFieldToInsert: [
                                result.insertId,
                                new Date(),
                                new Date()
                              ],
                              req: req
                            })
                          ],
                          (error, schedule_detailResult) => {
                            if (error) {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }
                            if (doc == input.schedule_detail.length - 1) {
                              connection.commit(error => {
                                if (error) {
                                  connection.rollback(() => {
                                    releaseDBConnection(db, connection);
                                    next(error);
                                  });
                                }
                                req.records = schedule_detailResult;
                                next();
                              });
                            }
                          }
                        );
                      }
                    }
                  );

                  //----------------------------
                }
              }
            } else {
              req.records = { message: "please select doctors" };
              connection.rollback(() => {
                releaseDBConnection(db, connection);
              });
              next();
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
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
  }
  debugLog("dates:", arr);
  return arr;
}
//created by irfan: to add appointment leave
let addLeaveOrModifySchedule = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO `hims_d_appointment_schedule_leave` ( provider_id, sub_dept_id, clinic_id, to_date,\
           from_time, to_time, modified, created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?)",
        [
          input.provider_id,
          input.sub_dept_id,
          input.clinic_id,
          input.to_date,
          input.from_time,
          input.to_time,
          input.modified,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get doctors Schedule list
let getDoctorsScheduledList = (req, res, next) => {
  let selectWhere = {
    sub_dept_id: "ALL",
    month: "ALL",
    year: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let outputArray = [];
    let selectDoctor = "";
    if (req.query.provider_id != "null" && req.query.provider_id != null) {
      selectDoctor = `and ASD.provider_id=${req.query.provider_id}`;
    }
    delete req.query.provider_id;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_appointment_schedule_header_id, sub_dept_id, schedule_status, schedule_description, month, year,from_date,to_date, from_work_hr, to_work_hr, work_break1, from_break_hr1, to_break_hr1, work_break2, from_break_hr2,\
         to_break_hr2, monday, tuesday, wednesday, thursday, friday, saturday, sunday from hims_d_appointment_schedule_header where record_status='A' AND " +
          where.condition,
        where.values,
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          let schedule_header_id_all = new LINQ(result)
            .Where(w => w.hims_d_appointment_schedule_header_id != null)
            .Select(s => s.hims_d_appointment_schedule_header_id)
            .ToArray();

          if (result.length != 0) {
            for (let i = 0; i < result.length; i++) {
              connection.query(
                "SELECT hims_d_appointment_schedule_detail_id,appointment_schedule_header_id,SH.schedule_description ,\
                SH.schedule_status deprt_schedule_status,ASD.provider_id,E.first_name,E.last_name,\
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
                  " group by  provider_id;",
                (error, results) => {
                  if (error) {
                    releaseDBConnection(db, connection);
                    next(error);
                  }

                  result[i]["doctorsList"] = results;
                  outputArray.push(result[i]);
                  if (i == result.length - 1) {
                    req.records = outputArray;
                    next();
                  }
                }
              );
            }
          } else {
            req.records = result;
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get Doctor Schedule Date Wise
let getDoctorScheduleDateWise = (req, res, next) => {
  let selectWhere = {
    sub_dept_id: "ALL",
    schedule_date: "ALL",
    provider_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let selectDoctor = "";
    let provider_id = "";
    if (req.query.provider_id != "null" && req.query.provider_id != null) {
      selectDoctor = `provider_id=${req.query.provider_id} and `;
      provider_id = req.query.provider_id;
    }
    delete req.query.provider_id;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_appointment_schedule_header_id, sub_dept_id, SH.schedule_status, schedule_description, month, year,\
        from_date,to_date,from_work_hr, to_work_hr, work_break1, from_break_hr1, to_break_hr1, work_break2, from_break_hr2,\
        to_break_hr2, monday, tuesday, wednesday, thursday, friday, saturday, sunday,\
         hims_d_appointment_schedule_detail_id, provider_id,E.first_name,E.last_name,clinic_id, ASD.schedule_status, slot,schedule_date, modified \
         from hims_d_appointment_schedule_header SH, hims_d_appointment_schedule_detail ASD,hims_d_employee E  where SH.record_status='A' and E.record_status='A'\
         and ASD.record_status='A' and ASD.provider_id=E.hims_d_employee_id and  SH.hims_d_appointment_schedule_header_id=ASD.appointment_schedule_header_id and " +
          selectDoctor +
          "" +
          where.condition,
        where.values,
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          let outputArray = [];
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              // if (provider_id != "") {
              connection.query(
                "select hims_f_patient_appointment_id, patient_id, provider_id, sub_department_id, appointment_date, appointment_from_time,\
    appointment_to_time, appointment_status_id, patient_name, arabic_name, date_of_birth, age, contact_number, email, send_to_provider,\
    gender, confirmed, confirmed_by,comfirmed_date, cancelled, cancelled_by, cancelled_date, cancel_reason,\
    appointment_remarks, is_stand_by  from hims_f_patient_appointment where record_status='A' and sub_department_id=?\
    and appointment_date=? and provider_id=? ",
                [
                  result[i].sub_dept_id,
                  result[i].schedule_date,
                  result[i].provider_id
                ],
                (error, appResult) => {
                  if (error) {
                    releaseDBConnection(db, connection);
                    next(error);
                  }
                  const obj = {
                    ...result[i],
                    ...{ patientList: appResult }
                  };

                  outputArray.push(obj);
                  if (i == result.length - 1) {
                    req.records = outputArray;
                    next();
                  }
                }
              );
              // } else {
              //   req.records = result;
              //   next();
              // }
            }
          } else {
            req.records = result;
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get Doctor Schedule to Modify
let getDoctorScheduleToModify = (req, res, next) => {
  let selectWhere = {
    appointment_schedule_header_id: "ALL",
    provider_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_appointment_schedule_header_id, sub_dept_id, SH.schedule_status as deprt_schedule_status, schedule_description, month, year,\
        from_date,to_date,from_work_hr, to_work_hr, work_break1, from_break_hr1, to_break_hr1, work_break2, from_break_hr2, \
        to_break_hr2, monday, tuesday, wednesday, thursday, friday, saturday, sunday,\
        hims_d_appointment_schedule_detail_id, provider_id,clinic_id, ASD.schedule_status as doctor_schedule_status, slot,schedule_date, modified  \
       from hims_d_appointment_schedule_header SH, hims_d_appointment_schedule_detail ASD \
       where SH.record_status='A' and ASD.record_status='A' and  SH.hims_d_appointment_schedule_header_id=ASD.appointment_schedule_header_id\
       and " +
          where.condition,
        where.values,
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          let activeSchedule = new LINQ(result)
            .Where(w => w.modified != "M")
            .Select(s => s)
            .ToArray();

          let ids = new LINQ(result)
            .Where(w => w.modified == "M")
            .Select(s => s.hims_d_appointment_schedule_detail_id)
            .ToArray();

          if (ids.length > 0) {
            connection.query(
              "SELECT hims_d_appointment_schedule_modify_id, SD.provider_id, SD.clinic_id, SD.schedule_status,appointment_schedule_detail_id, to_date as schedule_date, SM.slot,\
              from_work_hr, to_work_hr,work_break1, from_break_hr1, to_break_hr1, work_break2, from_break_hr2, to_break_hr2 \
              from hims_d_appointment_schedule_modify SM, hims_d_appointment_schedule_detail SD where SM.record_status='A' and SM.record_status='A' and SM.appointment_schedule_detail_id=SD.hims_d_appointment_schedule_detail_id and\
              appointment_schedule_detail_id in (" +
                ids +
                ")",
              (error, modResult) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }
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
              }
            );
          } else {
            req.records = result;
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to update Doctor Schedule DateWise
let updateDoctorScheduleDateWise = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);
    debugLog("Input Data", input);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        connection.query(
          "UPDATE `hims_d_appointment_schedule_detail` SET `modified`=?,\
              `updated_by`=?, `updated_date`=? WHERE `record_status`='A' and \
         `hims_d_appointment_schedule_detail_id`=?;",
          [
            input.modified,
            input.updated_by,
            new Date(),
            input.hims_d_appointment_schedule_detail_id
          ],
          (error, result) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }

            if (
              input.hims_d_appointment_schedule_modify_id != null &&
              input.modified == "M"
            ) {
              connection.query(
                "UPDATE `hims_d_appointment_schedule_modify` SET appointment_schedule_detail_id=?,to_date=?,slot=?,\
    from_work_hr=?,to_work_hr=?,work_break1=?,from_break_hr1=?,to_break_hr1=?,work_break2=?,from_break_hr2=?,to_break_hr2=?,\
        `updated_by`=?, `updated_date`=? WHERE `record_status`='A' and \
   `hims_d_appointment_schedule_modify_id`=?;",
                [
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
                  input.updated_by,
                  new Date(),
                  input.hims_d_appointment_schedule_modify_id
                ],
                (error, updateModResult) => {
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

                    req.records = updateModResult;
                    next();
                  });
                }
              );
            } else {
              if (result.length != 0 && input.modified == "M") {
                connection.query(
                  "INSERT INTO `hims_d_appointment_schedule_modify` ( appointment_schedule_detail_id, to_date, slot, from_work_hr, to_work_hr, work_break1, from_break_hr1,\
       to_break_hr1, work_break2, from_break_hr2, to_break_hr2,created_date, created_by, updated_date, updated_by)\
      VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                  [
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
                    input.created_by,
                    new Date(),
                    input.updated_by
                  ],
                  (error, results) => {
                    if (error) {
                      releaseDBConnection(db, connection);
                      next(error);
                    }

                    connection.commit(error => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }

                      req.records = results;
                      next();
                    });
                  }
                );
              } else {
                connection.commit(error => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  req.records = result;
                  next();
                });
              }
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to delete Doctor From Schedule
let deleteDoctorFromSchedule = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);
    debugLog("Input Data", input);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        " update hims_d_appointment_schedule_detail set record_status='I',updated_by=?,updated_date=?\
         where record_status='A' and appointment_schedule_header_id=? and provider_id=?;",
        [
          input.updated_by,
          new Date(),
          input.appointment_schedule_header_id,
          input.provider_id
        ],
        (error, result) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};
//created by irfan: to update Schedule
let updateSchedule = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);
    debugLog("Input Data", input);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "UPDATE `hims_d_appointment_schedule_header` SET `sub_dept_id`=?, `schedule_status`=?,\
        `schedule_description`=?, `month`=?, `year`=?, `from_date`=?, `to_date`=?, \
        `from_work_hr`=?, `to_work_hr`=?, `work_break1`=?, `from_break_hr1`=?, \
        `to_break_hr1`=?, `work_break2`=?, `from_break_hr2`=?, `to_break_hr2`=?,\
               `monday`=?, `tuesday`=?, `wednesday`=?, `thursday`=?, `friday`=?, `saturday`=?,\
         `sunday`=?, `updated_by`=?, `updated_date`=?, `record_status`=? \
         WHERE record_status='A' and `hims_d_appointment_schedule_header_id`=? ;",
        [
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
          input.updated_by,
          new Date(),
          input.record_status,
          input.hims_d_appointment_schedule_header_id
        ],
        (error, result) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }

          debugLog("result:", result);
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add Doctor To Existing Schedule
let addDoctorToExistingSchedule = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    debugLog("input:", input);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        //generating list of dates by date range ie.(from_time and  to_time)
        connection.query(
          "SELECT from_work_hr,to_work_hr,from_date, to_date, monday, tuesday, wednesday, thursday, friday, saturday, sunday\
          from hims_d_appointment_schedule_header where  record_status='A' and hims_d_appointment_schedule_header_id=?",
          [input.hims_d_appointment_schedule_header_id],
          (error, result) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }

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
            //.slice(0, 10)).join("");

            debugLog("newDateList:", newDateList.length);
            //get list of dates which are already scheduled for this doctor
            connection.query(
              "select hims_d_appointment_schedule_detail_id,appointment_schedule_header_id,schedule_date from hims_d_appointment_schedule_detail  where provider_id=? and schedule_date>?;",
              [input.provider_id, new Date()],
              (error, occupiedDoctorDates) => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }

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

                debugLog("clashingDate: ", clashingDate);

                //if date clashes check for time else add
                if (clashingDate.length > 0) {
                  let appointment_schedule_header_id = new LINQ(
                    occupiedDoctorDates
                  )
                    .Where(w => w.schedule_date == clashingDate[0])
                    .Select(s => s.appointment_schedule_header_id)
                    .ToArray();
                  //obtain existing schedule time
                  connection.query(
                    "select * from hims_d_appointment_schedule_header where time(from_work_hr)<=?  and time(to_work_hr)> ?\
                    and hims_d_appointment_schedule_header_id=?",
                    [
                      result[0].from_work_hr,
                      result[0].from_work_hr,
                      appointment_schedule_header_id[0]
                    ],
                    (error, timeChecking) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }

                      if (timeChecking.length > 0) {
                        //reject adding to schedule
                        debugLog("timeChecking", timeChecking);
                        req.records = {
                          message: "schedule already exist",
                          schedule_exist: true
                        };
                        next();
                      } else {
                        //add to schedule

                        if (input.schedule_detail.length != 0) {
                          if (
                            input.hims_d_appointment_schedule_header_id != null
                          ) {
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

                              connection.query(
                                "INSERT INTO hims_d_appointment_schedule_detail(" +
                                  insurtColumns.join(",") +
                                  ",`appointment_schedule_header_id`,created_date,updated_date) VALUES ?",
                                [
                                  jsonArrayToObject({
                                    sampleInputObject: insurtColumns,
                                    arrayObj: doctorSchedule,
                                    newFieldToInsert: [
                                      input.hims_d_appointment_schedule_header_id,
                                      new Date(),
                                      new Date()
                                    ],
                                    req: req
                                  })
                                ],
                                (error, schedule_detailResult) => {
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
                                    req.records = schedule_detailResult;
                                    next();
                                  });
                                }
                              );
                            }
                          }
                        } else {
                          req.records = { message: "please select doctors" };
                          next();
                        }
                      }
                    }
                  );
                } else {
                  //else add doctor to schedule
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

                        connection.query(
                          "INSERT INTO hims_d_appointment_schedule_detail(" +
                            insurtColumns.join(",") +
                            ",`appointment_schedule_header_id`,created_date,updated_date) VALUES ?",
                          [
                            jsonArrayToObject({
                              sampleInputObject: insurtColumns,
                              arrayObj: doctorSchedule,
                              newFieldToInsert: [
                                input.hims_d_appointment_schedule_header_id,
                                new Date(),
                                new Date()
                              ],
                              req: req
                            })
                          ],
                          (error, schedule_detailResult) => {
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
                              req.records = schedule_detailResult;
                              next();
                            });
                          }
                        );
                      }
                    }
                  }
                }
              }
            );
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add Doctor To Existing Schedule
let BAckupaddDoctorToExistingSchedule = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    debugLog("input:", input);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        let newDates = [
          "2018-10-01T00:00:00.000Z",
          "2018-10-02T00:00:00.000Z",
          "2018-10-03T00:00:00.000Z",
          "2018-10-04T00:00:00.000Z",
          "2018-10-05T00:00:00.000Z",
          "2018-10-06T00:00:00.000Z",
          "2018-10-07T00:00:00.000Z",
          "2018-10-08T00:00:00.000Z",
          "2018-10-09T00:00:00.000Z",
          "2018-10-10T00:00:00.000Z"
        ];

        let providrDates = [
          "2018-10-01",
          "2018-10-02",
          "2018-10-27",
          "2018-10-28",
          "2018-10-29"
        ];

        let existingDates = [];
        new LINQ(newDates).Select(s => {
          const index = providrDates.indexOf(moment(s).format("YYYY-MM-DD"));

          if (index > -1) {
            existingDates.push(providrDates[index]);
          }
        });
        debugLog("existingDates: ", existingDates);
        if (existingDates.length > 0) {
        }
        //-----------------
        connection.query(
          "SELECT from_date, to_date, monday, tuesday, wednesday, thursday, friday, saturday, sunday\
          from hims_d_appointment_schedule_header where  record_status='A' and hims_d_appointment_schedule_header_id=?",
          [input.hims_d_appointment_schedule_header_id],
          (error, result) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }

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

            let daylist = getDaysArray(
              new Date(result[0].from_date),
              new Date(result[0].to_date),
              working_days
            );
            daylist.map(v => v.toLocaleString());
            //.slice(0, 10)).join("");

            debugLog("daylist:", daylist.length);
            if (input.schedule_detail.length != 0) {
              if (input.hims_d_appointment_schedule_header_id != null) {
                for (let doc = 0; doc < input.schedule_detail.length; doc++) {
                  let doctorSchedule = [];

                  for (let i = 0; i < daylist.length; i++) {
                    doctorSchedule.push({
                      ...input.schedule_detail[doc],
                      ...{ schedule_date: daylist[i] }
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

                  connection.query(
                    "INSERT INTO hims_d_appointment_schedule_detail(" +
                      insurtColumns.join(",") +
                      ",`appointment_schedule_header_id`,created_date,updated_date) VALUES ?",
                    [
                      jsonArrayToObject({
                        sampleInputObject: insurtColumns,
                        arrayObj: doctorSchedule,
                        newFieldToInsert: [
                          input.hims_d_appointment_schedule_header_id,
                          new Date(),
                          new Date()
                        ],
                        req: req
                      })
                    ],
                    (error, schedule_detailResult) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      req.records = schedule_detailResult;
                      next();
                      // connection.commit(error => {
                      //   if (error) {
                      //     connection.rollback(() => {
                      //       releaseDBConnection(db, connection);
                      //       next(error);
                      //     });
                      //   }
                      //   req.records = schedule_detailResult;
                      //   next();
                      // });
                    }
                  );
                }
              }
            } else {
              req.records = { message: "please select doctors" };
              next();
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add patient appointment
let addPatientAppointment = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO `hims_f_patient_appointment` (patient_id,provider_id,sub_department_id,appointment_date,appointment_from_time,appointment_to_time,\
          appointment_status_id,patient_name,arabic_name,date_of_birth,age,contact_number,email,send_to_provider,gender,appointment_remarks,is_stand_by,\
          created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          input.patient_id,
          input.provider_id,
          input.sub_department_id,
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
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to update Patient Appointment
let updatePatientAppointment = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.query(
        "UPDATE `hims_d_appointment_status` SET color_code=?, description=?, default_status=?,\
           updated_date=?, updated_by=? ,`record_status`=? WHERE  `record_status`='A' and `hims_d_appointment_status_id`=?;",
        [
          input.color_code,
          input.description,
          input.default_status,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_d_appointment_status_id
        ],
        (error, result) => {
          connection.release();
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get Patient Appointment
let getPatientAppointment = (req, res, next) => {
  let selectWhere = {
    sub_department_id: "ALL",
    appointment_to_time: "ALL",
    provider_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let selectDoctor = "";
    if (req.query.provider_id != "null" && req.query.provider_id != null) {
      selectDoctor = `provider_id=${req.query.provider_id} and `;
    }
    delete req.query.provider_id;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_patient_appointment_id,patient_id,provider_id,sub_department_id,appointment_date,\
            appointment_from_time,appointment_to_time,appointment_status_id,patient_name,arabic_name,date_of_birth,age,\
        contact_number,email,send_to_provider,gender,confirmed,\
        confirmed_by,comfirmed_date,cancelled,cancelled_by,cancelled_date,cancel_reason\
        from hims_f_patient_appointment where record_status='A' and " +
          selectDoctor +
          "" +
          where.condition,
        where.values,
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addAppointmentStatus,
  addAppointmentRoom,
  addAppointmentClinic,
  getAppointmentStatus,
  getAppointmentRoom,
  getAppointmentClinic,
  updateAppointmentStatus,
  updateAppointmentRoom,
  updateAppointmentClinic,
  addDoctorsSchedule,
  getDoctorsScheduledList,
  addLeaveOrModifySchedule,
  getDoctorScheduleDateWise,
  getDoctorScheduleToModify,
  updateDoctorScheduleDateWise,
  deleteDoctorFromSchedule,
  updateSchedule,
  addDoctorToExistingSchedule,
  addPatientAppointment,
  getPatientAppointment
};
