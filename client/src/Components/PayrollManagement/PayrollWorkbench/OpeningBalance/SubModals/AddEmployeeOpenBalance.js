import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import moment from "moment";
import "./../../../../../styles/site.scss";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlgaehModalPopUp
} from "../../../../Wrapper/algaehWrapper";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../../../../utils/algaehApiCall.js";
import { AlgaehActions } from "../../../../../actions/algaehActions";
import AddEmployeeBalanceEvent from "./AddEmployeeBalanceEvent";
import GlobalVariables from "../../../../../utils/GlobalVariables.json";

const all_functions = AddEmployeeBalanceEvent();

class AddEmployeeOpenBalance extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      employee_name: null,
      hims_d_employee_id: null,
      close_balance: null,
      leave_days: null,
      airticket_amount: null,
      leave_salary_amount: null,
      airfare_months: null,
      month: moment(new Date()).format("M"),
      gratuity_amount: null
    };
  }

  onClose = e => {
    this.setState(
      {
        employee_name: null,
        hims_d_employee_id: null,
        close_balance: null,
        leave_days: null,
        airticket_amount: null,
        leave_salary_amount: null,
        airfare_months: null,
        month: moment(new Date()).format("M"),
        gratuity_amount: null
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };

  texthandle(e) {
    all_functions.texthandle(this, e);
  }

  employeeSearch() {
    all_functions.employeeSearch(this);
  }

  SaveData() {
    all_functions.SaveData(this);
  }

  render() {
    debugger;
    return (
      <div>
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.show}
        >
          <div className="col-lg-12 popupInner">
            <div className="row">
              <div className="col-4 globalSearchCntr">
                <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
                <h6 onClick={this.employeeSearch.bind(this)}>
                  {this.state.employee_name
                    ? this.state.employee_name
                    : "Search Employee"}
                  <i className="fas fa-search fa-lg" />
                </h6>
              </div>
            </div>
            {this.props.selected_type === "LS" ? (
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Leave Balance",
                    isImp: true
                  }}
                  textBox={{
                    number: {
                      allowNegative: false,
                      thousandSeparator: ","
                    },
                    dontAllowKeys: ["-", "e"],
                    value: this.state.leave_days,
                    className: "txt-fld",
                    name: "leave_days",
                    events: {
                      onChange: this.texthandle.bind(this)
                    },
                    others: {
                      placeholder: "0.00"
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Leave Amount",
                    isImp: true
                  }}
                  textBox={{
                    number: {
                      allowNegative: false,
                      thousandSeparator: ","
                    },
                    dontAllowKeys: ["-", "e"],
                    value: this.state.leave_salary_amount,
                    className: "txt-fld",
                    name: "leave_salary_amount",
                    events: {
                      onChange: this.texthandle.bind(this)
                    },
                    others: {
                      placeholder: "0.00"
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Airticket Amount"
                  }}
                  textBox={{
                    number: {
                      allowNegative: false,
                      thousandSeparator: ","
                    },
                    dontAllowKeys: ["-", "e"],
                    value: this.state.airticket_amount,
                    className: "txt-fld",
                    name: "airticket_amount",
                    events: {
                      onChange: this.texthandle.bind(this)
                    },
                    others: {
                      placeholder: "0.00"
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Airfare Months"
                  }}
                  textBox={{
                    number: {
                      allowNegative: false,
                      thousandSeparator: ","
                    },
                    dontAllowKeys: ["-", "e", "."],
                    value: this.state.airfare_months,
                    className: "txt-fld",
                    name: "airfare_months",
                    events: {
                      onChange: this.texthandle.bind(this)
                    },
                    others: {
                      placeholder: "0"
                    }
                  }}
                />
              </div>
            ) : this.props.selected_type === "GR" ? (
              <div className="row">
                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Gratuity Till Year" }} />
                  <h6>{this.props.year ? this.props.year : "----------"}</h6>
                </div>
                <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{
                    forceLabel: "Gratuity Till Month.",
                    isImp: true
                  }}
                  selector={{
                    sort: "off",
                    name: "month",
                    className: "select-fld",
                    value: this.state.month,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.MONTHS
                    },
                    onChange: this.texthandle.bind(this),
                    onClear: () => {
                      this.setState({
                        month: null
                      });
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Gratuity Amount",
                    isImp: true
                  }}
                  textBox={{
                    number: {
                      allowNegative: false,
                      thousandSeparator: ","
                    },
                    dontAllowKeys: ["-", "e"],
                    value: this.state.gratuity_amount,
                    className: "txt-fld",
                    name: "gratuity_amount",
                    events: {
                      onChange: this.texthandle.bind(this)
                    },
                    others: {
                      placeholder: "0.00"
                    }
                  }}
                />
              </div>
            ) : null}
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.SaveData.bind(this)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={e => {
                      this.onClose(e);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    shifts: state.shifts
    // counters: state.counters
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getShifts: AlgaehActions
      // getCounters: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddEmployeeOpenBalance)
);
