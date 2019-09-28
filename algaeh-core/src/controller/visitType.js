import { Router } from "express";
import utils from "../utils";
import visitModels from "../model/visitType";
import httpStatus from "../utils/httpStatus";

const {
  selectStatement, //Done
  addVisit, //Done
  updateVisit, //Done
  deleteVisitType //Done
} = visitModels;
const { releaseConnection } = utils;

export default ({ config, db }) => {
  let api = Router();

  api.delete(
    "/delete",
    deleteVisitType,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json(result);
      next();
    },
    releaseConnection
  );

  api.get(
    "/get",
    selectStatement,
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
    "/add",
    addVisit,
    (req, res, next) => {
      let result = req.records;
      if (result.length != 0) {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      } else {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      }
    },
    releaseConnection
  );
  api.put(
    "/update",
    updateVisit,
    (req, res, next) => {
      let result = req.records;
      if (result.length != 0) {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      } else {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      }
    },
    releaseConnection
  );
  return api;
};
