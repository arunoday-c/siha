"use strict";

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _utils = require("../utils");

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { validate } from "node-model-validation";
var inputServiceType = {
  hims_d_service_type_id: null,
  service_type_code: null,
  service_type: null,
  service_type_desc: null,
  arabic_service_type: null,
  effective_start_date: null,
  effective_end_date: null
  // created_by: req.userIdentity.algaeh_d_app_user_id,

  // updated_by: req.userIdentity.algaeh_d_app_user_id
};

var serviceTypeWhere = {
  hims_d_service_type_id: "ALL",
  service_type_code: "ALL",
  service_type: "ALL"
};
var getServiceType = function getServiceType(req, res, next) {
  var serviceTypeWhere = {
    hims_d_service_type_id: "ALL",
    service_type_code: "ALL",
    service_type: "ALL"
  };

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var where = (0, _utils.whereCondition)((0, _extend2.default)(serviceTypeWhere, req.query));
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("SELECT `hims_d_service_type_id`, `service_type_code`, `service_type`, `service_type_desc` \
          ,`arabic_service_type` FROM `hims_d_service_type` WHERE `record_status`='A' AND " + where.condition + " order by hims_d_service_type_id desc", where.values, function (error, result) {
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

var getServices = function getServices(req, res, next) {
  var serviceWhere = {
    hims_d_services_id: "ALL",
    service_code: "ALL",
    cpt_code: "ALL",
    service_name: "ALL",
    service_desc: "ALL",
    sub_department_id: "ALL"
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
    var parameters = (0, _extend2.default)(req.Wherecondition == null ? {} : req.Wherecondition, serviceWhere);
    var condition = (0, _utils.whereCondition)((0, _extend2.default)(req.query, parameters));
    (0, _utils.selectStatement)({
      db: req.db,
      query: "select hims_d_services_id, service_code, cpt_code, service_name \
          , service_desc, sub_department_id, hospital_id, service_type_id, standard_fee \
          , discount, vat_applicable, vat_percent, effective_start_date, effectice_end_date from hims_d_services WHERE record_status ='A' AND " + condition.condition + " order by hims_d_services_id desc" + pagePaging,
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

var addServices = function addServices(req, res, next) {
  var Services = {
    hims_d_services_id: null,
    service_code: null,
    cpt_code: null,
    service_name: null,
    hospital_id: null,
    service_type_id: null,
    sub_department_id: null,
    standard_fee: null,
    discount: 0,
    vat_applicable: null,
    vat_percent: null,

    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id,

    service_status: "A"
  };

  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(Services, req.body);
    connection.query("INSERT INTO `hims_d_services` (`service_code`, `cpt_code`,`service_name`, `hospital_id`,`service_type_id`, \
      `sub_department_id`,`standard_fee`, `discount`, `vat_applicable`, `vat_percent`, `effective_start_date`\
      , `created_by` ,`created_date`,`service_status`) \
   VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [inputParam.service_code, inputParam.cpt_code, inputParam.service_name, inputParam.hospital_id, inputParam.service_type_id, inputParam.sub_department_id, inputParam.standard_fee, inputParam.discount, inputParam.vat_applicable, inputParam.vat_percent, new Date(), inputParam.created_by, new Date(), inputParam.service_status], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      (0, _logging.debugLog)("result: ", result);
      req.body.service_id = result.insertId;
      req.records = result;
      next();
    });
  });
};

var updateServices = function updateServices(req, res, next) {
  var Services = {
    hims_d_services_id: null,
    service_code: null,
    cpt_code: null,
    service_name: null,
    hospital_id: null,
    service_type_id: null,
    sub_department_id: null,
    standard_fee: null,
    discount: 0,
    vat_applicable: null,
    vat_percent: null,

    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id,

    service_status: "A",
    record_status: "A"
  };
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(Services, req.body);
    connection.query("UPDATE `hims_d_services` \
     SET `service_code`=?,  `cpt_code`=?,`service_name`=?, `hospital_id`=?,  `service_type_id`=?,`sub_department_id` = ?, \
     `standard_fee`=?, `discount`=?,  `vat_applicable`=?,`vat_percent`=?, `updated_by`=?, `updated_date`=?,\
     `service_status`=? , `record_status`=?\
     WHERE `hims_d_services_id`=?", [inputParam.service_code, inputParam.cpt_code, inputParam.service_name, inputParam.hospital_id, inputParam.service_type_id, inputParam.sub_department_id, inputParam.standard_fee, inputParam.discount, inputParam.vat_applicable, inputParam.vat_percent, inputParam.updated_by, new Date(), inputParam.service_status, inputParam.record_status, inputParam.hims_d_services_id], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }

      req.records = result;
      next();
    });
  });
};

module.exports = {
  getServiceType: getServiceType,
  getServices: getServices,
  addServices: addServices,
  updateServices: updateServices
};
//# sourceMappingURL=serviceTypes.js.map