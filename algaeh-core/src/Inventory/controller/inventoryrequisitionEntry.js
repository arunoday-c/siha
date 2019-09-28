import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import invReqModels from "../model/inventoryrequisitionEntry";

const { releaseConnection } = utils;
const {
  addinventoryrequisitionEntry, //Done
  getinventoryrequisitionEntry, //Done
  updateinventoryrequisitionEntry, //Done
  getinventoryAuthrequisitionList //Done
} = invReqModels;

export default ({ config, db }) => {
  let api = Router();

  // created by Nowshad :to add Requisition Entry
  api.post(
    "/addinventoryrequisitionEntry",
    addinventoryrequisitionEntry,
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
    "/updateinventoryrequisitionEntry",
    updateinventoryrequisitionEntry,
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
    "/getinventoryrequisitionEntry",
    getinventoryrequisitionEntry,
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
    "/getinventoryAuthrequisitionList",
    getinventoryAuthrequisitionList,
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
