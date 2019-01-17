import { Router } from "express";
import utlities from "algaeh-utilities";
import { endOfService } from "../models/end_of_service";
export default () => {
  const api = Router();
  api.get("/", endOfService, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });
  return api;
};
