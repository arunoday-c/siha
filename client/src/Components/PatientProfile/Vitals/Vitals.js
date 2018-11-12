import React, { Component } from "react";
import "./vitals.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import Modal from "@material-ui/core/Modal";
import {
  getVitalHistory,
  getFormula,
  temperatureConvertion,
  getDepartmentVitals
} from "./VitalsHandlers";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { Line } from "react-chartjs-2";
import config from "../../../utils/config.json";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import Enumerable from "linq";
import moment from "moment";
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
      weight: "",
      height: "",
      heart_rate: "",
      respiratory_rate: "",
      glucose_fbs: "",
      glucose_rbs: "",
      glucose_pbs: "",
      temperature_from: "",
      oxysat: "",
      temperature_celsisus: "",
      systolic: "",
      diastolic: "",
      recorded_date: new Date(),
      recorded_time: moment().format(config.formators.time)
    };
    this.handleClose = this.handleClose.bind(this);
    if (
      this.props.department_vitals === undefined ||
      this.props.department_vitals.length === 0
    )
      getDepartmentVitals(this);
    if (
      this.props.patient_vitals === undefined ||
      this.props.patient_vitals.length === 0
    )
      getVitalHistory(this);
  }

  handleClose() {
    this.setState({ openVitalModal: false });
  }
  addVitals() {
    this.setState({ openVitalModal: true });
  }

  texthandle(e) {
    if (e.target.name === "weight") {
      //TODO  now hardCoded options need to pull from Db
      getFormula({
        WEIGHTAS: "KG",
        HEIGHTAS: "CM",
        WEIGHT: e.target.value,
        HEIGHT: this.state.height,
        onSuccess: bmi => {
          this.setState({ bmi: bmi });
        }
      });
    } else if (e.target.name === "height") {
      //TODO  now hardCoded options need to pull from Db
      getFormula({
        WEIGHTAS: "KG",
        HEIGHTAS: "CM",
        WEIGHT: this.state.weight,
        HEIGHT: e.target.value,
        onSuccess: bmi => {
          this.setState({ bmi: bmi });
        }
      });
    }
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  resetVitals() {
    const _resetElements = document.getElementById("vitals_recording");
    const _childs = _resetElements.querySelectorAll("[type='number']");
    for (let i = 0; i < _childs.length; i++) {
      let _name = _childs[i].name;
      this.setState({
        [_name]: ""
      });
    }
  }

  addPatientVitals(e) {
    e.preventDefault();
    AlgaehValidation({
      querySelector: "id='vitals_recording'",
      onSuccess: () => {
        let bodyArray = [];
        const _elements = document.querySelectorAll("[vitalid]");

        for (let i = 0; i < _elements.length; i++) {
          if (_elements[i].value !== "") {
            const _isDepended = _elements[i].getAttribute("dependent");
            bodyArray.push({
              patient_id: Window.global["current_patient"],
              visit_id: Window.global["visit_id"],
              visit_date: this.state.recorded_date,
              visit_time: this.state.recorded_time,
              case_type: Window.global["case_type"],
              vital_id: _elements[i].getAttribute("vitalid"),
              vital_value: _elements[i].value,
              vital_value_one:
                _isDepended !== null
                  ? document.getElementsByName(_isDepended)[0].value
                  : null,
              formula_value: _elements[i].getAttribute("formula_value")
            });
          }
        }

        algaehApiCall({
          uri: "/doctorsWorkBench/addPatientVitals",
          method: "POST",
          data: bodyArray,
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Vitals recorded successfully . .",
                type: "success"
              });
            }
          }
        });
      }
    });
  }

  render() {
    const _department_viatals =
      this.props.department_vitals === undefined ||
      this.props.department_vitals.length === 0
        ? []
        : this.props.department_vitals;
    let _plotGraph = [];
    const _vitalsGroup =
      this.props.patient_vitals !== undefined
        ? Enumerable.from(this.props.patient_vitals)
            .groupBy("$.visit_date", null, (key, g) => {
              return {
                dateTime: key,
                list: g.getSource()
              };
            })
            .toArray()
        : [];
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
                    {_vitalsGroup.map((data, index) => (
                      <div key={index} className="timelineContainer right">
                        <div className="content">
                          <p className="dateStamp">{data.dateTime}</p>
                          <div className="vitalsCntr">
                            <ul className="vitals-box">
                              {data.list.map((vitals, ind) => (
                                <li className="each-vitals-box" key={ind}>
                                  <p>{vitals.vitals_name}</p>
                                  <span>{vitals.vital_value}</span>
                                  <span>{vitals.formula_value}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
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

          <div className="portlet-body" id="vitals_recording">
            <div className="row margin-bottom-15">
              {_department_viatals.map((item, index) => {
                const _className =
                  item.hims_d_vitals_header_id === 1
                    ? "col-lg-2"
                    : item.hims_d_vitals_header_id >= 3
                    ? "col-lg-2 vitalTopFld15"
                    : item.hims_d_vitals_header_id === 5 ||
                      item.hims_d_vitals_header_id === 6
                    ? "col-lg-2 vitalTopFld20"
                    : "col";
                const _name = String(item.vitals_name)
                  .replace(/\" "/g, "_")
                  .toLowerCase();
                const _disable = _name === "bmi" ? true : false;
                const _dependent =
                  item.hims_d_vitals_header_id === 8 ||
                  item.hims_d_vitals_header_id === 9
                    ? { dependent: "bp_position" }
                    : item.hims_d_vitals_header_id === 4
                    ? { dependent: "temperature_from" }
                    : {};
                return (
                  <React.Fragment key={index}>
                    {item.hims_d_vitals_header_id === 4 ? (
                      <React.Fragment>
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
                      </React.Fragment>
                    ) : item.hims_d_vitals_header_id === 8 ? (
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          forceLabel: "BP (mmHg)",
                          fieldName: "BP_type"
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
                    ) : null}

                    <AlagehFormGroup
                      div={{ className: _className, others: { key: index } }}
                      label={{
                        forceLabel:
                          item.uom === "C"
                            ? "°C"
                            : item.uom === "F"
                            ? "°F"
                            : item.vital_short_name +
                              " (" +
                              String(item.uom).trim() +
                              ")",
                        isImp: item.mandatory === 0 ? false : true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: _name,
                        others: {
                          type: "number",
                          min: 0,
                          disabled: _disable,
                          vitalid: item.hims_d_vitals_header_id,
                          formula_value: String(item.uom).trim(),
                          ..._dependent
                        },
                        value: this.state[_name],
                        events: {
                          onChange: this.texthandle.bind(this)
                        }
                      }}
                    />

                    {item.hims_d_vitals_header_id === 4 ? (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: item.uom === "C" ? "°F" : "°C"
                        }}
                        textBox={{
                          className: "txt-fld",
                          disabled: true,
                          value: temperatureConvertion(
                            this.state[_name],
                            item.uom
                          )
                        }}
                      />
                    ) : null}
                    {item.hims_d_vitals_header_id === 8 ? " / " : null}
                  </React.Fragment>
                );
              })}

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
    patient_vitals: state.patient_vitals,
    department_vitals: state.department_vitals
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVitalHistory: AlgaehActions,
      getDepartmentVitals: AlgaehActions
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
