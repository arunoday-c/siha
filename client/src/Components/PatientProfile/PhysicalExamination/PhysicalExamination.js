import React, { Component } from "react";
import "./physical_examination.scss";
import PatientHistory from "../PatientHistory/PatientHistory";
import Examination from "../Examination/Examination";
import { AlagehFormGroup } from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
// import ExaminationDiagram from "./ExaminationDiagram";

class PhysicalExamination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      examination_notes: null
    };
    this.isclosed = false;

    this.getPatientEncounterDetails();
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

  componentWillUnmount() {
    if (this.state.examination_notes !== null) {
      algaehApiCall({
        uri: "/doctorsWorkBench/updatePatientEncounter",
        method: "PUT",
        data: {
          examination_notes: this.state.examination_notes,
          encounter_id: Window.global.encounter_id
        },
        onSuccess: response => {
          if (response.data.success) {
          }
        }
      });
    }
    // updatePatientEncounter
  }

  getPatientEncounterDetails() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientEncounter",
      method: "GET",
      data: {
        encounter_id: Window.global.encounter_id
      },

      onSuccess: response => {
        if (response.data.success) {
          let data = response.data.records[0];
          this.setState({
            examination_notes: data.examination_notes
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  render() {
    return (
      <div className="physical_examination">
        <div className="row">
          <div className="col-lg-8">
            <Examination />
            <div className="row">
              <div className="col-12 margin-top-15">
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
