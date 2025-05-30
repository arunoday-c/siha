// import React from "react";
import { getItem, tokenDecode } from "algaeh-react-components";
import axios from "axios";
import extend from "extend";
import moment from "moment";
import swal from "sweetalert2";
import Agent from "agentkeepalive";
import config from "../utils/config.json";
import axiosCancel from "axios-cancel";
import AlgaehLoader from "../Components/Wrapper/fullPageLoader.js";
import { encrypter } from "./GlobalFunctions";
import { GetContextForm } from "./identity";
const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
let showOtherPopup = true;
export function algaehApiCall(options) {
  // "baseUrl": "http://192.168.0.149:3000/api/v1",

  if (!window.navigator.onLine) {
    swalMessage({
      title:
        "Looks like you're not connected to any network,\n please make sure you connect to a network and try again",
      imageUrl: "images/nointernet.png",
      imageHeight: 30,
      position: "center",
      timer: 4000,
    });

    return false;
  } else {
    if (
      window.navigator.connection !== undefined &&
      window.navigator.connection.effectiveType === "2g"
    ) {
      swalMessage({
        title: "Low internet connectivity, response may be delayed",
        imageUrl: "images/nointernet.png",
        imageHeight: 30,
        position: "top",
        timer: 4000,
      });
    }
  }

  let collection = options.notoken === undefined ? [getItem("token")] : [];
  Promise.all(collection)
    .then((detailResult) => {
      const myIP = getNewLocalIp();
      const headerToken = detailResult.length > 0 ? detailResult[0] : "";
      const userTokenDetails =
        headerToken !== "" ? tokenDecode(headerToken) : {};
      const x_branch = userTokenDetails.hims_d_hospital_id; //getCookie("HospitalId");
      var settings = extend(
        {
          uri: null,
          data: null,
          method: "POST",
          token: null,
          onSuccess: null,
          onFailure: null,
          baseUrl: config.baseUrl,
          printInput: false,
          isfetch: false,
          cancelRequestId: null,
          module: null,
          skipParse: false,
        },
        options
      );
      if (settings.uri === null) {
        return;
      }
      let _baseUrl = settings.baseUrl;
      const _localaddress =
        window.location.protocol + "//" + window.location.hostname; //+ ":";

      const isProxy = window.location.port === "";

      if (settings.module === null || settings.module === "") {
        const _defRoute = config.routersAndPorts.default;
        const _url =
          _defRoute.url === undefined || _defRoute.url === ""
            ? _localaddress
            : _defRoute.url;
        const _baseurlInner =
          _defRoute.baseUrl === undefined ? _baseUrl : _defRoute.baseUrl;

        settings.baseUrl =
          _url +
          (isProxy ? _defRoute.path : `:${_defRoute.port}`) +
          _baseurlInner;
      } else {
        const _myRouter = config.routersAndPorts[settings.module];
        const _url =
          _myRouter.url === undefined || _myRouter.url === ""
            ? _localaddress
            : _myRouter.url;
        const _baseurlInner =
          _myRouter.baseUrl === undefined ? _baseUrl : _myRouter.baseUrl;
        settings.baseUrl =
          _url +
          (isProxy ? _myRouter.path : `:${_myRouter.port}`) +
          _baseurlInner;
      }
      let queryParametres = "";

      if (settings.skipParse === false) {
        settings.data = JSON.parse(
          JSON.stringify(settings.data, function (k, v) {
            return v === undefined ? null : v;
          }),
          valueReviver
        );
      }
      // if (String(settings.method).toUpperCase() === "GET") {
      //   let str = [];
      //   for (let p in settings.data) {
      //     if (settings.data.hasOwnProperty(p)) {
      //       if (settings.data[p] !== undefined) {
      //         let _newData = settings.data[p];
      //         if (typeof _newData === "object") {
      //           _newData = JSON.stringify(_newData);
      //         }
      //         str.push(
      //           encodeURIComponent(p) + "=" + encodeURIComponent(_newData)
      //         );
      //       }
      //     }
      //   }
      //   settings.data = {};
      //   queryParametres = "?" + str.join("&");
      // }
      let cancelRequest = {};
      if (settings.cancelRequestId !== null) {
        axiosCancel(axios, {
          debug: false,
        });

        cancelRequest = {
          requestId: settings.cancelRequestId,
        };
      }
      const _contentType = settings.header !== undefined ? settings.header : {};

      const Params =
        String(settings.method).toUpperCase() === "GET"
          ? { params: settings.data }
          : { data: settings.data };
      const timmer =
        settings.timerNotRequired === undefined
          ? {
              timeout:
                settings.timeout !== undefined ? settings.timeout : 60000,
            }
          : {};
      axios({
        method: settings.method,
        url: settings.baseUrl + settings.uri + queryParametres,
        headers: {
          "x-api-key": headerToken,
          // "x-app-user-identity": x_app_user_identity,
          "x-client-ip": myIP,
          "x-branch": x_branch,
          ..._contentType,
        },
        httpAgent: new Agent({
          maxSockets: 100,
          timeout: 60000, // active socket keepalive for 60 seconds
          freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
        }), //new http.Agent({ keepAlive: true }),
        ...settings.others,
        ...Params,
        ...timmer,
        ...cancelRequest,
      })
        .then((response) => {
          if (typeof settings.onSuccess === "function")
            settings.onSuccess(response);
        })
        .catch((err) => {
          if (typeof settings.onCatch === "function") {
            settings.onCatch(err);
            return;
          }
          AlgaehLoader({ show: false });
          if (!showOtherPopup) {
            return;
          }
          if (
            settings.cancelRequestId !== undefined ||
            settings.cancelRequestId !== null ||
            settings.cancelRequestId !== ""
          ) {
            if (axios.isCancel(err)) {
              if (process.env.NODE_ENV === "development")
                console.warn("Request canceled :", err.message);
            }
          }
          if (err.response !== undefined) {
            const { status, data } = err.response;
            if (status === 423) {
              showOtherPopup = false;
              reLoginPopup(data, userTokenDetails.hims_d_hospital_id);
              return;
            }
          }

          if (err.code === "ECONNABORTED") {
            if (process.env.NODE_ENV === "development") {
              console.error(
                "Error Message : \n" +
                  err.message +
                  " \n Detail Info : \n" +
                  JSON.stringify(err)
              );
            }
          } else {
            if (settings.module === "documentManagement") {
              const reader = new FileReader();
              reader.onload = function () {
                if (settings.onFileFailure === "function") {
                  settings.onFileFailure(reader.result);
                  return;
                } else {
                  console.error(reader.result);
                }
              };
              if (
                err.response === undefined &&
                err.message === "Network Error"
              ) {
                const routers = config.routersAndPorts;

                swalMessage({
                  title:
                    "'" +
                    routers[settings.module]["name"] +
                    "' module is not yet started",
                  type: "info",
                  position: "top",
                });
              } else {
                reader.readAsText(err.response.data);
              }
            } else if (
              err.response !== undefined &&
              err.response.headers["content-type"] === "text/plain"
            ) {
              const reader = new FileReader();
              reader.onload = function () {
                swalMessage({
                  title: reader.result,
                  type: "error",
                  position: "top",
                });
              };
              reader.readAsText(err.response.data);
            } else if (
              err.response === undefined &&
              err.message === "Network Error"
            ) {
              const routers = config.routersAndPorts;
              if (routers[settings.module] !== undefined) {
                swalMessage({
                  title:
                    "'" +
                    routers[settings.module]["name"] +
                    "' module is not yet started",
                  type: "info",
                  position: "top",
                });
              }
            } else if (
              err.response !== undefined &&
              err.response.headers["content-type"] ===
                "application/json; charset=utf-8"
            ) {
              if (
                err.response.data !== undefined &&
                err.response.data.success !== undefined
              ) {
                swalMessage({
                  title: err.response.data.message,
                  type: "error",
                  position: "top",
                });
              } else {
                swalMessage({
                  title: err.response.statusText,
                  type: "error",
                  position: "top",
                });
              }
            }
          }
        });
    })
    .catch((error) => {
      console.error("error", error);
    });
}

export function reLoginPopup({ message, username }, item_id) {
  if (username === undefined) {
    window.location.href = window.location.origin + "/#";
    return;
  }
  swal
    .fire({
      html: message,
      imageUrl:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAfpJREFUWIXtlc9rE0EUx7/vdQvrIXhY8RREkB7rpd68+UeElKqQU6AlG1csnkouYvFQWAIKOcUfRSTqP+Cpt1K9efNmTzkF6hQk4uQ9L90gIbuZsAkL4vc0O/Od7/swO7sP+K+CRfNu6PV6K/1+v6qqm8x8S0SuADDM/EVVD33ff1ev138vBSCO4zVm/gDgZobt62g0qkRR9G2hAHEcrwE4ZuZglldEBqp62wWCXYq3Wi0PwMekuIj8BLBnrb0xGAxWmfk6gL2LeTBzQETvO53O6qxszwUgCIIqgPWkuKreCcPw5C/LKYAn7Xb7E4AjAJeYeX04HFYBvMnKdjoBAJvjDcz7URSdTDOFYfgZwH7yTER3ZwW7AmwkA2vt2xnew2QgIhtZRmcAEbmajMvl8mmWt9FofB+HO1xYJwBmHn8tlUpllOUlInXJnAtgmSocIPVH1O12fWPMgapuMfPlHDXOAbwulUqParXacHIx9T9gjDkgom2iudvFpEoAdowxCqAxuZj6ClR1K2/libx70+ZTAXIeu3Ne4ZcwL8BDVfVVdbcQAFV90Ww2f1lrnxcCQERNAPA870EhAACeXYA8LQogt3IDxHF8rVAAZs5sz0sHyKssgPNFFhKRH/MCvFwkABFNzUvthqq6S0QQkfs5+8KZqr4C8DhHxj+sP0qDqkZPL8SGAAAAAElFTkSuQmCC",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Login",
      showCancelButton: true,
      allowOutsideClick: false,
      cancelButtonText: "Logout",
      input: "password",
      inputPlaceholder: "Re-enter your password",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
    })
    .then((rest) => {
      const { value, dismiss } = rest;
      showOtherPopup = true;
      if (dismiss === "cancel") {
        window.location.href = window.location.origin + "/#";
        return;
      }
      if (value !== undefined && value !== "") {
        // const item_id = getCookie("HospitalId");
        getLocalIP((identity) => {
          const dataSent = encrypter(
            JSON.stringify({
              username: username,
              password: value,
              item_id: item_id,
              identity: identity,
            })
          );

          algaehApiCall({
            uri: "/apiAuth/relogin",
            data: { post: dataSent },
            method: "POST",
            onSuccess: (response) => {
              const { success, err_message } = response.data;
              if (success === true) {
                swalMessage({ type: "success", title: "Continue" });
              } else {
                reLoginPopup({ message, username }, item_id);
                swalMessage({ type: "warning", title: err_message });
              }
            },
          });
        });
      } else {
        window.location.reload();
      }
    });
}

export function swalMessage(options) {
  const settings = {
    position: "top",
    showConfirmButton: false,
    timer: 4000,
    toast: true,
    ...options,
  };
  const toast = swal.mixin(settings);
  let title = settings.title;
  if (typeof title === "object") {
    if (
      settings.title.response !== undefined &&
      settings.title.response.data.message !== undefined
    ) {
      title = `${settings.title.response.status} \n ${settings.title.response.data.message}`;
    } else {
      title = settings.title.message;
    }
  }

  toast({ type: settings.type, title: title });
}

export function cancelRequest(requestId) {
  if (axios !== undefined && typeof axios.cancel === "function")
    axios.cancel(requestId);
}

export function SelectFiledData(options) {
  let settings = extend(
    {
      textField: "",
      valueField: "",
      selectedFiled: "",
      payload: null,
    },
    options
  );
  let Data = [];

  if (settings.textField !== "" && settings.valueField !== "") {
    for (let i = 0; i < settings.payload.length; i++) {
      let row = settings.payload[i];
      Data.push({
        name: row[settings.textField],
        value: row[settings.valueField],
      });
    }
  }
  return Data;
}

export function dateFomater(date) {
  if (moment(date).isValid) return moment(date).format(config.formators.date);
  else return date;
}

export async function getToken() {
  const details = await GetContextForm("authToken");
  if (details !== "") {
    return details;
  }
  return getCookie("authToken");
}
export function setToken(token, days) {
  // days = days || 30;
  // setCookie("authToken", token, days);
}

export function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
export function valueReviver(key, value) {
  if (typeof value === "string") {
    value = String(value).trim();

    if (value === null || value === undefined) {
      return value;
    }
    const num = /^[-+]?[0-9]+\.[0-9]+$/;
    let num_value = value.replace(/,/g, "");
    if (num.test(num_value)) {
      return parseFloat(num_value);
    }
  }
  if (typeof value === "string" && dateFormat.test(value)) {
    return moment(value).format("YYYY-MM-DD HH:mm");
  }

  return value;
}

export function collectIP() {
  const identity = window.localStorage.getItem("identity");
  var findIP = new Promise((r) => {
    if (identity !== null) {
      r(identity);
      return;
    }
    axios
      .get("http://localhost:1212/machineinfo")
      .then((response) => {
        let machineInfo = JSON.stringify(response.data);
        r(machineInfo);
      })
      .catch((error) => {
        const autoIP = new IDGenerator().generate();
        r(autoIP);
      });
  });
  if (identity === null) {
    findIP.then((ip) => {
      window.localStorage.setItem("identity", ip);
    });
  }
  return findIP;
}

export function getLocalIP(callback) {
  collectIP().then((IP) => {
    callback(IP);
  });
}

export function getNewLocalIp() {
  const identity = window.localStorage.getItem("identity");
  if (identity === null) {
    const generator = new IDGenerator();
    const _IdGen = generator.generate();
    window.localStorage.setItem("identity", _IdGen);
    return _IdGen;
  } else {
    return identity;
  }
}

function IDGenerator() {
  this.length = 9;
  this.timestamp = +new Date();

  var _getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  this.generate = function () {
    var ts = this.timestamp.toString();
    var parts = ts.split("").reverse();
    var id = "";

    for (var i = 0; i < this.length; ++i) {
      var index = _getRandomInt(0, parts.length - 1);
      id += parts[index];
    }

    return id;
  };
}

export function maxCharactersLeft(maxLength, value) {
  const left = value !== undefined && value !== null ? value.length : 0;
  return maxLength - left;
}
