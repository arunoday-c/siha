import React, { Component } from "react";
import "./LisConfig.scss";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
// import GlobalVariables from "../../../utils/GlobalVariables.json";

export default class LisConfig extends Component {
  render() {
    return (
      <div className="LisConfig">
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Lab Machine Details</h3>
                </div>
                <div className="actions"></div>
              </div>

              <div className="portlet-body">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-3" }}
                    label={{
                      forceLabel: "Machine Name",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {
                        onChange: ""
                      }
                    }}
                  />{" "}
                  <AlagehAutoComplete
                    div={{ className: "col-2" }}
                    label={{
                      forceLabel: "Comunication Type"
                    }}
                    selector={{
                      className: "select-fld",
                      name: "",
                      value: "",
                      dataSource: {},
                      onChange: ""
                    }}
                  />
                  <div className="col">
                    <label>Is HL7 Supported</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="Y"
                          name=""
                          checked=""
                          onChange=""
                        />
                        <span>Yes</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="N"
                          name=""
                          checked=""
                          onChange=""
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col">
                    <label>Checksum Required</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="Y"
                          name=""
                          checked=""
                          onChange=""
                        />
                        <span>Yes</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="N"
                          name=""
                          checked=""
                          onChange=""
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col">
                    <label>Connection Type</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="Y"
                          name=""
                          checked=""
                          onChange=""
                        />
                        <span>Serial Port Mode</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="N"
                          name=""
                          checked=""
                          onChange=""
                        />
                        <span>TCP Mode</span>
                      </label>
                    </div>
                  </div>
                </div>

                <hr></hr>
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Stat Flag",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {
                        onChange: ""
                      }
                    }}
                  />{" "}
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Routine Flag",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {
                        onChange: ""
                      }
                    }}
                  />{" "}
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Result Extension",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {
                        onChange: ""
                      }
                    }}
                  />{" "}
                  <div className="col">
                    <label>Order Mode</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="Y"
                          name=""
                          checked=""
                          onChange=""
                        />
                        <span>Query Mode</span>
                      </label>
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="N"
                          name=""
                          checked=""
                          onChange=""
                        />
                        <span>Download Mode</span>
                      </label>{" "}
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="N"
                          name=""
                          checked=""
                          onChange=""
                        />
                        <span>File Mode</span>
                      </label>
                    </div>
                  </div>{" "}
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "File Upload",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {
                        onChange: ""
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Serial Port Mode</h3>
                </div>
                <div className="actions"></div>
              </div>

              <div className="portlet-body">
                <div className="row">
                  {" "}
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "COM Port Name",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {
                        onChange: ""
                      }
                    }}
                  />{" "}
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Baud Rate",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {
                        onChange: ""
                      }
                    }}
                  />{" "}
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Result Path Location",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {
                        onChange: ""
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>{" "}
          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">TCP Port Mode</h3>
                </div>
                <div className="actions"></div>
              </div>

              <div className="portlet-body">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Host IP Address",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {
                        onChange: ""
                      }
                    }}
                  />{" "}
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Port No.",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {
                        onChange: ""
                      }
                    }}
                  />{" "}
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Result Path Location",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {
                        onChange: ""
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              {/* <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">TCP Port Mode</h3>
                </div>
                <div className="actions"></div>
              </div> */}

              <div className="portlet-body">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-3" }}
                    label={{
                      forceLabel: "Driver Name",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {
                        onChange: ""
                      }
                    }}
                  />{" "}
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Description",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {
                        onChange: ""
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button type="button" className="btn btn-primary">
                <AlgaehLabel label={{ forceLabel: "Save", returnText: true }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
