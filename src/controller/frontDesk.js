import { Router } from "express";
import extend from "extend";

import { releaseConnection } from "../utils";
import {
  addFrontDesk,
  updateFrontDesk,
  selectFrontDesk
} from "../model/frontDesk";
import httpStatus from "../utils/httpStatus";
export default ({ config, db }) => {
  let api = Router();
  api.post(
    "/add",
    addFrontDesk,
    (req, res, next) => {
      res.status(httpStatus.ok).json({
        success: true,
        records: req.body
      });
      next();
    },
    releaseConnection
  );

  api.post(
    "/update",
    updateFrontDesk,
    (req, res, next) => {
      res.status(httpStatus.ok).json({
        success: true,
        records: req.body
      });
      next();
    },
    releaseConnection
  );

  api.get(
    "/get",
    selectFrontDesk,
    (req, res, next) => {
      if (req.records == null) {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: req.records
        });
        next();
      }
    },
    releaseConnection
  );

  return api;
};
