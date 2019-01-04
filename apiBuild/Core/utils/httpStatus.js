"use strict";

module.exports = {
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
  generateError: function generateError(errorStatus, message) {
    var error = new Error();
    error.status = errorStatus || internalServer;
    error.message = message;
    return error;
  },
  dataBaseNotInitilizedError: function dataBaseNotInitilizedError() {
    return generateError(serviceUnavailable, "Database is not initilized");
  }
};
//# sourceMappingURL=httpStatus.js.map