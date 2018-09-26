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

//created by irfan: to add appointment schedule
let addAppointmentSchedule = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend([], req.body);

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

        for (let i = 0; i < input.length; i++) {
          connection.query(
            "INSERT INTO `hims_d_appointment_schedule_header` (sub_dept_id, schedule_status, schedule_description,\
              `month`,`year`,monday, tuesday, wednesday, thursday, friday, saturday, sunday, created_by, created_date, updated_by, updated_date)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              input[i].sub_dept_id,
              input[i].schedule_status,
              input[i].schedule_description,
              input[i].month,
              input[i].year,
              input[i].monday,
              input[i].tuesday,
              input[i].wednesday,
              input[i].thursday,
              input[i].friday,
              input[i].saturday,
              input[i].sunday,
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

              if (result.insertId != null) {
                const insurtColumns = [
                  "provider_id",
                  "sub_dept_id",
                  "clinic_id",
                  "schedule_status",
                  "default_slot",
                  "schedule_date",
                  "from_work_hr",
                  "to_work_hr",
                  "work_break1",
                  "work_break2",
                  "from_break_hr1",
                  "to_break_hr1",
                  "from_break_hr2",
                  "to_break_hr2",
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
                      arrayObj: input[i].schedule_detail,
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

                    if (i == input.length - 1) {
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
              // req.records = result;
              // next();
            }
          );
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get Appointment Schedule
let getAppointmentSchedule = (req, res, next) => {
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

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_appointment_schedule_header_id from hims_d_appointment_schedule_header where record_status='A' AND " +
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

          debugLog("schedule_header_id_all:", schedule_header_id_all);

          // req.records = result;
          // next();
          if (result.length != 0) {
            connection.query(
              "SELECT hims_d_appointment_schedule_detail_id,appointment_schedule_header_id,SH.schedule_description,SH.monday,SH.tuesday,\
              SH.wednesday,SH.thursday,SH.friday,SH.saturday,SH.sunday ,ASD.provider_id,E.first_name,E.last_name,\
              ASD.sub_dept_id,clinic_id,AC.description as clinic_description,ASD.schedule_status,default_slot,schedule_date,from_work_hr,\
              to_work_hr,work_break1,work_break2,\
              from_break_hr1,to_break_hr1,from_break_hr2,to_break_hr2\
              from hims_d_appointment_schedule_detail ASD ,hims_d_employee E, hims_d_appointment_clinic AC,hims_d_appointment_schedule_header SH\
               where ASD.record_status='A' and E.record_status='A' and AC.record_status='A'and SH.record_status='A' and ASD.provider_id=E.hims_d_employee_id\
               and ASD.clinic_id=AC.hims_d_appointment_clinic_id and ASD.appointment_schedule_header_id=SH.hims_d_appointment_schedule_header_id and\
               appointment_schedule_header_id in (" +
                schedule_header_id_all +
                ");",
              (error, results) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }
                req.records = results;
                next();
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
  addAppointmentSchedule,
  getAppointmentSchedule,
  addLeaveOrModifySchedule
};
