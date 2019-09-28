import { Router } from "express";
import algaehUtilities from "algaeh-utilities/utilities";
import opthoModels from "../model/opthometry";

const {
  addGlassPrescription,
  getGlassPrescription,
  updateGlassPrescription,
  deleteGlassPrescription
} = opthoModels;

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
  api.put(
    "/updateGlassPrescription",
    updateGlassPrescription,
    (req, res, next) => {
      let result = req.records;

      if (result.invalid_input == true) {
        res.status(utilities.httpStatus().ok).json({
          success: false,
          records: result
        });
      } else {
        res.status(utilities.httpStatus().ok).json({
          success: true,
          records: result
        });
      }

      next();
    }
  );

  api.delete(
    "/deleteGlassPrescription",
    deleteGlassPrescription,
    (req, res, next) => {
      let result = req.records;

      if (result.invalid_input == true) {
        res.status(utilities.httpStatus().ok).json({
          success: false,
          records: result
        });
      } else {
        res.status(utilities.httpStatus().ok).json({
          success: true,
          records: result
        });
      }

      next();
    }
  );

  return api;
};
