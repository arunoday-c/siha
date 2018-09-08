import { Router } from "express";
import { selectDiet } from "../model/dietmaster";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

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
