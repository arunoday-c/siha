import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import bankModels from "../models/bankmaster";

const {
  addBank,
  getBank,
  updateBank,
  deleteBank,
  getBankCards,
  addBankCards
} = bankModels;

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post("/addBank", addBank, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.put("/updateBank", updateBank, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/getBank", getBank, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.delete("/deleteBank", deleteBank, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/getBankCards", getBankCards, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });
  api.post("/addBankCards", addBankCards, (req, res, next) => {
    let result = req.records;
    res
      .status(utlities.httpStatus().ok)
      .json({
        success: true,
        records: result
      })
      .end();
    next();
  });

  return api;
};
