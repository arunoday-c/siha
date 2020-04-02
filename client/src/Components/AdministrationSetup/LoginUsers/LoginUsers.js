import React, { Component } from "react";
import "./login_users.scss";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import AlgaehAutoSearch from "../../Wrapper/autoSearch";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import {
  HIMS_HR_USER_TYPE,
  HIMS_USER_TYPE,
  HR_USER_TYPE,
  FORMAT_STATUS
} from "../../../utils/GlobalVariables.json";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import Enumerable from "linq";
import _ from "lodash";
import { MainContext } from "algaeh-react-components/context";
import { Button, Input } from "algaeh-react-components";
class LoginUsers extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      algaeh_d_app_user_id: null,
      login_users: [],
      PR_USER_TYPE: [], //USER_TYPE,
      apiConfig: false,
      selectedUSer: {},
      roles_grid: [],
      branch_detail: [],
      user_type: "",
      hospitals: [],
      password_email: "",
      current_user_type: "",
      verify_password: true,
      load_verify_email: false,
      employee_id: "",
      editData: false,
      full_name: "",
      enableSuggestions: false,
      suggesteedUserNames: [],
      checkavilablity: false,
      employee_code: "",
      loaduserNameCheck: false
    };
    this.userNameIntervalId = undefined;
  }

  static contextType = MainContext;

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    // console.log("Activated_Modueles", this.context);

    this.getGroups();
    this.getLoginUsers();
    this.getOrganization();
    this.getBranchDetail();

    const userToken = this.context.userToken;

    const HIMS_Active =
      userToken.product_type === "HIMS_ERP" ||
      userToken.product_type === "HIMS_CLINICAL"
        ? true
        : false;

    const HRMS_Active =
      userToken.product_type === "HIMS_ERP" ||
      userToken.product_type === "HRMS" ||
      userToken.product_type === "HRMS_ERP" ||
      userToken.product_type === "FINANCE_ERP"
        ? true
        : false;
    let USER_TYPE =
      HIMS_Active === true && HRMS_Active === true
        ? HIMS_HR_USER_TYPE
        : HIMS_Active === true
        ? HIMS_USER_TYPE
        : HRMS_Active === true
        ? HR_USER_TYPE
        : [];
    if (userToken.user_type !== "SU") {
      USER_TYPE = USER_TYPE.filter(f => f.value !== "AD");
    }
    if (userToken.product_type === undefined) {
      USER_TYPE = HIMS_HR_USER_TYPE;
      USER_TYPE = HIMS_USER_TYPE;
      USER_TYPE = HR_USER_TYPE;
    }
    this.setState({
      PR_USER_TYPE: USER_TYPE,
      current_user_type: userToken.user_type
    });
  }
  onSuggestionClick(e) {
    this.setState({
      username: e.target.innerText,
      checkavilablity: true
    });
  }
  searchSelect(data) {
    const email =
      data.work_email !== null && data.work_email !== ""
        ? data.work_email
        : data.email !== null && data.email !== ""
        ? data.email
        : "";
    const username = data.full_name.split(" ")[0].toLowerCase();

    this.setState(
      {
        employee_id: data.hims_d_employee_id,
        sub_department_id: data.sub_department_id,
        full_name: data.full_name,
        display_name: data.full_name,
        username: username,
        password_email: email,
        verify_password: email === "" ? true : false,
        employee_code: data.employee_code
      },
      () => {
        this.getVerifyUser(username, data.hims_d_employee_id)
          .then(result => {
            if (result === false) {
              const dtl = data.employee_code.replace(/" "/g, "");
              const suggestiveName = dtl.substring(dtl.length - 4);
              this.setState({
                enableSuggestions: true,
                suggesteedUserNames: [suggestiveName, data.work_email],
                checkavilablity: false
              });
            } else {
              this.setState({
                enableSuggestions: false,
                suggesteedUserNames: [],
                checkavilablity: false
              });
            }
          })
          .catch(() => {
            this.setState({ enableSuggestions: false, checkavilablity: false });
          });
      }
    );
  }

  resetSaveState() {
    this.setState({
      algaeh_d_app_user_id: null,
      username: "",
      display_name: "",
      password: "",
      confirm_password: "",
      app_group_id: null,
      role_id: null,
      employee_id: null,
      sub_department_id: null,
      user_type: "",
      full_name: "",
      branch_detail: [],
      branch_desc: "",
      password_email: "",
      verify_password: true,
      editData: false,
      enableSuggestions: false,
      suggesteedUserNames: [],
      checkavilablity: false,
      employee_code: "",
      loaduserNameCheck: false
    });
    this.getBranchDetail();
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  onClearBranch() {
    this.setState({
      hospital_id: undefined
    });
  }

  getOrganization() {
    this._isMounted = true;
    algaehApiCall({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
      onSuccess: response => {
        if (response.data.success === true && this._isMounted === true) {
          this.setState({
            hospitals: response.data.records,
            hospital_id: response.data.records[0].hims_d_hospital_id
          });
        }
      },
      onFailure: error => {
        this.setState({
          branch: {
            loader: false
          }
        });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  getBranchDetail() {
    this._isMounted = true;
    algaehApiCall({
      uri: "/organization/getOrganization",
      method: "GET",
      onSuccess: response => {
        if (response.data.success === true && this._isMounted === true) {
          const data = response.data.records.map(item => {
            return {
              checked: false,
              login_user: "N",
              ...item
            };
          });
          this.setState({
            branch_detail: data
          });
        }
      },
      onFailure: error => {
        this.setState({
          branch: {
            loader: false
          }
        });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  getLoginUsers() {
    this._isMounted = true;
    algaehApiCall({
      uri: "/algaehappuser/getLoginUserMaster",
      method: "GET",
      onSuccess: response => {
        if (response.data.success === true && this._isMounted === true) {
          let login_users = Enumerable.from(response.data.records)
            .groupBy("$.hims_d_employee_id", null, (k, g) => {
              let firstRecordSet = Enumerable.from(g).firstOrDefault();

              return {
                email: firstRecordSet.email,
                work_email: firstRecordSet.work_email,
                algaeh_d_app_user_id: firstRecordSet.algaeh_d_app_user_id,
                full_name: firstRecordSet.full_name,
                employee_code: firstRecordSet.employee_code,
                username: firstRecordSet.username,
                user_type: firstRecordSet.user_type,
                branch_data: g.getSource(),
                app_group_name: firstRecordSet.app_group_name,
                app_group_id: firstRecordSet.app_group_id,
                role_name: firstRecordSet.role_name,
                role_id: firstRecordSet.role_id,
                user_status: firstRecordSet.user_status,
                hospital_id: firstRecordSet.hospital_id,
                algaeh_m_role_user_mappings_id:
                  firstRecordSet.algaeh_m_role_user_mappings_id,
                hims_d_employee_id: firstRecordSet.hims_d_employee_id
              };
            })
            .toArray();
          this.setState({ login_users: login_users });
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
  getVerifyUser(username, hims_d_employee_id) {
    return new Promise((resolve, reject) => {
      algaehApiCall({
        uri: "/algaehappuser/verifyUserNameExists",
        method: "GET",
        data: { username: username, hims_d_employee_id: hims_d_employee_id },
        onSuccess: response => {
          const { success } = response.data;
          resolve(success);
        },
        onCatch: error => {
          reject();
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    });
  }

  onChangeUser(e) {
    const value = e.target.value.trim();
    // const target = e.target;
    e.persist();

    const showLoading = value.length >= 4 ? { loaduserNameCheck: true } : {};

    this.setState(
      {
        ...showLoading,
        username: value
      },
      () => {
        const dtl = this.state.employee_code.replace(/" "/g, "");
        const suggestiveName = dtl.substring(dtl.length - 4);
        if (value.length < 4) {
          this.setState({
            loaduserNameCheck: false,
            enableSuggestions: true,
            suggesteedUserNames: [suggestiveName, this.state.password_email],
            checkavilablity: false
          });
          return;
        }
        const hims_d_employee_id = this.state.employee_id;
        clearInterval(this.userNameIntervalId);
        this.userNameIntervalId = setInterval(() => {
          this.getVerifyUser(e.target.value.trim(), hims_d_employee_id)
            .then(result => {
              // const dtl = this.state.employee_code.replace(/" "/g, "");
              // const suggestiveName = dtl.substring(dtl.length - 4);
              if (result === false) {
                this.setState({
                  loaduserNameCheck: false,

                  enableSuggestions: true,
                  suggesteedUserNames: [
                    suggestiveName,
                    this.state.password_email
                  ],
                  checkavilablity: false
                });
              } else {
                this.setState({
                  loaduserNameCheck: false,
                  enableSuggestions: true,
                  checkavilablity: true,
                  suggesteedUserNames: [
                    suggestiveName,
                    this.state.password_email
                  ]
                });
              }
            })
            .catch(() => {
              this.setState({
                loaduserNameCheck: false,
                checkavilablity: false,
                loaduserNameCheck: false
              });
            });
          clearInterval(this.userNameIntervalId);
        }, 1000);
      }
    );
    // }
    // this.debouncedFn();
    // } else {
    //   this.setState(
    //     {
    //       username: value,
    //       checkavilablity: false,
    //       loaduserNameCheck: false
    //     },
    //     () => {
    //       debugger;
    //       target.focus();
    //     }
    //   );
    // }
  }

  getGroups() {
    this._isMounted = true;
    algaehApiCall({
      uri: "/algaehappuser/selectAppGroup",
      method: "GET",
      onSuccess: response => {
        if (response.data.success === true && this._isMounted === true) {
          this.setState({ groups: response.data.records });
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

  getRoles(group_id) {
    this._isMounted = true;
    algaehApiCall({
      uri: "/algaehappuser/selectRoles",
      method: "GET",
      data: {
        algaeh_d_app_group_id: group_id
      },
      onSuccess: response => {
        if (response.data.success === true && this._isMounted === true) {
          this.setState({ roles: response.data.records });
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

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  dropDownHandler(value) {
    switch (value.name) {
      case "app_group_id":
        this.getRoles(value.value);
        this.setState({
          [value.name]: value.value
        });
        break;
      default:
        this.setState({
          [value.name]: value.value
        });
    }
  }

  updateLoginUser(data) {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        // debugger;
      }
    });
  }

  addLoginUser() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        if (this.state.algaeh_d_app_user_id === null) {
          let branch_data = _.filter(this.state.branch_detail, f => {
            return f.checked === true;
          });
          const selectedData = this.state.branch_detail.find(
            f => f.hims_d_hospital_id === this.state.hospital_id
          );
          selectedData.login_user = "Y";
          branch_data.push(selectedData);
          algaehApiCall({
            uri: "/algaehappuser/createUserLogin",
            method: "POST",
            data: {
              password_email: this.state.password_email,
              username: this.state.username,
              user_display_name: this.state.display_name,
              // effective_start_date: this.state.effective_start_date,
              // effective_end_date: this.state.effective_end_date,
              password: this.state.password,
              app_group_id: this.state.app_group_id,
              role_id: this.state.role_id,
              user_type: this.state.user_type,
              employee_id: this.state.employee_id,
              sub_department_id: this.state.sub_department_id,
              hospital_id: this.state.hospital_id,
              branch_data: branch_data
            },
            onSuccess: response => {
              if (response.data.success) {
                swalMessage({
                  title: "Record added successfully",
                  type: "success"
                });

                this.getLoginUsers();
                this.resetSaveState();
                this.getBranchDetail();
              } else if (!response.data.success) {
                swalMessage({
                  title: response.data.records.message,
                  type: "warning"
                });
              }
            },
            onError: error => {}
          });
        } else {
          let branch_data = _.filter(
            this.state.branch_detail,
            f =>
              (f.checked === true &&
                (f.hims_m_user_employee_id === null ||
                  f.hims_m_user_employee_id === undefined)) ||
              f.hims_d_hospital_id === this.state.hospital_id
          );

          const delete_branch_data = _.filter(this.state.branch_detail, f => {
            return f.checked === false && f.hims_m_user_employee_id !== null;
          });

          algaehApiCall({
            uri: "/algaehappuser/updateUser",
            method: "PUT",
            data: {
              password_email: this.state.password_email,
              app_group_id: this.state.app_group_id,
              role_id: this.state.role_id,
              user_type: this.state.user_type,
              algaeh_d_app_user_id: this.state.algaeh_d_app_user_id,
              algaeh_m_role_user_mappings_id: this.state
                .algaeh_m_role_user_mappings_id,
              user_status: this.state.user_status,
              branch_data: branch_data,
              delete_branch_data: delete_branch_data
            },
            onSuccess: response => {
              if (response.data.success) {
                swalMessage({
                  title: "Record updated successfully",
                  type: "success"
                });

                this.getLoginUsers();
                this.resetSaveState();
              } else if (!response.data.success) {
                swalMessage({
                  title: response.data.records.message,
                  type: "error"
                });
              }
            },
            onCatch: error => {
              swalMessage({
                title: error.message,
                type: "error"
              });
            }
          });
        }
      }
    });
  }
  apiConfiguration(row, e) {
    const { username, hospital_id } = row;
    algaehApiCall({
      uri: "/apiAuth/getAPI",
      method: "GET",
      data: { username: username, item_id: hospital_id },
      onSuccess: response => {
        const { data } = response;
        const { success, records } = data;
        if (success) {
          this.setState({
            apiConfig: true,
            selectedUSer: {
              "x-api-token": records["x-api-token"],
              username,
              full_name: row.full_name
            }
          });
        }
      }
    });
  }
  RemoveApiPermission(e) {
    const { username } = this.state.selectedUSer;
    algaehApiCall({
      uri: "/apiAuth/removeAPI",
      method: "PUT",
      data: { username: username },
      onSuccess: response => {
        const { data } = response;
        const { success, message } = data;
        if (success) {
          this.setState({
            apiConfig: false,
            selectedUSer: {}
          });
          swalMessage({
            type: "success",
            title: message
          });
        }
      }
    });
  }

  selectBranch(data, e) {
    let branch_detail = this.state.branch_detail;
    let selecte_branch = _.find(
      branch_detail,
      f => f.hims_d_hospital_id === data.hims_d_hospital_id
    );
    const _index = branch_detail.indexOf(selecte_branch);
    selecte_branch.checked = e.target.checked;
    branch_detail[_index] = selecte_branch;
    this.setState({ branch_detail: branch_detail });
  }

  EditLoginUser(row) {
    let branch_detail = this.state.branch_detail;

    for (let i = 0; i < row.branch_data.length; i++) {
      let selecte_branch = _.find(
        branch_detail,
        f => f.hims_d_hospital_id === row.branch_data[i].hospital_id
      );
      const _index = branch_detail.indexOf(selecte_branch);
      selecte_branch.checked = true;
      selecte_branch.hims_m_user_employee_id =
        row.branch_data[i].hims_m_user_employee_id;
      branch_detail[_index] = selecte_branch;
    }
    this.getRoles(row.app_group_id);
    const email = !!row.work_email
      ? row.work_email
      : !!row.email
      ? row.email
      : "";
    this.setState({
      algaeh_d_app_user_id: row.algaeh_d_app_user_id,
      username: row.username,
      full_name: row.full_name,
      app_group_id: row.app_group_id,
      role_id: row.role_id,
      user_type: row.user_type,
      user_status: row.user_status,
      employee_id: row.hims_d_employee_id,
      sub_department_id: row.sub_department_id,
      hospital_id: row.hospital_id,
      algaeh_m_role_user_mappings_id: row.algaeh_m_role_user_mappings_id,
      branch_detail: branch_detail,
      password_email: email,
      verify_password: email !== "" ? false : true,
      editData: true,
      enableSuggestions: false,
      checkavilablity: false,
      suggesteedUserNames: []
      // branch_data: branch_data
    });
  }

  getHospitalShortDesc() {
    const detail = this.state.hospitals.find(
      f => f.hims_d_hospital_id === this.state.hospital_id
    );
    if (detail !== undefined) return "@" + detail.hospital_code.toLowerCase();

    return "";
  }

  onVerifyEmailID() {
    if (this.state.password_email === "") {
      swalMessage({
        title: "Please provide email address.",
        type: "info"
      });
      return;
    }
    this.setState({ load_verify_email: true }, () => {
      algaehApiCall({
        uri: "/algaehappuser/verifyEmployeeEmail",
        method: "POST",
        data: {
          email_id: this.state.password_email,
          hims_d_employee_id: this.state.employee_id
        },
        onSuccess: response => {
          this.setState({ load_verify_email: false, verify_password: false });
          const { success, message } = response.data;
          swalMessage({
            title: message,
            type: success === true ? "success" : "error"
          });
        },
        onCatch: error => {
          const { message } = error.response.data;
          swalMessage({
            title: message,
            type: "error"
          });
        }
      });
    });
  }

  onSearchClear() {
    this.setState({
      employee_id: "",
      sub_department_id: "",
      full_name: "",
      display_name: "",
      username: "",
      branch_detail: [],
      password_email: "",
      verify_password: true,
      load_verify_email: false,
      enableSuggestions: false,
      suggesteedUserNames: [],
      checkavilablity: false,
      algaeh_d_app_user_id: null
    });
  }

  render() {
    return (
      <div className="login_users">
        <AlgaehModalPopUp
          className="col-6"
          title="API Configuration"
          openPopup={this.state.apiConfig}
          onClose={() => {
            this.setState({
              apiConfig: false,
              selectedUSer: {}
            });
          }}
        >
          <div>
            <h5>{this.state.selectedUSer.full_name}</h5>
            <strong>TOKEN</strong>:
            <small className="col-3">
              {this.state.selectedUSer["x-api-token"]}
            </small>
            <button onClick={this.RemoveApiPermission.bind(this)}>
              Remove API Permission
            </button>
          </div>
        </AlgaehModalPopUp>
        <div className="row">
          <div className="col-3">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-12 form-group" }}
                    label={{
                      forceLabel: "branch",
                      isImp: true
                    }}
                    selector={{
                      name: "hospital_id",
                      className: "select-fld",
                      value: this.state.hospital_id,
                      dataSource: {
                        textField: "hospital_name",
                        valueField: "hims_d_hospital_id",
                        data: this.state.hospitals
                      },
                      others: {
                        disabled:
                          this.state.algaeh_d_app_user_id === null
                            ? false
                            : true
                      },
                      onChange: this.dropDownHandler.bind(this),
                      onClear: this.onClearBranch.bind(this)
                    }}
                  />
                  <AlgaehAutoSearch
                    div={{ className: "col-12 form-group" }}
                    label={{
                      forceLabel: "Select Employee",
                      isImp: true
                    }}
                    title="Search Employees"
                    id="item_id_search"
                    template={result => {
                      return (
                        <section className="resultSecStyles">
                          <div className="row">
                            <div className="col-8">
                              <h4 className="title">{result.employee_code}</h4>
                              <small>{result.full_name}</small>
                            </div>
                            <div className="col-4" />
                          </div>
                        </section>
                      );
                    }}
                    name="hims_d_employee_id"
                    columns={spotlightSearch.Employee_details.loginNewEmployee}
                    displayField="full_name"
                    value={this.state.full_name}
                    searchName="admin_employee_search"
                    extraParameters={{
                      hospital_id: this.state.hospital_id
                    }}
                    others={{
                      disabled:
                        this.state.algaeh_d_app_user_id === null ? false : true
                    }}
                    onClick={this.searchSelect.bind(this)}
                    onClear={this.onSearchClear.bind(this)}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-12 form-group" }}
                    label={{
                      forceLabel: "Enter Email Address",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "password_email",
                      value: this.state.password_email,
                      events: {
                        onChange: this.changeTexts.bind(this)
                      },
                      others: {
                        disabled: !this.state.verify_password,
                        placeholder: "For sending auto generated password"
                      }
                    }}
                  />
                  {!this.state.verify_password ? (
                    <>
                      <div className="col-12 form-group">
                        <label className="style_Label ">
                          User Name<span className="imp">&nbsp;*</span>
                        </label>
                        <div
                          algaeh_required="true"
                          className="ui input txt-fld"
                        >
                          <Input.Search
                            name="username"
                            loading={this.state.loaduserNameCheck}
                            value={this.state.username}
                            disabled={
                              this.state.algaeh_d_app_user_id === null
                                ? false
                                : true
                            }
                            onChange={this.onChangeUser.bind(this)}
                          />
                        </div>
                      </div>
                      {/* <AlagehFormGroup
                        div={{ className: "col-12 form-group" }}
                        label={{
                          fieldName: "username",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "username",
                          value: this.state.username,
                          events: {
                            onChange: this.changeTexts.bind(this)
                          },
                          others: {
                            disabled:
                              this.state.algaeh_d_app_user_id === null
                                ? false
                                : true
                          }
                        }}
                      /> */}
                      {this.state.enableSuggestions === true ? (
                        <>
                          <div
                            className="col-12 form-group"
                            style={{ textAlign: "center" }}
                          >
                            {this.state.checkavilablity === false ? (
                              <span className=" badge badge-danger">
                                This username is taken, Try Another.
                              </span>
                            ) : (
                              <span className=" badge badge-success">
                                This username is available.
                              </span>
                            )}
                          </div>
                          <div
                            className="col-12 form-group"
                            style={{ backgroundColor: "#ffffe6" }}
                          >
                            <strong>Suggested Username</strong>
                            <ul>
                              {this.state.suggesteedUserNames.map(
                                (item, index) => (
                                  <li key={index}>
                                    <span
                                      style={{
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                        color: "blue"
                                      }}
                                      onClick={this.onSuggestionClick.bind(
                                        this
                                      )}
                                    >
                                      {item}
                                    </span>
                                    {this.state.username === item ? (
                                      <i
                                        style={{ marginLeft: "5%" }}
                                        className="fas fa-check"
                                      />
                                    ) : null}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </>
                      ) : null}

                      {this.state.user_type === "AD" &&
                      this.state.current_user_type !== "SU" &&
                      this.state.editData === true ? (
                        <div className="col-6 form-group">
                          <AlgaehLabel
                            label={{
                              forceLabel: "User Type"
                            }}
                          />
                          <h6>Admin</h6>
                        </div>
                      ) : (
                        <AlagehAutoComplete
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "User Type",
                            isImp: true
                          }}
                          selector={{
                            name: "user_type",
                            className: "select-fld",
                            value: this.state.user_type,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: this.state.PR_USER_TYPE
                            },
                            onChange: this.dropDownHandler.bind(this)
                          }}
                        />
                      )}
                      <AlagehAutoComplete
                        div={{ className: "col-6 form-group" }}
                        label={{
                          fieldName: "group",
                          isImp: true
                        }}
                        selector={{
                          name: "app_group_id",
                          className: "select-fld",
                          value: this.state.app_group_id,
                          dataSource: {
                            textField: "app_group_name",
                            valueField: "algaeh_d_app_group_id",
                            data: this.state.groups
                          },
                          // others: {
                          //   disabled:
                          //     this.state.algaeh_d_app_user_id === null
                          //       ? false
                          //       : true
                          // },
                          onChange: this.dropDownHandler.bind(this)
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-6 form-group" }}
                        label={{
                          fieldName: "role",
                          isImp: true
                        }}
                        selector={{
                          name: "role_id",
                          className: "select-fld",
                          value: this.state.role_id,
                          dataSource: {
                            textField: "role_name",
                            valueField: "app_d_app_roles_id",
                            data: this.state.roles
                          },
                          // others: {
                          //   disabled:
                          //     this.state.algaeh_d_app_user_id === null
                          //       ? false
                          //       : true
                          // },
                          onChange: this.dropDownHandler.bind(this)
                        }}
                      />
                      {this.state.algaeh_d_app_user_id !== null ? (
                        <AlagehAutoComplete
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "User Status",
                            isImp: true
                          }}
                          selector={{
                            name: "user_status",
                            className: "select-fld",
                            value: this.state.user_status,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: FORMAT_STATUS
                            },

                            onChange: this.dropDownHandler.bind(this)
                          }}
                        />
                      ) : null}
                      <div className="col-12">
                        <label> Branch List</label>

                        <ul className="branchList">
                          {this.state.branch_detail.map((data, index) => {
                            return (
                              <li key={data.hims_d_hospital_id}>
                                <span>
                                  <input
                                    type="checkbox"
                                    onChange={this.selectBranch.bind(
                                      this,
                                      data
                                    )}
                                    name="modules"
                                    checked={
                                      this.state.hospital_id ===
                                      data.hims_d_hospital_id
                                        ? true
                                        : data.checked === undefined
                                        ? false
                                        : data.checked
                                    }
                                    disabled={
                                      this.state.hospital_id ===
                                      data.hims_d_hospital_id
                                        ? true
                                        : false
                                    }
                                    value={data.hims_d_hospital_id}
                                  />
                                </span>
                                <span>{data.hospital_name}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div
                        className="col-12 form-group"
                        style={{ textAlign: "right" }}
                      >
                        <button
                          onClick={this.resetSaveState.bind(this)}
                          type="button"
                          className="btn btn-default"
                        >
                          <AlgaehLabel
                            label={{
                              forceLabel: "Clear"
                            }}
                          />
                        </button>
                        <button
                          style={{ marginLeft: 15 }}
                          onClick={this.addLoginUser.bind(this)}
                          type="button"
                          className="btn btn-primary"
                        >
                          {this.state.algaeh_d_app_user_id === null ? (
                            <AlgaehLabel
                              label={{
                                fieldName: "add_to_list"
                              }}
                            />
                          ) : (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Update"
                              }}
                            />
                          )}
                        </button>
                      </div>
                    </>
                  ) : this.state.full_name !== "" &&
                    this.state.password_email === "" ? (
                    <div className="col-12">
                      <Button
                        type="primary"
                        icon="check-circle"
                        block
                        className="btn btn-primary"
                        onClick={this.onVerifyEmailID.bind(this)}
                      >
                        Verify Email
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Login Users List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div
                    className="col-lg-12"
                    data-validate="apptClinicsDiv"
                    id="loginUserGrid_Cntr"
                  >
                    <AlgaehDataGrid
                      id="loginUserGrid"
                      datavalidate="data-validate='apptClinicsDiv'"
                      columns={[
                        {
                          fieldName: "action",

                          label: (
                            <AlgaehLabel label={{ forceLabel: "action" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                <i
                                  className="fas fa-pen"
                                  onClick={this.EditLoginUser.bind(this, row)}
                                />
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 65,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "none",
                          label: "API",
                          others: {
                            filterable: false,
                            show:
                              this.state.current_user_type === "SU"
                                ? true
                                : false
                          },
                          displayTemplate: row => {
                            return (
                              <button
                                onClick={this.apiConfiguration.bind(this, row)}
                              >
                                Config
                              </button>
                            );
                          }
                        },
                        {
                          fieldName: "full_name",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Full Name" }} />
                          ),
                          others: {
                            disabled: true,
                            minWidth: 200
                          }
                        },
                        {
                          fieldName: "employee_code",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee code" }}
                            />
                          ),
                          others: {
                            disabled: true
                          }
                        },
                        {
                          fieldName: "username",
                          label: (
                            <AlgaehLabel label={{ fieldName: "username" }} />
                          ),
                          others: {
                            disabled: true
                          }
                        },
                        {
                          fieldName: "user_type",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "User Type" }} />
                          ),

                          displayTemplate: row => {
                            let x =
                              row.user_type !== "AD"
                                ? Enumerable.from(this.state.PR_USER_TYPE)
                                    .where(w => w.value === row.user_type)
                                    .firstOrDefault()
                                : { name: "Admin" };
                            return (
                              <span>
                                {x !== undefined ? x.name : "Unknown user"}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "app_group_name",
                          label: <AlgaehLabel label={{ fieldName: "group" }} />
                        },
                        {
                          fieldName: "role_name",
                          label: <AlgaehLabel label={{ fieldName: "role" }} />
                        },
                        {
                          fieldName: "user_status",
                          label: <label className="style_Label">Status</label>,
                          displayTemplate: row => {
                            return row.user_status === "A"
                              ? "Active"
                              : row.user_status === "I"
                              ? "Inactive"
                              : "----------";
                          }
                        }
                      ]}
                      keyId="algaeh_d_app_user_id"
                      dataSource={{
                        data: this.state.login_users
                      }}
                      isEditable={false}
                      paging={{ page: 0, rowsPerPage: 20 }}
                      filter={true}
                      actions={{
                        allowDelete: false
                      }}
                      events={{
                        onDone: this.updateLoginUser.bind(this)
                      }}
                    />
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

export default LoginUsers;
