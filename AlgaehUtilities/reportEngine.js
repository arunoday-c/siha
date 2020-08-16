const axios = require("axios");
const { promises } = require("fs-extra");
//Call Report engne for generate two reports
function reportEngine(reqHeaders, inputsArray) {
  return new Promise((resolve, reject) => {
    try {
      const headers = req.headers;
      if (Array.isArray(inputsArray)) {
        const reports = inputsArray.map((item) => {
          return axios({
            method: "GET",
            url: `http://localhost:3018/api/v1/report`,
            params: { ...item, sendPath: true },
            headers: {
              "x-api-key": headers["x-api-key"],
              "x-client-ip": headers["x-client-ip"],
              "x-branch": headers["x-branch"],
            },
          });
        });
        Promise.all(reports)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        resolve([]);
      }
    } catch (e) {
      reject(e);
    }
  });
}
module.exports = reportEngine;
