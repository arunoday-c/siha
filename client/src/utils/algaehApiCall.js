import ReactDOM from "react-dom";
import axios from "axios";
import extend from "extend";
import moment from "moment";
import swal from "sweetalert2";

import config from "../utils/config.json";
import axiosCancel from "axios-cancel";
import AlgaehLoader from "../Components/Wrapper/fullPageLoader.js";
const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
export function algaehApiCall(options) {
  // "baseUrl": "http://192.168.0.149:3000/api/v1",

  if (!window.navigator.onLine) {
    swalMessage({
      title:
        "Looks like you're not connected to any network,\n please make sure you connect and try again",
      imageUrl: "images/nointernet.png",
      imageHeight: 30,
      position: "center",
      timer: 4000
    });

    return false;
  } else {
    if (
      window.navigator.connection !== undefined &&
      window.navigator.connection.effectiveType === "2g"
    ) {
      swalMessage({
        title: "Low internet connectivity, response may be delay",
        imageUrl: "images/nointernet.png",
        imageHeight: 30,
        position: "top",
        timer: 4000
      });
    }
  }

  new Promise((resolve, reject) => {
    getLocalIP(myIP => {
      if (myIP !== undefined) {
        resolve(myIP);
      }
    });
  }).then(myIP => {
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
        cancelRequestId: null
      },
      options
    );
    let queryParametres = "";
    settings.data = JSON.parse(JSON.stringify(settings.data), valueReviver);
    if (String(settings.method).toUpperCase() === "GET") {
      let str = [];
      for (let p in settings.data) {
        if (settings.data.hasOwnProperty(p)) {
          if (settings.data[p] !== undefined)
            str.push(
              encodeURIComponent(p) + "=" + encodeURIComponent(settings.data[p])
            );
        }
      }
      settings.data = {};
      queryParametres = "?" + str.join("&");
      if (settings.printInput) {
        console.log(
          "Input data :",
          settings.baseUrl + settings.uri + queryParametres
        );
      }
    }
    if (settings.printInput) {
      console.log("Input data :", settings.data);
    }
    let cancelRequest = {};

    if (settings.cancelRequestId !== null) {
      axiosCancel(axios, {
        debug: false
      });

      cancelRequest = {
        requestId: settings.cancelRequestId
      };
    }
    const _contentType = settings.header !== undefined ? settings.header : {};

    const headerToken = getToken();
    const x_app_user_identity = getCookie("keyResources");
    //console.log("identity", x_app_user_identity);
    if (settings.uri !== undefined || settings.uri !== "") {
      if (settings.isfetch) {
        return fetch(settings.baseUrl + settings.uri + queryParametres, {
          method: settings.method,
          headers: {
            "x-api-key": headerToken,
            "x-app-user-identity": x_app_user_identity,
            "x-client-ip": myIP,
            ..._contentType
          },
          ...settings.others,
          body: JSON.stringify(settings.data),
          ...cancelRequest
        })
          .then(response => {
            if (response.status >= 200 && response.status < 300) {
              if (typeof settings.onSuccess === "function")
                settings.onSuccess(response);
            } else {
              const error = new Error(response.statusText);
              error.response = response;
              if (typeof settings.onFailure === "function")
                settings.onFailure(error);
              throw error;
            }
          })
          .catch(error => {
            console.error("request failed", error);
          });
      }
      const timmer =
        settings.timerNotRequired === undefined
          ? {
              timeout: settings.timeout !== undefined ? settings.timeout : 60000
            }
          : {};

      axios({
        method: settings.method,
        url: settings.baseUrl + settings.uri + queryParametres,
        headers: {
          "x-api-key": headerToken,
          "x-app-user-identity": x_app_user_identity,
          "x-client-ip": myIP,
          ..._contentType
        },
        ...settings.others,
        data: settings.data,
        ...timmer,
        ...cancelRequest
      })
        .then(response => {
          if (typeof settings.onSuccess === "function")
            settings.onSuccess(response);
        })
        .catch(err => {
          if (
            settings.cancelRequestId !== undefined ||
            settings.cancelRequestId !== null ||
            settings.cancelRequestId !== ""
          ) {
            if (axios.isCancel(err)) {
              if (process.env.NODE_ENV === "development")
                console.warn("Request canceled :", err.message);
              AlgaehLoader({
                show: false
              });
            }
          }

          if (err.code === "ECONNABORTED") {
            console.error(
              "Error Message : \n" +
                err.message +
                " \n Detail Info : \n" +
                JSON.stringify(err)
            );
            swalMessage({
              title: "Request taking long time to process....!",
              type: "info"
            });
          } else {
            if (typeof settings.onFailure === "function") {
              if (
                err.response !== undefined &&
                err.response.data !== undefined
              ) {
                if (err.response.data.message !== undefined) {
                  err.response.data.message = clearSqlMessage(
                    err.response.data.message
                  );
                } else {
                  err = {
                    response: {
                      data: {
                        message: err.response.statusText
                      }
                    }
                  };
                }
              }

              settings.onFailure(err);
            } else {
              if (
                err.response !== undefined &&
                err.response.data !== undefined
              ) {
                if (
                  Object.prototype.toString.call(err.response.data) ===
                  "[object ArrayBuffer]"
                ) {
                  err = JSON.parse(
                    new Buffer(err.response.data, "binary").toString()
                  );
                } else {
                  err = {
                    message: err.response.data.message
                  };
                }
                const _message = clearSqlMessage(err.response);
                swalMessage({
                  title: _message,
                  type: "error",
                  position: "top"
                });
              } else {
                const _message = clearSqlMessage(err.message);
                swalMessage({
                  title: _message,
                  type: "error",
                  position: "top"
                });
              }
            }
          }

          ReactDOM.unmountComponentAtNode(
            document.getElementById("fullPageLoader")
          );
        });
    }
  });
}
function clearSqlMessage(message) {
  return message;
  // let mess = message.split("_");
  // const _prev = message.split("_");
  // const lastMessage = mess[mess.length - 1];
  // if (lastMessage === lastMessage.toUpperCase()) {
  //   let newString = "";
  //   for (let i = 0; i < mess.length - 1; i++) {
  //     if (i !== 0) {
  //       newString += " ";
  //     }
  //     newString += mess[i]
  //       .replace(/\'\S/g, chara => {
  //         return chara.toUpperCase();
  //       })
  //       .replace(/^\w/, c => {
  //         return c.toUpperCase();
  //       });
  //   }
  //   const prevString = _prev.join("_");
  //   message = message.replace(prevString, newString + "'");
  // }
  // return message;
}
export function swalMessage(options) {
  const settings = {
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    toast: true,
    ...options
  };
  const toast = swal.mixin(settings);

  toast({ type: settings.type, title: settings.title });
}

export function cancelRequest(requestId) {
  axios.cancel(requestId);
}

export function SelectFiledData(options) {
  let settings = extend(
    {
      textField: "",
      valueField: "",
      selectedFiled: "",
      payload: null
    },
    options
  );
  let Data = [];

  if (settings.textField !== "" && settings.valueField !== "") {
    {
      for (let i = 0; i < settings.payload.length; i++) {
        let row = settings.payload[i];
        Data.push({
          name: row[settings.textField],
          value: row[settings.valueField]
        });
      }
    }
  }
  return Data;
}

export function isDateFormat(options, isSend) {
  isSend = isSend || false;
  var returnString = "";
  var defOpt = defaultOptions();
  var settings = extend(
    {
      date: null,
      isTime: false,
      usedefaultFarmats: true,
      format: !isSend ? defOpt.clientDateFormat : defOpt.serverDateFromat,
      existFormat: !isSend ? defOpt.serverDateFromat : defOpt.clientDateFormat
    },
    options
  );
  if (settings.isTime && settings.usedefaultFarmats) {
    settings.format = !isSend
      ? defOpt.ClientTimeFormat
      : defOpt.serverTimeFormat;
    settings.existFormat = !isSend
      ? defOpt.ClientTimeFormat
      : defOpt.serverTimeFormat;
  }
  if (settings.date !== null && settings.date !== "") {
    var dateasString = String(settings.date);
    if (dateasString !== "0") {
      returnString = moment(settings.date, settings.existFormat).format(
        settings.format
      );
    }
  }

  return returnString;
}

export function defaultOptions() {
  var output = {
    clientDateFormat: "YYYY-MM-DD",
    ClientTimeFormat: "HH:mm",
    serverDateFromat: "YYYYMMDD",
    serverTimeFormat: "HHmmss"
  };
  return output;
}

export function getToken() {
  return getCookie("authToken");
}
export function setToken(token, days) {
  days = days || 30;
  setCookie("authToken", token, days);
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
  }
  if (typeof value === "string" && dateFormat.test(value)) {
    return moment(value).format("YYYY-MM-DD HH:mm");
  }

  return value;
}
export function getLocalIP(callback) {
  if (window.myIP !== undefined && window.myIP !== "") {
    callback(window.myIP);
    return;
  }
  return new Promise((resolve, reject) => {
    window.RTCPeerConnection =
      /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection ||
      window.mozRTCPeerConnection;

    if (!window.RTCPeerConnection) {
      reject("Your browser does not support this API");
    }

    let pc = new RTCPeerConnection({ iceServers: [] }),
      noop = function(myIP) {
        if (myIP !== undefined) {
          window.myIP = myIP;
          resolve(myIP);
        }
      };
    pc.createDataChannel(""); //create a bogus data channel
    pc.createOffer(pc.setLocalDescription.bind(pc), noop); // create offer and set local description
    pc.onicecandidate = function(ice) {
      if (ice && ice.candidate && ice.candidate.candidate) {
        let myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(
          ice.candidate.candidate
        )[1];

        pc.onicecandidate = noop(myIP);
      }
    };
  })
    .then(myIP => {
      callback(myIP);
    })
    .catch(e => {
      const generator = new IDGenerator();
      const _IdGen = generator.generate();
      window.myIP = _IdGen;
      callback(_IdGen);
    });
}

function IDGenerator() {
  this.length = 9;
  this.timestamp = +new Date();

  var _getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  this.generate = function() {
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
