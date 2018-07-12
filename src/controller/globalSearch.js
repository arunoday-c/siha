import { Router } from "express";
import { searchData } from "../model/globalSearch";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
export default () => {
  let api = Router();
  api.get(
    "/get",
    searchData,
    (req, res, next) => {
      let result;
      if (req.records !== undefined) {
        result = {
          totalPages: req.records[1].total_pages,
          data: req.records[0]
        };
      }
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
