import React, { Component } from "react";
import "./id_type.scss";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel,
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables";
import { AlgaehActions } from "../../../actions/algaehActions";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import { Input, Tooltip } from "antd";
import AlgaehSearch from "../../Wrapper/globalSearch.js";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import { Tag } from "antd";
import {
  AlgaehSecurityElement,
  RawSecurityElement,
  AlgaehModal,
} from "algaeh-react-components";

class IDType extends Component {
  constructor(props) {
    super(props);
    this.initCall();
    this.state = {
      identity_status: "A",
      effective_end_date: "",
      identity_document_code: "",
      identity_document_name: "",
      arabic_identity_document_name: "",
      currentRowID: "",
      nationality_id: null,
      nationality: "",
      countries: [],
      masked_identity: "",
      notify_expiry: "N",
      notify_before: 0,
      notifyUserArray: [],
      employeeIDs: [],
      checkbutton: false,
      hims_d_identity_document_id: null,
      visible: false,
      activateEdit: false,
      IDGridColumnHide: false,
      initial_value_identity: null,
    };

    this.baseState = this.state;
  }
  // componentDidMount() {
  //
  // }
  getNationality() {
    algaehApiCall({
      uri: "/masters/get/nationality",
      method: "GET",

      onSuccess: (response) => {
        if (response.data.success) {
          const countries = response.data.records;
          this.setState({
            // nationality: countries.nationality_id,
            countries: countries,
          });
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

  initCall() {
    let that = this;
    algaehApiCall({
      uri: "/init/",
      method: "GET",
      data: {
        fields: "identity_document_code",
        tableName: "hims_d_identity_document",
        keyFieldName: "hims_d_identity_document_id",
      },
      onSuccess: (response) => {
        if (response.data.success === true) {
          const placeHolder =
            response.data.records.length > 0 ? response.data.records[0] : {};
          that.setState({
            identity_document_code_placeHolder:
              placeHolder.identity_document_code,
          });
        }
      },
    });
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  // changeGridEditors(row, e) {
  //   let name = e.name || e.target.name;
  //   let value = e.value || e.target.value;
  //   row[name] = value;
  //   row.update();
  // }
  texthandle(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value,
    });
  }
  checkedHandler(e) {
    if (e.target.checked) {
      this.setState({
        [e.target.name]: e.target.checked ? "Y" : "N",
      });
    } else {
      this.setState({
        notify_before: 0,
        notifyUserArray: [],
        employeeIDs: [],
        [e.target.name]: "N",
      });
    }
  }
  // checkedHandlerForGrid(row, e) {
  //   const isChecked = e.target.checked;
  //   const ceckStatus = isChecked ? "Y" : "N";
  //   row.notify_expiry = ceckStatus;
  // }
  // changeGridEditors(row, e) {
  //   let name = e.name || e.target.name;
  //   let value = e.value || e.target.value;
  //   row[name] = value;
  //   row.update();
  // }
  removeNotifier(e) {
    this.setState((prevState) => {
      return {
        notifyUserArray: prevState.notifyUserArray.filter((f) => {
          return f.hims_d_employee_id !== e.hims_d_employee_id;
        }),
      };
    });
  }
  dateFormater(value) {
    return String(moment(value).format("DD-MM-YYYY"));
  }

  resetState() {
    this.setState({
      identity_status: "A",
      effective_end_date: "",
      identity_document_code: "",
      identity_document_name: "",
      arabic_identity_document_name: "",
      currentRowID: "",
      nationality_id: null,
      nationality: "",
      // countries: [],
      masked_identity: "",
      notify_expiry: "N",
      notify_before: 0,
      notifyUserArray: [],
      employeeIDs: [],
      checkbutton: false,
      hims_d_identity_document_id: null,
      visible: false,
      activateEdit: false,
      viewEmployee: [],
    });
  }
  _onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  showModal = (row) => {
    this.setState({
      visible: true,
      viewEmployee: row,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };
  addIDType(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        this.setState(
          {
            employeeIDs: this.state.notifyUserArray.map(
              (item) => item.hims_d_employee_id
            ),
          },
          () => {
            algaehApiCall({
              uri: "/identity/add",
              module: "masterSettings",
              data: this.state,
              onSuccess: (response) => {
                if (response.data.success === true) {
                  // this.props.getIDTypes();

                  this.props.getIDTypes({
                    uri: "/identity/get",
                    module: "masterSettings",
                    method: "GET",
                    redux: {
                      type: "IDTYPE_GET_DATA",
                      mappingName: "idtypes",
                    },
                  });

                  this.resetState();
                  swalMessage({
                    title: "ID Type added successfully",
                    type: "success",
                  });
                }
              },
              onFailure: (error) => {
                swalMessage({
                  title: error.response.data.message,
                  type: "error",
                });
              },
            });
          }
        );
      },
    });
  }

  showconfirmDialog(id, name) {
    swal({
      title: `Are you sure you want to delete this ${name}?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willDelete) => {
      if (willDelete.value) {
        let data = { hims_d_identity_document_id: id };
        algaehApiCall({
          uri: "/identity/delete",
          module: "masterSettings",
          data: data,
          method: "DELETE",
          onSuccess: (response) => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success",
              });

              this.props.getIDTypes({
                uri: "/identity/get",
                module: "masterSettings",
                method: "GET",
                redux: {
                  type: "IDTYPE_GET_DATA",
                  mappingName: "idtypes",
                },
              });
            }
          },
          onFailure: (error) => {
            swalMessage({
              title: error.response.data.message,
              type: "error",
            });
          },
        });
      }
    });
  }

  deleteIDType(row) {
    this.showconfirmDialog(
      row.hims_d_identity_document_id,
      row.identity_document_name
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.idtypes !== nextProps.idtypes) {
      return true;
    }
    return true;
  }

  componentDidMount() {
    this.getNationality();
    if (this.props.idtypes === undefined || this.props.idtypes.length === 0) {
      this.props.getIDTypes({
        uri: "/identity/get",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "IDTYPE_GET_DATA",
          mappingName: "idtypes",
        },
      });
    }
    RawSecurityElement({ elementCode: "ID_NOTIFY_EXP" }).then((result) => {
      if (result === "show") {
        this.setState({ IDGridColumnHide: true });
      }
    });
  }

  updateIDtypes(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        this.setState(
          {
            employeeIDs: this.state.notifyUserArray.map(
              (item) => item.hims_d_employee_id
            ),
          },
          () => {
            algaehApiCall({
              uri: "/identity/update",
              module: "masterSettings",
              // data: data,
              data: this.state,
              method: "PUT",
              onSuccess: (response) => {
                if (response.data.success) {
                  swalMessage({
                    title: "Record updated successfully . .",
                    type: "success",
                  });

                  this.props.getIDTypes({
                    uri: "/identity/get",
                    module: "masterSettings",
                    method: "GET",
                    redux: {
                      type: "IDTYPE_GET_DATA",
                      mappingName: "idtypes",
                    },
                  });
                  this.resetState();
                }
              },
              onFailure: (error) => {
                swalMessage({
                  title: error.response.data.message,
                  type: "error",
                });
              },
            });
          }
        );
      },
    });
  }

  editRow(row, e) {
    this.setState({
      identity_status: row.identity_status,

      identity_document_code: row.identity_document_code,
      identity_document_name: row.identity_document_name,
      arabic_identity_document_name: row.arabic_identity_document_name,

      nationality_id: row.nationality_id,
      nationality_name: row.nationality_name,

      masked_identity: row.masked_identity,
      notify_expiry: row.notify_expiry,
      notify_before: row.notify_before,
      notifyUserArray: row.employees,
      initial_value_identity: row.initial_value_identity,
      employeeIDs: row.employees.map((item) => {
        return item.hims_d_employee_id;
      }),
      checkbutton: true,
      hims_d_identity_document_id: row.hims_d_identity_document_id,
      activateEdit: true,
      // })
    });
  }
  // onchangegridcol(e) {
  //   // let name = e.name || e.target.name;
  //   // let value = e.value || e.target.value;
  //   // row[name] = value;
  //   // row.update();
  //   //this.resetState();
  // }
  ToolTipText() {
    return (
      <ul style={{ listStyle: "none" }}>
        <li>1 - is For the numbers</li>
        <li>a - is For the letters</li>
        <li>A - is For the letters, forced to upper case when entered</li>
        <li>* - is For the alphanumericals</li>
        <li>
          #- is For the alphanumericals, forced to upper case when entered
        </li>
      </ul>
    );
  }
  employeeSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details.employee,
      },

      searchName: "employee",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: (row) => {
        const find = this.state.notifyUserArray.find(
          (f) => f.hims_d_employee_id === row.hims_d_employee_id
        );

        if (find !== undefined) {
          swalMessage({
            title: "User Already exists",
            type: "error",
          });
        } else {
          this.setState({
            notifyUserArray: this.state.notifyUserArray.concat(row),
          });
        }
      },
    });
  }

  render() {
    return (
      <div className="id_type">
        <div className="row">
          <div className="col-3">
            <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
              <div className="portlet-body">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-6  form-group mandatory" }}
                    label={{
                      fieldName: "type_code",
                      isImp: true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "identity_document_code",
                      value: this.state.identity_document_code,
                      events: {
                        onChange: this.changeTexts.bind(this),
                      },
                      others: {
                        tabIndex: "1",
                        placeholder:
                          this.state.identity_document_code_placeHolder,
                      },
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-12 form-group mandatory" }}
                    label={{
                      forceLabel: "ID Name",
                      isImp: true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "identity_document_name",
                      value: this.state.identity_document_name,
                      events: {
                        onChange: this.changeTexts.bind(this),
                      },
                    }}
                  />

                  <AlagehFormGroup
                    div={{
                      className: "col-12 form-group mandatory arabic-txt-fld",
                    }}
                    label={{
                      forceLabel: "ID Arabic Name",
                      isImp: true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "arabic_identity_document_name",
                      value: this.state.arabic_identity_document_name,
                      events: {
                        onChange: this.changeTexts.bind(this),
                      },
                    }}
                  />
                  <AlagehAutoComplete
                    div={{
                      className: "col-6 form-group",
                    }}
                    label={{
                      forceLabel: "Nationality",
                      // isImp: true,
                    }}
                    selector={{
                      name: "nationality_id",
                      className: "select-fld",
                      value: this.state.nationality_id,
                      dataSource: {
                        textField: "nationality",
                        valueField: "hims_d_nationality_id",
                        data: this.state.countries,
                      },
                      onChange: this.texthandle.bind(this),
                      onClear: () => {
                        this.setState({
                          nationality_id: null,
                        });
                      },
                    }}
                  />

                  <div className="col-6 form-group">
                    <label className="styleLabel">ID Format</label>
                    <div className="ui input txt-fld">
                      <Input
                        placeholder="##-####-####"
                        // className="col-3  form-group"

                        name="masked_identity"
                        value={this.state.masked_identity}
                        onChange={this.changeTexts.bind(this)}
                        suffix={
                          <Tooltip title={this.ToolTipText}>
                            <i className="fas fa-info-circle"></i>
                          </Tooltip>
                        }
                      />
                    </div>
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-12 form-group" }}
                    label={{
                      forceLabel: "Initial Value",
                      // isImp: true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "initial_value_identity",
                      value: this.state.initial_value_identity,
                      events: {
                        onChange: this.changeTexts.bind(this),
                      },
                    }}
                  />

                  <AlgaehSecurityElement elementCode="ID_NOTIFY_EXP">
                    <div className="col-6 form-group">
                      <label>Notify Expiry</label>
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            checked={
                              this.state.notify_expiry === "Y" ? true : false
                            }
                            onChange={this.checkedHandler.bind(this)}
                            name="notify_expiry"
                            value={this.state.notify_expiry}
                          />
                          <span>Yes</span>
                        </label>
                      </div>
                    </div>

                    {this.state.notify_expiry === "Y" ? (
                      <>
                        <AlagehFormGroup
                          div={{
                            className: "col-6 form-group mandatory",
                          }}
                          label={{
                            forceLabel: "Notify before (days)",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "notify_before",
                            value: this.state.notify_before,
                            events: { onChange: this.changeTexts.bind(this) },
                            others: { placeholder: "0", type: "number" },
                          }}
                        />

                        <div className="col-12 globalSearchCntr">
                          <AlgaehLabel label={{ forceLabel: "Notify Users" }} />
                          <h6 onClick={this.employeeSearch.bind(this)}>
                            <i className="fas fa-search fa-lg"></i>
                          </h6>
                        </div>
                        <div className="col-12">
                          <ul className="notifyUserList">
                            {this.state.notifyUserArray.map((item) => {
                              return (
                                <li key={item.employee_code}>
                                  {" "}
                                  <Tag
                                    closable
                                    onClose={this.removeNotifier.bind(
                                      this,
                                      item
                                    )}
                                  >
                                    <b>
                                      {" "}
                                      {item.employee_code} | {item.full_name}
                                    </b>
                                  </Tag>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </>
                    ) : null}
                  </AlgaehSecurityElement>

                  {this.state.activateEdit ? (
                    <AlagehAutoComplete
                      div={{
                        className: "col noLabel",
                      }}
                      label={{
                        forceLabel: "",
                      }}
                      selector={{
                        name: "identity_status",
                        className: "select-fld",
                        value: this.state.identity_status,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.FORMAT_STATUS,
                        },
                        onChange: this.texthandle.bind(this),
                        others: {
                          errormessage: "Status - cannot be blank",
                          required: true,
                        },
                      }}
                    />
                  ) : null}

                  <div
                    className="col-12"
                    style={{ textAlign: "right", marginTop: 10 }}
                  >
                    {this.state.checkbutton !== true ? (
                      <button
                        onClick={this.addIDType.bind(this)}
                        className="btn btn-primary"
                      >
                        Add to List
                      </button>
                    ) : (
                      <button
                        onClick={this.updateIDtypes.bind(this)}
                        className="btn btn-primary"
                      >
                        Update
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col" data-validate="idDiv">
                    <AlgaehDataGrid
                      datavalidate="data-validate='idDiv'"
                      id="identity_grd"
                      columns={[
                        {
                          fieldName: "ACTION",
                          label: "Action",
                          displayTemplate: (row) => {
                            return (
                              <div>
                                <i
                                  className="fas fa-pen"
                                  onClick={this.editRow.bind(this, row)}
                                ></i>
                                <i
                                  className="fas fa-trash-alt"
                                  onClick={this.deleteIDType.bind(this, row)}
                                ></i>
                              </div>
                            );
                          },
                        },
                        {
                          fieldName: "notifyUserArray",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Notify Users" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            // <span>{row.english_name}</span>
                            return row.notify_expiry === "Y" ? (
                              <i
                                className="fas fa-eye"
                                onClick={() => this.showModal(row)}
                              ></i>
                            ) : null;
                          },
                          others: { show: this.state.IDGridColumnHide },
                        },
                        {
                          fieldName: "identity_document_code",
                          label: (
                            <AlgaehLabel label={{ fieldName: "type_code" }} />
                          ),
                          disabled: true,
                        },
                        {
                          fieldName: "identity_document_name",
                          label: (
                            <AlgaehLabel label={{ fieldName: "type_desc" }} />
                          ),
                        },
                        {
                          fieldName: "arabic_identity_document_name",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "arabic_type_desc" }}
                            />
                          ),
                        },

                        {
                          fieldName: "nationality_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Nationality" }}
                            />
                          ),
                        },

                        {
                          fieldName: "masked_identity",
                          label: (
                            <AlgaehLabel label={{ fieldName: "ID Format" }} />
                          ),
                        },

                        {
                          fieldName: "initial_value_identity",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "Initial Value " }}
                            />
                          ),
                        },
                        {
                          fieldName: "notify_expiry",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Notify Expiry" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return row.notify_expiry === "Y" ? "Yes" : "No";
                          },
                          others: { show: this.state.IDGridColumnHide },
                        },

                        {
                          fieldName: "notify_before",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Notify Before" }}
                            />
                          ),

                          others: { show: this.state.IDGridColumnHide },
                        },
                        {
                          fieldName: "identity_status",
                          label: (
                            <AlgaehLabel label={{ fieldName: "status" }} />
                          ),
                          displayTemplate: (row) => {
                            return row.identity_status === "A"
                              ? "Active"
                              : "Inactive";
                          },
                        },
                      ]}
                      keyId="identity_document_code"
                      dataSource={{
                        data:
                          this.props.idtypes === undefined
                            ? []
                            : this.props.idtypes,
                      }}
                      filter={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{}}
                    />{" "}
                  </div>
                  {this.state.visible ? (
                    <AlgaehModal
                      title="Notify Users List"
                      visible={this.state.visible}
                      footer={null}
                      closable
                      onCancel={this.handleCancel}
                    >
                      <ul className="notifyUserListPopup">
                        {this.state.viewEmployee.employees.map((item) => {
                          return (
                            <li key={item.employee_code}>
                              <b>
                                {item.employee_code} | {item.full_name}
                              </b>
                            </li>
                          );
                        })}
                      </ul>
                    </AlgaehModal>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    idtypes: state.idtypes,
    userdrtails: state.userdrtails,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getIDTypes: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IDType));
