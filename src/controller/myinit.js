import { Router } from "express";
import { init } from "../model/myinit";
import httpStatus from "../utils/httpStatus";
export default () => {
  let api = Router();
  api.get("/", init, (req, res, next) => {
    let result = req.records;
    res.status(httpStatus.ok).json({
      success: true,
      records: result
    });
  });
  return api;
};
