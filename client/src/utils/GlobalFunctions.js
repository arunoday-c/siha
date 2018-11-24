import extend from "extend";
import { swalMessage, algaehApiCall, getCookie } from "../utils/algaehApiCall";

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
  debugger;
  if (settings.fileControl !== undefined) {
    settings.fileControl.map(file => {
      settings.thisState.stateName.setState({
        [settings.thisState.stateProgressName]: 0
      });
      if (settings.saveDirectly === false && settings.fileName === "") {
        settings.fileName = getCookie("ScreenName").replace("/", "");
      }
      const formData = new FormData();

      formData.append("file", file);
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
    debugger;
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
          _lable =
            _Validateerror[i].parentElement.parentElement
              .previousElementSibling;
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

export function getAmountFormart(value) {
  let currencySymbol = JSON.parse(sessionStorage.getItem("CurrencyDetail"));
  let printData = "";

  switch (currencySymbol.Position) {
    case "BWS":
      printData = value
        ? currencySymbol.Symbol + value
        : currencySymbol.Symbol + "0.00";
      break;
    case "BS":
      printData = value
        ? currencySymbol.Symbol + " " + value
        : currencySymbol.Symbol + " 0.00";
      break;
    case "AWS":
      printData = value
        ? value + currencySymbol.Symbol
        : "0.00" + currencySymbol.Symbol;
      break;
    case "AS":
      printData = value
        ? value + " " + currencySymbol.Symbol
        : "0.00 " + currencySymbol.Symbol;
      break;
    default:
      printData = "";
  }

  return printData;
}
