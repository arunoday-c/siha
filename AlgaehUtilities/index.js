const cryptr = require("cryptr");
const jwt = require("jsonwebtoken");
const winston = require("winston");
const path = require("path");
const config = require("algaeh-keys"); //require("../keys/keys");
require("winston-daily-rotate-file");
const fs = require("fs");
exports.AlgaehUtilities = options => {
  let keys = config.default;
  return {
    encryption: data => {
      const stringData = JSON.stringify({
        ...require("./cryptoData.json"),
        ...data
      });
      return new cryptr(keys.SECRETKey).encrypt(stringData);
    },
    decryption: data => {
      const stringData = new cryptr(keys.SECRETKey).decrypt(data);
      return JSON.parse(stringData);
    },
    getTokenData: token => {
      try {
        const _details = jwt.decode(token, keys.SECRETKey);
        return _details;
      } catch (e) {
        return {};
      }
    },
    tokenVerify: token => {
      try {
        const _verify = jwt.verify(token, keys.SECRETKey);
        return _verify;
      } catch (e) {
        return false;
      }
    },
    httpStatus: () => {
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
          const error = new Error();
          error.status = errorStatus || 500;
          error.message = message;
          return error;
        },
        dataBaseNotInitilizedError: () => {
          return generateError(503, "Database is not initilized");
        }
      };
    },
    logger: reqTracker => {
      reqTracker = reqTracker || "";

      let _logPath = path.join(process.cwd(), "/LOGS");
      if (!fs.existsSync(_logPath)) {
        fs.mkdirSync(_logPath);
      }

      const _levels = process.env.NODE_ENV == "production" ? "info" : "debug";
      var transport = new winston.transports.DailyRotateFile({
        filename: `${_logPath}/%DATE%.log`,
        datePattern: "YYYY-MM-DD-HH",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
        level: _levels,
        eol: "\r\n"
      });
      const colorizer = winston.format.colorize();
      colorizer.addColors({
        error: "red",
        warn: "yellow",
        info: "cyan",
        debug: "green"
      });
      let logger = winston.createLogger({
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.timestamp(),

          // winston.format.prettyPrint(),
          // winston.format.colorize(),
          winston.format.json(),
          winston.format.printf(msg => {
            const _data = colorizer.colorize(
              msg.level,
              `{${new Date(msg.timestamp).toLocaleString()} - ${
                msg.level
              }:   -${msg.message} , data -${msg.data} } `
            );
            return _data;
          })
        ),
        transports: [transport]
      });

      return {
        log: (message, obj, logtype) => {
          logtype = logtype || "debug";
          const _data =
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
    }
  };
};
