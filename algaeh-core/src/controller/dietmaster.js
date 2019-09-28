import { Router } from "express";
import dietModels from "../model/dietmaster";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";

const { releaseConnection } = utils;
const { selectDiet } = dietModels;

export default ({ config, db }) => {
  let api = Router();

  api.get(
    "/selectDiet",
    selectDiet,
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
