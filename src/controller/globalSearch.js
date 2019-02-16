import { Router } from "express";
import { searchData, newSearch } from "../model/globalSearch";
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
        result = new Object();
        result["totalPages"] = req.records[1][0].total_pages;
        result["data"] = req.records[0];
      }
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );
  api.post(
    "/newSearch",
    newSearch,
    (req, res, next) => {
      res.status(httpStatus.ok).json({
        success: true,
        records: {
          totalPages: req.records[1][0].total_pages,
          data: req.records[0].map((item, index) => {
            return {
              title: String(index),
              ...item
            };
          })
        }
      });
      next();
    },
    releaseConnection
  );
  return api;
};
