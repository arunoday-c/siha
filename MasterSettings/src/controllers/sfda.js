import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import { getSFDA } from "../models/sfda";

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.get("/getSFDA", getSFDA, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  return api;
};
