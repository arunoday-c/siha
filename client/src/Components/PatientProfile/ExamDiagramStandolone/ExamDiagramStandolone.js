import React, { Component } from "react";

import {
  AlagehAutoComplete,
  AlagehFormGroup
} from "../../Wrapper/algaehWrapper";
import "./ExamDiagramStandolone.css";
import AlgaehCanvas from "../../Wrapper/algaehCanvas";
import examination from "./ExaminationDiagramEvents";
import {
  displayFileFromServer,
  AlgaehValidation,
  saveFileOnServer
} from "../../../utils/GlobalFunctions";
import addNew from "../../../assets/images/add-new-diagram.jpg";
import noDiagram from "../../../assets/images/no-diagram.jpg";
import { swalMessage } from "../../../utils/algaehApiCall";
import AlgaehFile from "../../Wrapper/algaehFileUpload";
import moment from "moment";
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
      exittingDetails: []
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
              <img src={addNew} />
              <span>Add new diagram</span>
              <span>{item.image_desc}</span>
            </div>
          )
        });
      } else {
        displayFileFromServer({
          uri: "/Document/get",
          module: "documentManagement",
          fileType: "DepartmentImages",
          destinationName:
            item.diagram_id +
            "_" +
            item.hims_d_employee_speciality_id +
            "_" +
            item.sub_department_id,
          // fileType: "Patients",
          // destinationName: "PAT-A-0000672",
          onFileSuccess: data => {
            resolve({
              ...item,
              content: (
                <div className="diagramDropdown">
                  <img src={data} />
                  <span>{item.image_desc}</span>
                  <span>{item.speciality_name}</span>{" "}
                </div>
              )
            });
          },
          onFileFailure: () => {
            resolve({
              ...item,
              content: (
                <div className="diagramDropdown">
                  <img src={noDiagram} />
                  <span>{item.image_desc}</span>{" "}
                  <span>{item.speciality_name}</span>
                </div>
              )
            });
          }
        });
      }
    });
  }
  /** Template to load image in a content */
  templateForExistingDiagramHeader(item) {
    return new Promise((resolve, reject) => {
      displayFileFromServer({
        uri: "/Document/get",
        module: "documentManagement",
        fileType: "DepartmentImages",
        destinationName:
          item.diagram_id +
          "_" +
          item.patient_id +
          "_" +
          item.provider_id +
          "_" +
          item.hims_f_examination_diagram_header_id,
        // fileType: "Patients",
        // destinationName: "PAT-A-0000672",
        onFileSuccess: data => {
          resolve({
            ...item,
            content: (
              <div className="diagramDropdown">
                <img src={data} />
                <span>{item.diagram_desc}</span>
                <span>{item.last_update}</span>
              </div>
            )
          });
        },
        onFileFailure: () => {
          resolve({
            ...item,
            content: (
              <div className="diagramDropdown">
                <img src={noDiagram} />
                <span>{item.diagram_desc}</span>
                <span>{item.last_update}</span>
              </div>
            )
          });
        }
      });
    });
  }
  /*
  on File Upload from Canvas get image
 */
  onFileUploadImage(imageDetails) {
    this.setState({
      image: imageDetails.image,
      name: imageDetails.name
    });
  }
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
    debugger;
    //Fetching Existing diagram dropdownlist
    examination()
      .getExistingDetail(item.value)
      .then(result => {
        this.setState({
          exittingDetails: result,
          showUpload: true,
          showCam: true,
          diagram_desc: item.selected.diagram_desc,
          diagram_id: item.selected.diagram_id
        });
      })
      .catch(error => {
        console.error(error);
      });
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
                  file: that.refs.imageSaver.state.image,
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
              that.setState({
                showSavePopup: false,
                remarks: undefined,
                diagram_desc: undefined
              });
            })
            .catch(error => {
              debugger;
              swalMessage({
                title: error.request.responseText,
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
  render() {
    const _disable = this.state.existingDiagram === 0 ? { disabled: true } : {};
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

        <div className="canvasImgPreviewWindowWrapper">
          <div className="canvasImgPreviewWindow">
            <i className="fas fa-times" />
            <img alt="img1" />
          </div>
        </div>
        <div className="canvasImgCompareWindowWrapper">
          <div className="canvasImgCompareWindow">
            <i className="fas fa-times" />
            <img alt="img1" /> <img alt="img2" />
          </div>
        </div>
        {/* <div className="col-12 diagramManageCntr">
        </div> */}
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
                value: this.state.diagram_id
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
                  <i className="fas fa-trash-alt" />
                  <i className="fas fa-search-plus" />

                  <input type="checkbox" />
                  <label>Compare</label>
                </div>
              </div>
            ))}
          </div>
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
