import { Router } from "express";
import algaehUtilities from "algaeh-utilities/utilities";
import {
  addGlassPrescription,
  getGlassPrescription
} from "../model/opthometry";
export default () => {
  const api = Router();
  const utilities = new algaehUtilities();

  api.post("/addGlassPrescription", addGlassPrescription, (req, res, next) => {
    let result = req.records;
    res.status(utilities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });
  api.get("/getGlassPrescription", getGlassPrescription, (req, res, next) => {
    let result = req.records;
    res.status(utilities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  return api;
};
