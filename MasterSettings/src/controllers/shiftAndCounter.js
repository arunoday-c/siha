import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import shiftModels from "../models/shiftAndCounter";

const {
  addShiftMaster,
  addCounterMaster,
  getCounterMaster,
  getShiftMaster,
  updateShiftMaster,
  updateCounterMaster,
  getCashiers,
  addCashierToShift,
  getCashiersAndShiftMAP,
  updateCashiersAndShiftMAP,
  deleteCashiersAndShiftMAP
} = shiftModels;

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post("/addShiftMaster", addShiftMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.post("/addCounterMaster", addCounterMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/getCounterMaster", getCounterMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/getShiftMaster", getShiftMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.put("/updateCounterMaster", updateCounterMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.put("/updateShiftMaster", updateShiftMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/getCashiers", getCashiers, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.post("/addCashierToShift", addCashierToShift, (req, res, next) => {
    let result = req.records;

    if (result.invalid_input == true) {
      res.status(utlities.httpStatus().ok).json({
        success: false,
        records: result
      });
    } else {
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
    }

    next();
  });

  api.get(
    "/getCashiersAndShiftMAP",
    getCashiersAndShiftMAP,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.put(
    "/updateCashiersAndShiftMAP",
    updateCashiersAndShiftMAP,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.delete(
    "/deleteCashiersAndShiftMAP",
    deleteCashiersAndShiftMAP,
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
