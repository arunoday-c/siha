import React, { Component } from "react";
import "./perf_review.scss";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { MainContext } from "algaeh-react-components/context";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler,
} from "../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import Enumerable from "linq";
import moment from "moment";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
export default class PerformanceReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      hospital_id: null,
      employee: [],
    };
    this.getHospitals();
    this.getEmployees();
  }
  employeeSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details.employee,
      },
      searchName: "employee",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: (row) => {
        this.setState(
          {
            employee: row,
            employee_name: row.full_name,
            employee_id: row.hims_d_employee_id,
          },
          () => {}
        );
      },
    });
  }
  loadEmployeeDetails() {
    // console.log("affaf", this.state.employee);
  }

  getEmployees() {
    algaehApiCall({
      uri: "/employee/get",
      module: "hrManagement",
      data: { hospital_id: this.state.hospital_id },
      method: "GET",

      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            employees: res.data.records,
          });
        }
      },

      onFailure: (err) => {},
    });
  }

  getHospitals() {
    algaehApiCall({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            hospitals: res.data.records,
          });
        }
      },

      onFailure: (err) => {},
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value,
    });
  }

  render() {
    let PerfRevData = this.state.employee;
    return (
      <div className="performanceReviewScreen">
        <div className="row  inner-top-search">
          {" "}
          <AlagehAutoComplete
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              forceLabel: "Branch",
              isImp: true,
            }}
            selector={{
              name: "hospital_id",
              className: "select-fld",
              value: this.state.hospital_id,
              dataSource: {
                textField: "hospital_name",
                valueField: "hims_d_hospital_id",
                data: this.state.hospitals,
              },
              onChange: this.dropDownHandler.bind(this),
            }}
            showLoading={true}
          />
          <div className="col-3 globalSearchCntr">
            <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
            <h6 onClick={this.employeeSearch.bind(this)}>
              {this.state.employee_name
                ? this.state.employee_name
                : "Search Employee"}
              <i className="fas fa-search fa-lg"></i>
            </h6>
          </div>
          {/* Employee Global Search End here */}
          <div className="col form-group">
            <button style={{ marginTop: 19 }} className="btn btn-default">
              Clear
            </button>{" "}
            <button
              style={{ marginTop: 19, marginLeft: 5 }}
              className="btn btn-primary"
              onClick={this.loadEmployeeDetails.bind(this)}
            >
              Load
            </button>
          </div>
        </div>

        <div className="row">
          {" "}
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Employee Details</h3>
                    </div>
                    <div className="actions" />
                  </div>
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-2">
                        <label className="style_Label ">Employee Code</label>
                        <h6>
                          {PerfRevData.employee_code
                            ? PerfRevData.employee_code
                            : "------"}
                        </h6>
                      </div>

                      <div className="col">
                        <label className="style_Label ">Employee Name</label>
                        <h6>
                          {PerfRevData.full_name
                            ? PerfRevData.full_name
                            : "------"}
                        </h6>
                      </div>

                      <div className="col-2">
                        <label className="style_Label ">Designation</label>
                        <h6>
                          {PerfRevData.designation
                            ? PerfRevData.designation
                            : "------"}
                        </h6>
                      </div>
                      <div className="col-2">
                        <label className="style_Label ">Gender</label>
                        <h6>{PerfRevData.sex ? PerfRevData.sex : "------"}</h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-2">
                        <label className="style_Label ">Date of Joining</label>
                        <h6>
                          {PerfRevData.date_of_joining
                            ? moment(PerfRevData.date_of_joining).format(
                                "DD-MMM-YYYY"
                              )
                            : "------"}
                        </h6>
                      </div>
                      <div className="col-2">
                        <label className="style_Label ">Department</label>
                        <h6>
                          {PerfRevData.department_name
                            ? PerfRevData.department_name
                            : "------"}
                        </h6>
                      </div>
                      <div className="col-2">
                        <label className="style_Label ">Sub Department</label>
                        <h6>
                          {PerfRevData.sub_department_name
                            ? PerfRevData.sub_department_name
                            : "------"}
                        </h6>
                      </div>

                      <div className="col-2">
                        <label className="style_Label ">Review Period</label>
                        <h6>
                          {PerfRevData.review_period
                            ? PerfRevData.review_period
                            : "------"}
                        </h6>
                      </div>
                      <div className="col-2">
                        <label className="style_Label ">Year of Service</label>
                        <h6>
                          {PerfRevData.service_year
                            ? PerfRevData.service_year
                            : "------"}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-9">
                <div className="row">
                  <div className="col-12">
                    <div className="portlet portlet-bordered margin-bottom-15">
                      <div className="portlet-title">
                        <div className="caption">
                          <h3 className="caption-subject">
                            Key Performance Indicator (KPI)
                          </h3>
                        </div>
                        <div className="actions" />
                      </div>
                      <div className="portlet-body">
                        <div className="row">
                          <div className="col-12" id="KPIGrid_Cntr">
                            <AlgaehDataGrid
                              id="KPIGrid_Cntr"
                              columns={[
                                {
                                  fieldName: "kpis",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "KPI's" }}
                                    />
                                  ),
                                  others: { maxWidth: 200 },
                                },
                                {
                                  fieldName: "kpi_measure",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "Measure" }}
                                    />
                                  ),
                                  others: { maxWidth: 350 },
                                },
                                {
                                  fieldName: "targetDate",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "Target Date" }}
                                    />
                                  ),
                                  others: { maxWidth: 100 },
                                },
                                {
                                  fieldName: "kpi_result_1",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "Results Level 1" }}
                                    />
                                  ),
                                  displayTemplate: (row) => {
                                    return (
                                      <AlagehFormGroup
                                        div={{ className: "col" }}
                                        textBox={{
                                          className: "txt-fld",
                                          name: "kpi_result_fld",
                                          value: "",
                                          events: {
                                            // onChange: this.textHandler.bind(this),
                                          },
                                          others: {
                                            type: "text",
                                          },
                                        }}
                                      />
                                    );
                                  },
                                  others: { maxWidth: 150 },
                                },
                                {
                                  fieldName: "kpi_result_2",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "Results Level 2" }}
                                    />
                                  ),
                                  displayTemplate: (row) => {
                                    return (
                                      <AlagehFormGroup
                                        div={{ className: "col" }}
                                        textBox={{
                                          className: "txt-fld",
                                          name: "kpi_result_fld",
                                          value: "",
                                          events: {
                                            // onChange: this.textHandler.bind(this),
                                          },
                                          others: {
                                            type: "text",
                                          },
                                        }}
                                      />
                                    );
                                  },
                                  others: { maxWidth: 150 },
                                },
                                {
                                  fieldName: "kpi_comments",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "Review Comments" }}
                                    />
                                  ),
                                  displayTemplate: (row) => {
                                    return (
                                      <AlagehFormGroup
                                        div={{ className: "col" }}
                                        textBox={{
                                          className: "txt-fld",
                                          name: "kpi_comments_fld",
                                          value: "",
                                          events: {
                                            // onChange: this.textHandler.bind(this),
                                          },
                                          others: {
                                            type: "text",
                                          },
                                        }}
                                      />
                                    );
                                  },
                                },
                              ]}
                              keyId=""
                              dataSource={{}}
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
                  <div className="col-12">
                    <div className="portlet portlet-bordered margin-bottom-15">
                      <div className="portlet-title">
                        <div className="caption">
                          <h3 className="caption-subject">Competency (KPI)</h3>
                        </div>
                        <div className="actions" />
                      </div>
                      <div className="portlet-body">
                        <div className="row">
                          <div className="col-12" id="CompetencyGrid_Cntr">
                            <AlgaehDataGrid
                              id="CompetencyGrid_Cntr"
                              columns={[
                                {
                                  fieldName: "competency_factor",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "Factor" }}
                                    />
                                  ),
                                  others: { maxWidth: 200 },
                                },
                                {
                                  fieldName: "competency_factor_measure",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "Measure" }}
                                    />
                                  ),
                                  others: { maxWidth: 350 },
                                },
                                {
                                  fieldName: "competency_factor_result_1",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "Results Level 1" }}
                                    />
                                  ),
                                  displayTemplate: (row) => {
                                    return (
                                      <AlagehFormGroup
                                        div={{ className: "col" }}
                                        textBox={{
                                          className: "txt-fld",
                                          name: "kpi_result_fld_1",
                                          value: "",
                                          events: {
                                            // onChange: this.textHandler.bind(this),
                                          },
                                          others: {
                                            type: "text",
                                          },
                                        }}
                                      />
                                    );
                                  },
                                  others: { maxWidth: 150 },
                                },
                                {
                                  fieldName: "competency_factor_result_2",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "Results Level 2" }}
                                    />
                                  ),
                                  displayTemplate: (row) => {
                                    return (
                                      <AlagehFormGroup
                                        div={{ className: "col" }}
                                        textBox={{
                                          className: "txt-fld",
                                          name: "kpi_result_fld_2",
                                          value: "",
                                          events: {
                                            // onChange: this.textHandler.bind(this),
                                          },
                                          others: {
                                            type: "text",
                                          },
                                        }}
                                      />
                                    );
                                  },
                                  others: { maxWidth: 150 },
                                },
                                {
                                  fieldName: "competency_factor_comments",
                                  label: (
                                    <AlgaehLabel
                                      label={{ forceLabel: "Review Comments" }}
                                    />
                                  ),
                                  displayTemplate: (row) => {
                                    return (
                                      <AlagehFormGroup
                                        div={{ className: "col" }}
                                        textBox={{
                                          className: "txt-fld",
                                          name: "kpi_comments_fld",
                                          value: "",
                                          events: {
                                            // onChange: this.textHandler.bind(this),
                                          },
                                          others: {
                                            type: "text",
                                          },
                                        }}
                                      />
                                    );
                                  },
                                },
                              ]}
                              keyId=""
                              dataSource={{}}
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
              <div className="col-3">
                <div className="row">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    {/* <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">Competency (KPI)</h3>
                      </div>
                      <div className="actions" />
                    </div> */}
                    <div className="portlet-body">
                      <div className="row">
                        <div className="col-12 form-group">
                          <label className="style_Label ">
                            Avg. KPI Score ( Weight 70%)
                          </label>
                          <h6>
                            {PerfRevData.full_name
                              ? PerfRevData.full_name
                              : "------"}
                          </h6>
                        </div>
                        <div className="col-12 form-group">
                          <label className="style_Label ">
                            Avg. Competency Score ( Weight 30%)
                          </label>
                          <h6>
                            {PerfRevData.full_name
                              ? PerfRevData.full_name
                              : "------"}
                          </h6>
                        </div>
                        <div className="col-12 form-group">
                          <label className="style_Label ">
                            Overall Review Result
                          </label>
                          <h6>
                            {PerfRevData.full_name
                              ? PerfRevData.full_name
                              : "------"}
                          </h6>
                        </div>

                        <div className="col-12 form-group">
                          <label>Discussued with Employee</label>
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

                        <div className="col-12">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Final Manager Comment",
                            }}
                          />
                          <textarea value="" name="manager_comment" />
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
