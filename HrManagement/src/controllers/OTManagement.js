import { Router } from "express";
import utlities from "algaeh-utilities";
import OTManagement from "../models/OTManagement";

const { InsertOTManagement } = OTManagement;

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
