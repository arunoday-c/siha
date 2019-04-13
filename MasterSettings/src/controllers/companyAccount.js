import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import {
  addCompanyAccount,
  getCompanyAccount,
  updateCompanyAccount,
  deleteCompanyAccount
} from "../models/companyAccount";

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post("/addCompanyAccount", addCompanyAccount, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.put("/updateCompanyAccount", updateCompanyAccount, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/getCompanyAccount", getCompanyAccount, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.delete(
    "/deleteCompanyAccount",
    deleteCompanyAccount,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  return api;
};
