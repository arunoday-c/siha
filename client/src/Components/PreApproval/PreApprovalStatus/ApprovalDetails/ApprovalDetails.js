import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";

import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";

import {
  texthandle,
  datehandle,
  numberhandle,
  dateValidate
} from "./ApprovalDetailsEvents";

import GlobalVariables from "../../../../utils/GlobalVariables.json";
import "./../../../../styles/site.scss";
import "./ApprovalDetails.scss";
import MyContext from "../../../../utils/MyContext.js";
import Options from "../../../../Options.json";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";

class PatientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestDeatils: []
    };
  }

  SubmitRequest(e) {
    this.props.onClose && this.props.onClose(e);
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };
  componentWillMount() {
    let InputOutput = this.props.selected_services;
    this.setState({ ...this.state, ...InputOutput });
  }
  componentWillReceiveProps(newProps) {
    this.setState(newProps.selected_services);
  }

  changeDateFormat = date => {
    if (date !== null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div>
              <h6 className="popSubHdg">Approval Details</h6>

              <div className="row">
                <div className="col-lg-12">
                  <AlgaehDataGrid
                    id="approval_services_grd"
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
                        disabled: true,
                        others: { minWidth: 250 }
                      },
                      {
                        fieldName: "requested_quantity",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Requested Qty" }}
                          />
                        ),
                        others: {
                          show: this.props.openFrom === "M" ? true : false
                        },
                        disabled: true
                      },
                      {
                        fieldName: "approved_qty",
                        label: (
                          <AlgaehLabel label={{ fieldName: "qty_appr" }} />
                        ),
                        others: {
                          show: this.props.openFrom === "M" ? true : false
                        },
                        displayTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                value: row.approved_qty,
                                className: "txt-fld",
                                name: "approved_qty",
                                number: {
                                  thousandSeparator: ",",
                                  allowNegative: false
                                },
                                dontAllowKeys: ["-", "e", "."],
                                events: {
                                  onChange: numberhandle.bind(
                                    this,
                                    this,
                                    row,
                                    context
                                  )
                                },
                                others: {
                                  disabled:
                                    this.props.openFrom === "M"
                                      ? row.billing_updated === "Y"
                                        ? true
                                        : false
                                      : true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "requested_quantity",
                        label: (
                          <AlgaehLabel label={{ fieldName: "qty_appr" }} />
                        ),
                        others: {
                          show: this.props.openFrom === "M" ? false : true
                        },
                        displayTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                value: row.requested_quantity,
                                className: "txt-fld",
                                name: "requested_quantity",
                                number: {
                                  thousandSeparator: ",",
                                  allowNegative: false
                                },
                                dontAllowKeys: ["-", "e", "."],
                                events: {
                                  onChange: numberhandle.bind(
                                    this,
                                    this,
                                    row,
                                    context
                                  )
                                },
                                others: {
                                  disabled:
                                    this.props.openFrom === "M"
                                      ? row.billing_updated === "Y"
                                        ? true
                                        : false
                                      : true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "gross_amt",
                        label: (
                          <AlgaehLabel label={{ fieldName: "gross_amount" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {getAmountFormart(row.gross_amt, {
                                appendSymbol: false
                              })}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <span>
                              {getAmountFormart(row.gross_amt, {
                                appendSymbol: false
                              })}
                            </span>
                          );
                        },
                        disabled: true
                      },
                      {
                        fieldName: "net_amount",
                        label: (
                          <AlgaehLabel label={{ fieldName: "net_amount" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {getAmountFormart(row.net_amount, {
                                appendSymbol: false
                              })}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <span>
                              {getAmountFormart(row.net_amount, {
                                appendSymbol: false
                              })}
                            </span>
                          );
                        },
                        disabled: true
                      },
                      {
                        fieldName: "apprv_status",
                        label: (
                          <AlgaehLabel label={{ fieldName: "dis_status" }} />
                        ),
                        // displayTemplate: row => {
                        //   return row.apprv_status === "NR"
                        //     ? "Not Requested"
                        //     : row.apprv_status === "AW"
                        //     ? "Awaiting Approval"
                        //     : row.apprv_status === "AP"
                        //     ? "Approved"
                        //     : "Rejected";
                        // },
                        displayTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{}}
                              selector={{
                                name: "apprv_status",
                                className: "select-fld",
                                value: row.apprv_status,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_APPSTATUS
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
                        fieldName: "approved_amount",
                        label: (
                          <AlgaehLabel label={{ fieldName: "amount_app" }} />
                        ),
                        // displayTemplate: row => {
                        //   return (
                        //     <span>
                        //       {getAmountFormart(row.approved_amount, {
                        //         appendSymbol: false
                        //       })}
                        //     </span>
                        //   );
                        // },
                        displayTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: row.approved_amount,
                                className: "txt-fld",
                                name: "approved_amount",
                                events: {
                                  onChange: numberhandle.bind(
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
                      },
                      {
                        fieldName: "approved_no",
                        label: <AlgaehLabel label={{ fieldName: "auth_no" }} />,
                        displayTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                value: row.approved_no,
                                className: "txt-fld",
                                name: "approved_no",
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
                      },
                      {
                        fieldName: "apprv_date",
                        label: (
                          <AlgaehLabel label={{ fieldName: "app_rej_date" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>{this.changeDateFormat(row.apprv_date)}</span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <span>{this.changeDateFormat(row.apprv_date)}</span>
                          );
                        }
                      },
                      {
                        fieldName: "valid_upto",
                        label: (
                          <AlgaehLabel label={{ fieldName: "valid_upto" }} />
                        ),
                        // displayTemplate: row => {
                        //   return (
                        //     <span>{this.changeDateFormat(row.valid_upto)}</span>
                        //   );
                        // },
                        displayTemplate: row => {
                          return (
                            <AlgaehDateHandler
                              div={{ className: "" }}
                              textBox={{
                                className: "txt-fld hidden",
                                name: "valid_upto"
                              }}
                              minDate={new Date()}
                              events={{
                                onChange: datehandle.bind(
                                  this,
                                  this,
                                  row,
                                  context
                                ),
                                onBlur: dateValidate.bind(
                                  this,
                                  this,
                                  row,
                                  context
                                )
                              }}
                              value={row.valid_upto}
                              disabled={
                                row.billing_updated === "Y" ? true : false
                              }
                            />
                          );
                        },
                        others: { minWidth: 135 }
                      },
                      {
                        fieldName: "apprv_remarks",
                        label: <AlgaehLabel label={{ fieldName: "remarks" }} />,
                        displayTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                value: row.apprv_remarks,
                                className: "txt-fld",
                                name: "apprv_remarks",
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
    deptanddoctors: state.deptanddoctors,
    insurarProviders: state.insurarProviders
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
