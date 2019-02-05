const cryptr = require("cryptr");
const jwt = require("jsonwebtoken");
const winston = require("winston");
const path = require("path");

require("winston-daily-rotate-file");
const fs = require("fs");

function algaehUtilities(options) {
  this.options = options;
  this.keys = this.keys != null ? this.keys : require("algaeh-keys").default;
}
algaehUtilities.prototype.encryption = function(data) {
  try {
    const stringData = JSON.stringify({
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
    const stringData = new cryptr(this.keys.SECRETKey).decrypt(data);
    return JSON.parse(stringData);
  } catch (error) {
    throw error;
  }
};

algaehUtilities.prototype.getTokenData = function(token) {
  try {
    const _details = jwt.decode(token, this.keys.SECRETKey);
    return _details;
  } catch (error) {
    throw error;
  }
};
algaehUtilities.prototype.tokenVerify = function(token) {
  try {
    const _verify = jwt.verify(token, this.keys.SECRETKey);
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
      const error = new Error();
      error.status = errorStatus || 500;
      error.message = message;
      return error;
    },
    dataBaseNotInitilizedError: () => {
      return generateError(503, "Database is not initilized");
    }
  };
};

algaehUtilities.prototype.logger = function(reqTracker) {};
