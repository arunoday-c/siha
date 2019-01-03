"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _nodeLinq = require("node-linq");

var _appsettings = require("../utils/appsettings.json");

var _appsettings2 = _interopRequireDefault(_appsettings);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by nowshad: to get lad orders for sample collection
var getRadOrderedServices = function getRadOrderedServices(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var whereOrder = "";
    if (req.query.from_date != undefined) {
      whereOrder = "date(ordered_date) between date('" + req.query.from_date + "') AND date('" + req.query.to_date + "')";
    } else {
      whereOrder = "date(ordered_date) <= date(now())";
    }

    delete req.query.from_date;
    delete req.query.to_date;
    var where = (0, _utils.whereCondition)(req.query);

    (0, _logging.debugLog)("where Dates:", whereOrder);
    (0, _logging.debugLog)("where conditn:", where);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      db.query("SELECT hims_f_rad_order_id,patient_id,visit_id,provider_id, template_id, billed, service_id,SR.service_code,SR.service_name,\
        status, cancelled, ordered_by, ordered_date, test_type, technician_id, scheduled_date_time,scheduled_by,arrived_date,arrived,validate_by,\
        validate_date_time,attended_by,attended_date_time,exam_start_date_time,exam_end_date_time,exam_status,report_type,\
        PAT.patient_code,PAT.full_name,PAT.date_of_birth,PAT.gender\
        from ((hims_f_rad_order SA inner join hims_f_patient PAT ON SA.patient_id=PAT.hims_d_patient_id) inner join \
        hims_d_services SR on SR.hims_d_services_id=SA.service_id) WHERE " + whereOrder + (where.condition == "" ? "" : " AND " + where.condition), where.values, function (error, result) {
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

var insertRadOrderedServices = function insertRadOrderedServices(req, res, next) {
  var insurtColumns = ["ordered_services_id", "patient_id", "visit_id", "provider_id", "service_id", "billed", "ordered_date", "ordered_by", "test_type"];
  (0, _logging.debugLog)("ResultOfFetchOrderIds: ", req.records.ResultOfFetchOrderIds);

  var Services = req.records.ResultOfFetchOrderIds || req.body.billdetails;
  var radServices = new _nodeLinq.LINQ(Services).Where(function (w) {
    return w.service_type_id == _appsettings2.default.hims_d_service_type.service_type_id.Radiology;
  }).Select(function (s) {
    return {
      ordered_services_id: s.hims_f_ordered_services_id || null,
      patient_id: req.body.patient_id,
      provider_id: req.body.provider_id,
      visit_id: req.body.visit_id,
      service_id: s.services_id,
      billed: req.body.billed,
      ordered_date: s.created_date,
      ordered_by: req.userIdentity.algaeh_d_app_user_id,
      test_type: s.test_type
    };
  }).ToArray();
  (0, _logging.debugLog)("radServices: ", radServices);
  var connection = req.connection;
  if (radServices.length > 0) {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    (0, _logging.debugLog)("insurtColumns", insurtColumns.join(","));
    (0, _logging.debugLog)("radServices", radServices);
    connection.query("INSERT INTO hims_f_rad_order(" + insurtColumns.join(",") + ",created_by,updated_by)  VALUES ?", [(0, _utils.jsonArrayToObject)({
      sampleInputObject: insurtColumns,
      arrayObj: radServices,
      req: req,
      newFieldToInsert: [req.userIdentity.algaeh_d_app_user_id, req.userIdentity.algaeh_d_app_user_id]
    })], function (error, result) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }
      req.records = result;
      (0, _utils.releaseDBConnection)(db, connection);
      next();
    });
  } else {
    next();
  }
};

var updateRadOrderedServices = function updateRadOrderedServices(req, res, next) {
  var RadList = {
    hims_f_rad_order_id: null,
    status: null,
    cancelled: null,
    scheduled_date_time: null,
    scheduled_by: null,
    arrived_date: null,
    arrived: null,
    validate_by: null,
    validate_date_time: null,
    attended_by: null,
    attended_date_time: null,
    technician_id: null,
    exam_start_date_time: null,
    exam_end_date_time: null,
    exam_status: null,
    report_type: null,
    template_id: null
  };
  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }

  //req.userIdentity.algaeh_d_app_user_id
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(RadList, req.body);

    if (inputParam.scheduled_by == null && inputParam.status == "S") {
      inputParam.scheduled_by = req.userIdentity.algaeh_d_app_user_id;
    }
    if (inputParam.validate_by == null && inputParam.status == "RA") {
      inputParam.validate_by = req.userIdentity.algaeh_d_app_user_id;
    }
    if (inputParam.attended_by == null && inputParam.status == "V" && inputParam.report_type == "AD") {
      inputParam.attended_by = req.userIdentity.algaeh_d_app_user_id;
    }
    if (inputParam.status == "UP") {
      inputParam.technician_id = req.userIdentity.algaeh_d_app_user_id;
    }

    (0, _logging.debugLog)("inputParam: ", inputParam);
    connection.query("UPDATE `hims_f_rad_order` \
     SET `status`=?,  `cancelled`=?,`scheduled_date_time`=?, `scheduled_by`=?, `arrived_date`=?,`arrived`=?,\
     `validate_by`=?, `validate_date_time` = ?, `attended_by`=?,`attended_date_time`=?,`exam_start_date_time`=?, \
     `exam_end_date_time`=?, `exam_status`=?, `report_type`=?,`technician_id`=?, `template_id`=?\
     WHERE `hims_f_rad_order_id`=?", [inputParam.status, inputParam.cancelled, inputParam.scheduled_date_time, inputParam.scheduled_by, inputParam.arrived_date, inputParam.arrived, inputParam.validate_by, inputParam.validate_date_time, inputParam.attended_by, inputParam.attended_date_time, inputParam.exam_start_date_time, inputParam.exam_end_date_time, inputParam.exam_status, inputParam.report_type, inputParam.technician_id, inputParam.template_id, inputParam.hims_f_rad_order_id], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};

var getRadTemplateList = function getRadTemplateList(req, res, next) {
  var whereStatement = {
    services_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var where = (0, _utils.whereCondition)((0, _extend2.default)(whereStatement, req.query));

      (0, _logging.debugLog)("inputparam: ", where);
      connection.query("SELECT distinct TD.template_name, TD.template_html, IT.hims_d_investigation_test_id,TD.hims_d_rad_template_detail_id \
         FROM hims_d_investigation_test IT, \
        hims_d_rad_template_detail TD  WHERE IT.hims_d_investigation_test_id = TD.test_id AND " + where.condition, where.values, function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("result: ", result);
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

var updateRadOrderedBilled = function updateRadOrderedBilled(req, res, next) {
  (0, _logging.debugFunction)("updateRadOrderedBilled");

  (0, _logging.debugLog)("Bill Data: ", req.body.billdetails);
  var OrderServices = new _nodeLinq.LINQ(req.body.billdetails).Where(function (w) {
    return w.hims_f_ordered_services_id != null && w.service_type_id == _appsettings2.default.hims_d_service_type.service_type_id.Radiology;
  }).Select(function (s) {
    return {
      ordered_services_id: s.hims_f_ordered_services_id,
      billed: "Y",
      updated_date: new Date(),
      updated_by: req.userIdentity.algaeh_d_app_user_id
    };
  }).ToArray();

  (0, _logging.debugLog)("Rad Order Services: ", OrderServices);

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var connection = req.connection;

    var qry = "";

    for (var i = 0; i < OrderServices.length; i++) {
      qry += " UPDATE `hims_f_rad_order` SET billed='" + OrderServices[i].billed + "',updated_date='" + new Date().toLocaleString() + "',updated_by='" + OrderServices[i].updated_by + "' WHERE ordered_services_id='" + OrderServices[i].ordered_services_id + "';";
    }
    (0, _logging.debugLog)("Query", qry);
    if (qry != "") {
      connection.query(qry, function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Query Result ", result);
        req.records = { result: result, RAD: false };
        next();
      });
    } else {
      req.records = { RAD: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getRadOrderedServices: getRadOrderedServices,
  getRadTemplateList: getRadTemplateList,
  insertRadOrderedServices: insertRadOrderedServices,
  updateRadOrderedServices: updateRadOrderedServices,
  updateRadOrderedBilled: updateRadOrderedBilled
};
//# sourceMappingURL=radiology.js.map