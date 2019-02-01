import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  getLoanMaster,
  addLoanMaster,
  updateLoanMaster,
  getAllHolidays,
  addHoliday,
  addWeekOffs,
  deleteHoliday
} from "../models/payrollsettings";
export default () => {
  const api = Router();
  api.get("/getLoanMaster", getLoanMaster, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
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
      result: req.records
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

  return api;
};
