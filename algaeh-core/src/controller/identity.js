import { Router } from "express";
import utils from "../utils";
import idModels from "../model/identity";
import httpStatus from "../utils/httpStatus";

const {
  addIdentity, //Done
  updateIdentity, //Done
  selectIdentity, //Done
  deleteIdentity //Done
} = idModels;
const { releaseConnection } = utils;

export default ({ config, db }) => {
  let api = Router();

  api.delete(
    "/delete",
    deleteIdentity,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json(result);
      next();
    },
    releaseConnection
  );

  api.post(
    "/add",
    addIdentity,
    (req, res, next) => {
      let result = req.records;
      if (result.length == 0) {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      }
    },
    releaseConnection
  );
  api.put(
    "/update",
    updateIdentity,
    (req, res, next) => {
      let result = req.records;
      if (result.length == 0) {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      }
    },
    releaseConnection
  );

  api.get(
    "/get",
    selectIdentity,
    (req, res, next) => {
      let result = req.records;
      if (result.length == 0) {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      }
    },
    releaseConnection
  );

  return api;
};
