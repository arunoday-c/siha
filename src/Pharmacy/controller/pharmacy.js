import { Router } from "express";
import { releaseConnection } from "../../utils";
import httpStatus from "../../utils/httpStatus";
import {
  addItemMaster,
  addItemCategory,
  addItemGeneric,
  addItemGroup,
  addItemUom,
  addPharmacyLocation,
  getItemMaster,
  getItemCategory,
  getItemGeneric,
  getItemGroup,
  getItemUom,
  getPharmacyLocation
} from "../model/pharmacy";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to add Item Master
  api.post(
    "/addItemMaster",
    addItemMaster,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );
  // created by irfan :to add Item Category
  api.post(
    "/addItemCategory",
    addItemCategory,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );
  // created by irfan :to add ItemGeneric
  api.post(
    "/addItemGeneric",
    addItemGeneric,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to  addItemGroup
  api.post(
    "/addItemGroup",
    addItemGroup,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to  add ItemUom
  api.post(
    "/addItemUom",
    addItemUom,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to  add Pharmacy Location
  api.post(
    "/addPharmacyLocation",
    addPharmacyLocation,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to getItemMaster
  api.get(
    "/getItemMaster",
    getItemMaster,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to getItemCategory
  api.get(
    "/getItemCategory",
    getItemCategory,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to getItemGeneric
  api.get(
    "/getItemGeneric",
    getItemGeneric,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to  getItemGroup
  api.get(
    "/getItemGroup",
    getItemGroup,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to getItemUom
  api.get(
    "/getItemUom",
    getItemUom,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  // created by irfan :to getPharmacyLocation
  api.get(
    "/getPharmacyLocation",
    getPharmacyLocation,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );
  return api;
};
