//PatientDetals

"use strict";
import axios from "axios";
import { setToken, getLocalIP } from "../../utils/algaehApiCall";
import config from "../../utils/config.json";
import { successfulMessage } from "../../utils/GlobalFunctions";
export function getTokenDetals(that) {
  var auth_url = "/api/v1/apiAuth";
  var username = config.apiAuth.user;
  var password = config.apiAuth.password;
  var basicAuth = "Basic " + btoa(username + ":" + password);

  new Promise((resolve, reject) => {
    getLocalIP(myIP => {
      if (myIP !== undefined) {
        resolve(myIP);
      }
    });
  }).then(myIP => {
    axios({
      method: "GET",
      url: auth_url,
      headers: {
        Authorization: basicAuth,
        "x-client-ip": myIP
      }
    })
      .then(response => {
        setToken(response.data.token, response.data.days);
        that.setState({
          hospitalList: response.data.hospitalList
        });
      })
      .catch(err => {
        console.error("Error : ", err.message);
        successfulMessage({
          message: err.message,
          title: "Error",
          icon: "error"
        });
      });
  });
}
