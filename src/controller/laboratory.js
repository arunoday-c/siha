import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import { getLabOrderedServices } from "../model/laboratory";

export default ({ config, db }) => {
  let api = Router();

  api.get(
    "/getLabOrderedServices",
    getLabOrderedServices,
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
