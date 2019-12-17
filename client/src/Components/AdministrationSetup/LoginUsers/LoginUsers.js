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
  AlgaehValidation,
  AlgaehOpenContainer
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

class LoginUsers extends Component {
  constructor(props) {
    super(props);
    let Activated_Modueles = JSON.parse(
      AlgaehOpenContainer(sessionStorage.getItem("ModuleDetails"))
    );
    const HIMS_Active = _.filter(Activated_Modueles, f => {
      return f.module_code === "FTDSK";
    });
    const HRMS_Active = _.filter(Activated_Modueles, f => {
      return f.module_code === "PAYROLL";
    });

    const USER_TYPE =
      HIMS_Active.length > 0 && HRMS_Active.length > 0
        ? HIMS_HR_USER_TYPE
        : HIMS_Active.length > 0
        ? HIMS_USER_TYPE
        : HRMS_Active.length > 0
        ? HR_USER_TYPE
        : [];

    this.state = {
      login_users: [],
      PR_USER_TYPE: USER_TYPE,
      apiConfig: false,
      selectedUSer: {},
      roles_grid: []
    };
    this.getGroups();
    this.getLoginUsers();
    this.getOrganization();
  }

  searchSelect(data) {
    this.setState({
      employee_id: data.hims_d_employee_id,
      sub_department_id: data.sub_department_id,
      full_name: data.full_name,
      display_name: data.full_name,
      username: data.full_name.split(" ")[0].toLowerCase()
    });
  }

  resetSaveState() {
    this.setState({
      username: "",
      display_name: "",
      //effective_start_date: null,
      password: "",
      confirm_password: "",
      app_group_id: null,
      role_id: null,
      employee_id: null,
      sub_department_id: null,
      user_type: "",
      full_name: ""
    });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
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
  getLoginUsers() {
    algaehApiCall({
      uri: "/algaehappuser/getLoginUserMaster",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ login_users: response.data.records });
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
    algaehApiCall({
      uri: "/algaehappuser/updateUser",
      method: "PUT",
      data: {
        user_display_name: data.user_display_name,
        algaeh_d_app_user_id: data.algaeh_d_app_user_id,
        user_status: data.user_status
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

  EditGrid(data) {
    algaehApiCall({
      uri: "/algaehappuser/selectRoles",
      method: "GET",
      data: {
        algaeh_d_app_group_id: data.app_group_id
      },
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ roles_grid: response.data.records });
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

  deleteLoginUser(data) {
    swal({
      title: "Do you want to De Activate : " + data.username + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/algaehMasters/deleteUserLogin",
          method: "DELETE",
          data: {
            user_id: data.algaeh_d_app_user_id,
            employee_id: data.hims_d_employee_id
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record updated successfully",
                type: "success"
              });

              this.getLoginUsers();
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
  addLoginUser() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
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
            hospital_id: this.state.hospital_id
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record added successfully",
                type: "success"
              });

              this.getLoginUsers();
              this.resetSaveState();
            } else if (!response.data.success) {
              swalMessage({
                title: response.data.records.message,
                type: "warning"
              });
            }
          },
          onError: error => {}
        });
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
                  {" "}
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
                      onChange: this.dropDownHandler.bind(this)
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
                    onClick={this.searchSelect.bind(this)}
                  />
                  {/* <AlagehFormGroup
                    div={{ className: "col-12 form-group" }}
                    label={{
                      fieldName: "display_name",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "display_name",
                      value: this.state.display_name,
                      events: {
                        onChange: this.changeTexts.bind(this)
                      }
                    }}
                  /> */}
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
                  {/* <AlgaehDateHandler
                    div={{ className: "col-12 form-group" }}
                    label={{
                      fieldName: "effective_start_date",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "effective_start_date"
                    }}
                    // maxDate={new Date()}
                    events={{
                      onChange: selDate => {
                        this.setState({
                          effective_start_date: selDate
                        });
                      }
                    }}
                    value={this.state.effective_start_date}
                  /> */}
                  <div className="col-12">
                    <label> Branch List</label>
                    <ul className="branchList">
                      <li>
                        <span>
                          <input type="checkbox" checked disabled />
                        </span>
                        <span>SES</span>
                      </li>{" "}
                      <li>
                        <span>
                          <input type="checkbox" />
                        </span>
                        <span>Branch Name</span>
                      </li>{" "}
                      <li>
                        <span>
                          <input type="checkbox" />
                        </span>
                        <span>Branch Name</span>
                      </li>{" "}
                      <li>
                        <span>
                          <input type="checkbox" />
                        </span>
                        <span>Branch Name</span>
                      </li>{" "}
                      <li>
                        <span>
                          <input type="checkbox" />
                        </span>
                        <span>Branch Name</span>
                      </li>{" "}
                      <li>
                        <span>
                          <input type="checkbox" />
                        </span>
                        <span>Branch Name</span>
                      </li>{" "}
                      <li>
                        <span>
                          <input type="checkbox" />
                        </span>
                        <span>Branch Name</span>
                      </li>{" "}
                      <li>
                        <span>
                          <input type="checkbox" />
                        </span>
                        <span>Branch Name</span>
                      </li>
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
                      <AlgaehLabel
                        label={{
                          fieldName: "add_to_list"
                        }}
                      />
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
                          fieldName: "none",
                          label: "API",
                          others: {
                            filterable: false
                          },
                          displayTemplate: row => {
                            return (
                              <button
                                onClick={this.apiConfiguration.bind(this, row)}
                              >
                                Config
                              </button>
                            );
                          },
                          editorTemplate: row => {
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
                        // {
                        //   fieldName: "user_display_name",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{ fieldName: "display_name" }}
                        //     />
                        //   ),
                        //   editorTemplate: row => {
                        //     return (
                        //       <AlagehFormGroup
                        //         div={{ className: "col" }}
                        //         textBox={{
                        //           className: "txt-fld",
                        //           name: "user_display_name",
                        //           value: row.user_display_name,
                        //           events: {
                        //             onChange: this.changeGridEditors.bind(
                        //               this,
                        //               row
                        //             )
                        //           },
                        //           others: {
                        //             errormessage:
                        //               " Description- cannot be blank",
                        //             required: true
                        //           }
                        //         }}
                        //       />
                        //     );
                        //   }
                        // },
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
                          },
                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                div={{}}
                                selector={{
                                  name: "user_type",
                                  className: "select-fld",
                                  value: row.user_type,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: this.state.PR_USER_TYPE
                                  },
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "app_group_name",
                          label: <AlgaehLabel label={{ fieldName: "group" }} />,
                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                div={{}}
                                selector={{
                                  name: "app_group_id",
                                  className: "select-fld",
                                  value: row.app_group_id,
                                  dataSource: {
                                    textField: "app_group_name",
                                    valueField: "algaeh_d_app_group_id",
                                    data: this.state.groups
                                  },
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "role_name",
                          label: <AlgaehLabel label={{ fieldName: "role" }} />,
                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                div={{}}
                                selector={{
                                  name: "role_id",
                                  className: "select-fld",
                                  value: row.role_id,
                                  dataSource: {
                                    textField: "role_name",
                                    valueField: "app_d_app_roles_id",
                                    data: this.state.roles_grid
                                  },
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                }}
                              />
                            );
                          }
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
                          },
                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                selector={{
                                  name: "user_status",
                                  className: "select-fld",
                                  value: row.user_status,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: FORMAT_STATUS
                                  },

                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                }}
                              />
                            );
                          }
                        }
                      ]}
                      keyId="algaeh_d_app_user_id"
                      dataSource={{
                        data: this.state.login_users
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 20 }}
                      filter={true}
                      actions={{
                        allowDelete: false
                      }}
                      events={{
                        onEdit: this.EditGrid.bind(this),
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

export default LoginUsers;
