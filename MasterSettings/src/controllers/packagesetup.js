import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import packModels from "../models/packagesetup";
import serviceModels from "../models/serviceTypes";

const { addPackage, getPackage, updatePackageSetup } = packModels;

const { addServices, updateServicesOthrs } = serviceModels;

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post("/addPackage", addServices, addPackage, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/getPackage", getPackage, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.put(
    "/updatePackageSetup",
    updateServicesOthrs,
    updatePackageSetup,
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
