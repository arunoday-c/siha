import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import serviceModels from "../models/serviceTypes";

const {
  getServiceType,
  getServiceTypeDropDown,
  getServices,
  getServiceInsured,
  addServices,
  updateServices,
  addProcedure,
  getProcedures,
  updateProcedures,
  updateServicesOthrs,
  applyItemProcedure,
  getProceduresDetail,
  getProceduresNew,
  releaseDB,
  serviceList,
  getOnlyServiceList,
} = serviceModels;

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post(
    "/addServices",
    (req, res, next) => {
      req.connection = null;
      delete req.connection;
      next();
    },
    addServices,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );

  api.put("/updateServices", updateServices, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  api.get("/", getServiceType, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get(
    "/getServiceTypeDropDown",
    getServiceTypeDropDown,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );

  api.get("/getService", getServices, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get("/serviceList", serviceList, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get("/getServiceInsured", getServiceInsured, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.post("/addProcedure", addProcedure, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  api.get("/getProcedures", getProcedures, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  api.get("/getProceduresNew", getProceduresNew, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get("/getOnlyServiceList", getOnlyServiceList, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  api.get("/getProceduresDetail", getProceduresDetail, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  api.put(
    "/updateProcedures",
    updateServicesOthrs,
    updateProcedures,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );
  api.post("/applyItemProcedure", applyItemProcedure, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  return api;
};
