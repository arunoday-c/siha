"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan: to insert investigation
var addInvestigationTest = function addInvestigationTest(req, res, next) {
  var investigationModel = {
    short_description: null,
    description: null,
    investigation_type: null,
    lab_section_id: null,
    send_out_test: null,
    available_in_house: null,
    restrict_order: null,
    restrict_by: null,
    external_facility_required: null,
    facility_description: null,
    priority: null,
    cpt_id: null,
    category_id: null,
    specimen_id: null,
    container_id: null,
    container_code: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  (0, _logging.debugFunction)("addInvestigation");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)(investigationModel, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.beginTransaction(function (error) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }

        connection.query("insert into hims_d_investigation_test(short_description,description,investigation_type,lab_section_id,\
          send_out_test,available_in_house,restrict_order,restrict_by,\
          external_facility_required,facility_description,services_id,priority,cpt_id,category_id,film_category, screening_test, film_used,created_by,updated_by)values(\
          ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [input.short_description, input.description, input.investigation_type, input.lab_section_id, input.send_out_test, input.available_in_house, input.restrict_order, input.restrict_by, input.external_facility_required, input.facility_description, input.services_id, input.priority, input.cpt_id, input.category_id, input.film_category, input.screening_test, input.film_used, input.created_by, input.updated_by], function (error, results) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }
          // debugLog("Results are recorded...");

          if (results.insertId != null && input.investigation_type == "L") {
            req.body.test_id = results.insertId;
            (0, _logging.debugLog)(" test inserted id ", results.insertId);
            (0, _logging.debugLog)(" body ", req.body);

            connection.query("insert into hims_m_lab_specimen(test_id,specimen_id,container_id,container_code,created_by,updated_by)\
                values(?,?,?,?,?,?)", [results.insertId, input.specimen_id, input.container_id, input.container_code, input.created_by, input.updated_by], function (error, spResult) {
              if (error) {
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
              }
              (0, _logging.debugLog)(" specimen id :", spResult.insertId);
              // req.records = spResult;
              // next();

              if (spResult.insertId != null) {
                var insurtColumns = ["analyte_id", "analyte_type", "result_unit", "critical_low", "critical_high", "normal_low", "normal_high", "created_by", "updated_by"];

                connection.query("INSERT INTO hims_m_lab_analyte(" + insurtColumns.join(",") + ",`test_id`) VALUES ?", [(0, _utils.jsonArrayToObject)({
                  sampleInputObject: insurtColumns,
                  arrayObj: req.body.analytes,
                  newFieldToInsert: [req.body.test_id],
                  req: req
                })], function (error, analyteResult) {
                  if (error) {
                    connection.rollback(function () {
                      (0, _utils.releaseDBConnection)(db, connection);
                      next(error);
                    });
                  }

                  connection.commit(function (error) {
                    if (error) {
                      (0, _utils.releaseDBConnection)(db, connection);
                      next(error);
                    }
                    (0, _utils.releaseDBConnection)(db, connection);
                    req.records = analyteResult;
                    next();
                  });
                });
              }
            });
          } else if (results.insertId != null && input.investigation_type == "R") {
            var insurtColumns = ["template_name", "template_html", "template_status", "created_by", "updated_by"];

            connection.query("INSERT INTO hims_d_rad_template_detail(" + insurtColumns.join(",") + ",`test_id`) VALUES ?", [(0, _utils.jsonArrayToObject)({
              sampleInputObject: insurtColumns,
              arrayObj: req.body.RadTemplate,
              newFieldToInsert: [req.body.test_id],
              req: req
            })], function (error, radiolgyResult) {
              if (error) {
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
              }

              connection.commit(function (error) {
                if (error) {
                  connection.rollback(function () {
                    (0, _utils.releaseDBConnection)(db, connection);
                    next(error);
                  });
                }
                (0, _utils.releaseDBConnection)(db, connection);
                req.records = radiolgyResult;
                next();
              });
            });
          }
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by:irfan,to get list of all investigation tests
var getInvestigTestList = function getInvestigTestList(req, res, next) {
  var selectWhere = {
    hims_d_investigation_test_id: "ALL",
    lab_section_id: "ALL",
    category_id: "ALL",
    investigation_type: "ALL"
  };

  (0, _logging.debugFunction)("getListOfInsurenceProvider");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      // extend(insuranceWhereCondition, req.query);
      var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

      connection.query("select hims_d_investigation_test_id, description, services_id,R.hims_d_rad_template_detail_id,R.template_name,\
        R.template_html,investigation_type,lab_section_id, send_out_test, available_in_house, restrict_order, restrict_by,\
        external_facility_required,facility_description, priority, cpt_id, category_id, film_category, screening_test,\
        film_used, A.analyte_id, A.hims_m_lab_analyte_id,A.critical_low,A.critical_high, A.normal_low,A.normal_high, \
        S.specimen_id,S.hims_m_lab_specimen_id \
        from hims_d_investigation_test T left  join  hims_d_rad_template_detail R on\
        T.hims_d_investigation_test_id = R.test_id left join hims_m_lab_specimen S on \
        S.test_id = T.hims_d_investigation_test_id  left join hims_m_lab_analyte A on \
        A.test_id=T.hims_d_investigation_test_id where" + where.condition, where.values, function (error, result) {
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

var updateInvestigationTest = function updateInvestigationTest(req, res, next) {
  var investigationModel = {
    short_description: null,
    description: null,
    investigation_type: null,
    lab_section_id: null,
    send_out_test: null,
    available_in_house: null,
    restrict_order: null,
    restrict_by: null,
    external_facility_required: null,
    facility_description: null,
    priority: null,
    cpt_id: null,
    category_id: null,
    specimen_id: null,
    container_id: null,
    container_code: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  try {
    (0, _logging.debugFunction)("updateInvestigationTest ");
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    (0, _logging.debugLog)("Input body", req.body);
    var investigationDetails = (0, _extend2.default)(investigationModel, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.beginTransaction(function (error) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }
        var queryBuilder = "UPDATE `hims_d_investigation_test`\
        SET   short_description=?,description=?,investigation_type=?,lab_section_id=?,send_out_test=?,available_in_house=?,\
        restrict_order=?,restrict_by=?,external_facility_required=?,facility_description=?,\
        services_id=?,priority=?,cpt_id=?,category_id=?,film_category=?,screening_test=?,film_used=?,updated_date=?,updated_by=?\
        WHERE record_status='A' AND `hims_d_investigation_test_id`=?;";
        var inputs = [investigationDetails.short_description, investigationDetails.description, investigationDetails.investigation_type, investigationDetails.lab_section_id, investigationDetails.send_out_test, investigationDetails.available_in_house, investigationDetails.restrict_order, investigationDetails.restrict_by, investigationDetails.external_facility_required, investigationDetails.facility_description, investigationDetails.services_id, investigationDetails.priority, investigationDetails.cpt_id, investigationDetails.category_id, investigationDetails.film_category, investigationDetails.screening_test, investigationDetails.film_used, new Date(), investigationDetails.updated_by, investigationDetails.hims_d_investigation_test_id];

        connection.query(queryBuilder, inputs, function (error, result) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }

          if (result != null && investigationDetails.investigation_type == "L") {
            //m_lab_specimen update
            (0, _logging.debugLog)("inside L near specimen");

            connection.query("UPDATE `hims_m_lab_specimen`\
              SET  specimen_id=?,container_id=?,container_code=?,updated_date=?,updated_by=?\
              WHERE record_status='A' AND `hims_m_lab_specimen_id`=?;", [investigationDetails.specimen_id, investigationDetails.container_id, investigationDetails.container_code, new Date(), investigationDetails.updated_by, investigationDetails.hims_m_lab_specimen_id], function (error, resultSpc) {
              if (error) {
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
              }

              new Promise(function (resolve, reject) {
                try {
                  if (investigationDetails.insert_analytes.length != 0) {
                    var insurtColumns = ["test_id", "analyte_id", "analyte_type", "result_unit", "critical_low", "critical_high", "normal_low", "normal_high", "created_by", "updated_by"];

                    connection.query("INSERT INTO hims_m_lab_analyte(" + insurtColumns.join(",") + ") VALUES ?", [(0, _utils.jsonArrayToObject)({
                      sampleInputObject: insurtColumns,
                      arrayObj: investigationDetails.insert_analytes,
                      req: req
                    })], function (error, InsAnalyteResult) {
                      if (error) {
                        connection.rollback(function () {
                          (0, _utils.releaseDBConnection)(db, connection);
                          next(error);
                        });
                      }
                      return resolve(InsAnalyteResult);
                    });
                  } else {
                    return resolve();
                  }
                } catch (e) {
                  reject(e);
                }
              }).then(function (results) {
                (0, _logging.debugLog)("inside LAB then");

                //bulk analytes update
                if (investigationDetails.update_analytes.length != 0) {
                  (0, _logging.debugLog)("inside L near analyte  bulk update analyte");
                  var inputParam = (0, _extend2.default)([], req.body.update_analytes);
                  (0, _logging.debugLog)("input analayte", inputParam);

                  var qry = "";

                  for (var i = 0; i < req.body.update_analytes.length; i++) {
                    qry += " UPDATE `hims_m_lab_analyte` SET record_status='" + inputParam[i].record_status + "', critical_low='" + inputParam[i].critical_low + "', critical_high='" + inputParam[i].critical_high + "', normal_low='" + inputParam[i].normal_low + "', normal_high='" + inputParam[i].normal_high + "', updated_date='" + new Date().toLocaleString() + "',updated_by=\
'" + investigationDetails.updated_by + "' WHERE hims_m_lab_analyte_id='" + inputParam[i].hims_m_lab_analyte_id + "';";
                  }

                  connection.query(qry, function (error, result_anlyt) {
                    if (error) {
                      connection.rollback(function () {
                        (0, _utils.releaseDBConnection)(db, connection);
                        next(error);
                      });
                    }
                    (0, _logging.debugLog)("analyte,deleted or update as Inactive ");
                    connection.commit(function (error) {
                      if (error) {
                        connection.rollback(function () {
                          (0, _utils.releaseDBConnection)(db, connection);
                          next(error);
                        });
                      }
                      (0, _utils.releaseDBConnection)(db, connection);
                      req.records = result_anlyt;
                      next();
                    });
                  });
                } else {
                  connection.commit(function (error) {
                    if (error) {
                      connection.rollback(function () {
                        (0, _utils.releaseDBConnection)(db, connection);
                        next(error);
                      });
                    }
                    (0, _utils.releaseDBConnection)(db, connection);
                    req.records = results;
                    next();
                  });
                }
              });
            });
          } //bulk update rad_template
          else if (result != null && investigationDetails.investigation_type == "R") {
              new Promise(function (resolve, reject) {
                try {
                  if (investigationDetails.insert_rad_temp.length != 0) {
                    var insurtColumns = ["template_name", "test_id", "template_html", "created_by", "updated_by"];

                    connection.query("INSERT INTO hims_d_rad_template_detail(" + insurtColumns.join(",") + ") VALUES ?", [(0, _utils.jsonArrayToObject)({
                      sampleInputObject: insurtColumns,
                      arrayObj: investigationDetails.insert_rad_temp,
                      req: req
                    })], function (error, radiolgyResult) {
                      if (error) {
                        connection.rollback(function () {
                          (0, _utils.releaseDBConnection)(db, connection);
                          next(error);
                        });
                      }

                      return resolve(radiolgyResult);
                    });
                  } else {
                    return resolve();
                  }
                } catch (e) {
                  reject(e);
                }
              }).then(function (result) {
                (0, _logging.debugLog)("inside RAD then");
                if (investigationDetails.update_rad_temp.length != 0) {
                  var inputParam = (0, _extend2.default)([], req.body.update_rad_temp);
                  (0, _logging.debugLog)("input rad_update:", inputParam);

                  var qry = "";

                  for (var i = 0; i < req.body.update_rad_temp.length; i++) {
                    qry += " UPDATE `hims_d_rad_template_detail` SET template_name='" + inputParam[i].template_name + "',template_html='" + inputParam[i].template_html + "',template_status='" + inputParam[i].template_status + "', updated_date='" + new Date().toLocaleString() + "',updated_by='" + investigationDetails.updated_by + "',record_status='" + inputParam[i].record_status + "' WHERE hims_d_rad_template_detail_id='" + inputParam[i].hims_d_rad_template_detail_id + "' AND record_status='A' ;";
                  }

                  connection.query(qry, function (error, result_rad_update) {
                    if (error) {
                      connection.rollback(function () {
                        (0, _utils.releaseDBConnection)(db, connection);
                        next(error);
                      });
                    }
                    connection.commit(function (error) {
                      if (error) {
                        connection.rollback(function () {
                          (0, _utils.releaseDBConnection)(db, connection);
                          next(error);
                        });
                      }
                      (0, _utils.releaseDBConnection)(db, connection);
                      req.records = result_rad_update;
                      next();
                    });
                  });
                } else {
                  connection.commit(function (error) {
                    if (error) {
                      connection.rollback(function () {
                        (0, _utils.releaseDBConnection)(db, connection);
                        next(error);
                      });
                    }
                    (0, _utils.releaseDBConnection)(db, connection);
                    req.records = result;
                    next();
                  });
                }
              });
            }
        });
      });
    });
  } catch (e) {
    next(e);
  }
};
module.exports = {
  addInvestigationTest: addInvestigationTest,
  getInvestigTestList: getInvestigTestList,
  updateInvestigationTest: updateInvestigationTest
};
//# sourceMappingURL=investigation.js.map