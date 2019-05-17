import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import { getPatientUCAF, updateUcafDetails } from "../model/ucaf";

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
    }    
  );

  api.put(
    "/updateUcafDetails",
    updateUcafDetails,
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
