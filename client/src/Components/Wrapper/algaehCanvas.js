import React, { Component } from "react";
import { displayFileFromServer } from "../../utils/GlobalFunctions";
import "tui-image-editor/dist/tui-image-editor.css";
import ImageEditor from "@toast-ui/react-image-editor";
import icona from "tui-image-editor/dist/svg/icon-a.svg";
import iconb from "tui-image-editor/dist/svg/icon-b.svg";
import iconc from "tui-image-editor/dist/svg/icon-c.svg";
import icond from "tui-image-editor/dist/svg/icon-d.svg";
export default class AlgaehCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image:
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      name: "algaeh-image-editor"
    };
    this.btnSave = {
      position: "absolute",
      top: "7px",
      left: "9px",
      zIndex: 9,
      background: "#6ba25b",
      color: "#fff",
      width: "44px",
      height: "44px",
      fontSize: "0.9rem",
      textAalign: "center"
    };
    this.btnDiagramCntr = {
      position: "relative"
    };
  }

  componentDidMount() {
    this.editor.getRootElement().lastElementChild.firstElementChild.hidden = true;
    this.loadImageFromDB();
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
    var link = document.createElement("a");
    link.setAttribute("href", this.editor.getInstance().toDataURL());
    link.setAttribute("download", this.state.name + ".png");
    link.click();
  }
  render() {
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
              // checkbox style
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
              "colorpicker.button.border": "1px solid #1e1e1e",
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
              width: "1000px",
              height: "700px"
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
        <button style={this.btnSave} onClick={this.loadImagaing.bind(this)}>
          Save
        </button>
      </div>
    );
  }
}
