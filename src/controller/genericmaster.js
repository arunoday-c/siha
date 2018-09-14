import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
import { getGenerics } from "../model/genericmaster";
export default ({ config, db }) => {
  let api = Router();

  // created by Nowshad : to get list of test based on condition
  api.get(
    "/getGenerics",
    getGenerics,
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
