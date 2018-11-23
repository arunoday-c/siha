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
              div={{ className: "col-lg-2" }}
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
              div={{ className: "col-lg-2" }}
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
              div={{ className: "col-lg-2" }}
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

            <AlagehAutoComplete
              div={{ className: "col-lg-2" }}
              label={{
                fieldName: "group",
                isImp: true
              }}
              selector={{
                name: "group_id",
                className: "select-fld",
                value: this.state.group_id,
                dataSource: {
                  textField: "sub_department_name",
                  valueField: "sub_department_id",
                  data: this.state.groups
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-2" }}
              label={{
                fieldName: "role",
                isImp: true
              }}
              selector={{
                name: "role_id",
                className: "select-fld",
                value: this.state.role_id,
                dataSource: {
                  textField: "full_name",
                  valueField: "employee_id",
                  data: this.state.roles
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />

            <div className="col-lg-2">
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
                fieldName: "user_name",
                label: <AlgaehLabel label={{ fieldName: "description" }} />
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
