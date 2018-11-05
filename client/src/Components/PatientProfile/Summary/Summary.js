import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./summary.css";
import { AlgaehActions } from "../../../actions/algaehActions";

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.getPatientSummary({
      uri: "/masters/get/title",
      method: "GET",
      redux: {
        type: "PATIENT_SUMMARY_GET_DATA",
        mappingName: "patient_summary"
      }
    });
  }

  render() {
    debugger;
    return (
      <div id="patientSummary">
        <div className="row">
          <div className="col-md-9 col-lg-9">
            <div className="bd-callout bd-callout-theme">
              <h6>Chief Complaints</h6>

              <p>
                Patient Hafiz Begum Female 79 Yrs Visited Cardiology on
                08/11/2018 for Chest Pain, duration 1 month.
              </p>
            </div>
            <div className="bd-callout bd-callout-theme">
              <h6>Vitals</h6>

              <div className="col-md-12 col-lg-12">
                <div className="row text-center">
                  <div className="col vitals-sec">
                    <div className="counter">
                      <h4 className="timer count-title count-number">22</h4>
                      <p className="count-text ">Weight</p>
                    </div>
                  </div>
                  <div className="col vitals-sec">
                    <div className="counter">
                      <h4 className="timer count-title count-number">22</h4>
                      <p className="count-text ">Height</p>
                    </div>
                  </div>
                  <div className="col vitals-sec">
                    <div className="counter">
                      <h4 className="timer count-title count-number">22</h4>
                      <p className="count-text ">Blood Pressure</p>
                    </div>
                  </div>
                  <div className="col vitals-sec">
                    <div className="counter">
                      <h4 className="timer count-title count-number">22</h4>
                      <p className="count-text ">Temprature</p>
                    </div>
                  </div>

                  <div className="col vitals-sec">
                    <div className="counter">
                      <h4 className="timer count-title count-number">22</h4>
                      <p className="count-text ">Heart Rate</p>
                    </div>
                  </div>

                  <div className="col vitals-sec">
                    <div className="counter">
                      <h4 className="timer count-title count-number">22</h4>
                      <p className="count-text ">Respiratory Rate</p>
                    </div>
                  </div>

                  <div className="col vitals-sec">
                    <div className="counter">
                      <h4 className="timer count-title count-number">0kg</h4>
                      <p className="count-text ">O2 Stat</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bd-callout bd-callout-theme">
              <h6>Family History</h6>

              <p>
                Visited Cardiology on 08/11/2018 for Chest Pain, duration 1
                month.
              </p>
            </div>
            <div className="bd-callout bd-callout-theme">
              <h6>Social Hitory</h6>

              <p>
                Visited Cardiology on 08/11/2018 for Chest Pain, duration 1
                month.
              </p>
            </div>
            <div className="bd-callout bd-callout-theme">
              <h6>Medical History</h6>

              <p>
                Visited Cardiology on 08/11/2018 for Chest Pain, duration 1
                month.
              </p>
            </div>

            <div className="bd-callout bd-callout-theme">
              <h6>Diagnosis</h6>

              <p>
                Visited Cardiology on 08/11/2018 for Chest Pain, duration 1
                month.
              </p>
            </div>

            <div className="bd-callout bd-callout-theme">
              <h6>Treatment</h6>

              <p>
                Visited Cardiology on 08/11/2018 for Chest Pain, duration 1
                month.
              </p>
            </div>
            <div className="bd-callout bd-callout-theme">
              <h6>Medication</h6>

              <p>
                Visited Cardiology on 08/11/2018 for Chest Pain, duration 1
                month.
              </p>
            </div>

            <div className="bd-callout bd-callout-theme">
              <h6>Result</h6>
              <p>
                Visited Cardiology on 08/11/2018 for Chest Pain, duration 1
                month.
              </p>
            </div>
          </div>
          <div className="col-md-3 col-lg-3">
            <div className="card">
              <div className="card-header">Allergies</div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Cras justo odio</li>
                <li className="list-group-item">Dapibus ac facilisis in</li>
                <li className="list-group-item">Vestibulum at eros</li>
              </ul>
            </div>
            <div className="card">
              <div className="card-header">Diet Advice</div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Cras justo odio</li>
                <li className="list-group-item">Dapibus ac facilisis in</li>
                <li className="list-group-item">Vestibulum at eros</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    patient_summary: state.patient_summary,
    patient_profile: state.patient_profile
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientSummary: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Summary)
);
