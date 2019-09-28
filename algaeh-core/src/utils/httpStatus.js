export default {
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
    error.status = errorStatus || internalServer;
    error.message = message;
    return error;
  },
  dataBaseNotInitilizedError: () => {
    return generateError(serviceUnavailable, "Database is not initilized");
  }
};
