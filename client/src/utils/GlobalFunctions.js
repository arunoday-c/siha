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

export function getYears() {
  var min = new Date().getFullYear(),
    max = min + 10;

  min = min - 10;
  let allYears = [];
  for (let x = min; x <= max; x++) {
    allYears.push({ name: x, value: x });
  }
  return allYears;
}

export function getDays() {
  let monthDays = [];
  for (let i = 1; i <= 31; i++) {
    monthDays.push({
      name: i,
      value: i
    });
  }

  return monthDays;
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

  if (settings.fileControl !== undefined) {
    settings.fileControl.map(file => {
      settings.thisState.stateName.setState({
        [settings.thisState.stateProgressName]: 0
      });
      if (settings.saveDirectly === false && settings.fileName === "") {
        settings.fileName = getCookie("ScreenName").replace("/", "");
      }

      const reader = new FileReader();
      //reader.readAsBinaryString(file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        //  console.log("reader result " , reader.result)
        const fileAsBinaryString = reader.result.split(",")[1];
        const _fileName = file.name.split(".");
        algaehApiCall({
          uri: "/Document/save",
          data: fileAsBinaryString,
          method: "POST",
          module: "documentManagement",
          header: {
            "content-type": "application/octet-stream", // "multipart/form-data",
            "x-file-details": JSON.stringify({
              tempFileName: settings.fileName,
              pageName: settings.pageName,
              saveDirectly: settings.saveDirectly,
              destinationName: settings.destinationName,
              fileType: settings.fileType,
              fileExtention: _fileName[_fileName.length - 1]
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
          },
          onSuccess: result => {
            if (result.data.success) {
              swalMessage({
                title: "Image Uploaded Successfully",
                type: "success"
              });
            } else {
              swalMessage({
                title: "Image Uploding failure",
                type: "Error"
              });
            }
          }
        });
      };
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");

      // const formData = new FormData();
      // formData.append("file", reader);
      return;
    });
  }
}
export function displayFileFromServer(options) {
  const _resize =
    options.resize !== undefined
      ? { resize: JSON.stringify(options.resize) }
      : {};
  options.forceSkipNoContent = options.forceSkipNoContent || false;
  algaehApiCall({
    uri: options.uri,
    method: "GET",
    module: "documentManagement",
    headers: {
      Accept: "blob"
    },
    data: {
      fileType: options.fileType,
      destinationName: options.destinationName,
      ..._resize
    },
    others: { responseType: "blob" },
    onSuccess: response => {
      if (!options.forceSkipNoContent) {
        if (response.status === 204) {
          if (typeof options.onNoContent === "function") {
            options.onNoContent();
          }
          return;
        }
      }

      if (response.data) {
        let reader = new FileReader();

        reader.onloadend = () => {
          if (typeof options.onFileSuccess === "function") {
            options.onFileSuccess(reader.result);
          }
        };
        reader.readAsDataURL(response.data);
      }
    },
    onFailure: details => {
      if (
        options.onFileFailure !== undefined &&
        typeof options.onFileFailure === "function"
      ) {
        options.onFileFailure(details);
      }
    }
  });
}
export function saveFileOnServer(options) {
  const _pageName = getCookie("ScreenName").replace("/", "");
  const _splitter = options.file.split(",");
  algaehApiCall({
    uri: "/Document/save",
    method: "POST",
    data: _splitter[1],
    module: "documentManagement",
    header: {
      "content-type": "multipart/form-data",
      "x-file-details": JSON.stringify({
        pageName: _pageName,
        destinationName: options.uniqueID,
        fileType: options.fileType,
        fileExtention: options.fileExtention
      })
    },
    others: {
      onUploadProgress: progressEvent => {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (percentCompleted >= 100) {
          if (typeof options.afterSave === "function") options.afterSave();
        } else {
          if (typeof options.showProcess === "function") options.showProcess();
        }
      }
    },
    onSuccess: result => {
      if (result.data.success) {
        if (options.showSuccessMessage === undefined) {
          swalMessage({
            croppingDone: false,
            title: "File Uploaded Successfully",
            type: "success"
          });
        } else {
          if (typeof options.showSuccessMessage === "function") {
            options.showSuccessMessage(result);
          }
        }
      }
    }
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

  if (settings.querySelector !== undefined && settings.querySelector !== "")
    _rootValidationElement = document.querySelector(
      "[" + settings.querySelector + "]"
    );
  if (_rootValidationElement === null) {
    _rootValidationElement = document.querySelector("[id='root']");
  }
  let isError = false;

  const _Validateerror = _rootValidationElement.querySelectorAll(
    "[algaeh_required='true']"
  );
  for (let i = 0; i < _Validateerror.length; i++) {
    let _element = _Validateerror[i];
    let _checkVal = _element.getAttribute("checkvalidation");
    if (_Validateerror[i].tagName === "DIV") {
      _element = _Validateerror[i].children[0];
      if (_checkVal === null) {
        _checkVal = _Validateerror[i].getAttribute("checkvalidation");
      }
    }
    let value = "";
    if (_checkVal !== null) {
      const _val = _element.value; //_element.value === "" ? "''" : _element.value;
      value = _val;
      _checkVal = _checkVal.replace(/\$value/g, _val);
    }
    const _role = _element.getAttribute("data_role");
    let _evalConditions = null;
    if (_checkVal === null) {
      if (_role === null) {
        if (_element.value === "") {
          _evalConditions = true;
        } else _evalConditions = false;
      } else {
        const _reVal = _element.getAttribute("referencevalue");
        if (_reVal === null || _reVal === "") {
          _evalConditions = true;
        } else _evalConditions = false;
      }
    } else {
      _evalConditions = _checkVal;
    }

    if (eval(_evalConditions)) {
      let _title = _element.getAttribute("errormessage");
      if (_Validateerror[i].tagName === "DIV") {
        _title = _Validateerror[i].getAttribute("errormessage");
      }
      const _langua = getCookie("Language");

      if (_title === null) {
        let _lable = null;

        if (_role === "datepicker") {
          _lable = _element.offsetParent.offsetParent.innerText;
        } else if (_role === "dropdownlist") {
          _lable = _element.offsetParent.previousSibling.innerText;
        } else {
          _lable = _element.offsetParent.innerText;
          if (_Validateerror[i].tagName === "DIV") {
            _lable = _Validateerror[i].offsetParent.innerText;
          }
        }

        _title =
          _langua === "en"
            ? _lable
                .replace("*", "")
                .toLowerCase()
                .replace(/^\w/, c => {
                  return c.toUpperCase();
                }) + "- Can not be empty"
            : _lable.replace("*", "") + "- لا يمكن أن يكون فارغا";
      }
      swalMessage({
        title: _title,
        type: settings.alertTypeIcon
      });
      _element.focus();
      if (settings.onCatch !== undefined) settings.onCatch(_element.value);
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

  // else {
  //   if (
  //     settings.onSuccess !== undefined &&
  //     typeof settings.onSuccess === "function"
  //   )
  //     settings.onFailure();
  // }
}

export function getAmountFormart(value, options) {
  return numberFormater(value, options);
}

export function numberFormater(value, options) {
  let CurrencyDetail = JSON.parse(
    AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
  );
  const settings = {
    ...CurrencyDetail,
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
        } else if (_type === "date") {
          _objectCreation[_name] = new Date(_allControls[i].value);
        } else {
          let _iValue = _allControls[i].value;
          if (_dataRole !== null) {
            let _resp = _allControls[i].getAttribute("referencevalue");
            if (isNaN(_resp)) {
              _iValue = _resp;
            } else {
              _iValue =
                _resp !== undefined && _resp !== null && _resp !== ""
                  ? parseFloat(_resp)
                  : _resp;
            }
          }
          _objectCreation[_name] = _iValue;
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
export function retry(fn, retriesLeft = 5, interval = 1000) {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch(error => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error);
            return;
          }

          // Passing on "reject" is the important part
          retry(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
}
