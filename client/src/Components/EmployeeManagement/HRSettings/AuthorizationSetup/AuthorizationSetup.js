import React, { Component } from "react";
import "./AuthorizationSetup.css";
import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import { AUTH_TYPE } from "../../../../utils/GlobalVariables.json";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import Employee from "../../../../Search/Employee.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

export default class AuthorizationSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sub_depts: [],
      no_employees: "ALL",
      no_auths: 0,
      options: {}
    };
    this.getSubDepartments();
    this.getOptions();
  }

  getOptions() {
    algaehApiCall({
      uri: "/payrollOptions/getHrmsOptions",
      method: "GET",
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({ options: res.data.result[0] }, () => {
            console.log("Options:", this.state.options);
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  getSubDepartments() {
    algaehApiCall({
      uri: "/department/get/subdepartment",
      method: "GET",
      module: "masterSettings",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            sub_depts: res.data.records
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  dropDownHandler(value) {
    switch (value.name) {
      case "auth_type":
        this.setState({
          [value.name]: value.value,
          no_auths:
            value.value === "LE"
              ? parseInt(this.state.options.leave_level, 10)
              : value.value === "LO"
              ? parseInt(this.state.options.loan_level, 10)
              : null,
          selected_auth_type: value.selected.name
        });
        break;

      case "sub_department_id":
        this.setState({
          [value.name]: value.value,
          selected_dept: value.selected.sub_department_name
        });
        break;

      default:
        this.setState({
          [value.name]: value.value
        });
        break;
    }
  }

  getAuthLevleSelectors() {
    let x = [];

    for (let i = 0; i < this.state.no_auths; i++) {
      x.push(i + 1);
    }
    return x.map((data, i) => (
      <div className="col" key={data}>
        <div
          className="row"
          style={{
            border: " 1px solid #ced4d9",
            borderRadius: 5,
            marginLeft: 0,
            marginRight: 0
          }}
        >
          <div className="col">
            <AlgaehLabel label={{ forceLabel: "Level " + data }} />
            <h6>
              {this.state["level_" + data + "_employee"]
                ? this.state["level_" + data + "_employee"]
                : "------"}
            </h6>
          </div>
          <div
            className="col-3"
            style={{
              borderLeft: "1px solid #ced4d8",
              paddingLeft: "6%"
            }}
          >
            <span
              className="fas fa-search fa-lg"
              style={{
                paddingTop: 17,
                paddingLeft: 3,
                cursor: "pointer"
              }}
              name={"level_" + data}
              onClick={this.employeeSearch.bind(this, "N")}
            />
          </div>
        </div>
      </div>
    ));
  }

  employeeSearch(employee, e) {
    if (this.state.auth_type === null || this.state.auth_type === undefined) {
      swalMessage({
        title: "Please Select an Auth Type",
        type: "warning"
      });
    } else if (
      this.state.sub_department_id === null ||
      this.state.sub_department_id === undefined
    ) {
      swalMessage({
        title: "Please Select a department",
        type: "warning"
      });
    } else {
      const _element_level = e.currentTarget.getAttribute("name");
      AlgaehSearch({
        searchGrid: {
          columns: Employee
        },
        searchName: "users",
        uri: "/gloabelSearch/get",
        inputs:
          employee == "Y"
            ? " E.sub_department_id=" + this.state.sub_department_id
            : null,
        onContainsChange: (text, serchBy, callBack) => {
          callBack(text);
        },
        onRowSelect: row => {
          this.setState(
            {
              [_element_level]: row.algaeh_d_app_user_id,
              [_element_level + "_employee"]: row.full_name
            },
            () => {}
          );
        }
      });
    }
  }

  textHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  assignAuthLevels() {
    let send_data = {
      no_employees: this.state.no_employees,
      employee_id: this.state.hims_d_employee_id,
      sub_dept_id: this.state.sub_department_id,
      auth_type: this.state.auth_type,
      no_auths: this.state.no_auths,
      level_1: this.state.level_1,
      level_2: this.state.level_2,
      level_3: this.state.level_3,
      level_4: this.state.level_4,
      level_5: this.state.level_5
    };

    algaehApiCall({
      uri: "/payrollSettings/assignAuthLevels",
      method: "POST",
      data: send_data,
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Record(s) added successfully . .",
            type: "success"
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  render() {
    return (
      <div className="AuthorizationSetupScreen">
        <div className="row  inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select Authorization Type", isImp: true }}
            selector={{
              name: "auth_type",
              value: this.state.auth_type,
              className: "select-fld",
              dataSource: {
                textField: "name",
                valueField: "value",
                data: AUTH_TYPE
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  auth_type: null
                });
              }
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select Department", isImp: true }}
            selector={{
              name: "sub_department_id",
              value: this.state.sub_department_id,
              className: "select-fld",
              dataSource: {
                textField: "sub_department_name",
                valueField: "hims_d_sub_department_id",
                data: this.state.sub_depts
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  hims_d_sub_department_id: null
                });
              }
            }}
          />
          <div className="col" style={{ paddingTop: 10 }}>
            <div className="customRadio">
              <label className="radio inline" style={{ display: "block" }}>
                <input
                  type="radio"
                  value="ALL"
                  name="no_employees"
                  checked={this.state.no_employees === "ALL"}
                  onChange={this.textHandler.bind(this)}
                />
                <span>All Employee</span>
              </label>

              <label className="radio inline" style={{ margin: 0 }}>
                <input
                  type="radio"
                  onChange={this.textHandler.bind(this)}
                  value="ONE"
                  name="no_employees"
                  checked={this.state.no_employees === "ONE"}
                />
                <span>Select an Employee</span>
              </label>
            </div>
          </div>
          {/* Radio ENd here Here */}
          {this.state.no_employees === "ONE" ? (
            <div className="col" style={{ marginTop: 7 }}>
              <div
                className="row"
                style={{
                  border: " 1px solid #ced4d9",
                  borderRadius: 5
                }}
              >
                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Select a Employee." }} />
                  <h6>
                    {" "}
                    {this.state.selected_dept
                      ? this.state.selected_dept
                      : "------"}
                  </h6>
                </div>
                <div
                  className="col-3"
                  style={{ borderLeft: "1px solid #ced4d8", paddingLeft: "6%" }}
                >
                  <i
                    className="fas fa-search fa-lg"
                    style={{
                      paddingTop: 17,
                      paddingLeft: 3,
                      cursor: "pointer"
                    }}
                    onClick={this.employeeSearch.bind(this, "Y")}
                  />
                </div>
              </div>
            </div>
          ) : null}
          {/* Select EMployee ENd here */}
          {/* 
          <div className="col">
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: 21 }}
            >
              Load
            </button>
          </div> */}
        </div>
        <div className="row">
          {/* row starts here*/}
          <div className="col-4">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row empSearchSection">
                  <AlagehFormGroup
                    div={{ className: "col-12" }}
                    label={{
                      forceLabel: "Search",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "search_employee",
                      value: "",
                      events: {}
                    }}
                  />
                </div>
                <div className="row employeeListUL">
                  <ul className="">
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>{" "}
                    <li>
                      <h5>Employee Name</h5>
                      <p>Employee Code</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="row">
              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-body">
                    <div className="row">
                      {this.getAuthLevleSelectors()}

                      {/* Select Employee End here Here */}

                      <div className="col-12 margin-top-15">
                        <div className="row">
                          <div className="col">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Selected Authorization Type"
                              }}
                            />
                            <h6>
                              {this.state.selected_auth_type
                                ? this.state.selected_auth_type
                                : "------"}
                            </h6>
                          </div>
                          <div className="col">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Selected Department"
                              }}
                            />
                            <h6>
                              {this.state.selected_dept
                                ? this.state.selected_dept
                                : "------"}
                            </h6>
                          </div>
                          <div className="col">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Selected Employee"
                              }}
                            />
                            <h6>
                              {this.state.no_employees === "ALL"
                                ? "ALL"
                                : "NAME"}
                            </h6>
                          </div>
                          <div className="col margin-top-15">
                            <button
                              onClick={this.assignAuthLevels.bind(this)}
                              className="btn btn-primary"
                              style={{ float: "right", marginLeft: 5 }}
                            >
                              Add
                            </button>
                            <button
                              className="btn btn-default"
                              style={{ float: "right", marginLeft: 5 }}
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* row end here*/}
            <div className="row">
              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">
                        Employee Authorization List
                      </h3>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-12" id="EmployeeAuthGrid_Cntr">
                        <AlgaehDataGrid
                          id="EmployeeAuthGrid"
                          datavalidate="EmployeeAuthGrid"
                          columns={[
                            {
                              fieldName: "EmpCode",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Employee Code" }}
                                />
                              )
                            },
                            {
                              fieldName: "EmpName",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Employee Name" }}
                                />
                              )
                            },
                            {
                              fieldName: "DeptName",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Dept. Name" }}
                                />
                              )
                            },
                            {
                              fieldName: "AuthOne",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Auth. 1" }}
                                />
                              )
                            },
                            {
                              fieldName: "AuthTwo",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Auth. 2" }}
                                />
                              )
                            },
                            {
                              fieldName: "AuthThree",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Auth. 3" }}
                                />
                              )
                            },
                            {
                              fieldName: "AuthFour",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Auth. 4" }}
                                />
                              )
                            },
                            {
                              fieldName: "AuthFinal",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Auth. Final" }}
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

        {/* row end here*/}
      </div>
    );
  }
}
