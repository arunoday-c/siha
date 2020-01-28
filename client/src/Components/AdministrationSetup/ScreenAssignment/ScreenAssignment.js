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
import { MainContext } from "algaeh-react-components/context";
import { Checkbox } from "algaeh-react-components";
class ScreenAssignment extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      roles: [],
      modules: [],
      selectedText: "",
      app_group_id: null,
      role_id: null,
      selectedModules: {},
      assignedModules: []
    };

    // this.getGroups();
  }
  static contextType = MainContext;
  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    const userMenu = this.context.userMenu;
    ScreenAssignmentEvents().getGroups(this);
    this.setState({ modules: userMenu });
    // ScreenAssignmentEvents().getRoleBaseActiveModules(this);
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
    // ScreenAssignmentEvents().assignScreens(this);
    ScreenAssignmentEvents().assignSelectedModules(this);
  }

  clearState() {
    ScreenAssignmentEvents().clearState(this);
  }
  onSearchAllModules(e) {
    const value = e.target.value;
    let result = [];
    if (value !== "") {
      result = this.context.userMenu.filter(f => {
        const screens = f.ScreenList.filter(
          s =>
            s.screen_name.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
            s.s_other_language.toLowerCase().indexOf(value.toLowerCase()) > -1
        );
        if (screens.length > 0) {
          return { ...f, ScreenList: screens };
        }
      });
    }
    this.setState({
      modules: result,
      selectedText: value
    });
  }
  checkModuleSelector(sub_menu, e) {
    const checked = e.target.checked;
    let existingModules = this.state.selectedModules;
    if (checked === false) {
      delete existingModules[sub_menu.module_code][sub_menu.screen_code];
      this.setState({ selectedModules: { ...existingModules } });
      return;
    }
    let screens = existingModules[sub_menu.module_code];
    existingModules[sub_menu.module_code] = {
      ...screens,
      [sub_menu.screen_code]: true
    };

    this.setState({ selectedModules: { ...existingModules } });
  }
  checkAllModuleWise(data, e) {
    const checked = e.target.checked;
    let existingModules = this.state.selectedModules;
    if (checked === false) {
      delete existingModules[data.module_code];
      this.setState({ selectedModules: { ...existingModules } });
      return;
    }

    let newScreens = {};
    for (let i = 0; i < data.ScreenList.length; i++) {
      newScreens[data.ScreenList[i].screen_code] = true;
    }
    existingModules[data.module_code] = newScreens;
    this.setState({ selectedModules: { ...existingModules } });
  }
  render() {
    const userMenuList =
      this.state.selectedText !== ""
        ? this.state.modules
        : this.context.userMenu;
    return (
      <div className="screen_assignment">
        <div className="row inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col-2 mandatory form-group" }}
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
              onChange: this.dropDownEvent.bind(this)
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col-2 mandatory form-group" }}
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
          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Define Module/Screen</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12">
                    <div className="moduleList list-group-check">
                      <input
                        type="text"
                        className="moduleSearchInput"
                        placeholder="Search Module"
                        onChange={this.onSearchAllModules.bind(this)}
                      />

                      <ul className="mainmenu">
                        {userMenuList.map((data, index) => {
                          const allModules =
                            this.state.selectedModules[data.module_code] !==
                            undefined
                              ? Object.keys(
                                  this.state.selectedModules[data.module_code]
                                ).length
                              : 0;
                          const checked =
                            allModules > 0 &&
                            allModules < data.ScreenList.length
                              ? { indeterminate: true, checked: false }
                              : allModules === data.ScreenList.length
                              ? { checked: true, indeterminate: false }
                              : { checked: false, indeterminate: false };
                          return (
                            <li key={data.module_id}>
                              <Checkbox
                                onChange={this.checkAllModuleWise.bind(
                                  this,
                                  data
                                )}
                                checked={checked.checked}
                                indeterminate={checked.indeterminate}
                              >
                                {data.module_name}
                              </Checkbox>

                              <ul className="submenu">
                                {data.ScreenList.map((sub_menu, index) => {
                                  const isChecked =
                                    this.state.selectedModules[
                                      data.module_code
                                    ] !== undefined
                                      ? this.state.selectedModules[
                                          data.module_code
                                        ][sub_menu.screen_code]
                                      : false;
                                  return (
                                    <li key={sub_menu.screen_id}>
                                      <Checkbox
                                        onChange={this.checkModuleSelector.bind(
                                          this,
                                          sub_menu
                                        )}
                                        checked={isChecked}
                                      >
                                        {sub_menu.screen_name}
                                      </Checkbox>
                                    </li>
                                  );
                                })}
                              </ul>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="actionLeftRight">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.assignScreens.bind(this)}
                      >
                        <AlgaehLabel label={{ forceLabel: ">>" }} />
                      </button>{" "}
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.assignScreens.bind(this)}
                      >
                        <AlgaehLabel label={{ forceLabel: "<<" }} />
                      </button>
                    </div>
                    <div className="moduleList list-group-check">
                      <ul className="mainmenu">
                        {this.state.assignedModules.map((data, index) => {
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
                  <div className="col-12">
                    <div className="row margin-top-15">
                      {" "}
                      <AlagehAutoComplete
                        div={{ className: "col-6 mandatory form-group" }}
                        label={{
                          forceLabel: "Assign Landing Screen",
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
                          onChange: this.dropDownEvent.bind(this),
                          others: {}
                        }}
                      />
                      <div className="col">
                        {" "}
                        <button
                          type="button"
                          className="btn btn-default"
                          onClick={this.clearState.bind(this)}
                          style={{ marginTop: 19 }}
                        >
                          <AlgaehLabel label={{ forceLabel: "Save" }} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* <div className="col-5"></div> */}
                </div>
              </div>
            </div>
          </div>{" "}
          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Define Permissions</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-3 mandatory form-group" }}
                        label={{
                          forceLabel: "Select Modules",
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
                          onChange: this.dropDownEvent.bind(this),
                          others: {}
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-3 mandatory form-group" }}
                        label={{
                          forceLabel: "Select Sub Modules",
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
                          onChange: this.dropDownEvent.bind(this),
                          others: {}
                        }}
                      />
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
