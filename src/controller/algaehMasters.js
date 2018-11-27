import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import { addEmployeeSpecialityMaster } from "../model/algaehMasters";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to add
  api.post(
    "/addEmployeeSpecialityMaster",
    addEmployeeSpecialityMaster,
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
