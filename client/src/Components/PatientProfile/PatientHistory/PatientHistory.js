import React, { Component } from "react";
import { AlagehFormGroup } from "../../Wrapper/algaehWrapper";

class PatientHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  textHandle(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-lg-12">
          <div className="row">
            <div className="col portlet portlet-bordered box-shadow-normal">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Medical History</h3>
                </div>
              </div>

              <div className="portlet-body">
                <AlagehFormGroup
                  div={{ className: "" }}
                  label={{
                    forceLabel: "",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "medical_history",
                    value: this.state.medical_history,
                    others: {
                      multiline: true,
                      rows: "6"
                    },
                    events: {
                      onChange: this.textHandle.bind(this)
                    }
                  }}
                />
              </div>
            </div>
            <div className="col portlet portlet-bordered box-shadow-normal">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Social History</h3>
                </div>
              </div>

              <div className="portlet-body">
                <AlagehFormGroup
                  div={{ className: "" }}
                  label={{
                    forceLabel: "",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "social_history",
                    value: this.state.social_history,
                    others: {
                      multiline: true,
                      rows: "6"
                    },
                    events: {
                      onChange: this.textHandle.bind(this)
                    }
                  }}
                />
              </div>
            </div>
            <div className="col portlet portlet-bordered box-shadow-normal">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Surgical History</h3>
                </div>
              </div>

              <div className="portlet-body">
                <AlagehFormGroup
                  div={{ className: "" }}
                  label={{
                    forceLabel: "",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "surgical_history",
                    value: this.state.surgical_history,
                    others: {
                      multiline: true,
                      rows: "6"
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
      </React.Fragment>
    );
  }
}

export default PatientHistory;
