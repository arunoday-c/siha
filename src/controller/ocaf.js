import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import { getPatientOCAF, updateOcafDetails } from "../model/ocaf";

export default ({ config, db }) => {
  let api = Router();

  //created by nowshad :to  getPatientOCAF
  api.get(
    "/getPatientOCAF",
    getPatientOCAF,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
    }
  );

  api.put(
    "/updateOcafDetails",
    updateOcafDetails,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
    }
  );

  return api;
};
