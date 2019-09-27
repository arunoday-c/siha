import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import visaModels from "../models/visitType";

const { selectStatement, addVisit, updateVisit, deleteVisitType } = visaModels;

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post("/add", addVisit, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.put("/update", updateVisit, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/get", selectStatement, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.delete("/delete", deleteVisitType, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  return api;
};
