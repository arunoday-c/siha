import React, { Component } from "react";
import "./components.scss";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehTreeSearch } from "algaeh-react-components";
import GlobalVariables from "../../../utils/GlobalVariables.json";

class Components extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screens: [],
      selected_screen: null
    };
    this.getComponents();
    this.getScreens();
  }

  getScreens() {
    algaehApiCall({
      uri: "/algaehMasters/getAlgaehScreensWithModules",
      method: "GET",
      onSuccess: response => {
        const { success, records } = response.data;
        if (success) {
          this.setState({
            screens: records
          });
        }
      },
      onCatch: error => {
        console.error(error);
        const { message } = error.response.data;
        swalMessage({
          title: message,
          type: "error"
        });
      }
    });

    // algaehApiCall({
    //   uri: "/algaehMasters/getAlgaehScreens",
    //   method: "GET",
    //   onSuccess: response => {
    //     if (response.data.success) {
    //       this.setState({
    //         screens: response.data.records
    //       });
    //     }
    //   },
    //   onError: error => {
    //     swalMessage({
    //       title: error.message,
    //       type: "error"
    //     });
    //   }
    // });
  }
  getComponents() {
    algaehApiCall({
      uri: "/algaehMasters/getAlgaehComponents",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            components: response.data.records
          });
        }
      },
      onCatch: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  addComponents() {
    const screen_id = this.state.selected_screen.split("-");
    algaehApiCall({
      uri: "/algaehMasters/addAlgaehComponent",
      method: "POST",
      data: {
        screen_id: screen_id[1],
        component_code: this.state.component_code,
        component_name: this.state.component_name
      },
      onSuccess: response => {
        if (response.data.success) {
          this.getComponents();
          this.clearState();
          swalMessage({
            title: "Records added successfully",
            type: "success"
          });
        }
      },
      onCatch: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  clearState() {
    this.setState({
      screen_id: null,
      component_code: "",
      component_name: ""
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

  deleteComponents() { }
  updateComponents(row) {

    algaehApiCall({
      uri: "/algaehMasters/updateAlgaehComponent",
      method: "PUT",
      data: row,
      onSuccess: response => {
        if (response.data.success) {
          this.getComponents();
          this.clearState();
          swalMessage({
            title: "Records Updated successfully",
            type: "success"
          });
        }
      },
      onCatch: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  render() {
    return (
      <div className="components">
        <div className="row inner-top-search margin-bottom-15">
          <AlgaehTreeSearch
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Screen",
              isImp: true
            }}
            tree={{
              treeDefaultExpandAll: true,
              data: this.state.screens,
              textField: "label",
              showLine: true,
              valueField: node => {
                if (
                  node["algaeh_app_screens_id"] !== null ||
                  node["algaeh_app_screens_id"] !== undefined
                ) {
                  return `${node["algaeh_d_module_id"]}-${node["algaeh_app_screens_id"]}`;
                }
                return `${node["algaeh_d_module_id"]}`;
              },
              onChange: (value, lable) => {
                // const seleted = value.split("-");
                this.setState({ selected_screen: value });
              },
              value: this.state.selected_screen
            }}
          />
          {/* <AlagehAutoComplete
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Screen",
              isImp: true
            }}
            selector={{
              name: "screen_id",
              className: "select-fld",
              value: this.state.screen_id,
              dataSource: {
                textField: "screen_name",
                valueField: "algaeh_app_screens_id",
                data: this.state.screens
              },
              onChange: this.dropDownHandle.bind(this)
            }}
          /> */}
          <AlagehFormGroup
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Component Code",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "component_code",
              value: this.state.component_code,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col-3 mandatory form-group" }}
            label={{
              forceLabel: "Component Name",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "component_name",
              value: this.state.component_name,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />

          <div className="col">
            <button
              type="submit"
              style={{ marginTop: 19 }}
              onClick={this.addComponents.bind(this)}
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
                  <h3 className="caption-subject">Lists of Component</h3>
                </div>
                <div className="actions"></div>
              </div>

              <div className="portlet-body">
                <div className="row">
                  <div className="col-12">
                    <div data-validate="shiftDiv" id="algaehGrid_Cntr">
                      <AlgaehDataGrid
                        id="shift-grid"
                        datavalidate="data-validate='shiftDiv'"
                        columns={[
                          {
                            fieldName: "screen_name",
                            label: "Screen",
                            others:
                              { disabled: true }
                          },
                          {
                            fieldName: "component_code",
                            label: "Component Code",
                            others:
                              { disabled: true }
                          },
                          {
                            fieldName: "component_name",
                            label: "Component Name",
                            others:
                              { disabled: true }
                          },
                          {
                            fieldName: "record_status",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Status" }} />
                            ),
                            displayTemplate: row => {
                              return (
                                <span>
                                  {row.record_status === "A"
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              );
                            },
                            editorTemplate: row => {
                              return (
                                <AlagehAutoComplete
                                  div={{ className: "col" }}
                                  selector={{
                                    name: "record_status",
                                    className: "select-fld",
                                    value: row.record_status,
                                    dataSource: {
                                      textField: "name",
                                      valueField: "value",
                                      data: GlobalVariables.FORMAT_STATUS
                                    },
                                    others: {
                                      errormessage: "Status - cannot be blank",
                                      required: true
                                    },
                                    onChange: this.changeGridEditors.bind(
                                      this,
                                      row
                                    )
                                  }}
                                />
                              );
                            }
                          }
                        ]}
                        keyId="algaeh_d_module_id"
                        dataSource={{
                          data: this.state.components
                        }}
                        filter={true}
                        isEditable={true}
                        actions={{
                          allowDelete: false
                        }}
                        paging={{ page: 0, rowsPerPage: 10 }}
                        events={{
                          onEdit: () => { },
                          onDelete: this.deleteComponents.bind(this),
                          onDone: this.updateComponents.bind(this)
                        }}
                      />
                    </div>
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

export default Components;
