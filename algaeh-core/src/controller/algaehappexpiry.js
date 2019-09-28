//Connection Done
import { Router } from "express";
import expiryModel from "../model/algaehappexpiry";
import httpStatus from "../utils/httpStatus";
const { addAppExxpiry, getAppExxpiry } = expiryModel;

export default () => {
  let api = Router();

  api.get("/getAppExxpiry", getAppExxpiry, (req, res, next) => {
    let result = req.records;
    if (result.length == 0) {
      next(httpStatus.generateError(httpStatus.notFound, "No records found"));
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
    }
    next();
  });

  api.post("/addAppExxpiry", addAppExxpiry, (req, res, next) => {
    res.status(httpStatus.ok).json({
      success: true,
      records: req.records
    });
    next();
  });

  return api;
};
