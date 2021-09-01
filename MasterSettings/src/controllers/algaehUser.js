import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import algaehUserModals from "../models/algaehUser";

const { getLoginUserMasterGrid } = algaehUserModals;

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.get(
    "/getLoginUserMasterGrid",
    getLoginUserMasterGrid,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );

  return api;
};
