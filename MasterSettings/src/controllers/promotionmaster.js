import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import {
  addPromotion,
  deletePromotion,
  getPromotions,
  updatePromotion,
  getPromotionDetails,
  addPromotionDetail,
  updatePromotionDetail,
} from "../models/promotionmaster";

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.get("/getPromotions", getPromotions, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  api.get("/getPromotionDetails", getPromotionDetails, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  api.post("/addPromotion", addPromotion, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  api.post("/addPromotionDetail", addPromotionDetail, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  api.put("/updatePromotion", updatePromotion, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  api.put("/updatePromotionDetail", updatePromotionDetail, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  api.delete("/deletePromotion", deletePromotion, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  return api;
};
