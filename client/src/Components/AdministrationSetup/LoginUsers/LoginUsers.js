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
import {
  AlgaehValidation
  // AlgaehOpenContainer
} from "../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import {
  HIMS_HR_USER_TYPE,
  HIMS_USER_TYPE,
  HR_USER_TYPE,
  FORMAT_STATUS
} from "../../../utils/GlobalVariables.json";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import Enumerable from "linq";
import swal from "sweetalert2";
import _ from "lodash";
import { MainContext } from "algaeh-react-components/context";
class LoginUsers extends Component {
  constructor(props) {
    super(props);
    // let Activated_Modueles = JSON.parse(
    //   AlgaehOpenContainer(sessionStorage.getItem("ModuleDetails"))
    // );

    // let Activated_Modueles = this.context;

    // const HIMS_Active = _.filter(Activated_Modueles, f => {
    //   return f.module_code === "FTDSK";
    // });
    // const HRMS_Active = _.filter(Activated_Modueles, f => {
    //   return f.module_code === "PAYROLL";
    // });

    // const USER_TYPE =
    //   HIMS_Active.length > 0 && HRMS_Active.length > 0
    //     ? HIMS_HR_USER_TYPE
    //     : HIMS_Active.length > 0
    //     ? HIMS_USER_TYPE
    //     : HRMS_Active.length > 0
    //     ? HR_USER_TYPE
    //     : [];

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
      password_email: ""
    };
    this.getGroups();
    this.getLoginUsers();
    this.getOrganization();
    this.getBranchDetail();
  }
  componentDidMount() {
    // console.log("Activated_Modueles", this.context);
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

    const USER_TYPE =
      HIMS_Active === true && HRMS_Active === true
        ? HIMS_HR_USER_TYPE
        : HIMS_Active === true
        ? HIMS_USER_TYPE
        : HRMS_Active
        ? HR_USER_TYPE
        : [];
    this.setState({ PR_USER_TYPE: USER_TYPE, user_type: userToken.user_type });
  }
  searchSelect(data) {
    let branch_detail = this.state.branch_detail;
    let selecte_branch = _.find(
      branch_detail,
      f => f.hims_d_hospital_id === data.hospital_id
    );
    const _index = branch_detail.indexOf(selecte_branch);
    selecte_branch.checked = true;
    branch_detail[_index] = selecte_branch;

    this.setState({
      employee_id: data.hims_d_employee_id,
      sub_department_id: data.sub_department_id,
      full_name: data.full_name,
      display_name: data.full_name,
      username: data.full_name.split(" ")[0].toLowerCase(),
      // username: data.work_email.toLowerCase(),
      branch_detail: branch_detail,
      password_email:
        data.work_email !== null
          ? data.work_email
          : data.email !== null
          ? data.email
          : ""
    });
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
      branch_desc: ""
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
    algaehApiCall({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
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
    algaehApiCall({
      uri: "/organization/getOrganization",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          const data = response.data.records.map(item => {
            return {
              checked: false,
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
    algaehApiCall({
      uri: "/algaehappuser/getLoginUserMaster",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
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
                  firstRecordSet.algaeh_m_role_user_mappings_id
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
  getGroups() {
    algaehApiCall({
      uri: "/algaehappuser/selectAppGroup",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
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
    algaehApiCall({
      uri: "/algaehappuser/selectRoles",
      method: "GET",
      data: {
        algaeh_d_app_group_id: group_id
      },
      onSuccess: response => {
        if (response.data.success) {
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
        debugger;
      }
    });
  }

  addLoginUser() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        debugger;
        if (this.state.algaeh_d_app_user_id === null) {
          const branch_data = _.filter(this.state.branch_detail, f => {
            return f.checked === true;
          });
          algaehApiCall({
            uri: "/algaehappuser/createUserLogin",
            method: "POST",
            data: {
              username: this.state.username,
              user_display_name: this.state.display_name,
              //effective_start_date: this.state.effective_start_date,
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
          const branch_data = _.filter(this.state.branch_detail, f => {
            return (
              f.checked === true &&
              (f.hims_m_user_employee_id === null ||
                f.hims_m_user_employee_id === undefined)
            );
          });

          const delete_branch_data = _.filter(this.state.branch_detail, f => {
            return f.checked === false && f.hims_m_user_employee_id !== null;
          });

          algaehApiCall({
            uri: "/algaehappuser/updateUser",
            method: "PUT",
            data: {
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
            onFailure: error => {
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
    branch_detail = branch_detail.map(item => {
      return {
        hims_m_user_employee_id: null,
        ...item
      };
    });
    for (let i = 0; i < row.branch_data.length; i++) {
      debugger;
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
    this.setState({
      algaeh_d_app_user_id: row.algaeh_d_app_user_id,
      username: row.username,
      full_name: row.full_name,
      app_group_id: row.app_group_id,
      role_id: row.role_id,
      user_type: row.user_type,
      user_status: row.user_status,
      employee_id: row.employee_id,
      sub_department_id: row.sub_department_id,
      hospital_id: row.hospital_id,
      algaeh_m_role_user_mappings_id: row.algaeh_m_role_user_mappings_id,
      branch_detail: branch_detail
      // branch_data: branch_data
    });
  }
  getHospitalShortDesc() {
    debugger;
    const detail = this.state.hospitals.find(
      f => f.hims_d_hospital_id === this.state.hospital_id
    );
    if (detail !== undefined) return detail.hospital_code;

    return "";
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
                  />

                  <AlagehFormGroup
                    div={{ className: "col-12 form-group" }}
                    label={{
                      forceLabel: "Email ID to send password",
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
                        disabled:
                          this.state.password_email !== null &&
                          this.state.password_email !== "" &&
                          this.state.password_email !== undefined
                            ? true
                            : false
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-6 form-group" }}
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
                      }
                    }}
                  />
                  <div className="col-6" style={{ paddingLeft: 0 }}>
                    <span style={{ paddingTop: 24, display: "inline-block" }}>
                      {" "}
                      @<b>{this.getHospitalShortDesc()}</b>
                    </span>
                  </div>
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
                                onChange={this.selectBranch.bind(this, data)}
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
                  <div className="col-12 form-group">
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
                            show: this.state.user_type === "SU" ? true : false
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
                            let x = Enumerable.from(this.state.PR_USER_TYPE)
                              .where(w => w.value === row.user_type)
                              .firstOrDefault();
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
                        // onEdit: this.EditGrid.bind(this),
                        // onDelete: this.deleteLoginUser.bind(this),
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
LoginUsers.contextType = MainContext;
export default LoginUsers;
