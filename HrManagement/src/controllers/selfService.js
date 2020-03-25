import { Router } from "express";
import utlities from "algaeh-utilities";
import selfService from "../models/selfService";

const {
  getLeaveMaster,
  getEmployeeBasicDetails,
  getEmployeeDependentDetails,
  getEmployeeIdentificationDetails,
  updateEmployeeDependentDetails,
  updateEmployeeIdentificationDetails,
  updateEmployeeBasicDetails,
  addEmployeeDependentDetails,
  getEmployeeAdvance,
  addEmployeeAdvance,
  addEmployeeIdentification,
  getRejoinAnnualLeave,
  cancelAdvance
} = selfService;

export default () => {
  let api = Router();

  // created by Adnan :
  api.get("/getLeaveMaster", getLeaveMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/getRejoinAnnualLeave", getRejoinAnnualLeave, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  // created by Adnan :
  api.get(
    "/getEmployeeBasicDetails",
    getEmployeeBasicDetails,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  // created by Adnan :
  api.get(
    "/getEmployeeDependentDetails",
    getEmployeeDependentDetails,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  // created by Adnan :
  api.get(
    "/getEmployeeIdentificationDetails",
    getEmployeeIdentificationDetails,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  // created by Adnan :
  api.put(
    "/updateEmployeeIdentificationDetails",
    updateEmployeeIdentificationDetails,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          records: "please provide valid input"
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          records: result
        });
      }
      next();
    }
  );

  // created by Adnan :
  api.put(
    "/updateEmployeeDependentDetails",
    updateEmployeeDependentDetails,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          records: "please provide valid input"
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          records: result
        });
      }
      next();
    }
  );

  // created by Adnan :
  api.put(
    "/updateEmployeeBasicDetails",
    updateEmployeeBasicDetails,
    (req, res, next) => {
      let result = req.records;
      if (result.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          records: "please provide valid input"
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          records: result
        });
      }
      next();
    }
  );

  api.post(
    "/addEmployeeDependentDetails",
    addEmployeeDependentDetails,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.get("/getEmployeeAdvance", getEmployeeAdvance, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.post("/addEmployeeAdvance", addEmployeeAdvance, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });
  api.post(
    "/addEmployeeIdentification",
    addEmployeeIdentification,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );
  api.put(
    "/cancelAdvance",
    cancelAdvance,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  //TODO
  //DELETE API IN MICRO SERVICE(TASK DUE NOOR MOHSIN)

  //   api.delete(
  //     "/deleteEmployeeDependentDetails",
  //     deleteEmployeeDependentDetails,
  //     (req, res, next) => {
  //       let result = req.records;
  //       res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
  //         success: true,
  //         records: result
  //       });
  //       next();
  //     },
  //     releaseConnection
  //   );

  return api;
};
