"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _appointment = require("../model/appointment");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // created by irfan :to add Appointment Status
  api.post("/addAppointmentStatus", _appointment.addAppointmentStatus, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to deleteAppointmentRoom
  api.delete("/deleteAppointmentRoom", _appointment.deleteAppointmentRoom, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to add Appointment Room
  api.post("/addAppointmentRoom", _appointment.addAppointmentRoom, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to add Appointment Clinic
  api.post("/addAppointmentClinic", _appointment.addAppointmentClinic, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to get AppointmentS tatus
  api.get("/getAppointmentStatus", _appointment.getAppointmentStatus, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to get AppointmentS Rooms
  api.get("/getAppointmentRoom", _appointment.getAppointmentRoom, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to get Appointment Clinic
  api.get("/getAppointmentClinic", _appointment.getAppointmentClinic, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :update Appointment Status
  api.put("/updateAppointmentStatus", _appointment.updateAppointmentStatus, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :update Appointment Room
  api.put("/updateAppointmentRoom", _appointment.updateAppointmentRoom, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :update Appointment Clinic
  api.put("/updateAppointmentClinic", _appointment.updateAppointmentClinic, function (req, res, next) {
    var results = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: results
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to add Appointment schedule
  api.post("/addDoctorsSchedule", _appointment.addDoctorsSchedule, function (req, res, next) {
    var result = req.records;
    if (result.schedule_exist == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: result
      });
      next();
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });
      next();
    }
  }, _utils.releaseConnection);

  // created by irfan :to get Doctors Scheduled List
  api.get("/getDoctorsScheduledList", _appointment.getDoctorsScheduledList, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to get Doctor Schedule DateWise
  api.get("/getDoctorScheduleDateWise", _appointment.getDoctorScheduleDateWise, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to addLeaveOrModifySchedule
  api.post("/addLeaveOrModifySchedule", _appointment.addLeaveOrModifySchedule, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to get Doctor Schedule to Modify
  api.get("/getDoctorScheduleToModify", _appointment.getDoctorScheduleToModify, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to update Doctor Schedule DateWise
  api.put("/updateDoctorScheduleDateWise", _appointment.updateDoctorScheduleDateWise, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to delete Doctor From Schedule
  api.put("/deleteDoctorFromSchedule", _appointment.deleteDoctorFromSchedule, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to update Schedule
  api.put("/updateSchedule", _appointment.updateSchedule, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to update Schedule
  api.post("/addDoctorToExistingSchedule", _appointment.addDoctorToExistingSchedule, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to add Patient Appointment
  api.post("/addPatientAppointment", _appointment.addPatientAppointment, function (req, res, next) {
    var result = req.records;
    if (req.records.slotExist == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: result
      });

      next();
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });

      next();
    }
  }, _utils.releaseConnection);

  // created by irfan :to get Patient Appointment
  api.get("/getPatientAppointment", _appointment.getPatientAppointment, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to update Patient Appointment
  api.put("/updatePatientAppointment", _appointment.updatePatientAppointment, function (req, res, next) {
    var result = req.records;
    if (req.records.slotExist == true || req.records.bookedtwice == true) {
      res.status(_httpStatus2.default.ok).json({
        success: false,
        records: result
      });

      next();
    } else {
      res.status(_httpStatus2.default.ok).json({
        success: true,
        records: result
      });

      next();
    }
  }, _utils.releaseConnection);

  // created by irfan :to
  api.get("/getEmployeeServiceID", _appointment.getEmployeeServiceID, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to
  api.put("/appointmentStatusAuthorized", _appointment.appointmentStatusAuthorized, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  // created by irfan :to cancelPatientAppointment
  api.put("/cancelPatientAppointment", _appointment.cancelPatientAppointment, function (req, res, next) {
    var result = req.records;
    res.status(_httpStatus2.default.ok).json({
      success: true,
      records: result
    });
    next();
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=appointment.js.map