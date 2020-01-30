import React, { Component } from "react";
import "./screen_assignment.scss";
import {
  AlgaehLabel,
  AlagehAutoComplete
  // AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import { swalMessage } from "../../../utils/algaehApiCall";
// import _ from "lodash";
import {
  ScreenAssignmentEvents,
  getRoleActiveModules,
  getComponentsForScreen
} from "./ScreenAssignmentEvents";
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
      assignedModules: [],
      components: [],
      selectedScreen: {}
    };

    // this.getGroups();
  }
  static contextType = MainContext;
  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    // const userMenu = this.context.userMenu;
    ScreenAssignmentEvents().getGroups(this);
    // this.setState({ modules: userMenu.filter(f => f.module_code !== "APM") });
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
    ScreenAssignmentEvents()
      .assignSelectedModules(this)
      .then(result => {
        const { success, message } = result;
        swalMessage({
          title: message,
          type: success === true ? "success" : "error"
        });
        this.onUpdateFunctionCall(this.state.role_id);
      })
      .catch(error => {
        swalMessage({
          title: error,
          type: "error"
        });
      });
  }

  clearState() {
    ScreenAssignmentEvents().clearState(this);
  }
  onSearchAllModules(e) {
    const value = e.target.value;
    let result = [];
    let userMenu = this.context.userMenu.filter(f => f.module_code !== "APM");
    if (value !== "") {
      result = userMenu.filter(f => {
        const screens = f.ScreenList.filter(
          s =>
            s.screen_name.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
            s.s_other_language.toLowerCase().indexOf(value.toLowerCase()) > -1
        );
        if (screens.length > 0) {
          return { ...f, ScreenList: screens };
        }
      });
    } else {
      result = userMenu;
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

  onUpdateFunctionCall(value) {
    let userMenu = this.context.userMenu.filter(f => f.module_code !== "APM");
    getRoleActiveModules(value)
      .then(result => {
        let selectedModules = {};
        result.forEach(item => {
          let screens = {};
          item.ScreenList.forEach(screen => {
            screens[screen.screen_code] = true;
          });
          selectedModules[item.module_code] = screens;
        });
        this.setState({
          selectedModules: selectedModules,
          modules: userMenu,
          role_id: value,
          assignedModules: result
        });
      })
      .catch(error => {
        swalMessage({
          title: error,
          type: "error"
        });
      });
  }

  onHandleChangeRoleId(e) {
    this.onUpdateFunctionCall(e.value);
  }
  onClickScreenToComponents(data, e) {
    getComponentsForScreen(data.screen_id)
      .then(result => {
        this.setState({ components: result, selectedScreen: data });
      })
      .catch(error => {
        swalMessage({
          title: error,
          type: "error"
        });
      });
  }

  render() {
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
              onChange: this.onHandleChangeRoleId.bind(this) //this.dropDownEvent.bind(this)
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
                        disabled={
                          this.state.modules.length === 0 ? true : false
                        }
                      />
                      {this.state.modules.length > 0 ? (
                        <ul className="mainmenu">
                          {this.state.modules.map((data, index) => {
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
                      ) : (
                        <p>No role is selected</p>
                      )}
                    </div>
                    <div className="actionLeftRight">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.assignScreens.bind(this)}
                      >
                        <AlgaehLabel label={{ forceLabel: "Update" }} />
                      </button>
                    </div>
                    <div className="moduleList list-group-check">
                      <ul className="mainmenu">
                        {this.state.assignedModules.map((data, index) => {
                          return (
                            <li key={data.module_id}>
                              <i className={data.icons + " fa-1x"}></i>{" "}
                              <b> {data.module_name}</b>
                              <ul className="submenu">
                                {data.ScreenList.map((sub_menu, index) => {
                                  return (
                                    <li
                                      key={sub_menu.screen_id}
                                      onClick={this.onClickScreenToComponents.bind(
                                        this,
                                        sub_menu
                                      )}
                                    >
                                      <i className="fas fa-arrow-circle-right fa-1x"></i>{" "}
                                      {sub_menu.screen_name}
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
                  <h3 className="caption-subject">
                    Define Permissions{" "}
                    <b>'{this.state.selectedScreen.screen_name}'</b>
                  </h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12">
                    <div className="row">
                      <table>
                        <thead>
                          <tr>
                            <th>Component</th>
                            <th>Permission</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.components.map(item => (
                            <tr key={item.algaeh_d_app_component_id}>
                              <td>{item.component_name}</td>
                              <td colSpan="2">
                                <Checkbox>Read</Checkbox>
                                <Checkbox>Write</Checkbox>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
