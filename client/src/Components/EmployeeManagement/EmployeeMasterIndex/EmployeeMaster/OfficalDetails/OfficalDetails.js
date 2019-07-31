import React, { Component } from "react";
import "./OfficalDetails.css";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../../../Wrapper/algaehWrapper";

import variableJson from "../../../../../utils/GlobalVariables.json";
import {
  texthandle,
  datehandle,
  accomodationProvided,
  employeeStatusHandler,
  dateFormater,
  bankEventhandle
} from "./OfficalDetailsEvent.js";
import { AlgaehActions } from "../../../../../actions/algaehActions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCookie } from "../../../../../utils/algaehApiCall";
class OfficalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enable_active_status: "",
      date_of_releaving_label: "Date of leaving",
      accomodation_provided: false,
      reliving_date: undefined,
      // employee_status: null,
      inactive_date: undefined,
      selectedLang: getCookie("Language")
    };
  }

  componentDidMount() {
    let InputOutput = this.props.EmpMasterIOputs.state.personalDetails;
    this.setState({ ...this.state, ...InputOutput });
    if (this.props.banks === undefined || this.props.banks.length === 0) {
      this.props.getBanks({
        uri: "/bankmaster/getBank",
        data: { active_status: "A" },
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "BANK_GET_DATA",
          mappingName: "banks"
        }
      });
    }
    if (
      this.props.companyaccount === undefined ||
      this.props.companyaccount.length === 0
    ) {
      this.props.getCompanyAccount({
        uri: "/companyAccount/getCompanyAccount",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "COMPANY_ACC_DATA",
          mappingName: "companyaccount"
        }
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="hptl-phase1-add-employee-form popRightDiv"
          data-validate="empOffical"
        >
          <div className="row">
            <div
              className="col-lg-8 primary-details"
              style={{ paddingBottom: 0, minHeight: "66.5vh" }}
            >
              <h5>
                <span>Joining Details</span>
              </h5>
              <div className="row paddin-bottom-5">
                <AlgaehDateHandler
                  div={{ className: "col mandatory" }}
                  label={{
                    fieldName: "date_of_joining",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "date_of_joining",
                    others: {
                      tabIndex: "1"
                    }
                  }}
                  events={{
                    onChange: datehandle.bind(this, this)
                  }}
                  value={this.state.date_of_joining}
                />
                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    forceLabel: "Appointemt Type",
                    isImp: true
                  }}
                  selector={{
                    name: "appointment_type",
                    className: "select-fld",
                    value: this.state.appointment_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: variableJson.EMP_APPT_TYPE
                    },
                    onChange: texthandle.bind(this, this),
                    others: {
                      tabIndex: "2"
                    },
                    onClear: () => {
                      this.setState({
                        appointment_type: null
                      });
                    }
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    forceLabel: "Employee Type",
                    isImp: true
                  }}
                  selector={{
                    name: "employee_type",
                    className: "select-fld",
                    value: this.state.employee_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: variableJson.EMPLOYEE_TYPE
                    },
                    onChange: texthandle.bind(this, this),
                    others: {
                      tabIndex: "3"
                    },
                    onClear: () => {
                      this.setState({
                        employee_type: null
                      });
                    }
                  }}
                />

                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Department"
                    }}
                  />
                  <h6>
                    {this.state.department_name === null ||
                    this.state.department_name === undefined
                      ? "------"
                      : this.state.department_name}
                  </h6>
                </div>
                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    forceLabel: "Sub Department",
                    isImp: true
                  }}
                  selector={{
                    name: "sub_department_id",
                    className: "select-fld",
                    value: this.state.sub_department_id,

                    dataSource: {
                      textField: "sub_department_name",
                      valueField: "hims_d_sub_department_id",
                      data: this.props.subdepartment
                    },

                    onChange: texthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        sub_department_id: null
                      });
                    }
                  }}
                />
              </div>

              <h5>
                <span>Relieving Details</span>
              </h5>
              <div className="row paddin-bottom-5">
                <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{
                    forceLabel:
                      this.state.employee_status === "A" ||
                      this.state.employee_status === "I"
                        ? "Date of leaving"
                        : this.state.employee_status === "R"
                        ? "Date of Resigned"
                        : this.state.employee_status === "T"
                        ? "Date of Terminating"
                        : this.state.employee_status === "E"
                        ? "Date of Retirement"
                        : "",
                    isImp:
                      this.state.employee_status === "R" ||
                      this.state.employee_status === "T"
                        ? true
                        : false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "date_of_resignation",
                    others: {
                      disabled:
                        this.state.enable_active_status === "I" ? true : false
                    }
                  }}
                  // maxDate={new Date()}
                  events={{
                    onChange: datehandle.bind(this, this)
                  }}
                  value={this.state.date_of_resignation}
                />
                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Notice Period",
                    isImp: false
                  }}
                  textBox={{
                    value: this.state.notice_period,
                    className: "txt-fld",
                    name: "notice_period",

                    events: {
                      onChange: texthandle.bind(this, this)
                    },
                    others: {
                      tabIndex: "7",
                      type: "number"
                    }
                  }}
                />
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Relieving Date"
                    }}
                  />
                  <h6>
                    {this.state.reliving_date === null ||
                    this.state.reliving_date === undefined
                      ? "DD/MM/YYYY"
                      : dateFormater(this, this.state.reliving_date)}
                  </h6>
                </div>
                <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{ forceLabel: "Date of Exit" }}
                  textBox={{
                    className: "txt-fld",
                    name: "exit_date"
                  }}
                  minDate={this.state.date_of_resignation}
                  events={{
                    onChange: datehandle.bind(this, this)
                  }}
                  value={this.state.exit_date}
                />
                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    forceLabel: "Employee Status",
                    isImp: true
                  }}
                  selector={{
                    name: "title_id",
                    className: "select-fld",
                    value: this.state.employee_status,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: variableJson.EMPLOYEE_STATUS
                    },
                    onChange: employeeStatusHandler.bind(this, this),

                    onClear: () => {
                      this.setState({
                        employee_status: null
                      });
                    }
                  }}
                />
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Inactive Date"
                    }}
                  />
                  <h6>
                    {this.state.inactive_date === null ||
                    this.state.inactive_date === undefined
                      ? "DD/MM/YYYY"
                      : dateFormater(this, this.state.inactive_date)}
                  </h6>
                </div>
              </div>
              <h5>
                <span>Accomodation Details</span>
              </h5>
              <div className="row paddin-bottom-5">
                <div className="col customCheckbox" style={{ border: "none" }}>
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="accomodation_provided"
                      checked={
                        this.state.accomodation_provided === "Y" ? true : false
                      }
                      onChange={accomodationProvided.bind(this, this)}
                    />
                    <span>
                      <AlgaehLabel
                        label={{ forceLabel: "Accomodation Provided" }}
                      />
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 secondary-details"
              style={{ paddingBottom: 0, minHeight: "66.5vh" }}
            >
              <h5>
                <span>Employee Bank Details</span>
              </h5>
              <div className="row paddin-bottom-5">
                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    forceLabel: "Select Employee Bank",
                    isImp: true
                  }}
                  selector={{
                    name: "employee_bank_id",
                    className: "select-fld",
                    value: this.state.employee_bank_id,
                    dataSource: {
                      textField: "bank_name",
                      valueField: "hims_d_bank_id",
                      data: this.props.banks
                    },
                    onChange: bankEventhandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        employee_bank_id: null
                      });
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-6 mandatory" }}
                  label={{
                    forceLabel: "SWIFT Code",
                    isImp: true
                  }}
                  textBox={{
                    value: this.state.employee_bank_ifsc_code,
                    className: "txt-fld",
                    name: "employee_bank_ifsc_code",
                    events: {
                      onChange: texthandle.bind(this, this)
                    },
                    disabled: true
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-12 mandatory" }}
                  label={{
                    forceLabel: "Account No.",
                    isImp: true
                  }}
                  textBox={{
                    value: this.state.employee_account_number,
                    className: "txt-fld",
                    name: "employee_account_number",

                    events: {
                      onChange: texthandle.bind(this, this)
                    },
                    others: {
                      type: "number"
                    }
                  }}
                />
              </div>
              <h5>
                <span>Company Bank Details</span>
              </h5>
              <div className="row paddin-bottom-5">
                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    forceLabel: "Select Employeer Bank",
                    isImp: true
                  }}
                  selector={{
                    name: "company_bank_id",
                    className: "select-fld",
                    value: this.state.company_bank_id,
                    dataSource: {
                      textField: "bank_name",
                      valueField: "bank_id",
                      data: this.props.companyaccount
                    },
                    onChange: texthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        company_bank_id: null
                      });
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    forceLabel: "Mode of Payment",
                    isImp: true
                  }}
                  selector={{
                    name: "mode_of_payment",
                    className: "select-fld",
                    value: this.state.mode_of_payment,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: variableJson.MODE_OF_PAYMENT
                    },
                    onChange: texthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        mode_of_payment: null
                      });
                    }
                  }}
                />
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
    banks: state.banks,
    subdepartment: state.subdepartment,
    companyaccount: state.companyaccount
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBanks: AlgaehActions,
      getCompanyAccount: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OfficalDetails)
);
