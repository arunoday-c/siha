import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import serviceModels from "../models/serviceTypes";

const {
  getServiceType,
  getServices,
  getServiceInsured,
  addServices,
  updateServices,
  addProcedure,
  getProcedures,
  updateProcedures
} = serviceModels;

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post(
    "/addServices",
    (req, res, next) => {
      delete req.connection;
      next();
    },
    addServices,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.put("/updateServices", updateServices, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/", getServiceType, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/getService", getServices, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });
  api.get("/getServiceInsured", getServiceInsured, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });
  api.post("/addProcedure", addProcedure, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/getProcedures", getProcedures, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.put("/updateProcedures", updateProcedures, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  return api;
};
