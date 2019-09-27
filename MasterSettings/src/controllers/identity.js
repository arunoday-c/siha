import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import idModels from "../models/identity";

const {
  addIdentity,
  updateIdentity,
  selectIdentity,
  deleteIdentity
} = idModels;

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post("/add", addIdentity, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.put("/update", updateIdentity, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/get", selectIdentity, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.delete("/delete", deleteIdentity, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  return api;
};
