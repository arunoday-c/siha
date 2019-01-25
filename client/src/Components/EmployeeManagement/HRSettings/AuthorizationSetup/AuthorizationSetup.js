import React, { Component } from "react";
import "./AuthorizationSetup.css";
import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
export default class AuthorizationSetup extends Component {
  render() {
    return (
      <div className="AuthorizationSetupScreen">
        <div className="row  inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select Authorization Type", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />{" "}
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select Department", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />
          <div className="col" style={{ paddingTop: 10 }}>
            <div className="customRadio">
              <label className="radio inline" style={{ display: "block" }}>
                <input type="radio" value="AllAuth" name="selectEmployeeAuth" />
                <span>All Employee</span>
              </label>

              <label className="radio inline" style={{ margin: 0 }}>
                <input
                  type="radio"
                  value="SelectedAuth"
                  name="selectEmployeeAuth"
                />
                <span>Selected a Employee</span>
              </label>
            </div>
          </div>
          {/* Radio ENd here Here */}
          <div className="col" style={{ marginTop: 7 }}>
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
                <h6>------------</h6>
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
                  // onClick={employeeSearch.bind(this, this)}
                />
              </div>
            </div>
          </div>
          {/* Select EMployee ENd here Here */}
          <div className="col">
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: 21 }}
            >
              Load
            </button>
          </div>
        </div>
        <div className="row">
          {/* row starts here*/}
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col">
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
                        <AlgaehLabel label={{ forceLabel: "Select Auth 1" }} />
                        <h6>------------</h6>
                      </div>
                      <div
                        className="col-3"
                        style={{
                          borderLeft: "1px solid #ced4d8",
                          paddingLeft: "6%"
                        }}
                      >
                        <i
                          className="fas fa-search fa-lg"
                          style={{
                            paddingTop: 17,
                            paddingLeft: 3,
                            cursor: "pointer"
                          }}
                          // onClick={employeeSearch.bind(this, this)}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Select EMployee ENd here Here */}
                  <div className="col">
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
                        <AlgaehLabel label={{ forceLabel: "Select Auth 2" }} />
                        <h6>------------</h6>
                      </div>
                      <div
                        className="col-3"
                        style={{
                          borderLeft: "1px solid #ced4d8",
                          paddingLeft: "6%"
                        }}
                      >
                        <i
                          className="fas fa-search fa-lg"
                          style={{
                            paddingTop: 17,
                            paddingLeft: 3,
                            cursor: "pointer"
                          }}
                          // onClick={employeeSearch.bind(this, this)}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Select EMployee ENd here Here */}
                  <div className="col">
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
                        <AlgaehLabel label={{ forceLabel: "Select Auth 3" }} />
                        <h6>------------</h6>
                      </div>
                      <div
                        className="col-3"
                        style={{
                          borderLeft: "1px solid #ced4d8",
                          paddingLeft: "6%"
                        }}
                      >
                        <i
                          className="fas fa-search fa-lg"
                          style={{
                            paddingTop: 17,
                            paddingLeft: 3,
                            cursor: "pointer"
                          }}
                          // onClick={employeeSearch.bind(this, this)}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Select EMployee ENd here Here */}
                  <div className="col">
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
                        <AlgaehLabel label={{ forceLabel: "Select Auth 4" }} />
                        <h6>------------</h6>
                      </div>
                      <div
                        className="col-3"
                        style={{
                          borderLeft: "1px solid #ced4d8",
                          paddingLeft: "6%"
                        }}
                      >
                        <i
                          className="fas fa-search fa-lg"
                          style={{
                            paddingTop: 17,
                            paddingLeft: 3,
                            cursor: "pointer"
                          }}
                          // onClick={employeeSearch.bind(this, this)}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Select EMployee ENd here Here */}
                  <div className="col">
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
                        <AlgaehLabel label={{ forceLabel: "Select Auth 5" }} />
                        <h6>------------</h6>
                      </div>
                      <div
                        className="col-3"
                        style={{
                          borderLeft: "1px solid #ced4d8",
                          paddingLeft: "6%"
                        }}
                      >
                        <i
                          className="fas fa-search fa-lg"
                          style={{
                            paddingTop: 17,
                            paddingLeft: 3,
                            cursor: "pointer"
                          }}
                          // onClick={employeeSearch.bind(this, this)}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Select EMployee ENd here Here */}
                  <div className="col-12 margin-top-15">
                    <div className="row">
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Selected Authorization Type"
                          }}
                        />
                        <h6>--------</h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Selected Department"
                          }}
                        />
                        <h6>--------</h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Selected Employee"
                          }}
                        />
                        <h6>--------</h6>
                      </div>
                      <div className="col margin-top-15">
                        <button
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
                            <AlgaehLabel label={{ forceLabel: "Dept. Name" }} />
                          )
                        },
                        {
                          fieldName: "AuthOne",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Auth. 1" }} />
                          )
                        },
                        {
                          fieldName: "AuthTwo",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Auth. 2" }} />
                          )
                        },
                        {
                          fieldName: "AuthThree",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Auth. 3" }} />
                          )
                        },
                        {
                          fieldName: "AuthFour",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Auth. 4" }} />
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

        {/* row end here*/}
      </div>
    );
  }
}
