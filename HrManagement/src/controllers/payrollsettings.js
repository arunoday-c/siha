import { Router } from "express";
import utlities from "algaeh-utilities";
import payrollsettings from "../models/payrollsettings";

const {
  getMiscEarningDeductions,
  getLoanMaster,
  addLoanMaster,
  updateLoanMaster,
  getAllHolidays,
  addHoliday,
  addWeekOffs,
  deleteHoliday,
  getEarningDeduction,
  addEarningDeduction,
  updateEarningDeduction
} = payrollsettings;

export default () => {
  const api = Router();
  api.get(
    "/getMiscEarningDeductions",
    getMiscEarningDeductions,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.get("/getLoanMaster", getLoanMaster, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addLoanMaster", addLoanMaster, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.put("/updateLoanMaster", updateLoanMaster, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.get("/getAllHolidays", getAllHolidays, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addHoliday", addHoliday, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: req.flag == 1 ? false : true,
      result: req.records
    });
  });

  api.post("/addWeekOffs", addWeekOffs, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: req.flag == 1 ? false : true,
      result: req.records
    });
  });

  api.delete("/deleteHoliday", deleteHoliday, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: req.flag == 1 ? false : true,
      result: req.records
    });
  });

  api.get("/getEarningDeduction", getEarningDeduction, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.post("/addEarningDeduction", addEarningDeduction, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: req.flag == 1 ? false : true,
      result: req.records
    });
  });

  api.put(
    "/updateEarningDeduction",
    updateEarningDeduction,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  );

  return api;
};
