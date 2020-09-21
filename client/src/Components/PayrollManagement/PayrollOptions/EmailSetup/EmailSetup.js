import React, { Component } from "react";
import "./EmailSetup.scss";
import {
  AlgaehLabel,
  AlagehAutoComplete,
} from "../../../Wrapper/algaehWrapper";
import { AlgaehSecurityElement } from "algaeh-react-components";

export default class EmailSetup extends Component {
  render() {
    return (
      <div className="row EmailSetupScreen">
        <div className="col-3 form-group">
          <div className="portlet portlet-bordered">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Leave Approval Email</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-12 form-group" }}
                  label={{
                    forceLabel: "Select Department",
                    isImp: true,
                  }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {
                      data: [],
                      textField: "",
                      valueField: "",
                    },
                    onChange: "",
                    value: "",
                    onClear: () => {
                      this.setState({});
                    },
                  }}
                />
                <div className="col-12">
                  <label>Attachment Requiured</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input type="checkbox" value="Y" name="" />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>
        <div className="col-3 form-group">
          <div className="portlet portlet-bordered">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Loan Approval Email</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-12 form-group" }}
                  label={{
                    forceLabel: "Select Department",
                    isImp: true,
                  }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {
                      data: [],
                      textField: "",
                      valueField: "",
                    },
                    onChange: "",
                    value: "",
                    onClear: () => {
                      this.setState({});
                    },
                  }}
                />
                <div className="col-12">
                  <label>Attachment Requiured</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input type="checkbox" value="Y" name="" />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>
        <div className="col-3 form-group">
          <div className="portlet portlet-bordered">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Encashment Approval Email</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-12 form-group" }}
                  label={{
                    forceLabel: "Select Department",
                    isImp: true,
                  }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    dataSource: {
                      data: [],
                      textField: "",
                      valueField: "",
                    },
                    onChange: "",
                    value: "",
                    onClear: () => {
                      this.setState({});
                    },
                  }}
                />
                <div className="col-12">
                  <label>Attachment Requiured</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input type="checkbox" value="Y" name="" />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>
        <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  // onClick={this.saveOptions.bind(this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Save", returnText: true }}
                  />
                </button>
              </div>
            </div>
          </div>
        </AlgaehSecurityElement>
      </div>
    );
  }
}
