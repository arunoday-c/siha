import React, { Component } from "react";
import { Cropper } from "react-image-cropper";
import Dropzone from "react-dropzone";
import {
  algaehApiCall,
  getCookie,
  swalMessage
} from "../../utils/algaehApiCall";
// import noImage from "../../assets/images/no-image.jpg";
import SelectNoImage from "./images";
import { displayFileFromServer } from "../../utils/GlobalFunctions";
import Webcam from "react-webcam";
export default class AlgaehFileUploader extends Component {
  constructor(props) {
    super(props);

    this.noImage = SelectNoImage("no-image");
    if (props.noImage !== undefined) {
      this.noImage = SelectNoImage(props.noImage);
    }

    this.state = {
      processDelay: undefined,
      fileName: undefined,
      filePreview: this.noImage,
      oldImage: undefined,
      showCropper: false,
      showProgress: false,
      showZoom: false,
      progressPercentage: 0,
      fileExtention: "",
      openWebCam: false,
      showLoader: true,
      croppingDone: false,
      outSaveFunction: undefined,
      forceRefreshed: undefined
    };
  }
  componentWillReceiveProps(nextProps) {
    // const _refresh =
    //   nextProps.forceRefresh !== undefined
    //     ? this.state.forceRefreshed !== undefined
    //       ? true
    //       : nextProps.forceRefresh
    //     : nextProps.forceRefresh;
    // if (_refresh !== undefined) {
    //   this.setState({
    //     filePreview: this.noImage
    //   });
    //   return;
    // }

    if (nextProps.renderPrevState !== undefined) {
      this.setState({ ...nextProps.renderPrevState.state });
      return;
    } else if (
      nextProps.forceRefresh !== undefined &&
      nextProps.forceRefresh === true
    ) {
      if (this.state.forceRefreshed === undefined) {
        this.setState({ filePreview: this.noImage }, () => {
          this.setState({ forceRefreshed: true });
        });
      }
    }

    if (nextProps.onlyDragDrop === undefined) {
      if (
        this.state.croppingDone === true &&
        nextProps.saveFile !== undefined
      ) {
        this.setState({
          forceRefreshed: undefined,
          croppingDone: false,
          processDelay: nextProps.serviceParameters.processDelay
        });
        if (nextProps.serviceParameters.processDelay === undefined)
          this.SavingImageOnServer();
      }
      if (
        nextProps.serviceParameters.uniqueID !==
        this.props.serviceParameters.uniqueID
      ) {
        this.getDisplayImage(nextProps);
      }
    }
    // if (
    //   this.state.processDelay !== nextProps.serviceParameters.processDelay &&
    //   this.state.fileName !== undefined &&
    //   nextProps.serviceParameters.uniqueID !== undefined &&
    //   nextProps.serviceParameters.uniqueID !== ""
    // ) {
    //   this.SavingImageOnServer();
    // }
  }
  componentDidMount() {
    if (this.props.onlyDragDrop === undefined) {
      if (
        this.props.onref !== undefined &&
        typeof this.props.onref === "function"
      ) {
        this.props.onref(this);
        this.getDisplayImage(this.props);
      } else this.getDisplayImage(this.props);
    } else {
      this.setState({
        filePreview: undefined
      });
    }
  }
  componentWillUnmount() {
    if (
      this.props.onref !== undefined &&
      typeof this.props.onref === "function"
    )
      this.props.onref(undefined);
  }
  getDisplayImage(propsP) {
    const { uniqueID, fileType } = propsP.serviceParameters;
    let _call = true;
    if (typeof propsP.validateBeforeCall === "function") {
      _call = propsP.validateBeforeCall();
    }
    if (typeof _call !== "boolean") {
      _call = true;
    }
    if (!_call) {
      this.setState({
        filePreview: this.noImage,
        showLoader: false,
        forceRefreshed: undefined
      });
      return;
    }
    const that = this;
    // just to make sure we won't repeat bug 168
    const splitID = uniqueID ? uniqueID.split("_") : [];
    if (splitID[0] && splitID[0] !== "null") {
      displayFileFromServer({
        uri: "/Document/get",
        module: "documentManagement",
        fileType: fileType,
        destinationName: uniqueID,
        addDataTag: propsP.addDataTag === undefined ? true : propsP.addDataTag,
        onFileSuccess: data => {
          if (propsP.events !== undefined) {
            if (typeof propsP.events.onSuccess === "function") {
              propsP.events.onSuccess(data);
            }
          } else {
            if (data !== undefined && data !== "") {
              that.setState({ filePreview: data, showLoader: false });
            } else {
              that.setState({
                filePreview: this.noImage,
                showLoader: false,
                forceRefreshed: undefined
              });
            }
          }
        },
        onNoContent: () => {
          that.setState({
            filePreview: this.noImage,
            showLoader: false,
            forceRefreshed: undefined
          });
        },
        onFileFailure: data => {
          if (propsP.events !== undefined) {
            if (typeof propsP.events.onFailure === "function") {
              propsP.events.onFailure(data);
            }
          } else {
            that.setState({
              filePreview: this.noImage,
              showLoader: false,
              forceRefreshed: undefined
            });
          }
        }
      });
    } else {
      if (propsP.events !== undefined) {
        if (typeof propsP.events.onFailure === "function") {
          propsP.events.onFailure();
        }
      } else {
        that.setState({
          filePreview: this.noImage,
          showLoader: false,
          forceRefreshed: undefined
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props || nextState !== this.state) {
      return true;
    } else return false;
  }

  dropZoneHandlerOnDrop(file) {
    if (file.length === 0) {
      return;
    }
    const _file = file[0];

    const _fileExtention = _file.name.split(".");
    if (_file.type.indexOf("image") > -1) {
      const reader = new FileReader();
      reader.readAsDataURL(_file);

      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const elem = document.createElement("canvas");
          elem.height = img.height;
          elem.width = img.width;
          const ctx = elem.getContext("2d");
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const _dataURL = elem.toDataURL("image/webp", 1);
          this.setState({
            showCropper: true,
            filePreview: _dataURL, //this.resizingAndCompressImage(_file),
            fileExtention: "image/webp",
            croppingDone: false,
            forceRefreshed: undefined
          });
        };
      };
      //---End compression
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(_file);
      reader.onloadend = () => {
        const _result = reader.result;
        if (this.props.serviceParameters.processDelay === undefined) {
          this.SavingImageOnServer(
            _result,
            _fileExtention[_fileExtention.length - 1],
            _file.name
          );
        }
      };

      this.setState({
        croppingDone: false,
        fileName: _fileExtention,
        forceRefreshed: undefined
      });
    }
  }

  onCloseCropperHandler(e) {
    const _from = e.target.getAttribute("from");
    if (_from === "crop")
      this.setState({
        forceRefreshed: undefined,
        showCropper: false,
        filePreview:
          this.state.oldImage !== undefined
            ? this.state.oldImage
            : this.noImage,
        oldImage: undefined
      });
    if (_from === "zoom")
      this.setState({ forceRefreshed: undefined, showZoom: false });
  }
  onCroppedHandler(e) {
    this.setState(
      {
        oldImage: this.state.filePreview,
        showCropper: false,
        filePreview: this.cropperImage.crop(),
        croppingDone: true,
        forceRefreshed: undefined
      },
      () => {
        if (this.props.serviceParameters.processDelay === undefined)
          this.SavingImageOnServer();
        else {
          if (typeof this.props.serviceParameters.processDelay === "function")
            this.props.serviceParameters.processDelay(this);
        }
      }
    );
  }
  cropperImplement() {
    if (this.state.showCropper) {
      return (
        <div className="Image-cropper ">
          <Cropper
            src={this.state.filePreview}
            ref={ref => {
              this.cropperImage = ref;
            }}
            fixedRatio={false}
          />
          <div className="row crop-action">
            {" "}
            <button
              className="btn btn-default"
              from="crop"
              onClick={this.onCloseCropperHandler.bind(this)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={this.onCroppedHandler.bind(this)}
            >
              Crop
            </button>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  zoomImageImplement() {
    if (this.state.showZoom) {
      return (
        <div className="Image-cropper zoomCntr">
          <img src={this.state.filePreview} alt="image" />
          <div className="row crop-action">
            {" "}
            <button
              className="btn btn-default"
              from="zoom"
              onClick={this.onCloseCropperHandler.bind(this)}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }
  }

  showAttachmentHandler(e) {
    if (
      this.props.serviceParameters.uniqueID === "" &&
      this.props.serviceParameters.processDelay === undefined
    ) {
      const _messageUniqueBlank =
        this.props.uniqueBlankMessage === undefined
          ? "With out unique image can not process"
          : this.props.uniqueBlankMessage;
      swalMessage({
        title: _messageUniqueBlank,
        type: "error"
      });
      return;
    }
    this.imager.click();
  }

  SavingImageOnServer(dataToSave, fileExtention, fileName, uniqueID, callBack) {
    const that = this;
    dataToSave = dataToSave || that.state.filePreview;
    fileExtention = fileExtention || that.state.fileExtention;
    fileName = fileName || "";
    uniqueID = uniqueID || that.props.serviceParameters.uniqueID;
    callBack = callBack || undefined;
    const _pageName =
      this.props.pageName !== undefined
        ? this.props.pageName
        : getCookie("ScreenName").replace("/", "");
    const _needConvertion =
      that.props.needConvertion === undefined
        ? {}
        : { needConvertion: that.props.needConvertion };

    const _splitter = dataToSave.split(",");
    algaehApiCall({
      uri: "/Document/save",
      method: "POST",
      data: _splitter[1],
      module: "documentManagement",
      header: {
        "content-type": "multipart/form-data", //"application/octet-stream",
        "x-file-details": JSON.stringify({
          pageName: _pageName,
          destinationName: uniqueID,
          fileType: that.props.serviceParameters.fileType,
          fileExtention: fileExtention,
          ..._needConvertion
        })
      },
      others: {
        onUploadProgress: progressEvent => {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          if (percentCompleted >= 100) {
            that.setState(
              {
                progressPercentage: 100,
                showProgress: false,
                forceRefreshed: undefined
              },
              () => {
                if (
                  that.props.onlyDragDrop !== undefined &&
                  that.props.onlyDragDrop === true
                ) {
                  if (
                    that.props.afterSave !== undefined &&
                    typeof that.props.afterSave === "function"
                  )
                    that.props.afterSave({
                      uniqueID: that.props.serviceParameters.uniqueID,
                      fileType: that.props.serviceParameters.fileType,
                      fileName: fileName,
                      filePreview: dataToSave,
                      componentType: that.props.componentType
                    });
                }
              }
            );
          } else {
            that.setState({
              progressPercentage: percentCompleted,
              showProgress: true,
              oldImage: undefined,
              forceRefreshed: undefined
            });
          }
        }
      },
      onSuccess: result => {
        if (result.data.success) {
          if (typeof callBack === "function") callBack("success");
          if (this.props.serviceParameters.processDelay === undefined) {
            swalMessage({
              croppingDone: false,
              title: "File Uploaded Successfully",
              type: "success"
            });
          }
        } else {
          if (typeof callBack === "function") callBack("failure");
          swalMessage({
            croppingDone: false,
            title: "File Uploding failure",
            type: "Error"
          });
        }
      },
      onFailure: failure => {
        if (typeof callBack === "function") callBack("failure");
        swalMessage({
          title: failure.message,
          type: "failure"
        });
      }
    });
    //};
  }
  implementProgressBar() {
    if (this.state.showProgress) {
      return (
        <div className="attach-design text-center">
          <p
            className="img-upload-progress"
            style={{ width: this.state.progressPercentage + "%" }}
          >
            {this.state.progressPercentage}%
          </p>
        </div>
      );
    } else return null;
  }
  webCamHandler(e) {
    this.setState({
      openWebCam: true,
      forceRefreshed: undefined
    });
  }
  webCamCloseHandler(e) {
    this.setState({
      openWebCam: false,
      forceRefreshed: undefined
    });
  }
  webcamCaptureImage(e) {
    const short = this.webCam.getScreenshot();
    this.setState({
      forceRefreshed: undefined,
      oldImage: this.state.filePreview,
      filePreview: short,
      openWebCam: false,
      showCropper: true
    });
  }
  implementWebCam() {
    if (this.state.openWebCam) {
      return (
        <div className=" image-area-cntr">
          <Webcam
            className="captureVideo"
            screenshotFormat="image/jpeg"
            ref={ref => {
              this.webCam = ref;
            }}
          />
          <div className="videoActions">
            <i
              className="fas fa-times"
              onClick={this.webCamCloseHandler.bind(this)}
            />
            <i
              className="fas fa-camera"
              onClick={this.webcamCaptureImage.bind(this)}
            />
          </div>
        </div>
      );
    } else return null;
  }
  implementLoader() {
    if (this.state.showLoader) {
      return (
        <div className="img-upload-loader">
          <i className="fas fa-spinner fa-spin" />
        </div>
      );
    } else return null;
  }

  zoomHandler(e) {
    this.setState({
      forceRefreshed: undefined,
      showZoom: true
    });
  }

  render() {
    const _accept =
      this.props.accept !== undefined ? { accept: this.props.accept } : {};
    const _alt =
      this.props.textAltMessage !== undefined
        ? this.props.textAltMessage
        : "No File Preview";
    const _showControl =
      this.props.showControl === undefined ? true : this.props.showControl;
    const _showActions =
      this.props.showActions === undefined ? true : this.props.showActions;
    const _disabled = { disabled: !_showActions };
    const _onDragDrop =
      this.props.onlyDragDrop === undefined ? false : this.props.onlyDragDrop;
    if (!_onDragDrop) {
      if (_showControl) {
        return (
          <React.Fragment>
            {this.cropperImplement()}
            {this.zoomImageImplement()}
            {this.implementWebCam()}
            <div className="image-drop-area">
              <Dropzone
                className="dropzone"
                name={this.props.name + "_DropZone"}
                onDrop={this.dropZoneHandlerOnDrop.bind(this)}
                {..._accept}
                {..._disabled}
              >
                <img
                  src={this.state.filePreview}
                  alt={_alt}
                  ref={ref => {
                    this.imager = ref;
                  }}
                />
                {this.implementProgressBar()}
              </Dropzone>
              {this.implementLoader()}

              {_showActions ? (
                <div className="img-upload-actions">
                  <i
                    className="fas fa-paperclip"
                    onClick={this.showAttachmentHandler.bind(this)}
                  />
                  <i
                    className="fas fa-camera"
                    onClick={this.webCamHandler.bind(this)}
                  />
                  <i
                    className="fas fa-search-plus"
                    onClick={this.zoomHandler.bind(this)}
                  />
                </div>
              ) : null}
            </div>
          </React.Fragment>
        );
      } else {
        return <React.Fragment />;
      }
    } else {
      return (
        <React.Fragment>
          <Dropzone
            className="dropzone"
            // maxSize={15728640}
            {..._accept}
            onDrop={this.dropZoneHandlerOnDrop.bind(this)}
          >
            <div className="upload-drop-zone">
              <b> {this.props.textAltMessage} </b>
              <br />
              <span>drag and drop files here</span>
            </div>
            {this.implementProgressBar()}
          </Dropzone>
        </React.Fragment>
      );
    }
  }
}
