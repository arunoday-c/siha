import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import { addOpBIlling } from "../model/opBilling";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan : to save opBilling
  api.post(
    "/addOpBIlling",
    addOpBIlling,
    (req, res, next) => {
      res.status(httpStatus.ok).json({
        success: true,
        records: req.body
      });
      next();
    },
    releaseConnection
  );

  /////
  return api;
};
