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

algaehUtilities.prototype.getCurrencyFormart = function(value, CurrencyDetail) {
  const settings = CurrencyDetail;

  const precesions =
    settings.decimal_places !== undefined && settings.decimal_places !== ""
      ? parseFloat(settings.decimal_places)
      : 0;
  try {
    value =
      typeof value === "string" && value !== "" ? parseFloat(value) : value;
    value = typeof value !== "number" ? 0 : value;
  } catch (e) {
    value = 0;
  }

  let n = !isFinite(+value) ? 0.0 : +value;
  const prec = !isFinite(+precesions) ? 0 : Math.abs(precesions);

  const toFixedFix = (n, prec) => {
    const k = Math.pow(10, prec);
    return Math.round(n * k) / k;
  };
  let s = prec
    ? toFixedFix(n, prec)
    : Math.round(n)
        .toString()
        .split(".");
  if (s instanceof Array) {
    if (s[0].length > 3) {
      s[0] = s[0].replace(
        /\B(?=(?:\d{3})+(?!\d))/g,
        settings.thousand_separator
      );
    }
    if ((s[1] || "").length < prec) {
      s[1] = s[1] || "";
      s[1] += new Array(prec - s[1].length + 1).join("0");
    }
  }

  const result =
    s instanceof Array
      ? s.join(settings.decimal_separator)
      : parseFloat(s).toFixed(precesions);
  let currency = result;

  switch (settings.symbol_position) {
    case "BWS":
      currency = settings.currency_symbol + result;
      break;
    case "BS":
      currency = settings.currency_symbol + " " + result;
      break;
    case "AWS":
      currency = result + settings.currency_symbol;
      break;
    case "AS":
      currency = result + " " + settings.currency_symbol;
      break;
    default:
      return;
  }

  return currency;
};

module.exports = algaehUtilities;
