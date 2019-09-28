import { Router } from "express";

import utils from "../utils";
import visitModels from "../model/visit";
import httpStatus from "../utils/httpStatus";

const {
  addVisit, //Done
  checkVisitExists, //Done
  closeVisit //Done
} = visitModels;
const { releaseConnection } = utils;

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

  api.get(
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

  api.post(
    "/closeVisit",
    closeVisit,
    (req, res, next) => {
      let results = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: results
      });
      next();
    },
    releaseConnection
  );

  return api;
};
