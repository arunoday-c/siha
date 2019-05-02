import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import {
  addDepartment,
  updateDepartment,
  selectDepartment,
  selectSubDepartment,
  addSubDepartment,
  updateSubDepartment
} from "../models/department";

import algaehPath from "algaeh-module-bridge";

const { addInventoryLocation } = algaehPath(
  "algaeh-inventory/src/models/inventory"
);

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post("/addDepartment", addDepartment, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.put("/updateDepartment", updateDepartment, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/get", selectDepartment, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/get/subdepartment", selectSubDepartment, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });
  api.post(
    "/add/subdepartment",
    addInventoryLocation,
    addSubDepartment,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );
  api.put("/updateSubDepartment", updateSubDepartment, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  return api;
};
