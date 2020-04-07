import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import "./AddReciptForm.scss";
import "./../../../../styles/site.scss";

import { maxCharactersLeft } from "../../../../utils/algaehApiCall";
import MyContext from "../../../../utils/MyContext";
import { AlgaehActions } from "../../../../actions/algaehActions";

import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import {
  texthandle,
  textAreaEvent
} from "./AddReciptFormHandaler";

class AddReciptForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorInCash: false,
      errorInCard: false,
      errorInCheck: false
    };
    this.cancel_remarks_MaxLength = 200;
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.BillingIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.BillingIOputs);
  }

  componentDidMount() {
    if (this.props.counters === undefined || this.props.counters.length === 0) {
      this.props.getCounters({
        uri: "/shiftAndCounter/getCounterMaster",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "CTRY_GET_DATA",
          mappingName: "counters"
        }
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-add-recipt-form">
              <div className="container-fluid">
                <div className="row secondary-box-container">
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "receipt_number"
                      }}
                    />
                    <h6>
                      {this.state.receipt_number
                        ? this.state.receipt_number
                        : "Not Generated"}
                    </h6>
                  </div>
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "receipt_date"
                      }}
                    />
                    <h6>
                      {this.state.receipt_date
                        ? moment(this.state.receipt_date).format("DD-MM-YYYY")
                        : "DD/MM/YYYY"}
                    </h6>
                  </div>
                  {/*<AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "counter_id",
                      isImp: true
                    }}
                    selector={{
                      name: "counter_id",
                      className: "select-fld",
                      value: this.state.counter_id,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "counter_description"
                            : "arabic_name",
                        valueField: "hims_d_counter_id",
                        data: this.props.counters
                      },
                      others: {
                        disabled: this.state.Billexists
                      },
                      onChange: countertexthandle.bind(this, this, context)
                    }}
                  />*/}

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "shift_id",
                      isImp: true
                    }}
                    selector={{
                      name: "shift_id",
                      className: "select-fld",
                      value: this.state.shift_id,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "shift_description"
                            : "arabic_name",
                        valueField: "shift_id",
                        data: this.state.shift_assinged
                      },
                      others: {
                        disabled: this.state.Billexists
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                </div>
                <hr />

                {/* Payment Type */}
                {/* Cash */}
                <div className="row secondary-box-container">
                  <div
                    className="customCheckbox col-2"
                    style={{ border: "none", marginTop: "28px" }}
                  >
                    <label className="checkbox" style={{ color: "#212529" }}>
                      <input
                        type="checkbox"
                        name="Pay by Cash"
                        checked={this.state.Cashchecked}
                        // onChange={checkcashhandaler.bind(this, this, context)}
                        disabled={true}
                      />

                      <span style={{ fontSize: "0.8rem" }}>Pay by Cash</span>
                    </label>
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-2" }}
                    label={{
                      fieldName: "amount",
                      isImp: true
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      disabled: !this.state.Cashchecked,
                      className: "txt-fld",
                      name: "cash_amount",
                      error: this.state.errorInCash,
                      value: this.state.cash_amount,

                      others: {
                        disabled: true,
                        placeholder: "0.00"
                      }
                    }}
                  />

                  <div className="col-8">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Cancellation Reason",
                        isImp: true
                      }}
                    />
                    <textarea
                      value={
                        this.state.cancel_remarks === null
                          ? ""
                          : this.state.cancel_remarks
                      }
                      name="cancel_remarks"
                      onChange={textAreaEvent.bind(this, this, context)}
                      maxLength={this.cancel_remarks_MaxLength}
                    />

                    <small className="float-right">
                      Max Char.{" "}
                      {maxCharactersLeft(
                        this.cancel_remarks_MaxLength,
                        this.state.cancel_remarks
                      )}
                      /{this.cancel_remarks_MaxLength}
                    </small>
                  </div>
                </div>
              </div>
              <br />
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
    // return <div className="">Recipt Details</div>;
  }
}

function mapStateToProps(state) {
  return {
    counters: state.counters
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getCounters: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddReciptForm)
);
