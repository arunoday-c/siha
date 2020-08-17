const axios = require("axios");
const { promises } = require("fs-extra");
//Call Report engne for generate two reports
function reportEngine(req, inputsArray) {
  // return new Promise((resolve, reject) => {
  //   try {
  const headers = req.headers;
  if (Array.isArray(inputsArray)) {
    const reports = inputsArray.map((item) => {
      const repParams = { ...item, sendPath: true };

      return axios({
        method: "GET",
        url: `http://localhost:3018/api/v1/report`,
        params: repParams,
        headers: {
          "x-api-key": headers["x-api-key"],
          "x-client-ip": headers["x-client-ip"],
          "x-branch": headers["x-branch"],
        },
      });
    });
    return Promise.all(reports);
  } else {
    return Promise.all([]);
  }
  // } catch (e) {
  //   reject(e);
  //}
  //  });
}
module.exports = reportEngine;
