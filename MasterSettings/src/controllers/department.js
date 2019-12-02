import { Router } from "express";
import algaehUtlities from "algaeh-utilities/utilities";
import deptModels from "../models/department";
import invModels from "algaeh-inventory/src/models/inventory";
import {
  getCacheMasters,
  setCacheMasters,
  deleteCacheMaster
} from "algaeh-utilities/checksecurity";
const { addInventoryLocation } = invModels;

const {
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
} = deptModels;

import { LINQ } from "node-linq";

export default () => {
  let api = Router();
  const utlities = new algaehUtlities();

  api.post(
    "/addDepartment",
    (req, res, next) => {
      deleteCacheMaster("departments");
      next();
    },
    addDepartment,
    (req, res, next) => {
      let result = req.records;
      res
        .status(utlities.httpStatus().ok)
        .json({
          success: true,
          records: result
        })
        .end();
      // next();
    }
  );

  api.put(
    "/updateDepartment",
    (req, res, next) => {
      deleteCacheMaster("departments");
      next();
    },
    updateDepartment,
    (req, res, next) => {
      let result = req.records;
      res
        .status(utlities.httpStatus().ok)
        .json({
          success: true,
          records: result
        })
        .end();
      next();
    }
  );

  api.get(
    "/get",
    (req, res, next) => {
      getCacheMasters("departments")
        .then(result => {
          if (result === null) {
            next();
          } else {
            res
              .status(utlities.AlgaehUtilities().httpStatus().ok)
              .json({
                success: true,
                records: result
              })
              .end();
          }
        })
        .catch(error => {
          console.log("error", error);
          next();
        });
    },
    selectDepartment,
    (req, res, next) => {
      let result = req.records;
      setCacheMasters("departments", result);
      res
        .status(utlities.httpStatus().ok)
        .json({
          success: true,
          records: result
        })
        .end();
    }
  );

  api.get("/get/subdepartment", selectSubDepartment, (req, res, next) => {
    let result = req.records;
    res
      .status(utlities.httpStatus().ok)
      .json({
        success: true,
        records: result
      })
      .end();
    // next();
  });
  api.post(
    "/add/subdepartment",

    (req, res, next) => {
      if (req.body.Inventory_Active == true) {
        addInventoryLocation(req, res, next);
      } else {
        next();
      }
    },
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
  api.delete(
    "/deleteDepartment",
    (req, res, next) => {
      deleteCacheMaster("departments");
      next();
    },
    deleteDepartment,
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
    "/get/get_All_Doctors_DepartmentWise",
    (req, res, next) => {
      getCacheMasters("get_All_Doctors_DepartmentWise")
        .then(result => {
          if (result === null) {
            next();
          } else {
            res
              .status(utlities.AlgaehUtilities().httpStatus().ok)
              .json({
                success: true,
                records: result
              })
              .end();
          }
        })
        .catch(error => {
          console.log("error", error);
          next();
        });
    },
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

      let recor = {
        departmets: dept_Obj,
        doctors: doc_Obj
      };
      setCacheMasters("get_All_Doctors_DepartmentWise", recor);
      res.status(utlities.httpStatus().ok).json({
        success: true,
        records: recor
      });
      next();
    }
  );

  api.get(
    "/selectDoctorsAndClinic",
    (req, res, next) => {
      getCacheMasters("selectDoctorsAndClinic")
        .then(result => {
          if (result === null) {
            next();
          } else {
            res
              .status(utlities.AlgaehUtilities().httpStatus().ok)
              .json({
                success: true,
                records: result
              })
              .end();
          }
        })
        .catch(error => {
          console.log("error", error);
          next();
        });
    },
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
      const recor = {
        departmets: dept_Obj,
        doctors: doc_Obj
      };
      setCacheMasters("selectDoctorsAndClinic", recor);
      // let result = req.records;
      res
        .status(utlities.httpStatus().ok)
        .json({
          success: true,
          records: recor
        })
        .end();
      next();
    }
  );

  api.delete(
    "/deleteSubDepartment",
    (req, res, next) => {
      deleteCacheMaster("subdepartment");
      next();
    },
    deleteSubDepartment,
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
    "/makeSubDepartmentInActive",
    (req, res, next) => {
      deleteCacheMaster("subdepartment");
      next();
    },
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
    (req, res, next) => {
      deleteCacheMaster("departments");
      next();
    },
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
