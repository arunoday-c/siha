import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import {
  addInsuranceCardClass,
  getInsuranceCardClass,
  updateInsuranceCardClass,
  deleteInsuranceCardClass
} from "../models/InsuranceCardClass";

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post(
    "/addInsuranceCardClass",
    addInsuranceCardClass,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.put(
    "/updateInsuranceCardClass",
    updateInsuranceCardClass,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.get("/getInsuranceCardClass", getInsuranceCardClass, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.delete(
    "/deleteInsuranceCardClass",
    deleteInsuranceCardClass,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  return api;
};
