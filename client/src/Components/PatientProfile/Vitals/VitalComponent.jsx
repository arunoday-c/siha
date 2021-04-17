import React, { Component } from "react";
import "./vitals.scss";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { temperatureConvertion } from "./VitalsHandlers";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import moment from "moment";
import config from "../../../utils/config.json";
// import _ from "lodash";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import axios from "axios";
import { MainContext } from "algaeh-react-components";

class VitalComponent extends Component {
  constructor(props) {
    super(props);
  }
  //   addVitals() {
  //     getVitalHistory(this, (data) => {
  //       this.setState({ openVitalModal: true });
  //     });
  //   }
  static contextType = MainContext;
  addPatientVitals(e) {
    e.preventDefault();

    AlgaehValidation({
      // querySelector: "id='vitals_recording'",
      onSuccess: () => {
        let bodyArray = [];
        const _elements = document.querySelectorAll("[vitalid]");
        let resetElements = {};
        const userToken = this.context.userToken;
        let portal_data = {
          patient_identity: this.props.primary_id_no,
          visit_code: this.props.visit_code,
          visit_date: this.props.state.recorded_date,
          hospital_id: userToken.hospital_id,
        };
        for (let i = 0; i < _elements.length; i++) {
          const inputElement = _elements[i].querySelector("input");
          const elementName = inputElement.getAttribute("name");
          resetElements[elementName] = "";
          if (_elements[i].value !== "") {
            // const { visit_id, current_patient, case_type } = Window.global;
            const _isDepended = _elements[i].getAttribute("dependent");
            bodyArray.push({
              patient_id: this.props.current_patient, //Window.global["current_patient"],
              visit_id: this.props.visit_id, //Window.global["visit_id"],
              visit_date: this.props.state.recorded_date,
              visit_time: moment().format(config.formators.time),
              case_type: this.props.case_type, //Window.global["case_type"],
              vital_id: _elements[i].getAttribute("vitalid"),
              vital_value: _elements[i].children[0].value
                ? _elements[i].children[0].value
                : 0.0,
              vital_value_one:
                _isDepended !== null
                  ? document.getElementsByName(_isDepended)[0].value
                  : null,
              formula_value: _elements[i].getAttribute("formula_value"),
            });
            debugger;

            if (elementName === "heart rate") {
              portal_data = {
                ...portal_data,
                heart_rate: _elements[i].children[0].value
                  ? _elements[i].children[0].value
                  : 0.0,
              };
            } else if (elementName === "respiratory rate") {
              portal_data = {
                ...portal_data,
                respiratory_rate: _elements[i].children[0].value
                  ? _elements[i].children[0].value
                  : 0.0,
              };
            } else {
              portal_data = {
                ...portal_data,
                [elementName]: _elements[i].children[0].value
                  ? _elements[i].children[0].value
                  : 0.0,
              };
            }
          }
        }
        debugger;

        algaehApiCall({
          uri: "/doctorsWorkBench/addPatientVitals",
          method: "POST",
          data: bodyArray,
          onSuccess: (response) => {
            if (response.data.success) {
              //   this.props.setstates(
              //     {
              //       ...resetElements,
              //       temperature_from: "",
              //       bp_position: "",
              //       recorded_date: new Date(),
              //       recorded_time: moment().format(config.formators.time),
              //     },
              //     () => {
              axios
                .post(
                  "http://localhost:4402/api/v1/info/patientVitals",
                  portal_data
                )
                .then(function (response) {
                  //handle success
                  console.log(response);
                })
                .catch(function (response) {
                  //handle error
                  console.log(response);
                });
              swalMessage({
                title: "Vitals recorded successfully . .",
                type: "success",
              });
              this.props.resetVitalComponent();
              // }
              //   );
            }
          },
        });
      },
    });
  }
  //   resetVitals() {
  //     const _resetElements = document.getElementById("vitals_recording");
  //     const _childs = _resetElements.querySelectorAll("[type='number']");
  //     for (let i = 0; i < _childs.length; i++) {
  //       let _name = _childs[i].name;
  //       this.props.setState({
  //         [_name]: "",
  //       });
  //     }
  //   }

  checkMax(uom) {
    const max = uom === "%" ? { max: 100 } : {};
    return max;
  }
  render() {
    return (
      <div className="row margin-bottom-15">
        {this.props._department_viatals.map((item, index) => {
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
                  // number: {
                  //   allowNegative: false,
                  // },
                  // type: "text",
                };
          return (
            <React.Fragment key={index}>
              {item.hims_d_vitals_header_id === 4 ? (
                <React.Fragment>
                  <AlagehAutoComplete
                    div={{ className: "col-4" }}
                    label={{
                      forceLabel: "Temp. From",
                      isImp: item.mandatory === "Y" ? true : false,
                    }}
                    selector={{
                      name: "temperature_from",
                      className: "select-fld",
                      value: this.props.state.temperature_from,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.TEMP_FROM,
                      },

                      onChange: this.props.dropDownHandle,
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
                    isImp: item.mandatory === "Y" ? true : false,
                  }}
                  selector={{
                    name: "bp_position",
                    className: "select-fld",

                    value: this.props.state.bp_position,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.BP_POSITION,
                    },
                    onChange: this.props.dropDownHandle,
                    autoComplete: "off",
                  }}
                />
              ) : null}
              {item.isDecimal === "Y" ? (
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
                    isImp: item.mandatory === "N" ? false : true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: _name,
                    ...boxType,

                    dontAllowKeys: ["-", "e"],
                    others: {
                      // pattren: "[0-9]",
                      min: 0,
                      ...this.checkMax(item.uom),
                      disabled: _disable,
                      vitalid: item.hims_d_vitals_header_id,
                      formula_value: String(item.uom).trim(),
                      ..._dependent,
                      // step: "1",
                    },
                    //   dontAllowKeys: ["."],
                    value: this.props.state[_name],
                    events: {
                      onChange: this.props.texthandle,
                    },
                  }}
                />
              ) : (
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
                    isImp: item.mandatory === "N" ? false : true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: _name,
                    ...boxType,

                    dontAllowKeys: ["-", "e", "."],
                    others: {
                      // pattren: "[0-9]",
                      min: 0,
                      ...this.checkMax(item.uom),
                      disabled: _disable,
                      vitalid: item.hims_d_vitals_header_id,
                      formula_value: String(item.uom).trim(),
                      ..._dependent,
                      // step: "1",
                    },
                    //   dontAllowKeys: ["."],
                    value: this.props.state[_name],
                    events: {
                      onChange: this.props.texthandle,
                    },
                  }}
                />
              )}

              {item.hims_d_vitals_header_id === 4 ? (
                <AlagehFormGroup
                  div={{ className: "col-4" }}
                  label={{
                    forceLabel: item.uom === "C" ? "°F" : "°C",
                    isImp: item.mandatory === "Y" ? true : false,
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
                      this.props.state[_name] === ""
                        ? 0
                        : this.props.state[_name],
                      item.uom
                    ),
                  }}
                />
              ) : null}
              {/* {item.hims_d_vitals_header_id === 8 ? " / " : null} */}
            </React.Fragment>
          );
        })}
        <AlgaehDateHandler
          div={{ className: "col-4" }}
          label={{ forceLabel: "Recorded Date", isImp: true }}
          textBox={{
            className: "txt-fld",
            name: "recorded_date",
          }}
          maxDate={new Date()}
          events={{
            onChange: (selectedDate) => {
              this.props.setState({ recorded_date: selectedDate });
            },
          }}
          value={this.props.state.recorded_date}
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
            value: this.props.state.recorded_time,
            events: {
              onChange: this.props.texthandle,
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
            onClick={() => {
              this.props.resetVitalComponent();
            }}
            type="button"
            className="btn btn-default float-right"
          >
            Clear
          </button>
        </div>
      </div>
    );
  }
}

export default VitalComponent;
