import { Router } from "express";
import {
  addBranchMaster,
  getBranchMaster,
  getActiveBranches,
  updateBranchMaster
} from "../models/branchMaster";
import algaehUtlities from "algaeh-utilities/utilities";
export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post("/addBranchMaster", addBranchMaster, (req, res, next) => {
    let result = req.records;

    if (result.invalid_data == true) {
      res.status(utlities.httpStatus().ok).json({
        success: false,
        records: result
      });
    } else {
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
    }

    next();
  });
  api.get("/getBranchMaster", getBranchMaster, (req, res, next) => {
    let result = req.records;

    if (result.invalid_data == true) {
      res.status(utlities.httpStatus().ok).json({
        success: false,
        records: result
      });
    } else {
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
    }

    next();
  });
  api.get("/getActiveBranches", getActiveBranches, (req, res, next) => {
    let result = req.records;

    if (result.invalid_data == true) {
      res.status(utlities.httpStatus().ok).json({
        success: false,
        records: result
      });
    } else {
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
    }

    next();
  });
  api.put("/updateBranchMaster", updateBranchMaster, (req, res, next) => {
    let result = req.records;

    if (result.invalid_data == true) {
      res.status(utlities.httpStatus().ok).json({
        success: false,
        records: result
      });
    } else {
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
    }

    next();
  });

  return api;
};
