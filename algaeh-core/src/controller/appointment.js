import { Router } from "express";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import appointment from "../model/appointment";

const {
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
  getPatientAppointment,
  updatePatientAppointment,
  getEmployeeServiceID,
  appointmentStatusAuthorized,
  deleteAppointmentRoom,
  cancelPatientAppointment
} = appointment;
const { releaseConnection } = utils;

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to add Appointment Status
  api.post(
    "/addAppointmentStatus",
    addAppointmentStatus,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to deleteAppointmentRoom
  api.delete(
    "/deleteAppointmentRoom",
    deleteAppointmentRoom,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to add Appointment Room
  api.post(
    "/addAppointmentRoom",
    addAppointmentRoom,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to add Appointment Clinic
  api.post(
    "/addAppointmentClinic",
    addAppointmentClinic,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to get AppointmentS tatus
  api.get(
    "/getAppointmentStatus",
    getAppointmentStatus,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to get AppointmentS Rooms
  api.get(
    "/getAppointmentRoom",
    getAppointmentRoom,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to get Appointment Clinic
  api.get(
    "/getAppointmentClinic",
    getAppointmentClinic,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :update Appointment Status
  api.put(
    "/updateAppointmentStatus",
    updateAppointmentStatus,
    (req, res, next) => {
      let results = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: results
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :update Appointment Room
  api.put(
    "/updateAppointmentRoom",
    updateAppointmentRoom,
    (req, res, next) => {
      let results = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: results
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :update Appointment Clinic
  api.put(
    "/updateAppointmentClinic",
    updateAppointmentClinic,
    (req, res, next) => {
      let results = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: results
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to add Appointment schedule
  api.post(
    "/addDoctorsSchedule",
    addDoctorsSchedule,
    (req, res, next) => {
      let result = req.records;
      if (result.schedule_exist == true) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });
        next();
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      }
    },
    releaseConnection
  );

  // created by irfan :to get Doctors Scheduled List
  api.get(
    "/getDoctorsScheduledList",
    getDoctorsScheduledList,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to get Doctor Schedule DateWise
  api.get(
    "/getDoctorScheduleDateWise",
    getDoctorScheduleDateWise,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to addLeaveOrModifySchedule
  api.post(
    "/addLeaveOrModifySchedule",
    addLeaveOrModifySchedule,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to get Doctor Schedule to Modify
  api.get(
    "/getDoctorScheduleToModify",
    getDoctorScheduleToModify,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to update Doctor Schedule DateWise
  api.put(
    "/updateDoctorScheduleDateWise",
    updateDoctorScheduleDateWise,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to delete Doctor From Schedule
  api.put(
    "/deleteDoctorFromSchedule",
    deleteDoctorFromSchedule,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to update Schedule
  api.put(
    "/updateSchedule",
    updateSchedule,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to update Schedule
  api.post(
    "/addDoctorToExistingSchedule",
    addDoctorToExistingSchedule,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to add Patient Appointment
  api.post(
    "/addPatientAppointment",
    addPatientAppointment,
    (req, res, next) => {
      let result = req.records;
      if (req.records.slotExist == true) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });

        next();
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });

        next();
      }
    },
    releaseConnection
  );

  // created by irfan :to get Patient Appointment
  api.get(
    "/getPatientAppointment",
    getPatientAppointment,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to update Patient Appointment
  api.put(
    "/updatePatientAppointment",
    updatePatientAppointment,
    (req, res, next) => {
      let result = req.records;
      if (req.records.slotExist == true || req.records.bookedtwice == true) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });

        next();
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });

        next();
      }
    },
    releaseConnection
  );

  // created by irfan :to
  api.get(
    "/getEmployeeServiceID",
    getEmployeeServiceID,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to
  api.put(
    "/appointmentStatusAuthorized",
    appointmentStatusAuthorized,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to cancelPatientAppointment
  api.put(
    "/cancelPatientAppointment",
    cancelPatientAppointment,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  return api;
};
