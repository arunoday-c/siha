import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  processAttendanceOLD,
  markAbsent,
  cancelAbsent,
  getAllAbsentEmployee,
  addAttendanceRegularization,
  regularizeAttendance,
  getEmployeeAttendReg,
  processAttendance,
  getEmployeeToManualTimeSheet,
  addToDailyTimeSheet,
  getDailyTimeSheet,
  processBiometricAttendance,
  loadAttendance,
  notifyException,
  updateToDailyTimeSheet,
  postTimeSheet,
  postTimeSheetMonthWise,
  getActivityFeed,
  requestAttndncReglztion
} from "../models/attendance";
export default () => {
  const api = Router();
  api.get("/processAttendanceOLD", processAttendanceOLD, (req, res, next) => {
    if (req.records.no_data == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  });

  api.post("/markAbsent", markAbsent, (req, res, next) => {
    if (req.records.no_data == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  });

  api.put("/cancelAbsent", cancelAbsent, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  });

  api.get("/getAllAbsentEmployee", getAllAbsentEmployee, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  });

  api.post(
    "/addAttendanceRegularization",
    addAttendanceRegularization,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          result: req.records
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records
        });
      }
    }
  );

  api.put("/regularizeAttendance", regularizeAttendance, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  });

  api.get("/getEmployeeAttendReg", getEmployeeAttendReg, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  });
  api.get("/processAttendance", processAttendance, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  });

  api.get(
    "/getEmployeeToManualTimeSheet",
    getEmployeeToManualTimeSheet,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.post("/addToDailyTimeSheet", addToDailyTimeSheet, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.put(
    "/updateToDailyTimeSheet",
    updateToDailyTimeSheet,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get("/getDailyTimeSheet", getDailyTimeSheet, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  });
  api.get(
    "/processBiometricAttendance",
    processBiometricAttendance,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          result: req.records
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records
        });
      }
    }
  );
  api.get("/loadAttendance", loadAttendance, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  });

  api.post("/notifyException", notifyException, (req, res, next) => {
    if (typeof req.records === "string") {
      res.status(utlities.AlgaehUtilities().httpStatus().badRequest).json({
        success: false,
        message: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        message: req.records
      });
    }
  });

  api.get("/postTimeSheet", postTimeSheet, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  });
  api.get(
    "/postTimeSheetMonthWise",
    postTimeSheetMonthWise,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          result: req.records
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records
        });
      }
    }
  );
  api.get("/getActivityFeed", getActivityFeed, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  });

  api.put(
    "/requestAttndncReglztion",
    requestAttndncReglztion,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          result: req.records
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records
        });
      }
    }
  );

  return api;
};
