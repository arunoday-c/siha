const axios = require("axios");
function newAxios(req, options = { method: "GET", params: {}, url: "" }) {
  const headers = req.headers;
  options["headers"] = {
    "x-api-key": headers["x-api-key"],
    "x-client-ip": headers["x-client-ip"],
    "x-branch": headers["x-branch"],
  };
  return axios(options);
}
module.exports = newAxios;
