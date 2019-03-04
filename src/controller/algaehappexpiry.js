import { Router } from "express";
import { addAppExxpiry, getAppExxpiry } from "../model/algaehappexpiry";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

export default ({ config, db }) => {
  let api = Router();

  api.get(
    "/getAppExxpiry",
    getAppExxpiry,
    (req, res, next) => {
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
    },
    releaseConnection
  );

  api.post(
    "/addAppExxpiry",
    addAppExxpiry,
    (req, res, next) => {
      res.status(httpStatus.ok).json({
        success: true,
        records: req.records
      });
      next();
    },
    releaseConnection
  );

  return api;
};
