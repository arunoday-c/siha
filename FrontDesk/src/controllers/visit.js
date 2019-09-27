import { Router } from "express";
import utlities from "algaeh-utilities";
import visitModels from "../models/visit";
const { closeVisit, checkVisitExists, getProviders } = visitModels;

export default () => {
  const api = Router();
  api.post("/closeVisit", closeVisit, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get("/checkVisitExists", checkVisitExists, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  api.get("/getProviders", getProviders, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });
  return api;
};
