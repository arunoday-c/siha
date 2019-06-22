import React, { Component } from "react";

import {
  AlagehAutoComplete,
  AlagehFormGroup
} from "../../Wrapper/algaehWrapper";
import "./ExamDiagramStandolone.css";
import AlgaehCanvas from "../../Wrapper/algaehCanvas";
import examination from "./ExaminationDiagramEvents";
import {
  AlgaehValidation,
  saveFileOnServer
} from "../../../utils/GlobalFunctions";
import addNew from "../../../assets/images/add-new-diagram.jpg";
import { swalMessage } from "../../../utils/algaehApiCall";
import AlgaehFile from "../../Wrapper/algaehFileUpload";
import moment from "moment";
import Swal from "sweetalert2";
export default class ExaminationDiagram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      image: undefined,
      diagramData: [],
      showSave: false,
      showUpload: false,
      showCam: false,
      diagram_id: undefined,
      showSavePopup: false,
      existingDiagram: [],
      hims_f_examination_diagram_header_id: undefined,
      saveAsChecked: "new",
      diagram_desc: undefined,
      remarks: undefined,
      exittingDetails: [],
      showZoomImage: false,
      zoomImage: undefined,
      showCompire: false,
      rightCompireImageIndex: 0,
      rightCompireImage: undefined,
      rightComireText: undefined,
      leftCompireImageIndex: 0,
      leftComireText: undefined,
      leftCompireImage: undefined
    };
  }
  componentDidMount() {
    //Fetch new diagram dropdown list
    examination()
      .getMaster(this.state, this.props)
      .then(result => {
        let resultData = [];
        for (let i = 0; i < result.length; i++) {
          resultData.push(this.templateForNewDiagram(result[i]));
        }
        Promise.all(resultData).then(data => {
          this.setState({ diagramData: data });
        });
      })
      .catch(error => {
        console.error(error);
      });
    //Fetching Existing diagram dropdownlist
    examination()
      .getExistingHeader(this.state, this.props)
      .then(result => {
        let resultData = [];
        for (let i = 0; i < result.length; i++) {
          resultData.push(this.templateForExistingDiagramHeader(result[i]));
        }
        Promise.all(resultData).then(data => {
          this.setState({ existingDiagram: data });
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  /** Template to load image in a content */
  templateForNewDiagram(item) {
    return new Promise((resolve, reject) => {
      if (
        item.hims_d_employee_speciality_id === null ||
        item.hims_d_employee_speciality_id === undefined
      ) {
        resolve({
          ...item,
          content: (
            <div className="diagramDropdown">
              <img alt={item.image_desc} src={addNew} />
              <span>Add new diagram</span>
              <span>{item.image_desc}</span>
            </div>
          )
        });
      } else {
        const _unique =
          item.diagram_id +
          "_" +
          item.hims_d_employee_speciality_id +
          "_" +
          item.sub_department_id;
        resolve({
          ...item,
          content: (
            <div className="diagramDropdown">
              <AlgaehFile
                name={"attach_" + _unique}
                accept="image/*"
                showActions={false}
                noImage="noDiagram"
                serviceParameters={{
                  uniqueID: _unique,
                  destinationName: _unique,
                  fileType: "DepartmentImages"
                }}
              />
              <span>{item.image_desc}</span>
              <span>{item.speciality_name}</span>{" "}
            </div>
          )
        });
      }
    });
  }
  /** Template to load image in a content */
  templateForExistingDiagramHeader(item) {
    return new Promise((resolve, reject) => {
      const _unique =
        item.diagram_id +
        "_" +
        item.patient_id +
        "_" +
        item.provider_id +
        "_" +
        item.hims_f_examination_diagram_header_id;

      resolve({
        ...item,
        content: (
          <div className="diagramDropdown">
            <AlgaehFile
              name={"attach_" + _unique}
              accept="image/*"
              showActions={false}
              noImage="noDiagram"
              serviceParameters={{
                uniqueID: _unique,
                destinationName: _unique,
                fileType: "DepartmentImages"
              }}
            />

            <span>{item.diagram_desc}</span>
            <span>{item.last_update}</span>
          </div>
        )
      });
    });
  }
  /*
  on File Upload from Canvas get image
 */
  // onFileUploadImage(imageDetails) {
  //   this.setState({
  //     image: imageDetails.image,
  //     name: imageDetails.name
  //   });
  // }
  onSaveImage(imageDetails) {
    const _saveAsChecked =
      this.state.existingDiagram.length === 0 ? "new" : "existing";
    this.setState({
      showSavePopup: true,
      saveAsChecked: _saveAsChecked
    });
  }

  closeSavePopUp(e) {
    this.setState({
      showSavePopup: false
    });
  }

  newDiagramClearHandler(name) {
    this.setState({
      showSave: false,
      showUpload: false,
      showCam: false,
      image:
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      name: "emptyimage"
    });
  }
  newDiagramLabelClickHandler(item, data) {
    if (item !== undefined) {
      if (
        item.currentTarget.getAttribute("image_desc") !== "Blank" &&
        item.currentTarget.querySelector("img") !== null
      ) {
        const _src = item.currentTarget.querySelector("img").src;
        this.setState({
          image: _src
        });
      }
    }
  }
  newDiagramHandler(item) {
    if (
      item.selected.hims_d_employee_speciality_id === undefined ||
      item.selected.hims_d_employee_speciality_id === null
    ) {
      this.setState({
        showSave: false,
        showUpload: true,
        showCam: true,
        diagram_id: item.value
      });
    } else {
      // const imgData = document.querySelector(
      //   "div[diagram_id='" + item.value + "']"
      // );
      // const src = imgData.querySelector("img").getAttribute("src");
      this.setState({
        showSave: true,
        showUpload: false,
        showCam: false,

        diagram_id: item.value
      });
    }
  }
  onFileUploadImage(imageData) {
    this.setState({
      showSave: true,
      showUpload: false,
      showCam: false,
      image: imageData.image,
      name: imageData.name
    });
  }
  onChangeSaveAsHandler(e) {
    this.setState({
      saveAsChecked: e.currentTarget.value
    });
  }
  onChangeTextBoxHandler(e) {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    });
  }
  onChangeExistingDiagramHandler(item) {
    //Fetching Existing diagram dropdownlist
    examination()
      .getExistingDetail(item.value)
      .then(result => {
        this.setState({
          exittingDetails: result,
          showUpload: true,
          showCam: true,
          showSave: true,
          diagram_desc: item.selected.diagram_desc,
          diagram_id: item.selected.diagram_id,
          hims_f_examination_diagram_header_id: item.value
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  onZoomImage(e) {
    const _img = e.target.offsetParent.querySelector("img");
    this.setState({ showZoomImage: true, zoomImage: _img.getAttribute("src") });
  }
  onZoomClose() {
    this.setState({ showZoomImage: false, zoomImage: undefined });
  }

  onChangeSaveDiagram(e) {
    const that = this;
    AlgaehValidation({
      querySelector: "id='savePopUP'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        if (that.state.remarks !== "") {
          examination()
            .saveDiagramHandler(that.state, that.props)
            .then(result => {
              if (that.state.saveAsChecked === "new") {
                saveFileOnServer({
                  file: that.refs.imageSaver.editor.getInstance().toDataURL(),
                  uniqueID:
                    that.state.diagram_id +
                    "_" +
                    Window.global["current_patient"] +
                    "_" +
                    Window.global["provider_id"] +
                    "_" +
                    result.hims_f_examination_diagram_header_id,
                  fileType: "DepartmentImages",
                  fileExtention: "webp",
                  showSuccessMessage: false
                });
              }
              saveFileOnServer({
                file: that.refs.imageSaver.editor.getInstance().toDataURL(),
                uniqueID:
                  that.state.diagram_id +
                  "_" +
                  Window.global["current_patient"] +
                  "_" +
                  Window.global["provider_id"] +
                  "_" +
                  result.hims_f_examination_diagram_header_id +
                  "_" +
                  result.insertId,
                fileType: "DepartmentImages",
                fileExtention: "webp",
                showSuccessMessage: () => {
                  //Fetching Existing diagram dropdownlist
                  examination()
                    .getExistingHeader(that.state, that.props)
                    .then(result => {
                      let resultData = [];
                      for (let i = 0; i < result.length; i++) {
                        resultData.push(
                          that.templateForExistingDiagramHeader(result[i])
                        );
                      }
                      Promise.all(resultData).then(data => {
                        that.setState({ existingDiagram: data });
                      });
                    })
                    .catch(error => {
                      console.error(error);
                    });
                }
              });
              swalMessage({
                title: "Success",
                type: "success"
              });

              //Fetching Existing diagram dropdownlist
              examination()
                .getExistingDetail(
                  this.state.hims_f_examination_diagram_header_id
                )
                .then(result => {
                  this.setState({
                    exittingDetails: result,
                    showUpload: true,
                    showCam: true,
                    showSave: true,
                    showSavePopup: false,
                    remarks: undefined,
                    diagram_desc: undefined
                  });
                })
                .catch(error => {
                  console.error(error);
                });
            })
            .catch(error => {
              const errorI = error.request;
              swalMessage({
                title:
                  errorI !== undefined
                    ? error.responseText
                    : JSON.stringify(errorI),
                type: "error"
              });
            });
        } else {
          swalMessage({
            title: "Remarks can't blank",
            type: "warning"
          });
        }
      }
    });
  }

  onClickCompire(e) {
    const _element = document.querySelectorAll(".diagramList .eachDiagram");
    const _left = _element[0].querySelector("img").getAttribute("src");
    const _right = _element[this.state.exittingDetails.length - 1]
      .querySelector("img")
      .getAttribute("src");

    this.setState({
      showCompire: true,
      rightCompireImage: _right,
      leftCompireImage: _left,
      leftComireText: _element[0].querySelector("p").innerHTML,
      rightComireText: _element[
        this.state.exittingDetails.length - 1
      ].querySelector("p").innerHTML,
      rightCompireImageIndex: this.state.exittingDetails.length - 1,
      leftCompireImageIndex: 0
    });
  }
  onClickCloseCompire(e) {
    this.setState({ showCompire: false });
  }
  onImageChangeOnCompire(e) {
    const _button = e.target;
    const _position = _button.getAttribute("position");
    const _buttonType = _button.getAttribute("button");
    const _element = document.querySelectorAll(".diagramList .eachDiagram");
    const _totalRecords = _element.length; //this.state.exittingDetails.length;

    if (_position === "left") {
      if (_buttonType === "prev") {
        if (this.state.leftCompireImageIndex - 1 === -1) {
          const _src = _element[_totalRecords - 1]
            .querySelector("img")
            .getAttribute("src");
          const _leftCompireText = _element[_totalRecords - 1].querySelector(
            "p"
          ).innerHTML;
          this.setState({
            leftComireText: _leftCompireText,
            leftCompireImageIndex: _totalRecords - 1,
            leftCompireImage: _src
          });
        } else {
          const _src = _element[this.state.leftCompireImageIndex - 1]
            .querySelector("img")
            .getAttribute("src");
          const _leftCompireText = _element[
            this.state.leftCompireImageIndex - 1
          ].querySelector("p").innerHTML;
          this.setState({
            leftComireText: _leftCompireText,
            leftCompireImageIndex: this.state.leftCompireImageIndex - 1,
            leftCompireImage: _src
          });
        }
      } else {
        if (this.state.leftCompireImageIndex + 1 >= _totalRecords) {
          const _src = _element[0].querySelector("img").getAttribute("src");
          const _leftCompireText = _element[0].querySelector("p").innerHTML;
          this.setState({
            leftComireText: _leftCompireText,
            leftCompireImageIndex: 0,
            leftCompireImage: _src
          });
        } else {
          const _src = _element[this.state.leftCompireImageIndex + 1]
            .querySelector("img")
            .getAttribute("src");
          const _leftCompireText = _element[
            this.state.leftCompireImageIndex + 1
          ].querySelector("p").innerHTML;
          this.setState({
            leftComireText: _leftCompireText,
            leftCompireImageIndex: this.state.leftCompireImageIndex + 1,
            leftCompireImage: _src
          });
        }
      }
    } else {
      if (_buttonType === "prev") {
        if (this.state.rightCompireImageIndex - 1 === -1) {
          const _src = _element[_totalRecords - 1]
            .querySelector("img")
            .getAttribute("src");
          const _rightCompireText = _element[_totalRecords - 1].querySelector(
            "p"
          ).innerHTML;
          this.setState({
            rightComireText: _rightCompireText,
            rightCompireImageIndex: _totalRecords - 1,
            rightCompireImage: _src
          });
        } else {
          const _src = _element[this.state.rightCompireImageIndex - 1]
            .querySelector("img")
            .getAttribute("src");
          const _rightCompireText = _element[
            this.state.rightCompireImageIndex - 1
          ].querySelector("p").innerHTML;
          this.setState({
            rightComireText: _rightCompireText,
            rightCompireImage: _src,
            rightCompireImageIndex: this.state.rightCompireImageIndex - 1
          });
        }
      } else {
        if (this.state.rightCompireImageIndex + 1 >= _totalRecords) {
          const _src = _element[0].querySelector("img").getAttribute("src");
          const _rightCompireText = _element[0].querySelector("p").innerHTML;
          this.setState({
            rightComireText: _rightCompireText,
            rightCompireImageIndex: 0,
            rightCompireImage: _src
          });
        } else {
          const _src = _element[this.state.rightCompireImageIndex + 1]
            .querySelector("img")
            .getAttribute("src");
          const _rightCompireText = _element[
            this.state.rightCompireImageIndex + 1
          ].querySelector("p").innerHTML;
          this.setState({
            ightComireText: _rightCompireText,
            rightCompireImage: _src,
            rightCompireImageIndex: this.state.rightCompireImageIndex + 1
          });
        }
      }
    }
  }
  onClickDeleteDiagram(item, e) {
    const image = e.target.offsetParent.querySelector("img");
    image.style.width = "100px";
    image.style.height = "100px";
    Swal({
      title: "Are you sure you want to delete this diagram?",
      //  type: "warning",
      html: image.outerHTML,
      buttons: true,
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(confirm => {
      if (confirm.value) {
        examination()
          .deleteDetaiDiagram({
            examination_diagrams_id: item.examination_diagrams_id,
            unique: item.image
          })
          .then(reu => {
            examination()
              .getExistingDetail(item.hims_f_examination_diagram_header_id)
              .then(result => {
                this.setState(
                  {
                    exittingDetails: result,
                    showUpload: true,
                    showCam: true,
                    showSave: true
                  },
                  () => {
                    swalMessage({
                      title: reu,
                      type: "success"
                    });
                  }
                );
              })
              .catch(error => {
                console.error(error);
              });
          })
          .catch(error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          });
      }
    });
  }
  isHttps() {
    if (window.location.protocol === "https:") {
      return true;
    } else {
      return false;
    }
  }
  createUrl(destPath) {
    // window.location.protocol + "//";
    const url =
      window.location.hostname +
      ":3006/api/v1/Document/get?fileType=DepartmentImages&destinationName=" +
      destPath;
    return url;
  }
  render() {
    const _disable =
      this.state.existingDiagram.length === 0 ? { disabled: true } : {};
    return (
      <div className="row">
        {this.state.showSavePopup ? (
          <div id="savePopUP" className="saveWrapper">
            <div className="col saveWindow">
              <div className="row saveHeader">
                <div className="col">
                  <h5>Save</h5>
                </div>
              </div>
              <div className="row">
                <div className="col-6 form-group">
                  <label>Save As</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="new"
                        name="diagramSaveAs"
                        checked={
                          this.state.saveAsChecked === "new" ? true : false
                        }
                        onChange={this.onChangeSaveAsHandler.bind(this)}
                      />
                      <span>New</span>
                    </label>

                    <label className="radio inline" style={{ marginRight: 5 }}>
                      <input
                        type="radio"
                        onChange={this.onChangeSaveAsHandler.bind(this)}
                        value="existing"
                        name="diagramSaveAs"
                        {..._disable}
                        checked={
                          this.state.saveAsChecked === "existing" ? true : false
                        }
                      />
                      <span>Existing</span>
                    </label>
                  </div>
                </div>
                {this.state.saveAsChecked === "new" ? (
                  <AlagehFormGroup
                    div={{ className: "col-6 form-group" }}
                    label={{
                      forceLabel: "Enter Treatment Name",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "diagram_desc",
                      value: this.state.diagram_desc,
                      events: {
                        onChange: this.onChangeTextBoxHandler.bind(this)
                      }
                    }}
                  />
                ) : (
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group" }}
                    label={{
                      forceLabel: "Select Existing Treatment",
                      isImp: true
                    }}
                    selector={{
                      name: "hims_f_examination_diagram_header_id",
                      className: "select-fld",
                      dataSource: {
                        data: this.state.existingDiagram,
                        textField: "diagram_desc",
                        valueField: "hims_f_examination_diagram_header_id"
                      },
                      value: this.state.hims_f_examination_diagram_header_id,
                      onChange: this.onChangeExistingDiagramHandler.bind(this)
                    }}
                  />
                )}

                <div className="col form-group">
                  <label>Enter Remarks</label>
                  <textarea
                    className="textAreaRemarks"
                    name="remarks"
                    value={this.state.remarks}
                    onChange={this.onChangeTextBoxHandler.bind(this)}
                  />
                </div>
              </div>

              <div className="row saveFooter">
                <div className="col">
                  <button
                    className="btn btn-primary"
                    onClick={this.onChangeSaveDiagram.bind(this)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-default"
                    onClick={this.closeSavePopUp.bind(this)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {this.state.showZoomImage ? (
          <div className="canvasImgPreviewWindowWrapper">
            <div className="canvasImgPreviewWindow">
              <i
                className="fas fa-times"
                onClick={this.onZoomClose.bind(this)}
              />
              <img alt="zoomImage" src={this.state.zoomImage} />
            </div>
          </div>
        ) : null}
        {this.state.showCompire ? (
          <div className="canvasImgCompareWindowWrapper">
            <div className="canvasImgCompareWindow">
              <i
                className="fas fa-times"
                onClick={this.onClickCloseCompire.bind(this)}
              />
              <div className="row">
                <div className="col-lg-6">
                  <button
                    className="btn btn-default"
                    position="left"
                    button="prev"
                    onClick={this.onImageChangeOnCompire.bind(this)}
                  >
                    Prev
                  </button>
                  <button
                    className="btn btn-default"
                    position="left"
                    button="next"
                    onClick={this.onImageChangeOnCompire.bind(this)}
                  >
                    Next
                  </button>
                  <br />
                  <img alt="leftImage" src={this.state.leftCompireImage} />
                  <p
                    dangerouslySetInnerHTML={{
                      __html: this.state.leftComireText
                    }}
                  />

                  {/* <p>
                    Day 4 - Acne in red Color
                    <br /> <small>16:04:2019 | 03:00 PM</small>
                  </p> */}
                </div>
                <div className="col-lg-6">
                  <button
                    className="btn btn-default"
                    position="right"
                    button="prev"
                    onClick={this.onImageChangeOnCompire.bind(this)}
                  >
                    Prev
                  </button>
                  <button
                    className="btn btn-default"
                    position="right"
                    button="next"
                    onClick={this.onImageChangeOnCompire.bind(this)}
                  >
                    Next
                  </button>
                  <br />
                  <img alt="rightImage" src={this.state.rightCompireImage} />
                  <p
                    dangerouslySetInnerHTML={{
                      __html: this.state.rightComireText
                    }}
                  />
                  {/* <p>
                    Day 4 - Acne in red Color
                    <br /> <small>16:04:2019 | 03:00 PM</small>
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="col-2">
          <div className="row diagramManageCntr">
            <AlagehAutoComplete
              div={{ className: "col-12 form-group" }}
              label={{ forceLabel: "New Diagram", isImp: false }}
              selector={{
                name: "diagram_id",
                className: "select-fld",
                dataSource: {
                  data: this.state.diagramData,
                  textField: "image_desc",
                  valueField: "diagram_id"
                },
                onChange: this.newDiagramHandler.bind(this),
                onClear: this.newDiagramClearHandler.bind(this),
                value: this.state.diagram_id,
                onClose: this.newDiagramLabelClickHandler.bind(this)
              }}
            />
          </div>
          <div className="row diagramManageCntr" style={{ marginBottom: 0 }}>
            <AlagehAutoComplete
              div={{ className: "col-12 form-group" }}
              label={{ forceLabel: "Exisiting Diagram", isImp: false }}
              selector={{
                name: "hims_f_examination_diagram_header_id",
                className: "select-fld",
                dataSource: {
                  textField: "diagram_desc",
                  valueField: "hims_f_examination_diagram_header_id",
                  data: this.state.existingDiagram
                },
                value: this.state.hims_f_examination_diagram_header_id,
                onChange: this.onChangeExistingDiagramHandler.bind(this)
              }}
            />
          </div>
          <div className="row diagramList">
            {this.state.exittingDetails.map((item, index) => (
              <div className="col-12 eachDiagram" key={index}>
                <AlgaehFile
                  name={"attach_" + index}
                  accept="image/*"
                  noImage={true}
                  showActions={false}
                  serviceParameters={{
                    uniqueID: item.image,
                    destinationName: item.image,
                    fileType: "DepartmentImages"
                  }}
                />
                <p>
                  {item.remarks}
                  <small>
                    {moment(new Date(item.update_date)).format(
                      "DD:MM:YYYY | hh:mm A"
                    )}
                  </small>
                </p>{" "}
                <div className="diagramImgTool">
                  <i
                    className="fas fa-trash-alt"
                    onClick={this.onClickDeleteDiagram.bind(this, item)}
                  />
                  <i
                    className="fas fa-search-plus"
                    onClick={this.onZoomImage.bind(this)}
                  />

                  {/* <input type="checkbox" id={"chk_compire_" + index} />
                  <label htmlFor={"chk_compire_" + index}>Compare</label> */}
                </div>
              </div>
            ))}
          </div>
          {this.state.exittingDetails.length > 0 ? (
            <button
              onClick={this.onClickCompire.bind(this)}
              className="btn btn-default btn-block"
            >
              Compare
            </button>
          ) : null}
        </div>
        <div className="col-10">
          <div className="row">
            <div className="col-12 CanvasEditorCntr">
              <AlgaehCanvas
                ref="imageSaver"
                directImage={true}
                image={this.state.image}
                name={this.state.name}
                onUpload={this.onFileUploadImage.bind(this)}
                onAfterCapture={this.onFileUploadImage.bind(this)}
                onSave={this.onSaveImage.bind(this)}
                showSave={this.state.showSave}
                showUpload={this.state.showUpload}
                showCam={this.state.showCam}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
