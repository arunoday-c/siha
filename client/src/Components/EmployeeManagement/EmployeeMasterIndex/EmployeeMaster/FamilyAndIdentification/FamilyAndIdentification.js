import React, { PureComponent } from "react";
import "./FamilyAndIdentification.css";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../../Wrapper/algaehWrapper";
import variableJson from "../../../../../utils/GlobalVariables.json";
import { algaehApiCall } from "../../../../../utils/algaehApiCall";
import MyContext from "../../../../../utils/MyContext.js";
import {
  texthandle,
  datehandle,
  AddEmpId,
  addDependentType
} from "./FamilyAndIdentificationEvent";
import { AlgaehActions } from "../../../../../actions/algaehActions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { swalMessage } from "../../../../../utils/algaehApiCall";
import moment from "moment";

class FamilyAndIdentification extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getEmployeeIdentification() {
    algaehApiCall({
      uri: "/employee/getEmployeeIdentification",
      method: "GET",
      data: {
        employee_id: this.state.hims_d_employee_id
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            employee_ids: res.data.records
          });
        }
      },
      onFailure: err => {}
    });
  }

  componentWillMount() {
    let InputOutput = this.props.EmpMasterIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    let InputOutput = this.props.EmpMasterIOputs;
    this.setState(
      { ...this.state, ...InputOutput }

      //   , () => {
      //   this.state.hims_d_employee_id !== null
      //     ? this.getEmployeeIdentification()
      //     : null;
      // }
    );

    if (this.props.idtypes === undefined || this.props.idtypes.length === 0) {
      this.props.getIDTypes({
        uri: "/identity/get",
        method: "GET",
        redux: {
          type: "IDTYPE_GET_DATA",
          mappingName: "idtypes"
        }
      });
    }
  }

  // addEmployeeIdentification() {
  //   algaehApiCall({
  //     uri: "/employee/addEmployeeIdentification",
  //     method: "POST",
  //     data: {
  //       employee_id: this.state.hims_d_employee_id,
  //       identity_documents_id: this.state.identity_documents_id,
  //       identity_number: this.state.identity_number,
  //       valid_upto: this.state.valid_upto,
  //       issue_date: this.state.issue_date
  //       // alert_required : this.state.alert_required,
  //       // alert_date : this.state.alert_date
  //     },
  //     onSuccess: res => {
  //       if (res.data.success) {
  //         this.getEmployeeIdentification();
  //         swalMessage({
  //           title: "Record added successfully",
  //           type: "success"
  //         });
  //       }
  //     },
  //     onFailure: err => {
  //       swalMessage({
  //         title: err.message,
  //         type: "error"
  //       });
  //     }
  //   });
  // }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-add-employee-form popRightDiv">
              <div className="row">
                <div className="col-12">
                  <h5>
                    <span>Identification Details</span>
                  </h5>
                  <div className="row paddin-bottom-5">
                    <AlagehAutoComplete
                      div={{ className: "col-2" }}
                      label={{
                        forceLabel: "Id Type",
                        isImp: false
                      }}
                      selector={{
                        name: "identity_documents_id",
                        className: "select-fld",
                        value: this.state.identity_documents_id,
                        dataSource: {
                          textField:
                            this.state.selectedLang === "en"
                              ? "identity_document_name"
                              : "arabic_identity_document_name",
                          valueField: "hims_d_identity_document_id",
                          data: this.props.idtypes
                        },
                        onChange: texthandle.bind(this, this, context),
                        others: {
                          tabIndex: "1"
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-2" }}
                      label={{
                        forceLabel: "Id Number",
                        isImp: false
                      }}
                      textBox={{
                        value: this.state.identity_number,
                        className: "txt-fld",
                        name: "identity_number",

                        events: {
                          onChange: texthandle.bind(this, this, context)
                        },
                        others: {
                          tabIndex: "2",
                          placeholder: "",
                          type: "number"
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
                        //onChange: datehandle.bind(this, this, context)
                        onChange: selDate => {
                          this.setState({
                            issue_date: moment(selDate).format("YYYY-MM-DD")
                          });
                        }
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
                        //onChange: datehandle.bind(this, this, context)
                        onChange: selDate => {
                          this.setState({
                            valid_upto: moment(selDate).format("YYYY-MM-DD")
                          });
                        }
                      }}
                      value={this.state.valid_upto}
                    />
                    <div className="col">
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginTop: 21 }}
                        onClick={AddEmpId.bind(this, this, context)}
                      >
                        Add
                      </button>
                    </div>

                    <div className="col-lg-12 margin-top-15">
                      <AlgaehDataGrid
                        data-validate="empIdGrid"
                        id="employee-ids-grid"
                        columns={[
                          {
                            fieldName: "identity_documents_id",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "ID Type" }} />
                            )
                          },
                          {
                            fieldName: "identity_number",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "ID Number" }}
                              />
                            )
                          },
                          {
                            fieldName: "issue_date",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Issue Date" }}
                              />
                            )
                          },
                          {
                            fieldName: "valid_upto",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Valid Upto" }}
                              />
                            )
                          }
                        ]}
                        keyId="service_code"
                        dataSource={{
                          data: this.state.idDetails
                          //data: []
                        }}
                        isEditable={true}
                        paging={{ page: 0, rowsPerPage: 5 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <h5>
                    <span>Family Details</span>
                  </h5>
                  <div className="row paddin-bottom-5">
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Dependent Type",
                        isImp: false
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
                        onChange: texthandle.bind(this, this, context),
                        others: {
                          // tabIndex: "10"
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
                          onChange: texthandle.bind(this, this, context)
                        },
                        others: {
                          //tabIndex: "1"
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-2" }}
                      label={{
                        forceLabel: "Id Type",
                        isImp: false
                      }}
                      selector={{
                        name: "dependent_identity_type",
                        className: "select-fld",
                        value: this.state.dependent_identity_type,
                        dataSource: {
                          textField:
                            this.state.selectedLang === "en"
                              ? "identity_document_name"
                              : "arabic_identity_document_name",
                          valueField: "hims_d_identity_document_id",
                          data: this.props.idtypes
                        },
                        onChange: texthandle.bind(this, this, context),
                        others: {
                          //tabIndex: "1"
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Id Number",
                        isImp: false
                      }}
                      textBox={{
                        value: this.state.dependent_identity_no,
                        className: "txt-fld",
                        name: "dependent_identity_no",

                        events: {
                          onChange: texthandle.bind(this, this, context)
                        },
                        others: {
                          //   tabIndex: "7"
                        }
                      }}
                    />
                    <div className="col">
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginTop: 21 }}
                        onClick={addDependentType.bind(this, this, context)}
                      >
                        Add
                      </button>
                    </div>
                    <div className="col-lg-12 margin-top-15">
                      <AlgaehDataGrid
                        data-validate="dependentGrid"
                        id="dep-ids-grid"
                        columns={[
                          {
                            fieldName: "dependent_type",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Dependent Type" }}
                              />
                            )
                          },
                          {
                            fieldName: "dependent_name",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Dependent Name" }}
                              />
                            )
                          },
                          {
                            fieldName: "dependent_identity_type",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "ID Card Type" }}
                              />
                            )
                          },
                          {
                            fieldName: "dependent_identity_no",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "ID Number" }}
                              />
                            )
                          }
                        ]}
                        keyId="dependent_identity_no"
                        dataSource={{
                          data: this.state.dependentDetails
                        }}
                        isEditable={true}
                        paging={{ page: 0, rowsPerPage: 5 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </MyContext.Consumer>
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
