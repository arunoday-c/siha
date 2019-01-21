import React, { Component } from "react";
import "./salary_apprsl.css";

import {
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
class SalaryApprisal extends Component {
  render() {
    return (
      <div className="SalaryApprisalWrapper">
        <div className="row  inner-top-search">
          <div className="col-3" style={{ marginTop: 10 }}>
            <div
              className="row"
              style={{
                border: " 1px solid #ced4d9",
                borderRadius: 5,
                marginLeft: 0
              }}
            >
              <div className="col">
                <AlgaehLabel label={{ forceLabel: "Select a Employee." }} />
                <h6>---------</h6>
              </div>
              <div
                className="col-lg-3"
                style={{ borderLeft: "1px solid #ced4d8" }}
              >
                <i
                  className="fas fa-search fa-lg"
                  style={{
                    paddingTop: 17,
                    paddingLeft: 3,
                    cursor: "pointer"
                  }}
                  //   onClick={employeeSearch.bind(this, this)}
                />
              </div>
            </div>
          </div>
          {/* Employee Global Search End here */}

          <div className="col form-group">
            <button style={{ marginTop: 21 }} className="btn btn-primary">
              Load
            </button>{" "}
            <button
              style={{ marginTop: 21, marginLeft: 5 }}
              className="btn btn-default"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Evaluation</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "General Evaluation",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      events: {},
                      others: {
                        type: "number"
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Objective Weightage",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",

                      events: {},
                      others: {
                        type: "number"
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Total Weightage",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",

                      events: {},
                      others: {
                        type: "number"
                      }
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col form-group">
                    <label className="style_Label ">Computed Percentage</label>
                    <h6>0.00</h6>
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Final Percentage",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",

                      events: {},
                      others: {
                        type: "number"
                      }
                    }}
                  />
                  <div className="col form-group">
                    <label className="style_Label ">Computed Ratings</label>
                    <h6>Out Standing</h6>
                  </div>
                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{ forceLabel: "Final Ratings", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <label>Recomend to remain in service</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input type="checkbox" name="leave_carry_forward" />
                      <span>Yes</span>
                    </label>
                  </div>
                  <textarea
                    className="col textArea"
                    placeholder="Remarks"
                    disabled
                  />
                </div>
                <div className="col-6">
                  <div className="row">
                    <div className="col">
                      <label>Needs Improvment/ Training</label>
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input type="checkbox" name="leave_carry_forward" />
                          <span>Yes</span>
                        </label>
                      </div>
                      <div className="row">
                        <AlagehAutoComplete
                          div={{ className: "col form-group" }}
                          label={{ forceLabel: "Training List", isImp: false }}
                          selector={{
                            name: "",
                            className: "select-fld",
                            dataSource: {},
                            others: {}
                          }}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <label>Extend Probotion Period</label>
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input type="checkbox" name="leave_carry_forward" />
                          <span>Yes</span>
                        </label>
                      </div>
                      <div className="row">
                        <AlgaehDateHandler
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Select end of Probotion Period",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: ""
                          }}
                          maxDate={new Date()}
                          events={{}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Salary Summary</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="col-12">
                  <div className="row">
                    <div className="col" style={{ paddingLeft: 0 }}>
                      <div className="row">
                        <AlgaehDateHandler
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Increment Effective Date",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: ""
                          }}
                          maxDate={new Date()}
                          events={{}}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Increment Percentage",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",

                            events: {},
                            others: {
                              type: "number"
                            }
                          }}
                        />
                        <div className="col-3">
                          <button
                            className="btn btn-primary"
                            style={{ marginTop: 21 }}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row margin-top-15">
                    <div className="col-6 algaehLabelFormGroup">
                      <label className="algaehLabelGroup">CTC</label>
                      <div className="row">
                        <div className="col">
                          <label className="style_Label ">
                            Monthly Present
                          </label>
                          <h6>0.00</h6>
                        </div>{" "}
                        <div className="col">
                          <label className="style_Label ">Monthly New</label>
                          <h6>0.00</h6>
                        </div>{" "}
                        <div className="col">
                          <label className="style_Label ">Yearly Present</label>
                          <h6>0.00</h6>
                        </div>{" "}
                        <div className="col">
                          <label className="style_Label ">Yearly Old</label>
                          <h6>0.00</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 algaehLabelFormGroup">
                      <label className="algaehLabelGroup">Gross Earnings</label>
                      <div className="row">
                        <div className="col">
                          <label className="style_Label ">
                            Monthly Present
                          </label>
                          <h6>0.00</h6>
                        </div>{" "}
                        <div className="col">
                          <label className="style_Label ">Monthly New</label>
                          <h6>0.00</h6>
                        </div>{" "}
                        <div className="col">
                          <label className="style_Label ">Yearly Present</label>
                          <h6>0.00</h6>
                        </div>{" "}
                        <div className="col">
                          <label className="style_Label ">Yearly Old</label>
                          <h6>0.00</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 algaehLabelFormGroup">
                      <label className="algaehLabelGroup">
                        Employer Contribution
                      </label>
                      <div className="row">
                        <div className="col-6">
                          <label className="style_Label ">
                            Monthly Present
                          </label>
                          <h6>0.00</h6>
                        </div>{" "}
                        <div className="col-6">
                          <label className="style_Label ">Monthly New</label>
                          <h6>0.00</h6>
                        </div>{" "}
                        <div className="col-6">
                          <label className="style_Label ">Yearly Present</label>
                          <h6>0.00</h6>
                        </div>{" "}
                        <div className="col-6">
                          <label className="style_Label ">Yearly Old</label>
                          <h6>0.00</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 algaehLabelFormGroup">
                      <label className="algaehLabelGroup">Perks</label>
                      <div className="row">
                        <div className="col-6">
                          <label className="style_Label ">
                            Monthly Present
                          </label>
                          <h6>0.00</h6>
                        </div>{" "}
                        <div className="col-6">
                          <label className="style_Label ">Monthly New</label>
                          <h6>0.00</h6>
                        </div>{" "}
                        <div className="col-6">
                          <label className="style_Label ">Yearly Present</label>
                          <h6>0.00</h6>
                        </div>{" "}
                        <div className="col-6">
                          <label className="style_Label ">Yearly Old</label>
                          <h6>0.00</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 algaehLabelFormGroup">
                      <label className="algaehLabelGroup">
                        Immediate effect of Increment on
                      </label>
                      <div className="row">
                        <div className="col-12">
                          <label className="style_Label ">Gratuity</label>
                          <h6>0.00</h6>
                        </div>{" "}
                        <div className="col-12">
                          <label className="style_Label ">Arrears CTC</label>
                          <h6>0.00</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="portlet portlet-bordered margin-bottom-15">
                      <div className="portlet-title">
                        <div className="caption">
                          <h3 className="caption-subject">Employee Earnings</h3>
                        </div>
                      </div>
                      <div className="portlet-body">
                        <div className="row">
                          <div
                            className="col-12"
                            id="NewAppraisalEarnings_Cntr"
                          >
                            <AlgaehDataGrid
                              id="NewAppraisalEarnings"
                              datavalidate="NewAppraisalEarnings"
                              columns={[
                                {
                                  fieldName: "EarningDesc.",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "Earning Desc." }}
                                    />
                                  )
                                },
                                {
                                  fieldName: "PMAmount",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "PM Amount" }}
                                    />
                                  )
                                },
                                {
                                  fieldName: "NMAmount",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "NM Amount" }}
                                    />
                                  )
                                },
                                {
                                  fieldName: "PYAmount",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "PY Amount" }}
                                    />
                                  )
                                },
                                {
                                  fieldName: "NYAmount",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "NY Amount" }}
                                    />
                                  )
                                }
                              ]}
                              keyId=""
                              dataSource={{ data: [] }}
                              isEditable={false}
                              paging={{ page: 0, rowsPerPage: 10 }}
                              events={{}}
                              others={{}}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="portlet portlet-bordered margin-bottom-15">
                      <div className="portlet-title">
                        <div className="caption">
                          <h3 className="caption-subject">
                            Employer Contribution
                          </h3>
                        </div>
                      </div>
                      <div className="portlet-body">
                        <div className="row">
                          <div
                            className="col-12"
                            id="NewAppraisalContributions_Cntr"
                          >
                            <AlgaehDataGrid
                              id="NewAppraisalContributions"
                              datavalidate="NewAppraisalContributions"
                              columns={[
                                {
                                  fieldName: "EarningDesc.",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "Earning Desc." }}
                                    />
                                  )
                                },
                                {
                                  fieldName: "PMAmount",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "PM Amount" }}
                                    />
                                  )
                                },
                                {
                                  fieldName: "NMAmount",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "NM Amount" }}
                                    />
                                  )
                                },
                                {
                                  fieldName: "PYAmount",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "PY Amount" }}
                                    />
                                  )
                                },
                                {
                                  fieldName: "NYAmount",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "NY Amount" }}
                                    />
                                  )
                                }
                              ]}
                              keyId=""
                              dataSource={{ data: [] }}
                              isEditable={false}
                              paging={{ page: 0, rowsPerPage: 10 }}
                              events={{}}
                              others={{}}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="portlet portlet-bordered margin-bottom-15">
                      <div className="portlet-title">
                        <div className="caption">
                          <h3 className="caption-subject">Perks</h3>
                        </div>
                      </div>
                      <div className="portlet-body">
                        <div className="row">
                          <div className="col-12" id="NewAppraisalPerks_Cntr">
                            <AlgaehDataGrid
                              id="NewAppraisalPerks"
                              datavalidate="NewAppraisalPerks"
                              columns={[
                                {
                                  fieldName: "EarningDesc.",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "Earning Desc." }}
                                    />
                                  )
                                },
                                {
                                  fieldName: "PMAmount",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "PM Amount" }}
                                    />
                                  )
                                },
                                {
                                  fieldName: "NMAmount",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "NM Amount" }}
                                    />
                                  )
                                },
                                {
                                  fieldName: "PYAmount",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "PY Amount" }}
                                    />
                                  )
                                },
                                {
                                  fieldName: "NYAmount",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "NY Amount" }}
                                    />
                                  )
                                }
                              ]}
                              keyId=""
                              dataSource={{ data: [] }}
                              isEditable={false}
                              paging={{ page: 0, rowsPerPage: 10 }}
                              events={{}}
                              others={{}}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="portlet portlet-bordered margin-bottom-15">
                      <div className="portlet-title">
                        <div className="caption">
                          <h3 className="caption-subject">Others</h3>
                        </div>
                      </div>
                      <div className="portlet-body">
                        <div className="row">
                          <div className="col-12" id="NewAppraisalOther_Cntr">
                            <AlgaehDataGrid
                              id="NewAppraisalPerks"
                              datavalidate="NewAppraisalPerks"
                              columns={[
                                {
                                  fieldName: "EarningDesc.",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "Earning Desc." }}
                                    />
                                  )
                                },
                                {
                                  fieldName: "PMAmount",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "PM Amount" }}
                                    />
                                  )
                                },
                                {
                                  fieldName: "NMAmount",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "NM Amount" }}
                                    />
                                  )
                                },
                                {
                                  fieldName: "PYAmount",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "PY Amount" }}
                                    />
                                  )
                                },
                                {
                                  fieldName: "NYAmount",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "NY Amount" }}
                                    />
                                  )
                                }
                              ]}
                              keyId=""
                              dataSource={{ data: [] }}
                              isEditable={false}
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
        </div>
      </div>
    );
  }
}

export default SalaryApprisal;
