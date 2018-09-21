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
//import { LINQ } from "node-linq";
//import { logger, debugFunction, debugLog } from "../utils/logging";

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
        "select hims_d_appointment_room_id, description FROM hims_d_appointment_room where record_status='A' AND" +
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
        "UPDATE `hims_d_appointment_room` SET  description=?,\
           updated_date=?, updated_by=? ,`record_status`=? WHERE  `record_status`='A' and `hims_d_appointment_room_id`=?;",
        [
          input.description,
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

module.exports = {
  addAppointmentStatus,
  addAppointmentRoom,
  addAppointmentClinic,
  getAppointmentStatus,
  getAppointmentRoom,
  getAppointmentClinic,
  updateAppointmentStatus,
  updateAppointmentRoom,
  updateAppointmentClinic
};
