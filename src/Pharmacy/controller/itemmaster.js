import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import { getItems } from "../model/itemmaster";
export default ({ config, db }) => {
  let api = Router();

  // created by Nowshad : to get list of test based on condition
  api.get(
    "/getItems",
    getItems,
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
