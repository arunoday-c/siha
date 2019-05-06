import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import { getPatientDCAF } from "../model/dcaf";

export default ({ config, db }) => {
  let api = Router();

  //created by irfan :to  getPatientUCAF
  api.get(
    "/getPatientDCAF",
    getPatientDCAF,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      // next();
    }
    // releaseConnection
  );

  return api;
};
