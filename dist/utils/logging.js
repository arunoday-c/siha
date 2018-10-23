"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _winston = require("winston");

var _winston2 = _interopRequireDefault(_winston);

var _keys = require("../keys/keys");

var _keys2 = _interopRequireDefault(_keys);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rotatingDate = require("winston-daily-rotate-file");
var tsFormat = function tsFormat() {
  return (0, _moment2.default)(new Date()).format("DD-MM-YYYY HH:mm:ss");
}; //new Date().toLocaleTimeString();
var logDirectory = _path2.default.join(__dirname, "../../" + _keys2.default.logpath);

var logger = new _winston2.default.Logger({
  transports: [new rotatingDate({
    filename: logDirectory + "/hims-app-%DATE%.log",
    timestamp: tsFormat,
    datePattern: _keys2.default.logFileDatePatter,
    prepend: true,
    maxSize: _keys2.default.logFileSize,
    level: _keys2.default.logLevel,
    showLevel: true,
    eol: "\r\n"
  })]
});
var debugFunction = function debugFunction(functionName) {
  debugLog("Function Name : " + functionName);
};
var debugLog = function debugLog(message, obj) {
  obj = obj || null;
  if (obj == null) {
    if ((typeof message === "undefined" ? "undefined" : _typeof(message)) != "object") logger.log("debug", "%s", message);else logger.log("debug", "%j", message);
  } else {
    if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) != "object") logger.log("debug", message + "%s", obj);else logger.log("debug", message + "%j", obj);
  }
};
var wLogger = new _winston2.default.Logger({
  transports: [new rotatingDate({
    filename: logDirectory + "/hims-app-req-track-%DATE%.log",
    // timestamp: tsFormat,
    datePattern: _keys2.default.logFileDatePatter,
    prepend: true,
    maxSize: _keys2.default.logFileSize,
    level: _keys2.default.logLevel,
    showLevel: false,
    timestamp: false,
    eol: ",\r\n"
  })]
});
var requestTracking = function requestTracking(message, Obj) {
  Obj = Obj || null;
  console.log("Error Here Logger");
  wLogger.info(message + "%j", Obj);
  console.log("after Error Here Logger");
};

//winston.add(winston.transports.Http, rotatingDate);
module.exports = { logger: logger, debugLog: debugLog, debugFunction: debugFunction, requestTracking: requestTracking };
//# sourceMappingURL=logging.js.map