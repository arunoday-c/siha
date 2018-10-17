import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  addrequisitionEntry,
  getrequisitionEntry,
  getAuthrequisitionList
} from "../model/requisitionEntry";

export default ({ config, db }) => {
  let api = Router();

  // created by Nowshad :to add Requisition Entry
  api.post(
    "/addrequisitionEntry",
    addrequisitionEntry,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by Nowshad :to get Pos Entry
  api.get(
    "/getrequisitionEntry",
    getrequisitionEntry,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by Nowshad :to get Authorize List of Requisition Entry
  api.get(
    "/getAuthrequisitionList",
    getAuthrequisitionList,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  return api;
};
