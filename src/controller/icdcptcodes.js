import { Router } from "express";
import { releaseConnection } from "../utils";
import {
  selectIcdcptCodes,
  insertIcdcptCodes,
  updateIcdcptCodes,
  deleteIcdcptCodes
} from "../model/icdcptcodes";
import httpStatus from "../utils/httpStatus";
export default ({ config, db }) => {
  let api = Router();

  api.delete(
    "/deleteIcdcptCodes",
    deleteIcdcptCodes,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json(result);
      next();
    },
    releaseConnection
  );

  api.get(
    "/selectIcdcptCodes",
    selectIcdcptCodes,
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
    "/insertIcdcptCodes",
    insertIcdcptCodes,
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
    "/updateIcdcptCodes",
    updateIcdcptCodes,
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
