import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
import { addInvestigationTest } from "../model/investigation";
export default ({ config, db }) => {
  let api = Router();

  api.post(
    "/addInvestigationTest",
    addInvestigationTest,
    (req, res, next) => {
      let result = req.records;
      if (result.length == 0) {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      } else {
        res.status(httpStatus.ok).json({
          success: true,
          records: result
        });
        next();
      }
    },
    releaseConnection
  );

  return api;
};
