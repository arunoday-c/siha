import { Router } from "express";
import {
  selectAppUsers,
  selectLoginUser,
  selectAppGroup,
  selectRoles,
  createUserLogin,
  getLoginUserMaster,
  changePassword,
  updateUser
} from "../model/algaehappuser";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

export default ({ config, db }) => {
  let api = Router();

  api.get(
    "/selectAppUsers",
    selectAppUsers,
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

  // created by irfan :
  api.get("/selectLoginUser", selectLoginUser, (req, res, next) => {
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
  });

  // created by irfan :
  api.get("/selectAppGroup", selectAppGroup, (req, res, next) => {
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
  });

  // created by irfan :
  api.get(
    "/selectRoles",
    selectRoles,
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

  // created by irfan :
  api.post(
    "/createUserLogin",
    createUserLogin,
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

  // created by irfan :
  api.get(
    "/getLoginUserMaster",
    getLoginUserMaster,
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
  api.put(
    "/changePassword",
    changePassword,
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
  // created by irfan :
  api.put(
    "/updateUser",
    updateUser,
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
