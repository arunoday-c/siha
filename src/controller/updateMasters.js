import {
  insertToAppgen,
  updateToAppgen,
  updateVisa,
  addVisa,
  deleteVisa
} from "../model/mastersUpdate";
import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
export default () => {
  let api = Router();

  api.delete(
    "/delete/visa",
    deleteVisa,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json(result);
      next();
    },
    releaseConnection
  );

  api.post(
    "/autogen",
    insertToAppgen,
    (req, res, next) => {
      let result = req.records;
      if (result == null) {
        next(
          httpStatus.generateError(httpStatus.notModified, "no record updated")
        );
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
    "/update/autogen",
    updateToAppgen,
    (req, res, next) => {
      let result = req.records;
      if (result == null) {
        next(
          httpStatus.generateError(httpStatus.notModified, "no record updated")
        );
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
  api.post(
    "/add/visa",
    addVisa,
    (req, res, next) => {
      let result = req.records;
      if (result.length != 0) {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      } else {
        next(
          httpStatus.generateError(httpStatus.notModified, "no record updated")
        );
      }
    },
    releaseConnection
  );

  api.put(
    "/update/visa",
    updateVisa,
    (req, res, next) => {
      let result = req.records;
      if (result.length != 0) {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      } else {
        next(
          httpStatus.generateError(httpStatus.notModified, "no record updated")
        );
      }
    },
    releaseConnection
  );

  return api;
};
