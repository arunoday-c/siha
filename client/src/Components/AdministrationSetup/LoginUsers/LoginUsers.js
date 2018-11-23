import React, { Component } from "react";
import "./login_users.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlagehFormGroup
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

class LoginUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login_users: []
    };
    this.getGroups();
    this.getRoles();
    this.getLoginUsers();
  }

  getLoginUsers() {
    algaehApiCall({
      uri: "/algaehappuser/selectLoginUser",
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

  getRoles() {
    algaehApiCall({
      uri: "/algaehappuser/selectRoles",
      method: "GET",
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
    this.setState({
      [value.name]: value.value
    });
  }

  deleteLoginUser() {}
  updateLoginUser() {}
  addLoginUser() {}

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
                name: "group_id",
                className: "select-fld",
                value: this.state.group_id,
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
                fieldName: "password",
                label: <AlgaehLabel label={{ fieldName: "password" }} />
              },
              {
                fieldName: "group_id",
                label: <AlgaehLabel label={{ fieldName: "group" }} />
                // displayTemplate: row => {
                //   return this.getDoctorName(row.provider_id);
                // },
                // editorTemplate: row => {
                //   return (
                //     <AlagehAutoComplete
                //       div={{ className: "col" }}
                //       selector={{
                //         name: "provider_id",
                //         className: "select-fld",
                //         value: row.provider_id,
                //         dataSource: {
                //           textField: "full_name",
                //           valueField: "employee_id",
                //           data: this.state.all_docs
                //         },
                //         others: {
                //           errormessage: "Doctor - cannot be blank",
                //           required: true
                //         },
                //         onChange: this.changeGridEditors.bind(this, row)
                //       }}
                //     />
                //   );
                // }
              },
              {
                fieldName: "role_id",
                label: <AlgaehLabel label={{ fieldName: "role" }} />
                //   displayTemplate: row => {
                //     return this.getRoomName(row.room_id);
                //   },
                //   editorTemplate: row => {
                //     return (
                //       <AlagehAutoComplete
                //         div={{ className: "col" }}
                //         selector={{
                //           name: "room_id",
                //           className: "select-fld",
                //           value: row.room_id,
                //           dataSource: {
                //             textField: "description",
                //             valueField: "hims_d_appointment_room_id",
                //             data: this.state.appointmentRooms
                //           },
                //           others: {
                //             errormessage: "Room - cannot be blank",
                //             required: true
                //           },
                //           onChange: this.changeGridEditors.bind(this, row)
                //         }}
                //       />
                //     );
                //   }
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
