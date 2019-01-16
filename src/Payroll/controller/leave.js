import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  getEmployeeLeaveData,
  getYearlyLeaveData,
  applyEmployeeLeave,
  getEmployeeLeaveHistory,
  getLeaveBalance,
  getLeaveLevels,
  addLeaveMaster,
  addAttendanceRegularization,
  getEmployeeAttendReg,
  processYearlyLeave,
  markAbsent,
  cancelAbsent,
  getAllAbsentEmployee,
  authorizeLeave,
  getLeaveApllication,
  updateLeaveMaster,
  calculateLeaveDays,
  getLeaveDetailsMaster,
  addLeaveDetailMaster,
  getLeaveEncashmentMaster,
  getLeaveRulesMaster,
  addLeaveEncashmentMaster,
  addLeaveRulesMaster
} from "../model/leave";
import { debugLog } from "../../utils/logging";
export default ({ config, db }) => {
  let api = Router();
  //code

  // created by irfan :
  api.get(
    "/getEmployeeLeaveData",
    getEmployeeLeaveData,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
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
      next();
    },
    releaseConnection
  );
  // created by irfan :
  api.get(
    "/getYearlyLeaveData",
    getYearlyLeaveData,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
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
      next();
    },
    releaseConnection
  );

  // created by irfan :
  api.post(
    "/applyEmployeeLeave",
    applyEmployeeLeave,
    (req, res, next) => {
      let result = req.records;

      if (result.leave_already_exist == true) {
        debugLog("erooooo");
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });
      } else {
        debugLog("Suuuuuuuuccc");
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }

      next();
    },
    releaseConnection
  );

  // created by irfan
  api.get(
    "/getEmployeeLeaveHistory",
    getEmployeeLeaveHistory,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
        res.status(httpStatus.ok).json({
          success: false,
          records: "please provide valid input"
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }
      next();
    }
  );

  // created by irfan
  api.post("/getLeaveBalance", getLeaveBalance, (req, res, next) => {
    let result = req.records;
    if (result.leave_already_exist == true) {
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
    next();
  });

  // created by irfan :
  api.get("/getLeaveLevels", getLeaveLevels, (req, res, next) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result
    });
    next();
  });

  // created by irfan :
  api.post(
    "/addLeaveMaster",
    addLeaveMaster,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_data == true) {
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
      next();
    },
    releaseConnection
  );

  // created by irfan :
  api.post(
    "/addAttendanceRegularization",
    addAttendanceRegularization,
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

  // created by irfan
  api.get("/getEmployeeAttendReg", getEmployeeAttendReg, (req, res, next) => {
    let result = req.records;
    if (result.invalid_input == true) {
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
    next();
  });

  // created by irfan
  api.get("/processYearlyLeave", processYearlyLeave, (req, res, next) => {
    let result = req.records;
    if (result.invalid_input == true || result.already_processed == true) {
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
    next();
  });

  // created by irfan :
  api.post(
    "/markAbsent",
    markAbsent,
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

  // created by irfan
  api.put("/cancelAbsent", cancelAbsent, (req, res, next) => {
    let result = req.records;
    if (result.invalid_input == true) {
      res.status(httpStatus.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by irfan
  api.get("/getAllAbsentEmployee", getAllAbsentEmployee, (req, res, next) => {
    let result = req.records;
    if (result.invalid_input == true) {
      res.status(httpStatus.ok).json({
        success: false,
        records: "please provide valid input"
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by irfan
  api.put("/authorizeLeave", authorizeLeave, (req, res, next) => {
    let result = req.records;
    if (result.invalid_input == true) {
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
    next();
  });

  // created by irfan
  api.get("/getLeaveApllication", getLeaveApllication, (req, res, next) => {
    let result = req.records;
    if (result.invalid_input == true) {
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
    next();
  });

  // created by irfan
  api.put("/updateLeaveMaster", updateLeaveMaster, (req, res, next) => {
    let result = req.records;
    if (result.invalid_input == true) {
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
    next();
  });

  // created by irfan :
  api.get(
    "/calculateLeaveDays",
    calculateLeaveDays,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
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
      next();
    },
    releaseConnection
  );

  // created by Adnan
  api.get("/getLeaveDetailsMaster", getLeaveDetailsMaster, (req, res, next) => {
    let result = req.records;
    if (result.invalid_input == true) {
      res.status(httpStatus.ok).json({
        success: false,
        records: "Please provide the Leave ID to get the details"
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  // created by Adnan :
  api.post(
    "/addLeaveDetailMaster",
    addLeaveDetailMaster,
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

  // created by Adnan :
  api.post(
    "/addLeaveEncashmentMaster",
    addLeaveEncashmentMaster,
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

  // created by Adnan :
  api.post(
    "/addLeaveRulesMaster",
    addLeaveRulesMaster,
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

  // created by Adnan
  api.get(
    "/getLeaveEncashmentMaster",
    getLeaveEncashmentMaster,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
        res.status(httpStatus.ok).json({
          success: false,
          records: "Please provide the Leave ID to get the details"
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
      }
      next();
    }
  );

  // created by Adnan
  api.get("/getLeaveRulesMaster", getLeaveRulesMaster, (req, res, next) => {
    let result = req.records;
    if (result.invalid_input == true) {
      res.status(httpStatus.ok).json({
        success: false,
        records: "Please provide the Leave ID to get the details"
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  return api;
};
