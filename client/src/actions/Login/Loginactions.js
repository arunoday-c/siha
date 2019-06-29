//PatientDetals

"use strict";
import axios from "axios";
import { setToken, getLocalIP } from "../../utils/algaehApiCall";
import config from "../../utils/config.json";
import {
  successfulMessage,
  AlgaehCloseContainer
} from "../../utils/GlobalFunctions";

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
    const _myRoute = config.routersAndPorts.default;
    const _localaddress =
      window.location.protocol + "//" + window.location.hostname + ":";
    const _routingUrl =
      _myRoute.url === undefined || _myRoute.url === ""
        ? _localaddress
        : _myRoute.url;
    axios({
      method: "GET",
      url: _routingUrl + _myRoute.port + auth_url,
      headers: {
        Authorization: basicAuth,
        "x-client-ip": myIP
      }
    })
      .then(response => {
        setToken(response.data.token, response.data.days);

        sessionStorage.setItem(
          "ModuleDetails",
          AlgaehCloseContainer(JSON.stringify(response.data.activemoduleList))
        );
        that.setState({
          hospitalList: response.data.hospitalList
        });
      })
      .catch(err => {
        console.error("Error : ", err.message);
        successfulMessage({
          message:
            err.response !== undefined
              ? err.response.data.message
              : err.message,
          title: "Error",
          icon: "error"
        });
      });
  });
}
