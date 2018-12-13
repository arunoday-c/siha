import React, { Component } from "react";
import "./login_users.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

class LoginUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login_users: []
    };
    this.getGroups();
    this.getLoginUsers();
  }

  resetSaveState() {
    this.setState({
      username: "",
      display_name: "",
      effective_start_date: null,
      password: "",
      confirm_password: "",
      app_group_id: null,
      role_id: null
    });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
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

  deleteLoginUser() {}
  updateLoginUser() {}

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
            effective_start_date: this.state.effective_start_date,
            password: this.state.password,
            app_group_id: this.state.app_group_id,
            role_id: this.state.role_id
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record added successfully",
                type: "success"
              });

              this.getLoginUsers();
              this.resetSaveState();
            }
          },
          onError: error => {}
        });
      }
    });
  }

  render() {
    return (
      <div className="login_users">
        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col" }}
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
            <AlagehFormGroup
              div={{ className: "col" }}
              label={{
                fieldName: "password",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "password",
                value: this.state.password,
                events: {
                  onChange: this.changeTexts.bind(this)
                },
                others: {
                  type: "password"
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col" }}
              label={{
                fieldName: "confirm_password",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "confirm_password",
                value: this.state.confirm_password,
                events: {
                  onChange: this.changeTexts.bind(this)
                },
                others: {
                  checkvalidation: "'$value' !=='" + this.state.password + "'",
                  errormessage: "Passwords doesn't match",
                  type: "Password"
                }
              }}
            />

            <AlagehFormGroup
              div={{ className: "col" }}
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
            />

            <AlagehAutoComplete
              div={{ className: "col" }}
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
              div={{ className: "col" }}
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

            <AlgaehDateHandler
              div={{ className: "col" }}
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
            />

            <div className="col">
              <button
                style={{ marginTop: 21 }}
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

        <div
          className="col-lg-12"
          data-validate="apptClinicsDiv"
          id="adminGrid_Cntr"
        >
          <AlgaehDataGrid
            id="login-grid"
            datavalidate="data-validate='apptClinicsDiv'"
            columns={[
              {
                fieldName: "username",
                label: <AlgaehLabel label={{ fieldName: "username" }} />
              },
              {
                fieldName: "user_display_name",
                label: <AlgaehLabel label={{ fieldName: "display_name" }} />
              },
              {
                fieldName: "app_group_name",
                label: <AlgaehLabel label={{ fieldName: "group" }} />,
                editorTemplate: row => {
                  return (
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      selector={{
                        name: "app_group_id",
                        className: "select-fld",
                        value: row.app_group_id,
                        dataSource: {
                          textField: "app_group_name",
                          valueField: "algaeh_d_app_group_id",
                          data: this.state.groups
                        },
                        others: {
                          errormessage: "Groups cannot be blank",
                          required: true
                        },
                        onChange: this.changeGridEditors.bind(this, row)
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
                      div={{ className: "col" }}
                      selector={{
                        name: "role_id",
                        className: "select-fld",
                        value: row.role_id,
                        dataSource: {
                          textField: "role_name",
                          valueField: "app_d_app_roles_id",
                          data: this.state.roles
                        },
                        others: {
                          errormessage: "Role cannot be blank",
                          required: true
                        },
                        onChange: this.changeGridEditors.bind(this, row)
                      }}
                    />
                  );
                }
              }
            ]}
            keyId="hims_d_login_user_id"
            dataSource={{
              data: this.state.login_users
            }}
            isEditable={true}
            paging={{ page: 0, rowsPerPage: 10 }}
            events={{
              onEdit: () => {},
              onDelete: this.deleteLoginUser.bind(this),
              onDone: this.updateLoginUser.bind(this)
            }}
          />
        </div>
      </div>
    );
  }
}

export default LoginUsers;
