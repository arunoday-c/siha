import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import {
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
  updateSchedule
} from "../model/appointment";

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
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
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

  return api;
};
