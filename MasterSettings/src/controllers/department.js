import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import {
  addDepartment,
  updateDepartment,
  selectDepartment,
  selectSubDepartment,
  addSubDepartment,
  updateSubDepartment,
  deleteDepartment,
  selectdoctors,
  selectDoctorsAndClinic,
  deleteSubDepartment,
  makeSubDepartmentInActive,
  makeDepartmentInActive
} from "../models/department";

import algaehPath from "algaeh-module-bridge";
import { LINQ } from "node-linq";

const { addInventoryLocation } = algaehPath(
  "algaeh-inventory/src/models/inventory"
);

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post("/addDepartment", addDepartment, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.put("/updateDepartment", updateDepartment, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/get", selectDepartment, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

  api.get("/get/subdepartment", selectSubDepartment, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });
  api.post(
    "/add/subdepartment",
    addInventoryLocation,
    addSubDepartment,
    (req, res, next) => {
      let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: result
      });
      next();
    }
  );
  api.put("/updateSubDepartment", updateSubDepartment, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });
  api.delete("/deleteDepartment", deleteDepartment, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });

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

      // let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: {
          departmets: dept_Obj,
          doctors: doc_Obj
        }
      });
      next();
    }
  );

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

      // let result = req.records;
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: {
          departmets: dept_Obj,
          doctors: doc_Obj
        }
      });
      next();
    }
  );

  api.delete("/deleteSubDepartment", deleteSubDepartment, (req, res, next) => {
    let result = req.records;
    res.status(utlities.httpStatus().ok).json({
      success: true,
      records: result
    });
    next();
  });
  api.put(
    "/makeSubDepartmentInActive",
    makeSubDepartmentInActive,
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
    "/makeDepartmentInActive",
    makeDepartmentInActive,
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
