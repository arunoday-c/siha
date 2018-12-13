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
        <div className="row">
          <div className="col-lg-4">
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col-12" }}
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
                div={{ className: "col-12" }}
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
          </div>
          <div className="col-lg-4">
            <h6>Modules</h6>
            <div className="moduleList list-group-check">
              <ul className="mainmenu">
                <li>
                  <input type="checkbox" />
                  <a>Home</a>
                </li>
                <li>
                  <input type="checkbox" />
                  <a>About</a>
                </li>
                <li>
                  <input type="checkbox" />
                  <a>Products</a>
                  <ul className="submenu">
                    <li>
                      <input type="checkbox" />
                      <a>Tops</a>
                    </li>
                    <li>
                      <input type="checkbox" />
                      <a>Bottoms</a>
                    </li>
                    <li>
                      <input type="checkbox" />
                      <a>Footwear</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <input type="checkbox" />
                  <a>Contact us</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4">2346987265</div>
          <div className="col-lg-12">
            <button className="btn btn-primary">SAVE</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ScreenAssignment;
