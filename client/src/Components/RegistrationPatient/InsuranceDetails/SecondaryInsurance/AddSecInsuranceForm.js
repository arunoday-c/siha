import React, { Component } from "react";
import Dropzone from "react-dropzone";
import "./SecondaryInsurance.css";
import "../../../../styles/site.css";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import AddCircle from "@material-ui/icons/AddCircle";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";

const FORMAT_DEFAULT = [
  { name: "CSV", value: 0 },
  { name: "XML", value: 1 },
  { name: "XLS", value: 2 }
];

const INSURANCE_DECISION = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" }
];

export default class AddSecInsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frontSide: "",
      backSide: ""
    };
    this.widthImg;
  }

  componentWillUpdate(nextProps, nextState) {
    var width = document.getElementById("attach-width").offsetWidth;
    this.widthImg = width + 1;
  }

  onDrop(fileName, file) {
    this.setState({
      [fileName]: file[0].preview
    });
  }
  selectedValueInsurance() {}

  render() {
    return (
      <div className="htpl-phase1-seconary-insurance-form">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xl-8 primary-details">
              <div className="row primary-box-container">
                <div className="col-lg-2">
                  <label>Insurance</label>
                  <br />
                  <div className="row">
                    {INSURANCE_DECISION.map((data, idx) => {
                      return (
                        <div
                          className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                          key={"index_value" + idx}
                        >
                          <input
                            type="radio"
                            name="INSURANCE_DECISION"
                            className="htpl-phase1-radio-btn"
                            value={data.value}
                            onChange={this.selectedValueInsurance.bind(
                              this,
                              data.value
                            )}
                            defaultChecked={data.value === "No" ? true : false}
                          />
                          <label className="radio-design">{data.label}</label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="col-lg-1">
                  <Tooltip id="tooltip-icon" title="Add New">
                    <IconButton className="go-button" color="primary">
                      <AddCircle />
                    </IconButton>
                  </Tooltip>
                </div>
                <AlagehAutoComplete
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "insurance_id"
                  }}
                  selector={{
                    name: "secondary_insurance_id",
                    className: "select-fld",
                    value: this.state.secondary_insurance_id,
                    dataSource: {
                      textField:
                        this.state.selectedLang == "en" ? "name" : "name",
                      valueField: "value",
                      data: FORMAT_DEFAULT
                    },
                    onChange: null
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "sub_insurance_id"
                  }}
                  selector={{
                    name: "insurance_id",
                    className: "select-fld",
                    value: this.state.insurance_id,
                    dataSource: {
                      textField:
                        this.state.selectedLang == "en" ? "name" : "name",
                      valueField: "value",
                      data: FORMAT_DEFAULT
                    },
                    onChange: null
                  }}
                />
                <div className="col-lg-1">
                  <Tooltip id="tooltip-icon" title="Process">
                    <IconButton className="go-button" color="primary">
                      <PlayCircleFilled />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              <div className="row primary-box-container">
                <AlagehAutoComplete
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "plan_id"
                  }}
                  selector={{
                    name: "plan_id",
                    className: "select-fld",
                    value: this.state.plan_id,
                    dataSource: {
                      textField:
                        this.state.selectedLang == "en" ? "name" : "name",
                      valueField: "value",
                      data: FORMAT_DEFAULT
                    },
                    onChange: null
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "policy_id"
                  }}
                  selector={{
                    name: "policy_id",
                    className: "select-fld",
                    value: this.state.policy_id,
                    dataSource: {
                      textField:
                        this.state.selectedLang == "en" ? "name" : "name",
                      valueField: "value",
                      data: FORMAT_DEFAULT
                    },
                    onChange: null
                  }}
                />
                <AlgaehDateHandler
                  div={{ className: "col-lg-3" }}
                  label={{ fieldName: "effective_start_date" }}
                  textBox={{ className: "txt-fld" }}
                  minDate={new Date()}
                  events={{
                    onChange: null
                  }}
                  value={this.state.effective_start_date}
                />
                <AlgaehDateHandler
                  div={{ className: "col-lg-3" }}
                  label={{ fieldName: "expiry_date" }}
                  textBox={{ className: "txt-fld" }}
                  minDate={new Date()}
                  events={{
                    onChange: null
                  }}
                  value={this.state.effective_end_date}
                />
              </div>
            </div>

            {/* //effective_end_date// */}

            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 secondary-details">
              <div className="row secondary-box-container">
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                  <div className="image-drop-area">
                    <Dropzone
                      onDrop={this.onDrop.bind(this, "frontSide")}
                      className="dropzone"
                      id="attach-primary-id"
                      accept="image/*"
                      multiple={false}
                      name="image"
                    >
                      <div
                        className="attach-design text-center"
                        id="attach-width"
                      >
                        <AlgaehLabel
                          label={{
                            fieldName: "attach_front"
                          }}
                        />
                      </div>
                    </Dropzone>
                  </div>

                  <div>
                    <img
                      className="preview-image"
                      src={this.state.frontSide}
                      style={{ width: this.widthImg }}
                    />
                  </div>
                </div>

                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                  <div className="image-drop-area">
                    <Dropzone
                      onDrop={this.onDrop.bind(this, "backSide")}
                      className="dropzone"
                      id="attach-primary-id"
                      accept="image/*"
                      multiple={false}
                      name="image"
                    >
                      <div
                        className="attach-design text-center"
                        id="attach-width"
                      >
                        <AlgaehLabel
                          label={{
                            fieldName: "attach_back"
                          }}
                        />
                      </div>
                    </Dropzone>
                  </div>

                  <div>
                    <img
                      className="preview-image"
                      src={this.state.backSide}
                      style={{ width: this.widthImg }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
