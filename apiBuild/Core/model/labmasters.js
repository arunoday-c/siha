"use strict";

var _utils = require("../utils");

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Section
var selectSection = function selectSection(req, res, next) {
  var labSection = {
    hims_d_lab_section_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var pagePaging = "";
    if (req.paging != null) {
      var Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    var condition = (0, _utils.whereCondition)((0, _extend2.default)(labSection, req.query));
    (0, _utils.selectStatement)({
      db: req.db,
      query: "SELECT * FROM `hims_d_lab_section` WHERE `record_status`='A' AND " + condition.condition + "order by hims_d_lab_section_id desc",
      values: condition.values
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

var insertSection = function insertSection(req, res, next) {
  var labSection = {
    hims_d_lab_section_id: null,
    description: null,
    section_status: "A",
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(labSection, req.body);
    connection.query("INSERT INTO `hims_d_lab_section` (`description`, \
        `created_by` ,`created_date`,`section_status`) \
     VALUES ( ?, ?, ?, ?)", [inputParam.description, inputParam.created_by, new Date(), inputParam.section_status], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};

var updateSection = function updateSection(req, res, next) {
  var labSection = {
    hims_d_lab_section_id: null,
    description: null,
    section_status: "A",
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(labSection, req.body);
    connection.query("UPDATE `hims_d_lab_section` \
       SET `description`=?, `updated_by`=?, `updated_date`=?,section_status=? \
       WHERE `record_status`='A' and `hims_d_lab_section_id`=?", [inputParam.description, inputParam.updated_by, new Date(), inputParam.section_status, inputParam.hims_d_lab_section_id], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};
var deleteSection = function deleteSection(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_lab_section",
      id: req.body.hims_d_lab_section_id,
      query: "UPDATE hims_d_lab_section SET  record_status='I', \
           updated_by=?,updated_date=? WHERE hims_d_lab_section_id=?",
      values: [req.body.updated_by, new Date(), req.body.hims_d_lab_section_id]
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

//Container
var selectContainer = function selectContainer(req, res, next) {
  var labSection = {
    hims_d_lab_container_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var pagePaging = "";
    if (req.paging != null) {
      var Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    var condition = (0, _utils.whereCondition)((0, _extend2.default)(labSection, req.query));
    (0, _utils.selectStatement)({
      db: req.db,
      query: "SELECT * FROM `hims_d_lab_container` WHERE `record_status`='A' AND " + condition.condition + "order by hims_d_lab_container_id desc",
      values: condition.values
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

var insertContainer = function insertContainer(req, res, next) {
  var labContainer = {
    hims_d_lab_container_id: null,
    description: null,
    container_id: null,
    container_status: "A",
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(labContainer, req.body);
    connection.query("INSERT INTO `hims_d_lab_container` (`description`, `container_id`, \
          `created_by` ,`created_date`,`container_status`) \
       VALUES ( ?, ?, ?, ?, ?)", [inputParam.description, imputParam.container_id, inputParam.created_by, new Date(), inputParam.container_status], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};

var updateContainer = function updateContainer(req, res, next) {
  var labSection = {
    hims_d_lab_container_id: null,
    container_id: null,
    description: null,
    container_status: "A",
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(labSection, req.body);
    connection.query("UPDATE `hims_d_lab_container` \
         SET `description`=?, `container_id`=?,`updated_by`=?, `updated_date`=?,container_status=? \
         WHERE `record_status`='A' and `hims_d_lab_container_id`=?", [inputParam.description, inputParam.container_id, inputParam.updated_by, new Date(), inputParam.container_status, inputParam.hims_d_lab_container_id], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};
var deleteContainer = function deleteContainer(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_lab_container",
      id: req.body.hims_d_lab_container_id,
      query: "UPDATE hims_d_lab_container SET  record_status='I', \
             updated_by=?,updated_date=? WHERE hims_d_lab_container_id=?",
      values: [req.body.updated_by, new Date(), req.body.hims_d_lab_container_id]
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

//Specimen
var selectSpecimen = function selectSpecimen(req, res, next) {
  var labSpecimen = {
    hims_d_lab_specimen_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var pagePaging = "";
    if (req.paging != null) {
      var Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    var condition = (0, _utils.whereCondition)((0, _extend2.default)(labSpecimen, req.query));
    (0, _utils.selectStatement)({
      db: req.db,
      query: "SELECT * FROM `hims_d_lab_specimen` WHERE `record_status`='A' AND " + condition.condition + "order by hims_d_lab_specimen_id desc",
      values: condition.values
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

var insertSpecimen = function insertSpecimen(req, res, next) {
  var labSpecimen = {
    hims_d_lab_specimen_id: null,
    description: null,
    storage_type: null,
    specimen_status: "A",
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    (0, _logging.debugLog)("Body: ", req.body);
    var inputParam = (0, _extend2.default)(labSpecimen, req.body);
    (0, _logging.debugLog)("Input: ", inputParam);
    connection.query("INSERT INTO `hims_d_lab_specimen` (`description`, `storage_type`,\
          `created_by` ,`created_date`,`specimen_status`) \
       VALUES ( ?, ?, ?, ?, ?)", [inputParam.description, inputParam.storage_type, inputParam.created_by, new Date(), inputParam.specimen_status], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};

var updateSpecimen = function updateSpecimen(req, res, next) {
  var labSpecimen = {
    hims_d_lab_specimen_id: null,
    description: null,
    specimen_status: "A",
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(labSpecimen, req.body);
    connection.query("UPDATE `hims_d_lab_specimen` \
         SET `description`=?, `storage_type` = ?,`updated_by`=?, `updated_date`=?,`specimen_status`=? \
         WHERE `record_status`='A' and `hims_d_lab_specimen_id`=?", [inputParam.description, inputParam.storage_type, inputParam.updated_by, new Date(), inputParam.specimen_status, inputParam.hims_d_lab_specimen_id], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};
var deleteSpecimen = function deleteSpecimen(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_lab_specimen",
      id: req.body.hims_d_lab_specimen_id,
      query: "UPDATE hims_d_lab_specimen SET  record_status='I', \
             updated_by=?,updated_date=? WHERE hims_d_lab_specimen_id=?",
      values: [req.body.updated_by, new Date(), req.body.hims_d_lab_specimen_id]
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

//Analytes
var selectAnalytes = function selectAnalytes(req, res, next) {
  var labAnalytes = {
    hims_d_lab_analytes_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var pagePaging = "";
    if (req.paging != null) {
      var Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    var condition = (0, _utils.whereCondition)((0, _extend2.default)(labAnalytes, req.query));
    (0, _utils.selectStatement)({
      db: req.db,
      query: "SELECT * FROM `hims_d_lab_analytes` WHERE `record_status`='A' AND " + condition.condition + "order by hims_d_lab_analytes_id desc",
      values: condition.values
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

var insertAnalytes = function insertAnalytes(req, res, next) {
  var labAnalytes = {
    hims_d_lab_analytes_id: null,
    description: null,
    analyte_type: null,
    analyte_status: "A",
    result_unit: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    (0, _logging.debugLog)("Body: ", req.body);
    var inputParam = (0, _extend2.default)(labAnalytes, req.body);
    (0, _logging.debugLog)("Input: ", inputParam);
    connection.query("INSERT INTO `hims_d_lab_analytes` (`description`, `analyte_type`,`result_unit`,\
            `created_by` ,`created_date`,`analyte_status`) \
         VALUES ( ?, ?, ?, ?, ?, ?)", [inputParam.description, inputParam.analyte_type, inputParam.result_unit, inputParam.created_by, new Date(), inputParam.analyte_status], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};

var updateAnalytes = function updateAnalytes(req, res, next) {
  var labAnalytes = {
    hims_d_lab_analytes_id: null,
    description: null,
    analyte_status: "A",
    analyte_type: null,
    result_unit: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(labAnalytes, req.body);
    connection.query("UPDATE `hims_d_lab_analytes` \
           SET `description`=?, `analyte_type` = ?, `result_unit` = ?,`updated_by`=?, `updated_date`=?,`analyte_status`=? \
           WHERE `record_status`='A' and `hims_d_lab_analytes_id`=?", [inputParam.description, inputParam.analyte_type, inputParam.result_unit, inputParam.updated_by, new Date(), inputParam.analyte_status, inputParam.hims_d_lab_analytes_id], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};
var deleteAnalytes = function deleteAnalytes(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_lab_analytes",
      id: req.body.hims_d_lab_analytes_id,
      query: "UPDATE hims_d_lab_analytes SET  record_status='I', \
               updated_by=?,updated_date=? WHERE hims_d_lab_analytes_id=?",
      values: [req.body.updated_by, new Date(), req.body.hims_d_lab_analytes_id]
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

//TestCategory
var selectTestCategory = function selectTestCategory(req, res, next) {
  var labTestCategory = {
    hims_d_test_category_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var pagePaging = "";
    if (req.paging != null) {
      var Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    var condition = (0, _utils.whereCondition)((0, _extend2.default)(labTestCategory, req.query));
    (0, _utils.selectStatement)({
      db: req.db,
      query: "SELECT * FROM `hims_d_test_category` WHERE `record_status`='A' AND " + condition.condition + "order by hims_d_test_category_id desc",
      values: condition.values
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

var insertTestCategory = function insertTestCategory(req, res, next) {
  var labTestCategory = {
    hims_d_test_category_id: null,
    category_name: null,
    category_status: "A",
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  (0, _logging.debugLog)("Catey: ");
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    (0, _logging.debugLog)("Body: ", req.body);
    var inputParam = (0, _extend2.default)(labTestCategory, req.body);
    (0, _logging.debugLog)("Input: ", inputParam);
    connection.query("INSERT INTO `hims_d_test_category` (`category_name`,\
            `created_by` ,`created_date`,`category_status`) \
         VALUES ( ?, ?, ?, ?)", [inputParam.category_name, inputParam.created_by, new Date(), inputParam.category_status], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};

var updateTestCategory = function updateTestCategory(req, res, next) {
  var labTestCategory = {
    hims_d_test_category_id: null,
    category_name: null,
    category_status: "A",
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(labTestCategory, req.body);
    connection.query("UPDATE `hims_d_test_category` \
           SET `category_name`=?, `updated_by`=?, `updated_date`=?,`category_status`=? \
           WHERE `record_status`='A' and `hims_d_test_category_id`=?", [inputParam.category_name, inputParam.updated_by, new Date(), inputParam.category_status, inputParam.hims_d_test_category_id], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};
var deleteTestCategory = function deleteTestCategory(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    (0, _utils.deleteRecord)({
      db: req.db,
      tableName: "hims_d_test_category",
      id: req.body.hims_d_test_category_id,
      query: "UPDATE hims_d_test_category SET  record_status='I', \
               updated_by=?,updated_date=? WHERE hims_d_test_category_id=?",
      values: [req.body.updated_by, new Date(), req.body.hims_d_test_category_id]
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
  selectSection: selectSection,
  insertSection: insertSection,
  updateSection: updateSection,
  deleteSection: deleteSection,
  selectContainer: selectContainer,
  insertContainer: insertContainer,
  updateContainer: updateContainer,
  deleteContainer: deleteContainer,
  selectSpecimen: selectSpecimen,
  insertSpecimen: insertSpecimen,
  updateSpecimen: updateSpecimen,
  deleteSpecimen: deleteSpecimen,
  selectAnalytes: selectAnalytes,
  insertAnalytes: insertAnalytes,
  updateAnalytes: updateAnalytes,
  deleteAnalytes: deleteAnalytes,
  selectTestCategory: selectTestCategory,
  insertTestCategory: insertTestCategory,
  updateTestCategory: updateTestCategory,
  deleteTestCategory: deleteTestCategory
};
//# sourceMappingURL=labmasters.js.map