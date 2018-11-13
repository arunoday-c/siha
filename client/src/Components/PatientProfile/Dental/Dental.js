import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./Dental.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import {
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel,
  Button
} from "../../Wrapper/algaehWrapper";
class Dental extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // this.props.getPatientSummary({
    //   uri: "/masters/get/title",
    //   method: "GET",
    //   redux: {
    //     type: "PATIENT_SUMMARY_GET_DATA",
    //     mappingName: "patient_summary"
    //   }
    // });
  }

  generateToothUpperLeftSet() {
    let plot = [];
    for (let i = 1; i < 9; i++) {
      plot.push(
        <div
          className={
            "col tooth-sec up-side " +
            (i <= 3
              ? "molar-up-"
              : i <= 5
              ? "premolar-up-"
              : i === 6
              ? "canine-up-"
              : "incisors-up-up-") +
            i
          }
        >
          <span>{i}</span>
          <div className="surface-Marking">
            <div className="top-surface">
              <span>D</span>
            </div>
            <div className="right-surface">
              <span>L</span>
            </div>
            <div className="bottom-surface">
              <span>I</span>
            </div>
            <div className="left-surface">
              <span>P</span>
            </div>
            {i >= 6 ? null : (
              <div className="middle-surface">
                <span>M</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return plot;
  }
  generateToothUpperRightSet() {
    let plot = [];
    for (let i = 9; i < 17; i++) {
      plot.push(
        <div
          className={
            "col tooth-sec up-side " +
            (i <= 10
              ? "incisors-up-up-"
              : i === 11
              ? "canine-up-"
              : i <= 13
              ? "premolar-up-"
              : "i molar-up-") +
            i
          }
        >
          <span>{i}</span>
          <div className="surface-Marking">
            <div className="top-surface">
              <span>D</span>
            </div>
            <div className="right-surface">
              <span>L</span>
            </div>
            <div className="bottom-surface">
              <span>I</span>
            </div>
            <div className="left-surface">
              <span>P</span>
            </div>
            {i >= 12 ? (
              <div className="middle-surface">
                <span>M</span>
              </div>
            ) : null}
          </div>
        </div>
      );
    }
    return plot;
  }

  generateToothLowerLeftSet() {
    let plot = [];
    let counter = 1;

    for (let i = 32; i >= 25; i--) {
      plot.push(
        <div
          className={
            "col tooth-sec down-side " +
            (counter <= 3
              ? "molar-down-"
              : counter <= 5
              ? "premolar-down-"
              : counter === 6
              ? "canine-down-"
              : "incisors-down-") +
            counter
          }
        >
          <span>{counter}</span>
          <div className="surface-Marking">
            <div className="top-surface">
              <span>D</span>
            </div>
            <div className="right-surface">
              <span>L</span>
            </div>
            <div className="bottom-surface">
              <span>I</span>
            </div>
            <div className="left-surface">
              <span>P</span>
            </div>
            {i >= 27 ? null : (
              <div className="middle-surface">
                <span>M</span>
              </div>
            )}
          </div>
        </div>
      );
      counter++;
    }
    return plot;
  }

  generateToothLowerRightSet() {
    let plot = [];
    for (let i = 32; i < 26; i--) {
      plot.push(
        <div
          className={
            "col tooth-sec up-side " +
            (i <= 10
              ? "incisors-up-up-"
              : i === 11
              ? "canine-up-"
              : i <= 13
              ? "premolar-up-"
              : "i molar-up-") +
            i
          }
        >
          <span>{i}</span>
          <div className="surface-Marking">
            <div className="top-surface">
              <span>D</span>
            </div>
            <div className="right-surface">
              <span>L</span>
            </div>
            <div className="bottom-surface">
              <span>I</span>
            </div>
            <div className="left-surface">
              <span>P</span>
            </div>
            {i >= 12 ? (
              <div className="middle-surface">
                <span>M</span>
              </div>
            ) : null}
          </div>
        </div>
      );
    }
    return plot;
  }

  render() {
    debugger;
    return (
      <div id="dentalTreatment">
        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          {/* <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Dental Chart</h3>
            </div>
            <div className="actions"> </div>
          </div> */}
          <div className="portlet-body">
            <div className="row">
              <AlagehFormGroup
                div={{ className: "col-lg-4" }}
                label={{
                  forceLabel: "Treatment Plan",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "",
                  value: "",
                  events: {
                    onChange: null
                  },
                  others: {
                    placeholder: "Enter Treatment Name"
                  }
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Select a Procedure",
                  isImp: true
                }}
                selector={{
                  name: "dentalProcedure",
                  className: "select-fld",
                  value: "",
                  dataSource: {
                    data: []
                  },
                  onChange: null,
                  others: {}
                }}
              />
            </div>
          </div>
        </div>

        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Dental Chart</h3>
            </div>
            <div className="actions"> </div>
          </div>
          <div className="portlet-body">
            <div className="row top-teeth-sec">
              <div className="col-lg-6 teeth-sec">
                <h6>Upper Left</h6>
                <div className="row">{this.generateToothUpperLeftSet()}</div>
                {/* <div className="row">
                  <div className="col tooth-sec up-side molar-up-1">
                    <span>1</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec up-side molar-up-2">
                    <span>2</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec up-side molar-up-3">
                    <span>3</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec up-side premolar-up-4">
                    <span>4</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec up-side premolar-up-5">
                    <span>5</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec up-side canine-up-6">
                    <span>6</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec up-side incisors-up-up-7">
                    <span>7</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec up-side incisors-up-up-8">
                    <span>8</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="col-lg-6 teeth-sec">
                <h6>Upper Right</h6>
                <div className="row">{this.generateToothUpperRightSet()}</div>
                {/* <div className="row">
                  <div className="col tooth-sec up-side incisors-up-up-9">
                    <span>9</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec up-side incisors-up-up-10">
                    <span>10</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec up-side canine-up-11">
                    <span>11</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec up-side premolar-up-12">
                    <span>12</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec up-side premolar-up-13">
                    <span>13</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec up-side molar-up-14">
                    <span>14</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec up-side molar-up-15">
                    <span>15</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec up-side molar-up-16">
                    <span>16</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="row bottom-teeth-sec">
              <div className="col-lg-6 teeth-sec">
                <div className="row">{this.generateToothLowerLeftSet()}</div>
                {/* <div className="row">
                  <div className="col tooth-sec down-side molar-down-1">
                    <span>1</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side molar-down-2">
                    <span>2</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side molar-down-3">
                    <span>3</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side premolar-down-4">
                    <span>4</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side premolar-down-5">
                    <span>5</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side canine-down-6">
                    <span>6</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side incisors-down-7">
                    <span>7</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side incisors-down-8">
                    <span>8</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                    </div>
                  </div>
                </div> */}

                <h6>Lower Left</h6>
              </div>
              <div className="col-lg-6 teeth-sec">
                <div className="row">
                  <div className="col tooth-sec down-side incisors-down-9">
                    <span>17</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side incisors-down-10">
                    <span>18</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side canine-down-11">
                    <span>16</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side premolar-down-12">
                    <span>12</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side premolar-down-13">
                    <span>15</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side molar-down-14">
                    <span>9</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side molar-down-15">
                    <span>10</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side molar-down-16">
                    <span>11</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                </div>
                <h6>Lower Right</h6>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 margin-bottom-15">
            <button className="btn btn-primary" style={{ float: "right" }}>
              Add to List
            </button>
          </div>
        </div>

        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Procedure List</h3>
            </div>
            <div className="actions"> </div>
          </div>
          <div className="portlet-body">GRID COMES HERE</div>
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
  )(Dental)
);
