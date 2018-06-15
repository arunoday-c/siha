import { Router } from "express";

import { releaseConnection } from "../utils";
import { addVisit, checkVisitExists } from "../model/visit";
import httpStatus from "../utils/httpStatus";
export default ({ config, db }) => {
  let api = Router();
  api.post(
    "/addVisit",
    addVisit,
    (req, res, next) => {
      res.status(httpStatus.ok).json({
        success: true,
        records: req.records
      });
      next();
    },
    releaseConnection
  );

  api.post(
    "/checkVisitExists",
    checkVisitExists,
    (req, res, next) => {
      res.status(httpStatus.ok).json({
        success: req.records.length == 0 ? true : false,
        message:
          req.records.length != 0 ? "Visit already exists for same doctor" : ""
      });
      next();
    },
    releaseConnection
  );

  return api;
};
