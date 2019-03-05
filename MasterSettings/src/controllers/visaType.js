import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import {
  getVisaMaster,
  updateVisa,
  addVisa,
  deleteVisa
} from "../models/visaType";

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post("/addVisa", addVisa, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.put("/updateVisa", updateVisa, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/getVisaMaster", getVisaMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.delete("/deleteVisa", deleteVisa, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  return api;
};
