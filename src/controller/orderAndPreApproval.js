import { Router } from "express";
import { releaseConnection, generateDbConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import { debugLog } from "../utils/logging";
import {
  insertOrderedServices,
  getPreAprovalList,
  updatePreApproval,
  selectOrderServices,
  updateOrderedServices,
  updateOrderedServicesBilled,
  getOrderServices,
  selectOrderServicesbyDoctor
} from "../model/orderAndPreApproval";
import { insertRadOrderedServices } from "../model/radiology";
import { insertLadOrderedServices } from "../model/laboratory";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan: to  insertOrderedServices
  api.post(
    "/insertOrderedServices",
    generateDbConnection,
    insertOrderedServices,
    insertLadOrderedServices,
    insertRadOrderedServices,
    (req, res, next) => {
      let connection = req.connection;
      connection.commit(error => {
        debugLog("error", error);
        debugLog("commit error", error);
        if (error) {
          debugLog("roll error", error);
          connection.rollback(() => {
            next(error);
          });
        } else {
          let result = req.records;
          res.status(httpStatus.ok).json({
            success: true,
            records: result
          });
          next();
        }
      });
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
  //created by irfan :to update preApproal
  api.put(
    "/updatePreApproval",
    updatePreApproval,
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

  //created by Nowshad :to get Ordered Services which to bill
  api.get(
    "/selectOrderServices",
    selectOrderServices,
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

  //created by Nowshad :to get Ordered Services which to bill
  api.get(
    "/selectOrderServicesbyDoctor",
    selectOrderServicesbyDoctor,
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

  //created by Nowshad :to get Ordered Services to Display
  api.get(
    "/getOrderServices",
    getOrderServices,
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

  //created by irfan :to update OrderedServices
  api.put(
    "/updateOrderedServices",
    updateOrderedServices,
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

  //created by Nowshad :to update OrderedServices as billed
  api.put(
    "/updateOrderedServicesBilled",
    updateOrderedServicesBilled,
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
