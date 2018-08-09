import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";

import {
  insertOrderedServices,
  getPreAprovalList
} from "../model/orderAndPreApproval";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan: to  insertOrderedServices
  api.post(
    "/insertOrderedServices",
    insertOrderedServices,
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

  // created by irfan : to fetch pre approval list
  api.get(
    "/getPreAprovalList",
    getPreAprovalList,
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
