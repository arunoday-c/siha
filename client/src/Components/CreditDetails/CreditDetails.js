import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReciptDetails from "./ReciptDetails/AddReciptForm";
import { AlgaehActions } from "../../actions/algaehActions";
import "./CreditDetails.scss";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup
} from "../Wrapper/algaehWrapper";
import MyContext from "../../utils/MyContext.js";
import {
  writeOffhandle,
  EditGrid,
  CancelGrid,
  deleteCridetSettlement,
  updateCridetSettlement,
  includeHandler,
  onchangegridcol
} from "./CreditDetailsEvent";
import { getAmountFormart } from "../../utils/GlobalFunctions";
import { swalMessage } from "../../utils/algaehApiCall";

class CreditDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let InputOutput = this.props.SettlementIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.SettlementIOputs);
  }

  changeText(context, e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
    if (context !== null) {
      context.updateState({
        [name]: value
      });
    }
  }

  checkRemarks(e) {
    e.preventDefault();
    if (e.target.value) {
      if (!this.state.remarks) {
        swalMessage({
          title: "Please Enter Remarks",
          type: "warning"
        });
        document.getElementsByName("remarks")[0].focus();
      }
    }
  }

  render() {
    const check_header = this.props.fromPos
      ? "hims_f_pos_credit_header_id"
      : "hims_f_credit_header_id";
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-display-patient-form">
              <div className="portlet portlet-bordered margin-bottom-15">
                {/* <div className="portlet-body" id="initialStockCntr"> */}
                <AlgaehDataGrid
                  id="Bill_details"
                  columns={[
                    {
                      fieldName: "include",
                      label: <AlgaehLabel label={{ fieldName: "include" }} />,
                      // displayTemplate: row => {
                      //   let displayElement;
                      //   if (row.include === "Y") {
                      //     displayElement = "Yes";
                      //   } else if (row.include === "N") {
                      //     displayElement = "No";
                      //   } else {
                      //     displayElement = "---";
                      //   }
                      //   return <span>{displayElement}</span>;
                      // },
                      displayTemplate: row => {
                        return (
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              value="Front Desk"
                              onChange={includeHandler.bind(
                                this,
                                this,
                                context,
                                row
                              )}
                              checked={row.include === "Y" ? true : false}
                              disabled={this.state[check_header] !== null}
                            />
                          </label>
                        );
                      }
                    },

                    {
                      fieldName: "bill_number",
                      label: (
                        <AlgaehLabel label={{ fieldName: "bill_number" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "bill_amount",
                      label: (
                        <AlgaehLabel label={{ fieldName: "bill_amount" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "credit_amount",
                      label: (
                        <AlgaehLabel label={{ fieldName: "credit_amount" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "previous_balance",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "previous_balance" }}
                        />
                      ),
                      disabled: true
                    },

                    {
                      fieldName: "receipt_amount",
                      label: (
                        <AlgaehLabel label={{ fieldName: "receipt_amount" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              value: row.receipt_amount,
                              disabled:
                                this.state[check_header] !== null ||
                                row.include !== "Y",
                              decimal: {
                                allowNegative: false
                              },
                              className: "txt-fld",
                              name: "receipt_amount",
                              events: {
                                onChange: onchangegridcol.bind(
                                  this,
                                  this,
                                  context,
                                  row
                                )
                              },
                              others: {
                                placeholder: "0.00"
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "balance_amount",
                      label: (
                        <AlgaehLabel label={{ fieldName: "balance_amount" }} />
                      ),
                      disabled: true
                    }
                  ]}
                  keyId="service_type_id"
                  dataSource={{
                    data: this.state.criedtdetails
                  }}
                  // isEditable={!this.state.Billexists}
                  paging={{ page: 0, rowsPerPage: 5 }}
                  // byForceEvents={true}
                  // events={{
                  //   onDelete: deleteCridetSettlement.bind(this, this, context),
                  //   onEdit: EditGrid.bind(this, this, context),
                  //   onCancel: CancelGrid.bind(this, this, context),
                  //   onDone: updateCridetSettlement.bind(this, this, context)
                  // }}
                />
                {/* </div> */}
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-lg-6" }}
                    label={{
                      fieldName: "remarks",
                      isImp: this.state.write_off_amount ? true : false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "remarks",
                      value: this.state.remarks,
                      events: {
                        onChange: this.changeText.bind(this, context)
                      },
                      others: {
                        disabled:
                          this.state.Billexists || !this.state.receipt_amount
                      }
                    }}
                  />

                  <div className="col-lg-2">
                    <AlgaehLabel
                      label={{
                        fieldName: "receipt_amount"
                        // forceLabel: "hgjhghj"
                      }}
                    />
                    <h6>{getAmountFormart(this.state.receipt_amount)}</h6>
                  </div>

                  <AlagehFormGroup
                    div={{ className: "col-2" }}
                    label={{
                      fieldName: "write_off_amount"
                    }}
                    textBox={{
                      decimal: {
                        allowNegative: false
                      },
                      className: "txt-fld",
                      name: "write_off_amount",
                      value: this.state.write_off_amount,
                      events: {
                        onChange: writeOffhandle.bind(this, this, context)
                      },
                      others: {
                        disabled:
                          this.state.Billexists || !this.state.receipt_amount
                        // onBlur: this.checkRemarks.bind(this)
                      }
                    }}
                  />

                  <div className="col-lg-2">
                    <AlgaehLabel
                      label={{
                        fieldName: "recievable_amount"
                      }}
                    />
                    <h6>{getAmountFormart(this.state.recievable_amount)}</h6>
                  </div>
                </div>

                {/* <div className="row" /> */}
                <ReciptDetails SettlementIOputs={this.props.SettlementIOputs} />
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
    patienttype: state.patienttype
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientType: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CreditDetails)
);
