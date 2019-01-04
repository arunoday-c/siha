"use strict";

var _utils = require("../utils");

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectAppUsers = function selectAppUsers(req, res, next) {
  var labSection = {
    algaeh_d_app_user_id: "ALL"
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
      query: "SELECT * FROM `algaeh_d_app_user` WHERE `record_status`='A' AND " + condition.condition + " order by algaeh_d_app_user_id desc " + pagePaging,
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

//created by irfan: to
var getLoginUserMaster = function getLoginUserMaster(req, res, next) {
  var selectWhere = {
    algaeh_m_role_user_mappings_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    // SELECT algaeh_m_group_user_mappings_id, app_group_id,app_group_name, user_id, username,\
    // user_display_name, effective_start_date, role_id,role_name\
    // from algaeh_m_group_user_mappings GUM ,algaeh_d_app_user U,algaeh_d_app_group G,algaeh_d_app_roles R\
    // where GUM.user_id=U.algaeh_d_app_user_id and GUM.app_group_id=G.algaeh_d_app_group_id\
    // and GUM.role_id=R.app_d_app_roles_id and  GUM.record_status='A' and U.record_status='A' \
    // and G.record_status='A' and R.record_status='A'

    var adminUSer = "";
    if (req.userIdentity.role_type == "AD") {
      adminUSer = " and   group_type <> 'SU' and role_type <>'SU' ";
    }

    db.getConnection(function (error, connection) {
      connection.query("SELECT algaeh_m_role_user_mappings_id, user_id,username, user_display_name,\
        effective_start_date, role_id, role_code, role_name, role_discreption,  \
       app_group_id, app_group_code, app_group_name, app_group_desc\
       from algaeh_m_role_user_mappings RU ,algaeh_d_app_user U,algaeh_d_app_group G,\
       algaeh_d_app_roles R WHERE  RU.role_id=R.app_d_app_roles_id \
       AND R.app_group_id=G.algaeh_d_app_group_id AND RU.user_id=U.algaeh_d_app_user_id " + adminUSer + "and " + where.condition + " order by algaeh_m_role_user_mappings_id desc", where.values, function (error, result) {
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

//created by irfan: to  select un-used user logins
var selectLoginUser = function selectLoginUser(req, res, next) {
  var selectWhere = {
    algaeh_d_app_user_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      var adminUSer = "";
      if (req.userIdentity.role_type == "AD") {
        adminUSer = "  and user_type <>'SU' and user_type <>'AD' ";
      }
      if (req.userIdentity.role_type != "GN") {
        connection.query("select algaeh_d_app_user_id, username, user_display_name,  user_status, user_type from algaeh_d_app_user\
           where algaeh_d_app_user_id not in (select  user_id from \
          hims_m_employee_department_mappings where user_id is not null) \
          and algaeh_d_app_user.record_status='A' and user_status='A'" + adminUSer + " AND" + where.condition + " order by algaeh_d_app_user_id desc", where.values, function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
      } else {
        req.records = {
          validUser: false,
          message: "you dont have admin privilege"
        };
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
var selectAppGroup = function selectAppGroup(req, res, next) {
  var selectWhere = {
    algaeh_d_app_group_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    var adminUSer = "";

    if (req.userIdentity.role_type == "AD") {
      adminUSer = " and   group_type <> 'AD'  and group_type <>'SU' ";
    }

    db.getConnection(function (error, connection) {
      if (req.userIdentity.role_type != "GN") {
        connection.query("select algaeh_d_app_group_id, app_group_code, app_group_name, app_group_desc,\
        group_type, app_group_status  from algaeh_d_app_group where record_status='A'\
          " + adminUSer + " AND" + where.condition + " order by algaeh_d_app_group_id desc", where.values, function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
      } else {
        req.records = {
          validUser: false,
          message: "you dont have admin privilege"
        };
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
var selectRoles = function selectRoles(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var adminUSer = "";

    if (req.userIdentity.role_type == "AD") {
      adminUSer = " and   role_type <> 'AD' and  role_type <>'SU' ";
    }
    (0, _logging.debugLog)("dd:", req.userIdentity);
    db.getConnection(function (error, connection) {
      if (req.userIdentity.role_type != "GN") {
        connection.query("select app_d_app_roles_id,app_group_id, role_code, role_name, role_discreption, role_type\
        from algaeh_d_app_roles where record_status='A'  and app_group_id=? " + adminUSer + " order by app_d_app_roles_id desc", [req.query.algaeh_d_app_group_id], function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
      } else {
        req.records = {
          validUser: false,
          message: "you dont have admin privilege"
        };
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
var createUserLogin = function createUserLogin(req, res, next) {
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
      if (input.user_type != "SU" && input.user_type != "AD") {
        if (req.userIdentity.role_type != "GN") {
          connection.beginTransaction(function (error) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }

            connection.query("INSERT INTO `algaeh_d_app_user` (username,user_display_name,user_type,effective_start_date, created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?,?)", [input.username, input.user_display_name, input.user_type, input.effective_start_date, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
              if (error) {
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
              }

              if (result.insertId != null && result.insertId != undefined && input.password != null && input.password != undefined && input.password != " ") {
                connection.query("INSERT INTO `algaeh_d_app_password` ( userid,password,created_date, created_by, updated_date, updated_by)\
                VALUE(?,md5(?),?,?,?,?)", [result.insertId, input.password, new Date(), input.created_by, new Date(), input.updated_by], function (error, pwdResult) {
                  if (error) {
                    connection.rollback(function () {
                      (0, _utils.releaseDBConnection)(db, connection);
                      next(error);
                    });
                  }

                  if (pwdResult.insertId != null && pwdResult.insertId != undefined) {
                    connection.query("INSERT INTO `algaeh_m_role_user_mappings` ( user_id,  role_id,created_date, created_by, updated_date, updated_by)\
                      VALUE(?,?,?,?,?,?)", [result.insertId, input.role_id, new Date(), input.created_by, new Date(), input.updated_by], function (error, finalResult) {
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
                        req.records = finalResult;
                        next();
                      });
                    });
                  } else {
                    connection.rollback(function () {
                      (0, _utils.releaseDBConnection)(db, connection);
                      next(error);
                    });
                    req.records = {
                      validUser: false,
                      message: "please select role"
                    };
                    next();
                  }
                });
              } else {
                connection.rollback(function () {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                });
                req.records = {
                  validUser: false,
                  message: "please valid enter password "
                };
                next();
              }
            });
          });
        } else {
          req.records = {
            validUser: false,
            message: "you dont have admin privilege"
          };
          next();
        }
      } else {
        req.records = {
          validUser: false,
          message: "you dont have  rights to add this user"
        };
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};
module.exports = {
  selectAppUsers: selectAppUsers,
  selectLoginUser: selectLoginUser,
  selectAppGroup: selectAppGroup,
  selectRoles: selectRoles,
  createUserLogin: createUserLogin,
  getLoginUserMaster: getLoginUserMaster
};
//# sourceMappingURL=algaehappuser.js.map