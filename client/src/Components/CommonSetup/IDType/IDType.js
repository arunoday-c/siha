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
  texthandle(e) {
    debugger;
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value,
    });
  }
  changeGridEditors(row, e) {
    debugger;
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }
  dateFormater(value) {
    return String(moment(value).format("DD-MM-YYYY"));
  }

  resetState() {
    this.setState(this.baseState);
  }
  _onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  addIDType(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
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
      },
    });
  }

  showconfirmDialog(id) {
    swal({
      title: "Are you sure you want to delete this ID Types?",
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
    this.showconfirmDialog(row.hims_d_identity_document_id);
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
  }

  updateIDtypes(data) {
    algaehApiCall({
      uri: "/identity/update",
      module: "masterSettings",
      data: data,
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

  onchangegridcol(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
    //this.resetState();
  }
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
  render() {
    return (
      <div className="id_type">
        <div className="row inner-top-search">
          <AlagehFormGroup
            div={{ className: "col-1  form-group mandatory" }}
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
                placeholder: this.state.identity_document_code_placeHolder,
              },
            }}
          />

          <AlagehFormGroup
            div={{ className: "col form-group mandatory" }}
            label={{
              fieldName: "type_desc",
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
            div={{ className: "col form-group mandatory arabic-txt-fld" }}
            label={{
              fieldName: "arabic_type_desc",
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
              className: "col-lg-2 col-md-2 col-sm-12 form-group",
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
                  nationality: null,
                });
              },
            }}
          />
          {/* <AlagehFormGroup
           
            label={{
              fieldName: "Masked Identity",
              // isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "masked_identity",
              value: this.state.masked_identity,
              events: {
                onChange: this.changeTexts.bind(this),
              },
            }}
          /> */}
          <div className="col-lg-2 col-md-2 col-sm-12 form-group">
            <label className="styleLabel">MASKED IDENTITY</label>
            <div className="ui input txt-fld">
              <Input
                placeholder="MASKING IDENTITY"
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

          {/* <AlagehAutoComplete
            div={{
              className: "col-lg-2 col-md-2 col-sm-12 form-group mandatory",
            }}
            label={{
              forceLabel: "Nationality",
              isImp: true,
            }}
            selector={{
              name: "nationality",
              className: "select-fld",
              // value: this.state.nationality,
              dataSource: {
                textField: "nationality",
                valueField: "",
                data: [],
              },
              // onChange: texthandle.bind(this, this),
            }}
          /> */}

          <div className="col-1" style={{ marginTop: 19, textAlign: "right" }}>
            <button
              onClick={this.addIDType.bind(this)}
              className="btn btn-primary"
            >
              Add to List
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col" data-validate="idDiv">
                    <AlgaehDataGrid
                      datavalidate="data-validate='idDiv'"
                      id="identity_grd"
                      columns={[
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
                          editorTemplate: (row) => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.identity_document_name,
                                  className: "txt-fld",
                                  namchangeGridEditorse:
                                    "identity_document_name",
                                  events: {
                                    onChange: this.onchangegridcol.bind(
                                      this,
                                      row
                                    ),
                                  },
                                  others: {
                                    errormessage: "Name - cannot be blank",
                                    required: true,
                                  },
                                }}
                              />
                            );
                          },
                        },
                        {
                          fieldName: "arabic_identity_document_name",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "arabic_type_desc" }}
                            />
                          ),
                          editorTemplate: (row) => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.arabic_identity_document_name,
                                  className: "txt-fld",
                                  name: "arabic_identity_document_name",
                                  events: {
                                    onChange: this.onchangegridcol.bind(
                                      this,
                                      row
                                    ),
                                  },
                                  others: {
                                    errormessage:
                                      "Arabic Name - cannot be blank",
                                    required: true,
                                  },
                                }}
                              />
                            );
                          },
                        },

                        {
                          fieldName: "nationality_id",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Nationality" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return <span>{row.nationality_name}</span>;
                          },
                          editorTemplate: (row) => {
                            return (
                              <AlagehAutoComplete
                                div={{
                                  className: "col noLabel",
                                }}
                                label={{
                                  forceLabel: "",
                                }}
                                selector={{
                                  name: "nationality_id",
                                  className: "select-fld",
                                  value: row.nationality_id,
                                  dataSource: {
                                    textField: "nationality",
                                    valueField: "hims_d_nationality_id",
                                    data: this.state.countries,
                                  },
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  ),
                                }}
                              />
                            );
                          },
                        },
                        // {
                        //   fieldName: "masked_identity",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{ fieldName: "Masked Identity" }}
                        //     />
                        //   ),
                        //   editorTemplate: (row) => {
                        //     return (
                        //       <AlagehFormGroup
                        //         div={{}}
                        //         textBox={{
                        //           value: row.masked_identity,
                        //           className: "txt-fld",
                        //           name: "masked_identity",
                        //           events: {
                        //             onChange: this.onchangegridcol.bind(
                        //               this,
                        //               row
                        //             ),
                        //           },

                        //           // others: {
                        //           //   errormessage:
                        //           //     "Arabic Name - cannot be blank",
                        //           //   required: true,
                        //           // },
                        //         }}
                        //       />
                        //     );
                        //   },
                        // },
                        {
                          fieldName: "masked_identity",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "Masked Identity" }}
                            />
                          ),
                          editorTemplate: (row) => {
                            return (
                              <Input
                                name="masked_identity"
                                value={row.masked_identity}
                                onChange={this.onchangegridcol.bind(this, row)}
                                suffix={
                                  <Tooltip title={this.ToolTipText}>
                                    <i className="fas fa-info-circle"></i>
                                  </Tooltip>
                                }
                              />
                            );
                          },
                        },

                        // {
                        //   fieldName: "created_by",
                        //   label: (
                        //     <AlgaehLabel label={{ fieldName: "created_by" }} />
                        //   ),
                        //   displayTemplate: (row) => {
                        //     let display =
                        //       this.props.userdrtails === undefined
                        //         ? []
                        //         : this.props.userdrtails.filter(
                        //             (f) =>
                        //               f.algaeh_d_app_user_id === row.created_by
                        //           );

                        //     return (
                        //       <span>
                        //         {display !== null && display.length !== 0
                        //           ? display[0].username
                        //           : ""}
                        //       </span>
                        //     );
                        //   },
                        //   editorTemplate: (row) => {
                        //     let display =
                        //       this.props.userdrtails === undefined
                        //         ? []
                        //         : this.props.userdrtails.filter(
                        //             (f) =>
                        //               f.algaeh_d_app_user_id === row.created_by
                        //           );

                        //     return (
                        //       <span>
                        //         {display !== null && display.length !== 0
                        //           ? display[0].username
                        //           : ""}
                        //       </span>
                        //     );
                        //   },
                        // },
                        // {
                        //   fieldName: "created_date",

                        //   label: (
                        //     <AlgaehLabel label={{ forceLabel: "Added Date" }} />
                        //   ),
                        //   displayTemplate: (row) => {
                        //     return (
                        //       <span>{this.dateFormater(row.created_date)}</span>
                        //     );
                        //   },
                        //   editorTemplate: (row) => {
                        //     return (
                        //       <span>{this.dateFormater(row.created_date)}</span>
                        //     );
                        //   },
                        // },

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
                          editorTemplate: (row) => {
                            return (
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
                                  value: row.identity_status,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: GlobalVariables.FORMAT_STATUS,
                                  },
                                  onChange: this.onchangegridcol.bind(
                                    this,
                                    row
                                  ),
                                  others: {
                                    errormessage: "Status - cannot be blank",
                                    required: true,
                                  },
                                }}
                              />
                            );
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
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onDelete: this.deleteIDType.bind(this),
                        onEdit: (row) => {},
                        onDone: this.updateIDtypes.bind(this),
                      }}
                    />{" "}
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
