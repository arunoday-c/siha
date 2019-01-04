"use strict";

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _expressJwt = require("express-jwt");

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _keys = require("../keys/keys");

var _keys2 = _interopRequireDefault(_keys);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TOKENTIME = _keys2.default.TOKENTIME;
var SECRET = _keys2.default.SECRETKey;

var authenticate = (0, _expressJwt2.default)({ secret: SECRET });

var generateAccessToken = function generateAccessToken(req, res, next) {
  req.token = req.token || {};
  req.result.success = req.result.success || false;
  if (req.result.success == true) {
    req.token = _jsonwebtoken2.default.sign({
      id: req.body.username,
      iat: Math.floor(Date.now() / 1000) - 30
    }, SECRET, {
      expiresIn: "10h" //TOKENTIME
    });
    next();
  }
};
var days = _moment2.default.duration(TOKENTIME, "seconds").asDays();
var respond = function respond(req, res) {
  res.status(200).json({
    user: req.user,
    token: req.token,
    days: days,
    hospitalList: req.result.hospitalList
  });
};

module.exports = {
  authenticate: authenticate,
  generateAccessToken: generateAccessToken,
  respond: respond
};
//# sourceMappingURL=authmiddleware.js.map