import React, { Component } from "react";
import "./BranchMaster.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete
  // AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
export default class BranchMaster extends Component {
  render() {
    return (
      <div className="BranchMaster">
        <div className="row">
          <div className="col-3">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-6 form-group" }}
                    label={{
                      forceLabel: "Branch Code",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      option: {
                        type: "text"
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-12 form-group" }}
                    label={{
                      forceLabel: "Branch Name",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      option: {
                        type: "text"
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group" }}
                    label={{ forceLabel: "Default Country", isImp: true }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group" }}
                    label={{ forceLabel: "Default Nationality", isImp: true }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group" }}
                    label={{ forceLabel: "Default Currency", isImp: true }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />{" "}
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group" }}
                    label={{ forceLabel: "Branch Head Office", isImp: true }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group" }}
                    label={{ forceLabel: "Emp. ID Required", isImp: true }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />{" "}
                  <AlagehFormGroup
                    div={{ className: "col-12 form-group" }}
                    label={{
                      forceLabel: "Full Address",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      option: {
                        //type: "email"
                      },
                      events: {},
                      others: {
                        placeholder:
                          "Eg:- Unit-301-A, 3rd Floor, Lady Curzon Road, Bangalore - 560001"
                      }
                    }}
                  />
                  <div className="col-12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ float: "right" }}
                    >
                      Add to List
                    </button>
                    <button
                      type="button"
                      className="btn btn-default"
                      style={{ marginRight: 10, float: "right" }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Branch List</h3>
                </div>
                {/* <div className="actions">
          <a className="btn btn-primary btn-circle active">
          <i className="fas fa-pen" />
          </a>
          </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="branchCompanyList">
                    <div className="row branchEachList">
                      <div className="branchAction">
                        <i className="fas fa-pen" />
                        <i className="fas fa-network-wired" />
                      </div>{" "}
                      <div className="col-12">
                        <label>Branch Name</label>
                        <h5>SES</h5>
                      </div>{" "}
                      <div className="col-4">
                        <label>Branch Code</label>
                        <h6>BR-0001</h6>
                      </div>{" "}
                      <div className="col-4">
                        <label>Default Country</label>
                        <h6>Oman</h6>
                      </div>{" "}
                      <div className="col-4">
                        <label>Default Nationality</label>
                        <h6>Omani</h6>
                      </div>{" "}
                      <div className="col-3">
                        <label>Default Currency</label>
                        <h6>Omani</h6>
                      </div>{" "}
                      <div className="col-3">
                        <label>Head Office</label>
                        <h6>No</h6>
                      </div>
                      <div className="col-6">
                        <label>Address</label>
                        <h6>Shaksy Group, Seeb, Oman</h6>
                      </div>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Map Dept. to Branch</h3>
                </div>
                {/* <div className="actions">
          <a className="btn btn-primary btn-circle active">
          <i className="fas fa-pen" />
          </a>
          </div> */}
              </div>
              <div className="portlet-body departmentBranchMapList">
                <div className="row">
                  <div className="col-12">
                    <ul className="deptUl">
                      <li>
                        <span>
                          <input
                            type="checkbox"
                            onChange=""
                            name="modules"
                            checked=""
                            value=""
                          />
                        </span>
                        <a>Department 1</a>

                        <ul className="subDeptUl">
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span>
                          <input
                            type="checkbox"
                            onChange=""
                            name="modules"
                            checked=""
                            value=""
                          />
                        </span>
                        <a>Department 1</a>

                        <ul className="subDeptUl">
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <span>
                          <input
                            type="checkbox"
                            onChange=""
                            name="modules"
                            checked=""
                            value=""
                          />
                        </span>
                        <a>Department 1</a>

                        <ul className="subDeptUl">
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>{" "}
                          <li>
                            <span>
                              <input
                                type="checkbox"
                                onChange=""
                                name="modules"
                                checked=""
                                value=""
                              />
                            </span>
                            <a>Sub Department</a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <div className="col-12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ marginTop: 19, float: "right" }}
                    >
                      Map to Branch
                    </button>
                    <button
                      type="button"
                      className="btn btn-default"
                      style={{ marginTop: 19, marginRight: 10, float: "right" }}
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
    );
  }
}
