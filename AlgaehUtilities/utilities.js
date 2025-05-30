const cryptr = require("cryptr");
const jwt = require("jsonwebtoken");
//let winston = require("winston");
//require("winston-mongodb");
const keys = require("algaeh-keys");

function algaehUtilities(options) {
  this.options = options;
  this.keys = this.keys != null ? this.keys : require("algaeh-keys").default;
}
algaehUtilities.prototype.encryption = function (data) {
  try {
    return data;
  } catch (error) {
    throw error;
  }
};
algaehUtilities.prototype.decryption = function (data) {
  try {
    return data;
  } catch (error) {
    throw error;
  }
};

algaehUtilities.prototype.getTokenData = function (token) {
  try {
    var _details = jwt.decode(token, this.keys.SECRETKey);
    return _details;
  } catch (error) {
    throw error;
  }
};
algaehUtilities.prototype.tokenVerify = function (token) {
  try {
    var _verify = jwt.verify(token, this.keys.SECRETKey);
    return _verify;
  } catch (error) {
    throw error;
  }
};

algaehUtilities.prototype.httpStatus = function () {
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
    },
  };
};

algaehUtilities.prototype.decimalPoints = function (value, decimal_point) {
  decimal_point = decimal_point || 2;
  let data_value = value;
  if (typeof value === "string") {
    data_value = parseFloat(
      value == "" || value == null || value == undefined ? "0" : value
    );
  }

  return parseFloat(data_value.toFixed(decimal_point));
};

algaehUtilities.prototype.logger = function (reqTracker) {
  reqTracker = reqTracker || "";

  //var _levels = process.env.NODE_ENV === "production" ? "info" : "debug";

  // let transport = undefined;
  // const { mongoDb } = keys.default;
  // if (process.env.NODE_ENV === "development") {
  //   transport = new winston.transports.Console({
  //     colorize: true,
  //     format: winston.format.simple(),
  //   });
  // } else {
  //   transport = new winston.transports.MongoDB({
  //     db: mongoDb.connectionURI,
  //     options: {
  //       useUnifiedTopology: true,
  //       poolSize: 10,
  //       useNewUrlParser: true,
  //     },
  //     collection: "audit_logs",
  //     tryReconnect: true,
  //   });
  // }

  // var logger = winston.createLogger({
  //   transports: [transport],
  //   format: winston.format.json(),
  // });
  return {
    log: (message, obj, logtype) => {
      logtype = logtype || "debug";
      // if (message !== undefined && message !== "") {
      // Here -- to remove logging
      // logger.log({
      //   level: logtype,
      //   message,
      //   metadata: obj,
      // });
      //}
      if (logtype === "error") {
        console.error(new Date(), " - ", "Error - ", message, " ---- ", obj);
      } else if (logtype === "warn") {
        console.warn(new Date(), " - ", "Warning - ", message, " ---- ", obj);
      }
      // logger.close();
      return this;
    },
  };
};

algaehUtilities.prototype.getCurrencyFormart = function (
  value,
  CurrencyDetail,
  addSymbol
) {
  addSymbol = addSymbol === undefined ? true : addSymbol;

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
  // const prec = !isFinite(precesions) ? 0 : Math.abs(precesions);
  // const toFixedFix = (n, prec) => {
  //   const k = Math.pow(10, prec);
  //   return Math.round(n * k) / k;
  // };

  // let s = prec ? toFixedFix(n, prec) : Math.round(n).toString().split(".");
  // if (s instanceof Array) {
  //   if (s[0].length > 3) {
  //     s[0] = s[0].replace(
  //       /\B(?=(?:\d{3})+(?!\d))/g,
  //       settings.thousand_separator
  //     );
  //   }
  //   if ((s[1] || "").length < prec) {
  //     s[1] = s[1] || "";
  //     s[1] += new Array(prec - s[1].length + 1).join("0");
  //   }
  // }

  // const result =
  //   s instanceof Array
  //     ? s.join(settings.decimal_separator)
  //     : parseFloat(s).toFixed(precesions);
  let currency = parseFloat(n).toLocaleString(`en-US`, {
    minimumFractionDigits: precesions,
    maximumFractionDigits: precesions,
    useGrouping: true,
  });

  // if (result !== ""){
  //   const splittedResult = result.split(".");
  //   let amount = new Number(splittedResult[0]).toLocaleString("en-IN");
  //   console.log(
  //     "TESTING",
  //     new Number(100000).toLocaleString("en-IN", {
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 3,
  //     })
  //   );
  //   if (splittedResult.length > 1) {
  //     amount += `.${splittedResult[1]}`;
  //   }
  //   currency = amount;
  // }
  if (addSymbol === false) {
    return currency;
  }
  switch (settings.symbol_position) {
    case "BWS":
      currency = settings.currency_symbol + currency;
      break;
    case "BS":
      currency = settings.currency_symbol + " " + currency;
      break;
    case "AWS":
      currency = currency + settings.currency_symbol;
      break;
    case "AS":
      currency = currency + " " + settings.currency_symbol;
      break;
    default:
      return;
  }

  return currency;
};

module.exports = algaehUtilities;
