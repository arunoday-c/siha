import React, { Component } from "react";

import { AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
import "./ExamDiagramStandolone.css";
import AlgaehCanvas from "../../Wrapper/algaehCanvas";
import examination from "./ExaminationDiagramEvents";
import { displayFileFromServer } from "../../../utils/GlobalFunctions";
import addNew from "../../../assets/images/add-new-diagram.jpg";
import noDiagram from "../../../assets/images/no-diagram.jpg";
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
      diagram_id: undefined
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
  }

  diagrams(item) {
    this.setState({
      image: item.selected.image,
      name: item.selected.name
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
                  <img src={data} /> <span>{item.image_desc}</span>
                  <span>{item.speciality_name}</span>
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
    debugger;
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
  render() {
    return (
      <div className="row">
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
                    value="ALL"
                    name="no_employees"
                    // checked={this.state.no_employees === "ALL"}
                    // onChange={this.textHandler.bind(this)}
                  />
                  <span>New</span>
                </label>

                <label className="radio inline" style={{ marginRight: 5 }}>
                  <input
                    type="radio"
                    //  onChange={this.textHandler.bind(this)}
                    value="ONE"
                    name="no_employees"
                    //   checked={this.state.no_employees === "ONE"}
                  />
                  <span>Existing</span>
                </label>
              </div>
            </div>
            <AlagehAutoComplete
              div={{ className: "col-6 form-group" }}
              label={{ forceLabel: "Select Existing Treatment", isImp: false }}
              selector={{
                name: "",
                className: "select-fld",
                dataSource: {},
                others: {}
              }}
            />
            <div className="col form-group">
              <label>Enter Remarks</label>
              <textarea className="textAreaRemarks" />
            </div>
          </div>

          <div className="row saveFooter">
            <div className="col">
              <button className="btn btn-primary">Save</button>
              <button className="btn btn-default">Cancel</button>
            </div>
          </div>
        </div>

        {/* <div className="col-12 diagramManageCntr">
        </div> */}
        <div className="col-2">
          <div className="row diagramManageCntr">
            <AlagehAutoComplete
              div={{ className: "col-12" }}
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
                name: "diagrams",
                className: "select-fld",
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: []
                },
                onChange: this.diagrams.bind(this)
              }}
            />
          </div>
          <div className="row diagramList">
            <div className="col-12 eachDiagram">
              <img src="../../examDiagram.jpg" />
              <p>
                breathing difficulties can be seen during this step. Some
                systemic problems can be detected during this part of the exam
                as well as just mechanical breathing problems.{" "}
                <small>12:03:2019 | 03:44 PM</small>
              </p>
            </div>
            <div className="col-12 eachDiagram">
              <img src="../../examDiagram.jpg" />
              <p>
                breathing difficulties can be seen during this step. Some
                systemic problems can be detected during this part of the exam
                as well as just mechanical breathing problems.{" "}
                <small>12:03:2019 | 03:44 PM</small>
              </p>
            </div>
            <div className="col-12 eachDiagram">
              <img src="../../examDiagram.jpg" />
              <p>
                breathing difficulties can be seen during this step. Some
                systemic problems can be detected during this part of the exam
                as well as just mechanical breathing problems.{" "}
                <small>12:03:2019 | 03:44 PM</small>
              </p>
            </div>
            <div className="col-12 eachDiagram">
              <img src="../../examDiagram.jpg" />
              <p>
                breathing difficulties can be seen during this step. Some
                systemic problems can be detected during this part of the exam
                as well as just mechanical breathing problems.{" "}
                <small>12:03:2019 | 03:44 PM</small>
              </p>
            </div>
            <div className="col-12 eachDiagram">
              <img src="../../examDiagram.jpg" />
              <p>
                breathing difficulties can be seen during this step. Some
                systemic problems can be detected during this part of the exam
                as well as just mechanical breathing problems.{" "}
                <small>12:03:2019 | 03:44 PM</small>
              </p>
            </div>
            <div className="col-12 eachDiagram">
              <img src="../../examDiagram.jpg" />
              <p>
                breathing difficulties can be seen during this step. Some
                systemic problems can be detected during this part of the exam
                as well as just mechanical breathing problems.{" "}
                <small>12:03:2019 | 03:44 PM</small>
              </p>
            </div>
            <div className="col-12 eachDiagram">
              <img src="../../examDiagram.jpg" />
              <p>
                breathing difficulties can be seen during this step. Some
                systemic problems can be detected during this part of the exam
                as well as just mechanical breathing problems.{" "}
                <small>12:03:2019 | 03:44 PM</small>
              </p>
            </div>
          </div>
        </div>
        <div className="col-10">
          <div className="row">
            <div className="col-12 CanvasEditorCntr">
              <AlgaehCanvas
                directImage={true}
                image={this.state.image}
                name={this.state.name}
                onUpload={this.onFileUploadImage.bind(this)}
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
