import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./EmployeeMaster.css";

import CommissionSetup from "./CommissionSetup/CommissionSetup";
import PersonalDetails from "./PersonalDetails/PersonalDetails";
import DeptUserDetails from "./DeptUserDetails/DeptUserDetails";

import { AlgaehLabel, Modal } from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import MyContext from "../../../../utils/MyContext";
import AHSnackbar from "../../../common/Inputs/AHSnackbar";
import EmpMasterIOputs from "../../../../Models/EmployeeMaster";
import { getCookie } from "../../../../utils/algaehApiCall";
import { InsertUpdateEmployee } from "./EmployeeMasterEvents";

class EmployeeMaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageDisplay: "PersonalDetails",
      sidBarOpen: true
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

  componentDidMount() {
    let prevLang = getCookie("Language");

    let IOputs = EmpMasterIOputs.inputParam();
    IOputs.selectedLang = prevLang;
    this.setState(IOputs);
  }

  SideMenuBarOpen(sidOpen) {
    this.setState({
      sidBarOpen: sidOpen
    });
  }

  onClose = e => {
    this.setState(
      {
        pageDisplay: "PersonalDetails"
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };

  componentDidMount() {
    this.props.getSubDepartment({
      uri: "/department/get/subdepartment",
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
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  componentWillReceiveProps(newProps) {
    debugger;
    if (newProps.employeeDetailsPop.hims_d_employee_id !== undefined) {
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
        <Modal className="model-set" open={this.props.open}>
          <div className="hims_employee_master">
            <div className="algaeh-modal" style={{ width: "100%" }}>
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

              <div className="popupInner">
                <div className="tab-container toggle-section">
                  <ul className="nav">
                    <li
                      algaehtabs={"PersonalDetails"}
                      style={{ marginRight: 2 }}
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
                      style={{ marginRight: 2 }}
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
                    <li
                      style={{ marginRight: 2 }}
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
                    ) : this.state.pageDisplay === "DeptUserDetails" ? (
                      <DeptUserDetails EmpMasterIOputs={this.state} />
                    ) : null}
                  </div>
                  {/*  */}
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
                        onClick={e => {
                          this.onClose(e);
                        }}
                        type="button"
                        className="btn btn-default"
                      >
                        Cancel
                      </button>
                      <AHSnackbar
                        open={this.state.open}
                        handleClose={this.handleClose}
                        MandatoryMsg={this.state.MandatoryMsg}
                      />
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
    subdepartment: state.subdepartment
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUserDetails: AlgaehActions,
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions,
      getSubDepartment: AlgaehActions

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
