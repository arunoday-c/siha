import React from "react";
import axios from "axios";
import extend from "extend";
import moment from "moment";
import swal from "sweetalert";
import Slide from "@material-ui/core/Slide";
import config from "../utils/config.json";
import { setGlobal, removeGlobal } from "./GlobalFunctions";
import Enumerable from "linq";
export function algaehApiCall(options) {
  // "baseUrl": "http://192.168.0.149:3000/api/v1",
  if (!window.navigator.onLine) {
    swal({
      title: "Connection Error",
      text:
        "Looks like you're not connected to any network, please make sure you connect and try again",
      icon: "images/nointernet.png",
      button: false,
      timer: 5000
    });
    return false;
  } else {
    if (
      window.navigator.connection !== undefined &&
      window.navigator.connection.effectiveType === "2g"
    ) {
      <Slide
        open={true}
        direction="up"
        vertical="top"
        horizontal="center"
        message={<span>Low internet connectivity</span>}
      />;
    }
  }

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

  const headerToken = getToken();
  const x_app_user_identity = getCookie("keyResources");
  //console.log("identity", x_app_user_identity);
  if (settings.uri != null || settings.uri != "") {
    if (settings.isfetch) {
      return fetch(settings.baseUrl + settings.uri + queryParametres, {
        method: settings.method,
        headers: {
          "x-api-key": headerToken,
          "x-app-user-identity": x_app_user_identity
        },
        body: JSON.stringify(settings.data)
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

    let cancelRequest = {};
    if (
      settings.cancelRequestId !== undefined ||
      settings.cancelRequestId !== null ||
      settings.cancelRequestId !== ""
    ) {
      let CancelToken = axios.CancelToken;
      let source = CancelToken.source();
      cancelRequest = {
        cancelToken: source.token
      };
      let previousRequestId =
        Window.global("req_cancel") === undefined
          ? []
          : Window.global("req_cancel");
      previousRequestId.push({ id: settings.cancelRequestId, source: source });
      const removeAdd = Enumerable.from(previousRequestId)
        .where(w => w.id !== settings.cancelRequestId)
        .toArray();
      removeGlobal("req_cancel");
      setGlobal({ req_cancel: removeAdd });
    }

    axios({
      method: settings.method,
      url: settings.baseUrl + settings.uri + queryParametres,
      headers: {
        "x-api-key": headerToken,
        "x-app-user-identity": x_app_user_identity
      },
      data: settings.data,
      timeout: settings.timeout,
      ...cancelRequest
    })
      .then(response => {
        if (
          settings.cancelRequestId !== undefined ||
          settings.cancelRequestId !== null ||
          settings.cancelRequestId !== ""
        ) {
          let previousRequestId =
            Window.global("req_cancel") === undefined
              ? []
              : Window.global("req_cancel");
          const removeAdd = Enumerable.from(previousRequestId)
            .where(w => w.id !== settings.cancelRequestId)
            .toArray();
          removeGlobal("req_cancel");
          setGlobal({ req_cancel: removeAdd });
        }

        if (typeof settings.onSuccess == "function")
          settings.onSuccess(response);
      })
      .catch(function(err) {
        if (
          settings.cancelRequestId !== undefined ||
          settings.cancelRequestId !== null ||
          settings.cancelRequestId !== ""
        ) {
          let previousRequestId =
            Window.global("req_cancel") === undefined
              ? []
              : Window.global("req_cancel");
          const removeAdd = Enumerable.from(previousRequestId)
            .where(w => w.id !== settings.cancelRequestId)
            .toArray();
          removeGlobal("req_cancel");
          setGlobal({ req_cancel: removeAdd });
          if (axios.isCancel(err)) {
            console.log("Request canceled :", err.message);
          }
        }

        if (typeof settings.onFailure == "function") settings.onFailure(err);
      });
  }
}

export function cancelRequest(requestId) {
  let getRequest =
    Window.global("req_cancel") === undefined
      ? []
      : Window.global("req_cancel");

  const exactRequet = Enumerable.from(getRequest)
    .where(w => w.id === requestId)
    .firstOrDefault();
  if (exactRequet !== undefined) {
    exactRequet.source.cancel("Operation Cancelled");
    const removeAdd = Enumerable.from(getRequest)
      .where(w => w.id !== requestId)
      .toArray();
    removeGlobal("req_cancel");
    setGlobal({ req_cancel: removeAdd });
  }
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

  if (settings.textField != "" && settings.valueField != "") {
    {
      settings.payload.map((row, index) =>
        Data.push({
          name: row[settings.textField],
          value: row[settings.valueField]
        })
      );
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
    ClientTimeFormat: "HH:MM",
    serverDateFromat: "YYYYMMDD",
    serverTimeFormat: "HHMMSS"
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
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
