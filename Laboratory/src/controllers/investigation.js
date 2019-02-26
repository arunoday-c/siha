import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  addInvestigationTest,
  getInvestigTestList,
  updateInvestigationTest
} from "../models/investigation";

export default () => {
  const api = Router();
  api.get("/getInvestigTestList", getInvestigTestList, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addInvestigationTest", addInvestigationTest, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.put(
    "/updateInvestigationTest",
    updateInvestigationTest,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  return api;
};
