import { Router } from "express";
import httpStatus from "../utils/httpStatus";
import { getTargetLangage } from "../model/languageTranslator";
import { releaseConnection } from "../utils/index";
export default () => {
  let api = Router();
  api.post(
    "/",
    getTargetLangage,
    (req, res, next) => {
      let result = req.records;
      if (result == null) {
        next(
          httpStatus.generateError(
            httpStatus.notFound,
            "No records translated.."
          )
        );
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
