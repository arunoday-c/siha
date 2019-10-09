import { Router } from "express";
import utlities from "algaeh-utilities";
import openingBalanceUpload from "../models/openingBalanceUpload";

const {
  uploadEmployeeGratuity,
  uploadEmployeeLeaveSalary
} = openingBalanceUpload;

export default () => {
  const api = Router();

  api.post(
    "/uploadEmployeeGratuity",
    uploadEmployeeGratuity,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          result: req.records
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records
        });
      }
    }
  );
  api.post(
    "/uploadEmployeeLeaveSalary",
    uploadEmployeeLeaveSalary,
    (req, res, next) => {
      if (req.records.invalid_input == true) {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: false,
          result: req.records
        });
      } else {
        res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
          success: true,
          result: req.records
        });
      }
    }
  );
  return api;
};
