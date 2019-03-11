import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";

import {
  addEmployeeSpecialityMaster, //Done
  getEmployeeSpecialityMaster, //Done
  addEmployeeCategoryMaster, //Done
  getEmployeeCategoryMaster, //Done
  deleteEmployeeCategoryMaster, //Done
  deleteEmployeeSpecialityMaster, //Done
  updateEmployeeSpecialityMaster, //Done
  updateEmployeeCategoryMaster, //Done
  makeEmployeeCategoryInActive, //Done
  addCategorySpecialityMappings, //Done
  makeEmployeeSpecialityInActive, //Done
  getCategorySpecialityMap, //Done
  updateCategorySpecialityMap, //Done
  deleteCategorySpecialityMap, //Done
  makeCategorySpecialityMapInActive //Done
} from "../model/specialityAndCategory";

export default ({ config, db }) => {
  let api = Router();

  // created by irfan :to add
  api.post(
    "/addEmployeeSpecialityMaster",
    addEmployeeSpecialityMaster,
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

  // created by irfan :to get
  api.get(
    "/getEmployeeSpecialityMaster",
    getEmployeeSpecialityMaster,
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

  // created by irfan :to get
  api.post(
    "/addEmployeeCategoryMaster",
    addEmployeeCategoryMaster,
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

  // created by irfan :to get
  api.get(
    "/getEmployeeCategoryMaster",
    getEmployeeCategoryMaster,
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
  // created by irfan :to get
  api.delete(
    "/deleteEmployeeSpecialityMaster",
    deleteEmployeeSpecialityMaster,
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

  // created by irfan :to get
  api.delete(
    "/deleteEmployeeCategoryMaster",
    deleteEmployeeCategoryMaster,
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

  // created by irfan :to get
  api.put(
    "/updateEmployeeSpecialityMaster",
    updateEmployeeSpecialityMaster,
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

  // created by irfan :to
  api.put(
    "/updateEmployeeCategoryMaster",
    updateEmployeeCategoryMaster,
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

  // created by irfan :to
  api.put(
    "/makeEmployeeCategoryInActive",
    makeEmployeeCategoryInActive,
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
  // created by irfan :to
  api.put(
    "/makeEmployeeSpecialityInActive",
    makeEmployeeSpecialityInActive,
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

  // created by irfan :to Make Inactive
  api.put(
    "/makeCategorySpecialityMapInActive",
    makeCategorySpecialityMapInActive,
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

  // created by irfan :to get
  api.post(
    "/addCategorySpecialityMappings",
    addCategorySpecialityMappings,
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

  // created by irfan :to get
  api.get(
    "/getCategorySpecialityMap",
    getCategorySpecialityMap,
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

  // created by irfan :to get
  api.put(
    "/updateCategorySpecialityMap",
    updateCategorySpecialityMap,
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

  // // created by irfan :to get
  api.delete(
    "/deleteCategorySpecialityMap",
    deleteCategorySpecialityMap,
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
