import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  getEmployeeGroups,
  addEmployeeGroups,
  updateEmployeeGroup,
  getDesignations,
  addDesignation,
  updateDesignation,
  getOvertimeGroups,
  addOvertimeGroups,
  updateOvertimeGroups
} from "../models/hrsettings";
export default () => {
  const api = Router();
  api.get("/getEmployeeGroups", getEmployeeGroups, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addEmployeeGroups", addEmployeeGroups, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.put("/updateEmployeeGroup", updateEmployeeGroup, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.get("/getDesignations", getDesignations, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addDesignation", addDesignation, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.put("/updateDesignation", updateDesignation, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.get("/getOvertimeGroups", getOvertimeGroups, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addOvertimeGroups", addOvertimeGroups, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.put("/updateOvertimeGroups", updateOvertimeGroups, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  return api;
};
