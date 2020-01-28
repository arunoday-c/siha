import React, { Component } from "react";
import "./screen_elements.scss";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehTreeSearch } from "algaeh-react-components";
class ScreenElements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      components: [],
      screen_elements: [],
      selected_component: null
    };
    this.getComponents();
    this.getScreenElements();
  }

  getScreenElements() {
    algaehApiCall({
      uri: "/algaehMasters/getAlgaehScreenElement",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            screen_elements: response.data.records
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  getComponents() {
    algaehApiCall({
      uri: "/algaehMasters/getAlgaehComponentsWithScreens",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            components: response.data.records
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  addScreenElements() {
    const component_id = this.state.selected_component.split("-");
    algaehApiCall({
      uri: "/algaehMasters/addAlgaehScreenElement",
      method: "POST",
      data: {
        screen_element_code: this.state.screen_element_code,
        screen_element_name: this.state.screen_element_name,
        component_id: component_id[2]
      },
      onSuccess: response => {
        if (response.data.success) {
          this.getScreenElements();
          this.clearState();
          swalMessage({
            title: "Records Added Successfully",
            type: "success"
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  clearState() {
    this.setState({
      screen_element_code: "",
      screen_element_name: "",
      component_id: null
    });
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  deleteScreenElements() {}
  updateScreenElements() {}

  render() {
    return (
      <div className="screen_elements">
        <div className="row inner-top-search margin-bottom-15">
          <AlgaehTreeSearch
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Component",
              isImp: true
            }}
            tree={{
              treeDefaultExpandAll: true,
              data: this.state.components,
              textField: "label",
              showLine: true,
              valueField: node => {
                if (
                  node.algaeh_d_app_component_id !== null &&
                  node.algaeh_d_app_component_id !== undefined
                ) {
                  return `${node.algaeh_d_module_id}-${node.algaeh_app_screens_id}-${node.algaeh_d_app_component_id}`;
                } else if (
                  node.algaeh_d_module_id !== null &&
                  node.algaeh_d_module_id !== undefined
                ) {
                  return `${node.algaeh_d_module_id}-${node.module_code}`;
                } else if (
                  node.algaeh_app_screens_id !== null &&
                  node.algaeh_app_screens_id !== undefined
                ) {
                  return `${node.algaeh_app_screens_id}-${node.screen_code}`;
                }
              },
              onChange: (value, lable) => {
                // const seleted = value.split("-");
                this.setState({ selected_component: value });
              },
              value: this.state.selected_component
            }}
          />
          {/* <AlagehAutoComplete
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Component",
              isImp: true
            }}
            selector={{
              name: "component_id",
              className: "select-fld",
              value: this.state.component_id,
              dataSource: {
                textField: "component_name",
                valueField: "algaeh_d_app_component_id",
                data: this.state.components
              },
              onChange: this.dropDownHandle.bind(this)
            }}
          /> */}

          <AlagehFormGroup
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Screen Element Code",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "screen_element_code",
              value: this.state.screen_element_code,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col-3 mandatory form-group" }}
            label={{
              forceLabel: "Screen Element Name",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "screen_element_name",
              value: this.state.screen_element_name,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />

          <div className="col">
            <button
              type="submit"
              style={{ marginTop: 19 }}
              onClick={this.addScreenElements.bind(this)}
              className="btn btn-primary"
            >
              Add to List
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Lists of Modules</h3>
                </div>
                <div className="actions"></div>
              </div>

              <div className="portlet-body">
                <div className="row">
                  <div
                    className="col-12"
                    data-validate="screenElementDiv"
                    id="algaehGrid_Cntr"
                  >
                    <AlgaehDataGrid
                      id="shift-grid"
                      datavalidate="data-validate='screenElementDiv'"
                      columns={[
                        {
                          fieldName: "screen_element_code",
                          label: "Screen Element Code"
                        },
                        {
                          fieldName: "screen_element_name",
                          label: "Screen Element Name"
                        },
                        {
                          fieldName: "component_name",
                          label: "Component"
                        }
                      ]}
                      keyId="algaeh_d_module_id"
                      dataSource={{
                        data: this.state.screen_elements
                      }}
                      filter={true}
                      isEditable={false}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onEdit: () => {},
                        onDelete: this.deleteScreenElements.bind(this),
                        onDone: this.updateScreenElements.bind(this)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ScreenElements;
