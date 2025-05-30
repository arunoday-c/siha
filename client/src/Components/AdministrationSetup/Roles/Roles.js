import React, { Component } from "react";
import "./roles.scss";
import {
  AlgaehDataGrid,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehLabel,
} from "../../Wrapper/algaehWrapper";
import {
  algaehApiCall,
  swalMessage,
  cancelRequest,
} from "../../../utils/algaehApiCall";
import { ROLE_TYPE, FORMAT_YESNO } from "../../../utils/GlobalVariables.json";
import Enumerable from "linq";
import swal from "sweetalert2";

import { AlgaehSecurityElement } from "algaeh-react-components";
class Roles extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      groups: [],
      roles: [],
    };
  }

  initCall() {
    this._isMounted = true;
    let that = this;
    algaehApiCall({
      uri: "/init/",
      method: "GET",
      data: {
        fields: "role_code",
        tableName: "algaeh_d_app_roles",
        keyFieldName: "app_d_app_roles_id",
      },
      onSuccess: (response) => {
        if (response.data.success === true && this._isMounted === true) {
          const placeHolder =
            response.data.records.length > 0 ? response.data.records[0] : {};
          that.setState({
            role_code_placeHolder: placeHolder.role_code,
          });
        }
      },
    });
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // dropDownHandle(value) {
  //
  //   this.setState({ [value.name]: value.value });
  // }

  clearState() {
    this.setState({
      // app_group_id: null,
      role_code: null,
      role_name: null,
      role_discreption: null,
      role_type: null,
      loan_authorize_privilege: null,
      leave_authorize_privilege: null,
      finance_authorize_privilege: null,
      edit_monthly_attendance: null,
    });
  }
  dropDownHandle(data) {
    this.setState({ [data.name]: data.value });
  }

  updateRoles(data) {
    algaehApiCall({
      uri: "/algaehMasters/updateAlgaehRoleMAster",
      method: "PUT",
      data: {
        role_name: data.role_name,
        role_discreption: data.role_discreption,
        role_type: data.role_type,
        loan_authorize_privilege: data.loan_authorize_privilege,
        leave_authorize_privilege: data.leave_authorize_privilege,
        finance_authorize_privilege: data.finance_authorize_privilege,
        edit_monthly_attendance: data.edit_monthly_attendance,
        app_d_app_roles_id: data.app_d_app_roles_id,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success",
          });
          this.getRoles();
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

  deleteRoles(data) {
    swal({
      title: "Delete Role : " + data.role_name + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willDelete) => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/algaehMasters/deleteAlgaehRoleMAster",
          method: "DELETE",
          data: {
            app_d_app_roles_id: data.app_d_app_roles_id,
          },
          onSuccess: (response) => {
            if (response.data.success) {
              swalMessage({
                title: "Record updated successfully",
                type: "success",
              });
            }
            this.getRoles();
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

  addRoles() {
    algaehApiCall({
      uri: "/algaehMasters/addAlgaehRoleMAster",
      method: "POST",
      data: {
        app_group_id: this.state.app_group_id,
        role_code: this.state.role_code,
        role_name: this.state.role_name,
        role_discreption: this.state.role_discreption,
        role_type: this.state.role_type,
        loan_authorize_privilege: this.state.loan_authorize_privilege,
        leave_authorize_privilege: this.state.leave_authorize_privilege,
        finance_authorize_privilege: this.state.finance_authorize_privilege,
        edit_monthly_attendance: this.state.edit_monthly_attendance,
      },
      onSuccess: (res) => {
        if (res.data.success) {
          swalMessage({
            title: "Record added successfully",
            type: "success",
          });
        } else {
          swalMessage({
            title: res.data.records.message,
            type: "error",
          });
        }
        this.getRoles();
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

  getGroups() {
    this._isMounted = true;
    algaehApiCall({
      uri: "/algaehappuser/selectAppGroup",
      method: "GET",
      cancelRequestId: "selectAppGroup",
      onSuccess: (res) => {
        if (res.data.success === true && this._isMounted === true) {
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
  getRoles() {
    this._isMounted = true;
    algaehApiCall({
      uri: "/algaehappuser/selectRoles",
      method: "GET",
      cancelRequestId: "selectRoles",
      onSuccess: (res) => {
        if (res.data.success === true && this._isMounted === true) {
          this.setState({
            roles: res.data.records,
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
  getAuthPrivilege() {
    this._isMounted = true;
    algaehApiCall({
      uri: "/algaehMasters/getHrmsAuthLevels",
      method: "GET",
      cancelRequestId: "getHrmsAuthLevels",
      onSuccess: (res) => {
        if (res.data.success === true && this._isMounted === true) {
          this.setState({
            leave_levels: res.data.records.leave_levels,
            loan_levels: res.data.records.loan_levels,
            // finance_levels: res.data.records.finance_levels,
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

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  componentWillUnmount() {
    this._isMounted = false;
    cancelRequest("selectAppGroup");
    cancelRequest("selectRoles");
    cancelRequest("getHrmsAuthLevels");
  }
  componentDidMount() {
    this.initCall();
    this.getGroups();
    this.getRoles();
    this.getAuthPrivilege();
  }

  render() {
    return (
      <div className="roles">
        <div className="row inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Role Type",
              isImp: true,
            }}
            selector={{
              name: "role_type",
              className: "select-fld",
              value: this.state.role_type,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: ROLE_TYPE,
              },

              onChange: this.dropDownHandle.bind(this),
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Select User Group",
              isImp: true,
            }}
            selector={{
              name: "app_group_id",
              className: "select-fld",
              value: this.state.app_group_id,
              dataSource: {
                textField: "app_group_name",
                valueField: "algaeh_d_app_group_id",
                data: this.state.groups,
              },
              onChange: this.dropDownHandle.bind(this),
            }}
          />{" "}
          <AlagehFormGroup
            div={{ className: "col-1 mandatory form-group" }}
            label={{
              forceLabel: "Role Code",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "role_code",
              value: this.state.role_code,
              events: {
                onChange: this.changeTexts.bind(this),
              },
              others: {
                tabIndex: "1",
                placeholder: this.state.role_code_placeHolder,
              },
            }}
          />
          <AlagehFormGroup
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Role Name",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "role_name",
              value: this.state.role_name,
              events: {
                onChange: this.changeTexts.bind(this),
              },
            }}
          />
          {/* <AlagehFormGroup
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Role Description",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "role_discreption",
              value: this.state.role_discreption,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          /> */}
          <AlagehAutoComplete
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Authorize Loan",
              isImp: true,
            }}
            selector={{
              name: "loan_authorize_privilege",
              className: "select-fld",
              value: this.state.loan_authorize_privilege,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: this.state.loan_levels,
              },
              onChange: this.dropDownHandle.bind(this),
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Authorize Leave",
              isImp: true,
            }}
            selector={{
              name: "leave_authorize_privilege",
              className: "select-fld",
              value: this.state.leave_authorize_privilege,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: this.state.leave_levels,
              },
              onChange: this.dropDownHandle.bind(this),
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Finance Authorize Level",
              isImp: true,
            }}
            selector={{
              name: "finance_privilge",
              className: "select-fld",
              value: this.state.finance_authorize_privilege,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: [
                  { name: "Level 2", value: "2" },
                  { name: "Level 1", value: "1" },
                  { name: "None", value: "N" },
                ],
              },
              onChange: this.dropDownHandle.bind(this),
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              forceLabel: "Edit Monthly Attendance",
              isImp: true,
            }}
            selector={{
              name: "edit_monthly_attendance",
              className: "select-fld",
              value: this.state.edit_monthly_attendance,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: FORMAT_YESNO,
              },
              onChange: this.dropDownHandle.bind(this),
            }}
          />
          <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
            <div className="col">
              <button
                type="submit"
                style={{ marginTop: 20 }}
                onClick={this.addRoles.bind(this)}
                className="btn btn-primary"
              >
                Add to List
              </button>
            </div>{" "}
          </AlgaehSecurityElement>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Roles List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div data-validate="shiftDiv" id="RolesGrid_Cntr">
                  <AlgaehDataGrid
                    id="shift-grid"
                    datavalidate="data-validate='shiftDiv'"
                    columns={[
                      {
                        fieldName: "role_type",

                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Role Type",
                            }}
                          />
                        ),
                        displayTemplate: (row) => {
                          let x = Enumerable.from(ROLE_TYPE)
                            .where((w) => w.value === row.role_type)
                            .firstOrDefault();
                          return (
                            <span>
                              {x !== undefined ? x.name : "Unknown user"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col mandatory form-group" }}
                              selector={{
                                className: "txt-fld",
                                name: "role_type",
                                value: row.role_type,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: ROLE_TYPE,
                                },

                                onChange: this.changeGridEditors.bind(
                                  this,
                                  row
                                ),

                                others: {
                                  errormessage: "Role type- cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
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
                        disabled: true,
                      },
                      {
                        fieldName: "role_code",

                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Role Code",
                            }}
                          />
                        ),
                        disabled: true,
                      },
                      {
                        fieldName: "role_name",

                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Role Name",
                            }}
                          />
                        ),
                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col mandatory form-group" }}
                              textBox={{
                                className: "txt-fld",
                                name: "role_name",
                                value: row.role_name,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  ),
                                },
                                others: {
                                  errormessage: "Role Name- cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
                      },
                      // {
                      //   fieldName: "role_discreption",

                      //   label: (
                      //     <AlgaehLabel
                      //       label={{
                      //         forceLabel: "Role Description"
                      //       }}
                      //     />
                      //   ),

                      //   editorTemplate: row => {
                      //     return (
                      //       <AlagehFormGroup
                      //         div={{ className: "col-2 mandatory form-group" }}
                      //         textBox={{
                      //           className: "txt-fld",
                      //           name: "role_discreption",
                      //           value: row.role_discreption,
                      //           events: {
                      //             onChange: this.changeGridEditors.bind(
                      //               this,
                      //               row
                      //             )
                      //           },
                      //           others: {
                      //             errormessage:
                      //               "Description Name- cannot be blank",
                      //             required: true
                      //           }
                      //         }}
                      //       />
                      //     );
                      //   }
                      // },
                      {
                        fieldName: "loan_authorize_privilege",

                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Authorize Loan",
                            }}
                          />
                        ),
                        displayTemplate: (row) => {
                          let x = Enumerable.from(this.state.loan_levels)
                            .where(
                              (w) => w.value === row.loan_authorize_privilege
                            )
                            .firstOrDefault();
                          return <span>{x !== undefined ? x.name : "--"}</span>;
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col mandatory form-group" }}
                              selector={{
                                className: "txt-fld",
                                name: "loan_authorize_privilege",
                                value: row.loan_authorize_privilege,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: this.state.loan_levels,
                                },

                                onChange: this.changeGridEditors.bind(
                                  this,
                                  row
                                ),

                                others: {
                                  errormessage:
                                    "LOAN PRIVILEGE- cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "leave_authorize_privilege",

                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Authorize Leave",
                            }}
                          />
                        ),
                        displayTemplate: (row) => {
                          let x = Enumerable.from(this.state.leave_levels)
                            .where(
                              (w) => w.value === row.leave_authorize_privilege
                            )
                            .firstOrDefault();
                          return <span>{x !== undefined ? x.name : "--"}</span>;
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col mandatory form-group" }}
                              selector={{
                                className: "txt-fld",
                                name: "leave_authorize_privilege",
                                value: row.leave_authorize_privilege,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: this.state.leave_levels,
                                },

                                onChange: this.changeGridEditors.bind(
                                  this,
                                  row
                                ),

                                others: {
                                  errormessage:
                                    "LEAVE PRIVILEGE- cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "finance_authorize_privilege",

                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Finance Authorize",
                            }}
                          />
                        ),
                        displayTemplate: (row) => {
                          let x =
                            row.finance_authorize_privilege === "N"
                              ? "None"
                              : row.finance_authorize_privilege === "1"
                              ? "LEVEL 1"
                              : row.finance_authorize_privilege === "2"
                              ? "LEVEL 2"
                              : "--";
                          return <span>{x}</span>;
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col mandatory form-group" }}
                              selector={{
                                className: "txt-fld",
                                name: "finance_authorize_privilege",
                                value: row.finance_authorize_privilege,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: [
                                    { name: "Level 2", value: "2" },
                                    { name: "Level 1", value: "1" },
                                    { name: "None", value: "N" },
                                  ],
                                },

                                onChange: this.changeGridEditors.bind(
                                  this,
                                  row
                                ),

                                others: {
                                  errormessage:
                                    "Finance Privilage- cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "edit_monthly_attendance",

                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Edit Monthly Attendance ",
                            }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.edit_monthly_attendance === "Y" ? (
                                <span>YES </span>
                              ) : (
                                "NO"
                              )}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col mandatory form-group" }}
                              selector={{
                                className: "txt-fld",
                                name: "edit_monthly_attendance",
                                value: row.edit_monthly_attendance,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: FORMAT_YESNO,
                                },

                                onChange: this.changeGridEditors.bind(
                                  this,
                                  row
                                ),

                                others: {
                                  errormessage:
                                    "LEAVE PRIVILEGE- cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
                      },
                    ]}
                    keyId="app_d_app_roles_id"
                    dataSource={{
                      data: this.state.roles,
                    }}
                    filter={true}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => {},
                      onDelete: this.deleteRoles.bind(this),
                      onDone: this.updateRoles.bind(this),
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

export default Roles;
