import React, { Component } from "react";
import "./BranchMaster.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete
  // AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import swal from "sweetalert2";
import { FORMAT_YESNO } from "../../../utils/GlobalVariables.json";

// /branchMaster/getBranchMaster

export default class BranchMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allBranches: [],
      activeBranches: []
    };
    this.getBranchMaster();
    // this.getActiveBranches();
  }

  clearState() {
    this.setState({
      hospital_name: null,
      default_nationality: null,
      default_country: null,
      default_currency: null,
      hospital_name: null,
      hospital_address: null,
      requied_emp_id: null
    });
  }

  dropDownHandler(value) {
    this.setState({ [value.name]: value.value });
  }

  componentDidMount() {
    // this.getBranchMaster();
    this.getActiveBranches();
    this.getCurrencyMaster();
    this.getCountryMaster();
    this.getnationalityMaster();
  }

  changeTexts(e) {
    const { name, value } = e.target;
    this.setState(
      {
        [name]: value
      },
      () => console.log(this.state, "state from handle")
    );
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }
  loadDetails(data) {}

  getBranchMaster() {
    debugger;
    algaehApiCall({
      uri: "/branchMaster/getBranchMaster",
      method: "GET",
      module: "masterSettings",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            allBranches: response.data.records
          });

          console.log("allBranches:", this.state.allBranches);
        } else {
          swalMessage({
            title: response.data.records.message,
            type: "warning"
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  getCurrencyMaster() {
    algaehApiCall({
      uri: "/currency/getCurrencyMaster",
      method: "GET",
      module: "masterSettings",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            currencyMaster: response.data.records
          });
        } else {
          swalMessage({
            title: response.data.records.message,
            type: "warning"
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }
  getCountryMaster() {
    algaehApiCall({
      uri: "/masters/get/country",
      method: "GET",

      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            countryMaster: response.data.records
          });
        } else {
          swalMessage({
            title: response.data.records.message,
            type: "warning"
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }
  getnationalityMaster() {
    algaehApiCall({
      uri: "/masters/get/nationality",
      method: "GET",

      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            nationalityMaster: response.data.records
          });
        } else {
          swalMessage({
            title: response.data.records.message,
            type: "warning"
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  getActiveBranches() {
    algaehApiCall({
      uri: "/branchMaster/getActiveBranches",
      method: "GET",
      module: "masterSettings",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            activeBranches: response.data.records
          });
        } else {
          swalMessage({
            title: response.data.records.message,
            type: "warning"
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  addBranches(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/branchMaster/addBranchMaster",
          module: "masterSettings",
          method: "POST",
          data: {
            hospital_code: this.state.hospital_code,
            default_nationality: this.state.default_nationality,
            default_country: this.state.default_country,
            default_currency: this.state.default_currency,
            hospital_name: this.state.hospital_name,
            hospital_address: this.state.hospital_address,
            requied_emp_id: this.state.requied_emp_id
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record Added Successfully",
                type: "success"
              });
              this.clearSaveState();
              this.getBranchMaster();
              this.getActiveBranches();
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  render() {
    debugger;
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
                      name: "hospital_code",
                      value: this.state.hospital_code,
                      events: { onChange: this.changeTexts.bind(this) },
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
                      name: "hospital_name",
                      value: this.state.hospital_name,
                      events: { onChange: this.changeTexts.bind(this) },
                      option: {
                        type: "text"
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group" }}
                    label={{ forceLabel: "Default Country", isImp: true }}
                    selector={{
                      name: "default_country",
                      value: this.state.default_country,
                      className: "select-fld",
                      dataSource: {
                        textField: "country_name",
                        valueField: "hims_d_country_id",
                        data: this.state.countryMaster
                      },
                      onChange: this.dropDownHandler.bind(this)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group" }}
                    label={{ forceLabel: "Default Nationality", isImp: true }}
                    selector={{
                      name: "default_nationality",
                      className: "select-fld",
                      value: this.state.default_nationality,
                      dataSource: {
                        textField: "nationality",
                        valueField: "hims_d_nationality_id",
                        data: this.state.nationalityMaster
                      },
                      onChange: this.dropDownHandler.bind(this)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group" }}
                    label={{ forceLabel: "Default Currency", isImp: true }}
                    selector={{
                      name: "default_currency",
                      value: this.state.default_currency,

                      className: "select-fld",
                      dataSource: {
                        textField: "currency_description",
                        valueField: "hims_d_currency_id",
                        data: this.state.currencyMaster
                      },
                      onChange: this.dropDownHandler.bind(this)
                    }}
                  />
                  {/* <AlagehAutoComplete
                    div={{ className: "col-6 form-group" }}
                    label={{ forceLabel: "Branch Head Office", isImp: true }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  /> */}
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group" }}
                    label={{ forceLabel: "Emp. ID Required", isImp: true }}
                    selector={{
                      name: "requied_emp_id",
                      value: this.state.requied_emp_id,
                      className: "select-fld",
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: FORMAT_YESNO
                      },
                      onChange: this.dropDownHandler.bind(this)
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-12 form-group" }}
                    label={{
                      forceLabel: "Full Address",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "hospital_address",
                      value: this.state.hospital_address,
                      option: {
                        //type: "email"
                      },
                      events: {
                        onChange: this.changeTexts.bind(this)
                      },
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
                      onClick={this.addBranches.bind(this)}
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
              <div className="portlet-body" id="">
                {this.state.allBranches.map((data, index) => (
                  <div
                    className="row"
                    key={index}
                    // onClick={this.loadDetails.bind(this, data)}
                  >
                    <div className="col-12" id="branchCompanyList">
                      <div className="row branchEachList">
                        <div className="branchAction">
                          <i className="fas fa-pen" />
                          <i className="fas fa-network-wired" />
                        </div>
                        <div className="col-12">
                          <label>Branch Name</label>
                          <h5>{data.hospital_name}</h5>
                        </div>
                        <div className="col-4">
                          <label>Branch Code</label>
                          <h6>{data.hospital_code}</h6>
                        </div>
                        <div className="col-4">
                          <label>Default Country</label>
                          <h6>{data.country_name}</h6>
                        </div>
                        <div className="col-4">
                          <label>Default Nationality</label>
                          <h6>{data.nationality}</h6>
                        </div>
                        <div className="col-3">
                          <label>Default Currency</label>
                          <h6>{data.currency_description}</h6>
                        </div>
                        <div className="col-3">
                          <label>Head Office</label>
                          <h6>No</h6>
                        </div>
                        <div className="col-6">
                          <label>Address</label>
                          <h6>{data.hospital_address}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                            <a>Sub Department</a>
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
                            <a>Sub Department</a>
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
                            <a>Sub Department</a>
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
                            <a>Sub Department</a>
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
                            <a>Sub Department</a>
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
                            <a>Sub Department</a>
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
                            <a>Sub Department</a>
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
                            <a>Sub Department</a>
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
                            <a>Sub Department</a>
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
                            <a>Sub Department</a>
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
                            <a>Sub Department</a>
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
                            <a>Sub Department</a>
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
                            <a>Sub Department</a>
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
                            <a>Sub Department</a>
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
                            <a>Sub Department</a>
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
