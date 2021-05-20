import React, { Component } from "react";
import "./vitals.scss";
import {
  // AlagehFormGroup,
  // AlagehAutoComplete,
  // AlgaehDateHandler,
  AlgaehModalPopUp,
} from "../../Wrapper/algaehWrapper";
// import GlobalVariables from "../../../utils/GlobalVariables.json";
import {
  getVitalHistory,
  getFormula,
  // temperatureConvertion,
  getDepartmentVitals,
} from "./VitalsHandlers";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
// import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import config from "../../../utils/config.json";
// import { AlgaehValidation } from "../../../utils/GlobalFunctions";
// import Enumerable from "linq";
import moment from "moment";
// import _ from "lodash";
import VitalComponent from "./VitalComponent";
import VitalsHistory from "./VitalsHistory";
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
      recorded_time: moment().format(config.formators.time),
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    if (
      this.props.department_vitals === undefined ||
      this.props.department_vitals.length === 0
    )
      getDepartmentVitals(this);
    if (
      this.props.patient_vitals === undefined ||
      this.props.patient_vitals.length === 0
    ) {
      getVitalHistory(this);
    }
  }

  handleClose() {
    this.setState({ openVitalModal: false });
  }
  addVitals() {
    getVitalHistory(this, (data) => {
      this.setState({ openVitalModal: true });
    });
  }

  texthandle(e) {
    if (e.target.name === "weight") {
      //TODO  now hardCoded options need to pull from Db
      getFormula({
        WEIGHTAS: "KG",
        HEIGHTAS: "CM",
        WEIGHT: e.target.value,
        HEIGHT: this.state.height,
        onSuccess: (bmi) => {
          this.setState({ bmi: bmi });
        },
      });
    } else if (e.target.name === "height") {
      //TODO  now hardCoded options need to pull from Db
      getFormula({
        WEIGHTAS: "KG",
        HEIGHTAS: "CM",
        WEIGHT: this.state.weight,
        HEIGHT: e.target.value,
        onSuccess: (bmi) => {
          this.setState({ bmi: bmi });
        },
      });
    }

    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  // resetVitals() {
  //   const _resetElements = document.getElementById("vitals_recording");
  //   const _childs = _resetElements.querySelectorAll("[type='number']");
  //   for (let i = 0; i < _childs.length; i++) {
  //     let _name = _childs[i].name;
  //     this.setState({
  //       [_name]: "",
  //     });
  //   }
  // }
  resetVitalComponent() {
    const _elements = document.querySelectorAll("[vitalid]");
    let resetElements = {};
    for (let i = 0; i < _elements.length; i++) {
      const inputElement = _elements[i].querySelector("input");
      const elementName = inputElement.getAttribute("name");
      resetElements[elementName] = "";
    }
    this.setState(
      {
        ...resetElements,

        temperature_from: "",
        bp_position: "",
        recorded_date: new Date(),
        recorded_time: moment().format(config.formators.time),
      },
      () => {
        getVitalHistory(this);
      }
    );
  }
  // setstates(name, value) {
  //   this.setState({
  //     [name]: value,
  //   });
  // }
  onClose = (e) => {
    this.setState(
      {
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
        recorded_time: moment().format(config.formators.timeWs),
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };

  // addPatientVitals(e) {
  //   e.preventDefault();

  //   AlgaehValidation({
  //     // querySelector: "id='vitals_recording'",
  //     onSuccess: () => {
  //       let bodyArray = [];
  //       const _elements = document.querySelectorAll("[vitalid]");
  //       let resetElements = {};
  //       for (let i = 0; i < _elements.length; i++) {
  //         const inputElement = _elements[i].querySelector("input");
  //         const elementName = inputElement.getAttribute("name");
  //         resetElements[elementName] = "";
  //         if (_elements[i].value !== "") {
  //           const { visit_id, current_patient, case_type } = Window.global;
  //           const _isDepended = _elements[i].getAttribute("dependent");
  //           bodyArray.push({
  //             patient_id: current_patient, //Window.global["current_patient"],
  //             visit_id: visit_id, //Window.global["visit_id"],
  //             visit_date: this.state.recorded_date,
  //             visit_time: moment().format(config.formators.time),
  //             case_type: case_type, //Window.global["case_type"],
  //             vital_id: _elements[i].getAttribute("vitalid"),
  //             vital_value: _elements[i].children[0].value
  //               ? _elements[i].children[0].value
  //               : 0.0,
  //             vital_value_one:
  //               _isDepended !== null
  //                 ? document.getElementsByName(_isDepended)[0].value
  //                 : null,
  //             formula_value: _elements[i].getAttribute("formula_value"),
  //           });
  //         }
  //       }

  //       algaehApiCall({
  //         uri: "/doctorsWorkBench/addPatientVitals",
  //         method: "POST",
  //         data: bodyArray,
  //         onSuccess: (response) => {
  //           if (response.data.success) {
  //             this.setState(
  //               {
  //                 ...resetElements,
  //                 temperature_from: "",
  //                 bp_position: "",
  //                 recorded_date: new Date(),
  //                 recorded_time: moment().format(config.formators.time),
  //               },
  //               () => {
  //                 getVitalHistory(this);

  //                 swalMessage({
  //                   title: "Vitals recorded successfully . .",
  //                   type: "success",
  //                 });
  //               }
  //             );
  //           }
  //         },
  //       });
  //     },
  //   });
  // }

  checkMax(uom) {
    const max = uom === "%" ? { max: 100 } : {};
    return max;
  }

  render() {
    const _department_viatals =
      this.props.department_vitals === undefined ||
      this.props.department_vitals.length === 0
        ? []
        : this.props.department_vitals;
    const _vitalsGroup =
      this.props.patient_vitals !== undefined ? this.props.patient_vitals : [];
    const { visit_id, current_patient, case_type } = Window.global;
    return (
      <React.Fragment>
        <div className="row">
          <AlgaehModalPopUp
            events={{
              onClose: this.handleClose.bind(this),
            }}
            title="Patient Vitals"
            openPopup={this.state.openVitalModal}
          >
            <div className="col-lg-12 popupInner">
              <div
                className="row"
                style={{
                  paddingTop: "10px",
                }}
              >
                <div
                  className="col-3"
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
              <div className="row" />
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
          </AlgaehModalPopUp>

          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this),
            }}
            title="Patient Vitals"
            openPopup={this.props.openVital}
          >
            <div className="col-12 popupInner">
              <div className="portlet-body" id="vitals_recording">
                <div className="row">
                  <div
                    className="col-12 popRightDiv"
                    style={{ paddingTop: 0, paddingBottom: 0 }}
                  >
                    <div className="row">
                      <div className="col-4">
                        <div className=" vitalsAddingSec">
                          <VitalComponent
                            _department_viatals={_department_viatals}
                            state={this.state}
                            // setState={this.setState}
                            texthandle={(e) => this.texthandle(e)}
                            handleClose={(e) => this.handleClose(e)}
                            primary_id_no={this.props.primary_id_no}
                            visit_code={this.props.visit_code}
                            // editDateHandler={(selectedDate) => this.editDateHandler(selectedDate)}
                            // editDateValidate={this.editDateValidate}
                            current_patient={current_patient}
                            visit_id={visit_id}
                            case_type={case_type}
                            dropDownHandle={(e) => this.dropDownHandle(e)}
                            // setstates={(name, value) =>
                            //   this.setstates(name, value)
                            // }
                            resetVitalComponent={() =>
                              this.resetVitalComponent()
                            }
                          />
                          {/* {_department_viatals.map((item, index) => {
                            const _className =
                              item.hims_d_vitals_header_id === 1
                                ? "col-4"
                                : item.hims_d_vitals_header_id >= 3
                                ? "col-4"
                                : item.hims_d_vitals_header_id === 5 ||
                                  item.hims_d_vitals_header_id === 6
                                ? "col-4"
                                : "col-4";
                            const _name = String(item.vitals_name)
                              .replace(/" "/g, "_")
                              .toLowerCase();
                            const _disable = _name === "bmi" ? true : false;
                            const _dependent =
                              item.hims_d_vitals_header_id === 8 ||
                              item.hims_d_vitals_header_id === 9
                                ? { dependent: "bp_position" }
                                : item.hims_d_vitals_header_id === 4
                                ? { dependent: "temperature_from" }
                                : {};

                            const boxType =
                              item.box_type === "TEXT"
                                ? {}
                                : {
                                    number: {
                                      allowNegative: false,
                                    },
                                  };
                            return (
                              <React.Fragment key={index}>
                                {item.hims_d_vitals_header_id === 4 ? (
                                  <React.Fragment>
                                    <AlagehAutoComplete
                                      div={{ className: "col-4" }}
                                      label={{
                                        forceLabel: "Temp. From",
                                        isImp:
                                          item.mandatory === "Y" ? true : false,
                                      }}
                                      selector={{
                                        name: "temperature_from",
                                        className: "select-fld",
                                        value: this.state.temperature_from,
                                        dataSource: {
                                          textField: "name",
                                          valueField: "value",
                                          data: GlobalVariables.TEMP_FROM,
                                        },

                                        onChange: this.dropDownHandle.bind(
                                          this
                                        ),
                                        autoComplete: "off",
                                      }}
                                    />
                                  </React.Fragment>
                                ) : item.hims_d_vitals_header_id === 8 ? (
                                  <AlagehAutoComplete
                                    div={{ className: "col-4" }}
                                    label={{
                                      forceLabel: "BP (mmHg)",
                                      fieldName: "BP_type",
                                      isImp:
                                        item.mandatory === "Y" ? true : false,
                                    }}
                                    selector={{
                                      name: "bp_position",
                                      className: "select-fld",
                                      value: this.state.bp_position,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.BP_POSITION,
                                      },
                                      onChange: this.dropDownHandle.bind(this),
                                      autoComplete: "off",
                                    }}
                                  />
                                ) : null}

                                <AlagehFormGroup
                                  div={{
                                    className: _className,
                                    others: { key: index },
                                  }}
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
                                    isImp:
                                      item.mandatory === "N" ? false : true,
                                  }}
                                  textBox={{
                                    className: "txt-fld",
                                    name: _name,
                                    ...boxType,

                                    dontAllowKeys: ["-", "e"],
                                    others: {
                                      min: 0,
                                      ...this.checkMax(item.uom),
                                      disabled: _disable,
                                      vitalid: item.hims_d_vitals_header_id,
                                      formula_value: String(item.uom).trim(),
                                      ..._dependent,
                                    },
                                    value: this.state[_name],
                                    events: {
                                      onChange: this.texthandle.bind(this),
                                    },
                                  }}
                                />

                                {item.hims_d_vitals_header_id === 4 ? (
                                  <AlagehFormGroup
                                    div={{ className: "col-4" }}
                                    label={{
                                      forceLabel:
                                        item.uom === "C" ? "°F" : "°C",
                                      isImp:
                                        item.mandatory === "Y" ? true : false,
                                    }}
                                    textBox={{
                                      className: "txt-fld",
                                      disabled: true,
                                      ...boxType,
                                      // number: {
                                      //   allowNegative: false,
                                      // },
                                      dontAllowKeys: ["-", "e"],
                                      value: temperatureConvertion(
                                        this.state[_name] === ""
                                          ? 0
                                          : this.state[_name],
                                        item.uom
                                      ),
                                    }}
                                  />
                                ) : null} */}
                          {/* {item.hims_d_vitals_header_id === 8 ? " / " : null} */}
                          {/* </React.Fragment>
                            );
                          })} */}

                          {/* <AlgaehDateHandler
                            div={{ className: "col-4" }}
                            label={{ forceLabel: "Recorded Date", isImp: true }}
                            textBox={{
                              className: "txt-fld",
                              name: "recorded_date",
                            }}
                            maxDate={new Date()}
                            events={{
                              onChange: (selectedDate) => {
                                this.setState({ recorded_date: selectedDate });
                              },
                            }}
                            value={this.state.recorded_date}
                            disabled={true}
                          />

                          <AlagehFormGroup
                            div={{ className: "col-4" }}
                            label={{
                              isImp: true,
                              forceLabel: "Recorded Time",
                            }}
                            textBox={{
                              others: {
                                type: "time",
                                disabled: true,
                                step: "2",
                              },
                              className: "txt-fld",
                              name: "recorded_time",
                              value: this.state.recorded_time,
                              events: {
                                onChange: this.texthandle.bind(this),
                              },
                            }}
                          />
                          <div className="col-12 margin-top-15">
                            <button
                              onClick={this.addPatientVitals.bind(this)}
                              type="button"
                              className="btn btn-primary float-right"
                              style={{ marginLeft: 10 }}
                            >
                              Add Vitals
                            </button>
                            <button
                              onClick={this.resetVitals.bind(this)}
                              type="button"
                              className="btn btn-default float-right"
                            >
                              Clear
                            </button>
                          </div> */}
                        </div>
                      </div>{" "}
                      {/* {_vitalsGroup.map((data, index) => (
                            <div
                              key={index}
                              className="timelineContainer right"
                            >
                              <div className="content">
                                <p className="dateStamp">
                                  Recorded by:<span>{data.recorded_by}</span>
                                  Recorded on: <span>{data.dateTime}</span>
                                </p>
                                <div className="vitalsCntr">
                                  <ul className="vitals-box">
                                    {_.orderBy(
                                      data.list,
                                      (o) => o.sequence_order
                                    ).map((vitals, ind) => (
                                      <li className="each-vitals-box" key={ind}>
                                        <p>{vitals.vital_short_name}</p>
                                        <span className="vitalsText">
                                          {vitals.vital_value}
                                        </span>
                                        <span>{vitals.formula_value}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))} */}
                      <VitalsHistory _vitalsGroup={_vitalsGroup} />
                    </div>

                    {/* <div className="row">
                      <button className="btn btn-default graphView">
                        View Graph View
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className=" popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={(e) => {
                        this.onClose(e);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AlgaehModalPopUp>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    patient_vitals: state.patient_vitals,
    department_vitals: state.department_vitals,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVitalHistory: AlgaehActions,
      getDepartmentVitals: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Vitals));
