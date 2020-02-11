import React, { Component } from "react";
import "./screen_assignment.scss";
import { AlgaehLabel, AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
import { swalMessage } from "../../../utils/algaehApiCall";
import {
  ScreenAssignmentEvents,
  getComponentsForScreen,
  assignLandingPage,
  updateScreenElementRoles
} from "./ScreenAssignmentEvents";
import { MainContext } from "algaeh-react-components/context";
import { Checkbox, Radio, Button } from "algaeh-react-components";
class ScreenAssignment extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      algaeh_m_module_role_privilage_mapping_id: null,
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
      module_id: null,
      assignedScrens: [],
      landing_page: undefined,
      assignedScreenElements: [],
      loading_update_element: false
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
  changeElement(data, e) {
    ScreenAssignmentEvents().changeElement(this, data, e);
  }

  changeScreen(data, e) {
    ScreenAssignmentEvents().changeScreen(this, data, e);
  }

  assignScreens() {
    ScreenAssignmentEvents().assignSelectedScreen(this);
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
        } else {
          return false;
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

  onClickElementClick(data, e) {
    const { checked } = e.target;
    data.checked = checked;
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
                    name: "landing_page",
                    className: "select-fld",
                    value: this.state.landing_page,
                    dataSource: {
                      textField: "screen_name",
                      valueField: "algaeh_app_screens_id",
                      data: this.state.assignedScrens
                    },
                    onChange: this.dropDownEvent.bind(this)
                  }}
                />
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={assignLandingPage.bind(this)}
                    style={{ marginTop: 19 }}
                  >
                    <AlgaehLabel label={{ forceLabel: "Set Landing Page" }} />
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
                                  onChange={this.changeScreen.bind(this, data)}
                                  checked={
                                    data.checked === undefined
                                      ? false
                                      : data.checked
                                  }
                                  value={data.algaeh_app_screens_id}
                                  indeterminate={data.indeterminate}
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
                                          value={
                                            sub_menu.algaeh_d_app_component_id
                                          }
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    Define Element Permissions for Role
                  </h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <ul className="mainmenu">
                    {this.state.assignedScreenElements.map(element => {
                      const {
                        algaeh_app_screens_id,
                        screen_name,
                        component
                      } = element;
                      return (
                        <li key={algaeh_app_screens_id}>
                          <b>{screen_name}</b>
                          <ul className="submenu">
                            {component.map(comp => {
                              const {
                                component_name,
                                component_code,
                                elements
                              } = comp;
                              return (
                                <li key={component_code}>
                                  {component_name}
                                  <ul className="submenu">
                                    {elements.map(items => {
                                      const {
                                        algaeh_d_app_scrn_elements_id,
                                        screen_element_name,
                                        stages,
                                        checked
                                      } = items;
                                      return (
                                        <li key={algaeh_d_app_scrn_elements_id}>
                                          {stages.length === 0 ? (
                                            <Checkbox
                                              defaultChecked={checked}
                                              onChange={this.onClickElementClick.bind(
                                                this,
                                                items
                                              )}
                                            >
                                              {screen_element_name}
                                            </Checkbox>
                                          ) : (
                                            <ul className="submenu">
                                              {stages.map(stage => {
                                                const {
                                                  checked,
                                                  value,
                                                  text
                                                } = stage;
                                                return (
                                                  <li key={value}>
                                                    <Checkbox
                                                      defaultChecked={checked}
                                                      onChange={this.onClickElementClick.bind(
                                                        this,
                                                        stage
                                                      )}
                                                    >
                                                      {text}
                                                    </Checkbox>
                                                  </li>
                                                );
                                              })}
                                            </ul>
                                          )}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                  <Button
                    className="btn btn-primary"
                    loading={this.state.loading_update_element}
                    onClick={updateScreenElementRoles.bind(this)}
                  >
                    Update Elements
                  </Button>
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
