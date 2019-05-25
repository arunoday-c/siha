import { Router } from "express";
import {
  addDepartment, //Done
  updateDepartment, //Done
  selectDepartment, //Done
  selectSubDepartment, //Done
  addSubDepartment, //Done
  updateSubDepartment, //Done
  deleteDepartment, //Done
  selectdoctors, //Done
  selectDoctorsAndClinic, //Done
  deleteSubDepartment, //Done
  makeSubDepartmentInActive, //Done
  makeDepartmentInActive, //Done
  selectdoctors,
  selectDoctorsAndClinic,
  deleteSubDepartment,
  makeSubDepartmentInActive,
  makeDepartmentInActive
} from "../model/department";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
export default ({ config, db }) => {
  let api = Router();
  api.post(
    "/add",
    addDepartment,
    (req, res, next) => {
      let resultTables = req.records;

      res.status(httpStatus.ok).json({
        success: true,
        records: resultTables
      });
      next();
    },
    releaseConnection
  );

  api.put(
    "/updateDepartment",
    updateDepartment,
    (req, res, next) => {
      let resultSelect = req.records;
      if (resultSelect.length != 0) {
        res.status(httpStatus.ok).json({
          success: true,
          records: resultSelect
        });
        next();
      } else {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
      }
    },
    releaseConnection
  );
  api.get(
    "/get",
    selectDepartment,
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
  api.get(
    "/get/subdepartment",
    selectSubDepartment,
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
  api.post(
    "/add/subdepartment",
    addSubDepartment,
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

  api.put(
    "/updateSubDepartment",
    updateSubDepartment,
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

  //created by:irfan
  api.delete(
    "/deleteSubDepartment",
    deleteSubDepartment,
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

  //created by:irfan
  api.put(
    "/makeSubDepartmentInActive",
    makeSubDepartmentInActive,
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

  //created by:irfan makeDepartmentInActive
  api.put(
    "/makeDepartmentInActive",
    makeDepartmentInActive,
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

  api.delete(
    "/deleteDepartment",
    deleteDepartment,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json(result);
      next();
    },
    releaseConnection
  );

  api.get(
    "/get/get_All_Doctors_DepartmentWise",
    selectdoctors,
    (req, res, next) => {
      let result = req.records;
      let departmets = result.departments;
      let doctors = result.doctors;
      let dept_Obj = new Array();
      let doc_Obj = new Array();
      let d_keys = Object.keys(departmets);
      d_keys.forEach((item, index) => {
        let firstItem = new LINQ(departmets[item]).FirstOrDefault();
        let subDept = new Object();
        subDept["department_id"] = firstItem.department_id;
        subDept["sub_department_id"] = firstItem.sub_department_id;
        subDept["sub_department_name"] = firstItem.sub_department_name;
        subDept["department_type"] = firstItem.department_type;
        subDept["arabic_sub_department_name"] =
          firstItem.arabic_sub_department_name;
        subDept["doctors"] = departmets[item];
        dept_Obj.push(subDept);
      });

      let doc_keys = Object.keys(doctors);
      doc_keys.forEach((item, index) => {
        let firstItem = new LINQ(doctors[item]).FirstOrDefault();
        let doc = new Object();
        doc["employee_id"] = firstItem.employee_id;
        doc["full_name"] = firstItem.full_name;
        doc["arabic_name"] = firstItem.arabic_name;
        doc["services_id"] = firstItem.services_id;
        doc["departments"] = doctors[item];
        doc_Obj.push(doc);
      });

      res.status(httpStatus.ok).json({
        success: true,
        records: {
          departmets: dept_Obj,
          doctors: doc_Obj
        }
      });
      next();
    },
    releaseConnection
  );

  //created by:irfan to get sub departments doctors and clinic
  api.get(
    "/selectDoctorsAndClinic",
    selectDoctorsAndClinic,
    (req, res, next) => {
      let result = req.records;
      let departmets = result.departments;
      let doctors = result.doctors;
      let dept_Obj = new Array();
      let doc_Obj = new Array();
      let d_keys = Object.keys(departmets);
      d_keys.forEach((item, index) => {
        let firstItem = new LINQ(departmets[item]).FirstOrDefault();
        let subDept = new Object();
        subDept["department_id"] = firstItem.department_id;
        subDept["sub_dept_id"] = firstItem.sub_dept_id;
        subDept["sub_department_name"] = firstItem.sub_department_name;
        subDept["arabic_sub_department_name"] =
          firstItem.arabic_sub_department_name;
        subDept["doctors"] = departmets[item];
        dept_Obj.push(subDept);
      });

      let doc_keys = Object.keys(doctors);
      doc_keys.forEach((item, index) => {
        let firstItem = new LINQ(doctors[item]).FirstOrDefault();
        let doc = new Object();
        doc["provider_id"] = firstItem.provider_id;
        doc["full_name"] = firstItem.full_name;
        doc["arabic_name"] = firstItem.arabic_name;
        doc["services_id"] = firstItem.services_id;
        doc["departments"] = doctors[item];
        doc_Obj.push(doc);
      });

      res.status(httpStatus.ok).json({
        success: true,
        records: {
          departmets: dept_Obj,
          doctors: doc_Obj
        }
      });
      next();
    },
    releaseConnection
  );

  return api;
};
