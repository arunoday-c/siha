import { Router } from "express";
import utlities from "algaeh-utilities";
import { getLabOrderedServices } from "../models/labmasters";

export default () => {
  const api = Router();
  api.get("/getLabOrderedServices", getLabOrderedServices, (req, res, next) => {
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: req.records
    });
  });

  return api;
};
