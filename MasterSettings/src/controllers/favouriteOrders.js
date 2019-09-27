import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import favModels from "../models/favouriteOrders";

const {
  addFavouriteOrder,
  getFavouriteOrder,
  updateFavouriteOrder,
  addFavouriteServices,
  getFavouriteServices
} = favModels;

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post("/addFavouriteOrder", addFavouriteOrder, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/getFavouriteOrder", getFavouriteOrder, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.put("/updateFavouriteOrder", updateFavouriteOrder, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.post("/addFavouriteServices", addFavouriteServices, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/getFavouriteServices", getFavouriteServices, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  return api;
};
