"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getUserNamePassWord = function getUserNamePassWord(base64String) {
  try {
    var temp = base64String.split(" ");
    var buffer = new Buffer(temp[1], "base64");
    var UserNamePassword = buffer.toString().split(":");
    return {
      username: UserNamePassword[0],
      password: UserNamePassword[1]
    };
  } catch (e) {
    console.error(e);
  }
};

//api authentication
var apiAuth = function apiAuth(req, res, next) {
  var authModel = {
    username: "",
    password: ""
  };
  try {
    var db = void 0;
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    } else {
      db = req.db;
    }
    var authHeader = req.headers["authorization"];
    if (!authHeader || authHeader == "") {
      next(_httpStatus2.default.generateError(_httpStatus2.default.unAuthorized, "Missing authorization token"));
    }

    var inputData = (0, _extend2.default)(authModel, getUserNamePassWord(authHeader));
    if (inputData.username == null || inputData.username == "") {
      next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "User name can not blank"));
    }
    if (inputData.password == null || inputData.password == "") {
      next(_httpStatus2.default.generateError(_httpStatus2.default.badRequest, "Password can not blank"));
    }
    req.body = inputData;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("SELECT username FROM algaeh_d_api_auth WHERE password=md5(?)\
            AND record_status='A' AND username =?", [inputData.password, inputData.username], function (error, result) {
        connection.release();
        if (error) {
          next(error);
        }
        if (result.length == 1) {
          req.result = {
            success: true,
            results: result[0]
          };
          next();
        } else {
          next(_httpStatus2.default.generateError(_httpStatus2.default.unAuthorized, "Authentication service error please contact to your service provider"));
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

//api user authentication
var authUser = function authUser(req, res, next) {
  var authModel = {
    username: "",
    password: ""
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var inputData = (0, _extend2.default)(authModel, req.body);

    db.getConnection(function (error, connection) {
      var query = "select algaeh_d_app_user.algaeh_d_app_user_id,algaeh_d_app_user.username, \
      user_displayname,user_type,locked,login_attempts,password_expiry_rule, \
      change_password,password_expiry_date,hims_m_employee_department_mappings.employee_id,\
      hims_m_employee_department_mappings.sub_department_id ,app_group_id,algaeh_m_group_user_mappings.role_id \
      from algaeh_d_app_user,algaeh_d_app_password,hims_m_employee_department_mappings,algaeh_m_group_user_mappings \
      WHERE algaeh_d_app_user.record_status='A' AND algaeh_d_app_password.record_status='A' \
      AND algaeh_d_app_password.password=md5(?) AND algaeh_d_app_user.username=? \
      AND hims_m_employee_department_mappings.user_id=algaeh_d_app_user.algaeh_d_app_user_id \
      AND algaeh_m_group_user_mappings.user_id=algaeh_d_app_user.algaeh_d_app_user_id";

      connection.query(query, [inputData.password, inputData.username], function (error, result) {
        if (error) {
          connection.release();
          next(error);
        }
        if (result != null && result.length != 0) {
          connection.query("select module_name,module_desc from algaeh_d_app_privilege,algaeh_d_app_screens where role_id =? and  \
            algaeh_d_app_privilege.screen_id = algaeh_d_app_screens.algaeh_app_screens_id", [result[0].role_id], function (error, rec) {
            connection.release();
            if (error) {
              connection.release();
              next(error);
            }
            req.records = result;
            req.secureModels = rec;
            next();
          });
        } else {
          req.records = result;
          req.activeModels = [];
          next();
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  apiAuth: apiAuth,
  authUser: authUser
};
//# sourceMappingURL=account.js.map