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
import { AlgaehActions } from "../../../../../actions/algaehActions";
import AddEmployeeBalanceEvent from "./AddEmployeeBalanceEvent";
import GlobalVariables from "../../../../../utils/GlobalVariables.json";
import { getYears } from "../../../../../utils/GlobalFunctions";

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
      gratuity_amount: null,
      loan_id: null,
      pending_loan: null,
      installment_amount: null,
      pending_tenure: null,
      loan_application_date: null,
      start_year: parseInt(moment().year(), 10),
      start_month: null,
      hospital_id: null
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
        gratuity_amount: null,
        loan_id: null,
        pending_loan: null,
        installment_amount: null,
        pending_tenure: null,
        loan_application_date: null,
        start_year: parseInt(moment().year(), 10),
        start_month: null,
        hospital_id: null
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
    let allYears = getYears();
    return (
      <div>
        <AlgaehModalPopUp
          class="addOpenBaln"
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.show}
        >
          <div className="col-lg-12 popupInner" style={{ paddingTop: 15 }}>
            <div className="row">
              <div className="col-12  globalSearchCntr form-group">
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
                  div={{ className: "col-6  form-group mandatory" }}
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
                  div={{ className: "col-6  form-group mandatory" }}
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
                  div={{ className: "col-6  form-group" }}
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
                  div={{ className: "col-6  form-group" }}
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
                <div className="col-12  form-group">
                  <AlgaehLabel label={{ forceLabel: "Gratuity Till Year" }} />
                  <h6>{this.props.year ? this.props.year : "----------"}</h6>
                </div>
                <AlagehAutoComplete
                  div={{ className: "col-7  form-group mandatory" }}
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
                  div={{ className: "col-5  form-group mandatory" }}
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
            ) : this.props.selected_type === "LO" ? (
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-6 form-group mandatory" }}
                  label={{
                    forceLabel: "Select Loan.",
                    isImp: true
                  }}
                  selector={{
                    sort: "off",
                    name: "loan_id",
                    className: "select-fld",
                    value: this.state.loan_id,
                    dataSource: {
                      textField: "loan_description",
                      valueField: "hims_d_loan_id",
                      data: this.props.loan_master
                    },
                    onChange: this.texthandle.bind(this),
                    onClear: () => {
                      this.setState({
                        loan_id: null
                      });
                    }
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-6 form-group mandatory" }}
                  label={{
                    forceLabel: "Start Year.",
                    isImp: true
                  }}
                  selector={{
                    name: "start_year",
                    className: "select-fld",
                    value: this.state.start_year,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: allYears
                    },
                    onChange: this.texthandle.bind(this),
                    onClear: () => {
                      this.setState({
                        start_year: null
                      });
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-6 form-group mandatory" }}
                  label={{
                    forceLabel: "Start Month",
                    isImp: true
                  }}
                  selector={{
                    sort: "off",
                    name: "start_month",
                    className: "select-fld",
                    value: this.state.start_month,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.MONTHS
                    },
                    onChange: this.texthandle.bind(this),
                    onClear: () => {
                      this.setState({
                        start_month: null
                      });
                    }
                  }}
                />

                <AlgaehDateHandler
                  div={{ className: "col-6 form-group mandatory" }}
                  label={{
                    forceLabel: "Loan Applied",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "loan_application_date"
                  }}
                  maxDate={new Date()}
                  events={{
                    onChange: (ctrl, e) => {
                      this.setState({
                        [e]: moment(ctrl)._d
                      });
                    }
                  }}
                  value={this.state.loan_application_date}
                />

                <AlagehFormGroup
                  div={{ className: "col-6  form-group mandatory" }}
                  label={{
                    forceLabel: "Pending Loan",
                    isImp: true
                  }}
                  textBox={{
                    number: {
                      allowNegative: false,
                      thousandSeparator: ","
                    },
                    dontAllowKeys: ["-", "e"],
                    value: this.state.pending_loan,
                    className: "txt-fld",
                    name: "pending_loan",
                    events: {
                      onChange: this.texthandle.bind(this)
                    },
                    others: {
                      placeholder: "0.00"
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-6  form-group mandatory" }}
                  label={{
                    forceLabel: "Installment Amount",
                    isImp: true
                  }}
                  textBox={{
                    number: {
                      allowNegative: false,
                      thousandSeparator: ","
                    },
                    dontAllowKeys: ["-", "e"],
                    value: this.state.installment_amount,
                    className: "txt-fld",
                    name: "installment_amount",
                    events: {
                      onChange: this.texthandle.bind(this)
                    },
                    others: {
                      placeholder: "0.00"
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-6  form-group mandatory" }}
                  label={{
                    forceLabel: "Pending Tenure",
                    isImp: true
                  }}
                  textBox={{
                    number: {
                      allowNegative: false,
                      thousandSeparator: ","
                    },
                    dontAllowKeys: ["-", "e"],
                    value: this.state.pending_tenure,
                    className: "txt-fld",
                    name: "pending_tenure",
                    events: {
                      onChange: this.texthandle.bind(this)
                    },
                    others: {
                      placeholder: "0"
                    }
                  }}
                />
              </div>
            ) : null}
          </div>
          <div className="col-12 popupFooter">
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
