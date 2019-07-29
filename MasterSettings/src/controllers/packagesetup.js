import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import {
  addPackage,
  getPackage,
  updatePackageSetup
} from "../models/packagesetup";
import { addServices, updateServicesOthrs } from "../models/serviceTypes";
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
