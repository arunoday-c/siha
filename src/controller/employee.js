import { Router } from "express";
import { releaseConnection } from "../utils";
import {
  addEmployee,
  getEmployee,
  updateEmployee,
  getEmployeeDetails,
  getDoctorServiceCommission,
  getEmployeeCategory,
  getDoctorServiceTypeCommission,
  addEmployeeGroups,
  getEmployeeGroups,
  updateEmployeeGroup,
  deleteEmployeeGroup,
  addEarningDeduction,
  getEarningDeduction,
  updateEarningDeduction,
  deleteEarningDeduction,
  addEmployeeMaster,
  addEmployeeIdentification,
  getEmployeeIdentification,
  updateEmployeeIdentification,
  deleteEmployeeIdentification,
  addEmployeeInfo,
  addLoanMaster,
  getLoanMaster,
  updateLoanMaster,
  deleteLoanMaster
} from "../model/employee";
import httpStatus from "../utils/httpStatus";
export default ({ config, db }) => {
  let api = Router();

  api.post(
    "/addEmployee",
    addEmployee,
    (req, res, next) => {
      let resultBack = req.records;
      if (resultBack.length == 0) {
        next(httpStatus.generateError(httpStatus.notFound, "No record found"));
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: resultBack
        });
      }

      next();
    },
    releaseConnection
  );

  api.post(
    "/addEmployeeGroups",
    addEmployeeGroups,
    (req, res, next) => {
      let resultBack = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: resultBack
      });
      next();
    },
    releaseConnection
  );

  api.put(
    "/updateEmployee",
    updateEmployee,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        message: "Updated successfully",
        records: result
      });
      next();
    },
    releaseConnection
  );
  api.get(
    "/get",
    getEmployee,
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

  api.get(
    "/getEmployeeDetails",
    getEmployeeDetails,
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

  api.get(
    "/getEmployeeCategory",
    getEmployeeCategory,
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

  api.get(
    "/getDoctorServiceCommission",
    getDoctorServiceCommission,
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

  api.get(
    "/getDoctorServiceTypeCommission",
    getDoctorServiceTypeCommission,
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

  api.get(
    "/getEmployeeGroups",
    getEmployeeGroups,
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
  api.put("/updateEmployeeGroup", updateEmployeeGroup, (req, res, next) => {
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
  api.delete("/deleteEmployeeGroup", deleteEmployeeGroup, (req, res, next) => {
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

  //Start of Payroll Settings

  // created by irfan
  api.post("/addEarningDeduction", addEarningDeduction, (req, res, next) => {
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

  api.get(
    "/getEarningDeduction",
    getEarningDeduction,
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
  api.put(
    "/updateEarningDeduction",
    updateEarningDeduction,
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

  // created by irfan:
  api.delete(
    "/deleteEarningDeduction",
    deleteEarningDeduction,
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

  //Loan Master created by Adnan

  // created by Adnan
  api.post("/addLoanMaster", addLoanMaster, (req, res, next) => {
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

  // created by Adnan
  api.get(
    "/getLoanMaster",
    getLoanMaster,
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
  api.put("/updateLoanMaster", updateLoanMaster, (req, res, next) => {
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

  // created by Adnan
  api.delete("/deleteLoanMaster", deleteLoanMaster, (req, res, next) => {
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

  //Loan Master End created by Adnan
  //End of Payroll Settings

  api.post(
    "/addEmployeeMaster",
    addEmployeeMaster,
    (req, res, next) => {
      let resultBack = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: resultBack
      });
      next();
    },
    releaseConnection
  );

  api.post(
    "/addEmployeeIdentification",
    addEmployeeIdentification,
    (req, res, next) => {
      let resultBack = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: resultBack
      });
      next();
    },
    releaseConnection
  );

  // created by irfan
  api.get(
    "/getEmployeeIdentification",
    getEmployeeIdentification,
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
  api.put(
    "/updateEmployeeIdentification",
    updateEmployeeIdentification,
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
  api.delete(
    "/deleteEmployeeIdentification",
    deleteEmployeeIdentification,
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

  api.post(
    "/addEmployeeInfo",
    addEmployeeInfo,
    (req, res, next) => {
      let resultBack = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: resultBack
      });
      next();
    },
    releaseConnection
  );

  return api;
};
