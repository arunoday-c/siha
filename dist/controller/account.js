"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _authmiddleware = require("../middleware/authmiddleware");

var _account = require("../model/account");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  // '/v1/apiAuth'
  api.get("/", _account.apiAuth, _passport2.default.authenticate("local", {
    session: false,
    scope: []
  }), _authmiddleware.generateAccessToken, _authmiddleware.respond);

  //'/v1/authUser
  api.post("/authUser", _account.authUser, function (req, res, next) {
    var result = req.records;
    if (result.length == 0) {
      next(_httpStatus2.default.generateError(_httpStatus2.default.notFound, "No record found"));
    } else {
      if (result[0]["locked"] == "N") {
        var rowDetails = result[0];

        res.status(_httpStatus2.default.ok).json({
          success: true,
          records: {
            algaeh_d_app_user_id: rowDetails["algaeh_d_app_user_id"],
            username: rowDetails["username"],
            user_displayname: rowDetails["user_displayname"]
          }
        });
        next();
      } else {
        next(_httpStatus2.default.generateError(_httpStatus2.default.locked, "user ' " + inputData.username.toUpperCase() + " ' locked please\
                        contact administrator."));
      }
    }
  }, _utils.releaseConnection);

  return api;
};
//# sourceMappingURL=account.js.map