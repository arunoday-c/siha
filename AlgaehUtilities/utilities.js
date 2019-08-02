const cryptr = require("cryptr");
const jwt = require("jsonwebtoken");
const winston = require("winston");
const path = require("path");

require("winston-daily-rotate-file");
const gracefulFs = require("graceful-fs");
const fs = require("fs");
gracefulFs.gracefulify(fs);
function algaehUtilities(options) {
  this.options = options;
  this.keys = this.keys != null ? this.keys : require("algaeh-keys").default;
}
algaehUtilities.prototype.encryption = function(data) {
  try {
    var stringData = JSON.stringify({
      ...require("./cryptoData.json"),
      ...data
    });
    return new cryptr(this.keys.SECRETKey).encrypt(stringData);
  } catch (error) {
    throw error;
  }
};
algaehUtilities.prototype.decryption = function(data) {
  try {
    var stringData = new cryptr(this.keys.SECRETKey).decrypt(data);
    return JSON.parse(stringData);
  } catch (error) {
    throw error;
  }
};

algaehUtilities.prototype.getTokenData = function(token) {
  try {
    var _details = jwt.decode(token, this.keys.SECRETKey);
    return _details;
  } catch (error) {
    throw error;
  }
};
algaehUtilities.prototype.tokenVerify = function(token) {
  try {
    var _verify = jwt.verify(token, this.keys.SECRETKey);
    return _verify;
  } catch (error) {
    throw error;
  }
};

algaehUtilities.prototype.httpStatus = function() {
  return {
    ok: 200,
    created: 201,
    noContent: 204,
    notModified: 304,
    badRequest: 400,
    unAuthorized: 401,
    forbidden: 403,
    notFound: 404,
    locked: 423,
    internalServer: 500,
    serviceUnavailable: 503,
    generateError: (errorStatus, message) => {
      var error = new Error();
      error.status = errorStatus || 500;
      error.message = message;
      return error;
    },
    dataBaseNotInitilizedError: () => {
      return generateError(503, "Database is not initilized");
    }
  };
};

algaehUtilities.prototype.decimalPoints = function(value, decimal_point) {
  decimal_point = decimal_point || 2;
  let data_value = value;
  if (typeof value === "string") {
    data_value = parseFloat(
      value == "" || value == null || value == undefined ? "0" : value
    );
  }

  return parseFloat(data_value.toFixed(decimal_point));
};

algaehUtilities.prototype.logger = function(reqTracker) {
  reqTracker = reqTracker || "";
  var _logPath = path.join(process.cwd(), "/LOGS");
  if (!fs.existsSync(_logPath)) {
    fs.mkdirSync(_logPath);
  }
  var _levels = process.env.NODE_ENV == "production" ? "info" : "debug";
  var transport = new winston.transports.DailyRotateFile({
    filename: `${_logPath}/%DATE%.log`,
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: _levels,
    eol: "\r\n"
  });
  var colorizer = winston.format.colorize();
  colorizer.addColors({
    error: "red",
    warn: "yellow",
    info: "cyan",
    debug: "green"
  });
  var logger = winston.createLogger({
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      // winston.format.prettyPrint(),
      // winston.format.colorize(),
      winston.format.json(),
      winston.format.printf(msg => {
        var _data = colorizer.colorize(
          msg.level,
          `{${new Date(msg.timestamp).toLocaleString()} - ${msg.level}:   -${
            msg.message
          } , data -${msg.data} } `
        );
        return _data;
      })
    ),
    transports: [transport]
  });
  return {
    log: (message, obj, logtype) => {
      logtype = logtype || "debug";
      var _data =
        obj != null
          ? { data: typeof obj == "string" ? obj : JSON.stringify(obj) }
          : {};

      logger.log({
        level: logtype,
        message: message,
        ..._data
      });
      return this;
    }
  };
};

module.exports = algaehUtilities;
