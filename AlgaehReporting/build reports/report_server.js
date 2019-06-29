"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _compression = require("compression");

var _compression2 = _interopRequireDefault(_compression);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _fs2 = require("fs");

var _fs3 = _interopRequireDefault(_fs2);

var _path2 = require("path");

var _path3 = _interopRequireDefault(_path2);

var _report_generation = require("./report_generation");

var _utilities = require("algaeh-utilities/utilities");

var _utilities2 = _interopRequireDefault(_utilities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exec = require("child_process").exec;
var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

app.use((0, _cors2.default)());
var _port = process.env.PORT;
app.use(_bodyParser2.default.json({
  limit: "200kb"
}));
// app.use(
//   exxpress.static(
//     path.join(process.cwd(), "/algaeh_report_tool/templates/report_assets")
//   )
// );
app.use((0, _compression2.default)());
if (process.env.NODE_ENV == "production") {
  app.set("view cache", true);
}
process.setMaxListeners(0);
process.on("warning", function (warning) {
  console.warning("warning", warning);
});
process.on("uncaughtException", function (error) {
  console.error("Uncaught Exception", error);
});
process.on("unhandledRejection", function (reason, promise) {
  console.error("Unhandled Rejection", { reason: reason, promise: promise });
});
app.use(function (req, res, next) {
  var reqH = req.headers;
  var _token = reqH["x-api-key"];
  var utilities = new _utilities2.default();
  utilities.logger().log("Xapi", _token, "debug");
  var _verify = utilities.tokenVerify(_token);
  if (_verify) {
    var header = reqH["x-app-user-identity"];
    if (header != null && header != "" && header != "null") {
      header = utilities.decryption(header);
      // req.userIdentity = header;
      req.userIdentity = _extends({}, header, { "x-branch": reqH["x-branch"] });
      var reqUser = utilities.getTokenData(_token).id;
      utilities.logger("res-tracking").log("", {
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
      }, "info");
    }

    res.setHeader("connection", "keep-alive");
    next();
  } else {
    res.status(utilities.httpStatus().unAuthorized).json({
      success: false,
      message: "unauthorized access"
    });
  }
});
app.use("/api/v1/report", _report_generation.getReport);
app.use("/api/v1/excelReport", _report_generation.getExcelReport);
app.use("/api/v1/getRawReport", _report_generation.getRawReport);
app.use("/api/v1/multireports", _report_generation.getReportMultiPrint, function (req, res, next) {
  var getAllReports = req.records;
  var newArray = [];
  for (var i = 0; i < getAllReports.length; i++) {
    if (_fs3.default.existsSync(getAllReports[i])) {
      newArray.push(getAllReports[i]);
    }
  }
  if (newArray.length == 1) {
    var _fs = _fs3.default.createReadStream(newArray[0]);
    _fs.on("end", function () {
      _fs3.default.unlink(newArray[0]);
    });
    _fs.pipe(res);
  } else {
    req.records = newArray;
    next();
  }
}, _report_generation.merdgeTosingleReport);
app.use("/api/v1/pentahoreport", function (req, res) {
  var input = req.query;

  var _path = _path3.default.join(process.cwd(), "algaeh_report_tool");
  var outputFileName = (0, _moment2.default)().format("YYYYMMDDHHmmss");
  var argumentString = JSON.stringify(input.rep).replace("$outputFileName", outputFileName).replace("$reportLocation", _path);
  var _jsonParam = JSON.parse(JSON.parse(argumentString));
  var _outputFile = _jsonParam.outputFileName + "." + (_jsonParam.outputFileType == "EXCEL" ? "xlsx" : _jsonParam.outputFileType);
  exec("java -jar " + _path + "/pentaho_reporting.jar " + argumentString, function (err, stdout, stderr) {
    if (err) {
      console.log(err);
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(err);
    }
    console.log(stdout);
    var _outFile = _path3.default.join(_path, "Output", _outputFile);

    _fs3.default.exists(_outFile, function (exists) {
      if (exists) {
        res.writeHead(200, {
          "Content-type": "application/" + (_jsonParam.outputFileType == "EXCEL" ? "vnd.openxmlformats-officedocument.spreadsheetml.sheet" : _jsonParam.outputFileType),
          // "content-type": "application/xml", //vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": "attachment; filename=" + _outputFile
        });
        _fs3.default.createReadStream(_outFile).pipe(res);
      } else {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("ERROR File does not exist");
      }
    });
  });
});
app.server.listen(_port);
console.log("Report Server is running  on PORT  - " + _port + " *");
exports.default = app;

module.exports = app;
//# sourceMappingURL=report_server.js.map