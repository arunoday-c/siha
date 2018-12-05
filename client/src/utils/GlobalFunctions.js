import extend from "extend";
import { swalMessage, algaehApiCall, getCookie } from "../utils/algaehApiCall";
import crypto from "crypto";
import Enumerable from "linq";
export function successfulMessage(options) {
  options.icon = options.icon || "error";

  swalMessage({
    text: options.message,
    type: options.icon
  });
}

export function setGlobal(obj) {
  let windglob = Window.global == null ? {} : Window.global;
  extend(windglob, obj);
  Window.global = windglob;
}

export function removeGlobal(name) {
  if (name !== undefined && Window.global !== undefined) {
    delete Window.global[name];
  }
}

export function resizeImage(options) {
  let settings = { maxWidth: 400, maxHeight: 400, ...options };
  let canvas = document.createElement("canvas");

  let imageControl = document.getElementById(settings.imgId);

  let MAX_WIDTH = settings.maxWidth;
  let MAX_HEIGHT = settings.maxHeight;
  let width = imageControl.width;
  let height = imageControl.height;
  if (width > height) {
    if (width > MAX_WIDTH) {
      height *= MAX_WIDTH / width;
      width = MAX_WIDTH;
    }
  } else {
    if (height > MAX_HEIGHT) {
      width *= MAX_HEIGHT / height;
      height = MAX_HEIGHT;
    }
  }
  canvas.width = width;
  canvas.height = height;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(imageControl, 0, 0, width, height);
  return canvas.toDataURL("image/png");
}
export function imageToByteArray(src) {
  let img = document.createElement("img");
  img.src = src;

  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  return canvas.toDataURL("image/png");
}
export function saveImageOnServer(options) {
  const settings = {
    ...{
      fileControl: undefined,
      pageName: "",
      fileName: "",
      saveDirectly: false,
      destinationName: ""
    },
    ...options
  };
  // if (settings.saveDirectly) {
  //   if (settings.destinationName === "" || settings.fileName === "") {
  //     swalMessage({
  //       title: "Please provide valid details for destinaion upload",
  //       type: "error"
  //     });
  //   }
  // }

  if (settings.fileControl !== undefined) {
    settings.fileControl.map(file => {
      settings.thisState.stateName.setState({
        [settings.thisState.stateProgressName]: 0
      });
      if (settings.saveDirectly === false && settings.fileName === "") {
        settings.fileName = getCookie("ScreenName").replace("/", "");
      }
      const formData = new FormData();
      debugger;
      formData.append("image", file);

      algaehApiCall({
        uri: "/masters/imageSave",
        data: formData,
        method: "POST",
        header: {
          "content-type": "multipart/form-data",
          "x-file-details": JSON.stringify({
            tempFileName: settings.fileName,
            pageName: settings.pageName,
            saveDirectly: settings.saveDirectly,
            destinationName: settings.destinationName,
            fileType: settings.fileType
          })
        },
        others: {
          onUploadProgress: progressEvent => {
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            if (percentCompleted >= 100) {
              settings.thisState.stateName.setState({
                [settings.thisState.stateProgressName]: 100,
                [settings.thisState.filePreview]: file.preview
              });
            } else {
              settings.thisState.stateName.setState({
                [settings.thisState.stateProgressName]: percentCompleted
              });
            }
          }
        }
      });
    });
  }
}
export function displayFileFromServer(options) {
  const _resize =
    options.resize !== undefined
      ? { resize: JSON.stringify(options.resize) }
      : {};
  algaehApiCall({
    uri: options.uri,
    method: "get",
    data: {
      fileType: options.fileType,
      destinationName: options.destinationName,
      fileName: options.fileName,
      ..._resize
    },
    others: { responseType: "arraybuffer" },
    onSuccess: response => {
      if (response.data) {
        const _data =
          "data:" +
          response.headers["content-type"] +
          ";base64," +
          new Buffer(response.data, "binary").toString("base64");
        if (typeof options.onFileSuccess === "function") {
          options.onFileSuccess(_data);
        }
      }
    },
    onFailure: () => {}
  });
}

export function getLabelFromLanguage(options) {
  if (options.fieldName !== undefined && options.fieldName !== "") {
    let langua = getCookie("Language");
    let screenName = getCookie("ScreenName") + "_";
    let fileName =
      screenName + (langua === undefined || langua === "" ? "en" : langua);
    let fileImport = "./languages/" + fileName + ".json";

    let savePage = window.localStorage.getItem(fileName);
    if (savePage !== null && savePage !== "") {
      let getLanguageLables = JSON.parse(savePage);
      return getLanguageLables[options.fieldName];
    } else {
      loadJSON(fileImport, data => {
        window.localStorage.removeItem(fileName);
        window.localStorage.setItem(fileName, JSON.stringify(data));
        return data[options.fieldName];
      });
    }
  } else {
    console.error("Label is missing with 'fieldName'");
  }
}
const loadJSON = (file, callback) => {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", file, true);
  xobj.onreadystatechange = function() {
    if (xobj.readyState === 4 && xobj.status === 200) {
      callback(JSON.parse(xobj.responseText));
    }
  };
  xobj.send(null);
};

export function AlgaehValidation(options) {
  const settings = {
    querySelector: "",
    multivalidate: false,
    appendingFieldName: "Cannotbeblank",
    alertTypeIcon: "warning",
    ...options
  };
  if (settings.skip !== undefined && settings.skip === true) {
    if (
      settings.onSuccess !== undefined &&
      typeof settings.onSuccess === "function"
    )
      settings.onSuccess();

    return;
  }
  let _rootValidationElement = null;
  // debugger;
  if (settings.querySelector !== undefined && settings.querySelector !== "")
    _rootValidationElement = document.querySelector(
      "[" + settings.querySelector + "]"
    );
  if (_rootValidationElement === null) {
    _rootValidationElement = document.querySelector("[id='root']");
  }
  let isError = false;

  const _Validateerror = _rootValidationElement.querySelectorAll("[required]");
  for (let i = 0; i < _Validateerror.length; i++) {
    let _checkVal = _Validateerror[i].getAttribute("checkvalidation");
    if (_checkVal !== null) {
      const _val =
        _Validateerror[i].value === "" ? "''" : _Validateerror[i].value;
      _checkVal = _checkVal.replace(/\$value/g, _val);
    }

    let _evalConditions = null;
    if (_checkVal === null) {
      if (_Validateerror[i].value === "") _evalConditions = true;
      else _evalConditions = false;
    } else {
      _evalConditions = _checkVal;
    }

    if (eval(_evalConditions)) {
      let _title = _Validateerror[i].getAttribute("errormessage");

      const _langua = getCookie("Language");

      if (_title === null) {
        let _lable = null;
        if (_Validateerror[i].previousSibling !== null) {
          if (_Validateerror[i].previousSibling.tagName === "LABEL") {
            _lable = _Validateerror[i].previousSibling;
          }
        } else {
          if (
            _Validateerror[i].parentElement.previousElementSibling.tagName ===
            "LABEL"
          ) {
            _lable = _Validateerror[i].parentElement.previousElementSibling;
          } else {
            _lable =
              _Validateerror[i].parentElement.parentElement
                .previousElementSibling;
          }
        }

        _title =
          _langua === "en"
            ? _lable.innerText
                .replace("*", "")
                .toLowerCase()
                .replace(/^\w/, c => {
                  return c.toUpperCase();
                }) + "-cannot be blank"
            : _lable.innerText.replace("*", "") + "- لا يمكن أن يكون فارغا";
      }
      swalMessage({
        title: _title,
        type: settings.alertTypeIcon
      });
      _Validateerror[i].focus();
      if (settings.onCatch !== undefined)
        settings.onCatch(_Validateerror[i].value);
      if (!settings.multivalidate) {
        isError = true;
        break;
      }
    }
  }
  if (!isError) {
    if (
      settings.onSuccess !== undefined &&
      typeof settings.onSuccess === "function"
    )
      settings.onSuccess();
  }
}

export function getAmountFormart(value, options) {
  return numberFormater(value, options);
}

export function numberFormater(value, options) {
  const settings = {
    ...JSON.parse(sessionStorage.getItem("CurrencyDetail")),
    ...{ appendSymbol: true },
    ...options
  };
  const precesions =
    settings.decimal_places !== undefined && settings.decimal_places !== ""
      ? parseFloat(settings.decimal_places)
      : 0;
  try {
    value =
      typeof value === "string" && value !== "" ? parseFloat(value) : value;
    value = typeof value !== "number" ? 0 : value;
  } catch (e) {
    value = 0;
  }

  let n = !isFinite(+value) ? 0.0 : +value;
  const prec = !isFinite(+precesions) ? 0 : Math.abs(precesions);

  const toFixedFix = (n, prec) => {
    const k = Math.pow(10, prec);
    return Math.round(n * k) / k;
  };
  let s = prec
    ? toFixedFix(n, prec)
    : Math.round(n)
        .toString()
        .split(".");
  if (s instanceof Array) {
    if (s[0].length > 3) {
      s[0] = s[0].replace(
        /\B(?=(?:\d{3})+(?!\d))/g,
        settings.thousand_separator
      );
    }
    if ((s[1] || "").length < prec) {
      s[1] = s[1] || "";
      s[1] += new Array(prec - s[1].length + 1).join("0");
    }
  }

  const result =
    s instanceof Array
      ? s.join(settings.decimal_separator)
      : parseFloat(s).toFixed(precesions);
  let currency = result;
  if (settings.appendSymbol) {
    switch (settings.symbol_position) {
      case "BWS":
        currency = settings.currency_symbol + result;
        break;
      case "BS":
        currency = settings.currency_symbol + " " + result;
        break;
      case "AWS":
        currency = result + settings.currency_symbol;
        break;
      case "AS":
        currency = result + " " + settings.currency_symbol;
        break;
      default:
        return;
    }
  }

  return currency;
}

export function SetBulkState(options) {
  if (options.querySelector === undefined) options.querySelector = "input";

  const _allControls = document.querySelectorAll(options.querySelector);
  let _objectCreation = {};
  for (let i = 0; i < _allControls.length; i++) {
    const _isExclude =
      _allControls[i].getAttribute("exclude") !== null
        ? _allControls[i].getAttribute("exclude")
        : "false";
    if (_isExclude === "false") {
      const _name = _allControls[i].getAttribute("name");
      const _dataRole = _allControls[i].getAttribute("data_role");

      if (_name !== null) {
        const _type = _allControls[i].getAttribute("type");
        if (_type === "checkbox") {
          _objectCreation[_name] = _allControls[i].checked ? "Y" : "N";
        } else if (_type === "radio") {
          _objectCreation[_name] = _allControls[i].checked
            ? _allControls[i].value
            : "N";
        } else {
          _objectCreation[_name] =
            _dataRole !== null
              ? _allControls[i].getAttribute("referencevalue")
              : _allControls[i].value;
        }
      }
    }
  }

  if (options.state !== undefined) {
    const _object = { ...options.state.state, ..._objectCreation };
    options.state.setState(_object, () => {
      if (
        options.callback !== undefined &&
        typeof options.callback === "function"
      )
        options.callback();
    });
  } else {
    return _objectCreation;
  }
}
const algorithm = "aes-256-ctr";
const containerId = "algaeh_hims_erp_container_1.0.0";
export function AlgaehCloseContainer(string) {
  let cipher = crypto.createCipher(algorithm, containerId);
  let crypted = cipher.update(string, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}
export function AlgaehOpenContainer(string) {
  var decipher = crypto.createDecipher(algorithm, containerId);
  var dec = decipher.update(string, "hex", "utf8");
  dec += decipher.final("utf8");

  return dec;
}
export function checkSecurity(options) {
  let currentSecurity =
    sessionStorage.getItem("AlgaehScreener") !== null
      ? JSON.parse(
          AlgaehOpenContainer(sessionStorage.getItem("AlgaehScreener"))
        )
      : undefined;
  if (currentSecurity !== undefined) {
    if (options.securityType === "componet") {
      const _hasComponets = Enumerable.from(
        currentSecurity.listOfComponentsToHide
      )
        .where(
          w =>
            w.component_code === options.component_code &&
            w.module_code === options.module_code &&
            w.screen_code === options.screen_code
        )
        .firstOrDefault();

      if (_hasComponets !== undefined) {
        if (
          options.hasSecurity !== undefined &&
          typeof options.hasSecurity === "function"
        ) {
          options.hasSecurity();
        }
      } else {
        if (
          options.hasNoSecurity !== undefined &&
          typeof options.hasNoSecurity === "function"
        ) {
          options.hasNoSecurity();
        }
      }
    } else if (options.securityType === "element") {
      const _hasElement = Enumerable.from(currentSecurity.screenElementsToHide)
        .where(
          w =>
            w.component_code === options.component_code &&
            w.module_code === options.module_code &&
            w.screen_code === options.screen_code &&
            w.screen_element_code === options.screen_element_code
        )
        .firstOrDefault();
      if (_hasElement !== undefined) {
        if (
          options.hasSecurity !== undefined &&
          typeof options.hasSecurity === "function"
        ) {
          options.hasSecurity(_hasElement);
        }
      } else {
        if (
          options.hasNoSecurity !== undefined &&
          typeof options.hasNoSecurity === "function"
        ) {
          options.hasNoSecurity();
        }
      }
    }
  } else {
    if (
      options.hasNoSecurity !== undefined &&
      typeof options.hasNoSecurity === "function"
    ) {
      options.hasNoSecurity();
    }
  }
}
