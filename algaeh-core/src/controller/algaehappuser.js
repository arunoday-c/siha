import { Router } from "express";
import userModel from "../model/algaehappuser";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";

const { releaseConnection } = utils;
const {
  selectAppUsers,
  selectLoginUser,
  selectAppGroup,
  selectRoles,
  createUserLogin,
  getLoginUserMaster,
  getLoginUserMasterGrid,
  changePassword,
  updateUser,
  verifyEmployeeEmailID,
  verifyUserNameExists,
} = userModel;

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
          records: result,
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
        records: result,
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
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
        records: result,
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
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
          records: result,
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result,
        });
      }

      next();
    },
    releaseConnection
  );

  // created by irfan :
  api.post("/createUserLogin", createUserLogin, (req, res, next) => {
    let result = req.records;
    if (result.validUser == false) {
      res.status(httpStatus.ok).json({
        success: false,
        records: result,
      });
    } else {
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
    }
    next();
  });

  // created by irfan :
  api.get(
    "/getLoginUserMaster",
    getLoginUserMaster,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
      });
      next();
    },
    releaseConnection
  );
  api.get(
    "/getLoginUserMasterGrid",
    getLoginUserMasterGrid,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result,
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
          records: result,
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result,
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
          records: result,
        });
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result,
        });
      }
      next();
    },
    releaseConnection
  );
  api.post("/verifyEmployeeEmail", verifyEmployeeEmailID, (req, res) => {
    res.status(httpStatus.ok).json({
      success: true,
      message: `Successfully verified and updated email to employee.`,
    });
  });
  api.get("/verifyUserNameExists", verifyUserNameExists, (req, res) => {
    const exists = req.records;
    res.status(httpStatus.ok).json({
      success: exists,
      message:
        exists === true
          ? `User id is already exists please use another id`
          : "",
    });
  });

  return api;
};
