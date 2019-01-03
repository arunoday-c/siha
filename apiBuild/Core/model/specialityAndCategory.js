"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan: to add addSpecialityMaster

//import moment from "moment";
var addEmployeeSpecialityMaster = function addEmployeeSpecialityMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO `hims_d_employee_speciality` (sub_department_id, speciality_code, speciality_name, arabic_name,speciality_desc  ,created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?)", [input.sub_department_id, input.speciality_code, input.speciality_name, input.arabic_name, input.speciality_desc, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get SpecialityMaster

//import { LINQ } from "node-linq";
var getEmployeeSpecialityMaster = function getEmployeeSpecialityMaster(req, res, next) {
  var selectWhere = {
    sub_department_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select hims_d_employee_speciality_id, sub_department_id, speciality_code,\
        speciality_status,speciality_name, arabic_name,speciality_desc from hims_d_employee_speciality where record_status='A' and" + where.condition + " order by hims_d_employee_speciality_id desc", where.values, function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add
var addEmployeeCategoryMaster = function addEmployeeCategoryMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO `hims_d_employee_category` (employee_category_code, employee_category_name, arabic_name,employee_category_desc,  \
            effective_start_date,   created_date, created_by, updated_date, updated_by)\
              VALUE(?,?,?,?,?,?,?,?,?)", [input.employee_category_code, input.employee_category_name, input.arabic_name, input.employee_category_desc, input.effective_start_date, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get
var getEmployeeCategoryMaster = function getEmployeeCategoryMaster(req, res, next) {
  var selectWhere = {
    hims_employee_category_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));
    db.getConnection(function (error, connection) {
      connection.query("select hims_employee_category_id, employee_category_code, employee_category_name, arabic_name,employee_category_desc, employee_category_status, \
          effective_start_date, effective_end_date from hims_d_employee_category where record_status='A' and" + where.condition + " order by hims_employee_category_id desc", where.values, function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to delete
var deleteEmployeeCategoryMaster = function deleteEmployeeCategoryMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_employee_category",
      id: req.body.hims_employee_category_id,
      query: "UPDATE hims_d_employee_category SET  record_status='I' WHERE  record_status='A' and hims_employee_category_id=?",
      values: [req.body.hims_employee_category_id]
    }, function (result) {
      req.records = result;
      next();
    }, function (error) {
      next(error);
    }, true);
  } catch (e) {
    next(e);
  }
};

//created by irfan: to delete
var deleteEmployeeSpecialityMaster = function deleteEmployeeSpecialityMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_employee_speciality",
      id: req.body.hims_d_employee_speciality_id,
      query: "UPDATE hims_d_employee_speciality SET  record_status='I' WHERE  record_status='A' and hims_d_employee_speciality_id=?",
      values: [req.body.hims_d_employee_speciality_id]
    }, function (result) {
      req.records = result;
      next();
    }, function (error) {
      next(error);
    }, true);
  } catch (e) {
    next(e);
  }
};

//created by irfan: to update
var updateEmployeeSpecialityMaster = function updateEmployeeSpecialityMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("UPDATE `hims_d_employee_speciality` SET  speciality_code=?,speciality_name=?, arabic_name=? , speciality_desc=?,\
        speciality_status=?,updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_d_employee_speciality_id`=?;", [input.speciality_code, input.speciality_name, input.arabic_name, input.speciality_desc, input.speciality_status, new Date(), input.updated_by, input.hims_d_employee_speciality_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};
//created by irfan: to update
var updateEmployeeCategoryMaster = function updateEmployeeCategoryMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("UPDATE `hims_d_employee_category` SET  employee_category_code=?, employee_category_name=?,arabic_name=?,employee_category_desc=?,\
         effective_start_date=?,employee_category_status=?,\
           updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_employee_category_id`=?;", [input.employee_category_code, input.employee_category_name, input.arabic_name, input.employee_category_desc, input.effective_start_date, input.employee_category_status, new Date(), input.updated_by, input.hims_employee_category_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by:irfan to
var makeEmployeeCategoryInActive = function makeEmployeeCategoryInActive(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_employee_category",
      id: req.body.hims_employee_category_id,
      query: "UPDATE hims_d_employee_category SET  employee_category_status='I',effective_end_date=CURDATE() WHERE record_status='A' and hims_employee_category_id=?",
      values: [req.body.hims_employee_category_id]
    }, function (result) {
      req.records = result;
      next();
    }, function (error) {
      next(error);
    }, true);
  } catch (e) {
    next(e);
  }
};

//created by:irfan to
var makeEmployeeSpecialityInActive = function makeEmployeeSpecialityInActive(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_employee_speciality",
      id: req.body.hims_d_employee_speciality_id,
      query: "UPDATE hims_d_employee_speciality SET  speciality_status='I' WHERE record_status='A' and hims_d_employee_speciality_id=?",
      values: [req.body.hims_d_employee_speciality_id]
    }, function (result) {
      req.records = result;
      next();
    }, function (error) {
      next(error);
    }, true);
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add
var addCategorySpecialityMappings = function addCategorySpecialityMappings(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO `hims_m_category_speciality_mappings` (category_id, speciality_id,description, category_speciality_status, effective_start_date, created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?)", [input.category_id, input.speciality_id, input.description, input.category_speciality_status, input.effective_start_date, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get
var getCategorySpecialityMap = function getCategorySpecialityMap(req, res, next) {
  var selectWhere = {
    hims_d_employee_speciality_id: "ALL",
    category_speciality_status: "ALL",
    employee_category_status: "ALL",
    speciality_status: "ALL",
    hims_m_category_speciality_mappings_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    // select hims_m_category_speciality_mappings_id,speciality_id, category_speciality_status, \
    //     hims_employee_category_id, employee_category_code, employee_category_name, employee_category_desc\
    //     from hims_m_category_speciality_mappings  CSM,hims_d_employee_category C where CSM.record_status='A' and category_speciality_status='A' \
    //     and  C.record_status='A' and C.employee_category_status='A' and CSM.category_id=C.hims_employee_category_id\
    //     and speciality_id=? order by hims_m_category_speciality_mappings_id desc

    db.getConnection(function (error, connection) {
      connection.query("select hims_m_category_speciality_mappings_id, category_id, speciality_id, description, category_speciality_status,\
hims_employee_category_id, employee_category_code, employee_category_name,C.arabic_name as category_arabic_name, employee_category_desc, employee_category_status, \
hims_d_employee_speciality_id,  speciality_code, speciality_name, S.arabic_name as speciality_arabic_name, speciality_desc, speciality_status \
 from hims_m_category_speciality_mappings CSM,hims_d_employee_category C,hims_d_employee_speciality S \
where CSM.record_status='A' and C.record_status='A' and S.record_status='A' and \
CSM.category_id=C.hims_employee_category_id and CSM.speciality_id=S.hims_d_employee_speciality_id  and " + where.condition + " order by hims_m_category_speciality_mappings_id desc ", where.values, function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to updateCategory Speciality Map
var updateCategorySpecialityMap = function updateCategorySpecialityMap(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("UPDATE `hims_m_category_speciality_mappings` SET  category_id=?,speciality_id=?,description=?,category_speciality_status=?,effective_start_date=?,\
        updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_m_category_speciality_mappings_id`=?;", [input.category_id, input.speciality_id, input.description, input.category_speciality_status, input.effective_start_date, new Date(), input.updated_by, input.hims_m_category_speciality_mappings_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to delete
var deleteCategorySpecialityMap = function deleteCategorySpecialityMap(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_m_category_speciality_mappings",
      id: req.body.hims_m_category_speciality_mappings_id,

      query: "UPDATE hims_m_category_speciality_mappings SET  record_status='I' WHERE  record_status='A' and hims_m_category_speciality_mappings_id=?",
      values: [req.body.hims_m_category_speciality_mappings_id]
    }, function (result) {
      req.records = result;
      next();
    }, function (error) {
      next(error);
    }, true);
  } catch (e) {
    next(e);
  }
};
//created by irfan: to Make Inactive
var makeCategorySpecialityMapInActive = function makeCategorySpecialityMapInActive(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_m_category_speciality_mappings",
      id: req.body.hims_m_category_speciality_mappings_id,

      query: "UPDATE hims_m_category_speciality_mappings SET  category_speciality_status='I' WHERE  record_status='A' and hims_m_category_speciality_mappings_id=?",
      values: [req.body.hims_m_category_speciality_mappings_id]
    }, function (result) {
      req.records = result;
      next();
    }, function (error) {
      next(error);
    }, true);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addEmployeeSpecialityMaster: addEmployeeSpecialityMaster,
  getEmployeeSpecialityMaster: getEmployeeSpecialityMaster,
  addEmployeeCategoryMaster: addEmployeeCategoryMaster,
  getEmployeeCategoryMaster: getEmployeeCategoryMaster,
  deleteEmployeeCategoryMaster: deleteEmployeeCategoryMaster,
  deleteEmployeeSpecialityMaster: deleteEmployeeSpecialityMaster,
  updateEmployeeSpecialityMaster: updateEmployeeSpecialityMaster,
  updateEmployeeCategoryMaster: updateEmployeeCategoryMaster,
  makeEmployeeCategoryInActive: makeEmployeeCategoryInActive,
  addCategorySpecialityMappings: addCategorySpecialityMappings,
  makeEmployeeSpecialityInActive: makeEmployeeSpecialityInActive,
  getCategorySpecialityMap: getCategorySpecialityMap,

  updateCategorySpecialityMap: updateCategorySpecialityMap,
  deleteCategorySpecialityMap: deleteCategorySpecialityMap,
  makeCategorySpecialityMapInActive: makeCategorySpecialityMapInActive
};
//# sourceMappingURL=specialityAndCategory.js.map