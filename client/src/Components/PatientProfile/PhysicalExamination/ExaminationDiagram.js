import React, { Component } from "react";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  Modal
} from "../../Wrapper/algaehWrapper";

export default class ExaminationDiagram extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };
  render() {
    debugger;
    return (
      <div className="">
        <Modal open={this.props.open}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <div className="row">
                <div className="col-lg-8">
                  <h4>Clinical Canvas</h4>
                </div>
                <div className="col-lg-4">
                  <button
                    type="button"
                    className=""
                    onClick={e => {
                      this.onClose(e);
                    }}
                  >
                    <i className="fas fa-times-circle" />
                  </button>
                </div>
              </div>
            </div>

            <div className="col-12 popupInner">
              <div className="row">
                <div className="col-3 popLeftDiv">
                  <div className="row diagramList">
                    <div className="col-12 eachDiagram">
                      <img src="../../examDiagram.jpg" />
                      <p>
                        breathing difficulties can be seen during this step.
                        Some systemic problems can be detected during this part
                        of the exam as well as just mechanical breathing
                        problems. <small>12:03:2019 | 03:44 PM</small>
                      </p>
                    </div>
                    <div className="col-12 eachDiagram">
                      <img src="../../examDiagram.jpg" />
                      <p>
                        breathing difficulties can be seen during this step.
                        Some systemic problems can be detected during this part
                        of the exam as well as just mechanical breathing
                        problems. <small>12:03:2019 | 03:44 PM</small>
                      </p>
                    </div>
                    <div className="col-12 eachDiagram">
                      <img src="../../examDiagram.jpg" />
                      <p>
                        breathing difficulties can be seen during this step.
                        Some systemic problems can be detected during this part
                        of the exam as well as just mechanical breathing
                        problems. <small>12:03:2019 | 03:44 PM</small>
                      </p>
                    </div>
                    <div className="col-12 eachDiagram">
                      <img src="../../examDiagram.jpg" />
                      <p>
                        breathing difficulties can be seen during this step.
                        Some systemic problems can be detected during this part
                        of the exam as well as just mechanical breathing
                        problems. <small>12:03:2019 | 03:44 PM</small>
                      </p>
                    </div>
                    <div className="col-12 eachDiagram">
                      <img src="../../examDiagram.jpg" />
                      <p>
                        breathing difficulties can be seen during this step.
                        Some systemic problems can be detected during this part
                        of the exam as well as just mechanical breathing
                        problems. <small>12:03:2019 | 03:44 PM</small>
                      </p>
                    </div>
                    <div className="col-12 eachDiagram">
                      <img src="../../examDiagram.jpg" />
                      <p>
                        breathing difficulties can be seen during this step.
                        Some systemic problems can be detected during this part
                        of the exam as well as just mechanical breathing
                        problems. <small>12:03:2019 | 03:44 PM</small>
                      </p>
                    </div>
                    <div className="col-12 eachDiagram">
                      <img src="../../examDiagram.jpg" />
                      <p>
                        breathing difficulties can be seen during this step.
                        Some systemic problems can be detected during this part
                        of the exam as well as just mechanical breathing
                        problems. <small>12:03:2019 | 03:44 PM</small>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-9 popRightDiv">
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col-3 form-group" }}
                      label={{ forceLabel: "Select Diagram", isImp: false }}
                      selector={{
                        name: "",
                        className: "select-fld",
                        dataSource: {},
                        others: {}
                      }}
                    />
                    <div className="col">
                      <button
                        className="btn btn-primary"
                        style={{ marginTop: 19 }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 CanvasEditorCntr">
                      Canvas Comes Here
                    </div>
                    <div className="DiagramRemarksCntr">
                      <AlagehFormGroup
                        div={{ className: "col form-group" }}
                        label={{
                          forceLabel: "Enter Remarks",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: {
                            type: "text"
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <span className="float-right">
                      <button className="btn btn-primary">Save & Close</button>
                      <button className="btn btn-default">Save </button>
                      <button className="btn btn-default">Cancel </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
