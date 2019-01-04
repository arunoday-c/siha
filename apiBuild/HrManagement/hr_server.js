"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _keys = require("../keys/keys");

var _keys2 = _interopRequireDefault(_keys);

var _AlgaehUtilities = require("../AlgaehUtilities");

var _AlgaehUtilities2 = _interopRequireDefault(_AlgaehUtilities);

var _routes = require("./routes");

var _routes2 = _interopRequireDefault(_routes);

var _compression = require("compression");

var _compression2 = _interopRequireDefault(_compression);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);
app.use((0, _cors2.default)());
var _port = process.env.PORT;
app.use(
  _bodyParser2.default.json({
    limit: _keys2.default.bodyLimit
  })
);
app.use((0, _compression2.default)());
app.use(function(req, res, next) {
  var reqH = req.headers;
  var _token = reqH["x-api-key"];

  _AlgaehUtilities2.default
    .AlgaehUtilities()
    .logger()
    .log("Xapi", _token, "debug");
  var _verify = _AlgaehUtilities2.default.AlgaehUtilities().tokenVerify(_token);
  if (_verify) {
    var header = reqH["x-app-user-identity"];
    if (header != null && header != "" && header != "null") {
      header = _AlgaehUtilities2.default.AlgaehUtilities().decryption(header);
      req.userIdentity = header;
      var reqUser = _AlgaehUtilities2.default
        .AlgaehUtilities()
        .getTokenData(_token).id;
      _AlgaehUtilities2.default
        .AlgaehUtilities()
        .logger("res-tracking")
        .log(
          "",
          {
            dateTime: new Date().toLocaleString(),
            requestIdentity: {
              requestClient: reqH["x-client-ip"],
              requestAPIUser: reqUser,
              reqUserIdentity: req.userIdentity
            },
            requestUrl: req.originalUrl,
            requestHeader: {
              host: reqH.host,
              "user-agent": reqH["user-agent"],
              "cache-control": reqH["cache-control"],
              origin: reqH.origin
            },
            requestMethod: req.method
          },
          "info"
        );
    }

    res.setHeader("connection", "keep-alive");
    next();
  } else {
    res
      .status(
        _AlgaehUtilities2.default.AlgaehUtilities().httpStatus().unAuthorized
      )
      .json({
        success: false,
        message: "unauthorized access"
      });
  }
});

app.use("/api/v1", _routes2.default);

process.on("warning", function(warning) {
  _AlgaehUtilities2.default
    .AlgaehUtilities()
    .logger()
    .log("warn", warning, "warn");
});
process.on("uncaughtException", function(error) {
  _AlgaehUtilities2.default
    .AlgaehUtilities()
    .logger()
    .log("uncatched Exception", error, "error");
});
process.on("unhandledRejection", function(reason, promise) {
  _AlgaehUtilities2.default
    .AlgaehUtilities()
    .logger()
    .log("Unhandled rejection", { reason: reason, promise: promise }, "error");
});
app.use(function(error, req, res, next) {
  error.status =
    error.status ||
    _AlgaehUtilities2.default.AlgaehUtilities().httpStatus().internalServer;
  res.status(error.status).json({
    success: false,
    isSql: error.sqlMessage != null ? true : false,
    message: error.sqlMessage != null ? error.sqlMessage : error.message
  });
});
app.server.listen(_port);
console.log("HR MANAGEMENT Server is running  on PORT  - " + _port);
exports.default = app;

module.exports = app;
//# sourceMappingURL=hr_server.js.map
