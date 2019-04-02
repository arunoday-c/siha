import React, { Component } from "react";
import "./physical_examination.css";
import PatientHistory from "../PatientHistory/PatientHistory";
import Examination from "../Examination/Examination";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
// import ExaminationDiagram from "./ExaminationDiagram";

class PhysicalExamination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.isclosed = false;
  }

  textHandle(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  OpenDiagram() {
    if (!this.isclosed) {
      this.setState({
        isOpen: true
      });
    } else {
      this.isclosed = false;
    }
  }

  CloseModel(e) {
    this.isclosed = true;
    this.setState({
      ...this.state,
      isOpen: false
    });
  }

  render() {
    return (
      <div className="physical_examination">
        <div className="row">
          <div className="col-lg-8">
            <Examination />
            <div className="row">
              <div className="col-4 margin-top-15">
                <div className="portlet portlet-bordered">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Examination Notes</h3>
                    </div>
                  </div>

                  <div className="portlet-body">
                    <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col-lg-12 textArea" }}
                        label={{
                          forceLabel: "",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "examination_notes",
                          value: this.state.examination_notes,
                          others: {
                            multiline: true,
                            rows: "6",
                            style: {
                              height: "25vh"
                            }
                          },
                          options: {},
                          events: {
                            onChange: this.textHandle.bind(this)
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-8  margin-top-15">
                <div className="portlet portlet-bordered">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Examination Diagram</h3>
                    </div>
                    <div className="actions">
                      <a
                        className="btn btn-primary btn-circle active"
                        onClick={this.OpenDiagram.bind(this)}
                      >
                        {/* <ExaminationDiagram
                          open={this.state.isOpen}
                          onClose={this.CloseModel.bind(this)}
                        /> */}
                        <i className="fas fa-plus" />
                      </a>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-12" id="ExamDiagram_Cntr">
                        <AlgaehDataGrid
                          id="ExamDiagram"
                          datavalidate="ExamDiagram"
                          columns={[
                            {
                              fieldName: "Diagram",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Diagram" }}
                                />
                              )
                            },
                            {
                              fieldName: "Remarks",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Remarks" }}
                                />
                              )
                            },
                            {
                              fieldName: "UpdatedDate",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Updated On" }}
                                />
                              )
                            }
                          ]}
                          keyId=""
                          dataSource={{ data: [] }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 5 }}
                          events={{}}
                          others={{}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <PatientHistory />
          </div>
        </div>
      </div>
    );
  }
}

export default PhysicalExamination;
