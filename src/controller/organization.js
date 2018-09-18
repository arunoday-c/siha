import { Router } from "express";
import { getOrganization } from "../model/organization";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

export default ({ config, db }) => {
  let api = Router();

  api.get(
    "/getOrganization",
    getOrganization,
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

  return api;
};
