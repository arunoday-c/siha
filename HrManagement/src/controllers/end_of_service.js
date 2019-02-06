import { Router } from "express";
import utlities from "algaeh-utilities";
import { endOfService, endOfServiceAdd } from "../models/end_of_service";
export default () => {
  const api = Router();
  api.get("/", endOfService, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });
  api.post("/save", endOfServiceAdd, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: req.flag == 1 ? false : true,
      result: req.records
    });
  });
  return api;
};
