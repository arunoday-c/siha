import { Router } from "express";
import utlities from "algaeh-utilities";
import leave from "../models/leave";

const {
  authorizeLeave,
  calculateLeaveDays,
  applyEmployeeLeave,
  getEmployeeLeaveData,
  getYearlyLeaveData,
  getEmployeeLeaveHistory,
  getLeaveLevels,
  addLeaveMaster,
  processYearlyLeave,
  getLeaveApllication,
  updateLeaveMaster,
  addLeaveDetailMaster,
  getLeaveDetailsMaster,
  deleteLeaveEncash,
  deleteLeaveRule,
  deleteLeaveDetail,
  addLeaveEncashmentMaster,
  addLeaveRulesMaster,
  getLeaveEncashmentMaster,
  getLeaveRulesMaster,
  updateLeaveDetailMaster,
  updateLeaveEncashMaster,
  updateLeaveRuleMaster,
  deleteLeaveApplication,
  cancelLeave,
  getLeaveBalances,
  updateEmployeeLeave,
  mailSendForLeave,
  sendAuthorizeLeaveRejEmail,
  sendAuthorizeLeaveEmail,
} = leave;

export default () => {
  const api = Router();
  api.put(
    "/authorizeLeave",
    authorizeLeave,
    (req, res, next) => {
      if (req.body.status === "A") {
        sendAuthorizeLeaveEmail(req, res, next);
      } else if (req.body.status === "R") {
        sendAuthorizeLeaveRejEmail(req, res, next);
      } else {
        next();
      }
    },

    (req, res, next) => {
      let statusCode = utlities.AlgaehUtilities().httpStatus().ok;

      if (req.sendingMail) {
        statusCode = 201;
      }
      if (req.records.invalid_input == true) {
        res.status(statusCode).json({
          success: false,
          records: req.records,
        });
      } else {
        res.status(statusCode).json({
          success: true,
          records: req.records,
        });
      }
    }
  );

  api.get("/calculateLeaveDays", calculateLeaveDays, (req, res, next) => {
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
  // api.get(
  //   "/sendAuthorizeLeaveRejEmail",
  //   sendAuthorizeLeaveRejEmail,
  //   (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       records: req.records,
  //     });
  //   }
  // );
  // api.get(
  //   "/sendAuthorizeLeaveEmail",
  //   sendAuthorizeLeaveEmail,
  //   (req, res, next) => {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       records: req.records,
  //     });
  //   }
  // );

  api.post("/applyEmployeeLeave", applyEmployeeLeave, (req, res, next) => {
    if (req.records.leave_already_exist == true) {
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

  api.get("/getEmployeeLeaveData", getEmployeeLeaveData, (req, res, next) => {
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
  api.get("/getYearlyLeaveData", getYearlyLeaveData, (req, res, next) => {
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
  api.get(
    "/getEmployeeLeaveHistory",
    getEmployeeLeaveHistory,
    (req, res, next) => {
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
    }
  );
  api.get("/getLeaveLevels", getLeaveLevels, (req, res, next) => {
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
  api.post("/addLeaveMaster", addLeaveMaster, (req, res, next) => {
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
  // api.get("/processYearlyLeave", processYearlyLeave, (req, res, next) => {
  //   if (
  //     req.records.invalid_input == true ||
  //     req.records.already_processed == true
  //   ) {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: false,
  //       records: req.records
  //     });
  //   } else {
  //     res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //       success: true,
  //       records: req.records
  //     });
  //   }
  // });
  api.get("/getLeaveApllication", getLeaveApllication, (req, res, next) => {
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
  api.put("/updateLeaveMaster", updateLeaveMaster, (req, res, next) => {
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
  api.get("/mailSendForLeave", mailSendForLeave, (req, res, next) => {
    let statusCode = utlities.AlgaehUtilities().httpStatus().ok;

    if (req.sendingMail) {
      statusCode = 201;
    }
    res.status(statusCode).json({
      success: true,
      records: req.records,
    });
  });
  api.get("/getLeaveDetailsMaster", getLeaveDetailsMaster, (req, res, next) => {
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
  api.post("/addLeaveDetailMaster", addLeaveDetailMaster, (req, res, next) => {
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
  api.delete("/deleteLeaveEncash", deleteLeaveEncash, (req, res, next) => {
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
  api.delete("/deleteLeaveRule", deleteLeaveRule, (req, res, next) => {
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
  api.delete("/deleteLeaveDetail", deleteLeaveDetail, (req, res, next) => {
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
  api.post(
    "/addLeaveEncashmentMaster",
    addLeaveEncashmentMaster,
    (req, res, next) => {
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
    }
  );
  api.post("/addLeaveRulesMaster", addLeaveRulesMaster, (req, res, next) => {
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

  api.get(
    "/getLeaveEncashmentMaster",
    getLeaveEncashmentMaster,
    (req, res, next) => {
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
    }
  );
  api.get("/getLeaveRulesMaster", getLeaveRulesMaster, (req, res, next) => {
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
  api.put(
    "/updateLeaveDetailMaster",
    updateLeaveDetailMaster,
    (req, res, next) => {
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
    }
  );
  api.put(
    "/updateLeaveEncashMaster",
    updateLeaveEncashMaster,
    (req, res, next) => {
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
    }
  );
  api.put("/updateLeaveRuleMaster", updateLeaveRuleMaster, (req, res, next) => {
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
  api.delete(
    "/deleteLeaveApplication",
    deleteLeaveApplication,
    (req, res, next) => {
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
    }
  );
  api.put("/cancelLeave", cancelLeave, (req, res, next) => {
    if (req.records.invalid_input == true) {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: false,
          records: req.records,
        })
        .end();
    } else {
      res
        .status(utlities.AlgaehUtilities().httpStatus().ok)
        .json({
          success: true,
          records: req.records,
        })
        .end();
    }
  });
  api.get("/getLeaveBalances", getLeaveBalances, (req, res, next) => {
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
  api.get("/processYearlyLeave", processYearlyLeave, (req, res, next) => {
    if (
      req.records.invalid_input != undefined &&
      req.records.invalid_input == true
    ) {
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

  api.put("/updateEmployeeLeave", updateEmployeeLeave, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  return api;
};
