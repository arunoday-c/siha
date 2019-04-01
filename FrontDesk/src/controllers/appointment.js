import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  addAppointmentStatus,
  addAppointmentRoom,
  addAppointmentClinic,
  getAppointmentStatus,
  getAppointmentRoom,
  getAppointmentClinic,
  updateAppointmentStatus,
  appointmentStatusAuthorized,
  updateAppointmentRoom,
  deleteAppointmentRoom,
  updateAppointmentClinic,
  addDoctorsSchedule,
  addLeaveOrModifySchedule,
  getDoctorsScheduledList,
  getDoctorScheduleDateWise,
  getDoctorScheduleToModify,
  updateDoctorScheduleDateWise,
  deleteDoctorFromSchedule,
  updateSchedule,
  addDoctorToExistingSchedule,
  addPatientAppointment,
  updatePatientAppointment,
  getPatientAppointment,
  getEmployeeServiceID,
  cancelPatientAppointment
} from "../models/appointment";

export default () => {
  const api = Router();
  api.post("/addAppointmentStatus", addAppointmentStatus, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addAppointmentRoom", addAppointmentRoom, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addAppointmentClinic", addAppointmentClinic, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });
  api.get("/getAppointmentStatus", getAppointmentStatus, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });
  api.get("/getAppointmentRoom", getAppointmentRoom, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });
  api.get("/getAppointmentClinic", getAppointmentClinic, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });
  api.put(
    "/updateAppointmentStatus",
    updateAppointmentStatus,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.put(
    "/appointmentStatusAuthorized",
    appointmentStatusAuthorized,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.put("/updateAppointmentRoom", updateAppointmentRoom, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });
  api.delete(
    "/deleteAppointmentRoom",
    deleteAppointmentRoom,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.put(
    "/updateAppointmentClinic",
    updateAppointmentClinic,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  // created by irfan :to add Appointment schedule
  api.post("/addDoctorsSchedule", addDoctorsSchedule, (req, res, next) => {
    let result = req.records;
    if (result.schedule_exist == true) {
      res.status(httpStatus.ok).json({
        success: false,
        records: result
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
    }
  });

  api.post(
    "/addLeaveOrModifySchedule",
    addLeaveOrModifySchedule,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.get(
    "/getDoctorsScheduledList",
    getDoctorsScheduledList,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.get(
    "/getDoctorScheduleDateWise",
    getDoctorScheduleDateWise,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.get(
    "/getDoctorScheduleToModify",
    getDoctorScheduleToModify,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.put(
    "/updateDoctorScheduleDateWise",
    updateDoctorScheduleDateWise,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.put(
    "/deleteDoctorFromSchedule",
    deleteDoctorFromSchedule,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  api.put("/updateSchedule", updateSchedule, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });
  api.post(
    "/addDoctorToExistingSchedule",
    addDoctorToExistingSchedule,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  // created by irfan :to
  api.post(
    "/addPatientAppointment",
    addPatientAppointment,
    (req, res, next) => {
      let result = req.records;
      if (result.slotExist == true) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }
    }
  );

  // created by irfan :to
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
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }
    }
  );

  api.get("/getPatientAppointment", getPatientAppointment, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });
  api.get("/getEmployeeServiceID", getEmployeeServiceID, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get(
    "/cancelPatientAppointment",
    cancelPatientAppointment,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );
  return api;
};
