import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./EmployeeMaster.css";
import CommissionSetup from "./CommissionSetup/CommissionSetup";
import PersonalDetails from "./PersonalDetails/PersonalDetails";
import FamilyAndIdentification from "./FamilyAndIdentification/FamilyAndIdentification";
import DeptUserDetails from "./DeptUserDetails/DeptUserDetails";
import PayRollDetails from "./PayRollDetails/PayRollDetails";
import OfficalDetails from "./OfficalDetails/OfficalDetails";
import RulesDetails from "./RulesDetails/RulesDetails";

import { AlgaehLabel, AlgaehModalPopUp } from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
// import MyContext from "../../../../utils/MyContext";
import Enumerable from "linq";
import EmpMasterIOputs from "../../../../Models/EmployeeMaster";
import { getCookie } from "../../../../utils/algaehApiCall";
import { InsertUpdateEmployee } from "./EmployeeMasterEvents";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";

class EmployeeMaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageDisplay: "PersonalDetails",
      personalDetails: {},
      department_and_other: {},
      payroll: {}
    };
  }

  openTab(e) {
    var specified = e.currentTarget.getAttribute("algaehtabs");

    if (specified === "CommissionSetup") {
      AlgaehLoader({ show: true });
    }
    var element = document.querySelectorAll("[algaehtabs]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");

    this.setState({
      pageDisplay: specified
    });
  }

  SideMenuBarOpen(sidOpen) {
    this.setState({
      sidBarOpen: sidOpen
    });
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
    let IOputs = EmpMasterIOputs.inputParam();

    this.setState({
      pageDisplay: "PersonalDetails",
      ...IOputs
    });
  };

  componentDidMount() {
    // let IOputs = EmpMasterIOputs.inputParam();
    // this.setState(IOputs);

    let prevLang = getCookie("Language");

    let IOputs = EmpMasterIOputs.inputParam();
    IOputs.selectedLang = prevLang;

    this.setState({
      personalDetails: {
        ...IOputs,
        ...this.props.employeeDetailsPop
      }
    });

    if (
      this.props.subdepartment === undefined ||
      this.props.subdepartment.length === 0
    ) {
      this.props.getSubDepartment({
        uri: "/department/get/subdepartment",
        module: "masterSettings",
        data: {
          sub_department_status: "A"
        },
        method: "GET",
        redux: {
          type: "SUB_DEPT_GET_DATA",
          mappingName: "subdepartment"
        }
      });
    }

    // if (
    //   this.props.userdrtails === undefined ||
    //   this.props.userdrtails.length === 0
    // ) {
    this.props.getUserDetails({
      uri: "/algaehappuser/selectLoginUser",
      method: "GET",
      redux: {
        type: "USER_DETAILS_GET_DATA",
        mappingName: "userdrtails"
      }
    });
    // }
    if (
      this.props.empservicetype === undefined ||
      this.props.empservicetype.length === 0
    ) {
      this.props.getServiceTypes({
        uri: "/serviceType",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVIES_TYPES_GET_DATA",
          mappingName: "empservicetype"
        }
      });
    }
    if (
      this.props.empservices === undefined ||
      this.props.empservices.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "empservices"
        }
      });
    }

    if (
      this.props.countries === undefined ||
      this.props.countries.length === 0
    ) {
      this.props.getCountries({
        uri: "/masters/get/countryStateCity",
        method: "GET",
        redux: {
          type: "CTRY_GET_DATA",
          mappingName: "countries"
        }
      });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.editEmployee) {
      let IOputs = newProps.employeeDetailsPop;
      IOputs.Applicable = IOputs.isdoctor === "Y" ? true : false;
      IOputs.samechecked = IOputs.same_address === "Y" ? true : false;
      this.setState(
        {
          personalDetails: { ...this.state.personalDetails, ...IOputs }
        },
        () => {
          if (this.state.personalDetails.present_country_id === null) return;
          if (
            this.state.personalDetails.present_country_id !==
            newProps.present_country_id
          ) {
            let country = Enumerable.from(this.props.countries)
              .where(
                w =>
                  w.hims_d_country_id ===
                  this.state.personalDetails.present_country_id
              )
              .firstOrDefault();

            let states = country !== undefined ? country.states : [];
            if (this.props.countries !== undefined && states.length !== 0) {
              if (
                newProps.present_state_id !==
                this.state.personalDetails.present_state_id
              ) {
                let cities = Enumerable.from(states)
                  .where(
                    w =>
                      w.hims_d_state_id ===
                      this.state.personalDetails.present_state_id
                  )
                  .firstOrDefault();
                if (cities !== undefined) {
                  this.updateEmployeeTabs({
                    countrystates: states,
                    cities: cities.cities,
                    precountrystates: states,
                    precities: cities.cities,
                    present_cities: cities.cities,
                    present_state_id: this.state.personalDetails
                      .present_state_id,
                    present_city_id: this.state.personalDetails.present_city_id
                  });
                } else {
                  this.updateEmployeeTabs({
                    countrystates: states,
                    precountrystates: states,
                    // present_cities: cities.cities,
                    present_state_id: this.state.personalDetails
                      .present_state_id
                  });
                }
              }
            }
          }
        }
      );
    } else {
      this.setState({
        personalDetails: { ...EmpMasterIOputs.inputParam() }
      });
    }
  }
  updateEmployeeTabs(options) {
    this.setState({
      personalDetails: {
        ...this.state.personalDetails,
        ...options
      }
    });
  }

  render() {
    return (
      <div className="hims_employee_master">
        <AlgaehModalPopUp
          open={this.props.open}
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.open}
        >
          <div className="hims_employee_master">
            <div className="popupInner" style={{ height: "75vh" }}>
              <div className="tab-container toggle-section">
                {this.state.personalDetails.hims_d_employee_id !== null ? (
                  <ul className="nav">
                    <li
                      algaehtabs={"PersonalDetails"}
                      className={"nav-item tab-button active"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            fieldName: "personal_details"
                          }}
                        />
                      }
                    </li>

                    <li
                      algaehtabs={"OfficalDetails"}
                      className={"nav-item tab-button"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Official Details"
                          }}
                        />
                      }
                    </li>
                    <li
                      algaehtabs={"DeptUserDetails"}
                      className={"nav-item tab-button"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            fieldName: "deptuser_details"
                          }}
                        />
                      }
                    </li>

                    <li
                      algaehtabs={"PayRollDetails"}
                      className={"nav-item tab-button"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Payroll Details"
                          }}
                        />
                      }
                    </li>
                    {this.state.personalDetails.isdoctor === "Y" ? (
                      <li
                        algaehtabs={"CommissionSetup"}
                        className={"nav-item tab-button"}
                        onClick={this.openTab.bind(this)}
                      >
                        {
                          <AlgaehLabel
                            label={{
                              fieldName: "commission_setup"
                            }}
                          />
                        }
                      </li>
                    ) : null}
                    <li
                      algaehtabs={"FamilyAndIdentification"}
                      className={"nav-item tab-button"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Family & Identification Details"
                          }}
                        />
                      }
                    </li>

                    <li
                      algaehtabs={"RulesDetails"}
                      className={"nav-item tab-button"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Rules Details"
                          }}
                        />
                      }
                    </li>
                  </ul>
                ) : (
                  <ul className="nav">
                    <li
                      algaehtabs={"PersonalDetails"}
                      className={"nav-item tab-button active"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            fieldName: "personal_details"
                          }}
                        />
                      }
                    </li>

                    <li
                      algaehtabs={"OfficalDetails"}
                      className={"nav-item tab-button"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Official Details"
                          }}
                        />
                      }
                    </li>

                    <li
                      algaehtabs={"DeptUserDetails"}
                      className={"nav-item tab-button disableLi"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            fieldName: "deptuser_details"
                          }}
                        />
                      }
                    </li>

                    <li
                      algaehtabs={"PayRollDetails"}
                      className={"nav-item tab-button disableLi"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Payroll Details"
                          }}
                        />
                      }
                    </li>
                    {this.state.isdoctor === "Y" ? (
                      <li
                        algaehtabs={"CommissionSetup"}
                        className={"nav-item tab-button disableLi"}
                        onClick={this.openTab.bind(this)}
                      >
                        {
                          <AlgaehLabel
                            label={{
                              fieldName: "commission_setup"
                            }}
                          />
                        }
                      </li>
                    ) : null}
                    <li
                      algaehtabs={"FamilyAndIdentification"}
                      className={"nav-item tab-button disableLi"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Family & Identification Details"
                          }}
                        />
                      }
                    </li>

                    <li
                      algaehtabs={"RulesDetails"}
                      className={"nav-item tab-button disableLi"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Rules Details"
                          }}
                        />
                      }
                    </li>
                  </ul>
                )}
              </div>
              {/* <MyContext.Provider
                  value={{
                    state: this.state,
                    updateState: obj => {
                      this.setState({ ...obj });
                    }
                  }}
                > */}
              <div className="employee-section">
                {this.state.pageDisplay === "PersonalDetails" ? (
                  <PersonalDetails EmpMasterIOputs={this} />
                ) : this.state.pageDisplay === "OfficalDetails" ? (
                  <OfficalDetails EmpMasterIOputs={this} />
                ) : this.state.pageDisplay === "DeptUserDetails" ? (
                  <DeptUserDetails EmpMasterIOputs={this} />
                ) : this.state.pageDisplay === "PayRollDetails" ? (
                  <PayRollDetails EmpMasterIOputs={this} />
                ) : this.state.pageDisplay === "CommissionSetup" ? (
                  <CommissionSetup EmpMasterIOputs={this} />
                ) : this.state.pageDisplay === "FamilyAndIdentification" ? (
                  <FamilyAndIdentification EmpMasterIOputs={this} />
                ) : this.state.pageDisplay === "RulesDetails" ? (
                  <RulesDetails EmpMasterIOputs={this} />
                ) : null}
              </div>
              {/* </MyContext.Provider> */}
            </div>

            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4"> &nbsp;</div>

                  <div className="col-lg-8">
                    <button
                      // onClick={() => {}}
                      onClick={InsertUpdateEmployee.bind(this, this)}
                      type="button"
                      className="btn btn-primary"
                      disabled={
                        this.props.employee_status === "I" ? true : false
                      }
                    >
                      {this.state.personalDetails.hims_d_employee_id ===
                      null ? (
                        <AlgaehLabel label={{ fieldName: "btnSave" }} />
                      ) : (
                        <AlgaehLabel label={{ fieldName: "btnUpdate" }} />
                      )}
                    </button>
                    <button
                      onClick={e => {
                        this.onClose(e);
                      }}
                      type="button"
                      className="btn btn-default"
                    >
                      <AlgaehLabel label={{ fieldName: "btnCancel" }} />
                    </button>
                    {/* <button
                        onClick={ClearEmployee.bind(this, this)}
                        type="button"
                        className="btn btn-other"
                      >
                        <AlgaehLabel label={{ fieldName: "btn_clear" }} />
                      </button> */}
                  </div>
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
    userdrtails: state.userdrtails,
    empservicetype: state.empservicetype,
    empservices: state.empservices,
    servicetypelist: state.servicetypelist,
    subdepartment: state.subdepartment,
    servTypeCommission: state.servTypeCommission,
    serviceComm: state.serviceComm,
    countries: state.countries
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUserDetails: AlgaehActions,
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions,
      getSubDepartment: AlgaehActions,
      getDoctorServiceTypeCommission: AlgaehActions,
      getDoctorServiceCommission: AlgaehActions,
      getCountries: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EmployeeMaster)
);
