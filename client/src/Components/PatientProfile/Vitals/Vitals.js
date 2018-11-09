import React, { Component } from "react";
import "./vitals.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import Modal from "@material-ui/core/Modal";
import { getVitalHistory, getFormula } from "./VitalsHandlers";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { Line } from "react-chartjs-2";

const LineData = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  datasets: [
    {
      fill: false,
      lineTension: 0.1,
      backgroundColor: "#34b8bc",
      borderColor: "#DCAC66",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "#34b8bc",
      pointBackgroundColor: "#34b8bc",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointRadius: 4,
      pointHitRadius: 50,
      data: [6500, 5900, 8000, 8100, 5600, 9000]
    }
  ]
};

const LineData1 = {
  labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  datasets: [
    {
      fill: false,
      lineTension: 0.9,
      backgroundColor: "#00BCB0",
      borderColor: "#DCAC66",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "#00BCB0",
      pointBackgroundColor: "#00BCB0",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointRadius: 4,
      pointHitRadius: 50,
      data: [65, 59, 80, 80, 56, 90]
    }
  ]
};

class Vitals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openVitalModal: false,
      weight: "0",
      height: "0"
    };
    this.handleClose = this.handleClose.bind(this);
    if (
      this.props.patient_vitals === undefined ||
      this.props.patient_vitals.length === 0
    )
      getVitalHistory(this);

    getFormula();
  }

  calculatebmi() {
    let w = this.state.weight;
    let h = this.state.height;

    if (w > 0 && h > 0) {
      this.setState({ bmi: w / (((h / 100) * h) / 100) });
    }
  }

  handleClose() {
    this.setState({ openVitalModal: false });
  }
  addVitals() {
    this.setState({ openVitalModal: true });
  }

  texthandle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  resetVitals() {
    this.setState({
      recorded_date: "",
      recorded_time: "",
      height: "",
      weight: "",
      bmi: "",
      oxysat: "",
      temperature_from: "",
      temperature_celsisus: "",
      systolic: "",
      diastolic: ""
    });
  }

  addPatientVitals(e) {
    e.preventDefault();

    if (this.state.weight.length === 0) {
      swalMessage({
        title: "Please Capture at least one field",
        type: "warning"
      });
    } else {
      algaehApiCall({
        uri: "/doctorsWorkBench/addPatientVitals",
        method: "POST",
        data: {
          patient_id: Window.global["current_patient"],
          visit_id: Window.global["visit_id"],
          visit_date: this.state.recorded_date,
          visit_time: this.state.recorded_time,
          case_type: "OP",
          height: this.state.height,
          weight: this.state.weight,
          bmi: this.state.bmi,
          oxysat: this.state.oxysat,
          temperature_from: this.state.temperature_from,
          temperature_celsisus: this.state.temperature_celsisus,
          systolic: this.state.systolic,
          diastolic: this.state.diastolic
        },
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Vitals recorded successfully . .",
              type: "success"
            });
            getVitalHistory(this);
            this.resetVitals();
          }
        }
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <Modal open={this.state.openVitalModal}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <div className="row">
                <div className="col-lg-8">
                  <h4>Patient Vitals</h4>
                </div>
                <div className="col-lg-4">
                  <button type="button" className="" onClick={this.handleClose}>
                    <i className="fas fa-times-circle" />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-12 popupInner">
              <div
                className="row"
                style={{
                  paddingTop: "10px"
                }}
              >
                <div
                  className="col-lg-3"
                  style={{ borderBottom: "1px solid #e5e5e5" }}
                >
                  <h6>Vital Timeline</h6>
                </div>
                <div
                  className="col-lg-9"
                  style={{ borderBottom: "1px solid #e5e5e5" }}
                >
                  <h6>Vital Charts</h6>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 popLeftDiv">
                  <div className="timeline">
                    {this.props.patient_vitals !== undefined
                      ? this.props.patient_vitals.map((data, index) => (
                          <div key={index} className="timelineContainer right">
                            <div className="content">
                              <p className="dateStamp">
                                {data.visit_date} - {data.visit_time}
                              </p>
                              <div className="vitalsCntr">
                                <ul className="vitals-box">
                                  <li className="each-vitals-box">
                                    <p>Weight</p>
                                    <span>{data.weight}</span>
                                    <span>Kg</span>
                                  </li>
                                  <li className="each-vitals-box">
                                    <p>Height</p>
                                    <span>{data.height}</span>
                                    <span>Cms</span>
                                  </li>
                                  <li className="each-vitals-box">
                                    <p>BMI</p>
                                    <span>{data.bmi}</span>
                                    <span>Kg/m2</span>
                                  </li>
                                  <li className="each-vitals-box">
                                    <p>Blood Pressure</p>
                                    <span>
                                      {data.systolic}/ {data.diastolic}
                                    </span>
                                    <span>mmHg</span>
                                  </li>
                                  <li className="each-vitals-box">
                                    <p>
                                      Temperature(
                                      {data.temperature_from})
                                    </p>
                                    <span>{data.temperature_celsisus}</span>
                                    <span> &deg;C</span>
                                  </li>
                                  <li className="each-vitals-box">
                                    <p>Oxystat</p>
                                    <span>
                                      {data.oxysat
                                        ? data.oxysat
                                        : "Not Recorded"}
                                    </span>
                                    <span>%</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))
                      : null}
                  </div>
                </div>

                <div className="col-lg-9 popRightDiv">
                  <Line
                    height={60}
                    options={{
                      maintainAspectRatio: true,
                      legend: false
                    }}
                    data={LineData}
                  />
                  <Line
                    height={60}
                    options={{
                      maintainAspectRatio: true,
                      legend: false
                    }}
                    data={LineData1}
                  />
                  <Line
                    height={60}
                    options={{
                      maintainAspectRatio: true,
                      legend: false
                    }}
                    data={LineData}
                  />
                </div>
              </div>
            </div>
            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={this.handleClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Vitals</h3>
            </div>

            <div className="actions">
              <a className="btn btn-primary btn-circle active">
                <i
                  onClick={this.addVitals.bind(this)}
                  className="fas fa-history"
                />
              </a>
            </div>
          </div>

          <div className="portlet-body">
            <div className="row margin-bottom-15">
              <AlagehFormGroup
                div={{ className: "col-lg-2" }}
                label={{
                  forceLabel: "Weight(Kg)",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "weight",
                  others: {
                    type: "number"
                  },
                  value: this.state.weight,
                  events: {
                    onChange: this.texthandle.bind(this)
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-lg-2 vitalTopFld15" }}
                label={{
                  forceLabel: "Height(Cms)",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "height",
                  others: {
                    type: "number"
                  },
                  value: this.state.height,
                  events: {
                    onChange: this.texthandle.bind(this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-2 vitalTopFld15" }}
                label={{
                  forceLabel: "BMI (Kg/m2)",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "bmi",
                  others: {
                    type: "number"
                  },
                  value: this.state.bmi,
                  events: {
                    onChange: this.texthandle.bind(this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-2 vitalTopFld20" }}
                label={{
                  forceLabel: "O2 Sat(%)",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "oxysat",
                  others: {
                    type: "number"
                  },
                  value: this.state.oxysat,
                  events: {
                    onChange: this.texthandle.bind(this)
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-lg-2 vitalTopFld20" }}
                label={{
                  forceLabel: "HR (bpm)",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "hr",
                  others: {
                    type: "number"
                  },
                  value: this.state.department_name,
                  events: {
                    onChange: this.texthandle.bind(this)
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-lg-2 vitalTopFld25" }}
                label={{
                  forceLabel: "RR (rpm)",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "rr",
                  others: {
                    type: "number"
                  },
                  //value: this.state.department_name,
                  events: {
                    //  onChange: this.changeDeptName.bind(this)
                  }
                }}
              />
            </div>
            <div className="row margin-bottom-15">
              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Temp. From"
                }}
                selector={{
                  name: "temperature_from",
                  className: "select-fld",
                  value: this.state.temperature_from,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.TEMP_FROM
                  },

                  onChange: this.dropDownHandle.bind(this)
                }}
              />
              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "°C"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "temperature_celsisus",
                  others: {
                    type: "number"
                  },
                  value: this.state.temperature_celsisus,
                  events: {
                    onChange: this.texthandle.bind(this)
                  }
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "BP",
                  fieldName: "sample"
                }}
                selector={{
                  name: "bp_position",
                  className: "select-fld",
                  value: this.state.bp_position,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.BP_POSITION
                  },
                  onChange: this.dropDownHandle.bind(this)
                }}
              />

              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "Sys"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "systolic",
                  others: {
                    type: "number"
                  },
                  value: this.state.systolic,
                  events: {
                    onChange: this.texthandle.bind(this)
                  }
                }}
              />
              {/* <span className="margin-top-15">/</span> */}
              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "Dia"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "diastolic",
                  others: {
                    type: "number"
                  },
                  value: this.state.diastolic,
                  events: {
                    onChange: this.texthandle.bind(this)
                  }
                }}
              />
            </div>
            <div className="row margin-bottom-15">
              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "FBS"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "glucose_fbs",
                  others: {
                    type: "number"
                  },
                  value: this.state.diastolic,
                  events: {
                    onChange: this.texthandle.bind(this)
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "RBS"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "glucose_rbs",
                  others: {
                    type: "number"
                  },
                  value: this.state.diastolic,
                  events: {
                    onChange: this.texthandle.bind(this)
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "PBS"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "glucose_pbs",
                  others: {
                    type: "number"
                  },
                  value: this.state.diastolic,
                  events: {
                    onChange: this.texthandle.bind(this)
                  }
                }}
              />
              <AlgaehDateHandler
                div={{ className: "col-lg-3" }}
                label={{ forceLabel: "Recorded Date", isImp: true }}
                textBox={{
                  className: "txt-fld",
                  name: "recorded_date"
                }}
                maxDate={new Date()}
                events={{
                  onChange: selectedDate => {
                    this.setState({ recorded_date: selectedDate });
                  }
                }}
                value={this.state.recorded_date}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  isImp: true,
                  forceLabel: "Recorded Time"
                }}
                textBox={{
                  others: {
                    type: "time"
                  },
                  className: "txt-fld",
                  name: "recorded_time",
                  value: this.state.recorded_time,
                  events: {
                    onChange: this.texthandle.bind(this)
                  }
                }}
              />
            </div>
            <div className="row">
              <div className="col margin-top-15 pullRight">
                <button
                  onClick={this.addPatientVitals.bind(this)}
                  type="button"
                  className="btn btn-primary"
                  style={{ marginleft: 10 }}
                >
                  Save Vitals
                </button>
                <button
                  onClick={this.resetVitals.bind(this)}
                  type="button"
                  className="btn btn-default"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    patient_vitals: state.patient_vitals
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVitalHistory: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Vitals)
);
