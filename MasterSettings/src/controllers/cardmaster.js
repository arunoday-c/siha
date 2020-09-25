import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import {
  getCards,
  addCard,
  updateCard,
  deleteCard,
} from "../models/cardmaster";

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.get("/getCards", getCards, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.post("/addCard", addCard, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.put("/updateCard", updateCard, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.delete("/deleteCard", deleteCard, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  return api;
};
