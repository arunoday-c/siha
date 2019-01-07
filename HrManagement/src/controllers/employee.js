import { Router } from "express";
import utlities from "algaeh-utilities";
import { addMisEarnDedcToEmployee } from "../models/employee";
export default () => {
  const api = Router();
  api.post(
    "/addMisEarnDedcToEmployee",
    addMisEarnDedcToEmployee,
    (req, res, next) => {
      res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
        success: true,
        result: req.records
      });
    }
  );
  return api;
};
