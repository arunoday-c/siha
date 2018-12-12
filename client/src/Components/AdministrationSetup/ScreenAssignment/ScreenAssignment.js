import React, { Component } from "react";
import "./screen_assignment.css";
import { AlgaehLabel, AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

class ScreenAssignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      roles: []
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

  loadModulesandScreens() {}

  render() {
    return (
      <div className="screen_assignment">
        <div className="col-lg-12">
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
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
              div={{ className: "col-lg-3" }}
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

            {/* <div className="col">
              <button
                style={{ marginTop: 21 }}
                onClick={this.loadModulesandScreens.bind(this)}
                type="button"
                className="btn btn-primary"
              >
                <AlgaehLabel
                  label={{
                    forceLabel: "Load"
                  }}
                />
              </button>
            </div> */}
          </div>

          <div>
            <div>
              <span>General</span>
              <ul
                style={{
                  listStyle: "none"
                }}
              >
                <li>
                  <div className="row">
                    <input type="checkbox" />
                    <span>DASHBOARD </span>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <span>Settings</span>
              <ul
                style={{
                  listStyle: "none"
                }}
              >
                <li>
                  <div className="row">
                    <input type="checkbox" />
                    <span>DASHBOARD </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <button className="btn btn-primary">SAVE</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ScreenAssignment;
