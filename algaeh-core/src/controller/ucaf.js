import { Router } from "express";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import ucafModels from "../model/ucaf";

const { getPatientUCAF, updateUcafDetails } = ucafModels;

export default ({ config, db }) => {
  let api = Router();

  //created by irfan :to  getPatientUCAF
  api.get("/getPatientUCAF", getPatientUCAF, (req, res, next) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result
    });
  });

  api.put("/updateUcafDetails", updateUcafDetails, (req, res, next) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result
    });
  });

  return api;
};
