import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import invModels from "../model/inventory";
import serviceModels from "../../model/serviceTypes";

const { addServices } = serviceModels;
const { releaseConnection } = utils;
const {
  addItemMaster, //Done
  addItemCategory, //Done
  addItemGroup, //Done
  addInventoryUom, //Done
  addInventoryLocation, //Done
  addLocationPermission, //Done
  getItemMaster, //Done
  getItemCategory, //Done
  getItemGroup, //Done
  getInventoryUom, //Done
  getInventoryLocation, //Done
  getLocationPermission, //Done
  updateItemCategory, //Done
  updateItemGroup, //Done
  updateInventoryUom, //Done
  updateInventoryLocation, //Done
  getItemMasterAndItemUom, //Done
  updateItemMasterAndUom, //Done
  updateLocationPermission //Done
} = invModels;

export default ({ config, db }) => {
  let api = Router();

  // created by Nowshad :to add Item Master
  api.post(
    "/addItemMaster",
    addServices,
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
  // created by Nowshad :to add Item Category
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

  // created by Nowshad :to  addItemGroup
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

  // created by Nowshad :to  add PharmacyUom
  api.post(
    "/addInventoryUom",
    addInventoryUom,
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

  // created by Nowshad :to  add Pharmacy Location
  api.post(
    "/addInventoryLocation",
    addInventoryLocation,
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

  // created by Nowshad :to  add Location Permission
  api.post(
    "/addLocationPermission",
    addLocationPermission,
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

  // created by Nowshad :to getItemMaster
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

  // created by Nowshad :to getItemCategory
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

  // created by Nowshad :to  getItemGroup
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

  // created by Nowshad :to getPharmacyUom
  api.get(
    "/getInventoryUom",
    getInventoryUom,
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
  // created by Nowshad :to getItemMasterAndItemUom
  api.get(
    "/getItemMasterAndItemUom",
    getItemMasterAndItemUom,
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

  // created by Nowshad :to get Inventory Location
  getInventoryUom;
  api.get(
    "/getInventoryLocation",
    getInventoryLocation,
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

  // created by Nowshad :to get Location Permission
  api.get(
    "/getLocationPermission",
    getLocationPermission,
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

  // created by Nowshad :update Item Category
  api.put(
    "/updateItemCategory",
    updateItemCategory,
    (req, res, next) => {
      let results = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: results
      });
      next();
    },
    releaseConnection
  );

  // created by Nowshad :update Item Group
  api.put(
    "/updateItemGroup",
    updateItemGroup,
    (req, res, next) => {
      let results = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: results
      });
      next();
    },
    releaseConnection
  );

  // created by Nowshad :update Inventory Uom
  api.put(
    "/updateInventoryUom",
    updateInventoryUom,
    (req, res, next) => {
      let results = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: results
      });
      next();
    },
    releaseConnection
  );

  // created by Nowshad :update Inventory Location
  api.put(
    "/updateInventoryLocation",
    updateInventoryLocation,
    (req, res, next) => {
      let results = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: results
      });
      next();
    },
    releaseConnection
  );

  // created by Nowshad :update Item Storage
  api.put(
    "/updateItemMasterAndUom",
    updateItemMasterAndUom,
    (req, res, next) => {
      let results = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: results
      });
      next();
    },
    releaseConnection
  );

  // created by Nowshad :update Location Permission
  api.put(
    "/updateLocationPermission",
    updateLocationPermission,
    (req, res, next) => {
      let results = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: results
      });
      next();
    },
    releaseConnection
  );

  return api;
};
