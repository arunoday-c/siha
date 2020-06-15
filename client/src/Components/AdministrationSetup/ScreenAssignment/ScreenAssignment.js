import React, { Component } from "react";
import "./screen_assignment.scss";
import { AlgaehLabel, AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
import { swalMessage } from "../../../utils/algaehApiCall";
import {
  ScreenAssignmentEvents,
  getComponentsForScreen,
  assignLandingPage,
  updateScreenElementRoles,
} from "./ScreenAssignmentEvents";
import { MainContext } from "algaeh-react-components/context";
import { Checkbox, Button } from "algaeh-react-components";
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
      loading_update_element: false,
      checkAll: false,
      filterArray: [],
      searchText: "",
      filterArrayRoles: [],
      searchRollText: "",
      checkAllRoles: false,
      checkAllIntermediate: undefined,
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
    const value = e.target.value.toLowerCase();
    if (value === "") {
      this.setState({ filterArray: [], searchText: e.target.value });
    }
    const filterd = this.state.ScreenList.filter((f) =>
      f.screen_name.toLowerCase().includes(value)
    );
    this.setState({ filterArray: filterd, searchText: e.target.value });
  }
  onSearchRoles(e) {
    const value = e.target.value.toLowerCase();
    if (value === "") {
      this.setState({ filterArrayRoles: [], searchRollText: e.target.value });
    }

    const filterd = this.state.assignedScreenElements.filter((f) => {
      debugger;
      return f.screen_name.toLowerCase().includes(value);
    });

    this.setState({
      filterArrayRoles: filterd,
      searchRollText: e.target.value,
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
      [sub_menu.component_code]: true,
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
      .then((result) => {
        this.setState({ components: result, selectedScreen: data });
      })
      .catch((error) => {
        swalMessage({
          title: error,
          type: "error",
        });
      });
  }

  onClickElementClick(data, e) {
    const { checked } = e.target;
    data.checked = checked;
  }
  selectAll(e) {
    const status = e.target.checked;
    const allScreeList = this.state.ScreenList.map((data, index) => {
      const allComponentList = data.componentList.map((sub_menu, index) => {
        return {
          ...sub_menu,
          checked: status,
        };
      });
      return {
        ...data,
        checked: status,
        componentList: allComponentList,
        // indeterminate: false,
      };
    });

    this.setState({
      // dummyValue: !this.state.dummyValue,
      ScreenList: allScreeList,
      checkAll: status,

      // checkAllIntermediate: false,
    });
  }

  render() {
    const assignedScreens =
      this.state.searchText !== "" && this.state.filterArray.length === 0
        ? this.state.filterArray
        : this.state.searchText === "" && this.state.filterArray.length === 0
        ? this.state.ScreenList
        : this.state.filterArray;
    const assignedRoles =
      this.state.searchRollText !== "" &&
      this.state.filterArrayRoles.length === 0
        ? this.state.filterArrayRoles
        : this.state.searchRollText === "" &&
          this.state.filterArrayRoles.length === 0
        ? this.state.assignedScreenElements
        : this.state.filterArrayRoles;
    return (
      <div className="screen_assignment">
        <div className="row inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col-3 mandatory form-group" }}
            label={{ forceLabel: "Select a Group", isImp: true }}
            selector={{
              name: "app_group_id",
              className: "select-fld",
              value: this.state.app_group_id,
              dataSource: {
                textField: "app_group_name",
                valueField: "algaeh_d_app_group_id",
                data: this.state.groups,
              },
              onChange: this.dropDownEvent.bind(this),
              onClear: () => {
                this.setState({
                  app_group_id: null,
                  role_id: null,
                  module_id: null,
                  roles: [],
                  ScreenList: [],
                });
              },
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-3 mandatory form-group" }}
            label={{ forceLabel: "Select a Role", isImp: true }}
            selector={{
              name: "role_id",
              className: "select-fld",
              value: this.state.role_id,
              dataSource: {
                textField: "role_name",
                valueField: "app_d_app_roles_id",
                data: this.state.roles,
              },
              onChange: this.dropDownEvent.bind(this),
              onClear: () => {
                this.setState({
                  role_id: null,
                  module_id: null,
                  ScreenList: [],
                  filterArray: [],
                  searchText: "",
                  searchRollText: "",
                });
              },
            }}
          />{" "}
          <AlagehAutoComplete
            div={{ className: "col-4 mandatory form-group" }}
            label={{ forceLabel: "Select Module", isImp: true }}
            selector={{
              name: "module_id",
              className: "select-fld",
              value: this.state.module_id,
              dataSource: {
                textField: "module_name",
                valueField: "algaeh_d_module_id",
                data: this.state.algaeh_modules,
              },
              onChange: this.dropDownEvent.bind(this),
              onClear: () => {
                this.setState({
                  module_id: null,
                  ScreenList: [],
                  selectAll: false,
                });
              },
            }}
          />
          <div className="col">
            {" "}
            <button
              type="button"
              style={{ marginTop: 19 }}
              className="btn btn-default"
              onClick={this.clearState.bind(this)}
            >
              <AlgaehLabel label={{ forceLabel: "Clear" }} />
            </button>
          </div>
        </div>{" "}
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body">
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col-10 mandatory" }}
                label={{
                  forceLabel: "Assign Landing Screen",
                  isImp: true,
                }}
                selector={{
                  name: "landing_page",
                  className: "select-fld",
                  value: this.state.landing_page,
                  dataSource: {
                    textField: "screen_name",
                    valueField: "algaeh_app_screens_id",
                    data: this.state.assignedScrens,
                  },
                  onChange: this.dropDownEvent.bind(this),
                }}
              />
              <div className="col-2">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={assignLandingPage.bind(this)}
                  style={{ marginTop: 19 }}
                >
                  <AlgaehLabel label={{ forceLabel: "Apply" }} />
                </button>
              </div>
            </div>
          </div>
        </div>
        {this.state.ScreenList.length > 0 ? (
          <div className="row">
            <div className="col-6">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">
                      Define Screen/Components
                    </h3>
                  </div>
                  <div className="actions">
                    <div className="col">
                      <Checkbox
                        className="selectAllCheck"
                        checked={this.state.checkAll}
                        onChange={this.selectAll.bind(this)}
                        indeterminate={this.state.checkAllIntermediate}
                      >
                        Select All
                      </Checkbox>
                    </div>
                  </div>
                </div>

                <div className="portlet-body">
                  <div className="row">
                    <div className="col-12">
                      <div className="moduleList list-group-check">
                        <input
                          type="text"
                          className="moduleSearchInput"
                          placeholder="Search Screen/Components"
                          onChange={this.onSearchAllModules.bind(this)}
                          disabled={
                            this.state.ScreenList.length === 0 ? true : false
                          }
                        />

                        <ul className="mainmenu">
                          {assignedScreens.map((data, index) => {
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
                      </div>
                    </div>

                    <div className="col-12" style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn btn-primary margin-top-15"
                        onClick={this.assignScreens.bind(this)}
                      >
                        <AlgaehLabel label={{ forceLabel: "Assign" }} />
                      </button>
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
                  </div>{" "}
                  {/* <div className="actions">
                    <div className="col">
                      <Checkbox
                        className="selectAllCheck"
                        checked={this.state.checkAllRoles}
                        onChange={this.selectAllRoles.bind(this)}
                        // indeterminate={this.state.checkAllIntermediate}
                      >
                        Select All
                      </Checkbox>
                    </div>
                  </div> */}
                </div>
                <div className="portlet-body">
                  <div className="row">
                    {" "}
                    <div className="col-12">
                      <div className="moduleList list-group-check">
                        <input
                          type="text"
                          className="moduleSearchInput"
                          placeholder="Search Element Permissions"
                          onChange={this.onSearchRoles.bind(this)}
                          disabled={
                            this.state.ScreenList.length === 0 ? true : false
                          }
                        />

                        <ul className="mainmenu">
                          {assignedRoles.map((element) => {
                            const {
                              algaeh_app_screens_id,
                              screen_name,
                              component,
                            } = element;

                            return (
                              <li key={algaeh_app_screens_id}>
                                <label className="mainHeader">
                                  <span> {screen_name}</span>
                                </label>
                                <ul className="submenu">
                                  {component.map((comp) => {
                                    const {
                                      component_name,
                                      component_code,
                                      elements,
                                    } = comp;
                                    return (
                                      <li key={component_code}>
                                        <label className="subHeader">
                                          <span> {component_name}</span>
                                        </label>
                                        <ul className="submenu">
                                          {elements.map((items) => {
                                            const {
                                              algaeh_d_app_scrn_elements_id,
                                              screen_element_name,
                                              stages,
                                              checked,
                                            } = items;
                                            return (
                                              <React.Fragment
                                                key={
                                                  algaeh_d_app_scrn_elements_id
                                                }
                                              >
                                                {stages.length === 0 ? (
                                                  <li>
                                                    <Checkbox
                                                      checked={checked}
                                                      onChange={this.onClickElementClick.bind(
                                                        this,
                                                        items
                                                      )}
                                                    >
                                                      {screen_element_name}
                                                    </Checkbox>
                                                  </li>
                                                ) : (
                                                  <React.Fragment>
                                                    {stages.map((stage) => {
                                                      const {
                                                        checked,
                                                        value,
                                                        text,
                                                      } = stage;
                                                      return (
                                                        <li key={value}>
                                                          <Checkbox
                                                            checked={checked}
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
                                                  </React.Fragment>
                                                )}
                                              </React.Fragment>
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
                      </div>
                    </div>
                    <div className="col-12" style={{ textAlign: "right" }}>
                      <Button
                        className="btn btn-primary margin-top-15"
                        loading={this.state.loading_update_element}
                        onClick={updateScreenElementRoles.bind(this)}
                      >
                        Assign
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="selectGroupRole">
            {" "}
            <h5>Select a Group & Role</h5>
            <p>To the define Screens/Component/Element/Authorizations</p>
          </div>
        )}
      </div>
    );
  }
}

export default ScreenAssignment;
