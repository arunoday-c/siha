import React, { Component } from "react";
import "./modules.scss";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import GlobalVariables from "../../../utils/GlobalVariables.json";

class Modules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: []
    };
    this.getModules();
  }

  getModules() {
    algaehApiCall({
      uri: "/algaehMasters/getAlgaehModules",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            modules: response.data.records
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "success"
        });
      }
    });
  }

  deleteModules(row) {
    algaehApiCall({
      uri: "/algaehMasters/deleteAlgaehModule",
      method: "DELETE",
      data: { algaeh_d_module_id: row.algaeh_d_module_id },
      onSuccess: response => {
        const { message } = response.data;
        swalMessage({
          title: message,
          type: "success"
        });
        this.getModules();
      },
      onCatch: error => {
        const { message } = error.response.data;
        swalMessage({
          title: message,
          type: "error"
        });
      }
    });
  }

  clearState() {
    this.setState({
      module_code: "",
      module_name: "",
      licence_key: "",
      access_by: "",
      icons: "",
      other_language: "",
      display_order: ""
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

  addModules() {
    algaehApiCall({
      uri: "/algaehMasters/addAlgaehModule",
      method: "POST",
      data: {
        module_code: this.state.module_code,
        module_name: this.state.module_name,
        licence_key: this.state.licence_key,
        access_by: this.state.access_by,
        icons: "fas fa-" + this.state.icons,
        other_language: this.state.other_language,
        display_order: this.state.display_order
      },
      onSuccess: response => {
        if (response.data.success) {
          this.getModules();
          this.clearState();
          swalMessage({
            title: "Added Successfully",
            type: "success"
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "success"
        });
      }
    });
  }

  onchangegridcol(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  updateModules(data) {
    // console.log("data", data);
    algaehApiCall({
      uri: "/algaehMasters/updateAlgaehModules",
      method: "PUT",
      data: {
        algaeh_d_module_id: data.algaeh_d_module_id,
        // module_plan: data.module_plan,
        other_language: data.other_language,
        licence_key: data.licence_key,
        module_name: data.module_name,
        display_order: data.display_order,
        record_status: data.record_status
      },
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
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
  onTextChange(row, e) {
    row[e.target.name] = e.target.value;
    row.update();
  }
  render() {
    return (
      <div className="modules">
        <div className="row inner-top-search margin-bottom-15">
          <AlagehFormGroup
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              forceLabel: "Module Code",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "module_code",
              value: this.state.module_code,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col-3 form-group mandatory" }}
            label={{
              forceLabel: "Module Name",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "module_name",
              value: this.state.module_name,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col-3 form-group mandatory" }}
            label={{
              forceLabel: "Licence Key",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "licence_key",
              value: this.state.licence_key,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              forceLabel: "Icon name (Font-Awesome)",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "icons",
              value: this.state.icons,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />
          <span>
            <i className={"fas fa-" + this.state.icons}></i>
          </span>
          <AlagehFormGroup
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              forceLabel: "Other Language",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "other_language",
              value: this.state.other_language,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              forceLabel: "Access By"
            }}
            selector={{
              name: "access_by",
              className: "select-fld",
              value: this.state.access_by,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.ACCESS_BY
              },
              onChange: this.dropDownHandle.bind(this)
            }}
          />

          <AlagehFormGroup
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              forceLabel: "Display Order",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "display_order",
              value: this.state.display_order,
              events: {
                onChange: this.changeTexts.bind(this)
              },
              others: {
                type: "number"
              }
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col-2 form-group" }}
            label={{
              forceLabel: "Module Plan"
            }}
            selector={{
              name: "module_plan",
              className: "select-fld",
              value: this.state.module_plan,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.MODULE_PLAN
              },
              onChange: this.dropDownHandle.bind(this)
            }}
          />

          <div className="col">
            <button
              type="submit"
              style={{ marginTop: 19 }}
              onClick={this.addModules.bind(this)}
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
                  <div className="col-12">
                    <div data-validate="shiftDiv" id="algaehGrid_Cntr">
                      <AlgaehDataGrid
                        id="shift-grid"
                        datavalidate="data-validate='shiftDiv'"
                        columns={[
                          {
                            fieldName: "module_code",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Module Code" }}
                              />
                            ),
                            editorTemplate: row => (
                              <span>{row.module_code}</span>
                            ),
                            disabled: true
                          },
                          {
                            fieldName: "module_name",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Module Name" }}
                              />
                            ),
                            editorTemplate: row => (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.module_name,
                                  className: "txt-fld",
                                  name: "module_name",
                                  events: {
                                    onChange: this.onTextChange.bind(this, row)
                                  }
                                }}
                              />
                            ),
                            disabled: true
                          },
                          {
                            fieldName: "module_plan",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Module Plan" }}
                              />
                            ),
                            displayTemplate: row => {
                              return (
                                <span>
                                  {row.module_plan === "S"
                                    ? "Silver"
                                    : row.module_plan === "G"
                                      ? "Gold"
                                      : row.module_plan === "P"
                                        ? "Platinum"
                                        : ""}
                                </span>
                              );
                            },
                            editorTemplate: row => {
                              return (
                                <span>
                                  {row.module_plan === "S"
                                    ? "Silver"
                                    : row.module_plan === "G"
                                      ? "Gold"
                                      : row.module_plan === "P"
                                        ? "Platinum"
                                        : ""}
                                </span>
                              );
                            }
                          },

                          {
                            fieldName: "icons",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Icons" }} />
                            ),
                            displayTemplate: row => (
                              <i className={row.icons + " fa-2x"}></i>
                            ),
                            editorTemplate: row => (
                              <i className={row.icons + " fa-2x"}></i>
                            ),
                            disabled: true
                          },
                          {
                            fieldName: "other_language",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Other Language" }}
                              />
                            ),
                            editorTemplate: row => (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.other_language,
                                  className: "txt-fld",
                                  name: "other_language",
                                  events: {
                                    onChange: this.onTextChange.bind(this, row)
                                  }
                                }}
                              />
                            ),
                            disabled: true
                          },
                          {
                            fieldName: "licence_key",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Licence Key" }}
                              />
                            ),
                            disabled: true,
                            editorTemplate: row => {
                              return (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    value: row.licence_key,
                                    className: "txt-fld",
                                    name: "licence_key",
                                    events: {
                                      onChange: this.onTextChange.bind(
                                        this,
                                        row
                                      )
                                    }
                                  }}
                                />
                              );
                            }
                          },
                          {
                            fieldName: "display_order",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Display Order" }}
                              />
                            ),
                            editorTemplate: row => {
                              return (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    value: row.display_order,
                                    className: "txt-fld",
                                    name: "display_order",
                                    events: {
                                      onChange: this.onchangegridcol.bind(
                                        this,
                                        row
                                      )
                                    },
                                    others: {
                                      type: "number"
                                    }
                                  }}
                                />
                              );
                            }
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
                          data: this.state.modules
                        }}
                        filter={true}
                        isEditable={true}
                        actions={{
                          allowDelete: false
                        }}
                        paging={{ page: 0, rowsPerPage: 10 }}
                        events={{
                          onEdit: () => { },
                          // onDelete: this.deleteModules.bind(this),
                          onDone: this.updateModules.bind(this)
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

export default Modules;
