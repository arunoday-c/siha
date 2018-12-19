const cryptr = require("cryptr");
const jwt = require("jsonwebtoken");
const winston = require("winston");
const path = require("path");
const keys = require("../keys/keys");
exports.AlgaehUtilities = options => {
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
    logger: (modeuleName, reqTracker) => {
      reqTracker = reqTracker || "";
      if (modeuleName == null || modeuleName == "") {
        modeuleName = "No_Module_Name";
      }
      const _logPath = path.join(__dirname, "../../" + modeuleName);
      const tsFormat = moment(new Date()).format("DD-MM-YYYY HH:mm:ss");
      let logging = new winston.Logger({
        transports: [
          new rotatingDate({
            filename: `${_logPath}/hims-app-${reqTracker}-%DATE%.log`,
            timestamp: tsFormat,
            datePattern: keys.logFileDatePatter,
            prepend: true,
            maxSize: keys.logFileSize,
            level: keys.logLevel,
            showLevel: true,
            timestamp: false,
            eol: "\r\n"
          })
        ]
      });

      return {
        log: (message, obj, logtype) => {
          obj = obj || null;
          logging = logtype || "debug";
          if (obj == null) {
            if (typeof message != "object")
              logging.log(
                logtype,
                "%s",
                message + " - createdDateTime :" + new Date().toLocaleString()
              );
            else
              logging.log(logtype, "%j", {
                ...message,
                ...{ createdDateTime: new Date().toLocaleString() }
              });
          } else {
            if (typeof obj != "object")
              logging.log(
                logtype,
                message + "%s",
                obj + " - createdDateTime :" + new Date().toLocaleString()
              );
            else
              logging.log(logtype, message + "%j", {
                ...obj,
                ...{ createdDateTime: new Date().toLocaleString() }
              });
          }
        }
      };
    }
  };
};
