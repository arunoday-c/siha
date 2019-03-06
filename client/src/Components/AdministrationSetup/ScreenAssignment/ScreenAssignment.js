import React, { Component } from "react";
import "./screen_assignment.css";
import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

class ScreenAssignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      roles: [],
      modules: [],
      op_modules: []
    };
    this.getGroups();
    this.getRoleBaseActiveModules();
  }

  getRoleBaseActiveModules() {
    algaehApiCall({
      uri: "/algaehMasters/getRoleBaseActiveModules",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            modules: res.data.records
          });
          console.log("Records:", res.data.records);
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
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

  changeModules(e) {
    let val = parseInt(e.target.value, 10);

    this.state.op_modules.includes(val)
      ? this.state.op_modules.pop(val)
      : this.state.op_modules.push(val);

    this.setState(...this.state);
  }

  render() {
    return (
      <div className="screen_assignment">
        <div className="row">
          <div className="col-4">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-12 form-group" }}
                    label={{ forceLabel: "Select a Group", isImp: true }}
                    selector={{
                      name: "app_group_id",
                      className: "select-fld",
                      value: this.state.app_group_id,
                      dataSource: {
                        textField: "app_group_name",
                        valueField: "algaeh_d_app_group_id",
                        data: this.state.groups
                      },
                      onChange: this.dropDownHandler.bind(this),
                      others: {}
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-12 form-group" }}
                    label={{ forceLabel: "Select a Role", isImp: true }}
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
                </div>
              </div>
            </div>
          </div>

          <div className="col-8">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Define Module/Screen</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col">
                    <div className="moduleList list-group-check">
                      <ul className="mainmenu" style={{ minHeight: "59vh" }}>
                        {this.state.modules.map((data, index) => (
                          <li key={data.algaeh_d_module_id}>
                            <input
                              type="checkbox"
                              onChange={this.changeModules.bind(this)}
                              name="modules"
                              checked={this.state.op_modules.includes(
                                data.algaeh_d_module_id
                              )}
                              value={data.algaeh_d_module_id}
                            />
                            <a>{data.module_name}</a>

                            <ul className="submenu">
                              {data.ScreenList.map((sub_menu, index) => (
                                <li key={sub_menu.algaeh_app_screens_id}>
                                  <input type="checkbox" />
                                  <a>{sub_menu.screen_name}</a>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button type="button" className="btn btn-primary">
                <AlgaehLabel label={{ forceLabel: "Assign" }} />
              </button>
              <button type="button" className="btn btn-default">
                <AlgaehLabel label={{ forceLabel: "Clear" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ScreenAssignment;
