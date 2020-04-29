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

import { Checkbox, Upload, message } from "algaeh-react-components";
// /branchMaster/getBranchMaster
import Organization from "./Organisation";
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
      searchSubBranchText: "",
      filterdDepartmentArray: [],
      checkAll: false,
      checkAllIntermediate: undefined,
      selectedBranchName: "",
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
        selectedBranchName: e.hospital_name,
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
                const newArray = this.state.allDepartments
                  .map((item) => {
                    const hasDepartment = data.find(
                      (f) =>
                        f.hims_d_department_id === item.hims_d_department_id
                    );
                    if (hasDepartment !== undefined) {
                      const allSubDepLength = item.subDepts.length;
                      const subDepLength = hasDepartment.subDepts.length;
                      if (allSubDepLength === subDepLength) {
                        item.indeterminate = false;
                        item.checked = true;
                      } else {
                        item.checked = false;
                      }
                      item.subDepts = item.subDepts.map((sub) => {
                        const isChecked = hasDepartment.subDepts.find(
                          (f) =>
                            f.hims_d_sub_department_id ===
                            sub.hims_d_sub_department_id
                        );
                        return {
                          ...sub,
                          checked: isChecked === undefined ? false : true,
                        };
                      });
                      const anyUnched = item.subDepts.find(
                        (f) => f.checked === false
                      );
                      return {
                        ...item,
                        indeterminate: anyUnched === undefined ? false : true,
                      };
                    }
                  })
                  .filter((f) => f !== null);
                const anyUnchecked = newArray.find((f) => f.checked === false);
                this.setState({
                  allDepartments: newArray,
                  checkAll: anyUnchecked === undefined ? true : false,
                  checkAllIntermediate:
                    anyUnchecked === undefined ? false : true,
                });
                // if (data.length > 0) {
                //   let allDepartments = this.state.allDepartments;
                //   data.forEach((item) => {
                //     let find_dep = _.find(
                //       allDepartments,
                //       (m) =>
                //         m.hims_d_department_id === item.hims_d_department_id
                //     );
                //     const index = allDepartments.indexOf(find_dep);

                //     allDepartments[index] = {
                //       ...allDepartments[index],
                //       checked: true,
                //       hims_m_branch_dept_map_id: item.hims_m_branch_dept_map_id,
                //     };

                //     item.subDepts.forEach((sub) => {
                //       let find_sub = _.find(
                //         allDepartments[index]["subDepts"],
                //         (s) =>
                //           s.hims_d_sub_department_id ===
                //           sub.hims_d_sub_department_id
                //       );
                //       const indexS = allDepartments[index]["subDepts"].indexOf(
                //         find_sub
                //       );
                //       allDepartments[index]["subDepts"][indexS] = {
                //         ...allDepartments[index]["subDepts"][indexS],
                //         checked: true,
                //         hims_m_branch_dept_map_id:
                //           sub.hims_m_branch_dept_map_id,
                //       };
                //     });
                //   });
                //        const isCheckAll = allDepartments.filter(f=>f.checked === true).length;
                //   this.setState({
                //     allDepartments: allDepartments,
                //     checkAll: isCheckAll===allDepartments.length?true:false,
                //     indeterminate:isCheckAll < allDepartments.length ?true:false
                //   });
                // }
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
    const index = this.state.allDepartments.indexOf(data);
    data.checked = _status;
    data.indeterminate = false;
    data.subDepts = data.subDepts.map((item) => {
      return {
        ...item,
        checked: _status,
      };
    });

    this.state.allDepartments[index] = data;
    const unCheckExist = this.state.allDepartments.find(
      (f) => f.checked === false
    );
    this.setState({
      allDepartments: this.state.allDepartments,
      checkAll: unCheckExist === undefined ? true : false,
      checkAllIntermediate: unCheckExist === undefined ? false : true,
    });

    //   let val = parseInt(e.target.value, 10);

    //   let Departments = this.state.allDepartments;

    //   const subdepartments = data.subDepts.map((item) => {
    //     return {
    //       ...item,
    //       checked: _status //? true : false,
    //     };
    //   });

    //   let newDepats = _.map(Departments, (f) => {
    //     let _sList = f.subDepts;
    //     let _checked = { checked: f.checked ? true : false };
    //     if (f.hims_d_department_id === val) {
    //       _sList = subdepartments;
    //       _checked = { checked: _status ? true : false };
    //     }
    //     return {
    //       ...f,
    //       ..._checked,
    //       subDepts: _sList,
    //     };
    //   });
    //  this.setState({ allDepartments: newDepats });
  }

  changeSubdepartment(item, e) {
    const _status = e.target.checked;
    const { data, sub } = item;
    const allDept = this.state.allDepartments;
    const filterData = allDept.find(
      (f) => f.hims_d_department_id === data.hims_d_department_id
    );
    const mainStateIndex = allDept.indexOf[filterData];
    sub.checked = _status;
    const subData = data.subDepts.find(
      (f) => f.hims_d_sub_department_id === sub.hims_d_sub_department_id
    );
    const subIndex = data.subDepts.indexOf(subData);
    data.subDepts[subIndex] = sub;
    const hasUnchecked = data.subDepts.filter((f) => f.checked === false);
    data.checked = hasUnchecked.length === 0 ? true : false;
    data.indeterminate =
      hasUnchecked.length === 0
        ? false
        : hasUnchecked.length === data.subDepts.length
        ? false
        : true;
    this.state.allDepartments[mainStateIndex] = data;
    const hasUncheckedState = this.state.allDepartments.find(
      (f) => f.checked === false
    );
    this.setState({
      allDepartments: this.state.allDepartments,
      checkAll: hasUncheckedState === undefined ? true : false,
      checkAllIntermediate: hasUncheckedState === undefined ? false : true,
    });

    // const index = data.subDepts.indexOf(sub);
    // sub.checked = _status;
    // data.subDepts[index] = sub;
    // const checkedStatus = data.subDepts.filter((f) => f.checked === true)
    //   .length;
    // const deptLength = data.subDepts.length;

    // if (checkedStatus === deptLength) {
    //   data.checked = true;
    // } else if (checkedStatus === 0) {
    //   data.indeterminate = false;
    // } else {
    //   data.indeterminate = true;
    //   data.checked = false;
    // }

    // this.state.allDepartments[mainStateIndex] = data;
    // const selectedDept = this.state.allDepartments.filter(
    //   (f) => f.checked === true
    // ).length;
    // const allDepts = this.state.allDepartments.length;
    // let inter = this.state.allDepartments.filter(
    //   (f) => f.indeterminate === true
    // ).length;

    // let indeterminate = false;
    // if (inter > 0) {
    //   indeterminate = true;
    // } else if (inter === 0 && selectedDept > 0) {
    //   indeterminate = true;
    // } else if (allDepts === selectedDept) {
    //   indeterminate = false;
    // }
    // this.setState({
    //   allDepartments: this.state.allDepartments,
    //   checkAll: selectedDept === allDepts ? true : false,
    //   checkAllIntermediate: indeterminate,
    // });

    // let val = parseInt(e.target.value, 10);

    // let Departments = this.state.allDepartments;

    // const _subDepart = data.subDepts.map((item) => {
    //   if (item.hims_d_sub_department_id === val) {
    //     item.checked = _status ? true : false;
    //   }
    //   return {
    //     ...item,
    //   };
    // });

    // const _check = _.filter(_subDepart, (f) => {
    //   return f.checked === true;
    // });

    // let newDepats = _.map(Departments, (f) => {
    //   let _sList = f.subDepts;
    //   if (f.hims_d_department_id === data.hims_d_department_id) {
    //     _sList = _subDepart;
    //     f.checked = _check.length > 0 ? true : false;
    //   }
    //   return {
    //     ...f,
    //     subDepts: _sList,
    //   };
    // });

    // this.setState({ allDepartments: newDepats });
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
              title: `Assigned Successfully To ${this.state.selectedBranchName} Branch `,
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
  filterSubDepartment(e) {
    const value = e.target.value.toLowerCase();
    if (value === "") {
      this.setState({
        filterdDepartmentArray: [],
        searchSubBranchText: e.target.value,
      });
    }
    const filterd = this.state.allDepartments
      .map((item) => {
        const subDpartments = item.subDepts.filter((f) =>
          f.sub_department_name.toLowerCase().includes(value)
        );
        if (subDpartments.length > 0) {
          return {
            ...item,
            subDepts: subDpartments,
          };
        }
      })
      .filter((f) => f !== undefined);

    this.setState({
      filterdDepartmentArray: filterd,
      searchSubBranchText: e.target.value,
    });
  }
  selectAll(e) {
    const status = e.target.checked;
    const checkedDeparts = this.state.allDepartments.map((item) => {
      const subDpartments = item.subDepts.map((sItems) => {
        return {
          ...sItems,
          checked: status,
        };
      });
      return {
        ...item,
        checked: status,
        subDepts: subDpartments,
        indeterminate: false,
      };
    });

    this.setState({
      allDepartments: checkedDeparts,
      checkAll: status,
      checkAllIntermediate: false,
    });
  }
  clearAll(e) {
    const clearDeparts = this.state.allDepartments.map((item) => {
      const subDpartments = item.subDepts.map((sItems) => {
        return {
          ...sItems,
          checked: false,
        };
      });
      return {
        ...item,
        checked: false,
        indeterminate: false,
        subDepts: subDpartments,
      };
    });
    this.setState({
      allDepartments: clearDeparts,
      checkAll: false,
      checkAllIntermediate: false,
    });
  }

  render() {
    const branchList =
      this.state.searchText !== "" && this.state.filterArray.length === 0
        ? this.state.filterArray
        : this.state.searchText === "" && this.state.filterArray.length === 0
        ? this.state.allBranches
        : this.state.filterArray;
    const departments =
      this.state.searchSubBranchText !== "" &&
      this.state.filterdDepartmentArray.length === 0
        ? this.state.filterdDepartmentArray
        : this.state.searchSubBranchText === "" &&
          this.state.filterdDepartmentArray.length === 0
        ? this.state.allDepartments
        : this.state.filterdDepartmentArray;

    return (
      <div className="BranchMaster">
        <div className="row">
          {" "}
          <div className="col-12">
            <Organization countryMaster={this.state.countryMaster} />
          </div>
        </div>
        <div className="row">
          <div className="col-3">
            <div className="portlet portlet-bordered margin-bottom-15">
              {" "}
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Add/Edit Branch</h3>
                </div>
                <div className="actions"></div>
              </div>
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
                  <h3 className="caption-subject">Dept. & Sub Dept. Mapping</h3>
                </div>
              </div>

              {/* ----------sssstart------------ */}
              <div className="portlet-body departmentBranchMapList">
                <p>
                  Selected Branch: <b>{this.state.selectedBranchName}</b>
                </p>
                <hr></hr>
                <div className="row">
                  <div className="col-5 customCheckbox">
                    {/* <label className="checkbox inline"> */}

                    {/* <input
                        type="checkbox"
                        value=""
                        name=""
                        checked={this.state.checkAll}
                        onChange={this.selectAll.bind(this)}
                      /> */}
                    {/* <span>Select All</span> */}
                    {/* </label> */}
                    <Checkbox
                      className="selectAllCheck"
                      checked={this.state.checkAll}
                      onChange={this.selectAll.bind(this)}
                      indeterminate={this.state.checkAllIntermediate}
                    >
                      Select All
                    </Checkbox>
                  </div>
                  <AlagehFormGroup
                    div={{
                      className: "col-7 form-group",
                    }}
                    textBox={{
                      type: "text",
                      events: { onChange: this.filterSubDepartment.bind(this) },
                      value: this.state.searchSubBranchText,
                      others: {
                        placeholder: "Search Sub Department",
                      },
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col-12">
                    <ul className="deptUl">
                      {departments.map((data, index) => {
                        return (
                          <li key={data.hims_d_department_id}>
                            {" "}
                            <Checkbox
                              className="depCheck"
                              indeterminate={data.indeterminate}
                              checked={
                                data.checked === undefined
                                  ? false
                                  : data.checked
                              }
                              onChange={this.changeDepartments.bind(this, data)}
                            >
                              {data.department_name}
                            </Checkbox>
                            {/* <span> */}
                            {/* <input
                              indeterminate ={data.indeterminate}
                              id={"dept_"+ data.hims_d_department_id}
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
                              /> */}
                            {/* </span> */}
                            {/* <label style={{paddingTop: "4%",cursor:"pointer"}} htmlFor={"dept_"+ data.hims_d_department_id}>{data.department_name}</label> */}
                            <ul className="subDeptUl">
                              {data.subDepts.map((sub, index) => {
                                return (
                                  <li key={sub.hims_d_sub_department_id}>
                                    <span>
                                      <input
                                        type="checkbox"
                                        onChange={this.changeSubdepartment.bind(
                                          this,
                                          { data, sub }
                                        )}
                                        id={
                                          "sub_" + sub.hims_d_sub_department_id
                                        }
                                        name="subDepartments"
                                        checked={
                                          sub.checked === undefined
                                            ? false
                                            : sub.checked
                                        }
                                        value={sub.hims_d_sub_department_id}
                                      />
                                    </span>
                                    <label
                                      htmlFor={
                                        "sub_" + sub.hims_d_sub_department_id
                                      }
                                    >
                                      {sub.sub_department_name}
                                    </label>
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
                      disabled={
                        this.state.selectedBranchName === "" ? true : false
                      }
                    >
                      Map to Branch
                    </button>
                    <button
                      type="button"
                      className="btn btn-default"
                      style={{ marginTop: 19, marginRight: 10, float: "right" }}
                      onClick={this.clearAll.bind(this)}
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
