import { Router } from "express";
import utlities from "algaeh-utilities";
import attendence from "../models/attendance";
import bulkModels from "../models/bulkmaunaltimesheet";

const { excelManualTimeSheet, excelManualTimeSheetRead } = bulkModels;
const {
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
  requestAttndncReglztion,
  considerOverTimeOrShortage,
  getDailyAttendance,
  updateMonthlyAttendance,
  postManualTimeSheetMonthWise,
  loadManualTimeSheet,
  getAttendanceDates,
  getBulkManualTimeSheet,
  uploadBulkManualTimeSheet,
  previewBulkTimeSheet,
  postBulkTimeSheetMonthWise,
  SaveAttendanceAndProject,
} = attendence;

export default () => {
  const api = Router();

  api.post("/markAbsent", markAbsent, (req, res, next) => {
    if (req.records.no_data == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  });

  api.put("/cancelAbsent", cancelAbsent, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  });

  api.get("/getAllAbsentEmployee", getAllAbsentEmployee, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
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
          result: req.records,
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records,
        });
      }
    }
  );

  api.put("/regularizeAttendance", regularizeAttendance, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  });

  api.get("/getEmployeeAttendReg", getEmployeeAttendReg, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  });
  api.get(
    "/processAttendance",
    (req, res, next) => {
      req.connection = null;
      delete req.connection;
      next();
    },
    processAttendance,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          result: req.records,
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records,
        });
      }
    }
  );

  api.get(
    "/getEmployeeToManualTimeSheet",
    getEmployeeToManualTimeSheet,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.post("/addToDailyTimeSheet", addToDailyTimeSheet, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  api.put(
    "/updateToDailyTimeSheet",
    updateToDailyTimeSheet,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  );

  api.get("/getDailyTimeSheet", getDailyTimeSheet, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
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
          result: req.records,
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records,
        });
      }
    }
  );
  api.get("/loadAttendance", loadAttendance, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        records: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records,
      });
    }
  });

  api.post("/notifyException", notifyException, (req, res, next) => {
    if (req.records.no_exception == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        records: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        message: req.records,
      });
    }
  });

  api.get("/postTimeSheet", postTimeSheet, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
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
          result: req.records,
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records,
        });
      }
    }
  );
  api.get("/getActivityFeed", getActivityFeed, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
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
          result: req.records,
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records,
        });
      }
    }
  );

  api.put(
    "/considerOverTimeOrShortage",
    considerOverTimeOrShortage,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          result: req.records,
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records,
        });
      }
    }
  );

  api.get("/getDailyAttendance", getDailyAttendance, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  });

  api.put(
    "/updateMonthlyAttendance",
    updateMonthlyAttendance,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          result: req.records,
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records,
        });
      }
    }
  );

  api.get(
    "/postManualTimeSheetMonthWise",
    postManualTimeSheetMonthWise,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          result: req.records,
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records,
        });
      }
    }
  );
  api.get("/loadManualTimeSheet", loadManualTimeSheet, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  });
  api.get("/getAttendanceDates", getAttendanceDates, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  });

  api.get(
    "/getBulkManualTimeSheet",
    getBulkManualTimeSheet,

    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res
          .status(utlities.AlgaehUtilities().httpStatus().internalServer)
          .json({
            success: false,
            result: req.records,
          });
      } else {
        next();
      }
    },

    excelManualTimeSheet
  );

  api.get("/previewBulkTimeSheet", previewBulkTimeSheet, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: false,
        result: req.records,
      });
    } else {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  });
  api.post(
    "/excelManualTimeSheetRead",
    excelManualTimeSheetRead,
    uploadBulkManualTimeSheet,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          result: req.records,
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records,
        });
      }
    }
  );

  api.get(
    "/postBulkTimeSheetMonthWise",
    postBulkTimeSheetMonthWise,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          message: req.records.message,
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records,
        });
      }
    }
  );

  api.post(
    "/SaveAttendanceAndProject",
    SaveAttendanceAndProject,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records,
      });
    }
  );

  return api;
};
