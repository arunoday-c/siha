import React, { Component } from "react";
import "./BranchMaster.scss";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
} from "../../Wrapper/algaehWrapper";

import {
  algaehApiCall,
  swalMessage,
  getCookie,
} from "../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

import { FORMAT_YESNO } from "../../../utils/GlobalVariables.json";
import _ from "lodash";
// /branchMaster/getBranchMaster

export default class BranchMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allBranches: [],
      allDepartments: [],
      Departments: [],
      editBranch: false,
      filterArray: [],
      searchText: "",
    };
    this.getBranchMaster();
    this.getCurrencyMaster();
    this.getCountryMaster();
    this.getnationalityMaster();
    this.getActiveDepartments();
  }

  clearState() {
    this.setState({
      hims_d_hospital_id: null,
      hospital_code: null,
      default_nationality: null,
      default_country: null,
      default_currency: null,
      hospital_name: null,
      hospital_address: null,
      requied_emp_id: null,
      editBranch: false,
    });
  }

  dropDownHandler(value) {
    this.setState({ [value.name]: value.value });
  }

  changeTexts(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  getBranchMaster() {
    algaehApiCall({
      uri: "/branchMaster/getBranchMaster",
      method: "GET",
      module: "masterSettings",
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({
            allBranches: response.data.records,
          });
        } else {
          swalMessage({
            title: response.data.records.message,
            type: "warning",
          });
        }
      },
      onError: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  getCurrencyMaster() {
    algaehApiCall({
      uri: "/currency/getCurrencyMaster",
      method: "GET",
      module: "masterSettings",
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({
            currencyMaster: response.data.records,
          });
        } else {
          swalMessage({
            title: response.data.records.message,
            type: "warning",
          });
        }
      },
      onError: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  getCountryMaster() {
    algaehApiCall({
      uri: "/masters/get/country",
      method: "GET",

      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({
            countryMaster: response.data.records,
          });
        } else {
          swalMessage({
            title: response.data.records.message,
            type: "warning",
          });
        }
      },
      onError: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  getnationalityMaster() {
    algaehApiCall({
      uri: "/masters/get/nationality",
      method: "GET",

      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({
            nationalityMaster: response.data.records,
          });
        } else {
          swalMessage({
            title: response.data.records.message,
            type: "warning",
          });
        }
      },
      onError: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  getActiveDepartments() {
    algaehApiCall({
      uri: "/branchMaster/getActiveDepartments",
      method: "GET",
      module: "masterSettings",
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({
            allDepartments: response.data.records,
          });
        } else {
          swalMessage({
            title: response.data.records.message,
            type: "warning",
          });
        }
      },
      onError: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  addBranches(e) {
    e.preventDefault();

    let algaeh_api_auth_id = getCookie("algaeh_api_auth_id");
    if (this.state.hims_d_hospital_id > 0) {
      AlgaehValidation({
        alertTypeIcon: "warning",
        onSuccess: () => {
          algaehApiCall({
            uri: "/branchMaster/updateBranchMaster",
            module: "masterSettings",
            method: "PUT",
            data: {
              hospital_code: this.state.hospital_code,
              default_nationality: this.state.default_nationality,
              default_country: this.state.default_country,
              default_currency: this.state.default_currency,
              hospital_name: this.state.hospital_name,
              hospital_address: this.state.hospital_address,
              requied_emp_id: this.state.requied_emp_id,
              hospital_id: this.state.hims_d_hospital_id,
            },
            onSuccess: (response) => {
              if (response.data.success) {
                swalMessage({
                  title: "Record Added Successfully",
                  type: "success",
                });
                this.clearState();
                this.getBranchMaster();
              }
            },
            onFailure: (error) => {
              swalMessage({
                title: error.message,
                type: "error",
              });
            },
          });
        },
      });
    } else {
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
              requied_emp_id: this.state.requied_emp_id,
              algaeh_api_auth_id: algaeh_api_auth_id,
            },
            onSuccess: (response) => {
              if (response.data.success) {
                swalMessage({
                  title: "Record Added Successfully",
                  type: "success",
                });
                this.clearState();
                this.getBranchMaster();
              }
            },
            onFailure: (error) => {
              swalMessage({
                title: error.message,
                type: "error",
              });
            },
          });
        },
      });
    }
  }

  loadDetails(e) {
    this.clearState();
    if (e.hims_d_hospital_id > 0) {
      this.setState({
        hospital_id: e.hims_d_hospital_id,
      });
    }

    algaehApiCall({
      uri: "/branchMaster/getActiveDepartments",
      method: "GET",
      module: "masterSettings",
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({
            allDepartments: response.data.records,
          });

          algaehApiCall({
            uri: "/branchMaster/getBranchWiseDepartments",
            method: "GET",
            module: "masterSettings",
            data: {
              hospital_id: e.hims_d_hospital_id
                ? e.hims_d_hospital_id
                : this.state.hospital_id,
            },
            onSuccess: (res) => {
              if (res.data.success) {
                let data = res.data.records;
                if (data.length > 0) {
                  let allDepartments = this.state.allDepartments;
                  data.map((item) => {
                    let find_dep = _.find(
                      allDepartments,
                      (m) =>
                        m.hims_d_department_id === item.hims_d_department_id
                    );
                    const index = allDepartments.indexOf(find_dep);

                    allDepartments[index] = {
                      ...allDepartments[index],
                      checked: true,
                      hims_m_branch_dept_map_id: item.hims_m_branch_dept_map_id,
                    };

                    item.subDepts.map((sub) => {
                      let find_sub = _.find(
                        allDepartments[index]["subDepts"],
                        (s) =>
                          s.hims_d_sub_department_id ===
                          sub.hims_d_sub_department_id
                      );
                      const indexS = allDepartments[index]["subDepts"].indexOf(
                        find_sub
                      );
                      allDepartments[index]["subDepts"][indexS] = {
                        ...allDepartments[index]["subDepts"][indexS],
                        checked: true,
                        hims_m_branch_dept_map_id:
                          sub.hims_m_branch_dept_map_id,
                      };
                    });
                  });

                  this.setState({
                    allDepartments: allDepartments,
                  });
                }
              }
            },
            onFailure: (err) => {
              swalMessage({
                title: err.message,
                type: "error",
              });
            },
          });
        } else {
          swalMessage({
            title: response.data.records.message,
            type: "warning",
          });
        }
      },
      onError: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  changeDepartments(data, e) {
    const _status = e.target.checked;
    let val = parseInt(e.target.value, 10);

    let Departments = this.state.allDepartments;

    const subdepartments = data.subDepts.map((item) => {
      return {
        ...item,
        checked: _status ? true : false,
      };
    });

    let newDepats = _.map(Departments, (f) => {
      let _sList = f.subDepts;
      let _checked = { checked: f.checked ? true : false };
      if (f.hims_d_department_id === val) {
        _sList = subdepartments;
        _checked = { checked: _status ? true : false };
      }
      return {
        ...f,
        ..._checked,
        subDepts: _sList,
      };
    });

    this.setState({ allDepartments: newDepats });
  }

  changeSubdepartment(data, e) {
    const _status = e.target.checked;
    let val = parseInt(e.target.value, 10);

    let Departments = this.state.allDepartments;

    const _subDepart = data.subDepts.map((item) => {
      if (item.hims_d_sub_department_id === val) {
        item.checked = _status ? true : false;
      }
      return {
        ...item,
      };
    });

    const _check = _.filter(_subDepart, (f) => {
      return f.checked === true;
    });

    let newDepats = _.map(Departments, (f) => {
      let _sList = f.subDepts;
      if (f.hims_d_department_id === data.hims_d_department_id) {
        _sList = _subDepart;
        f.checked = _check.length > 0 ? true : false;
      }
      return {
        ...f,
        subDepts: _sList,
      };
    });

    this.setState({ allDepartments: newDepats });
  }

  assignDepartments() {
    //To build delete inputs
    let inputObj = {};
    const remove_sub = [];
    const add_new_sub = [];

    this.state.allDepartments.forEach((dept) => {
      dept.subDepts.forEach((sub) => {
        if (
          sub.hims_m_branch_dept_map_id !== undefined &&
          sub.checked === false
        ) {
          remove_sub.push(sub.hims_m_branch_dept_map_id);
        }
      });
    });

    this.state.allDepartments.forEach((dept) => {
      dept.subDepts.forEach((sub) => {
        if (
          sub.hims_m_branch_dept_map_id === undefined &&
          sub.checked === true
        ) {
          add_new_sub.push({ sub_department_id: sub.hims_d_sub_department_id });
        }
      });
    });

    inputObj["remove_sub"] = remove_sub;
    inputObj["add_new_sub"] = add_new_sub;
    inputObj["hospital_id"] = this.state.hospital_id;

    if (!remove_sub.length > 0 && !add_new_sub.length > 0) {
      swalMessage({
        title: "No changes found",
        type: "warning",
      });
    } else {
      algaehApiCall({
        uri: "/branchMaster/modifyBranchMaster",
        method: "POST",
        module: "masterSettings",
        data: inputObj,
        onSuccess: (res) => {
          if (res.data.success) {
            swalMessage({
              title: "Assigned Successfully.",
              type: "success",
            });

            inputObj = {};
            this.loadDetails("L");
          } else {
            swalMessage({
              title: res.data.records.message,
              type: "warning",
            });
          }
        },
        onFailure: (err) => {
          swalMessage({
            title: err.message,
            type: "error",
          });
        },
      });
    }
  }

  onEditBranch(data) {
    this.setState({
      hims_d_hospital_id: data.hims_d_hospital_id,
      hospital_code: data.hospital_code,
      default_nationality: data.default_nationality,
      default_country: data.default_country,
      default_currency: data.default_currency,
      hospital_name: data.hospital_name,
      hospital_address: data.hospital_address,
      requied_emp_id: data.requied_emp_id,
      editBranch: true,
    });
  }
  filterBranchList(e) {
    const value = e.target.value.toLowerCase();
    if (value === "") {
      this.setState({ filterArray: [], searchText: e.target.value });
    }
    const filterd = this.state.allBranches.filter(
      (f) =>
        f.hospital_name.toLowerCase().includes(value) ||
        f.hospital_code.toLowerCase().includes(value)
    );
    this.setState({ filterArray: filterd, searchText: e.target.value });
  }

  render() {
    const branchList =
      this.state.searchText !== "" && this.state.filterArray.length === 0
        ? this.state.filterArray
        : this.state.searchText === "" && this.state.filterArray.length === 0
        ? this.state.allBranches
        : this.state.filterArray;
    return (
      <div className="BranchMaster">
        <div className="row">
          <div className="col-3">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-6 form-group mandatory" }}
                    label={{
                      forceLabel: "Branch Code",
                      isImp: true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "hospital_code",
                      value: this.state.hospital_code,
                      events: { onChange: this.changeTexts.bind(this) },
                      option: {
                        type: "text",
                      },
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-12 form-group mandatory" }}
                    label={{
                      forceLabel: "Branch Name",
                      isImp: true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "hospital_name",
                      value: this.state.hospital_name,
                      events: { onChange: this.changeTexts.bind(this) },
                      option: {
                        type: "text",
                      },
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group mandatory" }}
                    label={{ forceLabel: "Default Country", isImp: true }}
                    selector={{
                      name: "default_country",
                      value: this.state.default_country,
                      className: "select-fld",
                      dataSource: {
                        textField: "country_name",
                        valueField: "hims_d_country_id",
                        data: this.state.countryMaster,
                      },
                      onChange: this.dropDownHandler.bind(this),
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group mandatory" }}
                    label={{ forceLabel: "Default Nationality", isImp: true }}
                    selector={{
                      name: "default_nationality",
                      className: "select-fld",
                      value: this.state.default_nationality,
                      dataSource: {
                        textField: "nationality",
                        valueField: "hims_d_nationality_id",
                        data: this.state.nationalityMaster,
                      },
                      onChange: this.dropDownHandler.bind(this),
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group mandatory" }}
                    label={{ forceLabel: "Default Currency", isImp: true }}
                    selector={{
                      name: "default_currency",
                      value: this.state.default_currency,

                      className: "select-fld",
                      dataSource: {
                        textField: "currency_description",
                        valueField: "hims_d_currency_id",
                        data: this.state.currencyMaster,
                      },
                      onChange: this.dropDownHandler.bind(this),
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group mandatory" }}
                    label={{ forceLabel: "Emp. ID Required", isImp: true }}
                    selector={{
                      name: "requied_emp_id",
                      value: this.state.requied_emp_id,
                      className: "select-fld",
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: FORMAT_YESNO,
                      },
                      onChange: this.dropDownHandler.bind(this),
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-12 form-group" }}
                    label={{
                      forceLabel: "Full Address",
                      isImp: false,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "hospital_address",
                      value: this.state.hospital_address,
                      option: {
                        //type: "email"
                      },
                      events: {
                        onChange: this.changeTexts.bind(this),
                      },
                      others: {
                        placeholder:
                          "Eg:- Unit-301-A, 3rd Floor, Lady Curzon Road, Bangalore - 560001",
                      },
                    }}
                  />
                  <div className="col-12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ float: "right" }}
                      onClick={this.addBranches.bind(this)}
                    >
                      {this.state.editBranch === true
                        ? "Update"
                        : "Add to List"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-default"
                      style={{ marginRight: 10, float: "right" }}
                      onClick={this.clearState.bind(this)}
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
                <div className="actions">
                  {" "}
                  <AlagehFormGroup
                    div={{
                      className: "",
                    }}
                    textBox={{
                      type: "text",
                      events: { onChange: this.filterBranchList.bind(this) },
                      value: this.state.searchText,
                      others: {
                        placeholder: "Search Branch",
                      },
                    }}
                  />
                </div>
              </div>
              <div className="portlet-body" id="">
                <div className="row">
                  <div className="col-12" id="branchCompanyList">
                    {branchList.map((data, index) => (
                      <div className="row branchEachList" key={index}>
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
                        {/* <div className="col-3">
                          <label>Head Office</label>
                          <h6>No</h6>
                        </div> */}
                        <div className="col-6">
                          <label>Address</label>
                          <h6>{data.hospital_address}</h6>
                        </div>
                        <div className="col-12 branchAction">
                          <span onClick={this.onEditBranch.bind(this, data)}>
                            Edit Details
                          </span>
                          <span onClick={this.loadDetails.bind(this, data)}>
                            Map Dept & Sub Dept.
                          </span>
                        </div>
                      </div>
                    ))}
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
              </div>

              {/* ----------sssstart------------ */}
              <div className="portlet-body departmentBranchMapList">
                <div className="row">
                  <div className="col-5 customCheckbox">
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        value=""
                        name=""
                        // checked={this.state.checkAll}
                        // onChange={this.selectAll.bind(this)}
                      />
                      <span>Select All</span>
                    </label>
                  </div>
                  <AlagehFormGroup
                    div={{
                      className: "col-7 form-group",
                    }}
                    textBox={{
                      type: "text",
                      // events: { onChange: this.filterBranchList.bind(this) },
                      value: this.state.searchText,
                      others: {
                        placeholder: "Search Sub Department",
                      },
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col-12">
                    <ul className="deptUl">
                      {this.state.allDepartments.map((data, index) => {
                        return (
                          <li key={data.hims_d_department_id}>
                            <span>
                              <input
                                type="checkbox"
                                onChange={this.changeDepartments.bind(
                                  this,
                                  data
                                )}
                                name="allDepartments"
                                checked={
                                  data.checked === undefined
                                    ? false
                                    : data.checked
                                }
                                value={data.hims_d_department_id}
                              />
                            </span>
                            <a>{data.department_name}</a>

                            <ul className="subDeptUl">
                              {data.subDepts.map((sub, index) => {
                                return (
                                  <li key={sub.hims_d_sub_department_id}>
                                    <span>
                                      <input
                                        type="checkbox"
                                        onChange={this.changeSubdepartment.bind(
                                          this,
                                          data
                                        )}
                                        name="subDepartments"
                                        checked={
                                          sub.checked === undefined
                                            ? false
                                            : sub.checked
                                        }
                                        value={sub.hims_d_sub_department_id}
                                      />
                                    </span>
                                    <a>{sub.sub_department_name}</a>
                                  </li>
                                );
                              })}
                            </ul>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="col-12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ marginTop: 19, float: "right" }}
                      onClick={this.assignDepartments.bind(this)}
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

              {/* ---------------endd------- */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
