import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import reqModels from "../model/requisitionEntry";

const { releaseConnection } = utils;
const {
  addrequisitionEntry, //Done
  getrequisitionEntry, //Done
  updaterequisitionEntry, //Done
  getAuthrequisitionList //Done
} = reqModels;

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

  // created by Nowshad :update Item Storage and POS
  api.put(
    "/updaterequisitionEntry",
    updaterequisitionEntry,
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
