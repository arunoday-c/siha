import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import { getPatientUCAF } from "../model/ucaf";

export default ({ config, db }) => {
  let api = Router();

  //created by irfan :to  getPatientUCAF
  api.get(
    "/getPatientUCAF",
    getPatientUCAF,
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
