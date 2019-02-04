import React, { Component } from "react";
import "./EndServiceOption.css";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import { EOS_CALC } from "../../../../utils/GlobalVariables.json";

export default class EndServiceOption extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  textHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  render() {
    return (
      <div className="endServiceOption">
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "EOS Calculation Method",
                      isImp: false
                    }}
                    selector={{
                      name: "end_of_service_calculation",
                      value: this.state.end_of_service_calculation,
                      className: "select-fld",
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: EOS_CALC
                      },
                      onChange: this.dropDownHandler.bind(this),
                      onClear: () => {
                        this.setState({
                          end_of_service_calculation: null
                        });
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{ forceLabel: "Termination Setup", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Gratuity Payment Type",
                      isImp: false
                    }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{ forceLabel: "Calculation Type", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />
                </div>
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{ forceLabel: "Gratuity Provision", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Maximum Limit",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      others: {
                        type: "text"
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Yearly Marking days",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      others: {
                        type: "text"
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Eligible Months for Gratuity",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      others: {
                        type: "text"
                      }
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col-2">
                    <label>Gratuity in Final Settlement</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="Y"
                          name="gratuity_in_final_settle"
                          checked={this.state.gratuity_in_final_settle === "Y"}
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>Yes</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          value="N"
                          name="gratuity_in_final_settle"
                          checked={this.state.gratuity_in_final_settle === "N"}
                          onChange={this.textHandler.bind(this)}
                          type="radio"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                  <div className="col">
                    <label>Validate Yearly working days</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          value="yes"
                          name="fetchMachineData"
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                  </div>{" "}
                  <div className="col">
                    <label>Pay pending salaries with final</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          value="yes"
                          name="fetchMachineData"
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                  </div>{" "}
                  <div className="col">
                    <label>Round off nearest year</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          value="yes"
                          name="fetchMachineData"
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Resignation Information</h3>
                </div>
                <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <label>Eligibility Required</label>
                        <div className="customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              value="yes"
                              name="fetchMachineData"
                            />
                            <span>Yes</span>
                          </label>
                        </div>
                      </div>
                      <div className="col-12" id="ResignationEligibility_Cntr">
                        <AlgaehDataGrid
                          id="ResignationEligibility"
                          datavalidate="ResignationEligibility"
                          columns={[
                            {
                              fieldName: "Column_1",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Column 1" }}
                                />
                              )
                            },
                            {
                              fieldName: "Column_2",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Column 2" }}
                                />
                              )
                            }
                          ]}
                          keyId=""
                          dataSource={{ data: [] }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{}}
                          others={{}}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <label>Apply late rules</label>
                        <div className="customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              value="yes"
                              name="fetchMachineData"
                            />
                            <span>Yes</span>
                          </label>
                        </div>
                      </div>
                      <div className="col-12" id="ResignationMinYear_Cntr">
                        <AlgaehDataGrid
                          id="ResignationMinYear"
                          datavalidate="ResignationMinYear"
                          columns={[
                            {
                              fieldName: "Column_1",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Column 1" }}
                                />
                              )
                            },
                            {
                              fieldName: "Column_2",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Column 2" }}
                                />
                              )
                            }
                          ]}
                          keyId=""
                          dataSource={{ data: [] }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{}}
                          others={{}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Termination Information</h3>
                </div>
                <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <label>Apply late rules</label>
                        <div className="customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              value="yes"
                              name="fetchMachineData"
                            />
                            <span>Yes</span>
                          </label>
                        </div>
                      </div>
                      <div className="col-12" id="TerminationEligility_Cntr">
                        <AlgaehDataGrid
                          id="TerminationEligility"
                          datavalidate="TerminationEligility"
                          columns={[
                            {
                              fieldName: "Column_1",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Column 1" }}
                                />
                              )
                            },
                            {
                              fieldName: "Column_2",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Column 2" }}
                                />
                              )
                            }
                          ]}
                          keyId=""
                          dataSource={{ data: [] }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{}}
                          others={{}}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <label>Apply late rules</label>
                        <div className="customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              value="yes"
                              name="fetchMachineData"
                            />
                            <span>Yes</span>
                          </label>
                        </div>
                      </div>
                      <div className="col-12" id="TerminationMinYear_Cntr">
                        <AlgaehDataGrid
                          id="TerminationMinYear"
                          datavalidate="TerminationMinYear"
                          columns={[
                            {
                              fieldName: "Column_1",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Column 1" }}
                                />
                              )
                            },
                            {
                              fieldName: "Column_2",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Column 2" }}
                                />
                              )
                            }
                          ]}
                          keyId=""
                          dataSource={{ data: [] }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{}}
                          others={{}}
                        />
                      </div>
                    </div>
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
