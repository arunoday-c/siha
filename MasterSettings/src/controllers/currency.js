import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import {
  addCurrencyMaster,
  getCurrencyMaster,
  deleteCurrencyMaster,
  updateCurrencyMaster
} from "../models/currency";

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post("/addCurrencyMaster", addCurrencyMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.put("/updateCurrencyMaster", updateCurrencyMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/getCurrencyMaster", getCurrencyMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.delete(
    "/deleteCurrencyMaster",
    deleteCurrencyMaster,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  return api;
};
