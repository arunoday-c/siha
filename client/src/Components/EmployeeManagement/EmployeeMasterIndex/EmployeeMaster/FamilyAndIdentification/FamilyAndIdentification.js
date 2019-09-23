import React, { Component } from "react";
import "./FamilyAndIdentification.scss";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../../Wrapper/algaehWrapper";
import variableJson from "../../../../../utils/GlobalVariables.json";
// import { algaehApiCall } from "../../../../../utils/algaehApiCall";

import {
  texthandle,
  datehandlegrid,
  AddEmpId,
  addDependentType,
  getFamilyIdentification,
  onchangegridcol,
  deleteIdentifications,
  updateIdentifications,
  deleteDependencies,
  updateDependencies,
  dateFormater,
  datehandle
} from "./FamilyAndIdentificationEvent";
import { AlgaehActions } from "../../../../../actions/algaehActions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import moment from "moment";

class FamilyAndIdentification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issue_date: null,
      valid_upto: null
      // idDetails: [],
      // deleteIdDetails: [],
      // dependentDetails: []
    };
  }

  componentDidMount() {
    let InputOutput = this.props.EmpMasterIOputs.state.personalDetails;
    this.setState({ ...this.state, ...InputOutput }, () => {
      if (this.state.hims_d_employee_id !== null) {
        getFamilyIdentification(this);
      }
    });

    if (this.props.idtypes === undefined || this.props.idtypes.length === 0) {
      this.props.getIDTypes({
        uri: "/identity/get",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "IDTYPE_GET_DATA",
          mappingName: "idtypes"
        }
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-employee-form popRightDiv">
          <div className="row">
            <div className="col-12" data-validate="empIdGrid">
              <h5>
                <span>Identification Details</span>
              </h5>
              <div className="row paddin-bottom-5">
                <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{
                    forceLabel: "Id Type",
                    isImp: true
                  }}
                  selector={{
                    name: "identity_documents_id",
                    className: "select-fld",
                    value: this.state.identity_documents_id,
                    dataSource: {
                      textField: "identity_document_name",
                      valueField: "hims_d_identity_document_id",
                      data: this.props.idtypes
                    },
                    onChange: texthandle.bind(this, this),
                    others: {
                      tabIndex: "1"
                    },
                    onClear: () => {
                      this.setState({
                        identity_documents_id: null
                      });
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-2" }}
                  label={{
                    forceLabel: "Id Number",
                    isImp: true
                  }}
                  textBox={{
                    value: this.state.identity_number,
                    className: "txt-fld",
                    name: "identity_number",

                    events: {
                      onChange: texthandle.bind(this, this)
                    },
                    others: {
                      tabIndex: "2",
                      placeholder: ""
                      // type: "number"
                    }
                  }}
                />
                <AlgaehDateHandler
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Issue Date",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "issue_date",
                    others: {
                      tabIndex: "3"
                    }
                  }}
                  maxDate={new Date()}
                  events={{
                    onChange: datehandle.bind(this, this)
                  }}
                  value={this.state.issue_date}
                />
                <AlgaehDateHandler
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Expiry Date",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "valid_upto",
                    others: {
                      tabIndex: "4"
                    }
                  }}
                  //maxDate={new Date()}
                  events={{
                    onChange: datehandle.bind(this, this)
                  }}
                  value={this.state.valid_upto}
                />
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: 21 }}
                    onClick={AddEmpId.bind(this, this)}
                  >
                    Add
                  </button>
                </div>

                <div className="col-lg-12 margin-top-15">
                  <AlgaehDataGrid
                    id="employee-ids-grid"
                    columns={[
                      {
                        fieldName: "identity_documents_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "ID Type" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.idtypes === undefined
                              ? []
                              : this.props.idtypes.filter(
                                  f =>
                                    f.hims_d_identity_document_id ===
                                    row.identity_documents_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].identity_document_name
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          let display =
                            this.props.idtypes === undefined
                              ? []
                              : this.props.idtypes.filter(
                                  f =>
                                    f.hims_d_identity_document_id ===
                                    row.identity_documents_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].identity_document_name
                                : ""}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "identity_number",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "ID Number" }} />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                value: row.identity_number,
                                className: "txt-fld",
                                name: "identity_number",
                                events: {
                                  onChange: onchangegridcol.bind(
                                    this,
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
                        fieldName: "issue_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Issue Date" }} />
                        ),
                        displayTemplate: row => {
                          return <span>{dateFormater(row.issue_date)}</span>;
                        },
                        editorTemplate: row => {
                          return (
                            <AlgaehDateHandler
                              div={{ className: "" }}
                              textBox={{
                                className: "txt-fld hidden",
                                name: "issue_date"
                              }}
                              minDate={new Date()}
                              events={{
                                onChange: datehandlegrid.bind(this, this, row)
                              }}
                              value={row.issue_date}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "valid_upto",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Valid Upto" }} />
                        ),
                        displayTemplate: row => {
                          return <span>{dateFormater(row.valid_upto)}</span>;
                        },
                        editorTemplate: row => {
                          return (
                            <AlgaehDateHandler
                              div={{ className: "" }}
                              textBox={{
                                className: "txt-fld hidden",
                                name: "valid_upto"
                              }}
                              minDate={new Date()}
                              events={{
                                onChange: datehandlegrid.bind(this, this, row)
                              }}
                              value={row.valid_upto}
                            />
                          );
                        }
                      }
                    ]}
                    keyId=""
                    dataSource={{ data: this.state.idDetails }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 5 }}
                    events={{
                      onDelete: deleteIdentifications.bind(this, this),
                      onEdit: row => {},
                      onDone: updateIdentifications.bind(this, this)
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="col-12" data-validate="dependentGrid">
              <h5>
                <span>Family Details</span>
              </h5>
              <div className="row paddin-bottom-5">
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Dependent Type",
                    isImp: true
                  }}
                  selector={{
                    name: "dependent_type",
                    className: "select-fld",
                    value: this.state.dependent_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: variableJson.DEPENDENT_TYPE
                    },
                    onChange: texthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        dependent_type: null
                      });
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Dependent Name",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "dependent_name",
                    value: this.state.dependent_name,
                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{
                    forceLabel: "Id Type",
                    isImp: true
                  }}
                  selector={{
                    name: "dependent_identity_type",
                    className: "select-fld",
                    value: this.state.dependent_identity_type,
                    dataSource: {
                      textField: "identity_document_name",
                      valueField: "hims_d_identity_document_id",
                      data: this.props.idtypes
                    },
                    onChange: texthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        dependent_identity_type: null
                      });
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Id Number",
                    isImp: true
                  }}
                  textBox={{
                    value: this.state.dependent_identity_no,
                    className: "txt-fld",
                    name: "dependent_identity_no",

                    events: {
                      onChange: texthandle.bind(this, this)
                    }
                  }}
                />
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: 21 }}
                    onClick={addDependentType.bind(this, this)}
                  >
                    Add
                  </button>
                </div>
                <div className="col-lg-12 margin-top-15">
                  <AlgaehDataGrid
                    id="dep-ids-grid"
                    columns={[
                      {
                        //   textField: "name",
                        // valueField: "value",
                        // data: variableJson.DEPENDENT_TYPE
                        fieldName: "dependent_type",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Dependent Type" }}
                          />
                        ),
                        displayTemplate: row => {
                          let display = variableJson.DEPENDENT_TYPE.filter(
                            f => f.value === row.dependent_type
                          );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].name
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          let display = variableJson.DEPENDENT_TYPE.filter(
                            f => f.value === row.dependent_type
                          );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].name
                                : ""}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "dependent_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Dependent Name" }}
                          />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                value: row.dependent_name,
                                className: "txt-fld",
                                name: "dependent_name",
                                events: {
                                  onChange: onchangegridcol.bind(
                                    this,
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
                        fieldName: "dependent_identity_type",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "ID Card Type" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.idtypes === undefined
                              ? []
                              : this.props.idtypes.filter(
                                  f =>
                                    f.hims_d_identity_document_id ===
                                    row.dependent_identity_type
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].identity_document_name
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          let display =
                            this.props.idtypes === undefined
                              ? []
                              : this.props.idtypes.filter(
                                  f =>
                                    f.hims_d_identity_document_id ===
                                    row.dependent_identity_type
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].identity_document_name
                                : ""}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "dependent_identity_no",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "ID Number" }} />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                value: row.dependent_identity_no,
                                className: "txt-fld",
                                name: "dependent_identity_no",
                                events: {
                                  onChange: onchangegridcol.bind(
                                    this,
                                    this,
                                    row
                                  )
                                }
                              }}
                            />
                          );
                        }
                      }
                    ]}
                    keyId="dependent_type"
                    dataSource={{ data: this.state.dependentDetails }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 5 }}
                    events={{
                      onDelete: deleteDependencies.bind(this, this),
                      onEdit: row => {},
                      onDone: updateDependencies.bind(this, this)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  return {
    idtypes: state.idtypes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getIDTypes: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FamilyAndIdentification)
);
