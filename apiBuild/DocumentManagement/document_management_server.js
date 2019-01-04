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

var _keys = require("../../keys/keys");

var _keys2 = _interopRequireDefault(_keys);

var _routes = require("./routes");

var _routes2 = _interopRequireDefault(_routes);

var _logging = require("./utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var portNumber = process.env.PORT; //keys.port;
app.server = _http2.default.createServer(app);
app.use((0, _cors2.default)());
//parse application json
app.use(_bodyParser2.default.json({
  limit: _keys2.default.bodyLimit
}));

//api routeres v1
app.use("/api/v1", _routes2.default);
process.on("warning", function (warning) {
  _logging.logger.log("warn", warning);
});
process.on("uncaughtException", function (error) {
  _logging.logger.log("error", error);
});
process.on("unhandledRejection", function (reason, promise) {
  _logging.logger.error("Unhandled rejection", { reason: reason, promise: promise });
});

//Error Handling MiddleWare
app.use(function (error, req, res, next) {
  error.status = error.status || httpStatus.internalServer;
  if (req.db != null) {
    var connection = req.connection;
    if (connection != null) {
      if (req.db._freeConnections.indexOf(connection) == -1) {
        if (typeof connection.rollback == "function") {
          connection.rollback(function () {
            if (typeof connection.release == "function") connection.release();

            res.status(error.status).json({
              success: false,
              message: error.sqlMessage != null ? error.sqlMessage : error.message,
              isSql: error.sqlMessage != null ? true : false
            });
          });
        } else {
          if (typeof connection.release == "function") connection.release();
          res.status(error.status).json({
            success: false,
            message: error.sqlMessage != null ? error.sqlMessage : error.message,
            isSql: error.sqlMessage != null ? true : false
          });
        }
      } else {
        res.status(error.status).json({
          success: false,
          message: error.sqlMessage != null ? error.sqlMessage : error.message,
          isSql: error.sqlMessage != null ? true : false
        });
      }
    } else {
      res.status(error.status).json({
        success: false,
        message: error.sqlMessage != null ? error.sqlMessage : error.message,
        isSql: error.sqlMessage != null ? true : false
      });
    }
  } else {
    res.status(error.status).json({
      success: false,
      message: error.sqlMessage != null ? error.sqlMessage : error.message,
      isSql: error.sqlMessage != null ? true : false
    });
  }

  var _error = {
    source: req.originalUrl,
    requestClient: req.headers["x-client-ip"],
    reqUserIdentity: req.userIdentity,
    errorDescription: error
  };
  _logging.logger.log("error", "%j", _error);
});
app.server.listen(portNumber);
console.log("Document management server started on port " + portNumber + " *");

exports.default = app;

module.exports = app;
//# sourceMappingURL=document_management_server.js.map