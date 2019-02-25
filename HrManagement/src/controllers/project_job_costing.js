import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  getDivisionProject,
  addDivisionProject,
  deleteDivisionProject,
  getEmployeesForProjectRoster,
  deleteProjectRoster
} from "../models/project_job_costing";

export default () => {
  const api = Router();
  api.get("/getDivisionProject", getDivisionProject, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addDivisionProject", addDivisionProject, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.delete(
    "/deleteDivisionProject",
    deleteDivisionProject,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.delete("/deleteProjectRoster", deleteProjectRoster, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get(
    "/getEmployeesForProjectRoster",
    getEmployeesForProjectRoster,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          records: req.records
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          records: req.records
        });
      }
    }
  );

  return api;
};
