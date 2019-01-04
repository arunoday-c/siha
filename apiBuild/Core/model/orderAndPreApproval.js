"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _billing = require("../model/billing");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _nodeLinq = require("node-linq");

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan: check pre-aproval status and get PreAproval List
var getPreAprovalList = function getPreAprovalList(req, res, next) {
  var preAprovalWhere = {
    service_id: "ALL",
    doctor_id: "ALL",
    patient_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    req.query["date(SA.created_date)"] = req.query.created_date;
    delete req.query.created_date;

    (0, _logging.debugLog)("req query:", req.query);

    var where = (0, _utils.whereCondition)((0, _extend2.default)(preAprovalWhere, req.query));

    (0, _logging.debugLog)("where conditn:", where);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      db.query("SELECT hims_f_service_approval_id,ordered_services_id,insurance_provider_id,network_id,insurance_network_office_id, service_id,SR.service_code, icd_code, requested_date, requested_by, requested_mode,\
        requested_quantity, submission_type, insurance_service_name, doctor_id, patient_id, PAT.patient_code,PAT.full_name, refer_no, gross_amt,\
        net_amount, approved_amount, approved_no, apprv_remarks, apprv_date, rejected_reason, apprv_status,SA.created_date,SA.created_by\
        from ((hims_f_service_approval SA inner join hims_f_patient PAT ON SA.patient_id=PAT.hims_d_patient_id) inner join hims_d_services SR on SR.hims_d_services_id=SA.service_id) WHERE SA.record_status='A' AND " + where.condition, where.values, function (error, result) {
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

//created by irfan:UPDATE PREAPPROVAL
var updatePreApproval = function updatePreApproval(req, res, next) {
  (0, _logging.debugFunction)("updatePreApproval");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      var inputParam = (0, _extend2.default)({}, req.body);

      var qry = "";

      for (var i = 0; i < req.body.length; i++) {
        var _appDate = inputParam[i].apprv_date != null ? "'" + inputParam[i].apprv_date + "'" : null;
        qry += " UPDATE `hims_f_service_approval` SET service_id='" + inputParam[i].service_id + "',insurance_provider_id='" + inputParam[i].insurance_provider_id + "',insurance_network_office_id=\
'" + inputParam[i].insurance_network_office_id + "', icd_code='" + inputParam[i].icd_code + "',insurance_service_name=\
'" + inputParam[i].insurance_service_name + "',doctor_id='" + inputParam[i].doctor_id + "',patient_id='" + inputParam[i].patient_id + "'\
,gross_amt='" + inputParam[i].gross_amt + "',net_amount='" + inputParam[i].net_amount + "',requested_date=\
          '" + inputParam[i].requested_date + "',requested_by=\
          '" + req.userIdentity.algaeh_d_app_user_id + "',requested_mode=\
          '" + inputParam[i].requested_mode + "',requested_quantity=\
          '" + inputParam[i].requested_quantity + "',submission_type=\
          '" + inputParam[i].submission_type + "',refer_no=\
          '" + inputParam[i].refer_no + "',approved_amount=\
          '" + inputParam[i].approved_amount + "',apprv_remarks=\
          '" + inputParam[i].apprv_remarks + "',apprv_date=\
           " + _appDate + ",rejected_reason=\
          '" + inputParam[i].rejected_reason + "',apprv_status=\
          '" + inputParam[i].apprv_status + "',updated_date='" + new Date().toLocaleString() + "',updated_by='" + req.userIdentity.algaeh_d_app_user_id + "' WHERE hims_f_service_approval_id='" + inputParam[i].hims_f_service_approval_id + "';";
      }

      (0, _logging.debugLog)("qry: ", qry);
      connection.query(qry, function (error, result) {
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

//created by irfan: insert ordered services and pre-approval services for insurance
var insertOrderedServices = function insertOrderedServices(req, res, next) {
  var insurtColumns = ["patient_id", "visit_id", "doctor_id", "service_type_id", "services_id", "test_type", "insurance_yesno", "insurance_provider_id", "insurance_sub_id", "network_id", "insurance_network_office_id", "policy_number", "pre_approval", "quantity", "unit_cost", "gross_amount", "discount_amout", "discount_percentage", "net_amout", "copay_percentage", "copay_amount", "deductable_amount", "deductable_percentage", "tax_inclusive", "patient_tax", "company_tax", "total_tax", "patient_resp", "patient_payable", "comapany_resp", "company_payble", "sec_company", "sec_deductable_percentage", "sec_deductable_amount", "sec_company_res", "sec_company_tax", "sec_company_paybale", "sec_copay_percntage", "sec_copay_amount"];

  (0, _logging.debugFunction)("add order");
  (0, _logging.debugLog)("request body:", req.body);
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var connection = req.connection;

    connection.beginTransaction(function (error) {
      if (error) {
        connection.rollback(function () {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        });
      }

      (0, _logging.debugLog)("bodyy:", req.body.billdetails);
      (0, _logging.debugLog)("insurtColumns: ", insurtColumns);
      connection.query("INSERT INTO hims_f_ordered_services(" + insurtColumns.join(",") + ",created_by,updated_by) VALUES ?", [(0, _utils.jsonArrayToObject)({
        sampleInputObject: insurtColumns,
        arrayObj: req.body.billdetails,
        req: req,
        newFieldToInsert: [req.userIdentity.algaeh_d_app_user_id, req.userIdentity.algaeh_d_app_user_id]
      })], function (error, resultOrder) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }

        var servicesForPreAproval = [];
        var patient_id = void 0;
        var doctor_id = void 0;
        var visit_id = void 0;

        var services = new _nodeLinq.LINQ(req.body.billdetails).Select(function (s) {
          patient_id = s.patient_id;
          doctor_id = s.doctor_id;
          visit_id = s.visit_id;
          return s.services_id;
        }).ToArray();
        (0, _logging.debugLog)("services:", services);
        if (services.length > 0) {
          servicesForPreAproval.push(patient_id);
          servicesForPreAproval.push(doctor_id);
          servicesForPreAproval.push(visit_id);
          servicesForPreAproval.push(services);

          (0, _logging.debugLog)(" servicesForPreAproval", servicesForPreAproval);

          connection.query("SELECT hims_f_ordered_services_id,services_id,created_date, service_type_id, test_type from hims_f_ordered_services\
                 where `patient_id`=? and `doctor_id`=? and `visit_id`=? and `services_id` in (?)", servicesForPreAproval, function (error, ResultOfFetchOrderIds) {
            if (error) {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            }
            (0, _logging.debugLog)("Query ", connection);
            (0, _logging.debugLog)("Results are recorded...", ResultOfFetchOrderIds);

            var detailsPush = new _nodeLinq.LINQ(req.body.billdetails).Where(function (g) {
              return g.pre_approval == "Y";
            }).Select(function (s) {
              return _extends({}, s, {
                hims_f_ordered_services_id: new _nodeLinq.LINQ(ResultOfFetchOrderIds).Where(function (w) {
                  return w.services_id == s.services_id;
                }).FirstOrDefault().hims_f_ordered_services_id
              });
            }).ToArray();

            //if request for pre-aproval needed
            if (detailsPush.length > 0) {
              var insurtCols = ["ordered_services_id", "service_id", "insurance_provider_id", "insurance_network_office_id", "icd_code", "requested_quantity", "insurance_service_name", "doctor_id", "patient_id", "gross_amt", "net_amount"];

              connection.query("INSERT INTO hims_f_service_approval(" + insurtCols.join(",") + ",created_by,updated_by) VALUES ?", [(0, _utils.jsonArrayToObject)({
                sampleInputObject: insurtCols,
                arrayObj: detailsPush,
                replaceObject: [{
                  originalKey: "service_id",
                  NewKey: "services_id"
                }, {
                  originalKey: "gross_amt",
                  NewKey: "ser_gross_amt"
                }, {
                  originalKey: "net_amount",
                  NewKey: "ser_net_amount"
                }, {
                  originalKey: "ordered_services_id",
                  NewKey: "hims_f_ordered_services_id"
                }],
                req: req,
                newFieldToInsert: [req.userIdentity.algaeh_d_app_user_id, req.userIdentity.algaeh_d_app_user_id]
              })], function (error, resultPreAprvl) {
                if (error) {
                  (0, _logging.debugLog)("Error 1 Here result ", error);
                  connection.rollback(function () {
                    (0, _utils.releaseDBConnection)(db, connection);
                    next(error);
                  });
                }
                req.records = { resultPreAprvl: resultPreAprvl, ResultOfFetchOrderIds: ResultOfFetchOrderIds };
                next();
              });
            } else {
              (0, _logging.debugLog)("Commit result ");
              req.records = { resultOrder: resultOrder, ResultOfFetchOrderIds: ResultOfFetchOrderIds };
              next();
            }
          });
        } else {
          (0, _logging.debugFunction)("Else: ");

          req.records = { resultOrder: resultOrder, ResultOfFetchOrderIds: ResultOfFetchOrderIds };
          next();
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

var selectOrderServices = function selectOrderServices(req, res, next) {
  var selectWhere = {
    visit_id: "ALL"
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
      var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));
      connection.query("SELECT  * FROM `hims_f_ordered_services` \
       WHERE `record_status`='A' AND `billed`='N' AND " + where.condition, where.values, function (error, result) {
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

var getOrderServices = function getOrderServices(req, res, next) {
  var selectWhere = {
    visit_id: "ALL",
    insurance_yesno: "ALL",
    service_type_id: "ALL",
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
      var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));
      connection.query("SELECT  * FROM `hims_f_ordered_services` \
       WHERE `record_status`='A' AND " + where.condition, where.values, function (error, result) {
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

//ordered services update
var updateOrderedServices = function updateOrderedServices(req, res, next) {
  (0, _logging.debugFunction)("updateOrderedServices");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      new Promise(function (resolve, reject) {
        try {
          (0, _billing.getBillDetailsFunctionality)(req, res, next, resolve);
        } catch (e) {
          reject(e);
        }
      }).then(function (result) {
        var inputParam = result.billdetails[0];
        (0, _logging.debugLog)("call back result", inputParam);

        var input = (0, _extend2.default)({}, req.body[0]);
        (0, _logging.debugLog)("id:", input.hims_f_ordered_services_id);

        connection.query("UPDATE hims_f_ordered_services SET service_type_id=?,services_id=?,insurance_yesno=?,\
          pre_approval=?,apprv_status=?,quantity=?,unit_cost=?,gross_amount=?,discount_amout=?,discount_percentage=?,net_amout=?,\
          copay_percentage=?,copay_amount=?,deductable_amount=?,deductable_percentage=?,tax_inclusive=?,patient_tax=?,company_tax=?,total_tax=?,patient_resp=?,patient_payable=?,\
          comapany_resp=?,company_payble=?,sec_company=?,sec_deductable_percentage=?,sec_deductable_amount=?,sec_company_res=?,sec_company_tax=?,sec_company_paybale=?,\
          sec_copay_percntage=?,sec_copay_amount=?,updated_date=?, updated_by=? WHERE `record_status`='A' AND `hims_f_ordered_services_id`=? ", [inputParam.service_type_id, inputParam.services_id, inputParam.insurance_yesno, inputParam.pre_approval, input.apprv_status, inputParam.quantity, inputParam.unit_cost, inputParam.gross_amount, inputParam.discount_amout, inputParam.discount_percentage, inputParam.net_amout, inputParam.copay_percentage, inputParam.copay_amount, inputParam.deductable_amount, inputParam.deductable_percentage, inputParam.tax_inclusive, inputParam.patient_tax, inputParam.company_tax, inputParam.total_tax, inputParam.patient_resp, inputParam.patient_payable, inputParam.comapany_resp, inputParam.company_payble, inputParam.sec_company, inputParam.sec_deductable_percentage, inputParam.sec_deductable_amount, inputParam.sec_company_res, inputParam.sec_company_tax, inputParam.sec_company_paybale, inputParam.sec_copay_percntage, inputParam.sec_copay_amount, new Date(), req.userIdentity.algaeh_d_app_user_id, input.hims_f_ordered_services_id], function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//ordered services update as billed
var updateOrderedServicesBilled = function updateOrderedServicesBilled(req, res, next) {
  (0, _logging.debugFunction)("updateOrderedServicesBilled");

  (0, _logging.debugLog)("Bill Data: ", req.body.billdetails);
  var OrderServices = new _nodeLinq.LINQ(req.body.billdetails).Where(function (w) {
    return w.hims_f_ordered_services_id != null;
  }).Select(function (s) {
    return {
      hims_f_ordered_services_id: s.hims_f_ordered_services_id,
      billed: "Y",
      updated_date: new Date(),
      updated_by: req.userIdentity.algaeh_d_app_user_id
    };
  }).ToArray();

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var connection = req.connection;

    var qry = "";

    for (var i = 0; i < OrderServices.length; i++) {
      qry += " UPDATE `hims_f_ordered_services` SET billed='" + OrderServices[i].billed + "'" + ",updated_by='" + OrderServices[i].updated_by + "' WHERE hims_f_ordered_services_id='" + OrderServices[i].hims_f_ordered_services_id + "';";
    }
    (0, _logging.debugLog)("Query", qry);
    if (qry != "") {
      connection.query(qry, function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Query Result ", result);
        req.records = result;
        next();
      });
    } else {
      req.records = {};
      next();
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  insertOrderedServices: insertOrderedServices,
  getPreAprovalList: getPreAprovalList,
  updatePreApproval: updatePreApproval,
  selectOrderServices: selectOrderServices,
  updateOrderedServices: updateOrderedServices,
  updateOrderedServicesBilled: updateOrderedServicesBilled,
  getOrderServices: getOrderServices
};
//# sourceMappingURL=orderAndPreApproval.js.map