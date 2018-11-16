import React, { Component } from "react";
import "./physical_examination.css";
import PatientHistory from "../PatientHistory/PatientHistory";
import Examination from "../Examination/Examination";
import { AlagehFormGroup } from "../../Wrapper/algaehWrapper";

class PhysicalExamination extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  textHandle(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div className="physical_examination">
        <div className="row">
          <div className="col-lg-8">
            <Examination />
            <div className="portlet portlet-bordered box-shadow-normal margin-top-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Examination Notes</h3>
                </div>
              </div>

              <div className="portlet-body">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-lg-12" }}
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
                        rows: "10"
                      },
                      events: {
                        onChange: this.textHandle.bind(this)
                      }
                    }}
                  />
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
