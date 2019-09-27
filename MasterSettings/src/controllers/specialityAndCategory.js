import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import specialModels from "../models/specialityAndCategory";

const {
  addEmployeeSpecialityMaster,
  getEmployeeSpecialityMaster,
  addEmployeeCategoryMaster,
  getEmployeeCategoryMaster,
  deleteEmployeeCategoryMaster,
  deleteEmployeeSpecialityMaster,
  updateEmployeeSpecialityMaster,
  updateEmployeeCategoryMaster,
  makeEmployeeCategoryInActive,
  addCategorySpecialityMappings,
  makeEmployeeSpecialityInActive,
  getCategorySpecialityMap,
  updateCategorySpecialityMap,
  deleteCategorySpecialityMap,
  makeCategorySpecialityMapInActive //Not In use
} = specialModels;

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post(
    "/addEmployeeSpecialityMaster",
    addEmployeeSpecialityMaster,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.get(
    "/getEmployeeSpecialityMaster",
    getEmployeeSpecialityMaster,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.post(
    "/addEmployeeCategoryMaster",
    addEmployeeCategoryMaster,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.get(
    "/getEmployeeCategoryMaster",
    getEmployeeCategoryMaster,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.delete(
    "/deleteEmployeeCategoryMaster",
    deleteEmployeeCategoryMaster,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.delete(
    "/deleteEmployeeSpecialityMaster",
    deleteEmployeeSpecialityMaster,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.put(
    "/updateEmployeeSpecialityMaster",
    updateEmployeeSpecialityMaster,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.put(
    "/updateEmployeeCategoryMaster",
    updateEmployeeCategoryMaster,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.put(
    "/makeEmployeeCategoryInActive",
    makeEmployeeCategoryInActive,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.put(
    "/makeEmployeeSpecialityInActive",
    makeEmployeeSpecialityInActive,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.put(
    "/makeCategorySpecialityMapInActive",
    makeCategorySpecialityMapInActive,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.post(
    "/addCategorySpecialityMappings",
    addCategorySpecialityMappings,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.get(
    "/getCategorySpecialityMap",
    getCategorySpecialityMap,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.put(
    "/updateCategorySpecialityMap",
    updateCategorySpecialityMap,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  api.delete(
    "/deleteCategorySpecialityMap",
    deleteCategorySpecialityMap,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );

  return api;
};
