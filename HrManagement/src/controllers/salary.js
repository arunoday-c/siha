import { Router } from "express";
import utlities from "algaeh-utilities";
import salaryModels, { getHrmsOptions } from "../models/salary";

const {
  getSalaryProcess,
  finalizedSalaryProcess,
  newProcessSalary,
  detailSalaryStatement,
  generateAccountingEntry,
} = salaryModels;

export default () => {
  const api = Router();
  api.get(
    "/processSalary",
    // processSalary,
    (req, res, next) => {
      // ;
      req.connection = null;
      delete req.connection;
      next();
    },
    newProcessSalary,
    getSalaryProcess,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          result: req.records,
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records,
        });
      }
    }
  );

  api.get("/getSalaryProcess", getSalaryProcess, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records,
    });
  });

  api.put(
    "/finalizedSalaryProcess",
    getHrmsOptions,
    finalizedSalaryProcess,
    generateAccountingEntry,
    (req, res, next) => {
      let result = "";
      if (req.flag == 1) {
        result = "Monthly Accural days not defined please check and re-process";
      } else {
        result = req.records;
      }

      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: req.flag == 1 ? false : true,
        result: result,
      });
    }
  );

  api.get("/detailSalaryStatement", detailSalaryStatement, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records,
    });
  });

  return api;
};
