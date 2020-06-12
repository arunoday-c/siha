import React, { Component } from "react";
import "./groups.scss";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { GROUP_TYPE } from "../../../utils/GlobalVariables.json";
import Enumerable from "linq";
import swal from "sweetalert2";
class Groups extends Component {
  constructor(props) {
    super(props);
    this.initCall();
    this.state = {
      groups: [],
    };
    this.getGroups();
  }

  initCall() {
    let that = this;
    algaehApiCall({
      uri: "/init/",
      method: "GET",
      data: {
        fields: "app_group_code",
        tableName: "algaeh_d_app_group",
        keyFieldName: "algaeh_d_app_group_id",
      },
      onSuccess: (response) => {
        if (response.data.success === true) {
          const placeHolder =
            response.data.records.length > 0 ? response.data.records[0] : {};
          that.setState({
            app_group_code_placeHolder: placeHolder.app_group_code,
          });
        }
      },
    });
  }

  getGroups() {
    algaehApiCall({
      uri: "/algaehappuser/selectAppGroup",
      method: "GET",
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            groups: res.data.records,
          });
        }
      },
      onError: (err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  }
  clearState() {
    this.setState({
      app_group_code: null,
      app_group_name: null,
      app_group_desc: null,
      group_type: null,
    });
  }
  addGroups() {
    algaehApiCall({
      uri: "/algaehMasters/addAlgaehGroupMAster",
      method: "POST",
      data: {
        app_group_code: this.state.app_group_code,
        app_group_name: this.state.app_group_name,
        app_group_desc: this.state.app_group_desc,
        group_type: this.state.group_type,
      },
      onSuccess: (res) => {
        if (res.data.success) {
          swalMessage({
            title: "Record added successfully",
            type: "success",
          });
        }
        this.getGroups();
        this.clearState();
      },
      onError: (err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  }
  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  updateGroups(data) {
    algaehApiCall({
      uri: "/algaehMasters/updateAlgaehGroupMAster",
      method: "PUT",
      data: {
        app_group_name: data.app_group_name,
        app_group_desc: data.app_group_desc,
        group_type: data.group_type,
        algaeh_d_app_group_id: data.algaeh_d_app_group_id,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success",
          });

          this.getGroups();
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value,
    });
  }

  deleteGroups(data) {
    swal({
      title: "Delete Group : " + data.app_group_name + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willDelete) => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/algaehMasters/deleteAlgaehGroupMAster",
          method: "DELETE",
          data: {
            algaeh_d_app_group_id: data.algaeh_d_app_group_id,
          },
          onSuccess: (response) => {
            if (response.data.success) {
              swalMessage({
                title: "Record updated successfully",
                type: "success",
              });

              this.getGroups();
            }
          },
          onFailure: (error) => {
            swalMessage({
              title: error.message,
              type: "error",
            });
          },
        });
      }
    });
  }
  render() {
    return (
      <div className="groups">
        <div className="row inner-top-search">
          <AlagehFormGroup
            div={{ className: "col-2  mandatory form-group" }}
            label={{
              forceLabel: "Group Code",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "app_group_code",
              value: this.state.app_group_code,
              events: {
                onChange: this.changeTexts.bind(this),
              },
              others: {
                tabIndex: "1",
                placeholder: this.state.app_group_code_placeHolder,
              },
            }}
          />
          <AlagehFormGroup
            div={{ className: "col-2  mandatory form-group" }}
            label={{
              forceLabel: "Group Name",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "app_group_name",
              value: this.state.app_group_name,
              events: {
                onChange: this.changeTexts.bind(this),
              },
            }}
          />
          {/* <AlagehFormGroup
            div={{ className: "col-3  mandatory form-group" }}
            label={{
              forceLabel: "User Group Description",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "app_group_desc",
              value: this.state.app_group_desc,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          /> */}
          <AlagehAutoComplete
            div={{ className: "col-2  mandatory form-group" }}
            label={{
              forceLabel: "Group Type",
              isImp: true,
            }}
            selector={{
              name: "group_type",
              className: "select-fld",
              value: this.state.group_type,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GROUP_TYPE,
              },

              onChange: this.dropDownHandler.bind(this),
            }}
          />

          <div className="col">
            <button
              type="submit"
              style={{ marginTop: 19 }}
              onClick={this.addGroups.bind(this)}
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
                  <h3 className="caption-subject">User Group List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div data-validate="groupDiv" id="GroupGrid_Cntr">
                  <AlgaehDataGrid
                    id="group-grid"
                    datavalidate="data-validate='groupDiv'"
                    columns={[
                      {
                        fieldName: "app_group_code",

                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Group Code",
                            }}
                          />
                        ),
                        disabled: true,
                      },
                      {
                        fieldName: "app_group_name",

                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Group Name",
                            }}
                          />
                        ),

                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "app_group_name",
                                value: row.app_group_name,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  ),
                                },
                                others: {
                                  errormessage: "Group Name- cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
                      },
                      // {
                      //   fieldName: "app_group_desc",

                      //   label: (
                      //     <AlgaehLabel
                      //       label={{
                      //         forceLabel: "Group Description"
                      //       }}
                      //     />
                      //   ),
                      //   editorTemplate: row => {
                      //     return (
                      //       <AlagehFormGroup
                      //         div={{ className: "col" }}
                      //         textBox={{
                      //           className: "txt-fld",
                      //           name: "app_group_desc",
                      //           value: row.app_group_desc,
                      //           events: {
                      //             onChange: this.changeGridEditors.bind(
                      //               this,
                      //               row
                      //             )
                      //           },
                      //           others: {
                      //             errormessage:
                      //               "Group Description- cannot be blank",
                      //             required: true
                      //           }
                      //         }}
                      //       />
                      //     );
                      //   }
                      // },
                      {
                        fieldName: "group_type",
                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Group Type",
                            }}
                          />
                        ),

                        displayTemplate: (row) => {
                          let x = Enumerable.from(GROUP_TYPE)
                            .where((w) => w.value === row.group_type)
                            .firstOrDefault();
                          return <span>{x !== undefined ? x.name : ""}</span>;
                        },

                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                className: "txt-fld",
                                name: "group_type",
                                value: row.group_type,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GROUP_TYPE,
                                },

                                onChange: this.changeGridEditors.bind(
                                  this,
                                  row
                                ),

                                others: {
                                  errormessage: "Group type- cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
                      },
                    ]}
                    keyId="algaeh_d_app_group_id"
                    dataSource={{
                      data: this.state.groups,
                    }}
                    filter={true}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => {},
                      onDelete: this.deleteGroups.bind(this),
                      onDone: this.updateGroups.bind(this),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Groups;
