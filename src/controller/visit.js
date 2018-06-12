import { Router } from "express";

import { releaseConnection } from "../utils";
import { addVisit } from "../model/visit";
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
  return api;
};
