"use strict";
import extend from "extend";
import {
  whereCondition,
  deleteRecord,
  releaseDBConnection,
  jsonArrayToObject
} from "../utils";
//import moment from "moment";
import httpStatus from "../utils/httpStatus";
//import { LINQ } from "node-linq";
import { debugLog } from "../utils/logging";

//created by irfan: to add addSpecialityMaster
let addEmployeeSpecialityMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO `hims_d_employee_speciality` (sub_department_id, speciality_code, speciality_name, speciality_desc  ,created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?)",
        [
          input.sub_department_id,
          input.speciality_code,
          input.speciality_name,
          input.speciality_desc,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get SpecialityMaster
let getEmployeeSpecialityMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    //et where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_employee_speciality_id, sub_department_id, speciality_code,\
        speciality_name, speciality_desc from hims_d_employee_speciality where record_status='A'  order by hims_d_employee_speciality_id desc",
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add
let addEmployeeCategoryMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO `hims_d_employee_category` (employee_category_code, employee_category_name, employee_category_desc, employee_category_status, \
            effective_start_date, effective_end_date,  created_date, created_by, updated_date, updated_by)\
              VALUE(?,?,?,?,?,?,?,?,?,?)",
        [
          input.employee_category_code,
          input.employee_category_name,
          input.employee_category_desc,
          input.employee_category_status,
          input.effective_start_date,
          input.effective_end_date,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get
let getEmployeeCategoryMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_employee_category_id, employee_category_code, employee_category_name, employee_category_desc, employee_category_status, \
          effective_start_date, effective_end_date from hims_d_employee_category where record_status='A' order by hims_employee_category_id desc",
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to delete
let deleteEmployeeCategoryMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_employee_category",
        id: req.body.hims_employee_category_id,
        query:
          "UPDATE hims_d_employee_category SET  record_status='I' WHERE hims_employee_category_id=?",
        values: [req.body.hims_employee_category_id]
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};
//created by irfan: to delete
let deleteEmployeeSpecialityMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_employee_speciality",
        id: req.body.hims_d_employee_speciality_id,
        query:
          "UPDATE hims_d_employee_speciality SET  record_status='I' WHERE hims_d_employee_speciality_id=?",
        values: [req.body.hims_d_employee_speciality_id]
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

//created by irfan: to update
let updateEmployeeSpecialityMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "UPDATE `hims_d_employee_speciality` SET  speciality_code=?,speciality_name=?,speciality_desc=?,\
           updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_d_employee_speciality_id`=?;",
        [
          input.speciality_code,
          input.speciality_name,
          input.speciality_desc,
          new Date(),
          input.updated_by,
          input.hims_d_employee_speciality_id
        ],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};
//created by irfan: to update
let updateEmployeeCategoryMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "UPDATE `hims_d_employee_category` SET  employee_category_code=?, employee_category_name=?,employee_category_desc=?,\
         effective_start_date=?, effective_end_date=?,\
           updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_employee_category_id`=?;",
        [
          input.employee_category_code,
          input.employee_category_name,
          input.employee_category_desc,
          input.effective_start_date,
          input.effective_end_date,

          new Date(),
          input.updated_by,
          input.hims_employee_category_id
        ],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by:irfan to
let makeEmployeeCategoryInActive = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_employee_category",
        id: req.body.hims_employee_category_id,
        query:
          "UPDATE hims_d_employee_category SET  sub_department_status='I' WHERE hims_employee_category_id=?",
        values: [req.body.hims_employee_category_id]
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add
let addCategorySpecialityMappings = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO `hims_m_category_speciality_mappings` (category_id, speciality_id,description, category_speciality_status, effective_start_date, effective_end_date  ,created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?,?)",
        [
          input.category_id,
          input.speciality_id,
          input.description,
          input.category_speciality_status,
          input.effective_start_date,
          input.effective_end_date,

          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get
let getCategorySpecialityMap = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    //et where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_m_category_speciality_mappings_id,speciality_id, category_speciality_status, \
        hims_employee_category_id, employee_category_code, employee_category_name, employee_category_desc\
        from hims_m_category_speciality_mappings  CSM,hims_d_employee_category C where CSM.record_status='A' and category_speciality_status='A' \
        and  C.record_status='A' and C.employee_category_status='A' and CSM.category_id=C.hims_employee_category_id\
        and speciality_id=? order by hims_m_category_speciality_mappings_id desc",
        [req.query.hims_d_employee_speciality_id],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
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
  getCategorySpecialityMap
};
