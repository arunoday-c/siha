import { Router } from "express";
import utlities from "algaeh-utilities";
import { InsertOTManagement } from "../models/OTManagement";
export default () => {
  const api = Router();
  api.post("/InsertOTManagement", InsertOTManagement, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      result: req.records
    });
  });
  return api;
};
