"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _keys = require("../keys/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var db = _ref.db;

  var api = (0, _express.Router)();

  //add middleware
  api.use(function (req, res, next) {
    req.db = db;
    if (req.url == "/apiAuth") {
      next();
    } else {
      var token = req.body.token || req.query.token || req.headers["x-api-key"];
      if (token) {
        _jsonwebtoken2.default.verify(token, _keys2.default.SECRETKey, function (err, decoded) {
          if (err) {
            return res.json({
              success: false,
              message: "Authentication failed"
            });
          } else {
            req.decoded = decoded;
            next();
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "no token provided"
        });
      }
    }
  });
  return api;
};
//# sourceMappingURL=index.js.map