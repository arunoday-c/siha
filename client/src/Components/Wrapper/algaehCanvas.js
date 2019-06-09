import React, { Component } from "react";
import { displayFileFromServer } from "../../utils/GlobalFunctions";
import "tui-image-editor/dist/tui-image-editor.css";
import ImageEditor from "@toast-ui/react-image-editor";
import icona from "tui-image-editor/dist/svg/icon-a.svg";
import iconb from "tui-image-editor/dist/svg/icon-b.svg";
import iconc from "tui-image-editor/dist/svg/icon-c.svg";
import icond from "tui-image-editor/dist/svg/icon-d.svg";
import "./imageEditor.css";
import Webcam from "react-webcam";
import moment from "moment";
import { swalMessage } from "../../utils/algaehApiCall";
export default class AlgaehCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image:
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      name: "algaeh-image-editor",
      imageLoaded: false,
      openWebCam: false
    };
    this.btnSave = {
      position: "absolute",
      top: "7px",
      right: 15,
      zIndex: 3,
      background: "#6ba25b",
      color: "#fff",
      width: "44px",
      height: "44px",
      fontSize: "1.5rem",
      textAalign: "center"
    };
    this.btnUpLoad = {
      position: "absolute",
      top: "55px",
      right: 15,
      zIndex: 3,
      background: "#fff",
      color: "#000",
      width: "44px",
      height: "44px",
      fontSize: "1.5rem",
      textAalign: "center"
    };
    this.btnCamera = {
      position: "absolute",
      top: "102px",
      right: 15,
      zIndex: 3,
      background: "#fff",
      color: "#000",
      width: "44px",
      height: "44px",
      fontSize: "1.5rem",
      textAalign: "center"
    };
    this.btnDiagramCntr = {
      position: "relative"
    };
  }

  componentDidMount() {
    this.editor.getRootElement().lastElementChild.firstElementChild.hidden = true;
    if (this.props.directImage === undefined) {
      this.loadImageFromDB();
    }
  }
  componentWillReceiveProps(props) {
    if (props.directImage === undefined) {
      this.loadImageFromDB();
    } else {
      if (
        (props.image !== undefined && !this.state.imageLoaded) ||
        this.props.image !== props.image
      ) {
        this.setState(
          {
            image: props.image,
            name: props.name,
            imageLoaded: true
          },
          () => {
            this.editor
              .getInstance()
              .loadImageFromURL(props.image, props.name)
              .then(result => {
                this.editor.getInstance().ui.resizeEditor({
                  imageSize: {
                    oldWidth: result.oldWidth,
                    oldHeight: result.oldHeight,
                    newWidth: result.newWidth,
                    newHeight: result.newHeight
                  }
                });
              })
              .catch(err => {
                console.error("Something went wrong:", err);
              });
          }
        );
      }
    }
  }
  loadImageFromDB(props) {
    const that = this;
    props = props || that.props;
    displayFileFromServer({
      uri: "/Document/get",
      module: "documentManagement",
      fileType: props.fileType,
      destinationName: props.uniqueID,
      addDataTag: false,
      onFileSuccess: data => {
        that.setState({ image: data }, () => {
          that.editor
            .getInstance()
            .loadImageFromURL(data, "Hello")
            .then(result => {
              that.editor.getInstance().ui.resizeEditor({
                imageSize: {
                  oldWidth: result.oldWidth,
                  oldHeight: result.oldHeight,
                  newWidth: result.newWidth,
                  newHeight: result.newHeight
                }
              });
            })
            .catch(err => {
              console.error("Something went wrong:", err);
            });
        });
      }
    });
  }

  loadImagaing(e) {
    if (this.editor.getInstance().toDataURL() === "data:,") {
      swalMessage({
        type: "warning",
        title: "no image to process..!"
      });
      return;
    }

    if (typeof this.props.onSave === "function") {
      this.props.onSave({
        image: this.editor.getInstance().toDataURL(),
        name: this.state.name
      });
    } else {
      var link = document.createElement("a");
      link.setAttribute("href", this.editor.getInstance().toDataURL());
      link.setAttribute("download", this.state.name + ".png");
      link.click();
    }
  }
  uploadImage(e) {
    this.fileUploader.click();
    // this.editor.getRootElement().lastElementChild.firstElementChild();
  }
  fileUploaderHandler(e) {
    if (e.currentTarget.files.length > 0) {
      const that = this;
      const _file = e.currentTarget.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(_file);
      reader.onloadend = () => {
        const _result = reader.result;
        that.setState({ image: _result, name: _file.name }, () => {
          if (typeof that.props.onUpload === "function") {
            that.props.onUpload({ image: _result, name: _file.name });
          }
          that.editor
            .getInstance()
            .loadImageFromURL(_result, _file.name)
            .then(result => {
              that.editor.getInstance().ui.resizeEditor({
                imageSize: {
                  oldWidth: result.oldWidth,
                  oldHeight: result.oldHeight,
                  newWidth: result.newWidth,
                  newHeight: result.newHeight
                }
              });
            })
            .catch(err => {
              console.error("Something went wrong:", err);
            });
        });
      };
    }
  }
  openWebCamHandler(e) {
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
    this.setState(
      {
        image: short,
        openWebCam: false
      },
      () => {
        if (typeof this.props.onAfterCapture === "function") {
          this.props.onAfterCapture({
            image: this.editor.getInstance().toDataURL(),
            name: this.state.name
          });
        }

        this.editor
          .getInstance()
          .loadImageFromURL(
            short,
            "Webcam_" + moment().format("YYYYMMDDHHmmss")
          )
          .then(result => {
            this.editor.getInstance().ui.resizeEditor({
              imageSize: {
                oldWidth: result.oldWidth,
                oldHeight: result.oldHeight,
                newWidth: result.newWidth,
                newHeight: result.newHeight
              }
            });
          })
          .catch(err => {
            console.error("Something went wrong:", err);
          });
      }
    );
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
  render() {
    const _showSave =
      this.props.showSave === undefined ? true : this.props.showSave;
    const _showUpload =
      this.props.showUpload === undefined ? true : this.props.showUpload;
    const _showCam =
      this.props.showCam === undefined ? true : this.props.showCam;
    return (
      <div style={this.btnDiagramCntr}>
        <ImageEditor
          ref={editor => {
            this.editor = editor;
          }}
          includeUI={{
            loadImage: {
              path: this.state.image,
              name: this.state.name
            },
            theme: {
              "menu.normalIcon.path": icond,
              "menu.activeIcon.path": iconb,
              "menu.disabledIcon.path": icona,
              "menu.hoverIcon.path": iconc,

              "submenu.backgroundColor": "#1e1e1e",
              "submenu.partition.color": "#858585",
              "submenu.normalIcon.path": icona,
              "submenu.normalIcon.name": "icon-a",
              "submenu.activeIcon.path": iconc,
              "submenu.activeIcon.name": "icon-c",

              "common.bi.image": "",
              "common.bisize.width": "0",
              "common.bisize.height": "0",
              "common.backgroundImage": "none",
              "common.border": "0px",
              //checkbox style
              "checkbox.border": "1px solid #ccc",
              "checkbox.backgroundColor": "#fff",

              // rango style
              "range.pointer.color": "#fff",
              "range.bar.color": "#666",
              "range.subbar.color": "#d1d1d1",
              "range.value.color": "#fff",
              "range.value.fontWeight": "lighter",
              "range.value.fontSize": "11px",
              "range.value.border": "1px solid #353535",
              "range.value.backgroundColor": "#151515",
              "range.title.color": "#fff",
              "range.title.fontWeight": "lighter",

              // colorpicker style
              "colorpicker.button.border": "2px solid #1e1e1e",
              "colorpicker.title.color": "#fff"
            },

            menu: [
              "crop",
              "flip",
              "rotate",
              "draw",
              "shape",
              // "icon",
              "text"
              // "mask",
              //  "filter"
            ],

            // initMenu: "filter",
            uiSize: {
              width: "65vw",
              height: "65vh"
            },
            menuBarPosition: "left"
          }}
          cssMaxHeight={500}
          cssMaxWidth={700}
          selectionStyle={{
            cornerSize: 20,
            rotatingPointOffset: 70
          }}
          usageStatistics={false}
        />
        {_showSave ? (
          <button style={this.btnSave} onClick={this.loadImagaing.bind(this)}>
            <i className="far fa-save" />
          </button>
        ) : null}
        {_showUpload ? (
          <React.Fragment>
            <span className="d-none">
              <input
                ref={fileUploader => {
                  this.fileUploader = fileUploader;
                }}
                type="file"
                onChange={this.fileUploaderHandler.bind(this)}
              />
            </span>
            <button
              onClick={this.uploadImage.bind(this)}
              style={this.btnUpLoad}
            >
              <i className="fas fa-upload" />
            </button>
          </React.Fragment>
        ) : null}
        {_showCam ? (
          <button
            onClick={this.openWebCamHandler.bind(this)}
            style={this.btnCamera}
          >
            <i className="fas fa-camera" />
          </button>
        ) : null}

        {this.implementWebCam()}
      </div>
    );
  }
}
