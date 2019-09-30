import { Router } from "express";
import utlities from "algaeh-utilities";
import empPaymentModels from "../models/employee_payments";

const {
  getLoanTopayment,
  getAdvanceTopayment,
  InsertEmployeePayment,
  getEmployeePayments,
  getEncashLeavesTopayment,
  CancelEmployeePayment,
  getGratuityTopayment,
  getFinalSettleTopayment,
  getLeaveSettleTopayment,
  getEmployeeLeaveSalary,
  updateEmployeeLeaveSalary
} = empPaymentModels;

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

  api.get("/getGratuityTopayment", getGratuityTopayment, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });

  api.get(
    "/getFinalSettleTopayment",
    getFinalSettleTopayment,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  );

  api.get(
    "/getLeaveSettleTopayment",
    getLeaveSettleTopayment,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  );

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

  api.get(
    "/getEmployeeLeaveSalary",
    getEmployeeLeaveSalary,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        records: req.records
      });
    }
  );

  api.put(
    "/updateEmployeeLeaveSalary",
    updateEmployeeLeaveSalary,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  );

  return api;
};
