import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import { getEmployeeBasicDetails } from "../model/selfService";

export default ({ config, db }) => {
  let api = Router();
  //code

  // created by irfan :
  api.get(
    "/getEmployeeBasicDetails",
    getEmployeeBasicDetails,
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
