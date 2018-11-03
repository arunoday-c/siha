import React, { Component } from "react";
import "./PatientHistory.css";
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
          <div id="subjectAccordian">
            <ul>
              <li>
                <input type="checkbox" checked readOnly />
                <i />
                <h2>What is Lorem Ipsum ?</h2>
                <p>
                  Medical History
                  {/* <AlagehFormGroup
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
                  /> */}
                </p>
              </li>
              <li>
                <input type="checkbox" checked readOnly />
                <i />
                <h2>Why do we use it ?</h2>
                <p>
                  Social History
                  {/* <AlagehFormGroup
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
                  /> */}
                </p>
              </li>
              <li>
                <input type="checkbox" checked readOnly />
                <i />
                <h2>Wher we can it ?</h2>
                <p>
                  Surgical History
                  {/* <AlagehFormGroup
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
                  /> */}
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* <div className="row">
            <div className="col portlet portlet-bordered box-shadow-normal">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Medical History</h3>
                </div>
              </div>

              <div className="portlet-body" style={{minHeight:"20vh"}}>
                
              </div>
            </div>
            <div className="col portlet portlet-bordered box-shadow-normal">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Social History</h3>
                </div>
              </div>

              <div className="portlet-body" style={{minHeight:"20vh"}}>
               
              </div>
            </div>
            <div className="col portlet portlet-bordered box-shadow-normal">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Surgical History</h3>
                </div>
              </div>

              <div className="portlet-body" style={{minHeight:"20vh"}}>
               
              </div>
            </div>
          </div> */}
      </React.Fragment>
    );
  }
}

export default PatientHistory;
