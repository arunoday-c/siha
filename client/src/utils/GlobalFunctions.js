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
  debugger;
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
  if (settings.saveDirectly) {
    if (settings.destinationName === "" || settings.fileName === "") {
      swalMessage({
        title: "Please provide valid details for destinaion upload",
        type: "error"
      });
    }
  }
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
          "content-type": "application/json",
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
      // new Promise((resolve, reject) => {
      //   getLocalIP(myIP => {
      //     if (myIP !== undefined) {
      //       resolve(myIP);
      //     }
      //   });
      // }).then(myIP => {
      //   axios
      //     .post(config.baseUrl + "/masters/imageSave", formData, {
      //       headers: {
      //         "content-type": "multipart/form-data",
      //         "x-api-key": headerToken,
      //         "x-app-user-identity": x_app_user_identity,
      //         "x-client-ip": myIP
      //       },
      //       onUploadProgress: progressEvent => {
      //         let percentCompleted = Math.round(
      //           (progressEvent.loaded * 100) / progressEvent.total
      //         );

      //         if (percentCompleted >= 100) {
      //           settings.thisState.stateName.setState({
      //             [settings.thisState.stateProgressName]: 100,
      //             [settings.thisState.filePreview]: file.preview
      //           });
      //         } else {
      //           settings.thisState.stateName.setState({
      //             [settings.thisState.stateProgressName]: percentCompleted
      //           });
      //         }
      //       }
      //     })
      //     .then(data => {
      //       if (settings.onSuccess !== undefined) {
      //         settings.onSuccess({
      //           fileName: settings.thisState.filePreview,
      //           preview: file.preview
      //         });
      //       }
      //     })
      //     .catch(error => {
      //       if (settings.onFailure !== undefined) {
      //         settings.onFailure(error);
      //       } else {
      //         console.error(
      //           "Error in uploading file '" +
      //             settings.thisState.filePreview +
      //             "'",
      //           error
      //         );
      //       }

      //       settings.thisState.stateName.setState({
      //         [settings.thisState.stateProgressName]: 0
      //       });
      //     });
      // });
    });
  }
}
