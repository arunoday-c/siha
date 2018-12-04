import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import {
  addAlgaehGroupMAster,
  addAlgaehModule,
  getRoleBaseActiveModules,
  getRoleBaseInActiveComponents,
  getAlgaehModules
} from "../model/algaehMasters";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to add
  api.post(
    "/addAlgaehGroupMAster",
    addAlgaehGroupMAster,
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
  // created by irfan :to add
  api.post(
    "/addAlgaehModule",
    addAlgaehModule,
    (req, res, next) => {
      let result = req.records;
      if (result.validUser == false) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });
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

  // created by irfan :to
  api.get(
    "/getRoleBaseActiveModules",
    getRoleBaseActiveModules,
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

  // created by irfan :to add
  api.get(
    "/getRoleBaseInActiveComponents",
    getRoleBaseInActiveComponents,
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

  // created by irfan :
  api.get(
    "/getAlgaehModules",
    getAlgaehModules,
    (req, res, next) => {
      let result = req.records;
      if (result.validUser == false) {
        res.status(httpStatus.ok).json({
          success: false,
          records: result
        });
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

  return api;
};
