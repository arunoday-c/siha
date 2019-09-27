import winston from "winston";
import keys from "algaeh-keys";
import path from "path";
import moment from "moment";
const rotatingDate = require("winston-daily-rotate-file");
const tsFormat = () => {
  return moment(new Date()).format("DD-MM-YYYY HH:mm:ss");
}; //new Date().toLocaleTimeString();
// let logDirectory = path.join(__dirname, "../../" + keys.logpath);
const logger = winston.createLogger({
  transports: [
    new rotatingDate({
      filename: `LOGS/hims-app-%DATE%.log`,
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

//winston.add(winston.transports.Http, rotatingDate);
export default { logger, debugLog, debugFunction };
