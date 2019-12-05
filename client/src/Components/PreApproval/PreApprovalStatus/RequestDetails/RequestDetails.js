import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";

import { AlgaehActions } from "../../../../actions/algaehActions";

import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../utils/GlobalVariables.json";

import "./../../../../styles/site.scss";
import "./RequestDetails.scss";
import { texthandle } from "./RequestDetailsEvents";
import MyContext from "../../../../utils/MyContext.js";
import Options from "../../../../Options.json";

class PatientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestDeatils: [],
      append: false
    };
  }

  SubmitRequest(e) {
    this.props.onClose && this.props.onClose(e);
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.selected_services;
    this.setState({ ...this.state, ...InputOutput });
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState(newProps.selected_services);
  }

  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div>
              <h6 className="popSubHdg">Request Details</h6>

              <div className="row">
                <div className="col-lg-12">
                  <AlgaehDataGrid
                    id="pre_approval_services_grd"
                    columns={[
                      {
                        fieldName: "service_code",
                        label: (
                          <AlgaehLabel label={{ fieldName: "service_code" }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "insurance_service_name",
                        label: (
                          <AlgaehLabel label={{ fieldName: "service_name" }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "requested_quantity",
                        label: (
                          <AlgaehLabel label={{ fieldName: "quantity" }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "requested_date",
                        label: (
                          <AlgaehLabel label={{ fieldName: "requesteddt" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {this.changeDateFormat(row.requested_date)}
                            </span>
                          );
                        },
                        disabled: true
                      },
                      {
                        fieldName: "requested_mode",
                        label: (
                          <AlgaehLabel label={{ fieldName: "requestedmode" }} />
                        ),
                        // displayTemplate: row => {
                        //   return row.requested_mode === "O"
                        //     ? "Online"
                        //     : row.requested_mode === "E"
                        //     ? "Email"
                        //     : row.requested_mode === "T"
                        //     ? "Telephone"
                        //     : "Fax";
                        // },
                        displayTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{}}
                              selector={{
                                name: "requested_mode",
                                className: "select-fld",
                                value: row.requested_mode,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_REQMODE
                                },
                                onChange: texthandle.bind(
                                  this,
                                  this,
                                  row,
                                  context
                                ),
                                others: {
                                  disabled:
                                    row.billing_updated === "Y" ? true : false
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "refer_no",
                        label: (
                          <AlgaehLabel label={{ fieldName: "refereneceno" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                value: row.refer_no,
                                className: "txt-fld",
                                name: "refer_no",
                                events: {
                                  onChange: texthandle.bind(
                                    this,
                                    this,
                                    row,
                                    context
                                  )
                                },
                                others: {
                                  disabled:
                                    row.billing_updated === "Y" ? true : false
                                }
                              }}
                            />
                          );
                        }
                      }
                    ]}
                    keyId="visit_code"
                    dataSource={{
                      data: this.state.services_details
                    }}
                    isEditable={false}
                    actions={{ allowDelete: false }}
                    paging={{ page: 0, rowsPerPage: 5 }}
                    events={{
                      onEdit: row => {},
                      onDone: row => {}
                    }}
                  />
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
    deptanddoctors: state.deptanddoctors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDepartmentsandDoctors: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PatientDetails)
);
