import { Router } from "express";
import utlities from "algaeh-utilities";
import {
  getLoanTopayment,
  getAdvanceTopayment,
  InsertEmployeePayment,
  getEmployeePayments,
  getEncashLeavesTopayment,
  CancelEmployeePayment
} from "../models/employee_payments";
export default () => {
  const api = Router();
  api.get("/getLoanTopayment", getLoanTopayment, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.get("/getAdvanceTopayment", getAdvanceTopayment, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.get("/getEmployeePayments", getEmployeePayments, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.get(
    "/getEncashLeavesTopayment",
    getEncashLeavesTopayment,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  );

  api.post(
    "/InsertEmployeePayment",
    InsertEmployeePayment,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  );

  api.put("/CancelEmployeePayment", CancelEmployeePayment, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  return api;
};
