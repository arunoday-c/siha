import { Router } from "express";
import utlities from "algaeh-utilities";
import { getRadOrderedServices } from "../models/radiology";

export default () => {
  const api = Router();
  api.get("/getRadOrderedServices", getRadOrderedServices, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  return api;
};
