import { Router } from "express";
import httpStatus from "../utils/httpStatus";

import dcaf from "../model/dcaf";

const { getPatientDCAF, updateDcafDetails } = dcaf;

export default ({ config, db }) => {
  let api = Router();

  //created by nowshad :to  getPatientDCAF
  api.get("/getPatientDCAF", getPatientDCAF, (req, res, next) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result
    });
  });

  api.put("/updateDcafDetails", updateDcafDetails, (req, res, next) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result
    });
  });

  return api;
};
