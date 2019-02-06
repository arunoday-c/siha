import { Router } from "express";
import utlities from "algaeh-utilities";
import { addDepartment } from "../models/department";

export default () => {
  let api = Router();

  api.post("/addDepartment", addDepartment, (req, res, next) => {
    let result = req.records;
    res.status(utlities.AlgaehUtilities().httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  return api;
};
