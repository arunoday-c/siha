import React, { PureComponent } from "react";
import { Cropper } from "react-image-cropper";
import Dropzone from "react-dropzone";
import {
  algaehApiCall,
  getCookie,
  swalMessage
} from "../../utils/algaehApiCall";

import { displayFileFromServer } from "../../utils/GlobalFunctions";
import Webcam from "react-webcam";
export default class AlgaehFileUploader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filePreview: "",
      showCropper: false,
      showProgress: false,
      progressPercentage: 0,
      fileExtention: "",
      openWebCam: false
    };
  }
  componentDidMount() {
    const that = this;
    displayFileFromServer({
      uri: "/masters/getFile",
      fileType: that.props.serviceParameters.fileType,
      destinationName: that.props.serviceParameters.destinationName,
      onFileSuccess: data => {
        that.setState({ filePreview: data });
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      filePreview: nextProps.src
    });
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
      this.setState({
        showCropper: true,
        filePreview: _file.preview, //this.resizingAndCompressImage(_file),
        fileExtention: "image/webp"
      });
    } else {
      this.setState({
        fileExtention: _fileExtention[_fileExtention.length - 1]
      });
    }
  }
  onCloseCropperHandler(e) {
    this.setState({ showCropper: false, filePreview: "" });
  }
  onCroppedHandler(e) {
    this.SavingImageOnServer();
    this.setState({
      showCropper: false,
      filePreview: this.cropperImage.crop()
    });
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

  showAttachmentHandler(e) {
    this.imager.click();
  }

  SavingImageOnServer() {
    const _pageName = getCookie("ScreenName").replace("/", "");
    const that = this;
    algaehApiCall({
      uri: "/masters/imageSave",
      method: "POST",
      data: that.cropperImage.crop().split(",")[1],
      header: {
        "content-type": "application/octet-stream",
        "x-file-details": JSON.stringify({
          pageName: _pageName,
          destinationName: that.props.serviceParameters.uniqueID,
          fileType: that.props.serviceParameters.fileType,
          fileExtention: that.state.fileExtention
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
  render() {
    const _accept =
      this.props.accept !== undefined ? { accept: this.props.accept } : {};
    const _alt =
      this.props.textAltMessage !== undefined
        ? this.props.textAltMessage
        : "No File Preview";
    return (
      <React.Fragment>
        {this.cropperImplement()}
        {this.implementWebCam()}
        <div className="image-drop-area">
          <Dropzone
            className="dropzone"
            name={this.props.name + "_DropZone"}
            onDrop={this.dropZoneHandlerOnDrop.bind(this)}
            {..._accept}
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
          <div className="img-upload-actions">
            <i
              className="fas fa-paperclip"
              onClick={this.showAttachmentHandler.bind(this)}
            />
            <i
              className="fas fa-camera"
              onClick={this.webCamHandler.bind(this)}
            />
            <i className="fas fa-search-plus" />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
