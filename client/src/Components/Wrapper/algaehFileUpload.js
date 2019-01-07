import React, { Component } from "react";
import { Cropper } from "react-image-cropper";
import Dropzone from "react-dropzone";
import {
  algaehApiCall,
  getCookie,
  swalMessage
} from "../../utils/algaehApiCall";
import noImage from "../../assets/images/images.webp";
import { displayFileFromServer } from "../../utils/GlobalFunctions";
import Webcam from "react-webcam";
export default class AlgaehFileUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePreview: noImage,
      showCropper: false,
      showProgress: false,
      showZoom: false,
      progressPercentage: 0,
      fileExtention: "",
      openWebCam: false,
      showLoader: true,
      croppingDone: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.croppingDone === true && nextProps.saveFile !== undefined) {
      this.setState({
        croppingDone: false
      });
      this.SavingImageOnServer();
    }
    if (
      nextProps.serviceParameters.uniqueID !==
      this.props.serviceParameters.uniqueID
    ) {
      this.getDisplayImage(nextProps);
    }
  }
  componentDidMount() {
    if (
      this.props.onref !== undefined &&
      typeof this.props.onref === "function"
    ) {
      this.props.onref(this);
      this.getDisplayImage(this.props);
    } else this.getDisplayImage(this.props);
  }
  componentWillUnmount() {
    if (
      this.props.onref !== undefined &&
      typeof this.props.onref === "function"
    )
      this.props.onref(undefined);
  }
  getDisplayImage(propsP) {
    let _call = true;
    if (typeof propsP.validateBeforeCall === "function") {
      _call = propsP.validateBeforeCall();
    }
    if (typeof _call !== "boolean") {
      _call = true;
    }
    if (!_call) {
      this.setState({
        filePreview: noImage,
        showLoader: false
      });
      return;
    }
    const that = this;
    if (
      propsP.serviceParameters.uniqueID !== null &&
      propsP.serviceParameters.uniqueID !== ""
    ) {
      displayFileFromServer({
        uri: "/Document/get",
        module: "documentManagement",
        fileType: propsP.serviceParameters.fileType,
        destinationName: propsP.serviceParameters.uniqueID,
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
                filePreview: noImage,
                showLoader: false
              });
            }
          }
        },
        onFileFailure: data => {
          if (propsP.events !== undefined) {
            if (typeof propsP.events.onFailure === "function") {
              propsP.events.onFailure(data);
            }
          } else {
            that.setState({
              filePreview: noImage,
              showLoader: false
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
          filePreview: noImage,
          showLoader: false
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props || nextState !== this.state) {
      return true;
    } else return false;
  }
  // resizingAndCompressImage(file) {
  //   const _buffer = sharp(file.preview)
  //     .webp({
  //       lossless: true,
  //       alphaQuality: 80
  //     })
  //     .toBuffer();
  //   return new Buffer(_buffer).toString("base64");
  // }

  dropZoneHandlerOnDrop(file) {
    const _file = file[0];

    const _fileExtention = _file.name.split(".");
    if (_file.type.indexOf("image") > -1) {
      //----new Compression method

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
          const _dataURL = elem.toDataURL("image/webp", 0.7);
          this.setState({
            showCropper: true,
            filePreview: _dataURL, //this.resizingAndCompressImage(_file),
            fileExtention: "image/webp",
            croppingDone: false
          });
        };
      };
      //---End compression
    } else {
      this.setState({
        fileExtention: _fileExtention[_fileExtention.length - 1],
        croppingDone: false
      });
    }
  }
  onCloseCropperHandler(e) {
    const _from = e.target.getAttribute("from");
    if (_from === "crop")
      this.setState({ showCropper: false, filePreview: "" });
    if (_from === "zoom") this.setState({ showZoom: false });
  }
  onCroppedHandler(e) {
    this.setState(
      {
        showCropper: false,
        filePreview: this.cropperImage.crop(),
        croppingDone: true
      },
      () => {
        if (this.props.saveFile === undefined) this.SavingImageOnServer();
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
      null;
    }
  }

  zoomImageImplement() {
    if (this.state.showZoom) {
      return (
        <div className="Image-cropper zoomCntr">
          <img src={this.state.filePreview} />
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
    if (this.props.serviceParameters.uniqueID === "") {
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

  SavingImageOnServer(dataToSave, fileExtention) {
    const that = this;
    dataToSave = dataToSave || that.state.filePreview;
    fileExtention = fileExtention || that.state.fileExtention;
    //debugger;

    const _pageName = getCookie("ScreenName").replace("/", "");
    const _needConvertion =
      that.props.needConvertion === undefined
        ? {}
        : { needConvertion: that.props.needConvertion };
    const _splitter = dataToSave.split(",");
    // const mime = _splitter[0].match(/:(.*?);/)[1];
    // const _blob = atob(_splitter[1]);
    // const reader = new FileReader();
    // reader.readAsArrayBuffer([_blob], { type: mime });

    // reader.onloadend = () => {
    //console.log("Render result", reader.result);
    algaehApiCall({
      uri: "/Document/save",
      method: "POST",
      data: _splitter[1],
      module: "documentManagement",
      header: {
        "content-type": "multipart/form-data", //"application/octet-stream",
        "x-file-details": JSON.stringify({
          pageName: _pageName,
          destinationName: that.props.serviceParameters.uniqueID,
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
            that.setState({
              progressPercentage: 100,
              showProgress: false
            });
          } else {
            that.setState({
              progressPercentage: percentCompleted,
              showProgress: true
            });
          }
        }
      },
      onSuccess: result => {
        if (result.data.success) {
          swalMessage({
            croppingDone: false,
            title: "Image Uploaded Successfully",
            type: "success"
          });
        } else {
          swalMessage({
            croppingDone: false,
            title: "Image Uploding failure",
            type: "Error"
          });
        }
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
    } else null;
  }
  webCamHandler(e) {
    this.setState({
      openWebCam: true
    });
  }
  webCamCloseHandler(e) {
    this.setState({
      openWebCam: false
    });
  }
  webcamCaptureImage(e) {
    const short = this.webCam.getScreenshot();
    this.setState({ filePreview: short, openWebCam: false, showCropper: true });
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
    } else null;
  }
  implementLoader() {
    if (this.state.showLoader) {
      return (
        <div className="img-upload-loader">
          <i className="fas fa-spinner fa-spin" />
        </div>
      );
    } else null;
  }

  zoomHandler(e) {
    this.setState({
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
  }
}
