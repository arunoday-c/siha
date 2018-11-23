import { Router } from "express";
import { selectAppUsers ,selectLoginUser} from "../model/algaehappuser";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

export default ({ config, db }) => {
  let api = Router();

  api.get(
    "/selectAppUsers",
    selectAppUsers,
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



   // created by irfan :
   api.get(
    "/selectLoginUser",
    selectLoginUser,
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
