import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import {
  addVendorMaster,
  getVendorMaster,
  updateVendorMaster,
  deleteVendorMaster
} from "../models/vendor";

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post("/addVendorMaster", addVendorMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.put("/updateVendorMaster", updateVendorMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/getVendorMaster", getVendorMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.delete("/deleteVendorMaster", deleteVendorMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  return api;
};
