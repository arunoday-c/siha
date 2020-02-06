import React, { Component } from "react";
import "./screen_assignment.scss";
import {
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import { swalMessage } from "../../../utils/algaehApiCall";
import {
  ScreenAssignmentEvents,
  getComponentsForScreen,
} from "./ScreenAssignmentEvents";
import { MainContext } from "algaeh-react-components/context";
import { Checkbox, Radio, Button } from "algaeh-react-components";
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
      selectedScreen: {},
      assignedModules: [],
      components: [],
      dummy: false,
      update_loading: false,
      algaeh_modules: [],
      ScreenList: [],
      module_id: null
    };
  }

  static contextType = MainContext;
  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    ScreenAssignmentEvents().getGroups(this);
    ScreenAssignmentEvents().getModules(this);
  }

  dropDownEvent(value) {
    ScreenAssignmentEvents().dropDownHandler(this, value);
  }

  changeComponent(data, e) {
    ScreenAssignmentEvents().changeComponent(this, data, e);
  }

  changeScreen(data, e) {
    ScreenAssignmentEvents().changeScreen(this, data, e);
  }

  assignScreens() {
    // ScreenAssignmentEvents().assignScreens(this);
    ScreenAssignmentEvents()
      .assignSelectedScreen(this)
      .then(result => {
        const { success, message } = result;
        swalMessage({
          title: message,
          type: success === true ? "success" : "error"
        });
        // this.onUpdateFunctionCall(this.state.role_id);
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
  checkAllScreenWise(sub_menu, e) {

    const checked = e.target.checked;
    let existingModules = this.state.selectedScreen;
    if (checked === false) {
      delete existingModules[sub_menu.screen_code][sub_menu.component_code];
      this.setState({ selectedScreen: { ...existingModules } });
      return;
    }
    let screens = existingModules[sub_menu.screen_code];
    existingModules[sub_menu.screen_code] = {
      ...screens,
      [sub_menu.component_code]: true
    };

    this.setState({ selectedScreen: { ...existingModules } });
  }
  checkScreenSelector(data, e) {

    const checked = e.target.checked;
    let existingModules = this.state.selectedScreen;
    if (checked === false) {
      delete existingModules[data.screen_code];
      this.setState({ selectedScreen: { ...existingModules } });
      return;
    }

    let newScreens = {};
    for (let i = 0; i < data.componentList.length; i++) {
      newScreens[data.componentList[i].component_code] = true;
    }
    existingModules[data.screen_code] = newScreens;
    this.setState({ selectedScreen: { ...existingModules } });
  }

  // onUpdateFunctionCall(value) {
  //   let userMenu = this.context.userMenu.filter(f => f.screen_code !== "APM");
  //   getRoleActiveModules(value)
  //     .then(result => {
  //       let selectedScreen = {};
  //       result.forEach(item => {
  //         let screens = {};
  //         item.ScreenList.forEach(screen => {
  //           screens[screen.component_code] = true;
  //         });
  //         selectedScreen[item.screen_code] = screens;
  //       });
  //       this.setState({
  //         selectedScreen: selectedScreen,
  //         modules: userMenu,
  //         role_id: value,
  //         assignedModules: result
  //       });
  //     })
  //     .catch(error => {
  //       swalMessage({
  //         title: error,
  //         type: "error"
  //       });
  //     });
  // }

  onHandleChangeRoleId(e) {
    // this.onUpdateFunctionCall(e.value);
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
  // onClickUpdate() {
  //   const checkFilter = this.state.components.filter(
  //     f => f.view_privilege !== undefined
  //   );
  //   if (checkFilter.length === 0) {
  //     swalMessage({
  //       title: "There is no permission selected",
  //       type: "error"
  //     });
  //     return;
  //   }
  //   this.setState({ update_loading: true }, () => {
  //     assignComponentScreenPermissions({
  //       algaeh_m_screen_role_privilage_mapping_id: this.state.selectedScreen
  //         .algaeh_m_screen_role_privilage_mapping_id,
  //       compoment_list: checkFilter
  //     })
  //       .then(() => {
  //         this.setState({ update_loading: false });
  //         swalMessage({
  //           title: "Successfully done",
  //           type: "success"
  //         });
  //       })
  //       .catch(error => {
  //         this.setState({ update_loading: false });
  //         const { message } = error.response.data;
  //         swalMessage({
  //           title: message,
  //           type: "error"
  //         });
  //       });
  //   });
  // }
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
              onChange: this.dropDownEvent.bind(this)
            }}
          />
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Define Screen/Components</h3>
                </div>
              </div>
              <div className="row margin-top-15">
                <AlagehAutoComplete
                  div={{ className: "col-5 mandatory form-group" }}
                  label={{ forceLabel: "Select Module", isImp: true }}
                  selector={{
                    name: "module_id",
                    className: "select-fld",
                    value: this.state.module_id,
                    dataSource: {
                      textField: "module_name",
                      valueField: "algaeh_d_module_id",
                      data: this.state.algaeh_modules
                    },
                    onChange: this.dropDownEvent.bind(this)
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-5 mandatory form-group" }}
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
                          this.state.ScreenList.length === 0 ? true : false
                        }
                      />
                      {this.state.ScreenList.length > 0 ? (
                        <ul className="mainmenu">
                          {this.state.ScreenList.map((data, index) => {
                            return (
                              <li key={data.module_id}>
                                <Checkbox
                                  onChange={this.changeScreen.bind(
                                    this,
                                    data
                                  )}
                                  checked={
                                    data.checked === undefined
                                      ? false
                                      : data.checked
                                  }
                                  value={data.algaeh_app_screens_id}
                                // indeterminate={checked.indeterminate}
                                >
                                  {data.screen_name}
                                </Checkbox>

                                <ul className="submenu">
                                  {data.componentList.map((sub_menu, index) => {
                                    return (
                                      <li key={sub_menu.screen_id}>
                                        <Checkbox
                                          onChange={this.changeComponent.bind(
                                            this,
                                            data
                                          )}
                                          checked={
                                            sub_menu.checked === undefined
                                              ? false
                                              : sub_menu.checked
                                          }
                                          value={sub_menu.algaeh_d_app_component_id}
                                        >
                                          {sub_menu.component_name}
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
                        <AlgaehLabel label={{ forceLabel: "Assign" }} />
                      </button>
                    </div>
                    {/* <div className="moduleList list-group-check">
                      <ul className="mainmenu">
                        {this.state.assignedModules.map((data, index) => {
                          return (
                            <li key={data.module_id}>
                              <i className={data.icons + " fa-1x"}></i>
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
                                      <i className="fas fa-arrow-circle-right fa-1x"></i>
                                      {sub_menu.screen_name}
                                    </li>
                                  );
                                })}
                              </ul>
                            </li>
                          );
                        })}
                      </ul>
                    </div> */}
                  </div>
                  {/* <div className="col-12">
                    <div className="row margin-top-15">
                      
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
                  </div> */}

                  {/* <div className="col-5"></div> */}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    Define Permissions
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
                                <Radio.Group
                                  onChange={e => {
                                    item.view_privilege = e.target.value;
                                    this.setState({ dummy: !this.state.dummy });
                                  }}
                                  value={item.view_privilege}
                                >
                                  <Radio value="H">Hide</Radio>
                                  <Radio value="D">Disabled</Radio>
                                </Radio.Group>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <Button
                        type="primary"
                        loading={this.state.update_loading}
                        onClick={this.onClickUpdate.bind(this)}
                      >
                        
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
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
