import { Router } from "express";
import httpStatus from "../utils/httpStatus";
import ocafModels from "../model/ocaf";

const { getPatientOCAF, updateOcafDetails } = ocafModels;

export default ({ config, db }) => {
  let api = Router();

  //created by nowshad :to  getPatientOCAF
  api.get("/getPatientOCAF", getPatientOCAF, (req, res, next) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result
    });
  });

  api.put("/updateOcafDetails", updateOcafDetails, (req, res, next) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result
    });
  });

  return api;
};
