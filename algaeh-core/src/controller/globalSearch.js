import { Router } from "express";
import searchModels from "../model/globalSearch";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";

const { releaseConnection } = utils;
const { searchData, newSearch } = searchModels;

export default () => {
  let api = Router();
  api.get(
    "/get",
    searchData,
    (req, res) => {
      let result={};
      if (req.records !== undefined) {
        // result = new Object();
        result["totalPages"] = req.records[1][0].total_pages;
        result["data"] = req.records[0];
      }

      res.status(httpStatus.ok).json({
        success: true,
        records: result
      }).end();

    }
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
