import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import customerModels from "../models/customer";

const {
  addCustomerMaster,
  getCustomerMaster,
  updateCustomerMaster,
  getCustomerEmployees,
  addCustomerEmployee,
  updateCustomerEmployees,
  deleteCustomerEmployee,
} = customerModels;

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post("/addCustomerMaster", addCustomerMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  api.put("/updateCustomerMaster", updateCustomerMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  api.get("/getCustomerMaster", getCustomerMaster, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.get("/getCustomerEmployees", getCustomerEmployees, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });
  api.post("/addCustomerEmployee", addCustomerEmployee, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result,
    });
    next();
  });

  api.put(
    "/updateCustomerEmployees",
    updateCustomerEmployees,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result,
      });
      next();
    }
  );

  api.delete(
    "/deleteCustomerEmployee",
    deleteCustomerEmployee,
    (req, res, next) => {
      let results = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: results,
      });
      next();
    }
  );

  return api;
};
