import { Router } from "express";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import pharmacyModels from "../model/pharmacy";
import serviceModels from "../../model/serviceTypes";

const { addServices } = serviceModels;
const { releaseConnection } = utils;
const {
  addItemMaster, //Done
  addItemCategory, //Done
  addItemGeneric, //Done
  addItemGroup, //Done
  addPharmacyUom, //Done
  addPharmacyLocation, //Done
  addItemForm, //Done
  addItemStorage, //Done
  addLocationPermission, //Done
  getPharmacyUom, //Done
  getItemMaster, //Done
  getItemCategory, //Done
  getItemGeneric, //Done
  getItemGroup, //Done
  getPharmacyLocation,
  getItemStorage, //Done
  getItemForm, //Done
  getLocationPermission, //Done
  updateItemCategory, //Done
  updateItemGroup, //Done
  updateItemGeneric, //Done
  updatePharmacyUom, //Done
  updatePharmacyLocation, //Done
  updateItemForm, //Done
  updateItemStorage, //Done
  getItemMasterAndItemUom, //Done
  updateItemMasterAndUom, //Done
  updateLocationPermission //Done
} = pharmacyModels;

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to add Item Master
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

  // created by irfan :to  add PharmacyUom
  api.post(
    "/addPharmacyUom",
    addPharmacyUom,
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

  // created by Nowshad :to  add Item Storage
  api.post(
    "/addItemStorage",
    addItemStorage,
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

  // created by Nowshad :to  add Item Form
  api.post(
    "/addItemForm",
    addItemForm,
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

  // created by irfan :to getPharmacyUom
  api.get(
    "/getPharmacyUom",
    getPharmacyUom,
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
  // created by irfan :to getItemMasterAndItemUom
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

  // created by Nowshad :to Item Storage
  api.get(
    "/getItemStorage",
    getItemStorage,
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

  // created by Nowshad :to Item Form
  api.get(
    "/getItemForm",
    getItemForm,
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

  // created by irfan :update Item Category
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

  // created by irfan :update Item Group
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

  // created by irfan :update Item Generic
  api.put(
    "/updateItemGeneric",
    updateItemGeneric,
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

  // created by irfan :update Pharmacy Uom
  api.put(
    "/updatePharmacyUom",
    updatePharmacyUom,
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

  // created by irfan :update Pharmacy Location
  api.put(
    "/updatePharmacyLocation",
    updatePharmacyLocation,
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

  // created by Nowshad :update Item Form
  api.put(
    "/updateItemForm",
    updateItemForm,
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
    "/updateItemStorage",
    updateItemStorage,
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

  // created by irfan :update Item Storage
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

  // created by irfan :update Location Permission
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
