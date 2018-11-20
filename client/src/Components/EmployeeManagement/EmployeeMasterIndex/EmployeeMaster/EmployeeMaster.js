import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./EmployeeMaster.css";

import CommissionSetup from "./CommissionSetup/CommissionSetup";
import PersonalDetails from "./PersonalDetails/PersonalDetails";
import { AlgaehLabel, Modal } from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import MyContext from "../../../../utils/MyContext";

import EmpMasterIOputs from "../../../../Models/EmployeeMaster";
import { getCookie } from "../../../../utils/algaehApiCall";
import { InsertUpdateEmployee, ClearEmployee } from "./EmployeeMasterEvents";

class EmployeeMaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageDisplay: "PersonalDetails"
    };
  }

  componentWillMount() {
    let IOputs = EmpMasterIOputs.inputParam();
    this.setState(IOputs);
  }

  openTab(e) {
    var element = document.querySelectorAll("[algaehtabs]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    var specified = e.currentTarget.getAttribute("algaehtabs");
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
    let IOputs = EmpMasterIOputs.inputParam();
    // this.setState(IOputs);
    this.setState(
      {
        pageDisplay: "PersonalDetails",
        ...IOputs
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };

  componentDidMount() {
    let prevLang = getCookie("Language");

    let IOputs = EmpMasterIOputs.inputParam();
    IOputs.selectedLang = prevLang;
    this.setState(IOputs);

    this.props.getSubDepartment({
      uri: "/department/get/subdepartment",
      data: {
        sub_department_status: "A"
      },
      method: "GET",
      redux: {
        type: "SUB_DEPT_GET_DATA",
        mappingName: "subdepartment"
      }
    });

    this.props.getUserDetails({
      uri: "/algaehappuser/selectAppUsers",
      method: "GET",
      redux: {
        type: "USER_DETAILS_GET_DATA",
        mappingName: "userdrtails"
      }
    });

    this.props.getServiceTypes({
      uri: "/serviceType",
      method: "GET",
      redux: {
        type: "SERVIES_TYPES_GET_DATA",
        mappingName: "servicetype"
      }
    });

    this.props.getServiceTypes({
      uri: "/serviceType",
      method: "GET",
      redux: {
        type: "SERVIES_TYPES_GET_DATA",
        mappingName: "servicetypelist"
      }
    });

    this.props.getServices({
      uri: "/serviceType/getService",
      method: "GET",
      redux: {
        type: "SERVICES_GET_DATA",
        mappingName: "services"
      }
    });

    this.props.getServices({
      uri: "/serviceType/getService",
      method: "GET",
      redux: {
        type: "SERVICES_GET_DATA",
        mappingName: "serviceslist"
      }
    });

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
    if (
      newProps.employeeDetailsPop.hims_d_employee_id !== undefined &&
      this.state.full_name !== null
    ) {
      let IOputs = newProps.employeeDetailsPop;
      this.setState({ ...this.state, ...IOputs });
    } else {
      let IOputs = EmpMasterIOputs.inputParam();
      this.setState(IOputs);
    }
  }

  render() {
    return (
      <div className="hims_employee_master">
        <Modal
          className="model-set"
          open={this.props.open}
          style={{ width: "100%" }}
        >
          <div className="algaeh-modal">
            <div className="hims_employee_master">
              <div className="popupHeader">
                <div className="row">
                  <div className="col-lg-8">
                    <h4>{this.props.HeaderCaption}</h4>
                  </div>
                  <div className="col-lg-4">
                    <button
                      type="button"
                      className=""
                      onClick={e => {
                        this.onClose(e);
                      }}
                    >
                      <i className="fas fa-times-circle" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="popupInner" style={{ height: "75vh" }}>
                <div className="tab-container toggle-section">
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
                  </ul>
                </div>
                <MyContext.Provider
                  value={{
                    state: this.state,
                    updateState: obj => {
                      this.setState({ ...obj });
                    }
                  }}
                >
                  <div className="employee-section">
                    {this.state.pageDisplay === "PersonalDetails" ? (
                      <PersonalDetails EmpMasterIOputs={this.state} />
                    ) : this.state.pageDisplay === "CommissionSetup" ? (
                      <CommissionSetup EmpMasterIOputs={this.state} />
                    ) : null}
                  </div>
                </MyContext.Provider>
              </div>

              <div className="popupFooter">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-4"> &nbsp;</div>

                    <div className="col-lg-8">
                      <button
                        onClick={InsertUpdateEmployee.bind(this, this)}
                        type="button"
                        className="btn btn-primary"
                      >
                        {this.state.hims_d_employee_id === null ? (
                          <AlgaehLabel label={{ fieldName: "btnSave" }} />
                        ) : (
                          <AlgaehLabel label={{ fieldName: "btnUpdate" }} />
                        )}
                      </button>
                      <button
                        onClick={ClearEmployee.bind(this, this)}
                        type="button"
                        className="btn btn-default"
                      >
                        <AlgaehLabel label={{ fieldName: "btn_clear" }} />
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userdrtails: state.userdrtails,
    servicetype: state.servicetype,
    services: state.services,
    serviceslist: state.serviceslist,
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

      // /get/subdepartment
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
