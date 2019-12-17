import React, { Component } from "react";
import "./screen_assignment.scss";
import {
  AlgaehLabel,
  AlagehAutoComplete
  // AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
// import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
// import _ from "lodash";
import ScreenAssignmentEvents from "./ScreenAssignmentEvents";

class ScreenAssignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      roles: [],
      modules: [],

      app_group_id: null,
      role_id: null
    };

    // this.getGroups();
    ScreenAssignmentEvents().getGroups(this);
    ScreenAssignmentEvents().getRoleBaseActiveModules(this);
  }

  dropDownEvent(value) {
    ScreenAssignmentEvents().dropDownHandler(this, value);
  }

  changeScreen(data, e) {
    ScreenAssignmentEvents().changeScreen(this, data, e);
  }

  changeModules(data, e) {
    ScreenAssignmentEvents().changeModules(this, data, e);
  }

  assignScreens() {
    ScreenAssignmentEvents().assignScreens(this);
  }

  clearState() {
    ScreenAssignmentEvents().clearState(this);
  }
  render() {
    return (
      <div className="screen_assignment">
        <div className="row inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col-2 form-group" }}
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
              onChange: this.dropDownEvent.bind(this),
              others: {}
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col-2 form-group" }}
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
              onChange: this.dropDownEvent.bind(this)
            }}
          />
        </div>
        <div className="row">
          <div className="col-12">
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
                        {this.state.modules.map((data, index) => {
                          return (
                            <li key={data.module_id}>
                              <input
                                type="checkbox"
                                onChange={this.changeModules.bind(this, data)}
                                name="modules"
                                checked={
                                  data.checked === undefined
                                    ? false
                                    : data.checked
                                }
                                value={data.module_id}
                              />
                              <a>{data.module_name}</a>

                              <ul className="submenu">
                                {data.ScreenList.map((sub_menu, index) => {
                                  return (
                                    <li key={sub_menu.screen_id}>
                                      <input
                                        type="checkbox"
                                        onChange={this.changeScreen.bind(
                                          this,
                                          data
                                        )}
                                        checked={
                                          sub_menu.checked === undefined
                                            ? false
                                            : sub_menu.checked
                                        }
                                        value={sub_menu.screen_id}
                                      />
                                      <a>{sub_menu.screen_name}</a>
                                    </li>
                                  );
                                })}
                              </ul>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.assignScreens.bind(this)}
              >
                <AlgaehLabel label={{ forceLabel: "Assign" }} />
              </button>
              <button
                type="button"
                className="btn btn-default"
                onClick={this.clearState.bind(this)}
              >
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
