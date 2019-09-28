import { Router } from "express";
import algaehUtilities from "algaeh-utilities/utilities";
import dentalModels from "../model/dentalForm";

const { addDentalForm, getDentalLab } = dentalModels;

export default () => {
  const api = Router();
  const utilities = new algaehUtilities();

  api.post("/addDentalForm", addDentalForm, (req, res, next) => {
    let result = req.records;
    res.status(utilities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });
  api.get("/getDentalLab", getDentalLab, (req, res, next) => {
    let result = req.records;
    res.status(utilities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  return api;
};
