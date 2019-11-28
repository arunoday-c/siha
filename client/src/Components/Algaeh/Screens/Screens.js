import React, { Component } from "react";
import "./screens.scss";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";

class Screens extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screens: [],
      modules: []
    };
    this.getModules();
    this.getScreens();
  }

  clearState() {
    this.setState({
      screen_code: "",
      screen_name: "",
      page_to_redirect: "",
      module_id: null,
      other_language: ""
    });
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
          type: "error"
        });
      }
    });
  }

  getScreens() {
    algaehApiCall({
      uri: "/algaehMasters/getAlgaehScreens",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            screens: response.data.records
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

  addScreens() {
    algaehApiCall({
      uri: "/algaehMasters/addAlgaehScreen",
      method: "POST",
      data: {
        screen_code: this.state.screen_code,
        screen_name: this.state.screen_name,
        page_to_redirect: this.state.page_to_redirect,
        module_id: this.state.module_id,
        other_language: this.state.other_language
      },
      onSuccess: response => {
        if (response.data.success) {
          this.getScreens();
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
          type: "error"
        });
      }
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

  deleteScreens(data) {
    swal({
      title: "Delete Screen : " + data.screen_name + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/algaehMasters/deleteAlgaehScreen",
          method: "DELETE",
          data: {
            algaeh_app_screens_id: data.algaeh_app_screens_id
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record updated successfully",
                type: "success"
              });

              this.getScreens();
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
    });
  }

  updateScreens(data) {
    algaehApiCall({
      uri: "/algaehMasters/updateAlgaehScreen",
      method: "PUT",
      data: {
        screen_name: data.screen_name,
        page_to_redirect: data.page_to_redirect,
        other_language: data.other_language,
        algaeh_app_screens_id: data.algaeh_app_screens_id
      },
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });

          this.getScreens();
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

  render() {
    return (
      <div className="screens">
        <div className="row inner-top-search margin-bottom-15">
          <AlagehAutoComplete
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Module",
              isImp: true
            }}
            selector={{
              name: "module_id",
              className: "select-fld",
              value: this.state.module_id,
              dataSource: {
                textField: "module_name",
                valueField: "algaeh_d_module_id",
                data: this.state.modules
              },
              onChange: this.dropDownHandle.bind(this)
            }}
          />
          <AlagehFormGroup
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Screen Code",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "screen_code",
              value: this.state.screen_code,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col-3 mandatory form-group" }}
            label={{
              forceLabel: "Screen Name",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "screen_name",
              value: this.state.screen_name,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Page to Redirect",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "page_to_redirect",
              value: this.state.page_to_redirect,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col-3 mandatory form-group" }}
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

          <div className="col form-group">
            <button
              type="submit"
              onClick={this.addScreens.bind(this)}
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
                            fieldName: "screen_code",
                            label: "Screen Code",
                            disabled: true
                          },
                          {
                            fieldName: "screen_name",
                            label: "Screen Name",
                            editorTemplate: row => {
                              return (
                                <AlagehFormGroup
                                  div={{ className: "col" }}
                                  textBox={{
                                    className: "txt-fld",
                                    name: "screen_name",
                                    value: row.screen_name,
                                    events: {
                                      onChange: this.changeGridEditors.bind(
                                        this,
                                        row
                                      )
                                    },
                                    others: {
                                      errormessage:
                                        "Screen Name - cannot be blank",
                                      required: true
                                    }
                                  }}
                                />
                              );
                            }
                          },
                          {
                            fieldName: "page_to_redirect",
                            label: "Page to Redirect",
                            editorTemplate: row => {
                              return (
                                <AlagehFormGroup
                                  div={{ className: "col" }}
                                  textBox={{
                                    className: "txt-fld",
                                    name: "page_to_redirect",
                                    value: row.page_to_redirect,
                                    events: {
                                      onChange: this.changeGridEditors.bind(
                                        this,
                                        row
                                      )
                                    },
                                    others: {
                                      errormessage:
                                        "Page to Redirect - cannot be blank",
                                      required: true
                                    }
                                  }}
                                />
                              );
                            }
                          },
                          {
                            fieldName: "module_name",
                            label: "Module Name",
                            disabled: true
                          },
                          {
                            fieldName: "module_code",
                            label: "Module Code",
                            disabled: true
                          },
                          {
                            fieldName: "other_language",
                            label: "Other Language",
                            editorTemplate: row => {
                              return (
                                <AlagehFormGroup
                                  div={{ className: "col" }}
                                  textBox={{
                                    className: "txt-fld",
                                    name: "other_language",
                                    value: row.other_language,
                                    events: {
                                      onChange: this.changeGridEditors.bind(
                                        this,
                                        row
                                      )
                                    },
                                    others: {
                                      errormessage: "Module - cannot be blank",
                                      required: true
                                    }
                                  }}
                                />
                              );
                            }
                          }
                        ]}
                        keyId="algaeh_app_screens_id"
                        dataSource={{
                          data: this.state.screens
                        }}
                        filter={true}
                        isEditable={true}
                        paging={{ page: 0, rowsPerPage: 10 }}
                        events={{
                          onEdit: () => { },
                          onDelete: this.deleteScreens.bind(this),
                          onDone: this.updateScreens.bind(this)
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

export default Screens;
