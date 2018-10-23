import winston from "winston";
import keys from "../keys/keys";
import path from "path";
import moment from "moment";
const rotatingDate = require("winston-daily-rotate-file");
const tsFormat = () => {
  return moment(new Date()).format("DD-MM-YYYY HH:mm:ss");
}; //new Date().toLocaleTimeString();
let logDirectory = path.join(__dirname, "../../" + keys.logpath);

const logger = new winston.Logger({
  transports: [
    new rotatingDate({
      filename: `${logDirectory}/hims-app-%DATE%.log`,
      timestamp: tsFormat,
      datePattern: keys.logFileDatePatter,
      prepend: true,
      maxSize: keys.logFileSize,
      level: keys.logLevel,
      showLevel: true,
      eol: "\r\n"
    })
  ]
});
let debugFunction = functionName => {
  debugLog("Function Name : " + functionName);
};
let debugLog = (message, obj) => {
  obj = obj || null;
  if (obj == null) {
    if (typeof message != "object") logger.log("debug", "%s", message);
    else logger.log("debug", "%j", message);
  } else {
    if (typeof obj != "object") logger.log("debug", message + "%s", obj);
    else logger.log("debug", message + "%j", obj);
  }
};
const wLogger = new winston.Logger({
  transports: [
    new rotatingDate({
      filename: `${logDirectory}/hims-app-req-track-%DATE%.log`,
      // timestamp: tsFormat,
      datePattern: keys.logFileDatePatter,
      prepend: true,
      maxSize: keys.logFileSize,
      level: keys.logLevel,
      showLevel: false,
      timestamp: false,
      eol: ",\r\n"
    })
  ]
});
const requestTracking = (message, Obj) => {
  Obj = Obj || null;
  wLogger.info(message + "%j", Obj);
};

//winston.add(winston.transports.Http, rotatingDate);
module.exports = { logger, debugLog, debugFunction, requestTracking };
